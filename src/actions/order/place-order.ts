"use server";

import { auth } from "@/auth.config";
import type { Address, Size } from "@/interfaces";
import prisma from "@/lib/prisma";

interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size;
}

export const placeOrder = async (
  productIds: ProductToOrder[],
  address: Address
) => {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return {
      ok: false,
      message: "No hay sesión de usuario",
    };
  }

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds.map((p) => p.productId),
      },
    },
  });

  const itemsInOrder = productIds.reduce(
    (count, prod) => count + prod.quantity,
    0
  );

  const { subTotal, tax, total } = productIds.reduce(
    (totals, item) => {
      const productQuantity = item.quantity;
      const product = products.find((product) => product.id === item.productId);

      if (!product) throw new Error(`${item.productId} does not exist`);

      const subTotal = product.price * productQuantity;

      totals.subTotal += subTotal;
      totals.tax += subTotal * 0.15;
      totals.total += subTotal * 1.15;

      return totals;
    },
    { subTotal: 0, tax: 0, total: 0 }
  );

  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      // Update stock data
      const updatedProductsPromises = products.map(async (product) => {
        const productQuantity = productIds
          .filter((p) => p.productId === product.id)
          .reduce((acc, item) => item.quantity + acc, 0);

        if (productQuantity === 0)
          throw new Error(`${product.id} no tiene cantidad definida`);

        return tx.product.update({
          where: { id: product.id },
          data: {
            inStock: {
              decrement: productQuantity,
            },
          },
        });
      });

      const updatedProducts = await Promise.all(updatedProductsPromises);

      updatedProducts.forEach((product) => {
        if (product.inStock < 0) throw new Error(`Sin stock: ${product.title}`);
      });

      // Create a new order object and detail
      const order = await tx.order.create({
        data: {
          userId: userId,
          itemsInOrder: itemsInOrder,
          subTotal: subTotal,
          tax: tax,
          total: total,
        },
      });

      for (const p of productIds) {
        await tx.orderItem.create({
          data: {
            quantity: p.quantity,
            size: p.size,
            productId: p.productId,
            price:
              products.find((product) => product.id === p.productId)?.price ??
              0,
            orderId: order.id,
          },
        });
      }

      // Create order address
      const orderAddress = await tx.orderAddress.create({
        data: {
          name: address.name,
          email: address.email,
          address: address.address,
          address2: address.address2,
          zipCode: address.zipCode,
          city: address.city,
          phone: address.phone,
          countryId: address.country,
          orderId: order.id,
        },
      });

      return {
        order: order,
        address: orderAddress,
        updatedProducts: [],
        orderAddress: {},
      };
    });

    return {
      ok: true,
      order: prismaTx.order,
    };
  } catch (error: any) {
    return {
      ok: false,
      message: error.message,
    };
  }
};

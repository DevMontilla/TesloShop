"use client";

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import {
  CreateOrderData,
  CreateOrderActions,
  OnApproveActions,
  OnApproveData,
} from "@paypal/paypal-js";
import { paypalCheckPayment, placeOrder } from "@/actions";
import { useAddressStore, useCartStore } from "@/store";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  orderId?: string;
  // amount: number;
}

export const PayPalButton = ({orderId}: Props) => {
  /** */
  const router = useRouter()
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const address = useAddressStore((state) => state.address);
  const [errorMessage, setErrorMessage] = useState(false);

  const randomOrderId = uuidv4();
  
  const productsToOrder = cart.map((product) => ({
    productId: product.id,
    quantity: product.quantity,
    size: product.size,
    price: product.price,
  }));

  // TODO: calcular desde el back
  const { subTotal, tax, total } = productsToOrder.reduce(
    (totals, item) => {
      const productQuantity = item.quantity;
      const subTotal = item.price * productQuantity;

      totals.subTotal += subTotal;
      totals.tax += subTotal * 0.15;
      totals.total += subTotal * 1.15;

      return totals;
    },
    { subTotal: 0, tax: 0, total: 0 }
  );
  /** */

  const [{ isPending }] = usePayPalScriptReducer();

  const roundedAmount = Math.round(total * 100) / 100;

  if (isPending)
    return (
      <div className="animate-pulse">
        <div className="h-11 bg-gray-300 rounded"></div>
        <div className="h-11 bg-gray-300 rounded mt-3"></div>
      </div>
    );

  const createOrder = async (
    data: CreateOrderData,
    actions: CreateOrderActions
  ): Promise<string> => {
    const transaction_id = await actions.order.create({
      intent: "CAPTURE",
      purchase_units: [
        {
          // invoice_id: orderId,
          invoice_id: randomOrderId,
          amount: {
            currency_code: "USD",
            value: `${roundedAmount}`,
          },
        },
      ],
    });

    localStorage.setItem('transaction-id',transaction_id);
    return transaction_id;
  };

  const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
    const details = await actions.order?.capture();
    if (!details) return;

    const resp = await placeOrder(
      productsToOrder,
      address,
      randomOrderId,
      localStorage.getItem('transaction-id')
    );


    await localStorage.removeItem('transaction_id')
    await clearCart()

    await paypalCheckPayment(details.id);
    router.replace(`/orders/${resp.order.id}`)
  };

  return (
    <div className="relative z-0">
      {errorMessage && (
        <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
      )}
      <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
    </div>
  );
};

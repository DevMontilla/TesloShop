"use client";

import { getStockBySlug } from "@/actions";
import { QuantitySelector, SizeSelector, StockLabel } from "@/components";
import type { CartProduct, Product, Size } from "@/interfaces";
import { useCartStore } from "@/store";
import clsx from "clsx";
import React, { useEffect, useState } from "react";

interface Props {
  product: Product;
  slug: string;
}

export const AddToCart = ({ product, slug }: Props) => {
  const addProductToCart = useCartStore((state) => state.addProductToCart);
  const [size, setSize] = useState<Size | undefined>();
  const [quantity, setQuantity] = useState<number>(1);
  const [posted, setPosted] = useState<boolean>(false);
  const [stock, setStock] = useState(0);

  // TODO: crear hook para obtener el stock
  useEffect(() => {
    const getStock = async () => {
      const inStock = await getStockBySlug(slug);
      setStock(inStock);
    };
    getStock();
  }, [slug]);

  const addToCart = () => {
    setPosted(true);
    if (!size) return;

    // console.log({ size, quantity, product });
    const cartProduct: CartProduct = {
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      quantity: quantity,
      size: size,
      image: product.images[0],
    };
    addProductToCart(cartProduct);
    setPosted(false);
    setQuantity(1);
    setSize(undefined);
  };

  return (
    <>
      <SizeSelector
        selectedSize={size}
        availableSizes={product.sizes}
        onSizeChanged={setSize}
      />
      <QuantitySelector quantity={quantity} onQuantityChanged={setQuantity} />
      {posted && !size && (
        <p className="text-red-500 text-sm mt-2 ">* Selecccione una talla</p>
      )}
      <button
        onClick={() => addToCart()}
        className={clsx("my-5", {
          "mt-2 mb-5": posted && !size,
          "btn-disabled": !stock,
          "btn-primary": stock,
        })}
        disabled={!stock}
      >
        Agregar al carrito
      </button>
    </>
  );
};

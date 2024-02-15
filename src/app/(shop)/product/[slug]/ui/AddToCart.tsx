"use client";

import { QuantitySelector, SizeSelector, StockLabel } from "@/components";
import type { CartProduct, Product, Size } from "@/interfaces";
import { useCartStore } from "@/store";
import clsx from "clsx";
import React, { useState } from "react";

interface Props {
  product: Product;
}

export const AddToCart = ({ product }: Props) => {
  const addProductToCart = useCartStore((state) => state.addProductToCart);
  const [size, setSize] = useState<Size | undefined>();
  const [quantity, setQuantity] = useState<number>(1);
  const [posted, setPosted] = useState<boolean>(false);

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
        className={clsx("btn-primary my-5", {
          "mt-2 mb-5": posted && !size,
        })}
      >
        Agregar al carrito
      </button>
    </>
  );
};

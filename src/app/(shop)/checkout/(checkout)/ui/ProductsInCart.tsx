"use client";

import Image from "next/image";
import { useCartStore } from "@/store";
import { useEffect, useState } from "react";
import { currencyFormat } from "@/utils";
import { redirect } from "next/navigation";

export const ProductsInCart = () => {
  const [loaded, setLoaded] = useState(false);
  const productsInCart = useCartStore((state) => state.cart);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) {
    return <p>Loading...</p>;
  }

  if (productsInCart.length === 0) redirect("/empty");

  return (
    <>
      {productsInCart.map((product) => (
        <div key={`${product.slug}-${product.size}`} className="flex mb-5">
          <Image
            src={`/products/${product.image}`}
            width={130}
            height={100}
            alt={product.title}
            className="mr-5 rounded"
          />
          <div>
            <span>
              <p>{product.title}</p>
            </span>
            <p className="text-xs">
              Talle: {product.size} ({product.quantity})
            </p>
            <p className="text-xs">Precio por unidad: {currencyFormat(product.price)}</p>
            <p className="font-bold">
              Total: {currencyFormat(product.price * product.quantity)}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};

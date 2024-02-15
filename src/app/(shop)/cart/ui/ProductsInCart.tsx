"use client";

import Image from "next/image";
import { useCartStore } from "@/store";
import { QuantitySelector } from "@/components";
import { useEffect, useState } from "react";
import Link from "next/link";
import { currencyFormat } from "@/utils";
import { redirect } from "next/navigation";

export const ProductsInCart = () => {
  const [loaded, setLoaded] = useState(false);
  const productsInCart = useCartStore((state) => state.cart);
  const updateProductInCartQuantity = useCartStore(
    (state) => state.updateProductQuantity
  );
  const removeProductInCart = useCartStore((state) => state.removeProduct);

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
            width={120}
            height={100}
            alt={product.title}
            className="mr-5 rounded"
          />
          <div>
            <Link
              className="hover:underline cursor-pointer"
              href={`/product/${product.slug}`}
            >
              <p>{product.title}</p>
            </Link>
            <p className="text-xs">Talle: {product.size}</p>
            <p>{currencyFormat(product.price)}</p>
            <QuantitySelector
              quantity={product.quantity}
              onQuantityChanged={(quantity) =>
                updateProductInCartQuantity(product, quantity)
              }
            />
            <button
              className="underline mt-3"
              onClick={() => removeProductInCart(product)}
            >
              Remover
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

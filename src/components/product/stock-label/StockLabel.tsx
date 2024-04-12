"use client";

import { getStockBySlug } from "@/actions";
import { titleFont } from "@/config/fonts";
import { useEffect, useState } from "react";

interface Props {
  slug: string;
}

export const StockLabel = ({ slug }: Props) => {
  const [stock, setStock] = useState(0);

  useEffect(() => {
    const getStock = async () => {
      const inStock = await getStockBySlug(slug);
      setStock(inStock);
    };
    getStock();
  }, [slug]);

  return (
    <>
      {!stock ? (
        <h1
          className={`${titleFont.className} antialiased font-bold text-xs animate-pulse bg-gray-200 w-16 rounded`}
        >
          &nbsp;
        </h1>
      ) : (
        <h1 className={`${titleFont.className} antialiased font-bold text-xs`}>
          Stock: {stock}
        </h1>
      )}
    </>
  );
};

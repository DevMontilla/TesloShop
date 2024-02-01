export const revalidate = 60

import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { Gender } from "@prisma/client";
import { notFound, redirect } from "next/navigation";

interface Props {
  params: {
    gender?: string;
  };
  searchParams: {
    page?: string;
  };
}

interface Translation {
  men: string;
  women: string;
  kid: string;
  unisex: string;
}

const translation: Translation = {
  men: "Hombre",
  women: "Mujer",
  kid: "Niño",
  unisex: "Unisex",
};

export default async function GenderPage({ params, searchParams }: Props) {
  const { gender } = params;
  const validGenders: Gender[] = ["men", "women", "kid", "unisex"];

  if (!validGenders.includes(gender as Gender)) {
    notFound();
  }

  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const { products, totalPages } = await getPaginatedProductsWithImages({
    page,
    gender: gender as Gender,
  });

  if (products.length === 0) {
    redirect(`/gender/${gender}`);
  }

  return (
    <>
      <Title
        title={translation[gender as keyof Translation]}
        subtitle={`Articulos pensados para ${translation[
          gender as keyof Translation
        ].toLowerCase()}`}
        className="mb-2"
      />
      <ProductGrid products={products} />
      <Pagination totalPages={totalPages} />
    </>
  );
}

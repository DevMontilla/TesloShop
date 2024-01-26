import { ProductGrid, Title } from "@/components";
import { initialData } from "@/seed/seed";
import { notFound } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

type Gender = "men" | "women" | "kid" | "unisex";

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

export default function ({ params }: Props) {
  const { id } = params;
  const validGenders: Gender[] = ["men", "women", "kid", "unisex"];

  if (!validGenders.includes(id as Gender)) {
    notFound();
  }

  const products = initialData.products.filter((product) => {
    if (id === "men") {
      return product.gender === "men" || product.gender === "unisex"
    } else if (id === "women") {
      return product.gender === "women" || product.gender === "unisex";
    }
    return product.gender === id;
  });

  return (
    <>
      <Title
        title={translation[id as keyof Translation]}
        subtitle={`Articulos pensados para ${translation[
          id as keyof Translation
        ].toLowerCase()}`}
        className="mb-2"
      />
      <ProductGrid products={products} />
    </>
  );
}

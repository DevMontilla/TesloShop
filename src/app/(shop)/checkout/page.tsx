import { QuantitySelector, Title } from "@/components";
import { initialData } from "@/seed/seed";
import Image from "next/image";
import Link from "next/link";

const productsInCart = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2],
];

export default function () {
  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title="Checkout" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <div className="flex flex-col mt-5">
            <span className="text-xl">Verifica tus productos</span>
            <Link href={"/cart"} className="underline mb-5">
              Agregar productos
            </Link>
            {productsInCart.map((product) => (
              <div key={product.slug} className="flex mb-5 items-center">
                <Image
                  src={`/products/${product.images[0]}`}
                  width={120}
                  height={100}
                  alt={product.title}
                  className="mr-5 rounded"
                />
                <div>
                  <p>{product.title}</p>
                  <p>$ {product.price} x 3</p>
                  <p className="font-bold">Subtotal: $ {product.price * 3}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl shadow-xl p-7">
            <h2 className="text-2xl mb-2">Dirección de entrega</h2>
            <div className="mb-10">
              <p className="text-xl">Daniel Montilla</p>
              <p>Av. Siempre Viva 123</p>
              <p>Bogotá, Cundinamarca</p>
              <p>CP 5519</p>
              <p>123.123.123</p>
            </div>

            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

            <h2 className="text-2xl mb-2">Resumen de orden</h2>
            <div className="grid grid-cols-2">
              <span>No. Productos</span>
              <span className="text-right">3 artículos</span>

              <span>Subtotal</span>
              <span className="text-right">$ 100</span>

              <span>Impuestos (15%)</span>
              <span className="text-right">$ 15</span>

              <span className="mt-5 text-2xl">Total:</span>
              <span className="mt-5 text-2xl text-right">$ 115</span>
            </div>
            <div className="mt-5 mb-5 w-full">
              <div className="mb-5">
                <span className="text-xs">
                  Al hacer clic en "Confirmar", aceptas nuestros{" "}
                  <a href="#" className="underline">
                    términos y condiciones
                  </a>
                {" "}y{" "}
                <a href="#" className="underline">
                  políticas de privacidad
                </a>
                </span>
              </div>

              <Link
                className="btn-primary flex justify-center"
                href={"/orders/123"}
              >
                Confirmar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

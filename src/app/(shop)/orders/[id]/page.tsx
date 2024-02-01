import { QuantitySelector, Title } from "@/components";
import { initialData } from "@/seed/seed";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { IoCardOutline } from "react-icons/io5";

const productsInCart = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2],
];

interface Props {
  params: {
    id: string;
  };
}

export default function OrdersIdPage({ params }: Props) {
  const { id } = params;

  // TODO: Verificar ID
  // redirect(/)

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title={`Orden #${id}`} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <div className="flex flex-col mt-5">
            <div
              className={clsx(
                "flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
                {
                  "bg-red-500": false,
                  "bg-green-600": true,
                }
              )}
            >
              <IoCardOutline size={30} />
              {/* <span className="mx-2">Pago pendiente</span> */}
              <span className="mx-2">Pago confirmado</span>
            </div>
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
              <div
                className={clsx(
                  "flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
                  {
                    "bg-red-500": false,
                    "bg-green-600": true,
                  }
                )}
              >
                <IoCardOutline size={30} />
                {/* <span className="mx-2">Pago pendiente</span> */}
                <span className="mx-2">Pago confirmado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

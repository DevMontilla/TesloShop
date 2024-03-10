import { getOrderById } from "@/actions";
import { OrderStatus, PayPalButton, Title } from "@/components";
import Image from "next/image";
import { currencyFormat } from "@/utils";
import { redirect } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

export default async function OrdersIdPage({ params }: Props) {
  const { id } = params;
  // TODO: Verificar ID

  // TODO: call server action
  const { ok, order } = await getOrderById(id);

  if (!ok) {
    redirect("/");
  }

  const address = order!.OrderAddress;

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title={`Orden # ${order.id.split("-").at(-1)}`} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <div className="flex flex-col mt-5">
            <OrderStatus isPaid={order.isPaid ?? false} />
            {order!.OrderItem.map((item) => (
              <div key={item.product.slug} className="flex mb-5 items-center">
                <Image
                  src={`/products/${item.product.images[0].url}`}
                  width={120}
                  height={100}
                  alt={item.product.title}
                  className="mr-5 rounded"
                />
                <div>
                  <p>{item.product.title}</p>
                  <p>
                    {currencyFormat(item.price)} x {item.quantity}
                  </p>
                  <p className="font-bold">
                    Subtotal: {currencyFormat(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl shadow-xl p-7">
            <h2 className="text-2xl mb-2">Dirección de entrega</h2>
            <div className="mb-10">
              <p className="text-xl">{address.name}</p>
              <p>{address.address}</p>
              <p>
                {address.city}, {address.countryId}
              </p>
              <p>CP {address.zipCode}</p>
              <p>{address.phone}</p>
            </div>

            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

            <h2 className="text-2xl mb-2">Resumen de orden</h2>
            <div className="grid grid-cols-2">
              <span>No. Productos</span>
              <span className="text-right">
                {order.OrderItem.reduce((acc, item) => item.quantity + acc, 0)}{" "}
                artículos
              </span>

              <span>Subtotal</span>
              <span className="text-right">
                {currencyFormat(order.subTotal)}
              </span>

              <span>Impuestos (15%)</span>
              <span className="text-right">{currencyFormat(order.tax)}</span>

              <span className="mt-5 text-2xl">Total:</span>
              <span className="mt-5 text-2xl text-right">
                {currencyFormat(order.total)}
              </span>
            </div>
            <div className="mt-5 mb-5 w-full">
              {order?.isPaid ? (
                <OrderStatus isPaid={order.isPaid} />
              ) : (
                <PayPalButton amount={order!.total} orderId={order!.id} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

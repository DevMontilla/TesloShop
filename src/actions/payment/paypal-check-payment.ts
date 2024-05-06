"use server";

import { PayPalOrderStatusResponse } from "@/interfaces";
import prisma from "@/lib/prisma";
import { revalidatePath,  } from "next/cache";

export const paypalCheckPayment = async (paypalTransactionId) => {
  const authToken = await getPaypalBearerToken();

  if (!authToken)
    return {
      ok: false,
      message: "No se pudo obtener token de verificacion de paypal",
    };

  const resp = await verifyPayPalPayment(paypalTransactionId, authToken);

  if (!resp) {
    return {
      ok: false,
      message: "Error al verificar el pago",
    };
  }

  const { status, purchase_units } = resp;
  const { invoice_id: orderId } = purchase_units[0];

  if (status !== "COMPLETED") {
    return {
      ok: false,
      message: "Aún no se ha completado el pago en PayPal",
    };
  }

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
      },
    });

    revalidatePath(`orders/${orderId}`);

    return {
      ok: true,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Status: 500 - No se pudo realizar el pago en PayPal",
    };
  }
};

const getPaypalBearerToken = async (): Promise<string | null> => {
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const PAYPAL_SECRET_KEY = process.env.PAYPAL_SECRET_KEY;

  const base64Token = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET_KEY}`,
    "utf-8"
  ).toString("base64");

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("Authorization", `Basic ${base64Token}`);

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
  };

  try {
    const result = await fetch(process.env.PAYPAL_OAUTH_URL, {
      ...requestOptions,
      cache: "no-store",
    }).then((response) => response.json());
    return result.access_token;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const verifyPayPalPayment = async (
  paypalTransactionId: string,
  bearerToken: string
): Promise<PayPalOrderStatusResponse | null> => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${bearerToken}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  try {
    const result = await fetch(
      `${process.env.PAYPAL_ORDERS_URL}/${paypalTransactionId}`,
      {
        ...requestOptions,
        cache: "no-store",
      }
    ).then((response) => response.json());
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

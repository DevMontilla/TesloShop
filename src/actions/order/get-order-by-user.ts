"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getOrderByUser = async () => {
  
  // TODO: Add pagination

  const session = await auth();

  if (!session.user)
    return {
      ok: false,
      message: "Please login",
    };

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      OrderAddress: {
        select: {
          name: true,
        },
      },
    },
  });

  return {
    ok: true,
    orders,
  };
};

"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth.config";

interface PaginationOptions {
  page?: number;
  take?: number;
}

export const getPaginatedUsers = async ({
  page = 1,
  take = 10,
}: PaginationOptions) => {
  const session = await auth();

  if (session.user.role !== "admin")
    return {
      ok: false,
      message: "You must be an administrator user",
    };

  if (isNaN(Number(page))) page = 1;
  if (page < 1) page = 1;

  if (isNaN(Number(take))) take = 10;
  if (take < 1) take = 10;

  try {
    const users = await prisma.user.findMany({
      take,
      skip: (page - 1) * take,
      orderBy: {
        name: "desc",
      },
    });

    const totalPages = Math.ceil(users.length / take);

    return {
      ok: true,
      currentPage: page,
      totalPages,
      users,
    };
  } catch (error) {
    throw new Error("Error: " + error.message);
  }
};

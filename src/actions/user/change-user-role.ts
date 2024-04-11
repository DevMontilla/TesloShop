"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const changeUserRole = async (userId: string, role: string) => {
  const session = auth();

  if ((await session).user.role !== "admin") {
    return {
      ok: false,
      message: "You must be admin.",
    };
  }

  try {
    const newRole = role === "admin" ? "admin" : "user";

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: newRole,
      },
    });

    revalidatePath("/admin/users");

    return {
      ok: true,
      message: "User's role successfully changed."
    };
  } catch (error) {
    return {
      ok: false,
      message: "Could not update the role.",
    };
  }
};

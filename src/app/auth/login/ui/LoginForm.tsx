"use client";

import { authenticate } from "@/actions";
import clsx from "clsx";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { IoInformationCircleOutline } from "react-icons/io5";

export const LoginForm = () => {
  // const router = useRouter();
  const [status, dispatch] = useFormState(authenticate, undefined);

  useEffect(() => {
    if (status === "Success") {
      // router.replace("/");
      window.location.replace('/')
    }
  }, [status]);

  return (
    <form action={dispatch} className="flex flex-col">
      <label htmlFor="email">Correo electrónico</label>
      <input
        className="px-5 py-2 border bg-gray-200 rounded mb-5"
        type="email"
        name="email"
      />

      <label htmlFor="password">Contraseña</label>
      <input
        className="px-5 py-2 border bg-gray-200 rounded mb-5"
        type="password"
        name="password"
      />

      {status === "Invalid credentials." && (
        <div className="flex flex-row mb-4">
          <IoInformationCircleOutline className="h-5 w-5 text-red-500" />
          <p className="text-sm text-red-500">Email o contraseña incorrectas</p>
        </div>
      )}

      <LoginButton />

      {/* divisor l ine */}
      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-gray-500"></div>
        <div className="px-2 text-gray-800">O</div>
        <div className="flex-1 border-t border-gray-500"></div>
      </div>

      <Link href="/auth/new-account" className="btn-secondary text-center">
        Crear una nueva cuenta
      </Link>
    </form>
  );
};

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={clsx({
        "btn-primary": !pending,
        "btn-disabled": pending,
      })}
      disabled={pending}
    >
      Ingresar
    </button>
  );
}

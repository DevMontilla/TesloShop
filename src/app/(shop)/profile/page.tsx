import { auth } from "@/auth.config";
import { Title } from "@/components";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div>
      <Title title="Perfil" />
      <div className="flex -space-x-1 overflow-hidden justify-center my-4">
        <img
          className="inline-block h-32 w-32 rounded-full ring-2 ring-white"
          src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt=""
        />
      </div>
        <p className="flex justify-center font-semibold">{session.user.name}</p>
        <p className="flex justify-center">{session.user.email}</p>
        {/* <pre>{JSON.stringify(session.user, null, 2)}</pre> */}
    </div>
  );
}

import { Footer, Sidebar, TopMenu } from "@/components";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s - Teslo | Shop",
    default: "Home ",
  },
  description: "Una tienda virtual de productos",
};

export default function ShoopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="min-h-screen">
        <TopMenu />
        <Sidebar />
        <div className="px-0 sm:px-10">{children}</div>
      </main>
      <Footer />
    </>
  );
}

import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = false;

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  return {
    title: "MIXDM Moda Feminina",
    alternates: {
      canonical: "/",
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

/**
 * A página individual de produto foi removida.
 * Qualquer acesso a /produto/[id] é redirecionado para a home.
 */
export default async function ProdutoRedirect({
  params,
}: {
  params: { id: string };
}) {
  redirect("/");
}

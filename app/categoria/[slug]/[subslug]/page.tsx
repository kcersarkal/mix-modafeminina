import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/supabase-products";
import { categoryLabelForSlug } from "@/lib/categories";
import { getSubcategory } from "@/lib/subcategories";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: { slug: string; subslug: string };
}): Promise<Metadata> {
  const subcategory = getSubcategory(params.slug, params.subslug);

  if (!subcategory) {
    return {
      title: "Subcategoria não encontrada",
    };
  }

  return {
    title: subcategory.title,
    description: subcategory.description,
    alternates: {
      canonical: `/categoria/${params.slug}/${params.subslug}`,
    },
  };
}

export default async function SubcategoryPage({
  params,
}: {
  params: { slug: string; subslug: string };
}) {
  const subcategory = getSubcategory(params.slug, params.subslug);

  if (!subcategory) {
    notFound();
  }

  const categoryLabel = categoryLabelForSlug(params.slug);

  if (!categoryLabel) {
    notFound();
  }

  const products = await getProducts({
    category: params.slug,
    search: subcategory.keywords[0],
    limit: 60,
    offset: 0,
  });

  return (
    <div className="wrap" style={{ paddingTop: 32, paddingBottom: 80 }}>
      <nav className="breadcrumb" style={{ padding: 0 }} aria-label="Trilha">
        <Link href="/">Início</Link>
        {" / "}
        <Link href={`/categoria/${params.slug}`}>{categoryLabel}</Link>
        {" / "}
        <span>{subcategory.label}</span>
      </nav>

      <header style={{ marginTop: 28, marginBottom: 24 }}>
        <h1 style={{ fontSize: "clamp(28px, 4vw, 38px)" }}>
          {subcategory.title}
        </h1>

        <p
          style={{
            color: "var(--ink-soft)",
            fontSize: 14,
            marginTop: 8,
          }}
        >
          {products.length > 0
            ? `${products.length} produto${
                products.length !== 1 ? "s" : ""
              } encontrado${products.length !== 1 ? "s" : ""}.`
            : "Nenhum produto disponível no momento."}
        </p>
      </header>

      {products.length > 0 ? (
        <div className="product-grid" style={{ paddingTop: 8 }}>
          {products.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>Nenhuma oferta disponível</h2>
          <p>Estamos atualizando nossas ofertas. Volte em breve!</p>
        </div>
      )}

      <section
        style={{
          marginTop: 56,
          paddingTop: 32,
          borderTop: "1px solid var(--line)",
        }}
      >
        <h2>{subcategory.heading}</h2>

        <p
          style={{
            marginTop: 16,
            color: "var(--ink-soft)",
            lineHeight: 1.7,
          }}
        >
          {subcategory.description}
        </p>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import FilterControls from "@/components/FilterControls";
import {
  getProducts,
  getProductsCount,
  resolveCategoryNames,
} from "@/lib/supabase-products";
import { normalizeOrder } from "@/lib/product-filters";
import { categoryLabelForSlug } from "@/lib/categories";
import { getCategorySeo } from "@/lib/category-seo";
import { getSubcategoriesForCategory } from "@/lib/subcategories";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 300;

const PAGE_SIZE = 60;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const slug = params.slug;
  const names = await resolveCategoryNames(slug);
  const label = categoryLabelForSlug(slug) ?? names?.[0];

  if (!names || !label) {
    return { title: "Categoria não encontrada" };
  }

  const seo = getCategorySeo(slug);

  const description =
    seo?.description ??
    `Confira as melhores ofertas de ${label.toLowerCase()} selecionadas pela MIXDM Moda Feminina.`;

  return {
    title: seo?.title ?? `Ofertas de ${label}`,
    description,
    alternates: {
      canonical: `/categoria/${slug}`,
    },
    openGraph: {
      title: seo?.title
        ? `${seo.title} — MIXDM Moda Feminina`
        : `Ofertas de ${label} — MIXDM Moda Feminina`,
      description,
      type: "website",
      url: `/categoria/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.title
        ? `${seo.title} — MIXDM Moda Feminina`
        : `Ofertas de ${label} — MIXDM Moda Feminina`,
      description,
    },
  };
}

export default async function CategoriaPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: {
    pagina?: string;
    ordem?: string;
  };
}) {
  const slug = params.slug;
  const names = await resolveCategoryNames(slug);

  if (!names) {
    notFound();
  }

  const label = categoryLabelForSlug(slug) ?? names[0];
  const seo = getCategorySeo(slug);
  const subcategories = getSubcategoriesForCategory(slug);
  const ordem = normalizeOrder(searchParams.ordem);

  const rawPage = Number(searchParams.pagina);
  const requestedPage =
    Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;

  const totalCount = await getProductsCount({
    category: slug,
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);

  const products = await getProducts({
    category: slug,
    order: ordem,
    limit: PAGE_SIZE,
    offset: (currentPage - 1) * PAGE_SIZE,
  });

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Início",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: label,
        item: absoluteUrl(`/categoria/${slug}`),
      },
    ],
  };

  return (
    <div
      className="wrap"
      style={{
        paddingTop: 32,
        paddingBottom: 80,
      }}
    >
      <JsonLd data={breadcrumbJsonLd} />

      <nav
        className="breadcrumb"
        style={{ padding: 0 }}
        aria-label="Trilha"
      >
        <Link href="/">Início</Link> / <span>{label}</span>
      </nav>

      <header
        style={{
          marginTop: 28,
          marginBottom: 24,
        }}
      >
        <h1
          style={{
            fontSize: "clamp(28px, 4vw, 38px)",
          }}
        >
          Ofertas de {label}
        </h1>

        <p
          style={{
            color: "var(--ink-soft)",
            fontSize: 14,
            marginTop: 8,
          }}
        >
          {totalCount > 0
            ? `${totalCount} produto${
                totalCount !== 1 ? "s" : ""
              } ativo${totalCount !== 1 ? "s" : ""} nesta categoria.`
            : "Nenhum produto ativo nesta categoria no momento."}
        </p>
      </header>

      {subcategories.length > 0 && (
        <nav
          aria-label={`Tipos de ${label}`}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 24,
          }}
        >
          {subcategories.map((subcategory) => (
            <Link
              key={subcategory.slug}
              href={`/categoria/${slug}/${subcategory.slug}`}
              style={{
                display: "inline-block",
                padding: "9px 14px",
                border: "1px solid var(--line)",
                borderRadius: 999,
                color: "var(--ink)",
                textDecoration: "none",
                fontSize: 14,
              }}
            >
              {subcategory.label}
            </Link>
          ))}
        </nav>
      )}

      <FilterControls
        basePath={`/categoria/${slug}`}
        ordem={ordem}
      />

      {products.length > 0 ? (
        <div
          className="product-grid"
          style={{
            paddingTop: 8,
          }}
        >
          {products.map((product) => (
            <ProductCard
              key={product.productId}
              product={product}
            />
          ))}
        </div>
      ) : ordem ? (
        <p
          style={{
            color: "var(--ink-muted)",
            gridColumn: "1/-1",
            textAlign: "center",
            padding: "40px 0",
          }}
        >
          Nenhuma oferta nesse filtro no momento.
        </p>
      ) : (
        <div className="empty-state">
          <h2>Nenhuma oferta ativa nesta categoria</h2>
          <p>Estamos atualizando nossas ofertas. Volte em breve!</p>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          basePath={`/categoria/${slug}`}
          currentPage={currentPage}
          totalPages={totalPages}
          ordem={ordem}
        />
      )}

      {seo && (
        <section
          style={{
            marginTop: 56,
            paddingTop: 32,
            borderTop: "1px solid var(--line)",
          }}
        >
          <h2>{seo.heading}</h2>

          {seo.paragraphs.map((paragraph, index) => (
            <p
              key={index}
              style={{
                marginTop: index === 0 ? 16 : 12,
                color: "var(--ink-soft)",
                lineHeight: 1.7,
              }}
            >
              {paragraph}
            </p>
          ))}
        </section>
      )}
    </div>
  );
}

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
import {
  normalizeOrder,
  normalizePriceRange,
} from "@/lib/product-filters";
import { categoryLabelForSlug } from "@/lib/categories";
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

  const description = `Confira as melhores ofertas de ${label.toLowerCase()} selecionadas pela MIXDM Moda Feminina. Vestidos, calçados, bolsas e muito mais.`;

  return {
    title: `Ofertas de ${label}`,
    description,
    alternates: { canonical: `/categoria/${slug}` },
    openGraph: {
      title: `Ofertas de ${label} — MIXDM Moda Feminina`,
      description,
      type: "website",
      url: `/categoria/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `Ofertas de ${label} — MIXDM Moda Feminina`,
      description,
    },
  };
}

export default async function CategoriaPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { pagina?: string; preco?: string; ordem?: string };
}) {
  const slug = params.slug;
  const names = await resolveCategoryNames(slug);

  if (!names) notFound();

  const label = categoryLabelForSlug(slug) ?? names[0];
  const preco = normalizePriceRange(searchParams.preco);
  const ordem = normalizeOrder(searchParams.ordem);

  const rawPage = Number(searchParams.pagina);
  const requestedPage = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;

  const totalCount = await getProductsCount({ category: slug, priceRange: preco });
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);

  const products = await getProducts({
    category: slug,
    priceRange: preco,
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
    <div className="wrap" style={{ paddingTop: 32, paddingBottom: 80 }}>
      <JsonLd data={breadcrumbJsonLd} />

      <nav className="breadcrumb" style={{ padding: 0 }} aria-label="Trilha">
        <Link href="/">Início</Link> / <span>{label}</span>
      </nav>

      <header style={{ marginTop: 28, marginBottom: 24 }}>
        <h1 style={{ fontSize: "clamp(28px, 4vw, 38px)" }}>
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
            ? `${totalCount} produto${totalCount !== 1 ? "s" : ""} ativo${
                totalCount !== 1 ? "s" : ""
              } nesta categoria.`
            : "Nenhum produto ativo nesta categoria no momento."}
        </p>
      </header>

      <FilterControls
        basePath={`/categoria/${slug}`}
        preco={preco}
        ordem={ordem}
      />

      {products.length > 0 ? (
        <div className="product-grid" style={{ paddingTop: 8 }}>
          {products.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      ) : preco || ordem ? (
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
      preco={preco}
      ordem={ordem}
    />
  )}

  {slug === "vestidos" && (
    <section
      style={{
        marginTop: 56,
        paddingTop: 32,
        borderTop: "1px solid var(--line)",
      }}
    >
      <h2>Vestidos femininos para diferentes estilos e ocasiões</h2>

      <p style={{ marginTop: 16, color: "var(--ink-soft)", lineHeight: 1.7 }}>
        Encontre vestidos femininos selecionados entre as ofertas disponíveis,
        com opções para diferentes estilos, ocasiões e faixas de preço. A
        seleção é atualizada regularmente para reunir modelos que estão
        disponíveis no momento.
      </p>

      <p style={{ marginTop: 12, color: "var(--ink-soft)", lineHeight: 1.7 }}>
        Entre as opções podem aparecer vestidos midi, longos, curtos, casuais,
        para festa e outros modelos. Compare preços e escolha a opção que mais
        combina com o seu estilo antes de acessar a oferta.
      </p>
    </section>
  )}
    </div>
  );
}

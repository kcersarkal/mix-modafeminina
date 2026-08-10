import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import ProductShareButtons from "@/components/ProductShareButtons";
import { getProductById } from "@/lib/supabase-products";
import {
  fmtPrice,
  generateSummary,
  starFillWidth,
} from "@/lib/product-helpers";
import { categoryLabelForSlug } from "@/lib/categories";
import { absoluteUrl } from "@/lib/site";
import type { ProductDisplay } from "@/types/product";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = await getProductById(params.id);

  if (!product) {
    return { title: "Oferta não encontrada" };
  }

  const description =
    product.description ||
    `${product.name} — oferta selecionada pela MIXDM Moda Feminina.`;

  return {
    title: product.name,
    description,
    alternates: {
      canonical: `/produto/${product.productId}`,
    },
    openGraph: {
      title: product.name,
      description,
      type: "website",
      url: `/produto/${product.productId}`,
      images: [product.image],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: [product.image],
    },
  };
}

function buildProductJsonLd(product: ProductDisplay) {
  const productUrl = absoluteUrl(`/produto/${product.productId}`);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.name,
    image: [product.image].filter(Boolean),
    category: product.category,
    url: productUrl,
    // Somente dados confirmados. Sem avaliações, reviews, estoque, marca,
    // seller, frete, cupom ou disponibilidade inventados.
    offers:
      product.priceCurrent != null
        ? {
            "@type": "Offer",
            url: productUrl,
            price: product.priceCurrent,
            priceCurrency: "BRL",
            priceValidUntil: new Date(Date.now() + 30 * 864e5)
              .toISOString()
              .slice(0, 10),
          }
        : undefined,
  };
}

function buildBreadcrumbJsonLd(product: ProductDisplay) {
  const categoryLabel =
    categoryLabelForSlug(product.categorySlug) ?? product.category;

  return {
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
        name: categoryLabel,
        item: absoluteUrl(`/categoria/${product.categorySlug}`),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: absoluteUrl(`/produto/${product.productId}`),
      },
    ],
  };
}

export default async function ProdutoPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProductById(params.id);
  if (!product) notFound();

  const categoryLabel =
    categoryLabelForSlug(product.categorySlug) ?? product.category;
  const showTag = Boolean(
    product.tag && (!product.discount || product.discount <= 60),
  );
  const safeUrl = product.affiliateUrl || "#";

  return (
    <div className="product-detail-page">
      <JsonLd data={buildProductJsonLd(product)} />
      <JsonLd data={buildBreadcrumbJsonLd(product)} />

      <Link href="/" className="back-button" aria-label="Voltar">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M19 12H5M11 18l-6-6 6-6" />
        </svg>
        Voltar
      </Link>

      <nav className="breadcrumb" style={{ padding: 0, marginBottom: 16 }} aria-label="Trilha">
        <Link href="/">Início</Link> /{" "}
        <Link href={`/categoria/${product.categorySlug}`}>
          {categoryLabel}
        </Link>{" "}
        / <span>{product.name}</span>
      </nav>

      <div className="detail-card">
        <div className="detail-media">
          {showTag && <span className="detail-tag">{product.tag}</span>}
          {product.isInternational && (
            <span
              className="int-badge"
              style={{ position: "absolute", top: 50, left: 10 }}
            >
              🌎 Internacional
            </span>
          )}
          <img
            src={product.image}
            alt={`${product.name} — imagem`}
          />
        </div>
        <div className="detail-info">
          <span className="eyebrow">{categoryLabel}</span>
          <h1 className="detail-title">{product.name}</h1>
          <div className="detail-rating">
            <span className="stars-wrap" style={{ fontSize: 16 }}>
              ★★★★★
              <span
                className="stars-fill"
                style={{
                  width: starFillWidth(product.rating || 4.5),
                  fontSize: 16,
                }}
              >
                ★★★★★
              </span>
            </span>
            <span style={{ fontWeight: 600, fontSize: 15, color: "var(--ink)" }}>
              {(product.rating || 0).toFixed(1)}
            </span>
            <span style={{ color: "var(--ink-muted)", fontSize: 13 }}>
              ({product.reviewsCount || 0} avaliações)
            </span>
          </div>
          <div className="detail-price-block">
            <div className="price-row" style={{ gap: 14 }}>
              <span className="detail-price-now">
                R$ {fmtPrice(product.priceCurrent)}
              </span>
            </div>
          </div>
          <div className="detail-summary">{generateSummary(product)}</div>
          <div className="detail-actions">
            <a
              className="btn-primary btn-block"
              href={safeUrl}
              target="_blank"
              rel="nofollow sponsored noopener"
            >
              Comprar agora
            </a>
            <ProductShareButtons
              productId={product.productId}
              name={product.name}
              priceText={`R$ ${fmtPrice(product.priceCurrent)}`}
              discount={product.discount}
            />
          </div>
          <p className="detail-note">
            Preço e disponibilidade sujeitos a alteração pela loja parceira.
          </p>
          <div className="detail-disclosure">
            Links de afiliado Shopee — comissão sem alteração no preço.
          </div>
        </div>
      </div>
    </div>
  );
}

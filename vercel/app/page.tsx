import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import ProductCard from "@/components/ProductCard";
import HeroCarousel from "@/components/HeroCarousel";
import SpotlightCarousel from "@/components/SpotlightCarousel";
import FilterControls from "@/components/FilterControls";
import {
  getCategories,
  getProducts,
  getProductsCount,
  pickHeroSlides,
  pickSpotlightProducts,
} from "@/lib/supabase-products";
import { normalizeOrder } from "@/lib/product-filters";
import { generateSummary } from "@/lib/product-helpers";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const SITE_DESCRIPTION =
  "Curadoria de moda feminina com vestidos, calçados, bolsas e acessórios. Ofertas selecionadas em um só lugar.";

export default async function Home({
  searchParams,
}: {
  searchParams: { q?: string; ordem?: string };
}) {
  const query = (searchParams.q ?? "").trim();
  const ordem = normalizeOrder(searchParams.ordem);

  // Hero e destaque usam TODOS os produtos ativos,
  // independentemente dos filtros de ordenação aplicados ao grid.
  const [allProducts, products, categories, totalActiveCount] =
    await Promise.all([
      getProducts(),
      getProducts({
        search: query || undefined,
        order: ordem,
      }),
      getCategories(),
      getProductsCount(),
    ]);

  const heroSlides = pickHeroSlides(allProducts);
  const spotlightItems = pickSpotlightProducts(allProducts).map((product) => ({
    product,
    summary: generateSummary(product),
  }));

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "MIXDM Moda Feminina",
    alternateName: "MIXDM",
    url: absoluteUrl("/"),
    description: SITE_DESCRIPTION,
    inLanguage: "pt-BR",
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MIXDM Moda Feminina",
    alternateName: "MIXDM",
    url: absoluteUrl("/"),
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/logo_moda_feminina.jpg"),
    },
    sameAs: ["https://t.me/MixModaFeminina"],
  };

  return (
    <>
      <JsonLd data={websiteJsonLd} />
      <JsonLd data={organizationJsonLd} />

      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <span className="eyebrow">Moda Feminina Selecionada</span>
            <h1>
              As melhores ofertas de
              <br />
              moda feminina em um só lugar.
            </h1>
            <p className="lead">
              Vestidos, calçados e bolsas escolhidos a dedo, com ofertas
              reunidas em um só lugar para facilitar a sua escolha.
            </p>
            <a
              href="https://t.me/MixModaFeminina"
              target="_blank"
              rel="noopener"
              className="telegram-hero-btn"
              aria-label="Grupo do Telegram"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.9-6.12c.73-.33 1.43.18 1.15 1.3l-2.7 12.76c-.2.86-.7 1.07-1.42.67l-3.92-2.89-1.89 1.82c-.2.2-.37.37-.73.37z" />
              </svg>
              Grupo no Telegram
            </a>
          </div>
          <HeroCarousel slides={heroSlides} />
        </div>
      </section>

      {spotlightItems.length > 0 && (
        <SpotlightCarousel items={spotlightItems} />
      )}

      <div className="section-heading" id="ofertas">
        <div className="section-heading-top">
          <h2>Todas as ofertas</h2>
          <span className="count">
            {query
              ? `${products.length} de ${totalActiveCount} ofertas`
              : `${totalActiveCount} ofertas ativas`}
          </span>
        </div>
        <form action="/" method="get" className="search-wrap" role="search">
          {ordem && <input type="hidden" name="ordem" value={ordem} />}
          <input
            className="search-input"
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Buscar produtos..."
            aria-label="Buscar produtos"
            autoComplete="off"
          />
          <button type="submit" className="search-btn">
            Buscar
          </button>
        </form>
      </div>

      <div className="filter-bar">
        <Link href="/" className="filter-chip">
          Todas
        </Link>
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/categoria/${category.slug}`}
            className="filter-chip"
          >
            {category.name}
          </Link>
        ))}
      </div>

      <FilterControls basePath="/" ordem={ordem} q={query || undefined} />

      {totalActiveCount === 0 ? (
        <div className="empty-state">
          <h2>Nenhuma oferta ativa no momento</h2>
          <p>Estamos atualizando nossas ofertas. Volte em breve!</p>
        </div>
      ) : products.length > 0 ? (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      ) : (
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
      )}

      <section className="editorial" aria-labelledby="sobre-mixdm">
        <div className="editorial-inner">
          <div>
            <span className="eyebrow" style={{ color: "var(--cream)" }}>
              Sobre a MIXDM
            </span>
            <h2 id="sobre-mixdm">
              Curadoria de moda feminina, com carinho em cada detalhe
            </h2>
            <p>
              Reunimos ofertas de vestidos, calçados e bolsas em um só lugar,
              para você economizar tempo e ter sempre um look pronto para
              qualquer ocasião.
            </p>
            <Link href="/#ofertas" className="btn-ghost">
              Ver todas as ofertas
            </Link>
          </div>
          <div className="editorial-visual">
            <img
              src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=600&auto=format&fit=crop"
              alt="Editorial de moda"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </>
  );
}

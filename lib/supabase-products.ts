import { supabase } from "./supabase";
import { categoryLabelForSlug, slugifyCategory } from "./categories";
import { discountPercent } from "./product-helpers";
import type { OrderOption } from "./product-filters";
import type { Category, ProductDisplay, ProductRow } from "@/types/product";

/**
 * Camada de dados do MIXDM Moda Feminina — tabela REAL `produtos`.
 *
 * Regra de produto ativo: `last_checked_at` dentro das últimas
 * 72 horas (MAX_HOURS_STALE).
 */
export const MAX_HOURS_STALE = 72;

function freshCutoff(): string {
  return new Date(Date.now() - MAX_HOURS_STALE * 3600000).toISOString();
}

export interface ProductQueryOptions {
  /** Slug da categoria (ex.: "calcados"). */
  category?: string;
  search?: string;

  /** Faixa de preço: ate_50 | 50_100 | 100_200 | 200_mais. */
  priceRange?: string;

  limit?: number;
  offset?: number;
  order?: OrderOption;
}

function toDisplay(row: ProductRow): ProductDisplay {
  return {
    id: row.id,
    productId: row.external_id || String(row.id),
    name: row.name,
    category: row.category,
    categorySlug: slugifyCategory(row.category),
    priceCurrent: row.price_current,
    priceOriginal: row.price_original,
    image: row.image,
    description: row.description,
    rating: row.rating,
    reviewsCount: row.reviews_count,
    affiliateUrl: row.affiliate_url,
    tag: row.tag,
    discount: discountPercent(row.tag),
    isInternational: Boolean(
      row.is_international || (row.tag || "").includes("🌎"),
    ),
    spotlight: Boolean(row.spotlight),
    lastCheckedAt: row.last_checked_at,
  };
}

/**
 * Categorias ativas, deduplicadas pelo slug.
 * Para exibição usa o nome bonito definido em categories.ts.
 */
export async function getCategories(): Promise<Category[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("produtos")
    .select("category")
    .gte("last_checked_at", freshCutoff());

  if (error) {
    console.error("Erro ao carregar categorias:", error);
    return [];
  }

  const seen = new Map<string, string>();

  for (const row of data as { category: string | null }[]) {
    const name = row.category?.trim();

    if (!name) continue;

    const slug = slugifyCategory(name);

    if (!seen.has(slug)) {
      seen.set(slug, name);
    }
  }

  return [...seen.entries()]
    .map(([slug, name]) => ({
      slug,
      name: categoryLabelForSlug(slug) ?? name,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}

/**
 * Retorna os nomes REAIS gravados no banco que correspondem ao slug.
 *
 * Exemplo:
 * slug "calcas" pode encontrar "Calcas" e "Calças".
 *
 * Isso evita usar o rótulo bonito "Calças" para consultar registros
 * que no banco estão salvos como "Calcas".
 */
export async function resolveCategoryNames(
  slug: string,
): Promise<string[] | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("produtos")
    .select("category")
    .gte("last_checked_at", freshCutoff());

  if (error) {
    console.error("Erro ao resolver nomes da categoria:", error);
    return null;
  }

  const names = [
    ...new Set(
      (data as { category: string | null }[])
        .map((row) => row.category?.trim())
        .filter((name): name is string => Boolean(name))
        .filter((name) => slugifyCategory(name) === slug),
    ),
  ];

  return names.length > 0 ? names : null;
}

/**
 * Aplica faixa de preço em price_current.
 */
function applyPriceRange(query: any, priceRange?: string): any {
  switch (priceRange) {
    case "ate_50":
      return query.lte("price_current", 50);

    case "50_100":
      return query.gt("price_current", 50).lte("price_current", 100);

    case "100_200":
      return query.gt("price_current", 100).lte("price_current", 200);

    case "200_mais":
      return query.gt("price_current", 200);

    default:
      return query;
  }
}

export async function getProducts(
  options: ProductQueryOptions = {},
): Promise<ProductDisplay[]> {
  if (!supabase) return [];

  let query: any = supabase
    .from("produtos")
    .select("*")
    .gte("last_checked_at", freshCutoff());

  if (options.category) {
    const names = await resolveCategoryNames(options.category);

    if (!names) return [];

    query = query.in("category", names);
  }

  const searchTerm = options.search?.trim();

  if (searchTerm) {
    query = query.ilike("name", `%${searchTerm}%`);
  }

  query = applyPriceRange(query, options.priceRange);

  // Maior desconto usa o percentual extraído da tag,
  // portanto precisa ordenar depois de carregar os produtos.
  const needsClientSideSort = options.order === "maior_desconto";

  if (!needsClientSideSort) {
    if (options.order === "menor_preco") {
      query = query.order("price_current", { ascending: true });
    } else if (options.order === "melhor_avaliacao") {
      query = query.order("rating", { ascending: false });
    } else {
      query = query
        .order("spotlight", { ascending: false })
        .order("rating", { ascending: false });
    }

    if (options.limit && options.limit > 0) {
      const start =
        options.offset && options.offset > 0 ? options.offset : 0;

      query = query.range(start, start + options.limit - 1);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error("Erro ao carregar produtos:", error);
    return [];
  }

  let products = (data as ProductRow[]).map(toDisplay);

  if (needsClientSideSort) {
    products.sort((a, b) => (b.discount || 0) - (a.discount || 0));

    if (options.offset || options.limit) {
      const start =
        options.offset && options.offset > 0 ? options.offset : 0;

      products = products.slice(
        start,
        options.limit ? start + options.limit : undefined,
      );
    }
  }

  return products;
}

export async function getProductsCount(
  options: ProductQueryOptions = {},
): Promise<number> {
  if (!supabase) return 0;

  let query: any = supabase
    .from("produtos")
    .select("id", { count: "exact", head: true })
    .gte("last_checked_at", freshCutoff());

  if (options.category) {
    const names = await resolveCategoryNames(options.category);

    if (!names) return 0;

    query = query.in("category", names);
  }

  const searchTerm = options.search?.trim();

  if (searchTerm) {
    query = query.ilike("name", `%${searchTerm}%`);
  }

  query = applyPriceRange(query, options.priceRange);

  const { count, error } = await query;

  if (error) {
    console.error("Erro ao contar produtos:", error);
    return 0;
  }

  return count ?? 0;
}

export async function getProductById(
  id: string,
): Promise<ProductDisplay | null> {
  if (!supabase) return null;

  // 1) Tenta pelo external_id real.
  const { data, error } = await supabase
    .from("produtos")
    .select("*")
    .gte("last_checked_at", freshCutoff())
    .eq("external_id", id)
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar produto:", error);
    return null;
  }

  if (data) {
    return toDisplay(data as ProductRow);
  }

  // 2) Fallback pelo id numérico do Supabase.
  if (/^\d+$/.test(id)) {
    const { data: byId, error: errorById } = await supabase
      .from("produtos")
      .select("*")
      .gte("last_checked_at", freshCutoff())
      .eq("id", Number(id))
      .maybeSingle();

    if (errorById) {
      console.error("Erro ao buscar produto por id:", errorById);
      return null;
    }

    return byId ? toDisplay(byId as ProductRow) : null;
  }

  return null;
}

/**
 * Produtos de uma categoria.
 */
export async function getProductsByCategory(
  slug: string,
  options: {
    limit?: number;
    offset?: number;
    priceRange?: string;
    order?: OrderOption;
  } = {},
): Promise<ProductDisplay[]> {
  return getProducts({
    category: slug,
    ...options,
  });
}

/**
 * Produto mais barato de cada categoria.
 */
export function pickSpotlightProducts(
  products: ProductDisplay[],
): ProductDisplay[] {
  const byCategory = new Map<string, ProductDisplay>();

  for (const p of products) {
    if (p.priceCurrent == null) continue;

    const current = byCategory.get(p.category);

    if (
      !current ||
      (p.priceCurrent ?? Infinity) < (current.priceCurrent ?? Infinity)
    ) {
      byCategory.set(p.category, p);
    }
  }

  return [...byCategory.values()];
}

/**
 * Maior desconto de cada categoria para os slides do hero.
 */
export function pickHeroSlides(
  products: ProductDisplay[],
): ProductDisplay[] {
  const byCategory = new Map<string, ProductDisplay>();

  for (const p of products) {
    if (p.priceCurrent == null || !p.image) continue;

    const current = byCategory.get(p.category);

    if (
      !current ||
      (p.discount || 0) > (current.discount || 0)
    ) {
      byCategory.set(p.category, p);
    }
  }

  return [...byCategory.values()];
}

/**
 * Última atualização do catálogo.
 */
export async function getLatestUpdate(): Promise<string | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("produtos")
    .select("last_checked_at")
    .gte("last_checked_at", freshCutoff())
    .order("last_checked_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return (data as { last_checked_at: string }).last_checked_at;
}

import { supabase } from "./supabase";
import { categoryLabelForSlug, slugifyCategory } from "./categories";
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
    image: row.image,
    description: row.description,
    rating: row.rating,
    reviewsCount: row.reviews_count,
    sales: row.sales != null ? Number(row.sales) : null,
    affiliateUrl: row.affiliate_url,
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

  if (options.order === "melhor_avaliacao") {
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

  const { data, error } = await query;

  if (error) {
    console.error("Erro ao carregar produtos:", error);
    return [];
  }

  return (data as ProductRow[]).map(toDisplay);
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

  const { count, error } = await query;

  if (error) {
    console.error("Erro ao contar produtos:", error);
    return 0;
  }

  return count ?? 0;
}

/**
 * Produtos de uma categoria.
 */
export async function getProductsByCategory(
  slug: string,
  options: {
    limit?: number;
    offset?: number;
    order?: OrderOption;
  } = {},
): Promise<ProductDisplay[]> {
  return getProducts({
    category: slug,
    ...options,
  });
}

/**
 * Produtos spotlight (por categoria, com maior avaliação).
 */
export function pickSpotlightProducts(
  products: ProductDisplay[],
): ProductDisplay[] {
  const byCategory = new Map<string, ProductDisplay>();

  for (const p of products) {
    const current = byCategory.get(p.category);

    if (!current || (p.rating || 0) > (current.rating || 0)) {
      byCategory.set(p.category, p);
    }
  }

  return [...byCategory.values()];
}

/**
 * Slides do hero — produtos spotlight com imagem.
 */
export function pickHeroSlides(
  products: ProductDisplay[],
): ProductDisplay[] {
  return pickSpotlightProducts(products).filter((p) => p.image);
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

/**
 * Tipos reais da tabela `produtos` do Supabase (MIXDM Moda Feminina).
 * Espelham exatamente o schema em supabase_schema.sql — nada é inventado.
 */

export type ProductSource = "shopee" | "mercadolivre";

/** Linha crua vinda da tabela `produtos`. */
export interface ProductRow {
  id: number;
  source: ProductSource;
  external_id: string | null;
  name: string;
  category: string;
  price_current: number | null;
  price_original: number | null;
  image: string;
  description: string | null;
  rating: number | null;
  reviews_count: number | null;
  affiliate_url: string | null;
  tag: string | null;
  is_international: boolean | null;
  spotlight: boolean | null;
  last_checked_at: string;
  created_at: string;
}

/** Produto já transformado para uso no frontend (server components). */
export interface ProductDisplay {
  /** PK BIGSERIAL real no Supabase. */
  id: number;
  /** Identificador usado nas URLs: external_id quando existir, senão o id. */
  productId: string;
  name: string;
  category: string;
  /** Slug da categoria (para links /categoria/[slug]). */
  categorySlug: string;
  image: string;
  description: string | null;
  rating: number | null;
  reviewsCount: number | null;
  affiliateUrl: string | null;
  isInternational: boolean;
  spotlight: boolean;
  lastCheckedAt: string;
}

/** Categoria com nome real + slug de URL. */
export interface Category {
  name: string;
  slug: string;
}

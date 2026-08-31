import type { Category } from "@/types/product";

/**
 * Categorias reais utilizadas pelo MIXDM Moda Feminina (mesmas do scraper,
 * do footer antigo e do seed). O scraper grava "Calcados"/"Calcas" sem
 * acento; o banco pode conter variações acentuadas ("Calçados"/"Calças").
 * Os slugs removem acentos, então ambos resolvem para a mesma URL.
 */

export const CATEGORIA_LABELS: Record<string, string> = {
  vestidos: "Vestidos",
  roupas: "Roupas",
  calcados: "Calçados",
  bolsas: "Bolsas",
  conjuntos: "Conjuntos",
  calcas: "Calças",
  fitness: "Fitness",
  saias: "Saias",
  shorts: "Shorts",
};

/** Lista canônica usada no rodapé (mesma ordem do site atual). */
export const CATEGORIAS_SITE: Category[] = [
  { name: "Conjuntos", slug: "conjuntos" },
  { name: "Calças", slug: "calcas" },
  { name: "Shorts", slug: "shorts" },
  { name: "Saias", slug: "saias" },
  { name: "Vestidos", slug: "vestidos" },
  { name: "Calçados", slug: "calcados" },
  { name: "Fitness", slug: "fitness" },
  { name: "Roupas", slug: "roupas" },
  { name: "Bolsas", slug: "bolsas" },
];

/** Converte o nome real da categoria em slug de URL. */
export function slugifyCategory(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Rótulo canônico para um slug (ex.: "calcados" -> "Calçados"). */
export function categoryLabelForSlug(slug: string): string | null {
  return CATEGORIA_LABELS[slug] ?? null;
}

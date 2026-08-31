/**
 * Filtros de preço e ordenação restaurados do site antigo (app.js).
 * Mesmos valores, rótulos e faixas do SPA original — agora via URL real.
 */

export interface FilterOption {
  value: string;
  label: string;
}

/** Valores válidos de ordenação (?ordem=). */
export type OrderOption =
  | "relevancia"
  | "menor_preco"
  | "maior_desconto"
  | "melhor_avaliacao";

/** Faixas de preço (mesmas do app.js antigo, baseadas em price_current). */
export const PRICE_RANGES: FilterOption[] = [
  { value: "todas", label: "Todos os Preços" },
  { value: "ate_50", label: "Até R$50" },
  { value: "50_100", label: "R$50 a R$100" },
  { value: "100_200", label: "R$100 a R$200" },
  { value: "200_mais", label: "Acima de R$200" },
];

/** Opções de ordenação (mesmas do app.js antigo). */
export const SORT_OPTIONS: FilterOption[] = [
  { value: "relevancia", label: "Relevância" },
  { value: "menor_preco", label: "Menor Preço" },
  { value: "maior_desconto", label: "Maior Desconto" },
  { value: "melhor_avaliacao", label: "Melhor Avaliação" },
];

export const PRICE_RANGE_VALUES = PRICE_RANGES.map((range) => range.value);
export const SORT_OPTION_VALUES = SORT_OPTIONS.map((option) => option.value);

/** Valida e normaliza o parâmetro ?preco= (valores inválidos viram "sem filtro"). */
export function normalizePriceRange(
  value: string | undefined,
): string | undefined {
  if (value === "todas") return undefined;
  return value && PRICE_RANGE_VALUES.includes(value) ? value : undefined;
}

/** Valida e normaliza o parâmetro ?ordem= (valores inválidos viram "relevância"). */
export function normalizeOrder(value: string | undefined): OrderOption | undefined {
  if (value === "relevancia") return undefined;
  return value && SORT_OPTION_VALUES.includes(value)
    ? (value as OrderOption)
    : undefined;
}

export interface FilterUrlOptions {
  q?: string;
  preco?: string;
  ordem?: string;
  pagina?: number;
}

/**
 * Monta a URL de filtro preservando os parâmetros ativos e omitindo os
 * valores padrão (preco=todas, ordem=relevancia, pagina=1).
 */
export function buildFilterUrl(
  basePath: string,
  options: FilterUrlOptions,
): string {
  const params = new URLSearchParams();

  if (options.q) params.set("q", options.q);
  if (options.preco && options.preco !== "todas") {
    params.set("preco", options.preco);
  }
  if (options.ordem && options.ordem !== "relevancia") {
    params.set("ordem", options.ordem);
  }
  if (options.pagina && options.pagina > 1) {
    params.set("pagina", String(options.pagina));
  }

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

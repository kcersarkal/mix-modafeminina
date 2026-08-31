/**
 * Filtros de ordenação — sem preços, sem descontos.
 * Apenas relevância e melhor avaliação.
 */

export interface FilterOption {
  value: string;
  label: string;
}

/** Valores válidos de ordenação (?ordem=). */
export type OrderOption = "relevancia" | "melhor_avaliacao";

/** Opções de ordenação. */
export const SORT_OPTIONS: FilterOption[] = [
  { value: "relevancia", label: "Relevância" },
  { value: "melhor_avaliacao", label: "Melhor Avaliação" },
];

export const SORT_OPTION_VALUES = SORT_OPTIONS.map((option) => option.value);

/** Valida e normaliza o parâmetro ?ordem= (valores inválidos viram "relevância"). */
export function normalizeOrder(
  value: string | undefined,
): OrderOption | undefined {
  if (value === "relevancia") return undefined;
  return value && SORT_OPTION_VALUES.includes(value)
    ? (value as OrderOption)
    : undefined;
}

export interface FilterUrlOptions {
  q?: string;
  ordem?: string;
  pagina?: number;
}

/**
 * Monta a URL de filtro preservando os parâmetros ativos e omitindo os
 * valores padrão (ordem=relevancia, pagina=1).
 */
export function buildFilterUrl(
  basePath: string,
  options: FilterUrlOptions,
): string {
  const params = new URLSearchParams();

  if (options.q) params.set("q", options.q);
  if (options.ordem && options.ordem !== "relevancia") {
    params.set("ordem", options.ordem);
  }
  if (options.pagina && options.pagina > 1) {
    params.set("pagina", String(options.pagina));
  }

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

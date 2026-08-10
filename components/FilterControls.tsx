import Link from "next/link";
import {
  PRICE_RANGES,
  SORT_OPTIONS,
  buildFilterUrl,
} from "@/lib/product-filters";

interface FilterControlsProps {
  basePath: string;
  preco?: string;
  ordem?: string;
  q?: string;
}

/**
 * Restaura os controles do site antigo (faixa de preço + ordenação), agora
 * como links reais (?preco=... / ?ordem=...) renderizados no servidor.
 * A busca (q) e os demais parâmetros são preservados ao trocar o filtro.
 */
export default function FilterControls({
  basePath,
  preco,
  ordem,
  q,
}: FilterControlsProps) {
  return (
    <>
      <div className="price-range-wrap">
        {PRICE_RANGES.map((range) => (
          <Link
            key={range.value}
            href={buildFilterUrl(basePath, {
              q,
              preco: range.value === "todas" ? undefined : range.value,
              ordem,
            })}
            className={`price-range-chip ${
              (preco || "todas") === range.value ? "active" : ""
            }`}
          >
            {range.label}
          </Link>
        ))}
      </div>

      <div className="sort-bar">
        {SORT_OPTIONS.map((option) => (
          <Link
            key={option.value}
            href={buildFilterUrl(basePath, {
              q,
              preco,
              ordem: option.value === "relevancia" ? undefined : option.value,
            })}
            className={`sort-chip ${
              (ordem || "relevancia") === option.value ? "active" : ""
            }`}
          >
            {option.label}
          </Link>
        ))}
      </div>
    </>
  );
}

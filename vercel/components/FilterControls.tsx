import Link from "next/link";
import { SORT_OPTIONS, buildFilterUrl } from "@/lib/product-filters";

interface FilterControlsProps {
  basePath: string;
  ordem?: string;
  q?: string;
}

/**
 * Controles de ordenação — sem filtros de preço/desconto.
 */
export default function FilterControls({
  basePath,
  ordem,
  q,
}: FilterControlsProps) {
  return (
    <div className="sort-bar">
      {SORT_OPTIONS.map((option) => (
        <Link
          key={option.value}
          href={buildFilterUrl(basePath, {
            q,
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
  );
}

import type { ProductDisplay } from "@/types/product";

/**
 * Formata quantidade de vendas.
 * Nota: o banco atual NÃO possui campo de vendas. Esta função ficará pronta
 * para uso quando o campo for adicionado futuramente.
 */
function formatSales(sales: number | null | undefined): string | null {
  if (sales == null || sales <= 0) return null;

  if (sales < 1000) return `+${sales} vendas`;

  const thousands = sales / 1000;
  const formatted = thousands % 1 === 0 ? `${thousands}` : `${thousands.toFixed(1).replace(/\.0$/, "")}`;
  return `+${formatted} mil vendas`;
}

/**
 * Formata avaliação no padrão pt-BR: 4.9 → "4,9"
 */
function formatRating(rating: number | null | undefined): string | null {
  if (rating == null || rating <= 0) return null;
  return rating.toFixed(1).replace(".", ",");
}

export default function ProductCard({
  product,
}: {
  product: ProductDisplay;
}) {
  const affiliateUrl = product.affiliateUrl || "#";
  const ratingText = formatRating(product.rating);
  // Campo de vendas não existe no banco atual — será nulo até ser adicionado
  const salesText = formatSales(null);

  const hasSocialProof = Boolean(ratingText || salesText);

  return (
    <article className="card">
      {/* Imagem clicável → link afiliado */}
      <a
        href={affiliateUrl}
        target="_blank"
        rel="nofollow sponsored noopener noreferrer"
        className="card-link"
        aria-label={`Ver oferta: ${product.name}`}
      >
        <div className="card-img">
          {product.isInternational && (
            <span className="int-badge">🌎 Internacional</span>
          )}
          <img src={product.image} alt={product.name} loading="lazy" />
        </div>
      </a>

      <div className="card-body">
        {/* Nome clicável → link afiliado */}
        <a
          href={affiliateUrl}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          className="card-title-link"
          aria-label={`Ver oferta: ${product.name}`}
        >
          <h3 className="card-title">{product.name}</h3>
        </a>

        {/* Prova social: rating + vendas */}
        {hasSocialProof && (
          <div className="card-social-proof">
            {ratingText && (
              <span className="card-rating-inline">
                ⭐ {ratingText}
              </span>
            )}
            {ratingText && salesText && <span className="card-sep">|</span>}
            {salesText && (
              <span className="card-sales-inline">{salesText}</span>
            )}
          </div>
        )}

        <span className="card-ad-label">Publicidade</span>

        <div className="card-footer">
          {/* Botão "Ver oferta" → link afiliado */}
          <a
            href={affiliateUrl}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="card-cta"
            aria-label={`Ver oferta: ${product.name}`}
          >
            Ver oferta
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
}

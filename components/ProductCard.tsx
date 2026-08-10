import Link from "next/link";
import { fmtPrice, starFillWidth } from "@/lib/product-helpers";
import type { ProductDisplay } from "@/types/product";

export default function ProductCard({
  product,
}: {
  product: ProductDisplay;
}) {
  const showTag = Boolean(
    product.tag && (!product.discount || product.discount <= 60),
  );

  return (
    <article className="card">
      <Link
        href={`/produto/${product.productId}`}
        className="card-link"
        aria-label={`Ver oferta: ${product.name}`}
      >
        <div className="card-img">
          {showTag && <span className="product-tag">{product.tag}</span>}
          {product.isInternational && (
            <span className="int-badge">🌎 Internacional</span>
          )}
          <img src={product.image} alt={product.name} loading="lazy" />
        </div>
        <div className="card-body">
          <span className="card-category">{product.category}</span>
          <h3 className="card-title">{product.name}</h3>
          <div className="card-rating">
            <span className="stars-wrap">
              ★★★★★
              <span
                className="stars-fill"
                style={{ width: starFillWidth(product.rating || 4.5) }}
              >
                ★★★★★
              </span>
            </span>
            <span className="rating-num">
              {(product.rating || 0).toFixed(1)}
            </span>
            <span className="reviews-count">
              ({product.reviewsCount || 0})
            </span>
          </div>
          <div
            className="price-row"
            style={{
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 2,
            }}
          >
            <span className="price-current">
              R$ {fmtPrice(product.priceCurrent)}
            </span>
          </div>
          <div className="card-footer">
            <div className="card-cta">
              Ver produto
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
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

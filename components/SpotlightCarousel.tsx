"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { fmtPrice } from "@/lib/product-helpers";
import type { ProductDisplay } from "@/types/product";

export interface SpotlightItem {
  product: ProductDisplay;
  /** Resumo pré-computado no servidor (evita hydration mismatch). */
  summary: string;
}

export default function SpotlightCarousel({
  items,
}: {
  items: SpotlightItem[];
}) {
  const count = items.length;
  const [index, setIndex] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (count < 2) return;
    timer.current = setInterval(
      () => setIndex((current) => (current + 1) % count),
      5000,
    );
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [count]);

  if (count === 0) return null;

  const { product, summary } = items[index];
  const pct = product.discount;

  return (
    <div className="spotlight">
      <div className="spotlight-label">Produtos em destaque</div>
      <Link
        href={`/produto/${product.productId}`}
        className="spotlight-card"
        style={{ display: "grid" }}
        aria-label={`Ver oferta em destaque: ${product.name}`}
      >
        <div className="spotlight-img">
          <img src={product.image} alt={product.name} loading="lazy" />
        </div>
        <div className="spotlight-body">
          <h2 className="spotlight-title">{product.name}</h2>
          <div className="spotlight-desc">{summary}</div>
          <div className="price-row" style={{ marginBottom: 6, gap: 6 }}>
            {pct && pct <= 60 && (
              <div className="discount-badge lg">
                <span className="pct">-{pct}%</span>
                <span className="off">OFF</span>
              </div>
            )}
            {product.isInternational && (
              <span
                className="int-badge"
                style={{
                  position: "static",
                  display: "inline-block",
                  marginTop: 4,
                }}
              >
                🌎 Internacional
              </span>
            )}
            <div>
              <div className="price-row" style={{ marginBottom: 0, gap: 4 }}>
                <span
                  className="price-current"
                  style={{ fontSize: 24, color: "var(--rose-deep)" }}
                >
                  R$ {fmtPrice(product.priceCurrent)}
                </span>
              </div>
            </div>
          </div>
          <span
            className="btn-primary"
            style={{ display: "inline-block", padding: "8px 18px", fontSize: 13 }}
          >
            Ver oferta
          </span>
        </div>
      </Link>
      {count > 1 && (
        <>
          <button
            className="carousel-arrow prev"
            aria-label="Destaque anterior"
            onClick={() => setIndex((index - 1 + count) % count)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            className="carousel-arrow next"
            aria-label="Próximo destaque"
            onClick={() => setIndex((index + 1) % count)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
          <div className="dots">
            {items.map((item, i) => (
              <button
                key={item.product.productId}
                className={`dot-indicator ${i === index ? "active" : ""}`}
                aria-label={`Destaque ${i + 1} de ${count}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

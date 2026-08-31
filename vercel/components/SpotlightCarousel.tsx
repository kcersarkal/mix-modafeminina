"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
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
  const affiliateUrl = product.affiliateUrl || "#";

  return (
    <div className="spotlight">
      <div className="spotlight-label">Produtos em destaque</div>
      <a
        href={affiliateUrl}
        target="_blank"
        rel="nofollow sponsored noopener noreferrer"
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
          <span
            className="btn-primary"
            style={{ display: "inline-block", padding: "8px 18px", fontSize: 13 }}
          >
            Ver oferta
          </span>
        </div>
      </a>
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
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
          <div className="carousel-dots">
            {items.map((_, i) => (
              <span
                key={i}
                className={i === index ? "is-active" : ""}
                role="button"
                tabIndex={0}
                aria-label={`Destaque ${i + 1} de ${count}`}
                onClick={() => setIndex(i)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setIndex(i);
                  }
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

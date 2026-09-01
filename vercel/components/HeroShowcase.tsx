"use client";

import { useEffect, useRef, useState } from "react";
import type { ProductDisplay } from "@/types/product";

interface HeroShowcaseProps {
  products: ProductDisplay[];
}

export default function HeroShowcase({ products }: HeroShowcaseProps) {
  const [index, setIndex] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const count = products.length;

  useEffect(() => {
    if (count < 2) return;
    timer.current = setInterval(
      () => setIndex((current) => (current + 1) % count),
      4000,
    );
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [count]);

  if (count === 0) return null;

  const product = products[index];
  const affiliateUrl = product.affiliateUrl || "#";

  return (
    <div className="hero-showcase">
      <div className="hero-mirror">
        <div className="hero-mirror-inner">
          <a
            href={affiliateUrl}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="hero-showcase-link"
            aria-label={`Ver oferta: ${product.name}`}
          >
            <img
              src={product.image}
              alt={product.name}
              className="hero-showcase-img"
              loading="lazy"
            />
            <span className="hero-showcase-name">{product.name}</span>
          </a>
        </div>
      </div>
      {count > 1 && (
        <div className="hero-showcase-dots">
          {products.map((p, i) => (
            <span
              key={p.productId}
              className={i === index ? "is-active" : ""}
              role="button"
              tabIndex={0}
              aria-label={`Produto ${i + 1} de ${count}`}
              onClick={() => setIndex(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setIndex(i);
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

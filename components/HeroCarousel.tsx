"use client";

import { useEffect, useRef, useState } from "react";
import { fmtPrice } from "@/lib/product-helpers";
import type { ProductDisplay } from "@/types/product";

export default function HeroCarousel({
  slides,
}: {
  slides: ProductDisplay[];
}) {
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (count < 2) return;
    timer.current = setInterval(
      () => setIndex((current) => (current + 1) % count),
      4500,
    );
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [count]);

  if (count === 0) {
    return (
      <div className="hero-visual">
        <div className="hero-ring">
          <div
            className="inner"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="/logo_moda_feminina.jpg"
              alt="MIXDM Moda Feminina"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
        <div className="hero-dots" />
      </div>
    );
  }

  return (
    <div className="hero-visual">
      <div className="hero-ring">
        <div className="inner">
          <div className="hero-carousel">
            <div
              className="hero-carousel-track"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {slides.map((slide) => (
                <div className="hero-carousel-slide" key={slide.productId}>
                  <img src={slide.image} alt={slide.name} loading="lazy" />
                  <div className="slide-label">
                    {slide.category} • R$ {fmtPrice(slide.priceCurrent)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="hero-dots">
        {slides.map((slide, i) => (
          <span
            key={slide.productId}
            className={i === index ? "is-active" : ""}
            role="button"
            tabIndex={0}
            aria-label={`Slide ${i + 1} de ${count}`}
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
    </div>
  );
}

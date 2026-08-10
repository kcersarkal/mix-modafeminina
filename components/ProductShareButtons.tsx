"use client";

import { useState } from "react";

interface ProductShareButtonsProps {
  productId: string;
  name: string;
  priceText: string;
  discount: number | null;
}

export default function ProductShareButtons({
  productId,
  name,
  priceText,
  discount,
}: ProductShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const productUrl = () => `${window.location.origin}/produto/${productId}`;

  const shareWhatsApp = () => {
    const discountTxt =
      discount && discount <= 60 ? ` (-${discount}%)` : "";
    const text = `*${name}*\n\n*${priceText}*${discountTxt}\n\n${productUrl()}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const copyLink = async () => {
    const url = productUrl();
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      } else {
        window.prompt("Copie o link:", url);
      }
    } catch {
      window.prompt("Copie o link:", url);
    }
  };

  return (
    <div className="detail-actions-row">
      <button className="btn-share" onClick={shareWhatsApp}>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.44 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        WhatsApp
      </button>
      <button className="btn-copy" onClick={copyLink}>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
        {copied ? "Link copiado!" : "Copiar link"}
      </button>
      <a
        className="btn-telegram"
        href="https://t.me/MixModaFeminina"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.9-6.12c.73-.33 1.43.18 1.15 1.3l-2.7 12.76c-.2.86-.7 1.07-1.42.67l-3.92-2.89-1.89 1.82c-.2.2-.37.37-.73.37z" />
        </svg>
        Telegram
      </a>
    </div>
  );
}

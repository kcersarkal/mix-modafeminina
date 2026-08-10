"use client";

import Link from "next/link";
import { useState } from "react";

const LINKS = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header>
        <div className="nav">
          <Link href="/" className="brand" aria-label="MIXDM Moda Feminina — Início">
            <img
              src="/logo_moda_feminina.jpg"
              alt="MIXDM"
              className="brand-logo"
            />
            <div className="brand-text">
              <span className="brand-name">
                MIX<span>DM</span>
              </span>
              <span className="brand-sub">Moda Feminina</span>
            </div>
          </Link>
          <nav aria-label="Navegação principal">
            <ul>
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <button
            className="nav-toggle"
            aria-label="Abrir menu"
            onClick={() => setOpen(true)}
          >
            ☰
          </button>
        </div>
      </header>

      <div className={`mobile-menu${open ? " is-open" : ""}`}>
        <div className="mobile-menu-backdrop" onClick={() => setOpen(false)} />
        <aside className="mobile-menu-drawer">
          <div className="mobile-menu-header">
            <span className="mobile-menu-title">Navegar</span>
            <button
              className="mobile-close"
              aria-label="Fechar menu"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>
          <nav className="mobile-menu-nav">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
      </div>
    </>
  );
}

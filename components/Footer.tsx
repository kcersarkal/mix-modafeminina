import Link from "next/link";
import { CATEGORIAS_SITE } from "@/lib/categories";
import { getLatestUpdate } from "@/lib/supabase-products";

const SITE_LINKS = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
  { href: "/privacidade", label: "Privacidade" },
  { href: "/termos", label: "Termos de Uso" },
];

function formatLastUpdate(value: string): string {
  return new Date(value).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default async function Footer() {
  const lastUpdate = await getLatestUpdate();

  return (
    <footer>
      <div className="footer-grid">
        <div>
          <div className="footer-brand">
            MIX<span>DM</span> Moda Feminina
          </div>
          <p>
            Curadoria de moda feminina, com ofertas reunidas com cuidado e
            elegância.
          </p>
          <p
            style={{
              fontSize: 12,
              color: "var(--ink-muted)",
              marginTop: 8,
            }}
          >
            última atualização: {lastUpdate ? formatLastUpdate(lastUpdate) : "—"}
          </p>
        </div>
        <div className="footer-col">
          <h5>Categorias</h5>
          <ul>
            {CATEGORIAS_SITE.map((category) => (
              <li key={category.slug}>
                <Link href={`/categoria/${category.slug}`}>
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <h5>Site</h5>
          <ul>
            {SITE_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 MIXDM Moda Feminina. Todos os direitos reservados.</span>
        <span>Este site pode conter links de afiliados.</span>
      </div>
    </footer>
  );
}

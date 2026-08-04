"""
Gerador de sitemap.xml — MIXDM Moda Feminina
--------------------------------------------
Gera o sitemap completo: home + páginas estáticas + categorias + produtos
ativos (checados nas últimas 12h) vindos do Supabase.

Uso (GitHub Actions ou local):
  SUPABASE_URL=... SUPABASE_SERVICE_KEY=... python gerar_sitemap.py

Se as variáveis não existirem, gera apenas a parte estática (sem produtos).
"""

import os
from datetime import datetime, timedelta, timezone
from urllib.parse import quote

try:
    from supabase import create_client
except ImportError:
    create_client = None

BASE = "https://kcersarkal.github.io/mix-modafeminina"
SITE = BASE + "/"

# Páginas estáticas (mesmas rotas do router: ?pagina=...)
PAGINAS = [
    ("sobre", "monthly", "0.6"),
    ("contato", "monthly", "0.6"),
    ("privacidade", "monthly", "0.3"),
    ("termos", "monthly", "0.3"),
    ("pedidos", "weekly", "0.5"),
]

# Categorias exibidas no site (mesmas do app.js / footer)
CATEGORIAS = [
    "Vestidos", "Calças", "Conjuntos", "Shorts", "Saias",
    "Calçados", "Fitness", "Roupas", "Bolsas",
]

MAX_PRODUTOS = 500  # limite de segurança por sitemap


def xml_escape(text):
    return (text.replace("&", "&amp;").replace("<", "&lt;")
            .replace(">", "&gt;").replace('"', "&quot;"))


def url_entry(loc, changefreq, priority, lastmod=None):
    lastmod_tag = f"    <lastmod>{lastmod}</lastmod>\n" if lastmod else ""
    return (
        "  <url>\n"
        f"    <loc>{xml_escape(loc)}</loc>\n"
        f"{lastmod_tag}"
        f"    <changefreq>{changefreq}</changefreq>\n"
        f"    <priority>{priority}</priority>\n"
        "  </url>\n"
    )


def buscar_produtos_ativos(supabase):
    """Produtos ainda frescos (última checagem < 12h) — mesmos critérios do site."""
    now = datetime.now(timezone.utc)
    cutoff = (now - timedelta(hours=12)).isoformat()
    resp = supabase.table("produtos") \
        .select("external_id") \
        .gte("last_checked_at", cutoff) \
        .limit(MAX_PRODUTOS) \
        .execute()
    return resp.data or []


def gerar():
    now = datetime.now(timezone.utc)
    lastmod = now.strftime("%Y-%m-%d")

    urls = [(SITE, "daily", "1.0", lastmod)]
    for slug, freq, prio in PAGINAS:
        urls.append((f"{SITE}?pagina={slug}", freq, prio, None))
    for cat in CATEGORIAS:
        urls.append((f"{SITE}?categoria={quote(cat)}", "daily", "0.8", None))

    produtos = []
    supabase_url = os.getenv("SUPABASE_URL")
    service_key = os.getenv("SUPABASE_SERVICE_KEY")

    if supabase_url and service_key and create_client:
        try:
            supabase = create_client(supabase_url, service_key)
            produtos = buscar_produtos_ativos(supabase)
            print(f"Produtos ativos encontrados: {len(produtos)}")
        except Exception as e:
            print(f"Aviso: nao foi possivel buscar produtos ({e}). Sitemap sem produtos.")
    else:
        print("Sem credenciais Supabase. Sitemap apenas com paginas estaticas.")

    for p in produtos:
        ext = str(p.get("external_id") or "").strip()
        if ext:
            urls.append((f"{SITE}?produto={quote(ext)}", "daily", "0.8", None))

    conteudo = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "".join(url_entry(*u) for u in urls)
        + "</urlset>\n"
    )

    with open("sitemap.xml", "w", encoding="utf-8") as f:
        f.write(conteudo)

    print(f"Sitemap gerado com {len(urls)} URLs em sitemap.xml")


if __name__ == "__main__":
    gerar()

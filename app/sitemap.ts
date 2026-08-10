import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/supabase-products";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Limite de segurança (mesmo do gerar_sitemap.py antigo: 500) para não
  // gerar um sitemap gigante nem uma query pesada.
  const [products, categories] = await Promise.all([
    getProducts({ limit: 500 }),
    getCategories(),
  ]);

  // Deduplica por productId (o mesmo external_id pode existir em fontes
  // diferentes na tabela produtos).
  const seen = new Set<string>();
  const uniqueProducts = products.filter((product) => {
    if (seen.has(product.productId)) return false;
    seen.add(product.productId);
    return true;
  });

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/sobre"), changeFrequency: "monthly", priority: 0.6 },
    {
      url: absoluteUrl("/contato"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: absoluteUrl("/privacidade"),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: absoluteUrl("/termos"),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // Somente categorias válidas (presentes em produtos ativos), sem duplicatas
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: absoluteUrl(`/categoria/${category.slug}`),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  // Somente produtos ativos (regra real: last_checked_at nas últimas 12h),
  // com lastModified baseado na última checagem real.
  const productPages: MetadataRoute.Sitemap = uniqueProducts.map((product) => ({
    url: absoluteUrl(`/produto/${product.productId}`),
    changeFrequency: "daily",
    priority: 0.8,
    lastModified: product.lastCheckedAt,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}

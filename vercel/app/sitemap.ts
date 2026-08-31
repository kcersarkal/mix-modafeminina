import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/supabase-products";
import { absoluteUrl } from "@/lib/site";
import { SUBCATEGORIES } from "@/lib/subcategories";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Limite de segurança para não gerar uma query pesada.
  const [products, categories] = await Promise.all([
    getProducts({ limit: 500 }),
    getCategories(),
  ]);

  // Deduplica por productId.
  const seen = new Set<string>();

  const uniqueProducts = products.filter((product) => {
    if (seen.has(product.productId)) return false;

    seen.add(product.productId);
    return true;
  });

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/sobre"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
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

  // Categorias que possuem produtos ativos.
  const categoryPages: MetadataRoute.Sitemap = categories.map(
    (category) => ({
      url: absoluteUrl(`/categoria/${category.slug}`),
      changeFrequency: "daily",
      priority: 0.8,
    }),
  );

  // Subcategorias SEO.
  const subcategoryPages: MetadataRoute.Sitemap = SUBCATEGORIES.map(
    (subcategory) => ({
      url: absoluteUrl(
        `/categoria/${subcategory.categorySlug}/${subcategory.slug}`,
      ),
      changeFrequency: "daily",
      priority: 0.7,
    }),
  );

  // Produtos ativos nas últimas 72 horas.
  const productPages: MetadataRoute.Sitemap = uniqueProducts.map(
    (product) => ({
      url: absoluteUrl(`/produto/${product.productId}`),
      changeFrequency: "daily",
      priority: 0.8,
      lastModified: product.lastCheckedAt,
    }),
  );

  return [
    ...staticPages,
    ...categoryPages,
    ...subcategoryPages,
    ...productPages,
  ];
}

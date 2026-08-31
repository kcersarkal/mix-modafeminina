import type { MetadataRoute } from "next";
import { getCategories } from "@/lib/supabase-products";
import { absoluteUrl } from "@/lib/site";
import { SUBCATEGORIES } from "@/lib/subcategories";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories = await getCategories();

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

  return [...staticPages, ...categoryPages, ...subcategoryPages];
}

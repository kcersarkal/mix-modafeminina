/**
 * URL pública do site — usada em canonical, sitemap, robots e Open Graph.
 * Nunca usa o domínio antigo kcersarkal.github.io.
 */

const configuredUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL;

function withProtocol(url: string) {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

export const siteUrl = new URL(
  configuredUrl ? withProtocol(configuredUrl) : "http://localhost:3000",
);

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

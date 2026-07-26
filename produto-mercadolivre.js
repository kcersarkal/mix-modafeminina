// ============================================================
// PRODUTOS — Mercado Livre
// Fonte: Scraping (via n8n ou automação)
// Schema unificado com produto-shopee.js
// ============================================================

const MERCADOLIVRE_PRODUCTS = [
  {
    id: "ml-001",
    source: "mercadolivre",
    name: "Sandália Salto Fino Nude",
    category: "Calçados",
    tag: "Novo",
    price_current: 119.90,
    price_original: null,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop",
    description: "Sandália de salto fino nude, combina com looks casuais e de festa. Solado confortável.",
    affiliate_url: "https://mercadolivre.com.br/product/123456",
    rating: 4.3,
    reviews_count: 156,
    spotlight: true,
    last_checked_at: new Date().toISOString()
  },
  {
    id: "ml-002",
    source: "mercadolivre",
    name: "Blazer Alfaiataria Feminino",
    category: "Roupas",
    tag: "-15%",
    price_current: 149.90,
    price_original: 179.90,
    image: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?q=80&w=800&auto=format&fit=crop",
    description: "Blazer de alfaiataria com caimento reto. Ideal para trabalho ou eventos formais.",
    affiliate_url: "https://mercadolivre.com.br/product/789012",
    rating: 4.6,
    reviews_count: 243,
    spotlight: true,
    last_checked_at: new Date().toISOString()
  },
  {
    id: "ml-003",
    source: "mercadolivre",
    name: "Calça Jeans Skinny Cintura Alta",
    category: "Calças",
    tag: "-25%",
    price_current: 69.90,
    price_original: 89.90,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop",
    description: "Calça jeans skinny cintura alta. Modelagem que valoriza a silhueta com conforto.",
    affiliate_url: "https://mercadolivre.com.br/product/345678",
    rating: 4.4,
    reviews_count: 671,
    spotlight: false,
    last_checked_at: new Date().toISOString()
  },
  {
    id: "ml-004",
    source: "mercadolivre",
    name: "Calça Legging Cós Alto",
    category: "Fitness",
    tag: "-10%",
    price_current: 59.90,
    price_original: 79.90,
    image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=800&auto=format&fit=crop",
    description: "Legging de cós alto com compressão suave. Ideal para academia e uso casual.",
    affiliate_url: "https://mercadolivre.com.br/product/901234",
    rating: 4.6,
    reviews_count: 445,
    spotlight: false,
    last_checked_at: new Date().toISOString()
  }
];

// ============================================================
// INSTRUÇÕES PARA AUTOMAÇÃO (via n8n / GitHub Actions)
// ============================================================
// Para atualizar os produtos automaticamente via scraping do ML:
//
// 1. Use n8n com o módulo HTTP Request para buscar a página
// 2. Extraia os dados com HTML Extract / Regex
// 3. Mapeie para o schema acima
// 4. Atualize este arquivo com os novos dados
// 5. Faça commit no GitHub
//
// Schema de mapeamento (ML → unificado):
//   id do anúncio → id (prefixado com "ml-")
//   title → name
//   price → price_current
//   original_price → price_original
//   thumbnail → image
//   description → description
//   rating_average → rating
//   review_count → reviews_count
//   permalink → affiliate_url
//
// Dica: Use o endpoint da API pública do ML:
//   https://api.mercadolibre.com/items/{ITEM_ID}
//
// ============================================================

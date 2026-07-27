// ============================================================
// PRODUTOS — Shopee
// Fonte: API Shopee (via n8n ou automação)
// Schema unificado com produto-mercadolivre.js
// ============================================================

const SHOPEE_PRODUCTS = [
  {
    id: "shp-001",
    source: "shopee",
    name: "Vestido Midi Floral Manga Longa",
    category: "Vestidos",
    tag: "-30%",
    price_current: 89.90,
    price_original: 129.90,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop",
    description: "Vestido midi em tecido leve, estampa floral e manga longa. Perfeito para o dia a dia.",
    affiliate_url: "https://shopee.com.br/product/123456",
    rating: 4.5,
    reviews_count: 328,
    spotlight: true,
    last_checked_at: new Date().toISOString()
  },
  {
    id: "shp-002",
    source: "shopee",
    name: "Bolsa Transversal Couro Ecológico",
    category: "Bolsas",
    tag: "-20%",
    price_current: 79.90,
    price_original: 99.90,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop",
    description: "Bolsa transversal compacta com compartimentos internos. Couro ecológico de alta durabilidade.",
    affiliate_url: "https://shopee.com.br/product/789012",
    rating: 4.7,
    reviews_count: 512,
    spotlight: true,
    last_checked_at: new Date().toISOString()
  },
  {
    id: "shp-003",
    source: "shopee",
    name: "Conjunto Tricot Cropped + Saia Midi",
    category: "Conjuntos",
    tag: "Novo",
    price_current: 139.90,
    price_original: null,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
    description: "Conjunto em tricot com cropped e saia midi. Look moderno e confortável para qualquer ocasião.",
    affiliate_url: "https://shopee.com.br/product/345678",
    rating: 4.8,
    reviews_count: 89,
    spotlight: false,
    last_checked_at: new Date().toISOString()
  },
  {
    id: "shp-004",
    source: "shopee",
    name: "Top Fitness com Bojo",
    category: "Fitness",
    tag: "Novo",
    price_current: 49.90,
    price_original: null,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop",
    description: "Top fitness com bojo removível e alças ajustáveis. Conforto durante os treinos.",
    affiliate_url: "https://shopee.com.br/product/901234",
    rating: 4.2,
    reviews_count: 198,
    spotlight: false,
    last_checked_at: new Date().toISOString()
  },
  {
    id: "shp-005",
    source: "shopee",
    name: "Short Jeans Feminino Cintura Alta",
    category: "Shorts",
    tag: "-15%",
    price_current: 59.90,
    price_original: 69.90,
    image: "https://images.unsplash.com/photo-1593032454539-3c103e6e3a8c?q=80&w=800&auto=format&fit=crop",
    description: "Short jeans cintura alta, modelagem confortável e moderna. Ideal para looks casuais.",
    affiliate_url: "https://shopee.com.br/product/567890",
    rating: 4.4,
    reviews_count: 267,
    spotlight: false,
    last_checked_at: new Date().toISOString()
  },
  {
    id: "shp-006",
    source: "shopee",
    name: "Saia Midi Jeans Feminina",
    category: "Saias",
    tag: "Novo",
    price_current: 69.90,
    price_original: null,
    image: "https://images.unsplash.com/photo-1583499871880-9ac2cd7fc6d9?q=80&w=800&auto=format&fit=crop",
    description: "Saia midi jeans feminina, modelagem reta e confortável. Perfeita para looks casuais e elegantes.",
    affiliate_url: "https://shopee.com.br/product/678901",
    rating: 4.3,
    reviews_count: 189,
    spotlight: false,
    last_checked_at: new Date().toISOString()
  }
];
    category: "Shorts",
    tag: "-15%",
    price_current: 59.90,
    price_original: 69.90,
    image: "https://images.unsplash.com/photo-1593032454539-3c103e6e3a8c?q=80&w=800&auto=format&fit=crop",
    description: "Short jeans cintura alta, modelagem confortável e moderna. Ideal para looks casuais.",
    affiliate_url: "https://shopee.com.br/product/567890",
    rating: 4.4,
    reviews_count: 267,
    spotlight: false,
    last_checked_at: new Date().toISOString()
  }
];

// ============================================================
// INSTRUÇÕES PARA AUTOMAÇÃO (via n8n / GitHub Actions)
// ============================================================
// Para atualizar os produtos automaticamente via API Shopee:
//
// 1. Faça uma requisição GET para a API da Shopee
// 2. Mapeie o JSON de resposta para o schema acima
// 3. Atualize este arquivo com os novos dados
// 4. Faça commit no GitHub
//
// Schema de mapeamento (Shopee → unificado):
//   product_id → id (prefixado com "shp-")
//   name → name
//   price_min → price_current
//   price_max_before_discount → price_original
//   images[0] → image
//   description → description
//   rating_star → rating
//   cmt_count → reviews_count
//   shopee_product_url → affiliate_url
//
// ============================================================

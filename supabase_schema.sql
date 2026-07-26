-- ============================================================
-- MIXDM Moda Feminina — Schema Supabase
-- Execute este SQL no SQL Editor do seu projeto Supabase
-- ============================================================

-- 1. TABELA: produtos (fonte unificada: shopee ou mercadolivre)
CREATE TABLE IF NOT EXISTS produtos (
  id BIGSERIAL PRIMARY KEY,
  source TEXT NOT NULL DEFAULT 'shopee' CHECK (source IN ('shopee', 'mercadolivre')),
  external_id TEXT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price_current NUMERIC(10,2) NOT NULL,
  price_original NUMERIC(10,2),
  image TEXT NOT NULL,
  description TEXT,
  rating NUMERIC(2,1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  affiliate_url TEXT DEFAULT '#',
  tag TEXT,
  spotlight BOOLEAN DEFAULT false,
  last_checked_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(source, external_id)
);

-- 2. TABELA: pedidos (solicitados por visitantes)
CREATE TABLE IF NOT EXISTS pedidos (
  id BIGSERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  imagem TEXT,
  preco NUMERIC(10,2),
  link TEXT,
  descricao TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Índices para performance
CREATE INDEX IF NOT EXISTS idx_produtos_category ON produtos(category);
CREATE INDEX IF NOT EXISTS idx_produtos_spotlight ON produtos(spotlight);
CREATE INDEX IF NOT EXISTS idx_produtos_last_checked ON produtos(last_checked_at);
CREATE INDEX IF NOT EXISTS idx_pedidos_created ON pedidos(created_at DESC);

-- 4. Row-Level Security (RLS) — leitura pública, escrita restrita
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

-- Qualquer um pode ler produtos
CREATE POLICY "Produtos leitura pública"
  ON produtos FOR SELECT
  USING (true);

-- Qualquer um pode inserir pedidos (visitantes solicitam)
CREATE POLICY "Pedidos inserção pública"
  ON pedidos FOR INSERT
  WITH CHECK (true);

-- Apenas authenticated pode escrever produtos
CREATE POLICY "Produtos escrita autenticada"
  ON produtos FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================================
-- SEED DATA — Produtos iniciais (Shopee + Mercado Livre)
-- ============================================================
INSERT INTO produtos (source, external_id, name, category, price_current, price_original, image, description, rating, reviews_count, tag, spotlight, affiliate_url) VALUES
('shopee', 'shp-001', 'Vestido Midi Floral Manga Longa', 'Vestidos', 89.90, 129.90, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop', 'Vestido midi em tecido leve, estampa floral e manga longa. Um curinga para o dia a dia.', 4.5, 328, '-30%', true, '#'),
('shopee', 'shp-002', 'Bolsa Transversal Couro Ecológico', 'Bolsas', 79.90, 99.90, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop', 'Bolsa transversal compacta com compartimentos internos. Couro ecológico.', 4.7, 512, '-20%', true, '#'),
('shopee', 'shp-003', 'Conjunto Tricot Cropped + Saia', 'Conjuntos', 139.90, NULL, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop', 'Conjunto em tricot com cropped e saia midi. Look moderno e confortável.', 4.8, 89, 'Novo', false, '#'),
('shopee', 'shp-004', 'Top Fitness com Bojo', 'Fitness', 49.90, NULL, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop', 'Top fitness com bojo removível e alças ajustáveis. Conforto durante os treinos.', 4.2, 198, 'Novo', false, '#'),
('mercadolivre', 'ml-001', 'Sandália Salto Fino Nude', 'Calçados', 119.90, NULL, 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop', 'Sandália de salto fino nude, combina com looks casuais e de festa.', 4.3, 156, 'Novo', true, '#'),
('mercadolivre', 'ml-002', 'Blazer Alfaiataria Feminino', 'Roupas', 149.90, 179.90, 'https://images.unsplash.com/photo-1551163943-3f6a855d1153?q=80&w=800&auto=format&fit=crop', 'Blazer de alfaiataria com caimento reto. Ideal para trabalho ou eventos.', 4.6, 243, '-15%', true, '#'),
('mercadolivre', 'ml-003', 'Calça Jeans Skinny Cintura Alta', 'Calças', 69.90, 89.90, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop', 'Calça jeans skinny cintura alta. Modelagem que valoriza a silhueta.', 4.4, 671, '-25%', false, '#'),
('mercadolivre', 'ml-004', 'Calça Legging Cós Alto', 'Fitness', 59.90, 79.90, 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=800&auto=format&fit=crop', 'Legging de cós alto com compressão suave. Ideal para academia e uso casual.', 4.6, 445, '-10%', false, '#');

export type CategorySeo = {
  title: string;
  description: string;
  heading: string;
  paragraphs: string[];
};

export const CATEGORY_SEO: Record<string, CategorySeo> = {
  vestidos: {
    title: "Vestidos Femininos em Oferta",
    description:
      "Encontre vestidos femininos em oferta, com opções midi, longas, curtas, casuais e para festa. Compare modelos e preços selecionados pela MIXDM.",
    heading: "Vestidos femininos para diferentes estilos e ocasiões",
    paragraphs: [
      "Encontre vestidos femininos selecionados entre as ofertas disponíveis, com opções para diferentes estilos, ocasiões e faixas de preço. A seleção é atualizada regularmente para reunir modelos que estão disponíveis no momento.",
      "Entre as opções podem aparecer vestidos midi, longos, curtos, casuais, para festa e outros modelos. Compare preços e escolha a opção que mais combina com o seu estilo antes de acessar a oferta.",
    ],
  },

  bolsas: {
    title: "Bolsas Femininas em Oferta",
    description:
      "Encontre bolsas femininas em oferta, incluindo modelos transversais, pequenas, de ombro e para o dia a dia. Compare opções e preços na MIXDM.",
    heading: "Bolsas femininas para diferentes estilos e ocasiões",
    paragraphs: [
      "Confira bolsas femininas selecionadas entre as ofertas disponíveis, com modelos para diferentes estilos, necessidades e faixas de preço.",
      "Entre as opções podem aparecer bolsas transversais, de ombro, pequenas, casuais e outros modelos para complementar diferentes looks.",
    ],
  },

  calcas: {
    title: "Calças Femininas em Oferta",
    description:
      "Encontre calças femininas em oferta, incluindo pantalona, jeans, leggings e modelos casuais. Compare opções e preços selecionados pela MIXDM.",
    heading: "Calças femininas para diferentes estilos",
    paragraphs: [
      "Confira calças femininas selecionadas entre as ofertas disponíveis, com opções para diferentes estilos, ocasiões e faixas de preço.",
      "Entre os modelos podem aparecer calças pantalona, jeans, leggings, modelos casuais e outras opções para compor diferentes looks.",
    ],
  },

  calcados: {
    title: "Calçados Femininos em Oferta",
    description:
      "Encontre calçados femininos em oferta, incluindo sandálias, sapatilhas, tênis e outros modelos. Compare opções e preços na MIXDM.",
    heading: "Calçados femininos para diferentes ocasiões",
    paragraphs: [
      "Confira calçados femininos selecionados entre as ofertas disponíveis, com opções para diferentes estilos, ocasiões e faixas de preço.",
      "A seleção pode incluir sandálias, sapatilhas, tênis e outros modelos para o dia a dia, trabalho, lazer e diferentes ocasiões.",
    ],
  },

  conjuntos: {
    title: "Conjuntos Femininos em Oferta",
    description:
      "Encontre conjuntos femininos em oferta para diferentes estilos e ocasiões. Compare modelos e preços selecionados pela MIXDM.",
    heading: "Conjuntos femininos para montar o look com facilidade",
    paragraphs: [
      "Confira conjuntos femininos selecionados entre as ofertas disponíveis, reunindo opções práticas para diferentes estilos e ocasiões.",
      "A seleção é atualizada regularmente para apresentar modelos disponíveis em diferentes faixas de preço.",
    ],
  },

  roupas: {
    title: "Roupas Femininas em Oferta",
    description:
      "Encontre roupas femininas em oferta para diferentes estilos, ocasiões e faixas de preço. Confira opções selecionadas pela MIXDM.",
    heading: "Roupas femininas para renovar o guarda-roupa",
    paragraphs: [
      "Confira roupas femininas selecionadas entre as ofertas disponíveis, com opções para diferentes estilos, ocasiões e faixas de preço.",
      "A seleção reúne diferentes peças para facilitar a comparação de modelos e encontrar opções que combinem com o seu estilo.",
    ],
  },

  saias: {
    title: "Saias Femininas em Oferta",
    description:
      "Encontre saias femininas em oferta, com modelos longos, midi, curtos e casuais. Compare opções e preços selecionados pela MIXDM.",
    heading: "Saias femininas para diferentes estilos e looks",
    paragraphs: [
      "Confira saias femininas selecionadas entre as ofertas disponíveis, com modelos para diferentes estilos e ocasiões.",
      "Entre as opções podem aparecer saias longas, midi, curtas e casuais em diferentes faixas de preço.",
    ],
  },

  shorts: {
    title: "Shorts Femininos em Oferta",
    description:
      "Encontre shorts femininos em oferta para looks casuais, dia a dia e diferentes ocasiões. Compare modelos e preços na MIXDM.",
    heading: "Shorts femininos para looks confortáveis e versáteis",
    paragraphs: [
      "Confira shorts femininos selecionados entre as ofertas disponíveis, com opções para diferentes estilos e faixas de preço.",
      "A seleção pode incluir modelos casuais, jeans, bermudas e outras opções para compor looks confortáveis para o dia a dia.",
    ],
  },

  fitness: {
    title: "Moda Fitness Feminina em Oferta",
    description:
      "Encontre moda fitness feminina em oferta, incluindo leggings, tops, conjuntos e outras peças para treino. Compare opções na MIXDM.",
    heading: "Moda fitness feminina para treino e dia a dia",
    paragraphs: [
      "Confira peças de moda fitness feminina selecionadas entre as ofertas disponíveis, com opções para diferentes atividades e faixas de preço.",
      "Entre os produtos podem aparecer leggings, tops, conjuntos e outras peças voltadas para treino, academia e looks esportivos.",
    ],
  },
};

export function getCategorySeo(slug: string): CategorySeo | undefined {
  return CATEGORY_SEO[slug];
}

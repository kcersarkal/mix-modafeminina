export type SubcategoryConfig = {
  slug: string;
  categorySlug: string;
  label: string;
  title: string;
  description: string;
  heading: string;
  keywords: string[];
};

export const SUBCATEGORIES: SubcategoryConfig[] = [
  // VESTIDOS
  {
    slug: "vestido-longo",
    categorySlug: "vestidos",
    label: "Vestido Longo",
    title: "Vestidos Longos Femininos em Oferta",
    description:
      "Encontre vestidos longos femininos em oferta para diferentes estilos e ocasiões. Compare modelos e preços selecionados pela MIXDM.",
    heading: "Vestidos longos femininos para diferentes ocasiões",
    keywords: ["vestido longo", "longo vestido"],
  },
  {
    slug: "vestido-curto",
    categorySlug: "vestidos",
    label: "Vestido Curto",
    title: "Vestidos Curtos Femininos em Oferta",
    description:
      "Encontre vestidos curtos femininos em oferta para looks casuais, festas e diferentes ocasiões. Compare modelos e preços na MIXDM.",
    heading: "Vestidos curtos femininos para diferentes estilos",
    keywords: ["vestido curto", "curto vestido"],
  },
  {
    slug: "vestido-midi",
    categorySlug: "vestidos",
    label: "Vestido Midi",
    title: "Vestidos Midi Femininos em Oferta",
    description:
      "Encontre vestidos midi femininos em oferta, com modelos casuais, elegantes e para diferentes ocasiões. Compare opções na MIXDM.",
    heading: "Vestidos midi femininos para diferentes ocasiões",
    keywords: ["vestido midi", "midi vestido"],
  },
  {
    slug: "vestido-casual",
    categorySlug: "vestidos",
    label: "Vestido Casual",
    title: "Vestidos Casuais Femininos em Oferta",
    description:
      "Encontre vestidos casuais femininos em oferta para o dia a dia e diferentes ocasiões. Compare modelos, estilos e preços na MIXDM.",
    heading: "Vestidos casuais femininos para o dia a dia",
    keywords: ["vestido casual", "casual vestido"],
  },
  {
    slug: "vestido-festa",
    categorySlug: "vestidos",
    label: "Vestido Festa",
    title: "Vestidos de Festa Femininos em Oferta",
    description:
      "Encontre vestidos de festa femininos em oferta para diferentes ocasiões e estilos. Compare modelos e preços selecionados pela MIXDM.",
    heading: "Vestidos femininos para festas e ocasiões especiais",
    keywords: ["vestido festa", "vestido de festa"],
  },

  // CALÇAS
  {
    slug: "calca-pantalona",
    categorySlug: "calcas",
    label: "Calça Pantalona",
    title: "Calças Pantalona Femininas em Oferta",
    description:
      "Encontre calças pantalona femininas em oferta, com modelos para diferentes estilos e ocasiões. Compare opções e preços na MIXDM.",
    heading: "Calças pantalona femininas para diferentes estilos",
    keywords: ["pantalona"],
  },
  {
    slug: "calca-jeans",
    categorySlug: "calcas",
    label: "Calça Jeans",
    title: "Calças Jeans Femininas em Oferta",
    description:
      "Encontre calças jeans femininas em oferta para diferentes estilos e ocasiões. Compare modelos e preços selecionados pela MIXDM.",
    heading: "Calças jeans femininas para diferentes estilos",
    keywords: ["calça jeans", "calca jeans"],
  },
  {
    slug: "calca-cargo",
    categorySlug: "calcas",
    label: "Calça Cargo",
    title: "Calças Cargo Femininas em Oferta",
    description:
      "Encontre calças cargo femininas em oferta para looks casuais e modernos. Compare modelos, opções e preços selecionados pela MIXDM.",
    heading: "Calças cargo femininas para looks casuais",
    keywords: ["calça cargo", "calca cargo"],
  },

  // SAIAS
  {
    slug: "saia-longa",
    categorySlug: "saias",
    label: "Saia Longa",
    title: "Saias Longas Femininas em Oferta",
    description:
      "Encontre saias longas femininas em oferta para diferentes estilos e ocasiões. Compare modelos e preços selecionados pela MIXDM.",
    heading: "Saias longas femininas para diferentes looks",
    keywords: ["saia longa", "longa saia"],
  },
  {
    slug: "saia-midi",
    categorySlug: "saias",
    label: "Saia Midi",
    title: "Saias Midi Femininas em Oferta",
    description:
      "Encontre saias midi femininas em oferta, com opções casuais e elegantes para diferentes ocasiões. Compare modelos na MIXDM.",
    heading: "Saias midi femininas para diferentes estilos",
    keywords: ["saia midi", "midi saia"],
  },
  {
    slug: "saia-jeans",
    categorySlug: "saias",
    label: "Saia Jeans",
    title: "Saias Jeans Femininas em Oferta",
    description:
      "Encontre saias jeans femininas em oferta para diferentes estilos e ocasiões. Compare modelos, comprimentos e preços na MIXDM.",
    heading: "Saias jeans femininas para diferentes estilos",
    keywords: ["saia jeans", "jeans saia"],
  },

  // BOLSAS
  {
    slug: "bolsa-transversal",
    categorySlug: "bolsas",
    label: "Bolsa Transversal",
    title: "Bolsas Transversais Femininas em Oferta",
    description:
      "Encontre bolsas transversais femininas em oferta, com modelos para o dia a dia e diferentes estilos. Compare opções na MIXDM.",
    heading: "Bolsas transversais femininas para diferentes ocasiões",
    keywords: ["bolsa transversal", "transversal bolsa"],
  },
  {
    slug: "bolsa-tiracolo",
    categorySlug: "bolsas",
    label: "Bolsa Tiracolo",
    title: "Bolsas Tiracolo Femininas em Oferta",
    description:
      "Encontre bolsas tiracolo femininas em oferta para o dia a dia e diferentes ocasiões. Compare modelos, estilos e preços na MIXDM.",
    heading: "Bolsas tiracolo femininas para diferentes estilos",
    keywords: ["bolsa tiracolo", "tiracolo bolsa"],
  },

  // CALÇADOS
  {
    slug: "sapatilha",
    categorySlug: "calcados",
    label: "Sapatilha",
    title: "Sapatilhas Femininas em Oferta",
    description:
      "Encontre sapatilhas femininas em oferta, com modelos casuais, confortáveis e para diferentes ocasiões. Compare opções e preços na MIXDM.",
    heading: "Sapatilhas femininas para diferentes estilos",
    keywords: ["sapatilha", "sapatilhas"],
  },
  {
    slug: "rasteirinha",
    categorySlug: "calcados",
    label: "Rasteirinha",
    title: "Rasteirinhas Femininas em Oferta",
    description:
      "Encontre rasteirinhas femininas em oferta para looks casuais e dias mais quentes. Compare modelos, estilos e preços na MIXDM.",
    heading: "Rasteirinhas femininas para looks leves e casuais",
    keywords: ["rasteirinha", "rasteirinhas", "rasteira feminina"],
  },
];

export function getSubcategory(
  categorySlug: string,
  subcategorySlug: string
): SubcategoryConfig | undefined {
  return SUBCATEGORIES.find(
    (item) =>
      item.categorySlug === categorySlug &&
      item.slug === subcategorySlug
  );
}

export function getSubcategoriesForCategory(
  categorySlug: string
): SubcategoryConfig[] {
  return SUBCATEGORIES.filter(
    (item) => item.categorySlug === categorySlug
  );
}

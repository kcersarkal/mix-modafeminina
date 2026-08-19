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
    slug: "bolsa-transversal",
    categorySlug: "bolsas",
    label: "Bolsa Transversal",
    title: "Bolsas Transversais Femininas em Oferta",
    description:
      "Encontre bolsas transversais femininas em oferta, com modelos para o dia a dia e diferentes estilos. Compare opções na MIXDM.",
    heading: "Bolsas transversais femininas para diferentes ocasiões",
    keywords: ["bolsa transversal", "transversal bolsa"],
  },
];

export function getSubcategory(
  categorySlug: string,
  subcategorySlug: string
): SubcategoryConfig | undefined {
  return SUBCATEGORIES.find(
    (item) =>
      item.categorySlug === categorySlug && item.slug === subcategorySlug
  );
}

export function getSubcategoriesForCategory(
  categorySlug: string
): SubcategoryConfig[] {
  return SUBCATEGORIES.filter((item) => item.categorySlug === categorySlug);
}

import type { ProductDisplay } from "@/types/product";

/**
 * Helpers de formatação portados fielmente do app.js antigo, para manter a
 * aparência dos preços, tags e resumos idêntica à do site atual.
 */

export function priceNumber(value: number | null | undefined): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  return null;
}

export function fmtPrice(value: number | null | undefined): string {
  const price = priceNumber(value);
  return price === null
    ? "Indisponível"
    : price.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
}

/** Extrai o percentual de desconto da tag (ex.: "🌎 -30%" -> 30). */
export function discountPercent(tag: string | null | undefined): number | null {
  const t = tag || "";
  const cleaned = t.replace(/^🌎 /, "");
  if (cleaned.startsWith("-")) {
    const m = cleaned.match(/-?(\d+)/);
    return m ? parseInt(m[1], 10) : null;
  }
  return null;
}

export function isInternational(tag: string | null | undefined): boolean {
  return (tag || "").includes("🌎");
}

export function starFillWidth(rating: number | null | undefined): string {
  const r = rating || 4.5;
  return `${(r / 5) * 100}%`;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function detectProductType(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("vestido") || t.includes("midi")) return "vestido";
  if (t.includes("sandália") || t.includes("salto") || t.includes("sapatilha"))
    return "calcados";
  if (t.includes("bolsa") || t.includes("transversal") || t.includes("tiracolo"))
    return "bolsas";
  if (t.includes("blazer") || t.includes("alfaiataria")) return "roupas";
  if (t.includes("conjunto") || t.includes("cropped") || t.includes("tricot"))
    return "conjuntos";
  if (t.includes("saia")) return "saias";
  if (t.includes("short") || t.includes("bermuda")) return "shorts";
  if (t.includes("jeans") || t.includes("calça")) return "roupas";
  if (t.includes("legging")) return "fitness";
  if (t.includes("fitness") || t.includes("top") || t.includes("bojo"))
    return "fitness";
  return "generico";
}

function analysisForType(type: string): string {
  const analyses: Record<string, string[]> = {
    vestido: [
      "Perfeito para quem busca um vestido versátil, que funciona tanto no trabalho quanto em eventos. O caimento é lisonjeiro e o tecido tem boa qualidade",
      "Ideal para montar looks elegantes sem esforço. A estampa e o corte valorizam a silhueta, e a peça é confortável para usar o dia inteiro",
    ],
    calcados: [
      "O modelo ideal para quem valoriza conforto sem abrir mão do estilo. O design é moderno e a palmilha garante bem-estar mesmo após horas de uso",
      "Um calçado que une elegância e praticidade. Combina com produções casuais e sofisticadas, sendo um curinga no guarda-roupa",
    ],
    bolsas: [
      "Prática e estilosa, essa bolsa tem o tamanho ideal para o dia a dia. Os compartimentos internos ajudam a organizar tudo sem perder a elegância",
      "O acessório que faltava para completar seus looks. Leve, funcional e com um design que chama atenção",
    ],
    roupas: [
      "Uma peça que eleva qualquer produção. O corte alfaiatado entrega um visual sofisticado, perfeito para quem precisa de estilo no dia a dia",
      "Versátil e atemporal, essa peça é daquelas que não pode faltar no guarda-roupa. Veste bem e valoriza a silhueta",
    ],
    conjuntos: [
      "A praticidade de um look pronto com a elegância de peças coordenadas. Ideal para quem quer estar bem vestida sem perder tempo montando produções",
      "Conforto e estilo andam juntos nesse conjunto. O tricot é macio e a modelagem é moderna sem ser exagerada",
    ],
    shorts: [
      "O short ideal para compor looks frescos e estilosos no dia a dia. O caimento é perfeito e valoriza a silhueta",
      "Peça versátil que transita do casual ao sofisticado com facilidade. Confortável e moderna, é curinga no guarda-roupa",
    ],
    saias: [
      "A saia que equilibra feminilidade e conforto, perfeita para compor looks elegantes sem esforço",
      "Modelagem que valoriza a silhueta e tecido que garante conforto o dia inteiro. Ideal do trabalho ao lazer",
    ],
    fitness: [
      "Perfeito para acompanhar seus treinos com conforto e estilo. O tecido respirável e a modelagem anatômica garantem liberdade de movimento",
      "Ideal para quem leva o treino a sério mas não abre mão do visual. A compressão suave ajuda na performance e na recuperação muscular",
    ],
    generico: [
      "Produto versátil que atende bem o que se propõe. Boa avaliação dos compradores mostra que entrega o que promete",
      "Uma escolha acertada para quem busca o melhor custo-benefício. Avaliado positivamente por quem já comprou",
    ],
  };
  return pick(analyses[type] || analyses.generico);
}

/** Resumo gerado para o detalhe do produto (mesma lógica do app.js). */
export function generateSummary(p: ProductDisplay): string {
  const desconto = p.discount;
  const nota = p.rating || 0;
  const reviews = p.reviewsCount || 0;
  const type = detectProductType(p.name);

  let txt = analysisForType(type);

  if (desconto && desconto >= 20) {
    txt += ` com ${desconto}% de desconto —`;
  } else if (desconto) {
    txt += ` com preço especial —`;
  } else {
    txt += ` —`;
  }

  if (nota >= 4.5 && reviews >= 500) {
    txt += ` e olha que não sou só eu que penso assim: ${nota}/5 de mais de ${(
      reviews / 1000
    ).toFixed(reviews >= 1000 ? 0 : 1)} mil compradoras.`;
  } else if (nota >= 4.0 && reviews >= 100) {
    txt += ` e a reputação confirma: ${nota}/5 em ${reviews} avaliações.`;
  } else if (nota >= 4.5) {
    txt += ` com nota ${nota}/5 de quem já comprou.`;
  } else if (reviews >= 500) {
    txt += ` já são mais de ${(reviews / 1000).toFixed(0)} mil avaliações.`;
  } else {
    txt += ` vale a pena conferir.`;
  }

  return txt;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quem Somos",
  description:
    "Conheça a MIXDM Moda Feminina: missão, como selecionamos as ofertas, como funciona o site e transparência sobre links de afiliados.",
  alternates: { canonical: "/sobre" },
};

export default function SobrePage() {
  return (
    <div className="legal">
      <h1>Quem Somos</h1>
      <p className="updated">MIXDM Moda Feminina</p>

      <h2>Nossa Missão</h2>
      <p>
        A MIXDM Moda Feminina nasceu para facilitar a vida de quem ama moda.
        Queremos reunir em um só lugar as melhores ofertas de vestidos,
        calçados, bolsas e acessórios — tudo selecionado com curadoria para que
        você encontre peças lindas sem perder horas navegando.
      </p>
      <p>
        Acreditamos que estilo não precisa ser caro nem complicado. Por isso
        buscamos diariamente as promoções mais interessantes nas principais
        lojas e marketplaces do Brasil.
      </p>

      <h2>Como Selecionamos as Ofertas</h2>
      <p>
        Nosso time acompanha centenas de produtos em lojas parceiras como
        Shopee, Mercado Livre, Amazon e outras. As ofertas são escolhidas com
        base em três critérios:
      </p>
      <ul>
        <li>
          <strong>Relevância:</strong> produtos que estão em alta e fazem
          sentido para o público feminino
        </li>
        <li>
          <strong>Custo-benefício:</strong> priorizamos itens com bom desconto
          ou preço justo
        </li>
        <li>
          <strong>Variedade:</strong> buscamos diversidade de estilos, cores e
          categorias
        </li>
      </ul>
      <p>
        Os preços e a disponibilidade são obtidos automaticamente e podem
        variar. Recomendamos verificar o valor final antes de concluir a
        compra.
      </p>

      <h2>Como Funciona</h2>
      <p>
        Não vendemos produtos diretamente. Cada anúncio aqui leva você até a
        página oficial do produto na loja parceira. A compra, o pagamento e a
        entrega são feitos diretamente com o vendedor ou marketplace — com toda
        a segurança e garantia que a plataforma oferece.
      </p>

      <h2>Transparência sobre Links de Afiliados</h2>
      <p>
        Este site participa de programas de afiliados, incluindo o Programa de
        Associados da Amazon e programas similares de outras lojas. Isso
        significa que podemos ganhar uma comissão quando você clica em um dos
        nossos links e realiza uma compra.
      </p>
      <p>
        <strong>Importante:</strong> o valor da comissão não aumenta o preço
        final para você. A comissão é paga pela loja parceira, não por você.
        Nosso objetivo é manter o site gratuito e sustentável, e essa receita
        ajuda a cobrir os custos de operação e curadoria.
      </p>

      <h2>Contato</h2>
      <p>
        Tem dúvidas, sugestões ou quer reportar um problema? Fale com a gente
        pelo e-mail{" "}
        <a href="mailto:mix.dumixof@gmail.com">mix.dumixof@gmail.com</a> —
        responderemos o mais rápido possível.
      </p>
    </div>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description:
    "Termos de Uso da MIXDM Moda Feminina: objetivo do site, links para lojas parceiras, programa de afiliados e responsabilidades.",
  alternates: { canonical: "/termos" },
};

export default function TermosPage() {
  return (
    <div className="legal">
      <h1>Termos de Uso</h1>
      <p className="updated">Última atualização: julho de 2026</p>

      <p>
        Bem-vindo ao MIXDM Moda Feminina. Ao acessar e utilizar este site, você
        concorda com os termos e condições descritos abaixo.
      </p>

      <h2>1. Objetivo do Site</h2>
      <p>
        O MIXDM Moda Feminina é um portal de curadoria de ofertas que reúne
        produtos de moda feminina, acessórios, calçados e itens relacionados
        disponibilizados por lojas e plataformas parceiras.
      </p>
      <p>
        O site não realiza vendas diretas, não processa pagamentos e não envia
        produtos aos consumidores.
      </p>

      <h2>2. Links para Lojas Parceiras</h2>
      <p>
        Os produtos apresentados neste site podem conter links para lojas e
        plataformas de terceiros.
      </p>
      <p>
        Ao clicar em um produto, o usuário será direcionado para o site da loja
        responsável pela venda, onde a compra será realizada sob os termos,
        políticas e condições da respectiva empresa.
      </p>
      <p>O MIXDM Moda Feminina não se responsabiliza por:</p>
      <ul>
        <li>Disponibilidade de produtos;</li>
        <li>Alterações de preços;</li>
        <li>Informações fornecidas pelas lojas parceiras;</li>
        <li>Entrega, trocas ou devoluções;</li>
        <li>Garantias oferecidas pelos vendedores.</li>
      </ul>

      <h2>3. Programa de Afiliados</h2>
      <p>Este site participa de programas de afiliados.</p>
      <p>
        Isso significa que poderemos receber uma comissão quando uma compra for
        realizada através dos links disponibilizados, sem qualquer custo
        adicional para o usuário.
      </p>

      <h2>4. Informações dos Produtos</h2>
      <p>
        Buscamos manter as informações atualizadas, porém preços, descontos,
        estoque e condições comerciais podem ser alterados pelas lojas
        parceiras a qualquer momento sem aviso prévio.
      </p>
      <p>
        Recomendamos sempre verificar os dados diretamente na página da oferta
        antes de concluir qualquer compra.
      </p>

      <h2>5. Uso do Site</h2>
      <p>
        O usuário compromete-se a utilizar este site de forma legal, ética e de
        acordo com a legislação vigente.
      </p>
      <p>É proibido:</p>
      <ul>
        <li>Utilizar o site para atividades ilícitas;</li>
        <li>Tentar comprometer a segurança do sistema;</li>
        <li>Copiar ou reproduzir conteúdos do site sem autorização.</li>
      </ul>

      <h2>6. Limitação de Responsabilidade</h2>
      <p>
        O MIXDM Moda Feminina disponibiliza informações e links de produtos
        apenas para fins informativos e promocionais.
      </p>
      <p>
        Não garantimos a disponibilidade contínua do site, nem assumimos
        responsabilidade por prejuízos decorrentes do uso das informações aqui
        apresentadas.
      </p>

      <h2>7. Alterações dos Termos</h2>
      <p>
        Estes Termos de Uso poderão ser modificados a qualquer momento para
        refletir alterações no funcionamento do site ou exigências legais.
      </p>
      <p>Recomendamos que o usuário consulte esta página periodicamente.</p>

      <h2>8. Contato</h2>
      <p>
        Em caso de dúvidas sobre estes Termos de Uso, entre em contato através
        do e-mail:
      </p>
      <p
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: "var(--rose-deep)",
          marginTop: 12,
        }}
      >
        <a href="mailto:mix.dumixof@gmail.com">mix.dumixof@gmail.com</a>
      </p>
    </div>
  );
}

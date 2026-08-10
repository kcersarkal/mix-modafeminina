import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Política de Privacidade da MIXDM Moda Feminina: links de afiliado, informações coletadas, cookies e direitos do usuário.",
  alternates: { canonical: "/privacidade" },
};

export default function PrivacidadePage() {
  return (
    <div className="legal">
      <h1>Política de Privacidade</h1>
      <p className="updated">Última atualização: julho de 2026</p>

      <p>
        A MIXDM Moda Feminina respeita a sua privacidade e se compromete a
        proteger os dados pessoais dos visitantes deste site.
      </p>

      <h2>1. Links de Afiliado</h2>
      <p>
        Este site pode conter links de afiliados para lojas e plataformas
        parceiras. Ao clicar em um desses links e realizar uma compra, a MIXDM
        Moda Feminina pode receber uma comissão, sem qualquer custo adicional
        para você.
      </p>

      <h2>2. Informações que coletamos</h2>
      <p>
        Não coletamos nome, e-mail, IP ou qualquer informação pessoal através
        do site. Os únicos dados processados são aqueles gerenciados
        diretamente pelas lojas parceiras quando você clica em um link de
        afiliado.
      </p>

      <h2>3. Cookies</h2>
      <p>
        As lojas parceiras (como Amazon) podem utilizar cookies próprios para
        rastrear as compras realizadas através dos nossos links. Nós não
        armazenamos, coletamos ou compartilhamos nenhum dado pessoal dos
        visitantes.
      </p>

      <h2>4. Seus direitos</h2>
      <p>
        Você pode, a qualquer momento, solicitar informações sobre os dados que
        temos armazenados ou pedir a exclusão. Para isso, entre em contato
        através dos nossos canais oficiais.
      </p>

      <h2>5. Alterações nesta política</h2>
      <p>
        Esta política de privacidade pode ser atualizada periodicamente.
        Recomendamos a revisão desta página com regularidade.
      </p>
    </div>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Política de Privacidade da MIXDM Moda Feminina: coleta e uso de dados, cookies, links de afiliados, serviços de terceiros e direitos do usuário.",
  alternates: { canonical: "/privacidade" },
};

export default function PrivacidadePage() {
  return (
    <div className="legal">
      <h1>Política de Privacidade</h1>
      <p className="updated">Última atualização: agosto de 2026</p>

      <p>
        A MIXDM Moda Feminina respeita a sua privacidade e se compromete a
        proteger os dados pessoais dos visitantes deste site. Esta Política de
        Privacidade descreve como coletamos, utilizamos e protegemos informações
        quando você acessa nosso site.
      </p>

      <h2>1. Informações que Coletamos</h2>
      <p>
        O MIXDM Moda Feminina não coleta diretamente dados pessoais identificáveis
        como nome, endereço de e-mail, telefone ou CPF. Nosso site funciona como um
        portal de curadoria de ofertas que redireciona o visitante para lojas
        parceiras.
      </p>
      <p>
        No entanto, determinados dados podem ser coletados de forma automática
        durante a navegação:
      </p>
      <ul>
        <li>
          <strong>Dados de navegação:</strong> páginas visitadas, tempo de permanência,
          dispositivo utilizado, navegador e sistema operacional.
        </li>
        <li>
          <strong>Endereço IP:</strong> pode ser registrado pelos serviços de
          hospedagem para fins de segurança e análise de tráfego.
        </li>
        <li>
          <strong>Origem do tráfego:</strong> informação de como você chegou ao site
          (por exemplo, via pesquisa, rede social ou link direto).
        </li>
      </ul>

      <h2>2. Uso de Cookies</h2>
      <p>
        Utilizamos cookies e tecnologias semelhantes para melhorar sua experiência
        de navegação. Cookies são pequenos arquivos armazenados no seu navegador
        que nos ajudam a entender como o site é utilizado.
      </p>
      <p>Os tipos de cookies utilizados incluem:</p>
      <ul>
        <li>
          <strong>Cookies essenciais:</strong> necessários para o funcionamento
          básico do site.
        </li>
        <li>
          <strong>Cookies de analytics:</strong> coletam informações anônimas sobre
          como os visitantes usam o site, ajudando-nos a melhorar o conteúdo e a
          navegação.
        </li>
        <li>
          <strong>Cookies de afiliados:</strong> utilizados pelas lojas parceiras
          para identificar que a compra foi realizada através do nosso site. Esses
          cookies são gerenciados pelas próprias plataformas parceiras.
        </li>
      </ul>
      <p>
        Você pode gerenciar ou desativar cookies diretamente nas configurações do
        seu navegador. A desativação de cookies pode afetar a funcionalidade
        de algumas partes do site.
      </p>

      <h2>3. Links de Afiliados</h2>
      <p>
        Este site participa de programas de afiliados de plataformas como Amazon,
        Shopee, Mercado Livre e outros marketplaces parceiros. Isso significa que
        quando você clica em um link de produto e realiza uma compra, podemos receber
        uma comissão referente a essa transação.
      </p>
      <p>
        <strong>Importante:</strong> a comissão de afiliado não representa custo
        adicional para o comprador. O preço final do produto é o mesmo, independentemente
        de ter sido acessado através do nosso site ou diretamente na loja. A comissão
        é paga pela loja parceira e não pelo consumidor.
      </p>
      <ul>
        <li>
          Os links de afiliados podem conter cookies próprios das lojas parceiras
          que registram a origem da visita.
        </li>
        <li>
          Não temos controle sobre as políticas de privacidade das lojas parceiras.
          Recomendamos consultar as políticas de cada plataforma diretamente.
        </li>
      </ul>

      <h2>4. Serviços de Terceiros</h2>
      <p>
        Para operar e melhorar o site, utilizamos serviços de terceiros que podem
        coletar dados de navegação de forma independente. Entre os principais
        serviços utilizados, destacam-se:
      </p>

      <h3>Google</h3>
      <p>
        Utilizamos serviços do Google, como o Google Search Console, para
        monitorar a indexação do site nos resultados de busca e melhorar oura
        presença online. O Google também pode utilizar cookies e coletar dados
        de navegação conforme suas próprias políticas de privacidade.
      </p>

      <h3>Pinterest</h3>
      <p>
        O MIXDM Moda Feminina pode utilizar o Pinterest para divulgar ofertas
        e conteúdo relacionado a moda feminina. Ao interagir com nosso conteúdo
        no Pinterest, os dados são tratados conforme a política de privacidade
        daquela plataforma.
      </p>

      <h3>Vercel</h3>
      <p>
        Nosso site é hospedado na Vercel, provedor de infraestrutura que pode
        coletar dados de acesso como endereço IP, tipo de navegador e registros
        de servidor para fins de segurança, performance e disponibilidade do site.
        Consulte a política de privacidade da Vercel para mais detalhes.
      </p>

      <h3>Supabase</h3>
      <p>
        Utilizamos o Supabase como banco de dados para armazenar informações
        sobre produtos e categorias exibidos no site. O Supabase pode coletar
        dados de uso e logs de acesso conforme sua política de privacidade.
        Nenhum dado pessoal identificável dos visitantes é armazenado no
        Supabase por nosso site.
      </p>

      <h2>5. Compartilhamento de Dados</h2>
      <p>
        Não vendemos, alugamos ou compartilhamos seus dados pessoais com
        terceiros para fins de marketing direto. Os dados de navegação podem
        ser compartilhados apenas com os serviços de terceiros mencionados
        acima, exclusivamente para as finalidades descritas nesta política.
      </p>

      <h2>6. Segurança dos Dados</h2>
      <p>
        Adotamos medidas de segurança adequadas para proteger os dados coletados
        contra acesso não autorizado, alteração, divulgação ou destruição.
        No entanto, nenhum método de transmissão pela internet ou armazenamento
        eletrônico é 100% seguro, e não podemos garantir segurança absoluta.
      </p>

      <h2>7. Seus Direitos</h2>
      <p>
        De acordo com a Lei Geral de Proteção de Dados (LGPD) e legislações
        aplicáveis, você tem direito a:
      </p>
      <ul>
        <li>Solicitar informações sobre os dados que temos armazenados;</li>
        <li>Solicitar a correção ou exclusão de dados pessoais;</li>
        <li>Revogar o consentimento para uso de seus dados a qualquer momento;</li>
        <li>Solicitar a portabilidade dos dados, quando aplicável.</li>
      </ul>
      <p>
        Para exercer esses direitos, entre em contato através do nosso canal
        oficial de atendimento.
      </p>

      <h2>8. Menores de Idade</h2>
      <p>
        Nosso site não é direcionado a menores de 18 anos. Não coletamos
        intencionalmente dados pessoais de menores de idade. Caso tomemos
        conhecimento de que dados de um menor foram coletados, tomaremos as
        providências necessários para excluí-los.
      </p>

      <h2>9. Alterações nesta Política</h2>
      <p>
        Esta Política de Privacidade pode ser atualizada periodicamente para
        refletir mudanças em nossas práticas ou por exigências legais. As
        alterações serão publicadas nesta página com a data de atualização
        revisada. Recomendamos a revisão desta política com regularidade.
      </p>

      <h2>10. Contato</h2>
      <p>
        Se você tiver dúvidas sobre esta Política de Privacidade ou sobre como
        seus dados são tratados, entre em contato através do e-mail:
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

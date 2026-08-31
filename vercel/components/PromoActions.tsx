export default function PromoActions() {
  return (
    <section className="promo-actions">
      <div className="promo-card promo-whatsapp">
        <div className="promo-icon">💬</div>
        <div className="promo-text">
          <h3>Entre no nosso canal do WhatsApp</h3>
          <p>Receba novos achadinhos e ofertas direto no WhatsApp.</p>
        </div>
        <a
          href="https://whatsapp.com/channel/0029Vb8SiG3JuyAK5w33XJ2Q"
          target="_blank"
          rel="noopener noreferrer"
          className="promo-btn promo-btn-whatsapp"
          aria-label="Entrar no canal do WhatsApp"
        >
          Entrar no canal
        </a>
      </div>

      <div className="promo-card promo-cupons">
        <div className="promo-icon">🎟️</div>
        <div className="promo-text">
          <h3>Pegue seus cupons Shopee</h3>
          <p>Antes de comprar, confira os cupons disponíveis e economize ainda mais.</p>
        </div>
        <a
          href="https://s.shopee.com.br/6fgvvxWxq7"
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          className="promo-btn promo-btn-cupons"
          aria-label="Pegar cupons Shopee"
        >
          Pegar cupons
        </a>
      </div>
    </section>
  );
}

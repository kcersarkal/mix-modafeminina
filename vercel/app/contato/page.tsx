import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com a MIXDM Moda Feminina: dúvidas, sugestões ou solicitações de produto pelo e-mail mix.dumixof@gmail.com.",
  alternates: { canonical: "/contato" },
};

export default function ContatoPage() {
  return (
    <div className="legal">
      <h1>Contato</h1>
      <p>
        Tem dúvidas, sugestões ou quer solicitar um produto? Mande um e-mail
        direto pra gente:
      </p>
      <p
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: "var(--rose-deep)",
          marginTop: 20,
        }}
      >
        <a href="mailto:mix.dumixof@gmail.com">mix.dumixof@gmail.com</a>
      </p>
    </div>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not-found">
      <h1>Página não encontrada</h1>
      <p>
        A página que você procura não existe ou não está mais disponível.
        Volte para a home e confira as ofertas ativas.
      </p>
      <Link href="/" className="btn-primary">
        Ver todas as ofertas
      </Link>
    </div>
  );
}

"use client";

import Link from "next/link";
import { buildFilterUrl } from "@/lib/product-filters";

export default function Pagination({
  basePath,
  currentPage,
  totalPages,
  ordem,
}: {
  basePath: string;
  currentPage: number;
  totalPages: number;
  ordem?: string;
}) {
  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  const hrefFor = (page: number) =>
    buildFilterUrl(basePath, { ordem, pagina: page });

  return (
    <nav className="pagination" aria-label="Paginação">
      {currentPage > 1 && (
        <Link href={hrefFor(currentPage - 1)}>←</Link>
      )}
      {pages.map((page) => (
        <Link
          key={page}
          href={hrefFor(page)}
          className={page === currentPage ? "is-current" : undefined}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </Link>
      ))}
      {currentPage < totalPages && (
        <Link href={hrefFor(currentPage + 1)}>→</Link>
      )}
    </nav>
  );
}

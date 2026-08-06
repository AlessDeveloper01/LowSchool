import { LuChevronFirst, LuChevronLast, LuChevronLeft, LuChevronRight } from "react-icons/lu";

import {
  navigationDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  size?: "sm" | "md" | "lg";
  siblingCount?: number;
  design?: DesignPreset;
  className?: string;
}

function pagesToShow(current: number, total: number, siblingCount: number): Array<number | "ellipsis-left" | "ellipsis-right"> {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  const start = Math.max(2, current - siblingCount);
  const end = Math.min(total - 1, current + siblingCount);
  const pages: Array<number | "ellipsis-left" | "ellipsis-right"> = [1];
  if (start > 2) pages.push("ellipsis-left");
  for (let page = start; page <= end; page += 1) pages.push(page);
  if (end < total - 1) pages.push("ellipsis-right");
  pages.push(total);
  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  size = "md",
  siblingCount = 1,
  design,
  className,
}: PaginationProps) {
  const buttonSize = size === "sm" ? "xs" : size === "lg" ? "lg" : "sm";
  if (totalPages <= 1) return null;
  return (
    <nav
      aria-label="Paginación"
      className={cn(
        "flex items-center justify-center gap-1",
        design && navigationDesignStyles[design],
        design && "p-1.5",
        className,
      )}
    >
      <Button variant="ghost" size={buttonSize} onClick={() => onPageChange(1)} disabled={currentPage === 1} aria-label="Primera página" className="hidden sm:inline-flex"><LuChevronFirst /></Button>
      <Button variant="ghost" size={buttonSize} onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} aria-label="Página anterior"><LuChevronLeft /></Button>
      <div className="hidden items-center gap-1 sm:flex">
        {pagesToShow(currentPage, totalPages, siblingCount).map((page) =>
          typeof page === "number" ? (
            <Button key={page} variant={page === currentPage ? "primary" : "ghost"} size={buttonSize} onClick={() => onPageChange(page)} aria-current={page === currentPage ? "page" : undefined}>{page}</Button>
          ) : <span key={page} className="px-1 text-muted">…</span>,
        )}
      </div>
      <span className="px-2 text-xs font-bold text-muted sm:hidden">{currentPage} / {totalPages}</span>
      <Button variant="ghost" size={buttonSize} onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Página siguiente"><LuChevronRight /></Button>
      <Button variant="ghost" size={buttonSize} onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} aria-label="Última página" className="hidden sm:inline-flex"><LuChevronLast /></Button>
    </nav>
  );
}

export interface SimplePaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  design?: DesignPreset;
  className?: string;
}

export function SimplePagination({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  design,
  className,
}: SimplePaginationProps) {
  return <div className={cn("flex items-center justify-between gap-4", design && navigationDesignStyles[design], design && "p-2", className)}><Button variant="outline" size="sm" onClick={onPrevious} disabled={currentPage <= 1} leftIcon={<LuChevronLeft />}>Anterior</Button><span className="text-xs font-bold text-muted">{currentPage} de {totalPages}</span><Button variant="outline" size="sm" onClick={onNext} disabled={currentPage >= totalPages} rightIcon={<LuChevronRight />}>Siguiente</Button></div>;
}

"use client";

import { Pagination as HeroUIPagination } from "@heroui/react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
  size?: "sm" | "md" | "lg";
  showControls?: boolean;
  isCompact?: boolean;
  siblings?: number;
  boundaries?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onChange,
  size = "md",
  showControls = true,
  isCompact = false,
  siblings = 2,
  boundaries = 1,
}: PaginationProps) {
  const total = Math.max(1, Math.floor(totalPages));

  const page = Math.min(Math.max(1, Math.floor(currentPage || 1)), total);

  const maxMiddle = total - boundaries * 2 - 1;

  const effectiveSiblings =
    maxMiddle <= 0 ? 0 : Math.min(siblings, Math.floor(maxMiddle / 2));

  return (
    <HeroUIPagination
      key={`hp-${page}-${total}-${effectiveSiblings}-${boundaries}`}
      page={page}
      total={total}
      size={size}
      showControls={showControls}
      isCompact={isCompact}
      classNames={{
        item: "cursor-pointer",
        prev: "cursor-pointer",
        next: "cursor-pointer",
      }}
      onChange={(p: number) => onChange(p)}
      siblings={effectiveSiblings}
      boundaries={Math.min(boundaries, total)}
    />
  );
}

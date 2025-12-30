"use client";

import { Pagination as HeroUIPagination } from "@heroui/react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
  size?: "sm" | "md" | "lg";
  showControls?: boolean;
  isCompact?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onChange,
  size = "md",
  showControls = true,
  isCompact = false,
}: PaginationProps) {
  return (
    <HeroUIPagination
      page={currentPage}
      total={Math.max(1, totalPages)}
      size={size}
      showControls={showControls}
      isCompact={isCompact}
      onChange={(p: number) => {
        onChange(p);
      }}
    />
  );
}

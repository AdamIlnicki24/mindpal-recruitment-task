"use client";

import { CharactersList } from "@/components/CharactersList/CharactersList";

export function DashboardContent() {
  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-semibold">Dashboard</h1>
      <CharactersList />
    </div>
  );
}

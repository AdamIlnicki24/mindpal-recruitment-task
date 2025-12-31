"use client";

import { Pagination } from "@/components/Pagination/Pagination";
import { FAVORITES_URL, LOG_IN_URL } from "@/constants/urls";
import { useCharacters } from "@/hooks/api/characters/useCharacters";
import { useFavorites } from "@/hooks/api/favorites/useFavorites";
import { useAuth } from "@/hooks/auth/useAuth";
import { addToast, Spinner } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AddButton } from "../../buttons/AddButton/AddButton";
import { LogoutButton } from "../../buttons/LogoutButton/LogoutButton";
import { RemoveButton } from "../../buttons/RemoveButton/RemoveButton";
import { RedirectButton } from "@/components/buttons/RedirectButton/RedirectButton";
import { useRouter } from "next/navigation";

export function CharactersList() {
  const [page, setPage] = useState<number>(1);

  const router = useRouter();

  const { data, isLoading, isError } = useCharacters(page);

  const {
    favoriteIds,
    addFavorite,
    removeFavorite,
    isAdding,
    isRemoving,
    isLoading: isFavoritesLoading,
  } = useFavorites(1, 1000);

  const { isLoggedIn } = useAuth();

  const totalPages = data?.totalPages ?? 1;

  const favSet = new Set(favoriteIds);

  const onAdd = async (id: number, name: string, image?: string | null) => {
    if (!isLoggedIn) {
      window.location.href = `${LOG_IN_URL}?redirect=${encodeURIComponent(
        window.location.pathname
      )}`;
      return;
    }
    try {
      await addFavorite({ id, name, image });
      addToast({ color: "success", title: "Dodano do ulubionych" });
    } catch (e: any) {
      console.error(e);
      addToast({ color: "danger", title: "Błąd podczas dodawania" });
    }
  };

  const onRemove = async (id: number) => {
    try {
      await removeFavorite(id);
      addToast({ color: "success", title: "Usunięto z ulubionych" });
    } catch (e) {
      console.error(e);
      addToast({ color: "danger", title: "Błąd podczas usuwania" });
    }
  };

  return (
    <div className="min-h-svh">
      <div className="mb-4 grid grid-cols-1 items-center gap-4 pe-8 pb-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="flex justify-start">
          <RedirectButton
            title="Przejdź do Twoich ulubionych postaci"
            onPress={() => router.push(FAVORITES_URL)}
          />
        </div>
        <div className="order-first flex justify-center sm:order-none sm:col-span-2 lg:col-span-1">
          <h1 className="text-center text-[1.7rem] font-bold uppercase">
            Lista wszystkich postaci z Rick i Morty
          </h1>
        </div>
        <div className="flex justify-end sm:col-start-2 sm:justify-self-end lg:col-auto">
          <LogoutButton />
        </div>
      </div>

      {isLoading && (
        <div className="py-8 text-center">
          <Spinner size="md" />
        </div>
      )}

      {isError && <div className="text-red-600">Błąd podczas pobierania</div>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {data?.results?.map((c) => (
          <div
            key={c.id}
            className="flex items-center gap-3 rounded border p-3"
          >
            <div className="relative h-20 w-20 flex-shrink-0">
              {c.image ? (
                <Image
                  src={c.image}
                  alt={c.name}
                  width={80}
                  height={80}
                  className="rounded object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded bg-gray-100 text-sm">
                  Brak zdjęcia
                </div>
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-semibold">{c.name}</h3>
              <p className="text-sm">
                {c.species} {c.status ? `• ${c.status}` : ""}
              </p>
            </div>

            <div className="flex gap-2">
              {favSet.has(Number(c.id)) ? (
                <RemoveButton
                  removingFavorite={isRemoving(Number(c.id))}
                  onPress={() => onRemove(Number(c.id))}
                  disabled={isRemoving(Number(c.id)) || isFavoritesLoading}
                />
              ) : (
                <AddButton
                  addingFavorite={isAdding(Number(c.id))}
                  onPress={() => onAdd(Number(c.id), c.name, c.image ?? null)}
                  disabled={isAdding(Number(c.id)) || isFavoritesLoading}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onChange={(p) => setPage(p)}
        />
      </div>
    </div>
  );
}

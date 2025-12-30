"use client";

import { useState } from "react";
import Image from "next/image";
import { useCharacters } from "@/hooks/api/characters/useCharacters";
import { useFavorites } from "@/hooks/api/favorites/useFavorites";
import { Pagination } from "@/components/Pagination/Pagination";
import { addToast, Spinner } from "@heroui/react";
import { LOG_IN_URL } from "@/constants/urls";
import { useAuth } from "@/hooks/auth/useAuth";
import { Button } from "../buttons/Button/Button";

export function CharactersList() {
  const [page, setPage] = useState<number>(1);

  const { data, isLoading, isError } = useCharacters(page);

  const {
    favorites,
    addFavorite,
    removeFavorite,
    addingFavorite,
    removingFavorite,
  } = useFavorites(1, 1000);

  const { isLoggedIn } = useAuth();

  const totalPages = data?.totalPages ?? 1;

  const favSet = new Set(favorites);

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
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-medium">Lista postaci</h2>
      </div>

      {isLoading && (
        <div className="py-8 text-center">
          <Spinner size="md" />
        </div>
      )}

      {isError && <div className="text-red-600">Błąd podczas pobierania</div>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

              <div className="mt-3 flex gap-2">
                {favSet.has(c.id) ? (
                  <Button
                    title={
                      removingFavorite ? (
                        <Spinner size="sm" />
                      ) : (
                        "Usuń z ulubionych"
                      )
                    }
                    mode="primary"
                    onClick={() => onRemove(c.id)}
                    disabled={removingFavorite}
                  />
                ) : (
                  <Button
                    title={
                      addingFavorite ? (
                        <Spinner size="sm" />
                      ) : (
                        "Dodaj do ulubionych"
                      )
                    }
                    mode="secondary"
                    onClick={() => onAdd(c.id, c.name, c.image ?? null)}
                    disabled={addingFavorite}
                  />
                )}
              </div>
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

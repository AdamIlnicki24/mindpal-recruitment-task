"use client";

import { useState, useEffect } from "react";
import { useFavorites } from "@/hooks/api/favorites/useFavorites";
import { fetchCharactersByIds } from "@/supabase/characters";
import { Pagination } from "@/components/Pagination/Pagination";
import { Spinner, addToast } from "@heroui/react";

export function FavoritesContent() {
  const [page, setPage] = useState<number>(1);
  const pageSize = 6;
  const { favorites, totalFavorites, removeFavorite, removingFavorite } =
    useFavorites(page, pageSize);

  const [characters, setCharacters] = useState<any[]>([]);
  const [isLoadingChars, setIsLoadingChars] = useState(false);
  const totalPages = Math.max(1, Math.ceil((totalFavorites ?? 0) / pageSize));

  useEffect(() => {
    (async () => {
      if (!favorites || favorites.length === 0) {
        setCharacters([]);
        return;
      }
      setIsLoadingChars(true);
      try {
        const chars = await fetchCharactersByIds(favorites);
        setCharacters(chars);
      } catch (e) {
        console.error(e);
        addToast({ color: "danger", title: "Błąd podczas pobierania postaci" });
      } finally {
        setIsLoadingChars(false);
      }
    })();
  }, [favorites]);

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
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-semibold">Ulubione postaci</h1>

      {isLoadingChars ? (
        <div className="py-8 text-center">
          <Spinner size="md" />
        </div>
      ) : characters.length === 0 ? (
        <div>Nie masz jeszcze ulubionych postaci.</div>
      ) : (
        <div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {characters.map((c: any) => (
              <div key={c.id} className="flex gap-3 rounded border p-3">
                <img
                  src={c.image}
                  alt={c.name}
                  className="h-20 w-20 rounded object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{c.name}</h3>
                  <p className="text-sm">
                    {c.species} • {c.status}
                  </p>
                  <div className="mt-3">
                    <button
                      className="rounded border px-3 py-1"
                      onClick={() => onRemove(c.id)}
                      disabled={removingFavorite}
                    >
                      {removingFavorite ? (
                        <Spinner size="sm" />
                      ) : (
                        "Usuń z ulubionych"
                      )}
                    </button>
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
      )}
    </div>
  );
}

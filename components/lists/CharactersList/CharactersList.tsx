"use client";

import { RedirectButton } from "@/components/buttons/RedirectButton/RedirectButton";
import { Pagination } from "@/components/Pagination/Pagination";
import { FAVORITES_URL, LOG_IN_URL } from "@/constants/urls";
import { useCharacters } from "@/hooks/api/characters/useCharacters";
import { useFavorites } from "@/hooks/api/favorites/useFavorites";
import { useAuth } from "@/hooks/auth/useAuth";
import { addToast, Spinner } from "@heroui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AddButton } from "../../buttons/AddButton/AddButton";
import { RemoveButton } from "../../buttons/RemoveButton/RemoveButton";
import { LogOutButton } from "@/components/buttons/LogOutButton/LogOutButton";
import {
  ADD_FAVORITE_TOAST,
  ADD_FAVORITE_ERROR_TOAST,
  REMOVE_FAVORITE_ERROR_TOAST,
  REMOVE_FAVORITE_TOAST,
} from "@/constants/toasts";
import { REDIRECT_TO_FAVORITES_BUTTON_LABEL } from "@/constants/buttons";
import { ALL_CHARACTERS_LIST_HEADING } from "@/constants/headings";
import {
  FETCH_ERROR_MESSAGE,
  NO_IMAGE_ERROR_MESSAGE,
} from "@/constants/errorMessages";

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
      router.push(
        `${LOG_IN_URL}?redirect=${encodeURIComponent(window.location.pathname)}`
      );
      return;
    }
    try {
      await addFavorite({ id, name, image });
      addToast({ color: "success", title: ADD_FAVORITE_TOAST });
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.error(err);
      }
      addToast({ color: "danger", title: ADD_FAVORITE_ERROR_TOAST });
    }
  };

  const onRemove = async (id: number) => {
    try {
      await removeFavorite(id);
      addToast({ color: "success", title: REMOVE_FAVORITE_TOAST });
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.error(err);
      }
      addToast({ color: "danger", title: REMOVE_FAVORITE_ERROR_TOAST });
    }
  };

  return (
    <div className="min-h-svh">
      <div className="mb-4 grid grid-cols-1 items-center gap-4 pe-8 pb-4 lg:grid-cols-3">
        <div className="flex justify-center lg:justify-start">
          <RedirectButton
            title={REDIRECT_TO_FAVORITES_BUTTON_LABEL}
            onPress={() => router.push(FAVORITES_URL)}
          />
        </div>
        <div className="order-first flex justify-center lg:order-none lg:col-span-1">
          <h1 className="text-center text-[1.7rem] font-bold uppercase">
            {ALL_CHARACTERS_LIST_HEADING}
          </h1>
        </div>
        <div className="flex justify-center lg:justify-end">
          <LogOutButton />
        </div>
      </div>

      {isLoading && (
        <div className="py-8 text-center">
          <Spinner size="md" />
        </div>
      )}

      {isError && <div className="text-red-600">{FETCH_ERROR_MESSAGE}</div>}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
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
                <div className="flex h-20 w-20 items-center justify-center rounded bg-gray-100 text-lg">
                  {NO_IMAGE_ERROR_MESSAGE}
                </div>
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-semibold">{c.name}</h3>
              <p className="text-lg">
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
          siblings={2}
          boundaries={2}
        />
      </div>
    </div>
  );
}

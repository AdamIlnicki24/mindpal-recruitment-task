import { useAuth } from "@/hooks/auth/useAuth";
import { supabase } from "@/supabase/supabaseClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const PAGE_SIZE = 10;
type Favorite = {
  id: number;
  name: string;
  image: string | null;
};
const EMPTY_FAVORITES: Favorite[] = [];

type AddFavoriteInput = {
  id: number;
  name: string;
  image?: string | null;
};

export function useFavorites(page = 1, pageSize = PAGE_SIZE) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const userId = user?.id ?? null;

  const query = useQuery({
    queryKey: ["favorites", userId, page, pageSize],
    queryFn: async () => {
      if (!userId) return { items: [] as Favorite[], total: 0 };

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await supabase
        .from("favorite_characters")
        .select("character_id, character_name, character_image", { count: "exact" })
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      const items: Favorite[] = (data ?? []).map((r) => ({
        id: Number(r.character_id),
        name: r.character_name,
        image: r.character_image,
      }));
      return { items, total: count ?? items.length };
    },
  });

  const [addingIds, setAddingIds] = useState<Set<number>>(new Set());
  const [removingIds, setRemovingIds] = useState<Set<number>>(new Set());

  const addMutation = useMutation({
    mutationFn: async (payload: AddFavoriteInput) => {
      if (!userId) throw new Error("Not authenticated");

      const { error } = await supabase.from("favorite_characters").insert({
        user_id: userId,
        character_id: payload.id,
        character_name: payload.name,
        character_image: payload.image ?? null,
      });

      if (error) {
        if (error.code === "23505") {
          // unique violation -> already exists
          return payload.id;
        }
        throw error;
      }
      return payload.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", userId] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (characterId: number) => {
      if (!userId) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("favorite_characters")
        .delete()
        .eq("user_id", userId)
        .eq("character_id", characterId);
      if (error) throw error;
      return characterId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", userId] });
    },
  });

  const addFavorite = async (input: AddFavoriteInput) => {
    setAddingIds((prev) => new Set(prev).add(input.id));
    try {
      return await addMutation.mutateAsync(input);
    } finally {
      setAddingIds((prev) => {
        const copy = new Set(prev);
        copy.delete(input.id);
        return copy;
      });
    }
  };

  const removeFavorite = async (id: number) => {
    setRemovingIds((prev) => new Set(prev).add(id));
    try {
      return await removeMutation.mutateAsync(id);
    } finally {
      setRemovingIds((prev) => {
        const copy = new Set(prev);
        copy.delete(id);
        return copy;
      });
    }
  };

  const favorites = query.data?.items ?? EMPTY_FAVORITES;

  return {
    ...query,
    favorites,
    favoriteIds: favorites.map((f) => f.id),
    totalFavorites: query.data?.total ?? 0,
    addFavorite,
    removingFavorite: removeMutation.isPending,
    addingFavorite: addMutation.isPending,
    removeFavorite,
    pageSize,
    addingIds,
    removingIds,
    isAdding: (id: number) => addingIds.has(id),
    isRemoving: (id: number) => removingIds.has(id),
  };
}

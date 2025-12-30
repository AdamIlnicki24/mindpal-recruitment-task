"use client";

import { useAuth } from "@/hooks/auth/useAuth";
import { supabase } from "@/supabase/supabaseClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const PAGE_SIZE = 10;

type AddFavoriteInput = {
  id: number;
  name: string;
  image?: string | null;
};

export function useFavorites(page = 1, pageSize = PAGE_SIZE) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const userId = (user as any)?.id ?? null;

  const query = useQuery({
    queryKey: ["favorites", userId, page, pageSize],
    queryFn: async () => {
      if (!userId) return { items: [] as number[], total: 0 };

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await supabase
        .from("favorite_characters")
        .select("character_id", { count: "exact" })
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      const items = (data ?? []).map((r: any) => Number(r.character_id));
      return { items, total: count ?? items.length };
    },
  });

  const addMutation = useMutation({
    mutationFn: async (payload: AddFavoriteInput) => {
      if (!userId) throw new Error("Not authenticated");
      
      const { error } = await supabase.from("favorite_characters").insert({
        user_id: userId,
        character_id: payload.id,
        character_name: payload.name,
        character_image: payload.image ?? null,
      });
      if (error) throw error;
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

  return {
    ...query,
    favorites: query.data?.items ?? [],
    totalFavorites: query.data?.total ?? 0,
    addFavorite: (input: AddFavoriteInput) => addMutation.mutateAsync(input),
    removingFavorite: removeMutation.isPending,
    addingFavorite: addMutation.isPending,
    removeFavorite: (id: number) => removeMutation.mutateAsync(id),
    pageSize,
  };
}

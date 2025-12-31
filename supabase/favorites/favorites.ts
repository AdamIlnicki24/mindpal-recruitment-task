import { supabase } from "../supabaseClient";


export async function getFavoritesIds(page = 1, pageSize = 6) {
  const from = (page - 1) * pageSize;
  const to = page * pageSize - 1;

  const { data, error, count } = await supabase
    .from("favorite_characters")
    .select("id, character_id, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { rows: data ?? [], total: count ?? 0 };
}

export async function addFavorite({
  character_id,
  character_name,
  character_image,
}: {
  character_id: number;
  character_name?: string;
  character_image?: string;
}) {
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("favorite_characters")
    .insert([
      {
        user_id: user.id,
        character_id,
        character_name,
        character_image,
      },
    ])
    .select();

  if (error) throw error;
  return data;
}

export async function removeFavoriteById(favoriteId: number) {
  const { error } = await supabase
    .from("favorite_characters")
    .delete()
    .eq("id", favoriteId);
  if (error) throw error;
  return true;
}

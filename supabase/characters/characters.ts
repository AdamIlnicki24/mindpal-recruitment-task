import { RICK_AND_MORTY_API_ENDPOINT } from "@/constants/apiEndpoints";

export async function fetchCharactersByIds(ids: number[]) {
  if (!ids || ids.length === 0) return [];

  const path = `${RICK_AND_MORTY_API_ENDPOINT}/api/character/${ids.join(",")}`;

  const res = await fetch(path);

  if (!res.ok) throw new Error("Failed to fetch characters by ids");

  const json = await res.json();

  if (!Array.isArray(json)) return [json];
  
  return json;
}

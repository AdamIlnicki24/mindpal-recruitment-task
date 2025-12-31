"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/supabase/supabaseClient";
import { Character } from "@/types/character";

const GET_CHARACTERS_QUERY = `
  query GetCharacters($page: Int) {
    characters(page: $page) {
      info { pages, count }
      results { id name image species status }
    }
  }
`;

export function useCharacters(page: number) {

  return useQuery({
    queryKey: ["characters", page],
    queryFn: async (): Promise<{
      results: Character[];
      totalPages: number;
      count: number;
    }> => {
      const body = { query: GET_CHARACTERS_QUERY, variables: { page } };

      const { data, error } = await supabase.functions.invoke("rm-graphql", {
        body: JSON.stringify(body),
      });

      if (error) {
        throw error;
      }

      const json = data;

      return {
        results: json.data?.characters?.results ?? [],
        totalPages: json.data?.characters?.info?.pages ?? 1,
        count:
          json.data?.characters?.info?.count ??
          json.data?.characters?.results?.length ??
          0,
      };
    },
    retry: (failureCount, error) => {
      return error?.message !== "User not authenticated" && failureCount < 3;
    },
    enabled: page > 0,
  });
}

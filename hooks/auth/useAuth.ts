"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/supabase/supabaseClient";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface AuthState {
  isLoggedIn: boolean;
  isPending: boolean;
  user: SupabaseUser | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    isPending: true,
    user: null,
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        const user = session?.user ?? null;
        setAuthState({
          isLoggedIn: !!user,
          isPending: false,
          user,
        });

        await queryClient.invalidateQueries({ queryKey: ["getMe"] });
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.error(error);
        }
        if (!mounted) return;
        setAuthState({ isLoggedIn: false, isPending: false, user: null });
        await queryClient.invalidateQueries({ queryKey: ["getMe"] });
      }
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      const user = session?.user ?? null;
      setAuthState({
        isLoggedIn: !!user,
        isPending: false,
        user,
      });

      try {
        await queryClient.invalidateQueries({ queryKey: ["getMe"] });
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.error(err);
        }
        if (!mounted) return;
        setAuthState({ isLoggedIn: false, isPending: false, user: null });
        await queryClient.invalidateQueries({ queryKey: ["getMe"] });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [queryClient]);

  return { ...authState };
}

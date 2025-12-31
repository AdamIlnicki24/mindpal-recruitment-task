"use client";

import Loading from "@/app/loading";
import { useAuth } from "@/hooks/auth/useAuth";
import { createContext, ReactNode, useEffect, useState } from "react";
import { supabase } from "@/supabase/supabaseClient";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { User } from "@/types/user";

interface UserContextProps {
  user: User | null;
  logOut: () => Promise<void>;
  isUserLoading: boolean;
  isError: boolean;
}

export const UserContext = createContext<UserContextProps>({
  user: null,
  logOut: async () => {},
  isUserLoading: false,
  isError: false,
});

export function UserProvider({ children }: { children: ReactNode }) {
  // Pobieramy status auth i raw supabase usera z useAuth (już w projekcie)
  const { isLoggedIn, isPending, user: supabaseUser } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // mapowanie SupabaseUser -> nasz User
    const mapUser = (u: SupabaseUser | null): User | null => {
      if (!u) return null;
      // Supabase user object może trzymać dane w user_metadata
      const metadata: any = (u as any).user_metadata ?? {};
      return {
        id: u.id,
        email: u.email ?? null,
        fullName: metadata.fullName ?? metadata.name ?? null,
        avatarUrl: metadata.avatar_url ?? metadata.avatarUrl ?? null,
      };
    };

    try {
      if (isPending) {
        // początkowy stan - nic nie robimy
        return;
      }

      if (!isLoggedIn) {
        setUser(null);
        return;
      }

      // jeśli jest user od supabase -> ustaw
      setUser(mapUser(supabaseUser ?? null));
      setIsError(false);
    } catch (e) {
      console.error("UserProvider mapping error:", e);
      setIsError(true);
      setUser(null);
    }
  }, [isPending, isLoggedIn, supabaseUser]);

  const logOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error("Sign out error:", e);
    }
  };

  if (isPending) {
    return <Loading />;
  }

  return (
    <UserContext.Provider
      value={{
        user,
        logOut,
        isUserLoading: isPending,
        isError,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

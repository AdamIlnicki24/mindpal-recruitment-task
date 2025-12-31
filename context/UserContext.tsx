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
  const { isLoggedIn, isPending, user: supabaseUser } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const mapUser = (u: SupabaseUser | null): User | null => {
      if (!u) return null;

      const metadata = u.user_metadata as {
        fullName?: string;
        name?: string;
        avatar_url?: string;
        avatarUrl?: string;
      };

      return {
        id: u.id,
        email: u.email ?? null,
        fullName: metadata.fullName ?? metadata.name ?? null,
        avatarUrl: metadata.avatar_url ?? metadata.avatarUrl ?? null,
      };
    };

    try {
      if (isPending) {
        return;
      }

      if (!isLoggedIn) {
        setUser(null);
        return;
      }

      setUser(mapUser(supabaseUser ?? null));
      setIsError(false);
    } catch (e) {
      if (process.env.NODE_ENV !== "production") {
        console.error(e);
      }
      setIsError(true);
      setUser(null);
    }
  }, [isPending, isLoggedIn, supabaseUser]);

  const logOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.error(err);
      }
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

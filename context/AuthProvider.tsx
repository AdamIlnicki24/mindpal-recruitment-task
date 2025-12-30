"use client";

import Loading from "@/app/loading";
import { LOG_IN_URL, DASHBOARD_URL } from "@/constants/urls";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useAuth } from "@/hooks/auth/useAuth";
import { UserProvider } from "./UserContext";

interface AuthProviderProps {
  children: ReactNode;
  type: "public" | "private";
}

export function AuthProvider({ children, type }: AuthProviderProps) {
  const router = useRouter();
  const { isLoggedIn, isPending } = useAuth();

  useEffect(() => {
    if (type === "public" && isLoggedIn) {
      router.replace(DASHBOARD_URL);
    }
  }, [type, isLoggedIn, router]);

  useEffect(() => {
    if (type === "private" && !isPending && !isLoggedIn) {
      const redirectPath =
        typeof window !== "undefined"
          ? `${window.location.pathname}${window.location.search || ""}`
          : "/";
      router.replace(
        `${LOG_IN_URL}?redirect=${encodeURIComponent(redirectPath)}`
      );
    }
  }, [type, isPending, isLoggedIn, router]);

  if (isPending) return <Loading />;

  return <UserProvider>{children}</UserProvider>;
}

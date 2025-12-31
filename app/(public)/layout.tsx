import { AuthProvider } from "@/context/AuthProvider";
import { ReactNode } from "react";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <AuthProvider type="public">{children}</AuthProvider>;
}

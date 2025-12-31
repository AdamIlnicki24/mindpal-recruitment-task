import { AuthProvider } from "@/context/AuthProvider";
import { ReactNode } from "react";

export default function PrivateLayout({ children }: { children: ReactNode }) {
  return <AuthProvider type="private">{children}</AuthProvider>;
}

import { LogInContent } from "./(public)/log-in/LogInContent/LogInContent";
import { AuthProvider } from "@/context/AuthProvider";

export default function LogInPage() {
  return (
    <AuthProvider type="public">
      <LogInContent />
    </AuthProvider>
  );
}

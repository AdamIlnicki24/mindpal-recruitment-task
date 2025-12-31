"use client";

import { Button } from "@/components/buttons/Button/Button";
import {
  LOGGING_OUT_BUTTON_LABEL,
  LOG_OUT_BUTTON_LABEL,
} from "@/constants/buttons";
import { LOG_OUT_SUCCESS_TOAST } from "@/constants/toasts";
import { LOG_IN_URL } from "@/constants/urls";
import { supabase } from "@/supabase/supabaseClient";
import { addToast } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      addToast({ color: "danger", title: "Błąd wylogowania" });
      setLoading(false);
      return;
    }
    addToast({ color: "success", title: LOG_OUT_SUCCESS_TOAST });
    router.replace(LOG_IN_URL);
  };

  return (
    <Button
      title={loading ? LOGGING_OUT_BUTTON_LABEL : LOG_OUT_BUTTON_LABEL}
      onClick={handleLogout}
      disabled={loading}
      size="sm"
      className="bg-defaultGray"
    />
  );
}

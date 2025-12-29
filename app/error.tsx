"use client";

import { Button } from "@/components/Button/Button";
import { TRY_AGAIN_BUTTON_LABEL } from "@/constants/buttons";
import { SOMETHING_WENT_WRONG } from "@/constants/errorMessages";
import { useEffect } from "react";

export default function Error({
  error,
  reset,  
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
  }, [error]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <h2>{SOMETHING_WENT_WRONG}</h2>
      <div className="mt-5">
        <Button onPress={() => reset()} title={TRY_AGAIN_BUTTON_LABEL} />
      </div>
    </div>
  );
}

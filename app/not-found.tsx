"use client";

import { Button } from "@/components/buttons/Button/Button";
import { BACK_TO_HOMEPAGE_BUTTON_LABEL } from "@/constants/buttons";
import { PAGE_DOES_NOT_EXIST } from "@/constants/errorMessages";
import { HOME_URL } from "@/constants/urls";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  const backToHomepageHandler = () => router.push(HOME_URL);

  return (
    <div className="mt-5 flex min-h-svh flex-col items-center justify-center gap-y-4">
      <h1>{PAGE_DOES_NOT_EXIST}</h1>
      <Button
        onPress={backToHomepageHandler}
        title={BACK_TO_HOMEPAGE_BUTTON_LABEL}
      />
    </div>
  );
}

"use client";

import { Spinner } from "@heroui/react";
import { WAIT } from "../constants/texts";

export default function Loading() {
  return (
    <div className="flex h-svh flex-col items-center justify-center">
      <div className="text-[1.25rem] text-black">{WAIT}</div>
      <Spinner size="lg" className="mt-5" />
    </div>
  );
}

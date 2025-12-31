"use client";

import { Input, InputProps } from "@heroui/react";

export function TextInput({ ...properties }: InputProps) {
  return (
    <div className="relative w-full">
      <Input
        classNames={{
          label: "text-black text-[0.9rem] pb-1",
          input: "text-black text-[1.1rem]",
          inputWrapper: "shadow-none",
          errorMessage: "font-bold text-[1rem]",
          clearButton: "text-black/80",
        }}
        size="lg"
        labelPlacement="inside"
        variant="faded"
        {...properties}
      />
    </div>
  );
}

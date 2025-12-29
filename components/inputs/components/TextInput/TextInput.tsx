"use client";

import { Input, InputProps } from "@heroui/react";
import { ChangeEvent, useEffect, useState } from "react";

export interface TextInputProps extends InputProps {
  isCounterShown?: boolean;
}

export function TextInput({
  isCounterShown,
  ...properties
}: TextInputProps) {
  const [currentLength, setCurrentLength] = useState(
    properties.value?.toString().length || 0
  );

  const maxLength = properties.maxLength;

  useEffect(() => {
    setCurrentLength(properties.value?.toString().length || 0);
  }, [properties.value]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentLength(event.target.value.length);
    if (properties.onChange) {
      properties.onChange(event);
    }
  };

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
        onChange={handleInputChange}
        labelPlacement="inside"
        {...properties}
      />
      {isCounterShown && maxLength && (
        <div className="absolute right-0 top-0 pe-3 text-end text-[0.8rem] text-defaultGray">
          {currentLength} / {maxLength}
        </div>
      )}
    </div>
  );
}

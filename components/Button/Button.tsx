import {
  Button as HeroUIButton,
  ButtonProps as HeroUIButtonProps,
} from "@heroui/react";
import { ReactNode } from "react";

export interface ButtonProps extends Omit<HeroUIButtonProps, "title"> {
  title: ReactNode;
  mode?: "primary" | "secondary";
}

export function Button({ title, mode = "primary", ...properties }: ButtonProps) {
  const buttonStyle =
    mode === "secondary"
      ? "bg-primaryColor text-white"
      : "bg-white text-primaryColor";

  return (
    <HeroUIButton
      className={`rounded-xl lg:px-10 lg:py-7 lg:text-[1.25rem] font-bold ${buttonStyle}`}
      mode={mode}
      size="lg"
      {...properties}
    >
      {title}
    </HeroUIButton>
  );
}

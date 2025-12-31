import {
  Button as HeroUIButton,
  ButtonProps as HeroUIButtonProps,
} from "@heroui/react";
import { ReactNode } from "react";

export interface ButtonProps extends Omit<HeroUIButtonProps, "title"> {
  title: ReactNode;
}

export function Button({ title, className, ...properties }: ButtonProps) {
  return (
    <HeroUIButton
      className={`bg-primaryColor rounded-xl p-5 text-[1rem] font-bold text-white ${
        className || "bg-primaryColor"
      }`}
      {...properties}
    >
      {title}
    </HeroUIButton>
  );
}

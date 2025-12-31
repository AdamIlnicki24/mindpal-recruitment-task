import { Button, ButtonProps } from "@heroui/react";

interface RedirectButtonProps extends ButtonProps {
  title: string;
}

export function RedirectButton({ title, ...properties }: RedirectButtonProps) {
  return (
    <Button className="font-bold text-[1rem] bg-primaryColor text-white" {...properties}>
      {title}
    </Button>
  );
}

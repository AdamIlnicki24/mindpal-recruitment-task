import { Button, ButtonProps, Spinner } from "@heroui/react";

interface RemoveButtonProps extends ButtonProps {
  removingFavorite: boolean;
}

export function RemoveButton({
  removingFavorite,
  ...properties
}: RemoveButtonProps) {
  return (
    <Button className="bg-defaultRed font-bold text-white" {...properties}>
      {removingFavorite ? <Spinner size="sm" /> : "Usuń z ulubionych"}
    </Button>
  );
}

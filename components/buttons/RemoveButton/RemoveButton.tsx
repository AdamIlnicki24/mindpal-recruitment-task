import { REMOVE_FAVORITE_BUTTON_LABEL } from "@/constants/buttons";
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
      {removingFavorite ? <Spinner size="sm" /> : REMOVE_FAVORITE_BUTTON_LABEL}
    </Button>
  );
}

import { Button, ButtonProps, Spinner } from "@heroui/react";
import { ADD_FAVORITE_BUTTON_LABEL } from "@/constants/buttons";

interface AddButtonProps extends ButtonProps {
  addingFavorite: boolean;
}

export function AddButton({ addingFavorite, ...properties }: AddButtonProps) {
  return (
    <Button className="bg-primaryColor font-bold text-white" {...properties}>
      {addingFavorite ? <Spinner size="sm" /> : ADD_FAVORITE_BUTTON_LABEL}
    </Button>
  );
}

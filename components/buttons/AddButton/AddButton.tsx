import { Button, ButtonProps, Spinner } from "@heroui/react";

interface AddButtonProps extends ButtonProps {
  addingFavorite: boolean;
}

export function AddButton({ addingFavorite, ...properties }: AddButtonProps) {
  return (
    <Button className="bg-primaryColor font-bold text-white" {...properties}>
      {addingFavorite ? <Spinner size="sm" /> : "Dodaj do ulubionych"}
    </Button>
  );
}

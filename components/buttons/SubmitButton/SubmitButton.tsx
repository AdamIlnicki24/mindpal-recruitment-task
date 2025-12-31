import { useFormikContext } from "formik";
import { Button, ButtonProps } from "../Button/Button";

export function SubmitButton({ ...properties }: ButtonProps) {
  const { handleSubmit } = useFormikContext();

  return (
    <div className="flex justify-center pt-4">
      <Button onPress={() => handleSubmit()} {...properties} />
    </div>
  );
}

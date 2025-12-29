import { PASSWORD_LABEL } from "@/constants/labels";
import { PASSWORD_MAX_LENGTH } from "@/constants/lengths";
import { PASSWORD_PLACEHOLDER } from "@/constants/placeholders";
import { useFormikContext } from "formik";
import { TextInput, TextInputProps } from "../components/TextInput/TextInput";

export function PasswordInput({ ...properties }: TextInputProps) {
  const { handleChange, handleBlur, errors, touched, values } =
    useFormikContext<{
      password: string;
    }>();

  return (
    <TextInput
      type="password"
      value={values.password}
      onChange={handleChange("password")}
      onBlur={handleBlur("password")}
      isInvalid={touched.password && !!errors.password}
      errorMessage={touched.password && errors.password}
      isRequired
      label={PASSWORD_LABEL}
      placeholder={PASSWORD_PLACEHOLDER}
      maxLength={PASSWORD_MAX_LENGTH}
      {...properties}
    />
  );
}

import { EMAIL_LABEL } from "@/constants/labels";
import { EMAIL_MAX_LENGTH } from "@/constants/lengths";
import { EMAIL_PLACEHOLDER } from "@/constants/placeholders";
import { useFormikContext } from "formik";
import { TextInput, TextInputProps } from "../components/TextInput/TextInput";

export function EmailInput({ ...properties }: TextInputProps) {
  const { handleChange, handleBlur, errors, touched, setFieldValue } =
    useFormikContext<{ email: string }>();

  return (
    <TextInput
      type="email"
      onChange={handleChange("email")}
      onBlur={handleBlur("email")}
      isInvalid={touched.email && !!errors.email}
      errorMessage={touched.email && errors.email}
      isRequired
      isClearable
      onClear={() => {
        setFieldValue("email", "");
      }}
      label={EMAIL_LABEL}
      placeholder={EMAIL_PLACEHOLDER}
      maxLength={EMAIL_MAX_LENGTH}
      {...properties}
    />
  );
}

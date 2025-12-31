import {
  EMAIL_ERROR_MESSAGE,
  MAX_LENGTH_ERROR_MESSAGE,
  PASSWORD_ERROR_MESSAGE,
  REQUIRED,
} from "@/constants/errorMessages";
import { EMAIL_MAX_LENGTH, PASSWORD_MAX_LENGTH } from "@/constants/lengths";
import { PASSWORD_REGEX } from "@/constants/regex";
import { object, string } from "yup";

export interface LogInFormData {
  email: string;
  password: string;
}

export const logInFormSchema = object({
  email: string()
    .email(EMAIL_ERROR_MESSAGE)
    .max(
      EMAIL_MAX_LENGTH,
      `${MAX_LENGTH_ERROR_MESSAGE} ${EMAIL_MAX_LENGTH} znaków`
    )
    .required(REQUIRED),
  password: string()
    .matches(PASSWORD_REGEX, PASSWORD_ERROR_MESSAGE)
    .max(
      PASSWORD_MAX_LENGTH,
      `${MAX_LENGTH_ERROR_MESSAGE} ${PASSWORD_MAX_LENGTH} znaków`
    )
    .required(REQUIRED),
});

export const initialValues: LogInFormData = {
  email: "",
  password: "",
};

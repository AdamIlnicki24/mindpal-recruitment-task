"use client";

import { SubmitButton } from "@/components/buttons/SubmitButton/SubmitButton";
import { EmailInput } from "@/components/inputs/EmailInput/EmailInput";
import { PasswordInput } from "@/components/inputs/PasswordInput/PasswordInput";
import { SIGN_UP_BUTTON_LABEL } from "@/constants/buttons";
import {
  EXISTING_USER_ERROR_TOAST,
  SIGN_UP_ERROR_TOAST,
  SIGN_UP_SUCCESS_TOAST,
} from "@/constants/toasts";
import { DASHBOARD_URL, LOG_IN_URL } from "@/constants/urls";
import Link from "next/link";
import { supabase } from "@/supabase/supabaseClient";
import { addToast, Spinner } from "@heroui/react";
import { Formik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SignUpFormData, signUpFormSchema } from "./signUpFormSchema";

interface SignUpFormProps {
  initialValues: SignUpFormData;
}

export function SignUpForm({ initialValues }: SignUpFormProps) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const onSubmitHandler = async (values: SignUpFormData) => {
    setIsPending(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (error) {
        const doesEmailExist =
          /already|exists|duplicate|user already exists|already registered/i.test(
            error.message || ""
          ) || error.status === 409;

        addToast({
          color: "danger",
          title: doesEmailExist
            ? EXISTING_USER_ERROR_TOAST
            : SIGN_UP_ERROR_TOAST,
        });

        setIsPending(false);
        return;
      }

      addToast({
        color: "success",
        title: SIGN_UP_SUCCESS_TOAST,
      });

      const redirectParam = searchParams?.get("redirect") ?? "";
      const redirectPath = redirectParam
        ? decodeURIComponent(redirectParam)
        : DASHBOARD_URL;

      router.replace(redirectPath);

      setIsPending(false);
    } catch (err) {
      addToast({
        color: "danger",
        title: SIGN_UP_ERROR_TOAST,
      });
      setIsPending(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmitHandler}
      validationSchema={signUpFormSchema}
    >
      {() => (
        <div className="flex w-full flex-col gap-4">
          <div className="grid grid-cols-1 gap-4">
            <EmailInput />
            <PasswordInput />
          </div>

          <SubmitButton
            title={isPending ? <Spinner size="md" /> : SIGN_UP_BUTTON_LABEL}
            mode="secondary"
          />

          <div className="mt-4 text-center text-sm text-gray-500">
            Masz już konto?{" "}
            <Link
              href={LOG_IN_URL}
              className="text-primary cursor-pointer hover:underline"
            >
              Zaloguj się
            </Link>
          </div>
        </div>
      )}
    </Formik>
  );
}

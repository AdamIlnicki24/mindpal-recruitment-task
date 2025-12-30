"use client";

import { SubmitButton } from "@/components/buttons/SubmitButton/SubmitButton";
import { LOG_IN_BUTTON_LABEL } from "@/constants/buttons";
import {
  LOG_IN_ERROR_TOAST,
  LOG_IN_INVALID_CREDENTIALS_TOAST,
  LOG_IN_SUCCESS_TOAST,
} from "@/constants/toasts";
import { addToast, Spinner } from "@heroui/react";
import { Formik } from "formik";
import { useState } from "react";
import { LogInFormData, logInFormSchema } from "./logInFormSchema";
import { EmailInput } from "@/components/inputs/EmailInput/EmailInput";
import { PasswordInput } from "@/components/inputs/PasswordInput/PasswordInput";
import { supabase } from "@/supabase/supabaseClient";
import { useRouter, useSearchParams } from "next/navigation";
import { DASHBOARD_URL } from "@/constants/urls";

interface LogInFormProps {
  initialValues: LogInFormData;
}

export function LogInForm({ initialValues }: LogInFormProps) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const onSubmitHandler = async (values: LogInFormData) => {
    setIsPending(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        const isInvalidCredentials =
          error.status === 400 ||
          /invalid|credentials|password|email/i.test(error.message || "");

        addToast({
          color: "danger",
          title: isInvalidCredentials
            ? LOG_IN_INVALID_CREDENTIALS_TOAST
            : LOG_IN_ERROR_TOAST,
        });

        setIsPending(false);
        return;
      }

      addToast({
        color: "success",
        title: LOG_IN_SUCCESS_TOAST,
      });

      const redirectParam = searchParams?.get("redirect") ?? "";
      const redirectPath = redirectParam
        ? decodeURIComponent(redirectParam)
        : DASHBOARD_URL;
      router.replace(redirectPath);
      setIsPending(false);
    } catch (error) {
      console.error("Login error:", error);
      addToast({
        color: "danger",
        title: LOG_IN_ERROR_TOAST,
      });

      setIsPending(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmitHandler}
      validationSchema={logInFormSchema}
    >
      {() => (
        <div className="flex w-full flex-col gap-4 lg:w-[60%]">
          <div className="grid grid-cols-1 gap-4">
            <EmailInput />
            <PasswordInput />
          </div>
          <SubmitButton
            title={isPending ? <Spinner size="md" /> : LOG_IN_BUTTON_LABEL}
            mode="secondary"
          />
        </div>
      )}
    </Formik>
  );
}

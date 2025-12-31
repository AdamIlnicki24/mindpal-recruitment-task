import { SignUpForm } from "@/components/forms/SignUpForm/SignUpForm";

export function SignUpContent() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] w-full items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-center text-4xl font-bold uppercase">
          Rick i Morty
        </h1>
        <SignUpForm
          initialValues={{
            email: "",
            password: "",
          }}
        />
      </div>
    </div>
  );
}

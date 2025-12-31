import { LogInForm } from "@/components/forms/LogInForm/LogInForm";

export function LogInContent() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] w-full items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-center text-4xl font-bold uppercase">
          Rick i Morty
        </h1>
        <LogInForm
          initialValues={{
            email: "",
            password: "",
          }}
        />
      </div>
    </div>
  );
}

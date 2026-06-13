import { Suspense } from "react";
import LoginForm from "./login-form";

export const metadata = { title: "Accedi" };

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#080a09] text-zinc-500">Caricamento...</div>}>
      <LoginForm />
    </Suspense>
  );
}

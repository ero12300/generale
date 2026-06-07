import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="text-zinc-400 text-center p-8">Caricamento...</p>}>
      <LoginForm />
    </Suspense>
  );
}

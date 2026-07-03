"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Toaster } from "sonner";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--primary-dark)] to-[var(--primary)] flex items-center justify-center animate-pulse">
            <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-[var(--muted)] text-sm animate-pulse">Caricamento...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen bg-[var(--background)] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-full">{children}</div>
      </main>
      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            background: "var(--card)",
            border: "1px solid var(--border)",
            color: "var(--foreground)",
          },
        }}
      />
    </div>
  );
}

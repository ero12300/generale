import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getAuthContext, getSupabaseClient } from "@/lib/auth/session";
import { DemoRepository } from "@/lib/data/demo-repository";
import { SupabaseRepository } from "@/lib/data/supabase-repository";
import type { DataRepository } from "@/lib/data/repository";

export class UnauthorizedError extends Error {
  constructor() {
    super("UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}

export async function getDataRepository(): Promise<DataRepository> {
  if (!isSupabaseConfigured()) {
    return new DemoRepository();
  }

  const context = await getAuthContext();
  if (!context) {
    throw new UnauthorizedError();
  }

  const supabase = await getSupabaseClient();
  return new SupabaseRepository(supabase, context);
}

export async function tryGetDataRepository(): Promise<DataRepository | null> {
  try {
    return await getDataRepository();
  } catch (err) {
    if (err instanceof UnauthorizedError) return null;
    throw err;
  }
}

export function isDemoMode(): boolean {
  return !isSupabaseConfigured();
}

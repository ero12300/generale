import { getAuthContext, getSupabaseClient } from "@/lib/auth/session";
import { DemoBarberRepository } from "@/lib/barber/demo-repository";
import type { BarberRepository } from "@/lib/barber/repository";
import { SupabaseBarberRepository } from "@/lib/barber/supabase-repository";
import { UnauthorizedError } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export async function getBarberRepository(): Promise<BarberRepository> {
  if (!isSupabaseConfigured()) {
    return new DemoBarberRepository();
  }

  const context = await getAuthContext();
  if (!context) throw new UnauthorizedError();
  const supabase = await getSupabaseClient();
  return new SupabaseBarberRepository(supabase, context);
}

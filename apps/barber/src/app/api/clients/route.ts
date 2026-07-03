import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getStore } from "@/lib/store";
import { handleRouteError, jsonError } from "@/lib/api-helpers";

export async function GET() {
  try {
    const store = await getStore();
    const [clients, appointments] = await Promise.all([
      store.listClients(),
      store.listAppointments(),
    ]);
    // Arricchisce ogni cliente con visite completate e quanti amici ha portato
    const enriched = clients.map((client) => {
      const visits = appointments.filter(
        (a) => a.clientId === client.id && a.status === "completato",
      ).length;
      const referred = clients.filter(
        (c) => c.referredBy === client.referralCode,
      ).length;
      return { ...client, visits, referred };
    });
    return NextResponse.json({ clients: enriched });
  } catch (error) {
    return handleRouteError(error);
  }
}

const clientSchema = z.object({
  name: z.string().min(2).max(80),
  phone: z.string().min(6).max(20),
  email: z.string().email().optional().or(z.literal("")),
  notes: z.string().max(300).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const input = clientSchema.parse(await request.json());
    const store = await getStore();
    const existing = await store.findClientByPhone(input.phone);
    if (existing) {
      return jsonError("Esiste già un cliente con questo telefono.", 409);
    }
    const client = await store.createClient({
      name: input.name,
      phone: input.phone,
      email: input.email || undefined,
      notes: input.notes,
    });
    return NextResponse.json({ client }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}

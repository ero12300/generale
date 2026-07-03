import { z } from "zod";

export const createBarberAppointmentSchema = z.object({
  client_name: z.string().trim().min(2, "Nome cliente obbligatorio").max(120),
  phone: z.string().trim().min(8, "Telefono obbligatorio").max(30),
  email: z.string().email("Email non valida").nullable().optional().or(z.literal("")),
  service_ids: z.array(z.string().trim().min(1)).min(1, "Seleziona almeno un servizio"),
  barber_name: z.string().trim().min(2, "Barbiere obbligatorio").max(80),
  starts_at: z.string().datetime("Data prenotazione non valida"),
  notes: z.string().max(500).nullable().optional(),
  channel: z.enum(["app", "instagram", "phone", "walk_in"]).default("app"),
  referral_code: z.string().trim().max(40).nullable().optional().or(z.literal("")),
});

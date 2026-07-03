"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Staff } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Field, Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { Plus, User } from "lucide-react";

export function StaffManager({ initial }: { initial: Staff[] }) {
  const [staff, setStaff] = useState(initial);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [color, setColor] = useState("#c9a24a");
  const [loading, setLoading] = useState(false);
  const { push } = useToast();
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, role, color }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as { staff: Staff };
      setStaff((prev) => [...prev, data.staff]);
      push({ kind: "success", title: "Membro team aggiunto" });
      setOpen(false);
      setName(""); setRole("");
      router.refresh();
    } catch (err) {
      push({ kind: "error", title: "Errore", description: err instanceof Error ? err.message : "" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        {staff.map((s) => (
          <div key={s.id} className="glass rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full grid place-items-center" style={{ background: `${s.color}22`, border: `1px solid ${s.color}55` }}>
              <User className="w-4 h-4" style={{ color: s.color }} />
            </div>
            <div>
              <div className="text-sm font-medium">{s.name}</div>
              <div className="text-xs text-ink-500">{s.role ?? "Barbiere"}</div>
            </div>
          </div>
        ))}
        <button
          onClick={() => setOpen(true)}
          className="rounded-xl border border-dashed border-white/15 p-4 text-ink-400 hover:text-ink-100 hover:bg-white/[0.03] flex items-center justify-center gap-2 min-h-[68px]"
        >
          <Plus className="w-4 h-4" /> Aggiungi
        </button>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Nuovo membro team">
        <form onSubmit={submit} className="space-y-4">
          <Field label="Nome">
            <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Marco" />
          </Field>
          <Field label="Ruolo">
            <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Master Barber" />
          </Field>
          <Field label="Colore agenda">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-10 w-24 rounded-lg bg-white/[0.04] border border-white/10 cursor-pointer"
            />
          </Field>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Annulla</Button>
            <Button type="submit" loading={loading}>Aggiungi</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

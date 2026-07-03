"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getBookings, createBooking, updateBooking, deleteBooking } from "@/lib/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Badge, BookingStatusBadge } from "@/components/ui/badge";
import { formatCurrency, addMinutesToTime } from "@/lib/utils";
import type { Booking, BookingStatus } from "@/types";
import { format, addDays, subDays, parseISO } from "date-fns";
import { it } from "date-fns/locale";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Search,
  X,
  Check,
  Trash2,
  Clock,
  User,
  Scissors,
} from "lucide-react";
import { toast } from "sonner";

export default function BookingsPage() {
  const { shop } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const loadBookings = useCallback(async () => {
    if (!shop?.id) return;
    setLoading(true);
    const data = await getBookings(shop.id, selectedDate, selectedDate);
    setBookings(data);
    setLoading(false);
  }, [shop?.id, selectedDate]);

  useEffect(() => { loadBookings(); }, [loadBookings]);

  const handleStatusChange = async (id: string, status: BookingStatus) => {
    await updateBooking(id, { status });
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    toast.success("Stato aggiornato");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Eliminare questa prenotazione?")) return;
    await deleteBooking(id);
    setBookings((prev) => prev.filter((b) => b.id !== id));
    toast.success("Prenotazione eliminata");
  };

  const filtered = bookings.filter((b) => {
    const matchSearch = search === "" || b.clientName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const dayLabel = format(parseISO(selectedDate), "EEEE d MMMM", { locale: it });

  const TimelineSlot = ({ booking }: { booking: Booking }) => (
    <div className="flex gap-3 p-4 rounded-xl bg-[var(--accent)] border border-[var(--border)] hover:border-[var(--primary)]/30 transition-all group">
      <div className="flex flex-col items-center gap-0.5 shrink-0 w-14">
        <span className="text-sm font-bold text-[var(--primary)]">{booking.startTime}</span>
        <div className="w-px h-full min-h-4 bg-[var(--border)]" />
        <span className="text-xs text-[var(--muted)]">{booking.endTime}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium text-[var(--foreground)] text-sm">{booking.clientName}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-[var(--muted)] flex items-center gap-1">
                <Scissors className="w-3 h-3" /> {booking.serviceName}
              </span>
              {booking.clientPhone && (
                <span className="text-xs text-[var(--muted)]">{booking.clientPhone}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BookingStatusBadge status={booking.status} />
            <span className="text-sm font-semibold text-[var(--primary)]">
              {formatCurrency(booking.servicePrice * 100)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
          {booking.status === "pending" && (
            <Button size="sm" variant="gold" onClick={() => handleStatusChange(booking.id, "confirmed")}>
              <Check className="w-3 h-3" /> Conferma
            </Button>
          )}
          {booking.status === "confirmed" && (
            <Button size="sm" variant="gold" onClick={() => handleStatusChange(booking.id, "completed")}>
              <Check className="w-3 h-3" /> Completa
            </Button>
          )}
          {(booking.status === "pending" || booking.status === "confirmed") && (
            <Button size="sm" variant="outline" onClick={() => handleStatusChange(booking.id, "cancelled")}>
              <X className="w-3 h-3" /> Annulla
            </Button>
          )}
          <Button size="icon" variant="ghost" onClick={() => handleDelete(booking.id)}>
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Prenotazioni</h1>
          <p className="text-sm text-[var(--muted)] capitalize">{dayLabel}</p>
        </div>
        <Button variant="gold" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" /> Nuova
        </Button>
      </div>

      {/* Date Navigator */}
      <Card>
        <CardContent className="pt-5">
          <div className="flex items-center gap-3">
            <Button size="icon" variant="outline" onClick={() => setSelectedDate(format(subDays(parseISO(selectedDate), 1), "yyyy-MM-dd"))}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="flex-1 max-w-48"
            />
            <Button size="icon" variant="outline" onClick={() => setSelectedDate(format(addDays(parseISO(selectedDate), 1), "yyyy-MM-dd"))}>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSelectedDate(format(new Date(), "yyyy-MM-dd"))}>
              Oggi
            </Button>
            <div className="ml-auto flex items-center gap-2">
              <Input
                placeholder="Cerca cliente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="w-3.5 h-3.5" />}
                className="w-44"
              />
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                options={[
                  { value: "all", label: "Tutti" },
                  { value: "pending", label: "In attesa" },
                  { value: "confirmed", label: "Confermati" },
                  { value: "completed", label: "Completati" },
                  { value: "cancelled", label: "Annullati" },
                ]}
                className="w-36"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Timeline */}
      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <Card key={i} className="h-24 shimmer" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-12 h-12 text-[var(--border)] mx-auto mb-3" />
            <p className="text-[var(--muted)]">Nessuna prenotazione</p>
            <Button variant="gold" className="mt-4" onClick={() => setShowModal(true)}>
              <Plus className="w-4 h-4" /> Aggiungi la prima
            </Button>
          </div>
        ) : (
          filtered.map((b) => <TimelineSlot key={b.id} booking={b} />)
        )}
      </div>

      {/* New Booking Modal */}
      {showModal && shop && (
        <BookingModal
          shop={shop}
          date={selectedDate}
          onClose={() => setShowModal(false)}
          onCreated={(b) => {
            setBookings((prev) => [...prev, b].sort((a, b2) => a.startTime.localeCompare(b2.startTime)));
            setShowModal(false);
            toast.success("Prenotazione creata!");
          }}
        />
      )}
    </div>
  );
}

function BookingModal({
  shop,
  date,
  onClose,
  onCreated,
}: {
  shop: any;
  date: string;
  onClose: () => void;
  onCreated: (b: Booking) => void;
}) {
  const [form, setForm] = useState({
    clientName: "",
    clientPhone: "",
    serviceId: shop.settings.services[0]?.id ?? "",
    staffId: shop.settings.staff[0]?.id ?? "",
    startTime: "09:00",
    notes: "",
    source: "manual" as const,
  });
  const [saving, setSaving] = useState(false);

  const service = shop.settings.services.find((s: any) => s.id === form.serviceId);
  const staff = shop.settings.staff.find((s: any) => s.id === form.staffId);
  const endTime = service ? addMinutesToTime(form.startTime, service.duration) : form.startTime;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientName || !service) return;
    setSaving(true);
    try {
      const booking = await createBooking({
        shopId: shop.id,
        clientName: form.clientName,
        clientPhone: form.clientPhone || undefined,
        staffId: form.staffId || undefined,
        staffName: staff?.name,
        serviceId: form.serviceId,
        serviceName: service.name,
        servicePrice: service.price,
        serviceDuration: service.duration,
        date,
        startTime: form.startTime,
        endTime,
        status: "confirmed",
        notes: form.notes || undefined,
        source: form.source,
      });
      onCreated(booking);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Nuova Prenotazione</h2>
          <Button size="icon" variant="ghost" onClick={onClose}><X className="w-4 h-4" /></Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome cliente *"
            value={form.clientName}
            onChange={(e) => setForm((p) => ({ ...p, clientName: e.target.value }))}
            placeholder="Mario Rossi"
            required
          />
          <Input
            label="Telefono"
            value={form.clientPhone}
            onChange={(e) => setForm((p) => ({ ...p, clientPhone: e.target.value }))}
            placeholder="+39 333 000 0000"
            type="tel"
          />
          <Select
            label="Servizio *"
            value={form.serviceId}
            onChange={(e) => setForm((p) => ({ ...p, serviceId: e.target.value }))}
            options={shop.settings.services.filter((s: any) => s.active).map((s: any) => ({
              value: s.id,
              label: `${s.name} — ${formatCurrency(s.price * 100)} (${s.duration}min)`,
            }))}
          />
          <Select
            label="Barbiere"
            value={form.staffId}
            onChange={(e) => setForm((p) => ({ ...p, staffId: e.target.value }))}
            options={shop.settings.staff.filter((s: any) => s.active).map((s: any) => ({
              value: s.id,
              label: s.name,
            }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Ora inizio"
              type="time"
              value={form.startTime}
              onChange={(e) => setForm((p) => ({ ...p, startTime: e.target.value }))}
            />
            <Input label="Ora fine" value={endTime} disabled />
          </div>
          <Textarea
            label="Note"
            value={form.notes}
            onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            placeholder="Preferenze, allergie..."
          />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Annulla</Button>
            <Button type="submit" variant="gold" className="flex-1" loading={saving}>
              Salva
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

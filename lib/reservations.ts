export interface Reservation {
  id: string;
  fullName: string;
  cedula: string;
  email: string;
  visitType: "guided" | "educational" | "free";
  date: string;
  time: string;
  status: "confirmed" | "cancelled";
  createdAt: string;
}

const STORAGE_KEY = "jb_reservations";

const VISIT_TYPE_LABELS: Record<Reservation["visitType"], string> = {
  guided: "Visita guiada",
  educational: "Visita educativa",
  free: "Recorrido libre",
};

export function getVisitTypeLabel(type: Reservation["visitType"]): string {
  return VISIT_TYPE_LABELS[type];
}

function readStorage(): Reservation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeStorage(reservations: Reservation[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
}

export function getReservations(): Reservation[] {
  return readStorage().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getActiveReservations(): Reservation[] {
  return getReservations().filter((r) => r.status !== "cancelled");
}

export function addReservation(
  data: Omit<Reservation, "id" | "status" | "createdAt">
): Reservation {
  const reservation: Reservation = {
    ...data,
    id: crypto.randomUUID(),
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };

  const all = readStorage();
  all.push(reservation);
  writeStorage(all);

  return reservation;
}

export function cancelReservation(id: string): Reservation | null {
  const all = readStorage();
  const index = all.findIndex((r) => r.id === id);
  if (index === -1) return null;

  all[index].status = "cancelled";
  writeStorage(all);

  return all[index];
}

export function seedDemoData(): void {
  const existing = readStorage();
  if (existing.length > 0) return;

  const demo: Reservation[] = [
    {
      id: crypto.randomUUID(),
      fullName: "Jane Doe",
      cedula: "V-12345678",
      email: "jane@email.com",
      visitType: "guided",
      date: "12 de Mayo, 2026",
      time: "9:00 AM - 11:00 AM",
      status: "confirmed",
      createdAt: new Date("2026-05-10T10:00:00").toISOString(),
    },
    {
      id: crypto.randomUUID(),
      fullName: "Carlos Pérez",
      cedula: "V-23456789",
      email: "carlos@email.com",
      visitType: "free",
      date: "12 de Mayo, 2026",
      time: "11:30 AM - 1:30 PM",
      status: "confirmed",
      createdAt: new Date("2026-05-10T11:00:00").toISOString(),
    },
    {
      id: crypto.randomUUID(),
      fullName: "María García",
      cedula: "V-34567890",
      email: "maria@email.com",
      visitType: "educational",
      date: "12 de Mayo, 2026",
      time: "2:00 PM - 4:00 PM",
      status: "confirmed",
      createdAt: new Date("2026-05-10T12:00:00").toISOString(),
    },
  ];

  writeStorage(demo);
}

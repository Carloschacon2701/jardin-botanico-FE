"use client";

import { useState } from "react";
import Navbar from "@/components/organisms/Navbar";
import Footer from "@/components/organisms/Footer";
import ReservationCard from "@/components/molecules/ReservationCard";

const reservations = [
  {
    id: "1",
    name: "Jane Doe",
    email: "jane@email.com",
    visitType: "Visita guiada",
    date: "12 de Mayo, 2026",
    time: "9:00 AM - 11:00 AM",
    status: "confirmed" as const,
  },
  {
    id: "2",
    name: "Carlos Pérez",
    email: "carlos@email.com",
    visitType: "Recorrido libre",
    date: "12 de Mayo, 2026",
    time: "11:30 AM - 1:30 PM",
    status: "confirmed" as const,
  },
  {
    id: "3",
    name: "María García",
    email: "maria@email.com",
    visitType: "Visita educativa",
    date: "12 de Mayo, 2026",
    time: "2:00 PM - 4:00 PM",
    status: "pending" as const,
  },
  {
    id: "4",
    name: "Luis Rodríguez",
    email: "luis@email.com",
    visitType: "Visita guiada",
    date: "13 de Mayo, 2026",
    time: "9:00 AM - 11:00 AM",
    status: "confirmed" as const,
  },
  {
    id: "5",
    name: "Ana Martínez",
    email: "ana@email.com",
    visitType: "Recorrido libre",
    date: "13 de Mayo, 2026",
    time: "11:30 AM - 1:30 PM",
    status: "pending" as const,
  },
];

export default function AdminPage() {
  const [showModal, setShowModal] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCancel = (id: string) => {
    setShowModal(id);
  };

  const confirmCancel = () => {
    setShowModal(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const cancellingReservation = reservations.find((r) => r.id === showModal);

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <Navbar />

      <main className="flex-1 w-full">
        <div className="mx-auto max-w-[1280px] px-4 md:px-10 py-8 md:py-12">
          {/* Summary header */}
          <div className="mb-8">
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                RESUMEN
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--green-primary)]">
                Administración de reservaciones
              </h1>
            </div>
            <p className="text-base text-[var(--text-dark)] max-w-lg">
              Supervisión centralizada de todo el flujo de visitantes y los
              programas educativos.
            </p>
          </div>

          {/* Stats card */}
          <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] p-6 mb-8 flex items-center justify-between max-w-sm">
            <div>
              <p className="text-sm text-[var(--text-muted)] mb-1">
                Reservaciones de hoy
              </p>
              <p className="text-4xl font-bold text-[var(--green-primary)]">
                {reservations.length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[var(--green-light)] flex items-center justify-center">
              <CalendarCheckIcon />
            </div>
          </div>

          {/* Section heading */}
          <h2 className="text-xl font-bold text-[var(--green-primary)] mb-4">
            Agenda de hoy
          </h2>

          {/* Reservation cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {reservations.map((res) => (
              <ReservationCard
                key={res.id}
                {...res}
                onCancel={() => handleCancel(res.id)}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />

      {/* Cancel confirmation modal */}
      {showModal && cancellingReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowModal(null)}
          />
          <div className="relative bg-white rounded-2xl p-8 max-w-md w-full shadow-xl text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
              <WarningIcon />
            </div>
            <h3 className="text-lg font-bold text-[var(--green-primary)] mb-2">
              Confirmar cancelación de visita
            </h3>
            <p className="text-sm text-[var(--text-dark)] mb-6">
              ¿Deseas cancelar la reservación de{" "}
              <strong>{cancellingReservation.name}</strong> para el día{" "}
              {cancellingReservation.date} de {cancellingReservation.time}?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowModal(null)}
                className="px-6 py-2 rounded-lg border border-[var(--border)] text-sm font-semibold text-[var(--text-dark)] hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={confirmCancel}
                className="px-6 py-2 rounded-lg bg-[var(--terracotta)] text-white text-sm font-semibold hover:brightness-110 transition-all cursor-pointer"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowSuccess(false)}
          />
          <div className="relative bg-white rounded-2xl p-8 max-w-md w-full shadow-xl text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <SuccessIcon />
            </div>
            <h3 className="text-lg font-bold text-[var(--green-primary)] mb-2">
              Agendamiento cancelado
            </h3>
            <p className="text-sm text-[var(--text-dark)] mb-6">
              En breve recibirás un correo de confirmación
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="px-6 py-2 rounded-lg bg-[var(--green-primary)] text-white text-sm font-semibold hover:brightness-110 transition-all cursor-pointer"
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CalendarCheckIcon() {
  return (
    <svg
      width="25"
      height="20"
      viewBox="0 0 25 20"
      fill="none"
      stroke="var(--green-primary)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="1" y="3" width="18" height="16" rx="2" />
      <path d="M14 1V5M6 1V5M1 9H19" />
      <path d="M7 14L10 17L17 10" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg
      width="40"
      height="36"
      viewBox="0 0 40 36"
      fill="none"
      className="text-yellow-600"
    >
      <path
        d="M20 4L2 34H38L20 4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 14V22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="20" cy="28" r="1.5" fill="currentColor" />
    </svg>
  );
}

function SuccessIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      className="text-green-600"
    >
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 20L18 26L28 14"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

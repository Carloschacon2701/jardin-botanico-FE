"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import ReservationCard from "@/components/molecules/ReservationCard";
import { supabase } from "@/lib/supabase";

interface ReservaDB {
  id_reserva: number;
  fecha_reserva: string;
  usuarios: {
    nombre: string;
    apellido: string;
    cedula: string;
    correo: string;
  };
  tipos_visita: {
    nombre_visita: string;
  };
  bloques_horarios: {
    hora_inicio: string;
    hora_fin: string;
  };
  estados_reserva: {
    nombre_estado: string;
  };
}

function formatTo12h(time24: string): string {
  const [h, m] = time24.split(":");
  const hour = parseInt(h, 10);
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${suffix}`;
}

function mapStatus(nombre: string): "confirmed" | "pending" | "cancelled" {
  const lower = nombre.toLowerCase();
  if (lower.includes("cancel")) return "cancelled";
  if (lower.includes("pendiente")) return "pending";
  return "confirmed";
}

export default function AdminPage() {
  const [reservations, setReservations] = useState<ReservaDB[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const router = useRouter();

  const loadReservations = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("reservas")
      .select(
        "id_reserva, fecha_reserva, usuarios(nombre, apellido, cedula, correo), tipos_visita(nombre_visita), bloques_horarios(hora_inicio, hora_fin), estados_reserva(nombre_estado)"
      )
      .order("fecha_reserva", { ascending: false });

    if (!error && data) {
      setReservations(data as unknown as ReservaDB[]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/login");
        return;
      }
      setSessionChecked(true);
      loadReservations();
    });
  }, [router, loadReservations]);

  if (!sessionChecked) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-lg text-[var(--green-primary)] font-semibold">
          Cargando panel...
        </p>
      </main>
    );
  }

  const handleCancel = (id: number) => {
    setShowModal(id);
  };

  const confirmCancel = async () => {
    if (showModal) {
      await supabase
        .from("reservas")
        .update({ id_estado: 3 })
        .eq("id_reserva", showModal);
    }
    setShowModal(null);
    setShowSuccess(true);
    loadReservations();
  };

  const cancellingReservation = reservations.find(
    (r) => r.id_reserva === showModal
  );
  const activeCount = reservations.filter(
    (r) => mapStatus(r.estados_reserva.nombre_estado) !== "cancelled"
  ).length;

  return (
    <>
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
                Reservaciones activas
              </p>
              <p className="text-4xl font-bold text-[var(--green-primary)]">
                {activeCount}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[var(--green-light)] flex items-center justify-center">
              <CalendarCheckIcon />
            </div>
          </div>

          {/* Section heading */}
          <h2 className="text-xl font-bold text-[var(--green-primary)] mb-4">
            Todas las reservaciones
          </h2>

          {isLoading ? (
            <div className="bg-white rounded-2xl border border-[var(--border)] p-12 text-center">
              <p className="text-[var(--text-muted)]">Cargando reservaciones...</p>
            </div>
          ) : reservations.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[var(--border)] p-12 text-center">
              <p className="text-[var(--text-muted)]">Aún no hay reservaciones registradas.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {reservations.map((res) => {
                const status = mapStatus(res.estados_reserva.nombre_estado);
                const fullName = `${res.usuarios.nombre} ${res.usuarios.apellido}`;
                const time = `${formatTo12h(res.bloques_horarios.hora_inicio)} - ${formatTo12h(res.bloques_horarios.hora_fin)}`;
                return (
                  <ReservationCard
                    key={res.id_reserva}
                    name={fullName}
                    email={res.usuarios.correo}
                    visitType={res.tipos_visita.nombre_visita}
                    date={res.fecha_reserva}
                    time={time}
                    status={status}
                    onCancel={
                      status !== "cancelled"
                        ? () => handleCancel(res.id_reserva)
                        : undefined
                    }
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>

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
              <strong>{cancellingReservation.usuarios.nombre} {cancellingReservation.usuarios.apellido}</strong> para el día{" "}
              {cancellingReservation.fecha_reserva} de {formatTo12h(cancellingReservation.bloques_horarios.hora_inicio)} - {formatTo12h(cancellingReservation.bloques_horarios.hora_fin)}?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowModal(null)}
                className="px-6 py-2 rounded-lg border border-[var(--border)] text-sm font-semibold text-[var(--text-dark)] hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Volver
              </button>
              <button
                onClick={confirmCancel}
                className="px-6 py-2 rounded-lg bg-[var(--terracotta)] text-white text-sm font-semibold hover:brightness-110 transition-all cursor-pointer"
              >
                Confirmar cancelación
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
              Reservación cancelada
            </h3>
            <p className="text-sm text-[var(--text-dark)] mb-6">
              La reservación ha sido cancelada exitosamente.
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
    </>
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

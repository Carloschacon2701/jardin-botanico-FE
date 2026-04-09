"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import ReservationCard from "@/components/molecules/ReservationCard";
import { useAuth } from "@/app/context/AuthContext";
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

interface VisitorDB {
  id_usuario: string;
  nombre: string;
  apellido: string;
  correo: string;
  cedula: string;
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
  const [showConfirmModal, setShowConfirmModal] = useState<number | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [showConfirmSuccess, setShowConfirmSuccess] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Todas");
  const [activeTab, setActiveTab] = useState<"reservas" | "usuarios">("reservas");
  const [visitors, setVisitors] = useState<VisitorDB[]>([]);
  const [isLoadingVisitors, setIsLoadingVisitors] = useState(false);
  const [promotingId, setPromotingId] = useState<string | null>(null);
  const router = useRouter();
  const { session, userRole, isLoading: authLoading } = useAuth();

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

  const loadVisitors = useCallback(async () => {
    setIsLoadingVisitors(true);
    const { data, error } = await supabase
      .from("usuarios")
      .select("id_usuario, nombre, apellido, correo, cedula")
      .eq("id_rol", 2);

    if (!error && data) {
      setVisitors(data as VisitorDB[]);
    }
    setIsLoadingVisitors(false);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!session || userRole !== 1) {
      router.replace("/");
      return;
    }
    loadReservations();
    loadVisitors();
  }, [authLoading, session, userRole, router, loadReservations, loadVisitors]);

  if (authLoading || !session || userRole !== 1) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-lg text-green-primary font-semibold">
          Cargando panel de administración...
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

  const handleConfirmReservation = async (idReserva: number, idUsuario: string) => {
    setIsConfirming(true);
    const { error } = await supabase
      .from("reservas")
      .update({ id_estado: 2 })
      .eq("id_reserva", idReserva);

    if (!error) {
      await supabase.from("historial_estados_reserva").insert({
        id_reserva: idReserva,
        id_usuario: idUsuario,
        id_estado: 2,
        comentario: "Reserva confirmada por el administrador",
      });

      setReservations((prev) =>
        prev.map((r) =>
          r.id_reserva === idReserva
            ? { ...r, estados_reserva: { nombre_estado: "Confirmada" } }
            : r
        )
      );
      setShowConfirmModal(null);
      setShowConfirmSuccess(true);
    }
    setIsConfirming(false);
  };

  const handlePromoteToAdmin = async (idUsuario: string) => {
    setPromotingId(idUsuario);
    const { error } = await supabase
      .from("usuarios")
      .update({ id_rol: 1 })
      .eq("id_usuario", idUsuario);

    if (!error) {
      setVisitors((prev) => prev.filter((v) => v.id_usuario !== idUsuario));
    }
    setPromotingId(null);
  };

  const cancellingReservation = reservations.find(
    (r) => r.id_reserva === showModal
  );

  const confirmingReservation = reservations.find(
    (r) => r.id_reserva === showConfirmModal
  );
  const activeCount = reservations.filter(
    (r) => mapStatus(r.estados_reserva.nombre_estado) !== "cancelled"
  ).length;

  const FILTER_OPTIONS = ["Todas", "Pendientes", "Confirmadas", "Canceladas"];
  const STATUS_MAP: Record<string, "pending" | "confirmed" | "cancelled"> = {
    Pendientes: "pending",
    Confirmadas: "confirmed",
    Canceladas: "cancelled",
  };
  const filteredReservations =
    activeFilter === "Todas"
      ? reservations
      : reservations.filter(
        (r) => mapStatus(r.estados_reserva.nombre_estado) === STATUS_MAP[activeFilter]
      );

  return (
    <>
      <main className="flex-1 w-full">
        <div className="mx-auto max-w-7xl px-4 md:px-10 py-8 md:py-12">
          {/* Summary header */}
          <div className="mb-8">
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">
                PANEL DE CONTROL
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-green-primary">
                Administración de reservas
              </h1>
            </div>
            <p className="text-base text-text-dark max-w-lg">
              Gestiona reservas y visitantes desde un solo lugar para ofrecer
              una experiencia organizada y acogedora.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-border mb-8">
            <button
              onClick={() => setActiveTab("reservas")}
              className={`px-5 py-3 text-sm font-semibold transition-colors cursor-pointer border-b-2 -mb-px ${activeTab === "reservas"
                  ? "border-green-primary text-green-primary"
                  : "border-transparent text-text-muted hover:text-green-primary"
                }`}
            >
              Reservas
            </button>
            <button
              onClick={() => setActiveTab("usuarios")}
              className={`px-5 py-3 text-sm font-semibold transition-colors cursor-pointer border-b-2 -mb-px ${activeTab === "usuarios"
                  ? "border-green-primary text-green-primary"
                  : "border-transparent text-text-muted hover:text-green-primary"
                }`}
            >
              Usuarios
            </button>
          </div>

          {/* Tab: Reservaciones */}
          {activeTab === "reservas" && (
            <>
              {/* Stats card */}
              <div className="bg-white rounded-2xl shadow-sm border border-border p-6 mb-8 flex items-center justify-between max-w-sm">
                <div>
                  <p className="text-sm text-text-muted mb-1">
                    Reservas activas
                  </p>
                  <p className="text-4xl font-bold text-green-primary">
                    {activeCount}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-light flex items-center justify-center">
                  <CalendarCheckIcon />
                </div>
              </div>

              {/* Section heading */}
              <h2 className="text-xl font-bold text-green-primary mb-4">
                Todas las reservas
              </h2>

              {/* Filter bar */}
              <div className="flex gap-2 overflow-x-auto pb-1 mb-6">
                {FILTER_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => setActiveFilter(option)}
                    className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors cursor-pointer ${activeFilter === option
                        ? "bg-green-primary text-white"
                        : "border border-border text-text-dark bg-white hover:bg-gray-50"
                      }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {isLoading ? (
                <div className="bg-white rounded-2xl border border-border p-12 text-center">
                  <p className="text-text-muted">Cargando reservas...</p>
                </div>
              ) : reservations.length === 0 ? (
                <div className="bg-white rounded-2xl border border-border p-12 text-center">
                  <p className="text-text-muted">Aún no hay reservas registradas.</p>
                </div>
              ) : filteredReservations.length === 0 ? (
                <div className="bg-white rounded-2xl border border-border p-12 text-center">
                  <p className="text-text-muted">No hay reservas para este filtro.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredReservations.map((res) => {
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
                        onConfirm={
                          status === "pending"
                            ? () => setShowConfirmModal(res.id_reserva)
                            : undefined
                        }
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
            </>
          )}

          {/* Tab: Gestión de Usuarios */}
          {activeTab === "usuarios" && (
            <>
              <h2 className="text-xl font-bold text-green-primary mb-2">
                Visitantes registrados
              </h2>
              <p className="text-sm text-text-muted mb-6">
                Asigna permisos de administración a visitantes registrados.
              </p>

              {isLoadingVisitors ? (
                <div className="bg-white rounded-2xl border border-border p-12 text-center">
                  <p className="text-text-muted">Cargando visitantes registrados...</p>
                </div>
              ) : visitors.length === 0 ? (
                <div className="bg-white rounded-2xl border border-border p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[rgba(45,106,79,0.1)] flex items-center justify-center">
                    <UsersIcon />
                  </div>
                  <p className="text-text-muted font-semibold">No hay visitantes pendientes por promover</p>
                  <p className="text-sm text-text-muted mt-1">Todos los usuarios actuales ya cuentan con rol de administrador.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {visitors.map((v) => (
                    <div
                      key={v.id_usuario}
                      className="bg-white rounded-2xl border border-border p-6 shadow-sm flex flex-col gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[rgba(45,106,79,0.1)] flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-green-primary">
                            {v.nombre.charAt(0)}{v.apellido.charAt(0)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-green-primary truncate">
                            {v.nombre} {v.apellido}
                          </p>
                          <p className="text-xs text-text-muted truncate">{v.correo}</p>
                        </div>
                      </div>
                      <div className="text-xs text-text-dark">
                        <span className="font-semibold">Cédula:</span> {v.cedula}
                      </div>
                      <button
                        onClick={() => handlePromoteToAdmin(v.id_usuario)}
                        disabled={promotingId === v.id_usuario}
                        className="w-full py-2.5 rounded-xl bg-green-primary text-white text-sm font-semibold hover:brightness-110 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {promotingId === v.id_usuario ? "Asignando permisos..." : "Asignar como administrador"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
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
            <h3 className="text-lg font-bold text-green-primary mb-2">
              Confirmar cancelación de visita
            </h3>
            <p className="text-sm text-text-dark mb-6">
              ¿Deseas cancelar la reservación de{" "}
              <strong>{cancellingReservation.usuarios.nombre} {cancellingReservation.usuarios.apellido}</strong> para el día{" "}
              {cancellingReservation.fecha_reserva} de {formatTo12h(cancellingReservation.bloques_horarios.hora_inicio)} - {formatTo12h(cancellingReservation.bloques_horarios.hora_fin)}?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowModal(null)}
                className="px-6 py-2 rounded-lg border border-border text-sm font-semibold text-text-dark hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Volver
              </button>
              <button
                onClick={confirmCancel}
                className="px-6 py-2 rounded-lg bg-terracotta text-white text-sm font-semibold hover:brightness-110 transition-all cursor-pointer"
              >
                Confirmar cancelación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm reservation modal */}
      {showConfirmModal && confirmingReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !isConfirming && setShowConfirmModal(null)}
          />
          <div className="relative bg-white rounded-2xl p-8 max-w-md w-full shadow-xl text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <ConfirmIcon />
            </div>
            <h3 className="text-lg font-bold text-green-primary mb-2">
              Confirmar reservación
            </h3>
            <p className="text-sm text-text-dark mb-6">
              ¿Deseas confirmar la reservación de{" "}
              <strong>
                {confirmingReservation.usuarios.nombre}{" "}
                {confirmingReservation.usuarios.apellido}
              </strong>{" "}
              para el día {confirmingReservation.fecha_reserva} de{" "}
              {formatTo12h(confirmingReservation.bloques_horarios.hora_inicio)} -{" "}
              {formatTo12h(confirmingReservation.bloques_horarios.hora_fin)}?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowConfirmModal(null)}
                disabled={isConfirming}
                className="px-6 py-2 rounded-lg border border-border text-sm font-semibold text-text-dark hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                Volver
              </button>
              <button
                onClick={() => handleConfirmReservation(showConfirmModal, session.user.id)}
                disabled={isConfirming}
                className="px-6 py-2 rounded-lg bg-green-primary text-white text-sm font-semibold hover:brightness-110 transition-all cursor-pointer disabled:opacity-50"
              >
                {isConfirming ? "Confirmando..." : "Confirmar reserva"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm success modal */}
      {showConfirmSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowConfirmSuccess(false)}
          />
          <div className="relative bg-white rounded-2xl p-8 max-w-md w-full shadow-xl text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <SuccessIcon />
            </div>
            <h3 className="text-lg font-bold text-green-primary mb-2">
              Reservación confirmada
            </h3>
            <p className="text-sm text-text-dark mb-6">
              La reservación ha sido confirmada exitosamente.
            </p>
            <button
              onClick={() => setShowConfirmSuccess(false)}
              className="px-6 py-2 rounded-lg bg-green-primary text-white text-sm font-semibold hover:brightness-110 transition-all cursor-pointer"
            >
              Cerrar
            </button>
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
            <h3 className="text-lg font-bold text-green-primary mb-2">
              Reservación cancelada
            </h3>
            <p className="text-sm text-text-dark mb-6">
              La reservación ha sido cancelada exitosamente.
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="px-6 py-2 rounded-lg bg-green-primary text-white text-sm font-semibold hover:brightness-110 transition-all cursor-pointer"
            >
              Cerrar
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

function ConfirmIcon() {
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
        d="M13 20L18 25L27 15"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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

function UsersIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--green-primary)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="7" r="4" />
      <path d="M3 21V19C3 16.7909 4.79086 15 7 15H11C13.2091 15 15 16.7909 15 19V21" />
      <path d="M16 3.13C17.7699 3.58392 19.0078 5.17927 19.0078 7.005C19.0078 8.83073 17.7699 10.4261 16 10.88" />
      <path d="M21 21V19C20.9949 17.1826 19.7652 15.5942 18 15.13" />
    </svg>
  );
}

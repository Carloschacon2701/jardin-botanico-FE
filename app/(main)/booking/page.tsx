"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { bookingSchema, type BookingFormData } from "@/lib/schemas";
import { supabase } from "@/lib/supabase";
import Holidays from "date-holidays";

interface TipoVisita {
  id_tipo_visita: number;
  nombre_visita: string;
  descripcion: string;
  duracion_estimada: number;
}

interface BloqueHorario {
  id_bloque: number;
  hora_inicio: string;
  hora_fin: string;
}

function formatTimeRange(start: string, end: string) {
  const format = (time: string) => {
    const [h, m] = time.split(':');
    let hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    const formattedHour = hour < 10 ? `0${hour}` : hour;
    return `${formattedHour}:${m} ${ampm}`;
  };
  return `${format(start)} - ${format(end)}`;
}

const iconMap: Record<string, string> = {
  "Free Walk": "🚶",
  "Guided Tour": "🌿",
  "School Trip": "📚",
};

const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

interface DateOption {
  day: string;
  date: number;
  month: string;
  full: string;
  iso: string;
}

function getNextBusinessDays(count: number): DateOption[] {
  const hd = new Holidays("VE");
  const results: DateOption[] = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  cursor.setDate(cursor.getDate() + 1);

  while (results.length < count) {
    const dow = cursor.getDay();
    const isWeekend = dow === 0 || dow === 6;
    const isHoliday = !!hd.isHoliday(cursor);

    if (!isWeekend && !isHoliday) {
      const m = cursor.getMonth();
      const d = cursor.getDate();
      const y = cursor.getFullYear();
      results.push({
        day: DAY_NAMES[dow],
        date: d,
        month: MONTH_NAMES[m].slice(0, 3),
        full: `${d} de ${MONTH_NAMES[m]}, ${y}`,
        iso: `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      });
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return results;
}


export default function BookingPage() {
  const router = useRouter();

  const [dbVisitTypes, setDbVisitTypes] = useState<TipoVisita[]>([]);
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [dbTimeSlots, setDbTimeSlots] = useState<BloqueHorario[]>([]);

  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState(0);
  const dates = useMemo(() => getNextBusinessDays(15), []);

  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  useEffect(() => {
    const fetchDatosIniciales = async () => {
      const [visitasResponse, bloquesResponse] = await Promise.all([
        supabase.from('tipos_visita').select('*').order('id_tipo_visita'),
        supabase.from('bloques_horarios').select('*').order('hora_inicio')
      ]);

      if (visitasResponse.error) console.error('Error cargando visitas:', visitasResponse.error);
      else if (visitasResponse.data) {
        setDbVisitTypes(visitasResponse.data);
        if (visitasResponse.data.length > 0) setSelectedType(visitasResponse.data[0].id_tipo_visita);
      }

      if (bloquesResponse.error) console.error('Error cargando bloques:', bloquesResponse.error);
      else if (bloquesResponse.data) {
        setDbTimeSlots(bloquesResponse.data);
        if (bloquesResponse.data.length > 0) setSelectedTime(bloquesResponse.data[0].id_bloque);
      }

      setIsLoading(false);
    };

    fetchDatosIniciales();
  }, []);


  const onSubmit = async (data: BookingFormData) => {
    const selectedSlot = dbTimeSlots.find((s) => s.id_bloque === selectedTime);
    if (!selectedSlot || !selectedType) {
      alert("Por favor, seleccione un tipo de visita y un horario válido.");
      return;
    }

    setIsLoading(true);

    const nameParts = data.fullName.trim().split(" ");
    const nombre = nameParts[0];
    const apellido = nameParts.slice(1).join(" ") || "N/A";

    const formattedDate = dates[selectedDate].iso;

    try {
      let idUsuario = null;

      const { data: existingUser, error: searchError } = await supabase
        .from('usuarios')
        .select('id_usuario')
        .eq('cedula', data.cedula.trim())
        .single();

      if (existingUser) {
        idUsuario = existingUser.id_usuario;
      } else {
        const { data: newUser, error: createError } = await supabase
          .from('usuarios')
          .insert({
            cedula: data.cedula.trim(),
            nombre: nombre,
            apellido: apellido,
            correo: data.email.trim(),
            id_rol: 2
          })
          .select('id_usuario')
          .single();

        if (createError) throw createError;
        idUsuario = newUser.id_usuario;
      }

      const { data: nuevaReserva, error: reservaError } = await supabase
        .from('reservas')
        .insert({
          fecha_reserva: formattedDate,
          id_usuario: idUsuario,
          id_tipo_visita: selectedType,
          id_bloque: selectedTime,
          id_estado: 1
        })
        .select('id_reserva')
        .single();

      if (reservaError) {
        if (reservaError.code === '23505') {
          alert("Lo sentimos, este turno ya fue reservado en esta fecha. Por favor elige otro horario.");
          setIsLoading(false);
          return;
        }
        throw reservaError;
      }

      await supabase.from('historial_estados_reserva').insert({
        id_usuario: idUsuario,
        id_reserva: nuevaReserva.id_reserva,
        id_estado: 1,
        comentario: "Reserva inicial creada desde la web"
      });

      setShowSuccess(true);

    } catch (err) {
      console.error("Error completo al procesar la reserva:", err);
      alert("Ocurrió un error inesperado al procesar tu reserva. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    setShowSuccess(false);
    router.push("/admin");
  };

  return (
    <>
      <main className="flex-1 w-full">
        <div className="mx-auto max-w-7xl px-4 md:px-10 py-8 md:py-12">
          {/* Page header */}
          <div className="mb-8 md:mb-12">
            <h1 className="text-2xl md:text-4xl font-bold text-green-primary tracking-tight mb-3">
              Agenda el día de tu experiencia
            </h1>
            <p className="text-base md:text-lg text-text-dark max-w-2xl leading-relaxed">
              Conéctate con la naturaleza en nuestro santuario de más de 20
              hectáreas. Por favor, proporciona tus datos de visitante y elige
              el tipo de visita que prefieras.
            </p>
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-[472px_1fr] lg:gap-12">
            {/* Left: visitor form */}
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-2xl border border-border p-8 mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <UserIcon />
                  <h2 className="text-xl md:text-2xl font-bold text-green-primary">
                    Datos del visitante
                  </h2>
                </div>

                <div className="flex flex-col gap-5">
                  <Input
                    label="Nombre completo"
                    placeholder="e.g. Jane Doe"
                    autoComplete="name"
                    {...register("fullName")}
                    error={errors.fullName?.message}
                  />
                  <Input
                    label="Cédula"
                    placeholder="V-00000000"
                    {...register("cedula")}
                    error={errors.cedula?.message}
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="your@email.com"
                    autoComplete="email"
                    {...register("email")}
                    error={errors.email?.message}
                  />
                </div>

                <div className="mt-6 flex gap-3 p-4 bg-(--green-light)/30 rounded-xl border border-green-light">
                  <InfoIcon />
                  <p className="text-sm text-text-dark leading-relaxed">
                    Recibirás un correo electrónico de confirmación con tu
                    billete digital inmediatamente después de realizar la
                    reserva.
                  </p>
                </div>
              </div>

              <div className="hidden lg:block relative h-48 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-green-primary">
                  <div className="absolute inset-0 bg-linear-to-t from-green-primary to-transparent" />
                </div>
                <p className="absolute bottom-4 left-4 text-sm text-white/80">
                  Jardín Botánico UNET - Área de invernadero
                </p>
              </div>
            </div>

            {/* Right: scheduling */}
            <div className="order-1 lg:order-2 mb-8 lg:mb-0 min-w-0">              {/* Visit type */}
              <section className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <TagIcon />
                  <h3 className="text-lg font-bold text-green-primary">
                    Seleccione el tipo de visita
                  </h3>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {isLoading ? (
                    <p className="text-sm text-text-muted animate-pulse p-4">Cargando experiencias desde la base de datos...</p>
                  ) : (
                    dbVisitTypes.map((type) => (
                      <button
                        key={type.id_tipo_visita}
                        onClick={() => setSelectedType(type.id_tipo_visita)}
                        className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${selectedType === type.id_tipo_visita
                          ? "border-green-primary bg-(--green-light)/30"
                          : "border-border bg-white hover:border-(--green-primary)/30"
                          }`}
                      >
                        <span className="text-2xl">{iconMap[type.nombre_visita] || "🪴"}</span>
                        <div>
                          <p className="font-bold text-sm text-green-primary">
                            {type.nombre_visita}
                          </p>
                          <p className="text-xs text-text-muted mt-0.5 hidden sm:block">
                            {type.descripcion}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </section>

              {/* Date selection */}
              <section className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <CalendarIcon />
                  <h3 className="text-lg font-bold text-green-primary">
                    Seleccione la fecha de su visita
                  </h3>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 w-full min-w-0">
                  {dates.map((d, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(i)}
                      className={`flex flex-col items-center justify-center shrink-0 w-16 h-20 rounded-xl border-2 transition-all cursor-pointer ${selectedDate === i
                        ? "border-green-primary bg-green-primary text-white"
                        : "border-border bg-white hover:border-(--green-primary)/30 text-text-dark"
                        }`}
                    >
                      <span className="text-xs font-medium uppercase">
                        {d.day}
                      </span>
                      <span className="text-xl font-bold">{d.date}</span>
                      <span className="text-xs">{d.month}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Time slots */}
              <section className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <ClockIcon />
                  <h3 className="text-lg font-bold text-green-primary">
                    Seleccione el horario de su visita
                  </h3>
                </div>
                <div className="flex flex-col gap-3">
                  {isLoading ? (
                    <p className="text-sm text-text-muted animate-pulse p-4">Cargando horarios disponibles...</p>
                  ) : (
                    dbTimeSlots.map((slot) => {
                      const timeString = formatTimeRange(slot.hora_inicio, slot.hora_fin);
                      return (
                        <button
                          key={slot.id_bloque}
                          onClick={() => setSelectedTime(slot.id_bloque)}
                          className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedTime === slot.id_bloque
                            ? "border-green-primary bg-(--green-light)/30"
                            : "border-border bg-white hover:border-(--green-primary)/30"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedTime === slot.id_bloque
                                ? "border-green-primary"
                                : "border-border"
                                }`}
                            >
                              {selectedTime === slot.id_bloque && (
                                <div className="w-2.5 h-2.5 rounded-full bg-green-primary" />
                              )}
                            </div>
                            <span className="font-semibold text-green-primary">
                              {timeString}
                            </span>
                          </div>
                          <span className="text-sm text-text-muted">
                            15 spots left
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </section>
              <Button size="lg" fullWidth onClick={handleSubmit(onSubmit)}>
                Reservar ahora
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Success modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-white rounded-2xl p-10 max-w-md w-full shadow-xl text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-green-100 flex items-center justify-center">
              <SuccessIcon />
            </div>
            <h3 className="text-xl font-bold text-green-primary mb-2">
              Agendamiento exitoso
            </h3>
            <p className="text-sm text-text-dark mb-8 leading-relaxed">
              Muchas gracias por agendar tu visita, <strong>{getValues("fullName")}</strong>.
              <br />
              En breve recibirás un correo de confirmación a{" "}
              <strong>{getValues("email")}</strong>.
            </p>
            <button
              onClick={handleContinue}
              className="px-8 py-2.5 rounded-lg bg-green-primary text-white text-sm font-semibold hover:brightness-110 transition-all cursor-pointer"
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--green-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="5" r="3" />
      <path d="M2 15C2 11.6863 4.68629 9 8 9C11.3137 9 14 11.6863 14 15" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" stroke="var(--green-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 3L10 1L19 3V13L10 15L1 13V3Z" />
      <path d="M10 1V15" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="18" height="20" viewBox="0 0 18 20" fill="none" stroke="var(--green-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="16" height="16" rx="2" />
      <path d="M13 1V5M5 1V5M1 9H17" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="var(--green-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="9" />
      <path d="M10 5V10L13 13" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="var(--green-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
      <circle cx="10" cy="10" r="9" />
      <path d="M10 9V14M10 6.5V7" />
    </svg>
  );
}

function SuccessIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-green-600">
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" />
      <path d="M12 20L18 26L28 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

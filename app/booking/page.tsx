"use client";

import { useState } from "react";
import Navbar from "@/components/organisms/Navbar";
import Footer from "@/components/organisms/Footer";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

const visitTypes = [
  {
    id: "guided",
    label: "Visita guiada",
    description: "Recorrido con guía experto por las áreas principales",
    icon: "🌿",
  },
  {
    id: "educational",
    label: "Visita educativa",
    description: "Programa educativo para grupos escolares",
    icon: "📚",
  },
  {
    id: "free",
    label: "Recorrido libre",
    description: "Explora el jardín a tu propio ritmo",
    icon: "🚶",
  },
];

const dates = [
  { day: "Lun", date: 12, month: "May" },
  { day: "Mar", date: 13, month: "May" },
  { day: "Mié", date: 14, month: "May" },
  { day: "Jue", date: 15, month: "May" },
  { day: "Vie", date: 16, month: "May" },
];

const timeSlots = [
  { id: "1", time: "9:00 AM - 11:00 AM", spots: 15 },
  { id: "2", time: "11:30 AM - 1:30 PM", spots: 8 },
  { id: "3", time: "2:00 PM - 4:00 PM", spots: 22 },
];

export default function BookingPage() {
  const [selectedType, setSelectedType] = useState("guided");
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState("1");

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <Navbar />

      <main className="flex-1 w-full">
        <div className="mx-auto max-w-[1280px] px-4 md:px-10 py-8 md:py-12">
          {/* Page header */}
          <div className="mb-8 md:mb-12">
            <h1 className="text-2xl md:text-4xl font-bold text-[var(--green-primary)] tracking-tight mb-3">
              Agenda el día de tu experiencia
            </h1>
            <p className="text-base md:text-lg text-[var(--text-dark)] max-w-2xl leading-relaxed">
              Conéctate con la naturaleza en nuestro santuario de más de 20
              hectáreas. Por favor, proporciona tus datos de visitante y elige
              el tipo de visita que prefieras.
            </p>
          </div>

          {/* Desktop: split layout */}
          <div className="flex flex-col lg:grid lg:grid-cols-[472px_1fr] lg:gap-12">
            {/* Left: visitor form */}
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-2xl border border-[var(--border)] p-8 mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <UserIcon />
                  <h2 className="text-xl md:text-2xl font-bold text-[var(--green-primary)]">
                    Datos del visitante
                  </h2>
                </div>

                <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
                  <Input
                    label="Nombre completo"
                    name="fullName"
                    placeholder="e.g. Jane Doe"
                    autoComplete="name"
                  />
                  <Input
                    label="Cedula"
                    name="cedula"
                    placeholder="Documento de identidad"
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    autoComplete="email"
                  />
                </form>

                {/* Info note */}
                <div className="mt-6 flex gap-3 p-4 bg-[var(--green-light)]/30 rounded-xl border border-[var(--green-light)]">
                  <InfoIcon />
                  <p className="text-sm text-[var(--text-dark)] leading-relaxed">
                    Recibirás un correo electrónico de confirmación con tu
                    billete digital inmediatamente después de realizar la
                    reserva.
                  </p>
                </div>
              </div>

              {/* Desktop decorative image */}
              <div className="hidden lg:block relative h-48 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-[var(--green-primary)]">
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--green-primary)] to-transparent" />
                </div>
                <p className="absolute bottom-4 left-4 text-sm text-white/80">
                  Jardín Botánico UNET - Área de invernadero
                </p>
              </div>
            </div>

            {/* Right: scheduling */}
            <div className="order-1 lg:order-2 mb-8 lg:mb-0">
              {/* Visit type */}
              <section className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <TagIcon />
                  <h3 className="text-lg font-bold text-[var(--green-primary)]">
                    Seleccione el tipo de visita
                  </h3>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  {visitTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                        selectedType === type.id
                          ? "border-[var(--green-primary)] bg-[var(--green-light)]/30"
                          : "border-[var(--border)] bg-white hover:border-[var(--green-primary)]/30"
                      }`}
                    >
                      <span className="text-2xl">{type.icon}</span>
                      <div>
                        <p className="font-bold text-sm text-[var(--green-primary)]">
                          {type.label}
                        </p>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5 hidden sm:block">
                          {type.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Date selection */}
              <section className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <CalendarIcon />
                  <h3 className="text-lg font-bold text-[var(--green-primary)]">
                    Seleccione la fecha de su visita
                  </h3>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {dates.map((d, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(i)}
                      className={`flex flex-col items-center justify-center min-w-[64px] h-20 rounded-xl border-2 transition-all cursor-pointer ${
                        selectedDate === i
                          ? "border-[var(--green-primary)] bg-[var(--green-primary)] text-white"
                          : "border-[var(--border)] bg-white hover:border-[var(--green-primary)]/30 text-[var(--text-dark)]"
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
                  <h3 className="text-lg font-bold text-[var(--green-primary)]">
                    Seleccione el horario de su visita
                  </h3>
                </div>
                <div className="flex flex-col gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedTime(slot.id)}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        selectedTime === slot.id
                          ? "border-[var(--green-primary)] bg-[var(--green-light)]/30"
                          : "border-[var(--border)] bg-white hover:border-[var(--green-primary)]/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedTime === slot.id
                              ? "border-[var(--green-primary)]"
                              : "border-[var(--border)]"
                          }`}
                        >
                          {selectedTime === slot.id && (
                            <div className="w-2.5 h-2.5 rounded-full bg-[var(--green-primary)]" />
                          )}
                        </div>
                        <span className="font-semibold text-[var(--green-primary)]">
                          {slot.time}
                        </span>
                      </div>
                      <span className="text-sm text-[var(--text-muted)]">
                        {slot.spots} spots left
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Submit */}
              <Button size="lg" fullWidth>
                Reservar ahora
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
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

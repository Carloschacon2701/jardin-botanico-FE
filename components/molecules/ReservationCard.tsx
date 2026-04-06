"use client";

interface ReservationCardProps {
  name: string;
  email: string;
  visitType: string;
  date: string;
  time: string;
  status: "confirmed" | "pending" | "cancelled";
  onCancel?: () => void;
}

const statusStyles = {
  confirmed: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusLabels = {
  confirmed: "Confirmada",
  pending: "Pendiente",
  cancelled: "Cancelada",
};

export default function ReservationCard({
  name,
  email,
  visitType,
  date,
  time,
  status,
  onCancel,
}: ReservationCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-light flex items-center justify-center text-green-primary font-bold text-sm">
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-green-primary text-sm">
              {name}
            </h3>
            <p className="text-xs text-text-muted">{email}</p>
          </div>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[status]}`}
        >
          {statusLabels[status]}
        </span>
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-text-dark">
          <TagIcon />
          <span>{visitType}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-text-dark">
          <CalendarIcon />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-text-dark">
          <ClockIcon />
          <span>{time}</span>
        </div>
      </div>

      {status !== "cancelled" && onCancel && (
        <button
          onClick={onCancel}
          className="w-full h-9 rounded-lg border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors cursor-pointer"
        >
          Cancelar reserva
        </button>
      )}
    </div>
  );
}

function TagIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <path d="M1 7.5L7 1H13V7L7 13L1 7.5Z" />
      <circle cx="10" cy="4" r="1" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <rect x="1" y="2" width="12" height="11" rx="1.5" />
      <path d="M10 1V3M4 1V3M1 6H13" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <circle cx="7" cy="7" r="6" />
      <path d="M7 4V7L9 9" />
    </svg>
  );
}

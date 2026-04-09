"use client";

import { useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/atoms/Logo";
import Button from "@/components/atoms/Button";

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  showAdminLink: boolean;
  onSignOut: () => void | Promise<void>;
}

const baseSidebarLinks = [
  { label: "Inicio", href: "/", icon: HomeIcon },
  { label: "Agendar visita", href: "/booking", icon: CalendarIcon },
];

export default function MobileSidebar({
  open,
  onClose,
  isLoading,
  isAuthenticated,
  showAdminLink,
  onSignOut,
}: MobileSidebarProps) {
  const sidebarLinks = [
    ...baseSidebarLinks,
    ...(showAdminLink
        ? [{ label: "Panel de administración", href: "/admin", icon: AdminIcon }]
      : []),
  ];

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-78 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6">
          <Logo size="sm" showText={false} />
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center cursor-pointer"
            aria-label="Cerrar menú"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="text-green-primary"
            >
              <path d="M1 1L17 17M17 1L1 17" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 pt-4">
          <ul className="flex flex-col gap-2">
            {sidebarLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center gap-4 px-4 py-4 rounded-xl text-green-primary hover:bg-green-light transition-colors no-underline"
                >
                  <link.icon />
                  <span className="text-base font-medium">{link.label}</span>
                </Link>
              </li>
            ))}

            {!isLoading && !isAuthenticated && (
              <li>
                <Link
                  href="/login"
                  onClick={onClose}
                  className="flex items-center gap-4 px-4 py-4 rounded-xl text-green-primary hover:bg-green-light transition-colors no-underline"
                >
                  <LoginIcon />
                  <span className="text-base font-medium">Iniciar sesión</span>
                </Link>
              </li>
            )}
          </ul>

          <div className="mt-8">
            <Button
              variant="primary"
              fullWidth
              href="https://api.whatsapp.com/send?phone=573164866145"
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
            >
              <HeartIcon />
              <span className="ml-2">Apoyar al jardín</span>
            </Button>
          </div>
        </nav>

        {/* Footer */}
        <div className="px-6 py-6 border-t border-border">
          {isLoading ? (
            <div className="h-10 w-full rounded-lg bg-gray-200 animate-pulse" />
          ) : isAuthenticated ? (
            <Button fullWidth variant="outline" size="sm" onClick={onSignOut}>
              CERRAR SESIÓN
            </Button>
          ) : (
            <Button fullWidth variant="outline" size="sm" href="/login" onClick={onClose}>
              INICIAR SESIÓN
            </Button>
          )}
        </div>
      </aside>
    </>
  );
}

function HomeIcon() {
  return (
    <svg
      width="16"
      height="18"
      viewBox="0 0 16 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 7L8 1L15 7V16C15 16.5523 14.5523 17 14 17H2C1.44772 17 1 16.5523 1 16V7Z" />
      <path d="M6 17V9H10V17" />
    </svg>
  );
}

function AdminIcon() {
  return (
    <svg
      width="18"
      height="20"
      viewBox="0 0 18 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 1L1 5V10C1 14.97 4.56 19.26 9 20C13.44 19.26 17 14.97 17 10V5L9 1Z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="18"
      height="20"
      viewBox="0 0 18 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="1" y="3" width="16" height="16" rx="2" />
      <path d="M13 1V5M5 1V5M1 9H17" />
    </svg>
  );
}

function LoginIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13 17H16C17.1046 17 18 16.1046 18 15V5C18 3.89543 17.1046 3 16 3H13" />
      <path d="M8 14L13 10L8 6" />
      <path d="M13 10H2" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      width="21"
      height="20"
      viewBox="0 0 21 20"
      fill="currentColor"
      className="shrink-0"
    >
      <path d="M10.5 18.35L9.23 17.21C4.5 12.98 1.5 10.28 1.5 6.99C1.5 4.29 3.72 2.15 6.5 2.15C8.04 2.15 9.54 2.87 10.5 4.01C11.46 2.87 12.96 2.15 14.5 2.15C17.28 2.15 19.5 4.29 19.5 6.99C19.5 10.28 16.5 12.98 11.77 17.22L10.5 18.35Z" />
    </svg>
  );
}

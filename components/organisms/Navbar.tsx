"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/atoms/Logo";
import Button from "@/components/atoms/Button";
import MobileSidebar from "@/components/organisms/MobileSidebar";
import { useAuth } from "@/app/context/AuthContext";
import { supabase } from "@/lib/supabase";

const baseNavLinks = [
  { label: "Inicio", href: "/" },
  { label: "Agendar Visita", href: "/booking" },
];

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { session, userRole, isLoading } = useAuth();
  const router = useRouter();

  const navLinks = [
    ...baseNavLinks,
    ...(userRole === 1 ? [{ label: "Admin Panel", href: "/admin" }] : []),
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-(--bg)/80 border-b border-(--border-green)">
        <nav className="mx-auto max-w-360 flex items-center justify-between px-4 py-4 md:px-10 lg:px-40">
          <Logo />

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-green-primary hover:text-terracotta transition-colors no-underline"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-4">
            {isLoading ? (
              <div className="h-9 w-32 rounded-lg bg-gray-200 animate-pulse" />
            ) : session ? (
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push("/login");
                }}
              >
                CERRAR SESIÓN
              </Button>
            ) : (
              <Button href="/login" size="sm" variant="outline">
                INICIAR SESION
              </Button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 cursor-pointer"
            aria-label="Abrir menú"
          >
            <span className="block w-6 h-0.5 bg-green-primary" />
            <span className="block w-6 h-0.5 bg-green-primary" />
            <span className="block w-6 h-0.5 bg-green-primary" />
          </button>
        </nav>
      </header>

      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}

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
  { label: "Agendar visita", href: "/booking" },
];

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { session, userRole, isLoading } = useAuth();
  const router = useRouter();
  const isAuthenticated = Boolean(session);
  const isAdmin = userRole === 1;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSidebarOpen(false);
    router.push("/login");
  };

  const navLinks = [
    ...baseNavLinks,
    ...(isAdmin ? [{ label: "Panel de administración", href: "/admin" }] : []),
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-(--bg)/80 border-b border-(--border-green)">
        <nav className="mx-auto max-w-360 flex items-center md:justify-between px-4 py-4 md:px-10 lg:px-40">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 cursor-pointer shrink-0"
            aria-label="Abrir menú"
          >
            <span className="block w-6 h-0.5 bg-green-primary" />
            <span className="block w-6 h-0.5 bg-green-primary" />
            <span className="block w-6 h-0.5 bg-green-primary" />
          </button>

          <div className="flex-1 flex justify-center pr-10 md:pr-0 md:flex-none md:justify-start">
            <Logo size="md" showText={false} />
          </div>

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
            ) : isAuthenticated ? (
              <Button
                size="sm"
                variant="outline"
                onClick={handleSignOut}
              >
                CERRAR SESIÓN
              </Button>
            ) : (
              <Button href="/login" size="sm" variant="outline">
                INICIAR SESIÓN
              </Button>
            )}
          </div>

        </nav>
      </header>

      <MobileSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isLoading={isLoading}
        isAuthenticated={isAuthenticated}
        showAdminLink={isAdmin}
        onSignOut={handleSignOut}
      />
    </>
  );
}

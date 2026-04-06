"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/atoms/Logo";
import Button from "@/components/atoms/Button";
import MobileSidebar from "@/components/organisms/MobileSidebar";
import { supabase } from "@/lib/supabase";

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Agendar Visita", href: "/booking" },
  { label: "Admin Panel", href: "/admin" },
];

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[var(--bg)]/80 border-b border-[var(--border-green)]">
        <nav className="mx-auto max-w-[1440px] flex items-center justify-between px-4 py-4 md:px-10 lg:px-[160px]">
          <Logo />

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-[var(--green-primary)] hover:text-[var(--terracotta)] transition-colors no-underline"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn === null ? null : isLoggedIn ? (
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
            <span className="block w-6 h-0.5 bg-[var(--green-primary)]" />
            <span className="block w-6 h-0.5 bg-[var(--green-primary)]" />
            <span className="block w-6 h-0.5 bg-[var(--green-primary)]" />
          </button>
        </nav>
      </header>

      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import BackButton from "@/components/atoms/BackButton";
import { registerSchema, type RegisterFormData } from "@/lib/schemas";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    console.log("Register:", data);
  };

  return (
    <div className="flex min-h-screen bg-[#f8f6f6]">
      {/* Desktop left side - decorative image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-green-primary">
          <Image
            src="/images/hero-garden.png"
            alt=""
            fill
            className="object-cover opacity-60"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-linear-to-t from-green-primary via-transparent to-transparent" />
        </div>
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Image
              src="/images/logo-leaf.svg"
              alt=""
              width={28}
              height={30}
              aria-hidden="true"
            />
            <h2 className="text-2xl font-bold tracking-tight">
              JARDIN BOTANICO UNET
            </h2>
          </div>
          <p className="text-base text-white/80 max-w-md leading-relaxed">
            Únete a nuestra comunidad de amantes de la naturaleza. Descubre,
            aprende y contribuye a la conservación de nuestra biodiversidad.
          </p>
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <header className="p-4 lg:hidden">
          <BackButton />
        </header>

        <main className="flex-1 flex items-center justify-center px-6 pb-12 lg:px-16">
          <div className="w-full max-w-md lg:bg-white lg:rounded-3xl lg:shadow-lg lg:p-12 flex flex-col items-center">
            {/* Icon + heading */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 rounded-full bg-[rgba(45,106,79,0.1)] flex items-center justify-center mb-6">
                <Image
                  src="/images/leaf-icon.svg"
                  alt=""
                  width={36}
                  height={40}
                  aria-hidden="true"
                />
              </div>
              <h1 className="text-3xl font-bold text-green-primary tracking-tight mb-2">
                ¡Únete a nosotros!
              </h1>
              <p className="text-base text-(--green-primary)/70 text-center">
                Ingrese sus datos para crear su cuenta
              </p>
            </div>

            {/* Form */}
            <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
              <Input
                label="Nombre completo"
                type="text"
                placeholder="Enter your full name"
                autoComplete="name"
                {...register("fullName")}
                error={errors.fullName?.message}
                rightElement={<UserIcon />}
              />

              <Input
                label="Email"
                type="email"
                placeholder="nature@example.com"
                autoComplete="email"
                {...register("email")}
                error={errors.email?.message}
                rightElement={<MailIcon />}
              />

              <Input
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                {...register("password")}
                error={errors.password?.message}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-text-muted hover:text-green-primary transition-colors cursor-pointer"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    <EyeIcon />
                  </button>
                }
              />

              <Input
                label="Confirmar contraseña"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                {...register("confirmPassword")}
                error={errors.confirmPassword?.message}
                rightElement={<LockIcon />}
              />

              <div className="pt-4">
                <Button type="submit" fullWidth size="lg">
                  Registrarse
                </Button>
              </div>
            </form>

            {/* Footer link */}
            <div className="mt-8 text-center text-sm">
              <span className="text-text-dark">
                Ya tienes una cuenta?{" "}
              </span>
              <Link
                href="/login"
                className="font-bold text-green-primary hover:underline no-underline"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="5" r="3" />
      <path d="M2 15C2 11.6863 4.68629 9 8 9C11.3137 9 14 11.6863 14 15" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="1" width="16" height="12" rx="2" />
      <path d="M1 3L9 8L17 3" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="18" viewBox="0 0 14 18" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="8" width="12" height="9" rx="2" />
      <path d="M3.5 8V5C3.5 3.067 5.067 1.5 7 1.5C8.933 1.5 10.5 3.067 10.5 5V8" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 6C1 6 3.5 1 8 1C12.5 1 15 6 15 6C15 6 12.5 11 8 11C3.5 11 1 6 1 6Z" />
      <circle cx="8" cy="6" r="2" />
    </svg>
  );
}

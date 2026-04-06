"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import BackButton from "@/components/atoms/BackButton";
import { loginSchema, type LoginFormData } from "@/lib/schemas";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMsg("");
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    setIsLoading(false);

    if (error) {
      setErrorMsg("Credenciales incorrectas. Verifique su email y contraseña.");
      return;
    }

    router.push("/admin");
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
            Descubre la belleza de la naturaleza en nuestro santuario botánico.
            Un espacio dedicado a la conservación y la educación ambiental.
          </p>
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4">
          <BackButton />
          <Link
            href="/"
            className="text-sm font-semibold text-green-primary hover:text-terracotta transition-colors no-underline"
          >
            Inicio
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center px-6 pb-12 lg:px-16">
          <div className="w-full max-w-100 flex flex-col items-center">
            {/* Icon + heading */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 rounded-full bg-[rgba(45,106,79,0.1)] flex items-center justify-center mb-6">
                <Image
                  src="/images/leaf-icon.svg"
                  alt=""
                  width={55}
                  height={50}
                  aria-hidden="true"
                />
              </div>
              <h1 className="text-3xl font-bold text-green-primary tracking-tight mb-2">
                ¡Bienvenido!
              </h1>
              <p className="text-base text-(--green-primary)/70 text-center">
                Ingrese sus datos para acceder a su cuenta
              </p>
            </div>

            {/* Form */}
            <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
              {errorMsg && (
                <div className="w-full rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                  {errorMsg}
                </div>
              )}

              <Input
                label="Email Address"
                type="email"
                placeholder="hello@botanical.com"
                autoComplete="email"
                {...register("email")}
                error={errors.email?.message}
              />

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-green-primary tracking-wide"
                  >
                    Password
                  </label>
                  <Link
                    href="#"
                    className="text-xs font-medium text-terracotta hover:underline no-underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...register("password")}
                  error={errors.password?.message}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-text-muted hover:text-green-primary transition-colors cursor-pointer"
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      <EyeIcon open={showPassword} />
                    </button>
                  }
                />
              </div>

              <Button type="submit" fullWidth size="lg" disabled={isLoading}>
                {isLoading ? "Ingresando..." : "Login"}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 w-full mt-8">
              <div className="flex-1 h-px bg-(--border-green)" />
              <span className="text-sm text-(--green-primary)/40">
                o inicia con
              </span>
              <div className="flex-1 h-px bg-(--border-green)" />
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-4 w-full mt-6">
              <button className="h-12 rounded-xl border-2 border-[rgba(45,106,79,0.1)] flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer">
                <Image
                  src="/images/google-icon.svg"
                  alt="Google"
                  width={24}
                  height={24}
                />
              </button>
              <button className="h-12 rounded-xl border-2 border-[rgba(45,106,79,0.1)] flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer">
                <Image
                  src="/images/apple-icon.svg"
                  alt="Apple"
                  width={24}
                  height={24}
                />
              </button>
            </div>

            {/* Footer link */}
            <div className="mt-10 text-center text-sm">
              <span className="text-text-dark">
                No tiene una cuenta?{" "}
              </span>
              <Link
                href="/register"
                className="font-bold text-green-primary hover:underline no-underline"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="22" height="15" viewBox="0 0 22 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 7.5C1 7.5 5 1 11 1C17 1 21 7.5 21 7.5C21 7.5 17 14 11 14C5 14 1 7.5 1 7.5Z" />
        <circle cx="11" cy="7.5" r="3" />
      </svg>
    );
  }
  return (
    <svg width="22" height="15" viewBox="0 0 22 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 7.5C1 7.5 5 1 11 1C17 1 21 7.5 21 7.5C21 7.5 17 14 11 14C5 14 1 7.5 1 7.5Z" />
      <circle cx="11" cy="7.5" r="3" />
      <path d="M3 1L19 14" />
    </svg>
  );
}

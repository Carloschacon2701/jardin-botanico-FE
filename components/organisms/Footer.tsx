import Logo from "@/components/atoms/Logo";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[var(--border)] bg-[var(--bg)]">
      <div className="mx-auto max-w-[1440px] flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-10 md:px-10 lg:px-[160px]">
        <Logo size="sm" />
        <p className="text-xs text-[var(--text-muted)] text-center sm:text-right">
          © 2026 Jardín Botánico UNET. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

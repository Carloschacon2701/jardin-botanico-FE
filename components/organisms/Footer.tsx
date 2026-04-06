import Logo from "@/components/atoms/Logo";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-bg">
      <div className="mx-auto max-w-360 flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-10 md:px-10 lg:px-40">
        <Logo size="sm" />
        <p className="text-xs text-text-muted text-center sm:text-right">
          © 2026 Jardín Botánico UNET. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

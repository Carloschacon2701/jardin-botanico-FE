import Image from "next/image";
import Link from "next/link";
import type { HTMLAttributes } from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: HTMLAttributes<HTMLAnchorElement>["className"];
}

const sizeMap = {
  sm: { width: 88, height: 30, text: "text-base" },
  md: { width: 108, height: 36, text: "text-xl" },
  lg: { width: 136, height: 46, text: "text-2xl" },
};

export default function Logo({
  size = "md",
  showText = false,
  className,
}: LogoProps) {
  const { width, height, text } = sizeMap[size];

  return (
    <Link
      href="/"
      className={`flex items-center gap-2 no-underline ${className ?? ""}`}
    >
      <Image
        src="/images/logo-unet.png"
        alt="Jardín Botánico UNET"
        width={width}
        height={height}
        priority
        className="h-auto w-auto max-h-10 shrink-0 object-contain"
      />
      {showText && (
        <span
          className={`font-bold text-green-primary tracking-tight ${text}`}
        >
          Jardín Botánico UNET
        </span>
      )}
    </Link>
  );
}

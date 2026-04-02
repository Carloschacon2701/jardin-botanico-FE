import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const sizeMap = {
  sm: { icon: 18, text: "text-base" },
  md: { icon: 22, text: "text-xl" },
  lg: { icon: 28, text: "text-2xl" },
};

export default function Logo({ size = "md", showText = true }: LogoProps) {
  const { icon, text } = sizeMap[size];

  return (
    <Link href="/" className="flex items-center gap-2 no-underline">
      <Image
        src="/images/logo-leaf.svg"
        alt="Jardín Botánico UNET"
        width={icon}
        height={icon + 3}
        className="shrink-0"
      />
      {showText && (
        <span
          className={`font-bold text-[var(--green-primary)] tracking-tight ${text}`}
        >
          Jardin Botanico UNET
        </span>
      )}
    </Link>
  );
}

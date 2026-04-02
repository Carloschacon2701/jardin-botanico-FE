import { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "donate";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  children: React.ReactNode;
}

type ButtonAsButton = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    href?: never;
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--terracotta)] text-white shadow-[0px_20px_25px_-5px_var(--terracotta-shadow),0px_8px_10px_-6px_var(--terracotta-shadow)] hover:brightness-110 active:brightness-95",
  secondary:
    "bg-[var(--green-primary)] text-white hover:brightness-110 active:brightness-95",
  outline:
    "border border-[var(--terracotta)] bg-[var(--terracotta-light)] text-[var(--terracotta)] hover:bg-[var(--terracotta)] hover:text-white",
  donate:
    "border border-[var(--terracotta)] bg-[var(--terracotta-light)] text-[var(--terracotta)] hover:bg-[var(--terracotta)] hover:text-white",
};

const sizeStyles: Record<string, string> = {
  sm: "h-10 px-5 text-sm rounded-[var(--radius-sm)]",
  md: "h-12 px-6 text-base rounded-[var(--radius-md)]",
  lg: "h-14 px-8 text-lg rounded-[var(--radius-md)]",
};

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  children,
  ...props
}: ButtonProps) {
  const classes = [
    "inline-flex items-center justify-center font-bold tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap",
    variantStyles[variant],
    sizeStyles[size],
    fullWidth ? "w-full" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if ("href" in props && props.href) {
    const { href, ...rest } = props as ButtonAsLink;
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  const buttonProps = props as ButtonAsButton;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  rightElement?: React.ReactNode;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, rightElement, error, id, className = "", ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-[var(--green-primary)] tracking-wide"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={`w-full h-14 px-4 bg-white border-2 border-[var(--border-green-light)] rounded-xl text-base text-[var(--text-dark)] placeholder:text-gray-400 focus:outline-none focus:border-[var(--green-primary)] focus:ring-1 focus:ring-[var(--green-primary)] transition-colors ${
              error ? "border-red-400" : ""
            } ${rightElement ? "pr-14" : ""} ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;

"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[var(--green-light)] transition-colors cursor-pointer"
      aria-label="Volver"
    >
      <svg
        width="19"
        height="19"
        viewBox="0 0 19 19"
        fill="none"
        stroke="var(--green-primary)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 9.5H4M4 9.5L9.5 4M4 9.5L9.5 15" />
      </svg>
    </button>
  );
}

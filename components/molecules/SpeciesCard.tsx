import Image from "next/image";
import Link from "next/link";
import Button from "@/components/atoms/Button";

interface SpeciesCardProps {
  title: string;
  description: string;
  category: string;
  imageSrc: string;
  imageAlt?: string;
  detailHref?: string;
  donateHref?: string;
}

export default function SpeciesCard({
  title,
  description,
  category,
  imageSrc,
  imageAlt,
  detailHref = "/detail",
  donateHref = "#",
}: SpeciesCardProps) {
  return (
    <article className="group flex flex-col bg-white rounded-2xl border border-[var(--border-green-subtle)] shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 w-full min-w-[220px] max-w-[280px] shrink-0">
      <Link href={detailHref} className="relative h-[224px] overflow-hidden block">
        <Image
          src={imageSrc}
          alt={imageAlt || title}
          fill
          sizes="(max-width: 640px) 280px, 236px"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-black uppercase tracking-[1px] text-[var(--green-primary)]">
          {category}
        </span>
      </Link>
      <div className="flex flex-col gap-4 p-6 flex-1">
        <div className="flex flex-col gap-2 flex-1">
          <Link href={detailHref} className="no-underline">
            <h3 className="text-xl font-bold text-[var(--green-primary)] leading-7 hover:text-[var(--terracotta)] transition-colors">
              {title}
            </h3>
          </Link>
          <p className="text-sm text-[var(--text-dark)] leading-relaxed">
            {description}
          </p>
        </div>
        <Button variant="donate" size="sm" fullWidth href={donateHref}>
          Donate
        </Button>
      </div>
    </article>
  );
}

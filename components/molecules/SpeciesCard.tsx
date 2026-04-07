import Image from "next/image";
import Link from "next/link";

interface SpeciesCardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt?: string;
  detailHref: string;
}

export default function SpeciesCard({
  title,
  description,
  imageSrc,
  imageAlt,
  detailHref,
}: SpeciesCardProps) {
  return (
    <Link href={detailHref} className="no-underline block min-w-55 max-w-70 shrink-0">
      <article className="group flex flex-col bg-white rounded-2xl border border-(--border-green-subtle) shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 h-full w-full">
        <div className="relative h-56 overflow-hidden">
          <Image
            src={imageSrc}
            alt={imageAlt || title}
            fill
            sizes="(max-width: 640px) 280px, 236px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="flex flex-col gap-2 p-6 flex-1">
          <h3 className="text-xl font-bold text-green-primary leading-7 group-hover:text-terracotta transition-colors">
            {title}
          </h3>
          <p className="text-sm text-text-dark leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>
      </article>
    </Link>
  );
}

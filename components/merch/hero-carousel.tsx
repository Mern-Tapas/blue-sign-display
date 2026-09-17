import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProductImage } from "@/components/commerce/product-image";
import { Button } from "@/components/ui/button";
import { Carousel } from "@/components/ui/carousel";
import { cn } from "@/lib/cn";

export type HeroSlide = {
  id: string;
  title: string;
  /** Second phrase rendered muted ("Everyday goods, quietly considered."). */
  muted?: string;
  description?: string;
  image: string;
  /** Alt text only when the photo carries meaning beyond the headline. */
  imageAlt?: string;
  href: string;
  cta: string;
  secondary?: { href: string; label: string };
  /** Where the text block sits over the photo. */
  align?: "start" | "end";
};

export type HeroCarouselProps = {
  slides: HeroSlide[];
  "aria-label"?: string;
  /** ms between slides; 0 disables autoplay. Autoplay always stops on hover/focus and under reduced motion. */
  autoplay?: number;
  /** The first slide's title becomes the page h1 on landing pages. */
  firstHeadingLevel?: "h1" | "h2";
  className?: string;
};

/**
 * Full-bleed campaign carousel. Text sits on a scrim so contrast holds on any photo, the first
 * image is preloaded (LCP), and each slide is a real link destination with one clear action.
 * Server-safe wrapper around the client Carousel.
 */
export function HeroCarousel({ slides, "aria-label": ariaLabel = "Featured campaigns", autoplay = 7000, firstHeadingLevel = "h2", className }: HeroCarouselProps) {
  return (
    <Carousel aria-label={ariaLabel} autoplay={autoplay || undefined} controls="overlay" className={cn("overflow-hidden rounded-2xl shadow-card", className)}>
      {slides.map((s, i) => {
        const Heading = i === 0 ? firstHeadingLevel : "h2";
        return (
          <div key={s.id} className="relative aspect-[4/5] w-full overflow-hidden bg-surface-contrast sm:aspect-[16/9] lg:aspect-[21/8]">
            <ProductImage
              src={s.image}
              alt={s.imageAlt ?? ""}
              preload={i === 0}
              sizes="(min-width: 1320px) 1320px, 100vw"
              wrapperClassName="absolute inset-0 bg-surface-contrast"
            />
            <div
              aria-hidden
              className={cn(
                "absolute inset-0 from-scrim via-scrim/50 to-transparent",
                "max-sm:bg-linear-to-t",
                s.align === "end" ? "sm:bg-linear-to-l" : "sm:bg-linear-to-r",
              )}
            />
            <div
              className={cn(
                "absolute inset-0 flex flex-col justify-end gap-4 p-6 pb-14 text-white sm:max-w-[34rem] sm:justify-center sm:p-10 lg:p-14",
                s.align === "end" && "sm:right-0 sm:left-auto sm:items-end sm:text-right",
              )}
            >
              <Heading className="text-display-lg sm:text-display-xl lg:text-display-2xl">
                {s.title}
                {s.muted && <span className="text-fg-on-accent-muted"> {s.muted}</span>}
              </Heading>
              {s.description && <p className="max-w-md text-body-lg text-fg-on-accent-muted">{s.description}</p>}
              <div className={cn("flex flex-wrap gap-3", s.align === "end" && "sm:justify-end")}>
                <Button asChild size="lg" variant="inverse" trailingIcon={<ArrowUpRight aria-hidden />}>
                  <Link href={s.href}>{s.cta}</Link>
                </Button>
                {s.secondary && (
                  <Button asChild size="lg" variant="ghost" className="text-white">
                    <Link href={s.secondary.href}>{s.secondary.label}</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </Carousel>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Transition } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { DISPLAYNODE_NAME } from "@/lib/data/displays";

/** Strong ease-out (--ease-out in the design tokens), used for every part of the reveal. */
const EASE: Transition["ease"] = [0.23, 1, 0.32, 1];
const HEADLINE = "Stands out in any space.";
/**
 * The server renders before the browser's motion preference is known, so every first paint carries the
 * blur/offset start values. This CSS guard strips them for reduced-motion users; only the fade remains.
 */
const NO_MOTION = "motion-reduce:filter-none! motion-reduce:transform-none!";

const SLIDES = [
  { src: "/products/hero/slide-1.webp", alt: "The range in one room: pedestal, totem, wall, desk and portable screens" },
  { src: "/products/hero/slide-2.webp", alt: "Floor-standing totems either side of a table of desk and tablet displays" },
  { src: "/products/hero/slide-3.webp", alt: "A dozen portrait totems behind tablet and counter displays on the floor" },
  { src: "/products/hero/slide-4.webp", alt: "Floor-standing totem display on castors" },
  { src: "/products/hero/slide-5.webp", alt: "Portable A-frame easel display" },
  { src: "/products/hero/slide-6.webp", alt: "Wall-mounted portrait display" },
];

const SLIDE_MS = 5000;

/**
 * Where the page's own content column starts. The copy is aligned to it so the headline lines up with
 * every section below, and the desktop falloff is anchored to it so the dark part tracks the text
 * rather than a fixed share of the viewport.
 */
const GUTTER_X = "max(var(--gutter), calc((100% - var(--container-max)) / 2 + var(--gutter)))";

/**
 * Home hero. Full-bleed photography with the copy set directly on it: no panel, no card. The only
 * tint is a falloff anchored to the copy itself, so the text stays legible while the products keep
 * their brightness. The photo slides through the range; on load it resolves from a soft blur and the
 * headline arrives word by word out of the same blur. Reduced motion keeps only a short fade and
 * stops the slider advancing on its own.
 */
export function HomeHero() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((n) => (n + 1) % SLIDES.length), SLIDE_MS);
    return () => clearInterval(id);
  }, [reduce]);

  // `initial` must not branch on `reduce`: the server renders before the preference is known, so a branch
  // here makes the SSR style attribute disagree with the client and React logs a hydration mismatch. The
  // blur/offset start values are the same in both cases and NO_MOTION strips them with `!important` under
  // reduced motion, leaving only the fade, so only the `transition` needs to differ.
  const word = (n: number) => ({
    initial: { opacity: 0, filter: "blur(12px)", transform: "translateY(0.35em)" },
    animate: { opacity: 1, filter: "blur(0px)", transform: "translateY(0em)" },
    transition: reduce ? { duration: 0.3 } : { duration: 0.9, delay: 0.35 + n * 0.07, ease: EASE },
  });

  const after = (delay: number) => ({
    initial: { opacity: 0, filter: "blur(8px)", transform: "translateY(10px)" },
    animate: { opacity: 1, filter: "blur(0px)", transform: "translateY(0px)" },
    transition: reduce ? { duration: 0.3 } : { duration: 0.8, delay, ease: EASE },
  });

  const words = HEADLINE.split(" ");
  const textDelay = 0.35 + words.length * 0.07;

  const dots = SLIDES.map((s, n) => (
    <button
      key={s.src}
      type="button"
      onClick={() => setI(n)}
      aria-label={`Show image ${n + 1} of ${SLIDES.length}`}
      aria-current={n === i}
      className="hit-area relative rounded-pill outline-offset-4"
    >
      <span
        className={cn(
          "block h-1.5 rounded-pill bg-white transition-all duration-(--dur-base) ease-(--ease-out)",
          n === i ? "w-6 opacity-100" : "w-1.5 opacity-45",
        )}
      />
    </button>
  ));

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[32rem] flex-col justify-end overflow-hidden bg-[#240c13] sm:min-h-[36rem] lg:min-h-[min(42rem,calc(100dvh-7rem))]"
    >
      <motion.div
        className={cn("absolute inset-0 -z-10", NO_MOTION)}
        initial={{ filter: "blur(24px)", transform: "scale(1.08)" }}
        animate={{ filter: "blur(0px)", transform: "scale(1)" }}
        transition={reduce ? { duration: 0 } : { duration: 1.6, ease: EASE }}
      >
        {/*
         * Every slide is mounted and stacked; only opacity changes. A translated track would need all
         * six full-bleed photos laid out side by side at once. `object-[70%_45%]` pans the frame right
         * so the emptier left side of each room sits under the copy: the products are composed centre
         * and right, and the top edge is the only one that can clip hardware.
         */}
        {SLIDES.map((s, n) => (
          <Image
            key={s.src}
            src={s.src}
            alt={n === i ? s.alt : ""}
            aria-hidden={n !== i}
            fill
            preload={n === 0}
            loading={n === 0 ? undefined : "lazy"}
            quality={90}
            sizes="100vw"
            className={cn(
              "object-cover object-[center_52%] transition-opacity duration-700 ease-(--ease-out) motion-reduce:transition-none",
              n === i ? "opacity-100" : "opacity-0",
            )}
          />
        ))}
      </motion.div>

      {/*
       * One falloff, along the bottom, because the copy is a band there at every width. It rises out
       * of the floor of the frame, which is the cheap part of the picture to lose: the products stand
       * in the clear upper two thirds. Nothing washes the middle or the top of the photo any more.
       */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(to top, rgb(20 6 11 / 0.95) 0%, rgb(20 6 11 / 0.9) 22%, rgb(20 6 11 / 0.62) 42%, rgb(20 6 11 / 0.18) 62%, rgb(20 6 11 / 0) 78%)",
        }}
      />

      <div
        className="flex w-full flex-col gap-5 pt-24 pb-9 text-white sm:pt-28 sm:pb-10 lg:gap-6 lg:pt-32 lg:pb-12"
        style={{ paddingInlineStart: GUTTER_X, paddingInlineEnd: "var(--gutter)" }}
      >
        <h1
          id="hero-title"
          className="max-w-[13ch] text-[clamp(2.5rem,7vw,3.25rem)] leading-[1.04] font-medium tracking-[-0.035em] text-balance lg:max-w-none lg:text-[clamp(3rem,4.2vw,4.25rem)]"
        >
          {words.map((w, n) => (
            <motion.span key={n} className={cn("inline-block pr-[0.22em] last:pr-0", NO_MOTION)} {...word(n)}>
              {w}
            </motion.span>
          ))}
        </h1>

        {/* Below lg the supporting line stacks; from lg it shares the band with the actions and the dots. */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <motion.p
            className={cn("max-w-sm text-body-lg text-white sm:text-[1.0625rem] sm:leading-7", NO_MOTION)}
            {...after(textDelay)}
          >
            Floor, wall, desk or on the move: one range of IPS displays, every screen managed with{" "}
            {DISPLAYNODE_NAME}.
          </motion.p>

          <motion.div className={cn("flex flex-wrap items-center gap-2", NO_MOTION)} {...after(textDelay + 0.12)}>
            <Button asChild size="lg" trailingIcon={<ArrowUpRight aria-hidden />}>
              <Link href="/products">Explore displays</Link>
            </Button>
            <Button asChild size="lg" variant="inverse">
              <Link href="/contact">Get a quote</Link>
            </Button>
            <div className="ml-2 hidden items-center gap-1.5 lg:flex">{dots}</div>
          </motion.div>
        </div>
      </div>

      {/* Below lg the dots sit clear of the copy band, at the top right of the frame. */}
      <div className="absolute top-5 right-4 flex gap-1.5 sm:top-6 sm:right-6 lg:hidden">{dots}</div>
    </section>
  );
}

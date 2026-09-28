"use client";

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

/**
 * Home hero: the display range photographed in one room. The photo is visible from the first paint and
 * resolves from a soft blur; the headline then arrives word by word out of the same blur, followed by
 * the supporting line and the actions. Reduced motion keeps only a short fade.
 */
export function HomeHero() {
  const reduce = useReducedMotion();

  // `initial` must not branch on `reduce`: the server renders before the preference is known, so a branch
  // here makes the SSR style attribute disagree with the client and React logs a hydration mismatch. The
  // blur/offset start values are the same in both cases and NO_MOTION strips them with `!important` under
  // reduced motion, leaving only the fade — so only the `transition` needs to differ.
  const word = (i: number) => ({
    initial: { opacity: 0, filter: "blur(12px)", transform: "translateY(0.35em)" },
    animate: { opacity: 1, filter: "blur(0px)", transform: "translateY(0em)" },
    transition: reduce ? { duration: 0.3 } : { duration: 0.9, delay: 0.35 + i * 0.07, ease: EASE },
  });

  const after = (delay: number) => ({
    initial: { opacity: 0, filter: "blur(8px)", transform: "translateY(10px)" },
    animate: { opacity: 1, filter: "blur(0px)", transform: "translateY(0px)" },
    transition: reduce ? { duration: 0.3 } : { duration: 0.8, delay, ease: EASE },
  });

  const words = HEADLINE.split(" ");
  const textDelay = 0.35 + words.length * 0.07;

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex flex-col overflow-hidden rounded-2xl bg-[#240c13] shadow-card"
    >
      {/* Phones: the whole room as a 16:10 band above the copy. From sm: full-bleed behind it. */}
      <div className="relative aspect-[16/10] overflow-hidden sm:absolute sm:inset-0 sm:-z-10 sm:aspect-auto">
        <motion.div
          className={cn("absolute inset-0", NO_MOTION)}
          initial={{ filter: "blur(24px)", transform: "scale(1.08)" }}
          animate={{ filter: "blur(0px)", transform: "scale(1)" }}
          transition={reduce ? { duration: 0 } : { duration: 1.6, ease: EASE }}
        >
          <Image
            src="/products/can/hero-range.webp"
            alt="The display range in one room: pedestal, totem, wall, desk and portable screens"
            fill
            preload
            sizes="(min-width: 1320px) 1272px, 100vw"
            className="object-cover object-[center_70%]"
          />
        </motion.div>
        {/*
         * Scrim tinted from the room's own maroon. Phones get a simple bottom fade (the copy sits below the
         * photo). From sm the copy overlays the photo, so the scrim is an ellipse sized in *pixels* and
         * anchored to the copy block — bottom-left from sm, centre-left from lg — rather than a full-width
         * band in percentages. The copy column is itself px-bounded (inset + max-w-sm/xs), so a percentage
         * band both under-covers it as the card narrows (a 976px card left the sub-paragraph at 2.9:1, and
         * the 720px card left the headline at 2.9:1) and over-washes the photo where there is no text.
         * Measured worst case with the ellipses: headline >=7.1:1, sub-paragraph >=6.0:1 at 360-1920.
         */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_top,#240c13,rgb(36_12_19/0)_45%)] sm:bg-[radial-gradient(680px_560px_at_20px_100%,rgb(26_7_13/0.92)_0%,rgb(26_7_13/0.86)_48%,rgb(26_7_13/0.52)_74%,rgb(26_7_13/0.08)_90%,rgb(26_7_13/0)_100%)] lg:bg-[radial-gradient(470px_300px_at_110px_44%,rgb(26_7_13/0.84)_0%,rgb(26_7_13/0.78)_50%,rgb(26_7_13/0.42)_76%,rgb(26_7_13/0)_100%)]"
        />
      </div>

      <div className="flex flex-col justify-end gap-6 px-6 pt-2 pb-7 text-white sm:min-h-[34rem] sm:p-10 lg:min-h-[min(38rem,calc(100dvh-11rem))] lg:justify-center lg:p-14">
        <h1
          id="hero-title"
          className="max-w-[10ch] text-[clamp(2.5rem,6vw,3rem)] leading-[1.04] font-medium tracking-[-0.035em] text-balance lg:text-[clamp(2.25rem,4.4vw,3.5rem)]"
        >
          {words.map((w, i) => (
            <motion.span key={i} className={cn("inline-block pr-[0.22em] last:pr-0", NO_MOTION)} {...word(i)}>
              {w}
            </motion.span>
          ))}
        </h1>
        <motion.p className={cn("max-w-sm text-body-lg text-white/80 sm:text-[1.0625rem] sm:leading-7 lg:max-w-xs", NO_MOTION)} {...after(textDelay)}>
          Floor, wall, desk or on the move: one range of IPS displays, every screen managed with{" "}
          {DISPLAYNODE_NAME}.
        </motion.p>
        <motion.div className={cn("flex flex-wrap gap-2", NO_MOTION)} {...after(textDelay + 0.12)}>
          <Button asChild size="lg" trailingIcon={<ArrowUpRight aria-hidden />}>
            <Link href="/products">Explore displays</Link>
          </Button>
          <Button asChild size="lg" variant="inverse">
            <Link href="/contact">Get a quote</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

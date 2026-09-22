"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Transition } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { DISPLAYNODE_NAME } from "@/lib/data/can-products";

/** Strong ease-out (--ease-out in the design tokens), used for every part of the reveal. */
const EASE: Transition["ease"] = [0.23, 1, 0.32, 1];
const HEADLINE = "Stands out in any space.";
/**
 * The server renders before the browser's motion preference is known, so the first paint may carry the
 * blur/offset start values. This CSS guard strips them for reduced-motion users; only the fade remains.
 */
const NO_MOTION = "motion-reduce:filter-none! motion-reduce:transform-none!";

/**
 * Home hero: the CAN range photographed in one room. The photo is visible from the first paint and
 * resolves from a soft blur; the headline then arrives word by word out of the same blur, followed by
 * the supporting line and the actions. Reduced motion keeps only a short fade.
 */
export function HomeHero() {
  const reduce = useReducedMotion();

  const word = (i: number) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } }
      : {
          initial: { opacity: 0, filter: "blur(12px)", transform: "translateY(0.35em)" },
          animate: { opacity: 1, filter: "blur(0px)", transform: "translateY(0em)" },
          transition: { duration: 0.9, delay: 0.35 + i * 0.07, ease: EASE },
        };

  const after = (delay: number) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } }
      : {
          initial: { opacity: 0, filter: "blur(8px)", transform: "translateY(10px)" },
          animate: { opacity: 1, filter: "blur(0px)", transform: "translateY(0px)" },
          transition: { duration: 0.8, delay, ease: EASE },
        };

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
          initial={reduce ? false : { filter: "blur(24px)", transform: "scale(1.08)" }}
          animate={{ filter: "blur(0px)", transform: "scale(1)" }}
          transition={{ duration: 1.6, ease: EASE }}
        >
          <Image
            src="/products/can/hero-range.webp"
            alt="The CAN display range in one room: pedestal, totem, wall, desk and portable screens"
            fill
            preload
            sizes="(min-width: 1320px) 1272px, 100vw"
            className="object-cover object-[center_70%]"
          />
        </motion.div>
        {/* Scrim tinted from the room's own maroon so the copy reads without greying the photo out. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_top,#240c13,rgb(36_12_19/0)_45%)] sm:bg-[linear-gradient(to_top,rgb(26_7_13/0.92),rgb(26_7_13/0.5)_45%,rgb(26_7_13/0.08)_75%)] lg:bg-[linear-gradient(100deg,rgb(26_7_13/0.94)_0%,rgb(26_7_13/0.82)_28%,rgb(26_7_13/0.35)_50%,rgb(26_7_13/0)_66%)]"
        />
      </div>

      <div className="flex flex-col justify-end gap-6 px-6 pt-2 pb-7 text-white sm:min-h-[34rem] sm:p-10 lg:min-h-[min(38rem,calc(100dvh-11rem))] lg:justify-center lg:p-14">
        <h1
          id="hero-title"
          className="max-w-[12ch] text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.02] font-medium tracking-[-0.04em] text-balance"
        >
          {words.map((w, i) => (
            <motion.span key={i} className={cn("inline-block pr-[0.22em] last:pr-0", NO_MOTION)} {...word(i)}>
              {w}
            </motion.span>
          ))}
        </h1>
        <motion.p className={cn("max-w-sm text-body-lg text-white/80 sm:text-[1.0625rem] sm:leading-7", NO_MOTION)} {...after(textDelay)}>
          Floor, wall, desk or on the move: one range of CAN IPS displays, every screen managed with{" "}
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

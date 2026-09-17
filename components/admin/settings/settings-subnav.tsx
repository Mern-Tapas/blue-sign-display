"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { History } from "lucide-react";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/cn";

export type SettingsSubnavProps = {
  sections: readonly { id: string; label: string }[];
  className?: string;
};

function jumpTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  history.replaceState(null, "", `#${id}`);
}

/**
 * In-page settings navigation. From xl: a sticky vertical list that tracks the section in view.
 * Below xl: a Select that jumps to the chosen section.
 */
export function SettingsSubnav({ sections, className }: SettingsSubnavProps) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e);
    const inView = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? inView.add(e.target.id) : inView.delete(e.target.id)));
        // The first section (in page order) inside the reading band wins.
        const first = sections.find((s) => inView.has(s.id));
        if (first) setActive(first.id);
      },
      { rootMargin: "-96px 0px -55% 0px" },
    );
    els.forEach((e) => observer.observe(e));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className={className}>
      <Field label="Jump to section" className="xl:hidden">
        <Select
          value={active}
          onValueChange={(v) => {
            setActive(v);
            jumpTo(v);
          }}
          options={sections.map((s) => ({ value: s.id, label: s.label }))}
        />
      </Field>

      <nav aria-label="Settings sections" className="sticky top-[calc(var(--nav-h)+1.5rem)] max-xl:hidden">
        <ul className="flex flex-col gap-0.5">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={active === s.id ? "location" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  setActive(s.id);
                  jumpTo(s.id);
                }}
                className={cn(
                  "state-layer relative flex h-control-sm items-center rounded-pill px-3 text-label transition-colors duration-(--dur-fast)",
                  active === s.id ? "bg-accent-soft text-accent-soft-fg" : "text-fg-muted hover:text-fg",
                )}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-4 border-t border-border-subtle pt-4">
          <Link href="/admin/settings/audit" className="state-layer relative flex h-control-sm items-center gap-2 rounded-pill px-3 text-label text-fg-muted hover:text-fg">
            <History aria-hidden className="size-icon-md" />
            Audit log
          </Link>
        </div>
      </nav>
    </div>
  );
}

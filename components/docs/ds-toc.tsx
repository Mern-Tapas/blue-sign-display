"use client";

import { useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";

type TocItem = { id: string; title: string };
type TocSnapshot = { items: TocItem[]; active: string | null };

const EMPTY: TocSnapshot = { items: [], active: null };

/**
 * Scroll-spy store over `[data-toc]` sections inside `root`.
 * Observers update a cached snapshot from their callbacks (no setState-in-effect),
 * and a MutationObserver rescans when the page content changes on client navigation.
 */
function createTocStore(rootSelector: string) {
  let snapshot: TocSnapshot = EMPTY;

  const read = (root: Element): TocItem[] =>
    Array.from(root.querySelectorAll<HTMLElement>("[data-toc]")).map((el) => ({ id: el.id, title: el.dataset.toc ?? el.id }));

  return {
    getSnapshot: () => snapshot,
    subscribe(notify: () => void) {
      const root = document.querySelector(rootSelector);
      if (!root) return () => {};
      const visible = new Map<string, number>();
      let io: IntersectionObserver | null = null;

      const setSnapshot = (next: TocSnapshot) => {
        const same =
          next.active === snapshot.active &&
          next.items.length === snapshot.items.length &&
          next.items.every((it, i) => it.id === snapshot.items[i]?.id && it.title === snapshot.items[i]?.title);
        if (!same) {
          snapshot = next;
          notify();
        }
      };

      const observe = () => {
        io?.disconnect();
        visible.clear();
        const items = read(root);
        io = new IntersectionObserver(
          (entries) => {
            for (const e of entries) {
              if (e.isIntersecting) visible.set(e.target.id, e.boundingClientRect.top);
              else visible.delete(e.target.id);
            }
            // Active = the first section (document order) currently in the reading band.
            const active = items.find((it) => visible.has(it.id))?.id ?? snapshot.active ?? items[0]?.id ?? null;
            setSnapshot({ items, active });
          },
          { rootMargin: "-96px 0px -60% 0px" },
        );
        for (const it of items) {
          const el = document.getElementById(it.id);
          if (el) io.observe(el);
        }
        setSnapshot({ items, active: items[0]?.id ?? null });
      };

      observe();
      const mo = new MutationObserver(() => {
        const key = read(root).map((i) => `${i.id}:${i.title}`).join("|");
        if (key !== snapshot.items.map((i) => `${i.id}:${i.title}`).join("|")) observe();
      });
      mo.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ["id", "data-toc"] });

      return () => {
        io?.disconnect();
        mo.disconnect();
      };
    },
  };
}

export function DsToc({ rootSelector = "#main", className }: { rootSelector?: string; className?: string }) {
  const [store] = useState(() => createTocStore(rootSelector));
  const { items, active } = useSyncExternalStore(store.subscribe, store.getSnapshot, () => EMPTY);

  if (items.length < 2) return null;

  return (
    <nav aria-label="On this page" className={cn("flex flex-col gap-2", className)}>
      <p className="text-overline text-fg-muted">On this page</p>
      <ul className="flex flex-col border-l border-border-subtle">
        {items.map((it) => {
          const isActive = it.id === active;
          return (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "-ml-px flex border-l py-1.5 pl-3.5 text-label font-normal transition-colors duration-(--dur-fast)",
                  isActive ? "border-accent text-fg" : "border-transparent text-fg-muted hover:text-fg",
                )}
              >
                {it.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

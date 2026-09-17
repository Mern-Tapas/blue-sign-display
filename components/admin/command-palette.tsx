"use client";

import { useId, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CornerDownLeft, Search } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/cn";
import { useCommandPaletteOpen } from "./admin-shell";

export type CommandItem = {
  id: string;
  label: string;
  group: string;
  hint?: string;
  icon?: React.ReactNode;
  href?: string;
  onSelect?: () => void;
  keywords?: string[];
};

export type CommandPaletteProps = {
  items: CommandItem[];
  placeholder?: string;
};

function score(item: CommandItem, q: string) {
  if (!q) return 1;
  const hay = [item.label, item.hint, item.group, ...(item.keywords ?? [])].join(" ").toLowerCase();
  const parts = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!parts.every((p) => hay.includes(p))) return 0;
  return item.label.toLowerCase().startsWith(parts[0]!) ? 2 : 1;
}

/**
 * Keyboard-first search across pages, actions and records (combobox + listbox in a dialog).
 * ↑ ↓ move, Enter opens, Esc closes and focus returns to the trigger.
 */
export function CommandPalette({ items, placeholder = "Search pages, orders, products…" }: CommandPaletteProps) {
  const [open, setOpen] = useCommandPaletteOpen();
  const router = useRouter();
  const id = useId();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const results = useMemo(
    () =>
      items
        .map((it) => ({ it, s: score(it, query.trim()) }))
        .filter((x) => x.s > 0)
        .sort((a, b) => b.s - a.s)
        .slice(0, 12)
        .map((x) => x.it),
    [items, query],
  );
  const groups = [...new Set(results.map((r) => r.group))];
  const ordered = groups.flatMap((g) => results.filter((r) => r.group === g));

  const run = (item: CommandItem | undefined) => {
    if (!item) return;
    setOpen(false);
    setQuery("");
    setActive(0);
    if (item.href) router.push(item.href);
    item.onSelect?.();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) {
          setQuery("");
          setActive(0);
        }
      }}
    >
      <DialogContent size="lg" hideClose className="top-[12vh] translate-y-0 overflow-hidden p-0" aria-describedby={undefined}>
        <DialogPrimitive.Title className="sr-only">Search admin</DialogPrimitive.Title>
        <div className="flex items-center gap-3 border-b border-border-subtle px-5">
          <Search aria-hidden className="size-icon-md shrink-0 text-fg-muted" />
          <input
            autoFocus
            role="combobox"
            aria-expanded
            aria-controls={`${id}-list`}
            aria-activedescendant={ordered[active] ? `${id}-${ordered[active]!.id}` : undefined}
            aria-autocomplete="list"
            value={query}
            placeholder={placeholder}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") setActive((a) => Math.min(ordered.length - 1, a + 1));
              else if (e.key === "ArrowUp") setActive((a) => Math.max(0, a - 1));
              else if (e.key === "Enter") run(ordered[active]);
              else return;
              e.preventDefault();
            }}
            className="h-row-lg min-w-0 flex-1 bg-transparent text-body-lg outline-none placeholder:text-fg-placeholder"
          />
          <Kbd size="sm">Esc</Kbd>
        </div>
        <div id={`${id}-list`} role="listbox" aria-label="Results" className="max-h-[min(24rem,60dvh)] overflow-y-auto p-2">
          {ordered.length === 0 ? (
            <p className="px-3 py-8 text-center text-body text-fg-muted">No results for “{query}”. Try an order number, SKU or customer name.</p>
          ) : (
            groups.map((g) => (
              <div key={g} role="group" aria-label={g} className="pb-2">
                <p className="px-3 pt-2 pb-1 text-overline text-fg-muted">{g}</p>
                {results
                  .filter((r) => r.group === g)
                  .map((r) => {
                    const i = ordered.indexOf(r);
                    return (
                      <div
                        key={r.id}
                        id={`${id}-${r.id}`}
                        role="option"
                        aria-selected={i === active}
                        onPointerMove={() => setActive(i)}
                        onClick={() => run(r)}
                        className={cn("flex h-row-md cursor-pointer items-center gap-3 rounded-md px-3 text-body [&_svg]:size-icon-md [&_svg]:text-fg-muted", i === active && "bg-highlight")}
                      >
                        {r.icon}
                        <span className="min-w-0 flex-1 truncate">{r.label}</span>
                        {r.hint && <span className="truncate text-caption text-fg-muted">{r.hint}</span>}
                        {i === active && <CornerDownLeft aria-hidden />}
                      </div>
                    );
                  })}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

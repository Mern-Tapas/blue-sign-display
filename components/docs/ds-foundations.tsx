import { Check, X } from "lucide-react";
import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/cn";
import { tokenValue } from "./token-values";

export type TokenRow = {
  /** CSS custom property name without `--`. */
  token: string;
  /** Tailwind utility that consumes it, e.g. "bg-surface". */
  utility?: string;
  usage: string;
  /** Renders a colour chip; omit for non-colour tokens. */
  swatch?: boolean;
};

function Chip({ value, theme }: { value: string; theme: "light" | "dark" }) {
  return (
    <span data-theme={theme} className="inline-flex items-center gap-2 rounded-md bg-canvas p-1 pr-2">
      <span aria-hidden className="size-6 shrink-0 rounded-sm shadow-flat" style={{ background: value }} />
      <span className="max-w-40 truncate font-mono text-caption text-fg-muted" title={value}>
        {value}
      </span>
    </span>
  );
}

/**
 * Token reference table: name + copy, utility, resolved light / dark values (read from
 * styles/tokens.css at build time) and usage guidance.
 */
export function DsTokenTable({ rows, caption }: { rows: TokenRow[]; caption?: string }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-surface shadow-flat">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[44rem] text-left text-body">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead className="bg-surface-sunken text-overline text-fg-muted">
            <tr>
              <th scope="col" className="px-5 py-2.5">Token</th>
              <th scope="col" className="px-5 py-2.5">Light</th>
              <th scope="col" className="px-5 py-2.5">Dark</th>
              <th scope="col" className="px-5 py-2.5">Use for</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {rows.map((r) => {
              const light = tokenValue(r.token, "light");
              const dark = tokenValue(r.token, "dark");
              return (
                <tr key={r.token} className="align-middle">
                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-1">
                      <code className="font-mono text-caption text-fg">--{r.token}</code>
                      <CopyButton value={r.utility ?? `var(--${r.token})`} label={`Copy ${r.utility ?? `--${r.token}`}`} size="xs" variant="ghost" />
                    </div>
                    {r.utility && <code className="font-mono text-caption text-fg-muted">{r.utility}</code>}
                  </td>
                  <td className="px-5 py-2.5">{r.swatch ? <Chip value={light} theme="light" /> : <code className="font-mono text-caption text-fg-muted">{light}</code>}</td>
                  <td className="px-5 py-2.5">{r.swatch ? <Chip value={dark} theme="dark" /> : <code className="font-mono text-caption text-fg-muted">{dark}</code>}</td>
                  <td className="px-5 py-2.5 text-fg-muted">{r.usage}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Paired guidance: what to do and what to avoid, each with a rendered example. */
export function DsDoDont({
  items,
  className,
}: {
  items: { do: { example: React.ReactNode; text: React.ReactNode }; dont: { example: React.ReactNode; text: React.ReactNode } }[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {items.map((item, i) => (
        <div key={i} className="grid gap-5 md:grid-cols-2">
          {(["do", "dont"] as const).map((kind) => (
            <figure key={kind} className="flex flex-col overflow-hidden rounded-2xl bg-surface shadow-flat">
              <div className="flex min-h-36 flex-1 items-center justify-center bg-canvas p-6">{item[kind].example}</div>
              <figcaption className="flex items-start gap-2.5 border-t border-border-subtle px-5 py-3.5 text-body">
                <span
                  aria-hidden
                  className={cn(
                    "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-pill [&_svg]:size-3",
                    kind === "do" ? "bg-success-soft text-success-fg" : "bg-danger-soft text-danger-fg",
                  )}
                >
                  {kind === "do" ? <Check strokeWidth={3} /> : <X strokeWidth={3} />}
                </span>
                <span>
                  <span className="font-medium">{kind === "do" ? "Do" : "Don’t"}</span>
                  <span className="text-fg-muted"> — {item[kind].text}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      ))}
    </div>
  );
}

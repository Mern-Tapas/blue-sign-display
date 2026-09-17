import { cn } from "@/lib/cn";

export { DsPreview } from "./ds-preview";

/** Deterministic, URL-safe id from a section title ("Sizes & states" → "sizes-states"). */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function DsPageHeader({
  title,
  muted,
  description,
}: {
  /** @deprecated Eyebrows above headings are not part of the system (decisions D-004). Ignored. */
  eyebrow?: string;
  title: string;
  /** Lighter trailing phrase — mirrors "Welcome Back, <muted>Sujon</muted>". */
  muted?: string;
  description?: React.ReactNode;
}) {
  return (
    <header className="mb-10 flex flex-col gap-3 border-b border-border-subtle pb-8">
      <h1 className="text-display-lg">
        {title}
        {muted && <span className="text-fg-muted"> {muted}</span>}
      </h1>
      {description && <p className="max-w-[62ch] text-body-lg text-fg-muted">{description}</p>}
    </header>
  );
}

export function DsSection({
  id,
  title,
  description,
  children,
  className,
}: {
  id?: string;
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const sectionId = id ?? slugify(title);
  return (
    <section id={sectionId} data-toc={title} className={cn("mb-14 scroll-mt-28", className)}>
      <div className="mb-6">
        <h2 className="group/heading flex items-baseline gap-2 text-heading-md">
          {title}
          <a
            href={`#${sectionId}`}
            aria-label={`Link to ${title}`}
            className="rounded-xs text-body text-fg-subtle opacity-0 transition-opacity duration-(--dur-fast) group-hover/heading:opacity-100 hover:text-accent-fg focus-visible:opacity-100"
          >
            #
          </a>
        </h2>
        {description && <p className="mt-1.5 max-w-[62ch] text-body text-fg-muted">{description}</p>}
      </div>
      {children}
    </section>
  );
}

/** Third level inside a DsSection: groups related previews without adding a TOC entry. */
export function DsSubsection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mt-8 first:mt-0", className)}>
      <h3 className="text-title">{title}</h3>
      {description && <p className="mt-1 max-w-[62ch] text-body text-fg-muted">{description}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function DsGrid({ children, cols = 2, className }: { children: React.ReactNode; cols?: 1 | 2 | 3; className?: string }) {
  return (
    <div
      className={cn(
        "grid gap-5",
        cols === 2 && "lg:grid-cols-2",
        cols === 3 && "md:grid-cols-2 xl:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Labelled cells showing one component across its states (default, hover, focus, pressed, disabled…). */
export function DsStates({
  states,
  className,
  surface = "surface",
}: {
  states: { label: string; node: React.ReactNode; note?: string }[];
  className?: string;
  surface?: "surface" | "sunken";
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 overflow-hidden rounded-2xl bg-border-subtle shadow-flat sm:grid-cols-3 lg:grid-cols-4",
        "gap-px",
        className,
      )}
    >
      {states.map((s) => (
        <div
          key={s.label}
          className={cn(
            "flex min-h-32 flex-col justify-between gap-4 p-4",
            surface === "surface" ? "bg-surface" : "bg-surface-sunken",
          )}
        >
          <div className="flex flex-1 items-center justify-center">{s.node}</div>
          <div>
            <p className="text-overline text-fg">{s.label}</p>
            {/* Always reserve the note line so nodes align across cells */}
            <p className="min-h-4 text-caption text-fg-muted">{s.note}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export type DsPropRow = { name: string; type: string; default?: string; description: string };

/** Compact props table for a component. */
export function DsProps({ component, rows }: { component: string; rows: DsPropRow[] }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-surface shadow-flat">
      <div className="flex items-center gap-2 border-b border-border-subtle px-5 py-3">
        <p className="font-mono text-label text-fg">{`<${component}>`}</p>
        <p className="text-caption text-fg-muted">props</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem] text-left text-body">
          <thead className="bg-surface-sunken text-overline text-fg-muted">
            <tr>
              <th scope="col" className="px-5 py-2.5">Prop</th>
              <th scope="col" className="px-5 py-2.5">Type</th>
              <th scope="col" className="px-5 py-2.5">Default</th>
              <th scope="col" className="px-5 py-2.5">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {rows.map((r) => (
              <tr key={r.name} className="align-top">
                <td className="px-5 py-3 font-mono text-caption whitespace-nowrap text-accent-fg">{r.name}</td>
                <td className="max-w-64 px-5 py-3 font-mono text-caption text-fg">{r.type}</td>
                <td className="px-5 py-3 font-mono text-caption whitespace-nowrap text-fg-muted">{r.default ?? "—"}</td>
                <td className="px-5 py-3 text-fg-muted">{r.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

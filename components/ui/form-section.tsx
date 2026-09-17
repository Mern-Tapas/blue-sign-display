import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type FormSectionProps = Omit<React.ComponentProps<"section">, "title"> & {
  /** A string so the heading id can be derived without a hook (this stays server-safe). */
  title: string;
  description?: React.ReactNode;
  /** Right of the heading: a count, a text button, a secondary action. */
  action?: React.ReactNode;
  /**
   * card: heading and fields in one card — long editors, where each section is a step.
   * split: explanation on the left from 1024px, fields in a card on the right — settings,
   * where the prose earns its space and sections stack under hairlines.
   */
  layout?: "card" | "split";
  /** split only: the hairline under each section in a stack. */
  divided?: boolean;
  children: React.ReactNode;
};

const slug = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/**
 * One titled group of fields, exposed as a labelled landmark so a long form stays navigable.
 *
 * Both of the shapes this codebase already used are here: `EditorSection` and
 * `SettingsSection` are now thin wrappers over it, so there is one section component and
 * still two legitimate layouts.
 */
export function FormSection({ title, description, action, layout = "card", divided = true, id, className, children, ...props }: FormSectionProps) {
  const headingId = id ?? `form-section-${slug(title)}`;

  const heading = (
    <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
      <div className="min-w-0">
        <h2 id={headingId} className="text-title">
          {title}
        </h2>
        {description &&
          (layout === "split" ? (
            <p className="text-body text-fg-muted">{description}</p>
          ) : (
            <p className="mt-0.5 text-caption text-fg-muted">{description}</p>
          ))}
      </div>
      {action}
    </div>
  );

  if (layout === "split") {
    return (
      <section
        data-slot="form-section"
        data-layout="split"
        aria-labelledby={headingId}
        className={cn("grid gap-4 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-10", divided && "border-b border-border-subtle pb-8 last:border-0", className)}
        {...props}
      >
        {heading}
        <div className="flex min-w-0 flex-col gap-5 rounded-2xl bg-surface p-(--card-pad) shadow-card">{children}</div>
      </section>
    );
  }

  return (
    <Card asChild padding="md" className={cn("min-w-0 gap-5", className)}>
      <section data-slot="form-section" data-layout="card" aria-labelledby={headingId} {...props}>
        {heading}
        {children}
      </section>
    </Card>
  );
}

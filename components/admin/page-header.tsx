import { Breadcrumbs, type BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { cn } from "@/lib/cn";

export type PageHeaderProps = {
  title: string;
  description?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  /** Primary and secondary page actions (right-aligned, wraps below on phones). */
  actions?: React.ReactNode;
  /** Inline meta under the title: status pill, IDs, timestamps. */
  meta?: React.ReactNode;
  /** Tabs or a filter row that belongs to the page header. */
  children?: React.ReactNode;
  className?: string;
};

/** Admin page heading: breadcrumbs, a heading-lg title, meta, and actions on one line from sm. */
export function PageHeader({ title, description, breadcrumbs, actions, meta, children, className }: PageHeaderProps) {
  return (
    <header data-slot="page-header" className={cn("flex flex-col gap-4", className)}>
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="text-heading-lg">{title}</h1>
          {meta && <div className="meta-list text-caption text-fg-muted">{meta}</div>}
          {description && <p className="max-w-[62ch] text-body text-fg-muted">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {children}
    </header>
  );
}

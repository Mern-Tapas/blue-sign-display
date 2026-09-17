import { cn } from "@/lib/cn";

export type FormRowProps = React.ComponentProps<"div"> & {
  /** Columns from `sm` up; always one column on phones. */
  columns?: 1 | 2 | 3 | 4;
  /** end aligns controls of different heights on their baseline row (field + button). */
  align?: "start" | "end";
};

const columnClass = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

/**
 * Fields side by side. Hook-free and directive-free so a server component can lay out a
 * whole form and hydrate only the controls inside it.
 */
export function FormRow({ columns = 2, align = "start", className, ...props }: FormRowProps) {
  return (
    <div
      data-slot="form-row"
      className={cn("grid grid-cols-1 gap-4", columnClass[columns], align === "end" ? "items-end" : "items-start", className)}
      {...props}
    />
  );
}

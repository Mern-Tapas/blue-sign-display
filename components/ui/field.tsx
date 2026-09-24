"use client";

import { createContext, useContext, useId } from "react";
import { Label as LabelPrimitive } from "radix-ui";
import { cn } from "@/lib/cn";

type FieldContextValue = {
  id: string;
  hintId: string;
  errorId: string;
  invalid: boolean;
  required: boolean;
  hasHint: boolean;
  /** FieldGroup: many controls share this context, so only the invalid state flows down. */
  grouped?: boolean;
};

const FieldContext = createContext<FieldContextValue | null>(null);

/**
 * Wires a form control to its Field label, hint and error message.
 * Controls call this and spread the result onto their focusable element.
 */
export function useFieldControl(props: {
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: React.AriaAttributes["aria-invalid"];
  required?: boolean;
}) {
  const ctx = useContext(FieldContext);
  if (!ctx) {
    return {
      id: props.id,
      "aria-describedby": props["aria-describedby"],
      "aria-invalid": props["aria-invalid"],
      required: props.required,
    };
  }
  if (ctx.grouped) {
    // The fieldset owns the id, the hint and the error. An option only inherits the state
    // it has to paint, and keeps its own id so N options aren't N copies of one id.
    return {
      id: props.id,
      "aria-describedby": props["aria-describedby"],
      "aria-invalid": ctx.invalid || props["aria-invalid"] || undefined,
      required: props.required ?? ctx.required,
    };
  }
  // The hint is replaced by the error, so only reference the id that is actually rendered.
  const describedBy = [props["aria-describedby"], ctx.hasHint && !ctx.invalid && ctx.hintId, ctx.invalid && ctx.errorId]
    .filter(Boolean)
    .join(" ");
  return {
    id: props.id ?? ctx.id,
    "aria-describedby": describedBy || undefined,
    "aria-invalid": ctx.invalid || props["aria-invalid"] || undefined,
    required: props.required ?? ctx.required,
  };
}

export function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "text-label text-fg select-none peer-disabled:cursor-not-allowed peer-disabled:text-disabled-fg",
        className,
      )}
      {...props}
    />
  );
}

/** Characters used against the limit, shown on the label row. */
export type FieldCounter = { value: number; max: number };

export type FieldProps = Omit<React.ComponentProps<"div">, "children"> & {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  /** Error message; when present the control is marked aria-invalid. */
  error?: React.ReactNode;
  required?: boolean;
  /** Right-aligned element on the label row, e.g. a "Forgot?" link. */
  labelAction?: React.ReactNode;
  /** Character count against a limit. Turns danger and announces once over the limit. */
  counter?: FieldCounter;
  /**
   * How the error reaches a screen reader. "alert" (default) announces it as it appears.
   * Set "off" when a FormErrorSummary already announces the whole list on submit, so a
   * failed submit doesn't read out every field at once.
   */
  announce?: "alert" | "off";
  id?: string;
  children: React.ReactNode;
};

export function Field({
  label,
  hint,
  error,
  required = false,
  labelAction,
  counter,
  announce = "alert",
  id,
  className,
  children,
  ...props
}: FieldProps) {
  const autoId = useId();
  const controlId = id ?? `field-${autoId}`;
  const over = counter ? counter.value > counter.max : false;
  const value: FieldContextValue = {
    id: controlId,
    hintId: `${controlId}-hint`,
    errorId: `${controlId}-error`,
    invalid: Boolean(error),
    required,
    hasHint: Boolean(hint),
  };
  return (
    <FieldContext.Provider value={value}>
      {/* min-w-0: a Field is almost always a grid or flex item, and its control may hold one long
          unbreakable string (a selected product title, an email, a file name). Without this the
          item's minimum contribution is that string's width and the whole track blows past the
          viewport; with it, the control's own `truncate` can do its job. */}
      <div data-slot="field" className={cn("flex min-w-0 flex-col gap-2", className)} {...props}>
        {(label || labelAction || counter) && (
          <div className="flex items-center justify-between gap-2">
            {label && (
              <Label htmlFor={controlId}>
                {label}
                {required && (
                  <span aria-hidden className="ml-0.5 text-danger">
                    *
                  </span>
                )}
              </Label>
            )}
            {labelAction}
            {counter && (
              <span
                // Only the over-limit state is worth interrupting for; the running count is noise.
                aria-live={over ? "polite" : "off"}
                className={cn("ml-auto text-caption figures", over ? "text-danger-fg" : "text-fg-muted")}
              >
                {counter.value}/{counter.max}
              </span>
            )}
          </div>
        )}
        {children}
        {hint && !error && (
          <p id={value.hintId} className="text-caption text-fg-muted">
            {hint}
          </p>
        )}
        {error && (
          <p id={value.errorId} role={announce === "alert" ? "alert" : undefined} className="text-caption text-danger-fg">
            {error}
          </p>
        )}
      </div>
    </FieldContext.Provider>
  );
}

export type FieldGroupProps = Omit<React.ComponentProps<"fieldset">, "children"> & {
  /** Group label. Rendered as a <legend>, never as a <label for>. */
  legend: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  counter?: FieldCounter;
  announce?: "alert" | "off";
  children: React.ReactNode;
};

/**
 * A Field for a set of controls rather than one: radios, checkboxes, selectable cards.
 *
 * A single `<label for>` can only point at one control, so grouped choices get a
 * `<fieldset><legend>` instead. Hint and error wiring is identical to `Field` — the ids go
 * on the group via `aria-describedby`, so a screen reader hears the group's error once
 * rather than once per option.
 */
export function FieldGroup({
  legend,
  hint,
  error,
  required = false,
  counter,
  announce = "alert",
  id,
  className,
  children,
  ...props
}: FieldGroupProps) {
  const autoId = useId();
  const groupId = id ?? `field-group-${autoId}`;
  const value: FieldContextValue = {
    id: groupId,
    hintId: `${groupId}-hint`,
    errorId: `${groupId}-error`,
    invalid: Boolean(error),
    required,
    hasHint: Boolean(hint),
    grouped: true,
  };
  const describedBy = [hint && !error && value.hintId, error && value.errorId].filter(Boolean).join(" ") || undefined;
  const over = counter ? counter.value > counter.max : false;

  return (
    <FieldContext.Provider value={value}>
      <fieldset
        data-slot="field-group"
        id={groupId}
        aria-describedby={describedBy}
        aria-invalid={Boolean(error) || undefined}
        aria-required={required || undefined}
        className={cn("relative flex min-w-0 flex-col gap-2", className)}
        {...props}
      >
        {/* The legend only names the fieldset while it is its first child, so the counter
            sits beside it as an overlay rather than sharing a wrapper. */}
        <legend className="text-label text-fg">
          {legend}
          {required && (
            <span aria-hidden className="ml-0.5 text-danger">
              *
            </span>
          )}
        </legend>
        {counter && (
          <span
            aria-live={over ? "polite" : "off"}
            className={cn("absolute top-0 right-0 text-caption figures", over ? "text-danger-fg" : "text-fg-muted")}
          >
            {counter.value}/{counter.max}
          </span>
        )}
        {children}
        {hint && !error && (
          <p id={value.hintId} className="text-caption text-fg-muted">
            {hint}
          </p>
        )}
        {error && (
          <p id={value.errorId} role={announce === "alert" ? "alert" : undefined} className="text-caption text-danger-fg">
            {error}
          </p>
        )}
      </fieldset>
    </FieldContext.Provider>
  );
}

"use client";

import { useCallback, useId, useMemo, useRef, useState } from "react";
import { focusFirstInvalid } from "@/lib/validation";
import { getPath, setPath } from "./paths";
import { toResult, type FieldErrors, type FieldPath, type Validate, type ValidationResult } from "./types";
import { useDraft } from "./use-draft";

export type FormReveal = "submit" | "blur";

export type UseFormOptions<T> = {
  initial: T;
  /** Values in, messages out. May close over outside state — it is read fresh every run. */
  validate?: Validate<T>;
  /**
   * When an error becomes visible. "submit" (default) stays quiet until the first submit,
   * then updates live. "blur" reveals each field as it is left, for long forms where
   * waiting until the end is worse.
   */
  reveal?: FormReveal;
  /** Prefix for generated field ids, so two forms on one page never collide. */
  idPrefix?: string;
  /** Pass when values hold File, Date or class instances (the default compares JSON). */
  isEqual?: (a: T, b: T) => boolean;
  /** Uncontrolled or server-action forms: read the values from the DOM instead of state. */
  readValues?: (form: HTMLFormElement) => T;
  onSubmit?: (values: T, helpers: { commit: () => void; setErrors: (errors: FieldErrors) => void }) => void | Promise<void>;
};

/** Spread the first four onto `<Field>`, `onBlur` onto the control. */
export type FieldBinding = {
  id: string;
  name: string;
  error: string | undefined;
  required: boolean | undefined;
  onBlur: () => void;
};

/** Ids have to survive a path like "variants.2.sku" and stay valid in a selector. */
const fieldId = (prefix: string, path: FieldPath) => `${prefix}-${path.replace(/\./g, "-")}`;

/**
 * The form layer: values, validation, when errors are allowed to show, and what happens on
 * submit. Controls stay controlled/uncontrolled-agnostic — this hands out ids, names and
 * messages, and never renders anything.
 */
export function useForm<T>({ initial, validate, reveal = "submit", idPrefix, isEqual, readValues, onSubmit }: UseFormOptions<T>) {
  const autoId = useId();
  const prefix = idPrefix ?? `form-${autoId.replace(/[^a-zA-Z0-9-]/g, "")}`;
  const formRef = useRef<HTMLFormElement>(null);

  const { draft: values, setDraft: setValues, dirty, commit, discard, reset } = useDraft(initial, { isEqual });
  const [touched, setTouched] = useState<ReadonlySet<FieldPath>>(() => new Set());
  const [edited, setEdited] = useState<ReadonlySet<FieldPath>>(() => new Set());
  const [attempted, setAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitErrors, setSubmitErrors] = useState<FieldErrors>({});

  // `validate` is called straight from props: it is pure by contract, and a validator that
  // closes over outside state (a PIN lookup, a server response) has to be read fresh, not
  // frozen at first render. Callers with an expensive rule memoise the function itself.
  const allErrors = useMemo<FieldErrors>(() => ({ ...(validate?.(values) ?? {}), ...submitErrors }), [validate, values, submitErrors]);

  const result: ValidationResult = useMemo(() => toResult(allErrors), [allErrors]);

  const visible = (path: FieldPath) => (reveal === "blur" ? touched.has(path) || attempted : attempted);

  const errors = useMemo<FieldErrors>(() => {
    const out: FieldErrors = {};
    for (const [path, message] of Object.entries(allErrors)) if (visible(path)) out[path] = message;
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `visible` is derived from these
  }, [allErrors, touched, attempted, reveal]);

  const setField = useCallback(
    (path: FieldPath, value: unknown) => {
      setValues((current) => setPath(current, path, value));
      setEdited((set) => (set.has(path) ? set : new Set(set).add(path)));
      // A field the user just corrected shouldn't keep a stale server message.
      setSubmitErrors((current) => (path in current ? Object.fromEntries(Object.entries(current).filter(([k]) => k !== path)) : current));
    },
    [setValues],
  );

  const touch = useCallback((path: FieldPath) => setTouched((set) => (set.has(path) ? set : new Set(set).add(path))), []);

  const field = useCallback(
    (path: FieldPath, options?: { required?: boolean }): FieldBinding => ({
      id: fieldId(prefix, path),
      name: path,
      error: visible(path) ? allErrors[path] : undefined,
      required: options?.required,
      onBlur: () => touch(path),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `visible` is derived from these
    [prefix, allErrors, touched, attempted, reveal, touch],
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setAttempted(true);

      const submitted = readValues && event.currentTarget ? readValues(event.currentTarget) : values;
      if (readValues) setValues(submitted);

      const found = validate?.(submitted) ?? {};
      if (Object.keys(found).length > 0) {
        const first = Object.keys(found)[0]!;
        // Focus the field the first message belongs to, by id — more reliable than
        // scanning for aria-invalid, which depends on the re-render having landed.
        requestAnimationFrame(() => {
          const target = document.getElementById(fieldId(prefix, first));
          if (target) {
            target.focus();
            target.scrollIntoView({ block: "center", behavior: "smooth" });
          } else {
            focusFirstInvalid(formRef.current, { scroll: true, fallbackSelector: "[data-slot=form-error-summary]" });
          }
        });
        return;
      }

      if (!onSubmit) return;
      setSubmitting(true);
      try {
        await onSubmit(submitted, { commit, setErrors: setSubmitErrors });
      } finally {
        setSubmitting(false);
      }
    },
    [commit, onSubmit, prefix, readValues, setValues, validate, values],
  );

  return {
    values,
    setValues,
    setField,
    getField: <V,>(path: FieldPath) => getPath<V>(values, path),
    field,

    /** Gated by the reveal mode. */
    errors,
    /** Ungated — for a live "2 left to fix" counter. */
    allErrors,
    result,

    touched,
    touch,
    /** Paths that have been edited. Not a deep diff: it records what was set. */
    dirtyFields: edited,
    dirty,
    attempted,
    submitting,

    formProps: {
      id: prefix,
      noValidate: true as const,
      ref: formRef,
      onSubmit: handleSubmit,
    },

    /** Field id for a path, e.g. to link a summary row to its control. */
    fieldId: (path: FieldPath) => fieldId(prefix, path),
    commit,
    discard,
    reset,
    setSubmitErrors,
  };
}

export type UseFormReturn<T> = ReturnType<typeof useForm<T>>;

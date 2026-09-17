import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/cn";

export type PasswordRule = { id: string; label: string; test: (password: string) => boolean };

export const defaultPasswordRules: PasswordRule[] = [
  { id: "length", label: "At least 8 characters", test: (p) => p.length >= 8 },
  { id: "case", label: "Upper and lower case letters", test: (p) => /[a-z]/.test(p) && /[A-Z]/.test(p) },
  { id: "number", label: "A number", test: (p) => /\d/.test(p) },
  { id: "symbol", label: "A symbol (e.g. ! @ #)", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const levels = [
  { label: "Too short", tone: "bg-danger", text: "text-danger-fg" },
  { label: "Weak", tone: "bg-danger", text: "text-danger-fg" },
  { label: "Fair", tone: "bg-warning", text: "text-warning-fg" },
  { label: "Good", tone: "bg-success", text: "text-success-fg" },
  { label: "Strong", tone: "bg-success", text: "text-success-fg" },
] as const;

/** 0 (empty / too short) to 4 (strong). Length gates everything; common patterns cap the score. */
export function scorePassword(password: string, rules: PasswordRule[] = defaultPasswordRules) {
  if (password.length < 8) return 0;
  let score = rules.filter((r) => r.test(password)).length;
  if (password.length >= 12) score += 1;
  if (/^(.)\1+$/.test(password) || /^(password|12345678|qwerty)/i.test(password)) score = 1;
  return Math.max(1, Math.min(4, score - 1));
}

export type PasswordStrengthMeterProps = Omit<React.ComponentProps<"div">, "children"> & {
  password: string;
  rules?: PasswordRule[];
  /** Checklist of rules under the bar. */
  showRules?: boolean;
};

/** Four-segment strength bar with a text label (colour is never the only signal) and an optional rule checklist. */
export function PasswordStrengthMeter({
  password,
  rules = defaultPasswordRules,
  showRules = true,
  className,
  ...props
}: PasswordStrengthMeterProps) {
  const score = scorePassword(password, rules);
  const level = levels[score]!;
  const empty = password.length === 0;

  return (
    <div data-slot="password-strength" className={cn("flex flex-col gap-2.5", className)} {...props}>
      <div className="flex items-center gap-3">
        <div aria-hidden className="grid flex-1 grid-cols-4 gap-1">
          {[1, 2, 3, 4].map((seg) => (
            <span
              key={seg}
              className={cn(
                "h-1 rounded-pill transition-colors duration-(--dur-base) ease-out",
                !empty && (score >= seg || (score === 0 && seg === 1)) ? level.tone : "bg-surface-sunken",
              )}
            />
          ))}
        </div>
        <p aria-live="polite" className={cn("min-w-16 text-right text-caption-strong", empty ? "text-fg-muted" : level.text)}>
          {empty ? "" : <><span className="sr-only">Password strength: </span>{level.label}</>}
        </p>
      </div>
      {showRules && (
        <ul className="grid gap-x-4 gap-y-1.5 sm:grid-cols-2">
          {rules.map((r) => {
            const met = r.test(password);
            return (
              <li key={r.id} className={cn("flex items-center gap-1.5 text-caption", met ? "text-fg" : "text-fg-muted")}>
                {met ? (
                  <Check aria-hidden className="size-icon-sm shrink-0 text-success-fg" strokeWidth={2.5} />
                ) : (
                  <Circle aria-hidden className="size-icon-sm shrink-0 text-fg-muted" />
                )}
                <span>
                  {r.label}
                  <span className="sr-only">{met ? " — met" : " — not met"}</span>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

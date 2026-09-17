import { Field, PasswordInput, PasswordStrengthMeter } from "@bluesigns/ui";

export const WithInput = () => (
  <div className="flex flex-col gap-3" style={{ maxWidth: 360 }}>
    <Field label="Create password" required>
      <PasswordInput autoComplete="new-password" defaultValue="lakeside402" />
    </Field>
    <PasswordStrengthMeter password="lakeside402" />
  </div>
);

export const Levels = () => (
  <div className="flex flex-col gap-5" style={{ maxWidth: 360 }}>
    <PasswordStrengthMeter password="" showRules={false} />
    <PasswordStrengthMeter password="priya" showRules={false} />
    <PasswordStrengthMeter password="priya2026" showRules={false} />
    <PasswordStrengthMeter password="Priya2026" showRules={false} />
    <PasswordStrengthMeter password="Priya@Lakeside2026" showRules={false} />
  </div>
);

export const Strong = () => (
  <div style={{ maxWidth: 360 }}>
    <PasswordStrengthMeter password="Priya@Lakeside2026" />
  </div>
);

import { Field, PasswordInput, TextButton } from "@bluesigns/ui";

export const SignIn = () => (
  <div style={{ maxWidth: 360 }}>
    <Field label="Password" labelAction={<TextButton size="sm">Forgot?</TextButton>}>
      <PasswordInput defaultValue="Bengaluru@2026" />
    </Field>
  </div>
);

export const Visible = () => (
  <div style={{ maxWidth: 360 }}>
    <Field label="Create password" hint="At least 8 characters with a number." required>
      <PasswordInput autoComplete="new-password" defaultValue="Lakeside402" visible />
    </Field>
  </div>
);

export const States = () => (
  <div className="flex flex-col gap-4" style={{ maxWidth: 360 }}>
    <Field label="New password">
      <PasswordInput autoComplete="new-password" placeholder="Create a password" />
    </Field>
    <Field label="Current password" error="That password doesn’t match our records.">
      <PasswordInput defaultValue="wrongpass" />
    </Field>
    <Field label="Password (no icon)">
      <PasswordInput showIcon={false} shape="rounded" defaultValue="secret123" />
    </Field>
    <Field label="Disabled">
      <PasswordInput disabled placeholder="Signed in with Google" />
    </Field>
  </div>
);

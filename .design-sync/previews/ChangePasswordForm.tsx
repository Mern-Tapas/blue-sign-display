import { ChangePasswordForm, Card, toast } from "@bluesigns/ui";

const submit = async ({ current }: { current: string; next: string; signOutOthers: boolean }) => {
  await new Promise((r) => setTimeout(r, 700));
  return current === "BlueSigns@2026"
    ? ({ ok: true } as const)
    : ({ ok: false, field: "current", error: "That’s not your current password" } as const);
};

export const ChangePassword = () => (
  <Card className="gap-5" style={{ maxWidth: 480 }}>
    <h2 className="text-title">Change password</h2>
    <ChangePasswordForm onSubmit={submit} onForgotPassword={() => toast({ title: "Opens password reset" })} />
  </Card>
);

export const SetFirstPassword = () => (
  <Card className="gap-5" style={{ maxWidth: 480 }}>
    <h2 className="text-title">Set a password</h2>
    <p className="text-body text-fg-muted">You sign in with OTP today. Add a password to sign in with email too.</p>
    <ChangePasswordForm hasPassword={false} onSubmit={submit} />
  </Card>
);

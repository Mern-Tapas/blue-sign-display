import { AuthShell, ResetPasswordForm, toast } from "@bluesigns/ui";

const reset = async () => {
  await new Promise((r) => setTimeout(r, 800));
  return { ok: true } as const;
};

export const NewPassword = () => (
  <AuthShell layout="card" headingLevel="h2" title="Create a new password">
    <ResetPasswordForm accountEmail="sujon@bluesigns.shop" onSubmit={reset} onDone={() => toast({ title: "Back to sign in" })} />
  </AuthShell>
);

export const WithoutAccountHint = () => (
  <div style={{ maxWidth: 420 }}>
    <ResetPasswordForm onSubmit={reset} onDone={() => {}} doneLabel="Continue shopping" />
  </div>
);

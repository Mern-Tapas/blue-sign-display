import { useEffect, useRef } from "react";
import { InviteMemberDialog, sampleData, toast } from "@bluesigns/ui";

const { staff } = sampleData;

/** The dialog owns its open state behind its Invite member trigger; this preview presses the trigger once. */
function OpenOnMount({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelector("button")?.click();
  }, []);
  return <div ref={ref}>{children}</div>;
}

const invite = ({ email, role }: { email: string; role: string }) =>
  toast({ title: "Invite sent", description: `${email} can join as ${role} for the next 7 days.`, tone: "success" });

export const Open = () => (
  <OpenOnMount>
    <InviteMemberDialog existingEmails={staff.map((m) => m.email)} onInvite={invite} />
  </OpenOnMount>
);

export const InTableToolbar = () => (
  <div className="flex items-center gap-3 rounded-xl bg-surface p-4 shadow-flat" style={{ width: 560 }}>
    <p className="mr-auto text-caption text-fg-muted">
      {staff.length} members · {staff.filter((m) => !m.twoFactor).length} without 2FA
    </p>
    <InviteMemberDialog existingEmails={staff.map((m) => m.email)} onInvite={invite} />
  </div>
);

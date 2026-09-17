"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "@/components/providers/toast-store";
import { ConfirmDialog } from "@/components/ui/alert-dialog";
import { IconButton } from "@/components/ui/icon-button";
import { Select } from "@/components/ui/select";
import { adminRelative } from "@/lib/admin-format";
import { ADMIN_TODAY, staff as initialStaff, type StaffMember } from "@/lib/data/admin";
import { SettingsSection, StatusPill } from "../admin-display";
import { DataTable, type DataColumn } from "../data-table";
import { InviteMemberDialog } from "./invite-member-dialog";
import { RolePermissionsMatrix } from "./role-permissions-matrix";
import type { Role, SettingsSectionFormProps } from "./settings-data";

type Member = StaffMember & { invited?: boolean };
const assignable: Exclude<Role, "Owner">[] = ["Admin", "Operations", "Catalog", "Support", "Finance"];

/**
 * Team members and what each role can do. Member changes apply immediately (with undo); the
 * permissions matrix is part of the page draft and saves with the rest of the settings.
 */
export function StaffSection({ draft, update }: Pick<SettingsSectionFormProps, "draft" | "update">) {
  const [members, setMembers] = useState<Member[]>(initialStaff);
  const [removing, setRemoving] = useState<Member | null>(null);

  const changeRole = (m: Member, role: Role) => {
    const before = members;
    setMembers((list) => list.map((x) => (x.id === m.id ? { ...x, role } : x)));
    toast({ title: `${m.name} is now ${role}`, description: "They’ll see the new access next time they load a page.", tone: "success", action: { label: "Undo", onClick: () => setMembers(before) } });
  };

  const roleSelect = (m: Member) =>
    m.role === "Owner" ? (
      <span className="text-body text-fg-muted">Owner</span>
    ) : (
      <Select
        size="sm"
        aria-label={`Role for ${m.name}`}
        value={m.role}
        onValueChange={(v) => changeRole(m, v as Role)}
        options={assignable.map((r) => ({ value: r, label: r }))}
        className="w-36"
      />
    );

  const twoFactor = (m: Member) =>
    m.invited ? <StatusPill tone="neutral" label="Invite sent" /> : m.twoFactor ? <StatusPill tone="success" label="2FA on" /> : <StatusPill tone="warning" label="2FA off" />;

  const removeButton = (m: Member) =>
    m.role === "Owner" ? null : (
      <IconButton label={`Remove ${m.name}`} variant="ghost" size="sm" onClick={() => setRemoving(m)}>
        <Trash2 aria-hidden />
      </IconButton>
    );

  const columns: DataColumn<Member>[] = [
    {
      id: "name",
      header: "Member",
      cell: (m) => (
        <span className="flex flex-col">
          <span className="text-body-strong">{m.name}</span>
          <span className="text-caption text-fg-muted">{m.email}</span>
        </span>
      ),
      sortValue: (m) => m.name,
    },
    { id: "role", header: "Role", cell: roleSelect, sortValue: (m) => m.role },
    { id: "2fa", header: "Two-factor", cell: twoFactor, sortValue: (m) => (m.twoFactor ? 1 : 0), hideBelow: "lg" },
    { id: "active", header: "Last active", cell: (m) => (m.lastActive ? adminRelative(m.lastActive, ADMIN_TODAY) : "Not yet"), sortValue: (m) => m.lastActive, hideBelow: "xl" },
    { id: "actions", header: "", cell: removeButton, align: "end" },
  ];

  return (
    <SettingsSection
      title="Staff & roles"
      description="Give each person the least access they need. Everyone signs in with two-factor authentication; Owner access can’t be reduced."
      className="lg:grid-cols-1 lg:gap-4"
    >
      <DataTable
        caption="Staff members"
        columns={columns}
        rows={members}
        getRowId={(m) => m.id}
        pageSize={10}
        className="rounded-lg"
        toolbar={
          <>
            <p className="mr-auto text-caption text-fg-muted">
              {members.length} members · {members.filter((m) => !m.twoFactor && !m.invited).length} without 2FA
            </p>
            <InviteMemberDialog
              existingEmails={members.map((m) => m.email)}
              onInvite={({ email, role }) => {
                setMembers((list) => [...list, { id: `inv-${email}`, name: email.split("@")[0]!, email, role, lastActive: "", twoFactor: false, invited: true }]);
                toast({ title: "Invite sent", description: `${email} can join as ${role} for the next 7 days.`, tone: "success" });
              }}
            />
          </>
        }
        renderCard={(m) => (
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-body-strong">{m.name}</p>
                <p className="truncate text-caption text-fg-muted">{m.email}</p>
              </div>
              {removeButton(m)}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {roleSelect(m)}
              {twoFactor(m)}
            </div>
          </div>
        )}
      />

      <div className="flex flex-col gap-1 border-t border-border-subtle pt-5">
        <h3 className="text-title">Role permissions</h3>
        <p className="text-caption text-fg-muted">Changes apply to everyone with the role when you save.</p>
      </div>
      <RolePermissionsMatrix
        value={draft.permissions}
        onChange={(role, area, access) => update((d) => ({ ...d, permissions: { ...d.permissions, [role]: { ...d.permissions[role], [area]: access } } }))}
      />

      <ConfirmDialog
        open={!!removing}
        onOpenChange={(open) => !open && setRemoving(null)}
        tone="danger"
        icon={<Trash2 aria-hidden />}
        title={removing ? `Remove ${removing.name}?` : "Remove member?"}
        description={removing ? `${removing.email} is signed out everywhere and loses ${removing.role} access right away. Their past actions stay in the audit log.` : undefined}
        confirmLabel="Remove member"
        onConfirm={async () => {
          const target = removing;
          if (!target) return;
          await new Promise((r) => window.setTimeout(r, 600));
          const before = members;
          setMembers((list) => list.filter((x) => x.id !== target.id));
          toast({ title: `${target.name} removed`, tone: "success", action: { label: "Undo", onClick: () => setMembers(before) } });
        }}
      />
    </SettingsSection>
  );
}

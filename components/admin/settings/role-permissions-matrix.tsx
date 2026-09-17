"use client";

import { Eye, EyeOff, Lock, Pencil } from "lucide-react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { permissionAreas } from "@/lib/data/admin";
import { cn } from "@/lib/cn";
import type { Access, PermissionArea, Role } from "./settings-data";

export type RolePermissionsMatrixProps = {
  value: Record<Role, Record<PermissionArea, Access>>;
  onChange: (role: Role, area: PermissionArea, access: Access) => void;
  /** Roles that can't be edited (the Owner always has full access). */
  locked?: Role[];
  className?: string;
};

const accessLabel: Record<Access, string> = { none: "No access", view: "View", edit: "Edit" };

/**
 * Roles × permission areas. Each cell is a three-way segmented choice (no access / view / edit);
 * the header row and area column stay pinned while the grid scrolls inside its own container.
 */
export function RolePermissionsMatrix({ value, onChange, locked = ["Owner"], className }: RolePermissionsMatrixProps) {
  const roles = Object.keys(value) as Role[];

  return (
    <div data-slot="role-permissions-matrix" className={cn("flex min-w-0 flex-col gap-3", className)}>
      <ul aria-label="Legend" className="flex flex-wrap items-center gap-x-4 gap-y-1 text-caption text-fg-muted">
        <li className="flex items-center gap-1.5">
          <EyeOff aria-hidden className="size-icon-sm" /> No access
        </li>
        <li className="flex items-center gap-1.5">
          <Eye aria-hidden className="size-icon-sm" /> View only
        </li>
        <li className="flex items-center gap-1.5">
          <Pencil aria-hidden className="size-icon-sm" /> View and edit
        </li>
      </ul>
      <div className="max-h-[30rem] overflow-auto rounded-lg shadow-flat" tabIndex={0} role="region" aria-label="Role permissions, scrollable">
        <table className="w-full border-separate border-spacing-0 text-left text-body">
          <caption className="sr-only">Permissions for each role</caption>
          <thead>
            <tr>
              <th scope="col" className="sticky top-0 left-0 z-20 h-row-md min-w-40 border-b border-border-subtle bg-surface-sunken px-3 text-overline text-fg-muted">
                Area
              </th>
              {roles.map((role) => (
                <th key={role} scope="col" className="sticky top-0 z-10 h-row-md border-b border-border-subtle bg-surface-sunken px-2 text-center text-overline whitespace-nowrap text-fg-muted">
                  <span className="inline-flex items-center gap-1">
                    {locked.includes(role) && <Lock aria-hidden className="size-3" />}
                    {role}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissionAreas.map((area, ai) => (
              <tr key={area}>
                <th scope="row" className={cn("sticky left-0 z-10 h-row-lg bg-surface px-3 font-normal whitespace-nowrap", ai < permissionAreas.length - 1 && "border-b border-border-subtle")}>
                  {area}
                </th>
                {roles.map((role) => {
                  const isLocked = locked.includes(role);
                  const current = value[role][area];
                  return (
                    <td key={role} className={cn("px-2 text-center", ai < permissionAreas.length - 1 && "border-b border-border-subtle")}>
                      <SegmentedControl
                        aria-label={`${role}: ${area}${isLocked ? " (locked)" : ""}, currently ${accessLabel[current]}`}
                        size="sm"
                        active="neutral"
                        value={current}
                        onValueChange={(v) => onChange(role, area, v as Access)}
                        className="[&_button]:w-8 [&_button]:px-0"
                        options={(["none", "view", "edit"] as const).map((a) => ({
                          value: a,
                          label: null,
                          ariaLabel: accessLabel[a],
                          disabled: isLocked,
                          icon: a === "none" ? <EyeOff aria-hidden className="size-icon-sm!" /> : a === "view" ? <Eye aria-hidden className="size-icon-sm!" /> : <Pencil aria-hidden className="size-icon-sm!" />,
                        }))}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

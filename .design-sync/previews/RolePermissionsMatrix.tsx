import { useState } from "react";
import { RolePermissionsMatrix, sampleData } from "@bluesigns/ui";

const { rolePermissions } = sampleData;
type Matrix = typeof rolePermissions;

export const Default = () => {
  const [value, setValue] = useState<Matrix>(rolePermissions);
  return (
    <div style={{ width: 640 }}>
      <RolePermissionsMatrix
        value={value}
        onChange={(role, area, access) => setValue((v) => ({ ...v, [role]: { ...v[role], [area]: access } }))}
      />
    </div>
  );
};

export const OwnerAndAdminLocked = () => {
  const [value, setValue] = useState<Matrix>(rolePermissions);
  return (
    <div style={{ width: 640 }}>
      <RolePermissionsMatrix
        value={value}
        locked={["Owner", "Admin"]}
        onChange={(role, area, access) => setValue((v) => ({ ...v, [role]: { ...v[role], [area]: access } }))}
      />
    </div>
  );
};

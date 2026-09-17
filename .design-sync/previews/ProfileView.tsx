import { ProfileView } from "@bluesigns/ui";

export const Desktop = () => (
  <div style={{ maxWidth: 820 }}>
    <ProfileView />
  </div>
);

export const WithPageHeading = () => (
  <div className="flex flex-col gap-4" style={{ maxWidth: 820 }}>
    <h1 className="text-heading-lg">Profile</h1>
    <ProfileView />
  </div>
);

import { Avatar, sampleData } from "@bluesigns/ui";

const { avatars } = sampleData;

export const Sizes = () => (
  <div className="flex items-center gap-3">
    <Avatar name="Maria Jones" src={avatars.maria} size="xs" />
    <Avatar name="Maria Jones" src={avatars.maria} size="sm" />
    <Avatar name="Maria Jones" src={avatars.maria} />
    <Avatar name="James Carter" src={avatars.james} size="lg" />
    <Avatar name="Aisha Rahman" src={avatars.aisha} size="xl" />
  </div>
);

export const InitialsFallback = () => (
  <div className="flex items-center gap-3">
    <Avatar name="Sujon Ahmed" size="sm" />
    <Avatar name="Priya Nair" />
    <Avatar name="Rahul Verma" size="lg" />
    <Avatar name="Ananya Iyer" size="xl" />
  </div>
);

export const WithName = () => (
  <div className="flex items-center gap-3">
    <Avatar name="Sofia Chen" src={avatars.sofia} size="lg" />
    <div className="flex flex-col">
      <span className="text-label">Sofia Chen</span>
      <span className="text-caption text-fg-muted">Verified buyer · Bengaluru</span>
    </div>
  </div>
);

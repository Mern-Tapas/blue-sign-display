import { AvatarGroup, sampleData } from "@bluesigns/ui";

const { avatars } = sampleData;

const people = [
  { name: "Maria Jones", src: avatars.maria },
  { name: "James Carter", src: avatars.james },
  { name: "Aisha Rahman", src: avatars.aisha },
  { name: "Leo Martins", src: avatars.leo },
  { name: "Sofia Chen", src: avatars.sofia },
  { name: "Noah Kim", src: avatars.noah },
];

export const Default = () => <AvatarGroup people={people} max={4} />;

export const Sizes = () => (
  <div className="flex flex-col items-start gap-4">
    <AvatarGroup people={people} max={3} size="sm" />
    <AvatarGroup people={people} max={4} size="md" />
    <AvatarGroup people={people} max={5} size="lg" />
  </div>
);

export const WithCaption = () => (
  <div className="flex items-center gap-3">
    <AvatarGroup people={people} max={3} size="sm" />
    <span className="text-caption text-fg-muted">128 shoppers in Bengaluru bought this today</span>
  </div>
);

export const InitialsOnly = () => (
  <AvatarGroup people={[{ name: "Sujon Ahmed" }, { name: "Priya Nair" }, { name: "Rahul Verma" }]} />
);

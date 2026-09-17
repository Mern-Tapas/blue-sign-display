import { Avatar, SegmentBadge, sampleData } from "@bluesigns/ui";

const { adminCustomers } = sampleData;
const oneOfEach = (["vip", "repeat", "new", "at-risk"] as const).map((s) => adminCustomers.find((c) => c.segment === s)!);

export const Segments = () => (
  <div className="flex flex-col gap-3">
    <div className="flex flex-wrap items-center gap-2">
      <SegmentBadge segment="new" />
      <SegmentBadge segment="repeat" />
      <SegmentBadge segment="vip" />
      <SegmentBadge segment="at-risk" />
    </div>
    <div className="flex flex-wrap items-center gap-2">
      <SegmentBadge segment="new" size="md" />
      <SegmentBadge segment="repeat" size="md" />
      <SegmentBadge segment="vip" size="md" />
      <SegmentBadge segment="at-risk" size="md" />
    </div>
  </div>
);

export const InCustomerList = () => (
  <ul className="flex flex-col divide-y divide-border-subtle rounded-2xl bg-surface shadow-flat" style={{ width: 420 }}>
    {oneOfEach.map((c) => (
      <li key={c.id} className="flex items-center gap-3 px-4 py-3">
        <Avatar name={c.name} size="sm" />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-body-strong">{c.name}</span>
          <span className="text-caption text-fg-muted">
            {c.city} · {c.orders} {c.orders === 1 ? "order" : "orders"}
          </span>
        </span>
        <SegmentBadge segment={c.segment} />
      </li>
    ))}
  </ul>
);

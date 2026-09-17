"use client";

import { PromoBanner } from "@/components/commerce/promo-banner";
import { createStore } from "@/lib/create-store";

const dismissed = createStore<string[]>([], {
  storageKey: "ds-announcements-dismissed",
  parse: (raw) => (Array.isArray(raw) ? raw.filter((x): x is string => typeof x === "string") : []),
});

export type AnnouncementStripProps = {
  /** Stable id: dismissing hides this announcement until the id changes. */
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  code?: string;
  className?: string;
};

/** Dismissible announcement above the header. Once closed it stays closed on this device, freeing phone height. */
export function AnnouncementStrip({ id, title, description, code, className }: AnnouncementStripProps) {
  const hidden = dismissed.useStore().includes(id);
  if (hidden) return null;
  return (
    <PromoBanner
      variant="strip"
      title={title}
      description={description}
      code={code}
      className={className}
      onDismiss={() => dismissed.set((ids) => [...ids, id])}
    />
  );
}

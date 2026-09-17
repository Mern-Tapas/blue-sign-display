"use client";

import { createStore } from "@/lib/create-store";

type State = { read: string[]; unread: string[]; deleted: string[]; bannerDismissed: boolean };

const store = createStore<State>(
  { read: [], unread: [], deleted: [], bannerDismissed: false },
  {
    storageKey: "ds-notifications",
    parse: (raw) => {
      const v = raw as Partial<State> | null;
      return { read: v?.read ?? [], unread: v?.unread ?? [], deleted: v?.deleted ?? [], bannerDismissed: Boolean(v?.bannerDismissed) };
    },
  },
);

/** Per-device overrides on top of the server's notification list: read / unread / deleted, and the permission banner. */
export const notificationState = {
  markRead: (ids: string[]) => store.set((s) => ({ ...s, read: [...new Set([...s.read, ...ids])], unread: s.unread.filter((x) => !ids.includes(x)) })),
  markUnread: (id: string) => store.set((s) => ({ ...s, unread: [...new Set([...s.unread, id])], read: s.read.filter((x) => x !== id) })),
  remove: (id: string) => store.set((s) => ({ ...s, deleted: [...new Set([...s.deleted, id])] })),
  restore: (id: string) => store.set((s) => ({ ...s, deleted: s.deleted.filter((x) => x !== id) })),
  dismissBanner: () => store.set((s) => ({ ...s, bannerDismissed: true })),
};

export const useNotificationState = store.useStore;

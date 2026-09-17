"use client";

import { createStore } from "@/lib/create-store";
import type { PincodeInfo } from "@/lib/data/types";

export type DeliveryLocation = Pick<PincodeInfo, "pincode" | "city" | "state"> & {
  /** Set when chosen from a saved address. */
  addressId?: string;
  label?: string;
};

const store = createStore<DeliveryLocation | null>(null, {
  storageKey: "ds-delivery-location",
  parse: (raw) => {
    const v = raw as DeliveryLocation | null;
    return v && typeof v.pincode === "string" && /^\d{6}$/.test(v.pincode) ? v : null;
  },
});

/** The shopper's delivery PIN, shared by the header chip, product delivery checks and checkout. */
export const deliveryLocation = {
  set: (location: DeliveryLocation) => store.set(location),
  clear: () => store.set(null),
  get: store.get,
};

export const useDeliveryLocation = store.useStore;

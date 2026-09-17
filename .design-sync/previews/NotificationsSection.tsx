import { useState } from "react";
import { NotificationsSection, sampleData } from "@bluesigns/ui";

const { rolePermissions } = sampleData;

/** The store settings draft every settings section edits (SettingsScreen owns one for the whole page). */
const settings = {
  profile: { storeName: "BlueSigns", supportEmail: "care@bluesigns.shop", supportPhone: "8041234567", gstin: "29AAECL4821K1Z6", address: "3rd floor, 42 Whitefield Main Road", city: "Bengaluru", state: "Karnataka", pincode: "560066" },
  shipping: { freeThreshold: "499", deliveryFee: "49", express: true, expressFee: "99", pins: "560066, 560001, 400001, 110001" },
  payments: { upi: true, cards: true, netbanking: true, wallets: true, emi: true, cod: true, codLimit: "45000", codFee: "19" },
  taxes: { inclusive: true, hsn: "6109", gstRate: "12" },
  notifications: {
    placed: { email: true, sms: true, whatsapp: true },
    "cod-confirm": { email: false, sms: false, whatsapp: true },
    shipped: { email: true, sms: true, whatsapp: true },
    ofd: { email: false, sms: true, whatsapp: true },
    delivered: { email: true, sms: false, whatsapp: false },
    return: { email: true, sms: false, whatsapp: true },
    refund: { email: true, sms: true, whatsapp: false },
  } as Record<string, { email: boolean; sms: boolean; whatsapp: boolean }>,
  permissions: rolePermissions,
};
type Settings = typeof settings;

export const Default = () => {
  const [draft, setDraft] = useState(settings);
  return (
    <div style={{ width: 620 }}>
      <NotificationsSection draft={draft} update={(fn) => setDraft(fn(draft) as Settings)} error={() => undefined} touch={() => {}} />
    </div>
  );
};

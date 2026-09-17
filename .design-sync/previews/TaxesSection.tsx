import { useState } from "react";
import { sampleData, TaxesSection } from "@bluesigns/ui";

const { rolePermissions } = sampleData;

/** The store settings draft every settings section edits (SettingsScreen owns one for the whole page). */
const settings = {
  profile: { storeName: "BlueSigns", supportEmail: "care@bluesigns.shop", supportPhone: "8041234567", gstin: "29AAECL4821K1Z6", address: "3rd floor, 42 Whitefield Main Road", city: "Bengaluru", state: "Karnataka", pincode: "560066" },
  shipping: { freeThreshold: "499", deliveryFee: "49", express: true, expressFee: "99", pins: "560066, 560001, 400001, 110001" },
  payments: { upi: true, cards: true, netbanking: true, wallets: true, emi: true, cod: true, codLimit: "45000", codFee: "19" },
  taxes: { inclusive: true, hsn: "6109", gstRate: "12" },
  notifications: {},
  permissions: rolePermissions,
};
type Settings = typeof settings;

function Section({ initial = settings, errors = {} }: { initial?: Settings; errors?: Record<string, string> }) {
  const [draft, setDraft] = useState(initial);
  return (
    <div style={{ width: 620 }}>
      <TaxesSection draft={draft} update={(fn) => setDraft(fn(draft) as Settings)} error={(path) => errors[path]} touch={() => {}} />
    </div>
  );
}

export const PricesIncludeGst = () => <Section />;

export const GstAddedAtCheckout = () => <Section initial={{ ...settings, taxes: { inclusive: false, hsn: "8518", gstRate: "18" } }} />;

export const InvalidHsn = () => (
  <Section initial={{ ...settings, taxes: { ...settings.taxes, hsn: "610" } }} errors={{ "taxes.hsn": "HSN codes are 4, 6 or 8 digits." }} />
);

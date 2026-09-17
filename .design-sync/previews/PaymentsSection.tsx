import { useState } from "react";
import { PaymentsSection, sampleData } from "@bluesigns/ui";

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
      <PaymentsSection draft={draft} update={(fn) => setDraft(fn(draft) as Settings)} error={(path) => errors[path]} touch={() => {}} />
    </div>
  );
}

export const Default = () => <Section />;

export const CodOff = () => <Section initial={{ ...settings, payments: { ...settings.payments, cod: false, emi: false, wallets: false } }} />;

export const WithErrors = () => (
  <Section
    initial={{ ...settings, payments: { upi: false, cards: false, netbanking: false, wallets: false, emi: false, cod: true, codLimit: "500", codFee: "19" } }}
    errors={{
      "payments.methods": "Keep at least one prepaid method on, so shoppers can pay online.",
      "payments.codLimit": "Set a daily COD limit of ₹1,000 or more.",
    }}
  />
);

import { ContactSupportView } from "@bluesigns/ui";

const orders = [
  { id: "LM-100482", label: "LM-100482 · 11 Sept 2026" },
  { id: "LM-100377", label: "LM-100377 · 2 Sept 2026" },
];

export const HelpCentre = () => (
  <div style={{ maxWidth: 640 }}>
    <ContactSupportView orders={orders} />
  </div>
);

export const PreselectedOrder = () => (
  <div className="flex flex-col gap-4" style={{ maxWidth: 640 }}>
    <h2 className="text-heading-sm">Get help with LM-100482</h2>
    <ContactSupportView orders={orders} defaultOrderId="LM-100482" />
  </div>
);

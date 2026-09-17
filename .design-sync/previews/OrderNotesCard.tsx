import { OrderNotesCard } from "@bluesigns/ui";

export const WithNote = () => (
  <div style={{ width: 360 }}>
    <OrderNotesCard initialNote="Gift — no invoice in the box. Customer called at 11:40 to confirm the Indiranagar address." />
  </div>
);

export const Empty = () => (
  <div style={{ width: 360 }}>
    <OrderNotesCard />
  </div>
);

import { useState } from "react";
import { DeliverySlotPicker } from "@bluesigns/ui";

type Slot = { date: string; slot: string } | null;

// Dates are computed from today on the client; build the matching yyyy-mm-dd key.
const dayKey = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const NoSlotYet = () => {
  const [slot, setSlot] = useState<Slot>(null);
  return (
    <div style={{ maxWidth: 560 }}>
      <DeliverySlotPicker value={slot} onValueChange={setSlot} startInDays={1} />
    </div>
  );
};

export const EveningSelected = () => {
  const [slot, setSlot] = useState<Slot>({ date: dayKey(2), slot: "evening" });
  return (
    <div style={{ maxWidth: 560 }}>
      <DeliverySlotPicker value={slot} onValueChange={setSlot} startInDays={1} isFull={(date, s) => date === dayKey(2) && s === "morning"} />
    </div>
  );
};

export const FullyBookedSlots = () => {
  const [slot, setSlot] = useState<Slot>(null);
  return (
    <div style={{ maxWidth: 560 }}>
      <DeliverySlotPicker
        value={slot}
        onValueChange={setSlot}
        startInDays={2}
        slots={[
          { id: "morning", label: "Morning", time: "9 AM – 12 PM", full: true },
          { id: "afternoon", label: "Afternoon", time: "12 – 4 PM" },
          { id: "evening", label: "Evening", time: "4 – 9 PM", fee: 29 },
        ]}
      />
    </div>
  );
};

export const PickupTwoSlots = () => {
  const [slot, setSlot] = useState<Slot>({ date: dayKey(1), slot: "morning" });
  return (
    <div style={{ maxWidth: 560 }}>
      <DeliverySlotPicker
        value={slot}
        onValueChange={setSlot}
        startInDays={1}
        days={4}
        slots={[
          { id: "morning", label: "Morning", time: "9 AM – 1 PM" },
          { id: "afternoon", label: "Afternoon", time: "1 – 6 PM" },
        ]}
      />
    </div>
  );
};

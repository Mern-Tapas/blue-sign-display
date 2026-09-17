import { useState } from "react";
import { AddressSelector, sampleData, toast } from "@bluesigns/ui";

const { addresses, lookupPincode } = sampleData;

const portBlair = {
  id: "addr-blair",
  name: "Sujon Ahmed",
  mobile: "9876543210",
  pincode: "744101",
  house: "Quarters 12, Aberdeen Bazaar",
  locality: "Near Clock Tower",
  city: "Port Blair",
  state: "Andaman and Nicobar Islands",
  type: "home" as const,
};

function Selector({ list, initial }: { list: typeof addresses; initial: string | null }) {
  const [items, setItems] = useState(list);
  const [selected, setSelected] = useState<string | null>(initial);
  return (
    <div style={{ maxWidth: 560 }}>
      <AddressSelector
        addresses={items}
        value={selected}
        onValueChange={setSelected}
        lookup={lookupPincode}
        onRemove={(id) => setItems((l) => l.filter((a) => a.id !== id))}
        onSave={(v, id) => {
          const nextId = id ?? `addr-${items.length + 1}`;
          setItems((l) => (id ? l.map((a) => (a.id === id ? { ...v, id } : a)) : [...l, { ...v, id: nextId }]));
          setSelected(nextId);
          toast({ title: id ? "Address updated" : "Address added", tone: "success" });
        }}
      />
    </div>
  );
}

export const WithUnserviceable = () => <Selector list={[...addresses, portBlair]} initial="addr-home" />;

export const WorkSelected = () => <Selector list={addresses} initial="addr-work" />;

export const NothingSelected = () => <Selector list={addresses} initial={null} />;

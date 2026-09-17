import { useState } from "react";
import { AddressBook, sampleData } from "@bluesigns/ui";

const { addresses, lookupPincode } = sampleData;

function Demo({ initial, max }: { initial: typeof addresses; max?: number }) {
  const [list, setList] = useState(initial);
  return <AddressBook addresses={list} lookup={lookupPincode} onChange={setList} max={max} />;
}

export const SavedAddresses = () => (
  <div style={{ maxWidth: 820 }}>
    <Demo initial={addresses} />
  </div>
);

export const SingleAddress = () => (
  <div style={{ maxWidth: 820 }}>
    <Demo initial={addresses.slice(0, 1)} />
  </div>
);

export const Empty = () => (
  <div style={{ maxWidth: 820 }}>
    <Demo initial={[]} />
  </div>
);

export const LimitReached = () => (
  <div style={{ maxWidth: 820 }}>
    <Demo initial={addresses} max={addresses.length} />
  </div>
);

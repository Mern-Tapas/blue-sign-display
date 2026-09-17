import { DeliverToPincode, deliveryLocation, sampleData } from "@bluesigns/ui";

const { addresses, lookupPincode } = sampleData;
const wait = (ms = 600) => new Promise((r) => setTimeout(r, ms));
const lookup = async (pin: string) => {
  await wait();
  return lookupPincode(pin);
};

// The chosen location is stored per device; seed it so the chip shows a delivery city.
deliveryLocation.set({ pincode: "560066", city: "Bengaluru", state: "Karnataka", addressId: addresses[0]!.id, label: "Home" });

export const HeaderChip = () => (
  <DeliverToPincode
    lookup={lookup}
    addresses={addresses}
    onDetectLocation={async () => {
      await wait(900);
      return "560001";
    }}
  />
);

export const MobileBar = () => (
  <div style={{ maxWidth: 390 }}>
    <DeliverToPincode appearance="bar" lookup={lookupPincode} addresses={addresses} />
  </div>
);

export const UnderMobileHeader = () => (
  <div className="overflow-hidden rounded-2xl border border-border bg-surface" style={{ maxWidth: 390 }}>
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-title">BlueSigns</span>
      <span className="text-caption text-fg-muted">Free delivery over ₹499</span>
    </div>
    <DeliverToPincode appearance="bar" lookup={lookupPincode} />
  </div>
);

import { SavedAddressCard, sampleData, toast } from "@bluesigns/ui";

const { addresses, lookupPincode } = sampleData;

// Standalone (address book) mode. `selectable` cards only work inside AddressSelector's radio group.
export const DefaultHome = () => (
  <div style={{ maxWidth: 480 }}>
    <SavedAddressCard
      address={addresses[0]!}
      pin={lookupPincode(addresses[0]!.pincode)}
      onEdit={() => toast({ title: "Edit address" })}
      onRemove={() => toast({ title: "Address removed" })}
    />
  </div>
);

export const Work = () => (
  <div style={{ maxWidth: 480 }}>
    <SavedAddressCard address={addresses[1]!} pin={lookupPincode(addresses[1]!.pincode)} onEdit={() => {}} />
  </div>
);

export const NoCashOnDelivery = () => (
  <div style={{ maxWidth: 480 }}>
    <SavedAddressCard
      address={{ id: "addr-chennai", name: "Priya Raman", mobile: "9840012345", pincode: "600001", house: "12, Armenian Street", locality: "George Town", city: "Chennai", state: "Tamil Nadu", type: "home" }}
      pin={lookupPincode("600001")}
      onEdit={() => {}}
      onRemove={() => {}}
    />
  </div>
);

export const NotServiceable = () => (
  <div style={{ maxWidth: 480 }}>
    <SavedAddressCard
      address={{ id: "addr-blair", name: "Sujon Ahmed", mobile: "9876543210", pincode: "744101", house: "Quarters 12, Aberdeen Bazaar", locality: "Near Clock Tower", city: "Port Blair", state: "Andaman and Nicobar Islands", type: "home" }}
      pin={lookupPincode("744101")}
      onRemove={() => {}}
    />
  </div>
);

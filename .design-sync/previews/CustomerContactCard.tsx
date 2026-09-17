import { CustomerContactCard, sampleData } from "@bluesigns/ui";

const { adminCustomers } = sampleData;
const optedIn = adminCustomers.find((c) => c.marketingOptIn)!;
const optedOut = adminCustomers.find((c) => !c.marketingOptIn)!;

export const OptedIn = () => (
  <div style={{ width: 380 }}>
    <CustomerContactCard customer={optedIn} />
  </div>
);

export const OrderUpdatesOnly = () => (
  <div style={{ width: 380 }}>
    <CustomerContactCard customer={optedOut} />
  </div>
);

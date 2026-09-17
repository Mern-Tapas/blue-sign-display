import { SendCouponDialog, sampleData } from "@bluesigns/ui";

const { adminCustomers } = sampleData;

export const BulkSend = () => (
  <SendCouponDialog open onOpenChange={() => {}} customers={adminCustomers.slice(0, 6)} />
);

export const SingleCustomer = () => (
  <SendCouponDialog open onOpenChange={() => {}} customers={[adminCustomers.find((c) => c.marketingOptIn)!]} />
);

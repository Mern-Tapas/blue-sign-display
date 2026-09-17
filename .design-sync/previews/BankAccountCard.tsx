import { BankAccountCard } from "@bluesigns/ui";

const hdfc = { holder: "BlueSigns Retail Pvt Ltd", bank: "HDFC Bank", last4: "7781", ifsc: "HDFC0001234" };

export const Verified = () => (
  <div style={{ width: 420 }}>
    <BankAccountCard account={hdfc} verified onChange={() => {}} />
  </div>
);

export const VerificationPending = () => (
  <div style={{ width: 420 }}>
    <BankAccountCard account={{ holder: "BlueSigns Retail Pvt Ltd", bank: "ICICI Bank", last4: "0452", ifsc: "ICIC0000104" }} verified={false} onChange={() => {}} />
  </div>
);

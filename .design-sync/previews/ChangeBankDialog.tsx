import { ChangeBankDialog } from "@bluesigns/ui";

const current = { holder: "BlueSigns Retail Pvt Ltd", bank: "HDFC Bank", last4: "7781", ifsc: "HDFC0001234" };

export const ChangeAccount = () => <ChangeBankDialog open onOpenChange={() => {}} current={current} onSave={() => {}} />;

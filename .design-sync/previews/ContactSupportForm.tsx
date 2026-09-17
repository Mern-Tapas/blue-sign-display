import { ContactSupportForm, sampleData } from "@bluesigns/ui";

const { supportIssueTypes } = sampleData;
const orders = [
  { id: "LM-100482", label: "LM-100482 · 11 Sept 2026" },
  { id: "LM-100377", label: "LM-100377 · 2 Sept 2026" },
];
const submit = async () => {
  await new Promise((r) => setTimeout(r, 900));
  return "TKT-4821907";
};

export const ContactUs = () => (
  <div style={{ maxWidth: 640 }}>
    <ContactSupportForm orders={orders} issueTypes={supportIssueTypes} onSubmit={submit} />
  </div>
);

export const FromOrderPage = () => (
  <div style={{ maxWidth: 640 }}>
    <ContactSupportForm orders={orders} issueTypes={supportIssueTypes} defaultOrderId="LM-100482" onSubmit={submit} />
  </div>
);
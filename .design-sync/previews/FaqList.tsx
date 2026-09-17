import { AskUsButton, FaqList, sampleData } from "@bluesigns/ui";

const { faqs, faqCategories } = sampleData;

export const AllTopics = () => (
  <div style={{ maxWidth: 760 }}>
    <FaqList faqs={faqs} categories={faqCategories} noResultsAction={<AskUsButton />} />
  </div>
);

export const ReturnsTopic = () => (
  <div style={{ maxWidth: 760 }}>
    <FaqList faqs={faqs} categories={faqCategories} defaultCategory="returns" noResultsAction={<AskUsButton />} />
  </div>
);

export const PaymentsTopic = () => (
  <div style={{ maxWidth: 760 }}>
    <FaqList faqs={faqs} categories={faqCategories} defaultCategory="payments" />
  </div>
);

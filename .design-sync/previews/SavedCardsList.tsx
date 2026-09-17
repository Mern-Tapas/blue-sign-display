import { SavedCardsList, sampleData, toast } from "@bluesigns/ui";

const { savedCards } = sampleData;

const onPay = async ({ cardId }: { cardId: string }) => {
  toast({ title: "Redirecting to your bank", description: cardId, tone: "info" });
};

export const TwoSavedCards = () => (
  <div style={{ maxWidth: 520 }}>
    <SavedCardsList cards={savedCards} amount={12999} thisMonth="2026-09" onPay={onPay} onUseNewCard={() => toast({ title: "Use a new card" })} />
  </div>
);

export const ExpiringSoon = () => (
  <div style={{ maxWidth: 520 }}>
    <SavedCardsList cards={[savedCards[1]!, savedCards[0]!]} amount={4499} thisMonth="2027-12" onPay={onPay} />
  </div>
);

export const WithAmexAndMastercard = () => (
  <div style={{ maxWidth: 520 }}>
    <SavedCardsList
      cards={[
        { id: "card-amex", brand: "amex", last4: "1005", expiry: "11/28", bank: "American Express", nickname: "Travel" },
        { id: "card-mc", brand: "mastercard", last4: "5521", expiry: "04/30", bank: "ICICI Bank" },
        ...savedCards,
      ]}
      amount={21596}
      thisMonth="2026-09"
      onPay={onPay}
      onUseNewCard={() => {}}
    />
  </div>
);

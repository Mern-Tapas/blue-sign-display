import { GiftCardsWallet, sampleData } from "@bluesigns/ui";

const { giftCards } = sampleData;
const add = async (number: string) => {
  await new Promise((r) => setTimeout(r, 900));
  if (number.endsWith("0000")) throw new Error("This gift card isn’t valid or has already been added");
  return { id: `g-${number.slice(-4)}`, last4: number.slice(-4), balance: 750, original: 750, expiresOn: "2027-09-30" };
};

export const TwoCards = () => (
  <div style={{ maxWidth: 820 }}>
    <GiftCardsWallet cards={giftCards} today="2026-08-01" onAdd={add} />
  </div>
);

export const ExpiringSoon = () => (
  <div style={{ maxWidth: 820 }}>
    <GiftCardsWallet cards={giftCards} today="2026-09-16" onAdd={add} />
  </div>
);

export const SingleFestiveCard = () => (
  <div style={{ maxWidth: 820 }}>
    <GiftCardsWallet
      cards={[{ id: "g9", last4: "5521", balance: 4200, original: 5000, expiresOn: "2027-11-01", from: "Rohan & Meera" }]}
      today="2026-09-16"
      onAdd={add}
    />
  </div>
);

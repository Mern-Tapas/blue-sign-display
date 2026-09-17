import { useState } from "react";
import { ModerationReviewCard, sampleData } from "@bluesigns/ui";

const product = (id: string) => sampleData.adminProducts.find((p) => p.id === id) ?? sampleData.adminProducts[0]!;

const flagged = {
  id: "rx5",
  productId: "p6",
  productName: product("p6").name,
  productImage: product("p6").image,
  author: "Farhan Ahmed",
  rating: 1,
  title: "Sole came off in a month",
  body: "Very disappointed with the build. Call me on 98450 12345 and I will share the photos.",
  date: "2026-09-14",
  verified: true,
  media: 3,
  demo: true,
  status: "pending" as const,
  flag: "Contains a phone number",
};

const published = {
  id: "rx2",
  productId: "p3",
  productName: product("p3").name,
  productImage: product("p3").image,
  author: "Karan Joshi",
  rating: 5,
  title: "Looks far more expensive than it is",
  body: "Bought it for my father’s 60th. The dial is crisp and the leather strap softened within a week.",
  date: "2026-09-06",
  verified: true,
  media: 2,
  demo: true,
  status: "published" as const,
  reply: "Thank you, Karan! Wishing your father many happy returns.",
};

const hidden = {
  id: "rx7",
  productId: "p8",
  productName: product("p8").name,
  productImage: product("p8").image,
  author: "Yash Gupta",
  rating: 1,
  title: "Delivery partner was rude",
  body: "The delivery person refused to come to the third floor and shouted at my mother.",
  date: "2026-09-09",
  verified: false,
  media: 0,
  demo: true,
  status: "hidden" as const,
  hiddenReason: "About delivery, not the product",
};

type Review = typeof flagged | typeof published | typeof hidden;

const Card = ({ review, initiallySelected = false }: { review: Review; initiallySelected?: boolean }) => {
  const [selected, setSelected] = useState(initiallySelected);
  return (
    <div className="rounded-2xl bg-surface shadow-flat" style={{ width: 760 }}>
      <ModerationReviewCard review={review} selected={selected} onSelectedChange={setSelected} onPublish={() => {}} onHide={() => {}} onReply={() => {}} />
    </div>
  );
};

export const FlaggedPending = () => <Card review={flagged} />;

export const PublishedWithReply = () => <Card review={published} />;

export const Hidden = () => <Card review={hidden} />;

export const Selected = () => <Card review={flagged} initiallySelected />;

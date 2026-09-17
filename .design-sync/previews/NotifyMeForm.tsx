import { useEffect, useRef } from "react";
import { NotifyMeForm } from "@bluesigns/ui";

const wait = () => new Promise<void>((r) => setTimeout(r, 700));

export const SizeSoldOut = () => (
  <div style={{ maxWidth: 480 }}>
    <NotifyMeForm productName="Fleece Hoodie" variantLabel="Size S" defaultContact="sujon@bluesigns.shop" onSubmit={wait} />
  </div>
);

export const ProductSoldOut = () => (
  <div style={{ maxWidth: 480 }}>
    <NotifyMeForm productName="Trail Hiker" onSubmit={wait} />
  </div>
);

// After a successful submit the form is replaced by a confirmation naming the contact.
function Submitted() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelector<HTMLButtonElement>("button[type=submit]")?.click();
  }, []);
  return (
    <div ref={ref} style={{ maxWidth: 480 }}>
      <NotifyMeForm productName="Fleece Hoodie" variantLabel="Size S" defaultContact="9876543210" onSubmit={async () => {}} />
    </div>
  );
}

export const Confirmed = () => <Submitted />;

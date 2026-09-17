import { useState } from "react";
import { LoginPromptSheet, toast } from "@bluesigns/ui";

const social = async () => {
  await new Promise((r) => setTimeout(r, 900));
};

function Open({ reason, withEmail = true, withSocial = true }: { reason: "wishlist" | "checkout" | "review" | "orders" | "generic"; withEmail?: boolean; withSocial?: boolean }) {
  const [open, setOpen] = useState(true);
  return (
    <LoginPromptSheet
      open={open}
      onOpenChange={setOpen}
      reason={reason}
      onContinueWithMobile={() => toast({ title: "Opens mobile OTP sign-in" })}
      onContinueWithEmail={withEmail ? () => toast({ title: "Opens email sign-in" }) : undefined}
      onSocial={withSocial ? social : undefined}
    />
  );
}

export const Wishlist = () => <Open reason="wishlist" />;

export const Checkout = () => <Open reason="checkout" />;

export const Review = () => <Open reason="review" withSocial={false} />;

export const MobileOnly = () => <Open reason="orders" withEmail={false} withSocial={false} />;

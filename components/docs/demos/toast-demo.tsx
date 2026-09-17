"use client";

import { toast } from "@/components/providers/toast-store";
import { DsPreview } from "@/components/docs/ds-section";
import { Button } from "@/components/ui/button";
import { unsplash } from "@/lib/data/images";

export function ToastDemo() {
  return (
    <DsPreview label="Toasts" code={`toast({ title: "Added to cart", tone: "success" })`}>
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            title: "Added to cart",
            description: "Aura Wireless Headphones · Violet",
            image: unsplash("1505740420928-5e560c06d30e", 120),
            action: { label: "View cart", onClick: () => {} },
          })
        }
      >
        Product toast
      </Button>
      <Button variant="secondary" onClick={() => toast({ title: "Saved to wishlist", tone: "accent" })}>
        Accent
      </Button>
      <Button variant="secondary" onClick={() => toast({ title: "Address updated", description: "We’ll deliver to Flat 402, Prestige Lakeside.", tone: "success" })}>
        Success
      </Button>
      <Button variant="secondary" onClick={() => toast({ title: "Couldn’t apply code", description: "SUMMER10 expired on Aug 31.", tone: "danger" })}>
        Danger
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast({ title: "Item removed", tone: "info", action: { label: "Undo", onClick: () => toast({ title: "Restored", tone: "success" }) } })}
      >
        With undo
      </Button>
    </DsPreview>
  );
}

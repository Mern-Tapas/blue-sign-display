import { useEffect } from "react";
import type { ReactNode } from "react";
import { Button, dismissToast, icons, sampleData, toast } from "@bluesigns/ui";

const { Trash2 } = icons;

// The Toaster is mounted once in the app Providers; call toast() from anywhere.
// Each story seeds its own toasts on mount (duration Infinity keeps them on screen).
type SeedToast = Parameters<typeof toast>[0];

function ToastScene({ seed, children }: { seed: SeedToast[]; children: ReactNode }) {
  useEffect(() => {
    const ids = seed.map((t) => toast({ ...t, duration: Infinity }));
    return () => ids.forEach((id) => dismissToast(id));
  }, [seed]);
  // The toast viewport pins to the bottom-right of the page; minHeight gives the stack room here.
  return (
    <div className="flex flex-wrap items-start gap-3" style={{ minHeight: 440 }}>
      {children}
    </div>
  );
}

const productToast: SeedToast[] = [
  {
    title: "Added to bag",
    description: "Aura Wireless Headphones · Violet",
    image: sampleData.unsplash("1505740420928-5e560c06d30e", 120),
    action: { label: "View bag", onClick: () => {} },
  },
];

const toneToasts: SeedToast[] = [
  { title: "Saved to wishlist", tone: "accent" },
  { title: "Address updated", description: "We’ll deliver to Flat 402, Prestige Lakeside.", tone: "success" },
  { title: "Price drop alert on", description: "We’ll notify you on WhatsApp.", tone: "info" },
  { title: "Couldn’t apply code", description: "SUMMER10 expired on 31 Aug.", tone: "danger" },
];

const undoToast: SeedToast[] = [
  { title: "Item removed", description: "Studio Over-Ear moved out of your bag.", tone: "info", action: { label: "Undo", onClick: () => {} } },
];

export const ProductToast = () => (
  <ToastScene seed={productToast}>
    <Button variant="secondary" onClick={() => toast(productToast[0]!)}>
      Add to bag
    </Button>
  </ToastScene>
);

export const Tones = () => (
  <ToastScene seed={toneToasts}>
    <Button variant="secondary" onClick={() => toast({ title: "Saved to wishlist", tone: "accent" })}>
      Accent
    </Button>
    <Button variant="secondary" onClick={() => toast({ title: "Couldn’t apply code", tone: "danger" })}>
      Danger
    </Button>
  </ToastScene>
);

export const WithUndo = () => (
  <ToastScene seed={undoToast}>
    <Button variant="secondary" leadingIcon={<Trash2 aria-hidden />} onClick={() => toast(undoToast[0]!)}>
      Remove item
    </Button>
  </ToastScene>
);

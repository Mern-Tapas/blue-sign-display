"use client";

import { Tooltip } from "radix-ui";
import { CartDrawer } from "@/components/commerce/cart-drawer";
import { Toaster } from "@/components/ui/toaster";

/** App-wide client providers + global overlays (cart drawer, toasts). */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Tooltip.Provider delayDuration={300}>
      {children}
      <CartDrawer />
      <Toaster />
    </Tooltip.Provider>
  );
}

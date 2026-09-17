"use client";

import { useState } from "react";
import { DsPreview } from "@/components/docs/ds-section";
import { recentlyViewed } from "@/components/providers/recently-viewed-store";
import { RecentlyViewedRail } from "@/components/merch/recently-viewed-rail";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/data/products";

export function RecentlyViewedDemo() {
  const [seeded, setSeeded] = useState(false);
  return (
    <DsPreview label="RecentlyViewedRail" className="flex-col items-stretch">
      <RecentlyViewedRail products={products} />
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            ["no-5-eau-de-parfum", "fleece-hoodie", "pulse-smart-watch", "nomad-backpack", "court-low-sneaker", "thermal-bottle"].forEach((s) => recentlyViewed.add(s));
            setSeeded(true);
          }}
        >
          {seeded ? "Added sample views" : "Add sample views"}
        </Button>
        <p className="text-caption text-fg-muted">Opening any product page adds it here. Stored on this device; hidden when empty.</p>
      </div>
    </DsPreview>
  );
}

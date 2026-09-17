"use client";

import { useState } from "react";
import { BadgeCheck, PackageX, Star, Trash2 } from "lucide-react";
import { DsGrid, DsPreview } from "@/components/docs/ds-section";
import { toast } from "@/components/providers/toast-store";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/alert-dialog";
import { Field } from "@/components/ui/field";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select } from "@/components/ui/select";
import { TextLink } from "@/components/ui/text-link";
import { INDIAN_STATES, sellers } from "@/lib/data/india";

export function AlertDialogDemo() {
  const [reason, setReason] = useState<string>("");
  return (
    <DsPreview
      label="AlertDialog · ConfirmDialog"
      code={`<ConfirmDialog tone="danger" title="Remove item?" confirmLabel="Remove" onConfirm={remove} trigger={<Button>…</Button>} />`}
    >
      <ConfirmDialog
        trigger={
          <Button variant="secondary" leadingIcon={<Trash2 aria-hidden />}>
            Remove from bag
          </Button>
        }
        tone="danger"
        icon={<Trash2 />}
        title="Remove this item?"
        description="Aura Wireless Headphones will be removed from your bag. You can move it to your wishlist instead."
        confirmLabel="Remove"
        cancelLabel="Keep it"
        onConfirm={() => {
          toast({ title: "Removed from bag", tone: "info" });
        }}
      />
      <ConfirmDialog
        trigger={<Button variant="ghost">Cancel order</Button>}
        tone="danger"
        icon={<PackageX />}
        title="Cancel order LM-100251?"
        description="The refund of ₹3,499 goes back to the original payment method within 5–7 days. Cash on delivery orders have nothing to refund."
        confirmLabel="Cancel order"
        cancelLabel="Don’t cancel"
        confirmDisabled={!reason}
        onOpenChange={(open) => !open && setReason("")}
        body={
          <Field label="Reason for cancellation" required>
            <Select
              value={reason}
              onValueChange={setReason}
              placeholder="Select a reason"
              options={[
                { value: "late", label: "Delivery is taking too long" },
                { value: "price", label: "Found a better price" },
                { value: "mistake", label: "Ordered by mistake" },
                { value: "other", label: "Other" },
              ]}
            />
          </Field>
        }
        onConfirm={async () => {
          await new Promise((r) => setTimeout(r, 900));
          toast({ title: "Order cancelled", description: "Refund initiated · LM-100251", tone: "success" });
        }}
      />
    </DsPreview>
  );
}

export function HoverCardDemo() {
  const seller = sellers.default;
  return (
    <DsPreview label="HoverCard" overflowVisible>
      <p className="text-body text-fg-muted">
        Sold by{" "}
        <HoverCard>
          <HoverCardTrigger asChild>
            <TextLink href="/design-system/overlays">{seller.name}</TextLink>
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="flex items-start gap-3">
              <Avatar name={seller.name} size="md" />
              <div className="flex min-w-0 flex-col gap-1">
                <p className="flex items-center gap-1.5 text-title">
                  {seller.name}
                  <BadgeCheck aria-hidden className="size-icon-md text-accent-fg" />
                </p>
                <p className="flex items-center gap-1 text-caption text-fg-muted figures">
                  <Star aria-hidden className="size-icon-sm fill-rating text-rating" />
                  {seller.rating} seller rating · since {seller.since}
                </p>
                <Badge tone="accent" size="sm" className="mt-1 w-fit">
                  Demo data
                </Badge>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
        . Hover or focus the link; on touch it simply navigates.
      </p>
    </DsPreview>
  );
}

export function ScrollAreaDemo() {
  return (
    <DsGrid>
      <DsPreview label="ScrollArea · vertical" className="block">
        <ScrollArea aria-label="States and union territories" className="h-56 rounded-lg bg-surface-sunken shadow-flat" fade>
          <ul className="flex flex-col p-2">
            {INDIAN_STATES.map((s) => (
              <li key={s} className="rounded-md px-3 py-2 text-body">
                {s}
              </li>
            ))}
          </ul>
        </ScrollArea>
      </DsPreview>
      <DsPreview label="ScrollArea · horizontal" className="block">
        <ScrollArea orientation="horizontal" aria-label="Sizes" className="w-full rounded-xl">
          <div className="flex w-max gap-2 pb-3">
            {["UK 5", "UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11", "UK 12", "UK 13"].map((s) => (
              <span key={s} className="flex h-control-md items-center rounded-pill border border-border px-4 text-body figures">
                {s}
              </span>
            ))}
          </div>
        </ScrollArea>
      </DsPreview>
    </DsGrid>
  );
}

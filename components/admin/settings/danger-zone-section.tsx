"use client";

import { useState } from "react";
import { PauseCircle, PlayCircle } from "lucide-react";
import { toast } from "@/components/providers/toast-store";
import { ConfirmDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { adminDateTime } from "@/lib/admin-format";
import { ADMIN_TODAY, pendingWork } from "@/lib/data/admin";

const pausedAt = new Date(ADMIN_TODAY.getFullYear(), ADMIN_TODAY.getMonth(), ADMIN_TODAY.getDate(), 11, 30).toISOString();

/** Store-wide switches with real consequences for shoppers. Pausing always goes through a confirmation. */
export function DangerZoneSection() {
  const [paused, setPaused] = useState(false);

  return (
    <section aria-labelledby="danger-zone-title" className="grid gap-4 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-10">
      <div className="flex flex-col gap-1">
        <h2 id="danger-zone-title" className="text-title">
          Danger zone
        </h2>
        <p className="text-body text-fg-muted">Actions that change what every shopper sees.</p>
      </div>
      <Card variant="danger" padding="md" className="self-start sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-body-strong">{paused ? "Store is paused" : "Pause store"}</p>
          <p className="text-body text-fg-muted">
            {paused
              ? `Paused ${adminDateTime(pausedAt)}. Shoppers see “We’ll be back soon” and can’t check out.`
              : "Temporarily close checkout, for stock-taking or a holiday. Your catalog stays visible and open orders still need shipping."}
          </p>
        </div>
        {paused ? (
          <Button
            variant="secondary"
            leadingIcon={<PlayCircle aria-hidden />}
            onClick={() => {
              setPaused(false);
              toast({ title: "Store is live again", description: "Checkout is open to shoppers.", tone: "success" });
            }}
          >
            Resume store
          </Button>
        ) : (
          <ConfirmDialog
            tone="danger"
            icon={<PauseCircle aria-hidden />}
            title="Pause the store?"
            description={`Checkout closes immediately for every shopper, and ads keep spending unless you pause them too. The ${pendingWork.toPack + pendingWork.toShip} orders waiting to ship are not cancelled, and scheduled coupons like FESTIVE15 stay scheduled.`}
            confirmLabel="Pause store"
            trigger={
              <Button variant="danger" leadingIcon={<PauseCircle aria-hidden />}>
                Pause store
              </Button>
            }
            onConfirm={async () => {
              await new Promise((r) => window.setTimeout(r, 700));
              setPaused(true);
              toast({ title: "Store paused", description: "Checkout is closed until you resume.", tone: "neutral", action: { label: "Undo", onClick: () => setPaused(false) } });
            }}
          />
        )}
      </Card>
    </section>
  );
}

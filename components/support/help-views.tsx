"use client";

import { Button } from "@/components/ui/button";
import { supportIssueTypes } from "@/lib/data/support";
import { ContactSupportForm } from "./contact-support-form";

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** Demo wiring: the request "sends" after a short delay and returns a fake ticket reference. */
export function ContactSupportView({ orders, defaultOrderId }: { orders: { id: string; label: string }[]; defaultOrderId?: string }) {
  return (
    <ContactSupportForm
      orders={orders}
      issueTypes={supportIssueTypes}
      defaultOrderId={defaultOrderId}
      onSubmit={async (req) => {
        await wait(900);
        if (/fail/i.test(req.message)) throw new Error("demo failure");
        return `TKT-${String(Date.now()).slice(-7)}`;
      }}
    />
  );
}

export function AskUsButton() {
  return (
    <Button asChild>
      <a href="#contact">Ask us instead</a>
    </Button>
  );
}

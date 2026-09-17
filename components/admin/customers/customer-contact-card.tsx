"use client";

import { useState } from "react";
import { Mail, Phone } from "lucide-react";
import { toast } from "@/components/providers/toast-store";
import { Card } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { Switch } from "@/components/ui/switch";
import type { AdminCustomer } from "@/lib/data/admin";
import { formatPhone } from "@/lib/format";

/** Email and phone with copy, plus the marketing consent toggle. */
export function CustomerContactCard({ customer }: { customer: AdminCustomer }) {
  const [optIn, setOptIn] = useState(customer.marketingOptIn);
  const phone = formatPhone(customer.phone);

  function change(next: boolean) {
    setOptIn(next);
    toast({
      title: next ? "Marketing consent recorded" : "Marketing consent withdrawn",
      description: next ? `${customer.name} can now get offers by email and WhatsApp.` : `${customer.name} will only get order and delivery updates.`,
      tone: next ? "success" : "neutral",
      action: { label: "Undo", onClick: () => setOptIn(!next) },
    });
  }

  return (
    <Card padding="md" className="gap-4">
      <h2 className="text-title">Contact</h2>
      <ul className="flex flex-col gap-2">
        <li className="flex items-center gap-3">
          <Mail aria-hidden className="size-icon-md shrink-0 text-fg-muted" />
          <a href={`mailto:${customer.email}`} className="min-w-0 flex-1 truncate text-body underline-offset-4 hover:underline">
            {customer.email}
          </a>
          <CopyButton value={customer.email} label="Copy email" size="xs" />
        </li>
        <li className="flex items-center gap-3">
          <Phone aria-hidden className="size-icon-md shrink-0 text-fg-muted" />
          <a href={`tel:+91${customer.phone}`} className="min-w-0 flex-1 truncate text-body figures underline-offset-4 hover:underline">
            {phone}
          </a>
          <CopyButton value={phone} label="Copy phone" size="xs" />
        </li>
      </ul>
      <div className="border-t border-border-subtle pt-4">
        <Switch
          checked={optIn}
          onCheckedChange={change}
          label="Marketing messages"
          description={optIn ? "Opted in to offers by email and WhatsApp" : "Gets order and delivery updates only"}
        />
      </div>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { FileDown } from "lucide-react";
import { toast } from "@/components/providers/toast-store";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";

export type InvoiceDownloadButtonProps = Omit<ButtonProps, "onClick" | "children"> & {
  orderId: string;
  /** Invoices are generated once the order is delivered. */
  available: boolean;
  /** Fetch the invoice file (PDF from the invoicing service). */
  getInvoice: () => Promise<Blob>;
  fileName?: string;
  label?: string;
};

/**
 * Downloads the tax invoice. Before delivery the button stays focusable but explains when the
 * invoice will be ready instead of silently doing nothing.
 */
export function InvoiceDownloadButton({ orderId, available, getInvoice, fileName, label = "Download invoice", variant = "secondary", size = "sm", ...props }: InvoiceDownloadButtonProps) {
  const [busy, setBusy] = useState(false);

  if (!available) {
    return (
      <Tooltip content="The invoice is ready once your order is delivered">
        <Button variant={variant} size={size} leadingIcon={<FileDown aria-hidden />} aria-disabled="true" onClick={(e) => e.preventDefault()} {...props}>
          {label}
        </Button>
      </Tooltip>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      loading={busy}
      leadingIcon={<FileDown aria-hidden />}
      onClick={async () => {
        setBusy(true);
        try {
          const blob = await getInvoice();
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = fileName ?? `Invoice-${orderId}.pdf`;
          a.click();
          window.setTimeout(() => URL.revokeObjectURL(url), 1000);
          toast({ title: "Invoice downloaded", description: a.download, tone: "success" });
        } catch {
          toast({ title: "Couldn’t download the invoice", description: "Try again in a moment.", tone: "danger" });
        } finally {
          setBusy(false);
        }
      }}
      {...props}
    >
      {label}
    </Button>
  );
}

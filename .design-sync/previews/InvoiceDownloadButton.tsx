import { InvoiceDownloadButton } from "@bluesigns/ui";

const getInvoice = async () => new Blob(["Tax invoice · Order LM-100377 · Total INR 6,999 (inclusive of GST)"], { type: "text/plain" });

export const Available = () => <InvoiceDownloadButton orderId="LM-100377" available getInvoice={getInvoice} fileName="Invoice-LM-100377.txt" />;

export const NotYetAvailable = () => <InvoiceDownloadButton orderId="LM-100482" available={false} getInvoice={getInvoice} />;

export const Variants = () => (
  <div className="flex flex-wrap items-center gap-3">
    <InvoiceDownloadButton orderId="LM-100377" available getInvoice={getInvoice} variant="ghost" label="Invoice" />
    <InvoiceDownloadButton orderId="LM-100377" available getInvoice={getInvoice} variant="neutral" size="md" label="Download GST invoice" />
    <InvoiceDownloadButton orderId="LM-100066" available getInvoice={getInvoice} variant="link" label="Credit note (PDF)" />
  </div>
);

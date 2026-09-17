"use client";

import { useState } from "react";
import { FileSpreadsheet } from "lucide-react";
import { toast } from "@/components/providers/toast-store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { FileUpload, type UploadItem } from "@/components/ui/file-upload";
import { Inset } from "@/components/ui/inset";

const columns = ["name", "sku", "category", "mrp", "price", "gst_rate", "hsn", "stock"];

/** Bulk import from a spreadsheet export. Demo: the file is accepted but not parsed. */
export function ImportCsvDialog() {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<UploadItem[]>([]);
  const [busy, setBusy] = useState(false);

  function onOpenChange(next: boolean) {
    if (busy) return;
    setOpen(next);
    if (!next) setFiles([]);
  }

  function importFile() {
    const file = files[0];
    if (!file) return;
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setOpen(false);
      setFiles([]);
      toast({ tone: "success", title: "Import started", description: `${file.file.name} is being processed. New products arrive as drafts (demo).` });
    }, 700);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary" leadingIcon={<FileSpreadsheet aria-hidden />}>
          Import CSV
        </Button>
      </DialogTrigger>
      <DialogContent size="md">
        <DialogHeader title="Import products" description="Add or update many products at once from a CSV file. Rows with an existing SKU update that product." />
        <DialogBody className="flex flex-col gap-4">
          <Field label="CSV file">
            <FileUpload accept=".csv,text/csv" multiple={false} maxSize={10 * 1024 * 1024} layout="list" value={files} onValueChange={setFiles} description="CSV · up to 10 MB · one file" />
          </Field>
          <Inset size="sm" className="flex flex-col gap-1.5">
            <p className="text-label">Required columns</p>
            <p className="text-code break-words text-fg-muted">{columns.join(", ")}</p>
            <p className="text-caption text-fg-muted">Prices are in rupees and include GST. HSN codes are 4, 6 or 8 digits.</p>
          </Inset>
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={busy}>
            Cancel
          </Button>
          <Button onClick={importFile} disabled={files.length === 0} loading={busy}>
            Import products
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

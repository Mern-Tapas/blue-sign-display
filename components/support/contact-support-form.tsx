"use client";

import { useId, useState } from "react";
import { CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, cardVariants } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { Field } from "@/components/ui/field";
import { FileUpload, type UploadItem } from "@/components/ui/file-upload";
import { Inset } from "@/components/ui/inset";
import { Radio, RadioGroup } from "@/components/ui/radio-group";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/cn";

export type SupportRequest = {
  orderId: string | null;
  issue: string;
  message: string;
  attachments: File[];
  contactBy: "email" | "phone" | "whatsapp";
};

export type ContactSupportFormProps = {
  orders: { id: string; label: string }[];
  issueTypes: { value: string; label: string }[];
  defaultOrderId?: string;
  /** Resolves with the ticket reference. */
  onSubmit: (request: SupportRequest) => Promise<string>;
  /** Issues where a photo is expected (damaged / wrong item). */
  photoIssues?: string[];
  className?: string;
};

const MIN_MESSAGE = 20;

/**
 * Contact form that collects what support needs on the first message: the order, the kind of
 * problem, a description and photos. Photo upload is asked for (not required) when the issue is
 * about a damaged or wrong item. Success shows a copyable ticket reference.
 */
export function ContactSupportForm({ orders, issueTypes, defaultOrderId, onSubmit, photoIssues = ["damaged"], className }: ContactSupportFormProps) {
  const id = useId();
  const [orderId, setOrderId] = useState(defaultOrderId ?? "");
  const [issue, setIssue] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<UploadItem[]>([]);
  const [contactBy, setContactBy] = useState<SupportRequest["contactBy"]>("email");
  const [errors, setErrors] = useState<{ issue?: string; message?: string; form?: string }>({});
  const [busy, setBusy] = useState(false);
  const [ticket, setTicket] = useState<string>();

  if (ticket) {
    return (
      <Card data-slot="contact-support" role="status" className={cn("items-start gap-3", className)}>
        <CircleCheck aria-hidden className="size-8 text-success-fg" />
        <h3 className="text-heading-sm">We’ve got your request</h3>
        <p className="text-body text-fg-muted">
          We usually reply within 4 hours, by {contactBy === "email" ? "email" : contactBy === "phone" ? "phone call" : "WhatsApp"}. Keep this reference if you contact us again.
        </p>
        <Inset className="flex items-center gap-2 py-1 pr-1 pl-3">
          <span className="text-body-strong figures">{ticket}</span>
          <CopyButton value={ticket} label="Copy ticket reference" />
        </Inset>
        <Button
          variant="secondary"
          onClick={() => {
            setTicket(undefined);
            setIssue("");
            setMessage("");
            setFiles([]);
          }}
        >
          Raise another request
        </Button>
      </Card>
    );
  }

  const showPhotos = photoIssues.includes(issue);

  return (
    <form
      data-slot="contact-support"
      noValidate
      aria-labelledby={`${id}-title`}
      className={cn(cardVariants(), "gap-5", className)}
      onSubmit={async (e) => {
        e.preventDefault();
        const next: typeof errors = {};
        if (!issue) next.issue = "Choose what the problem is about";
        if (message.trim().length < MIN_MESSAGE) next.message = `Tell us a little more (at least ${MIN_MESSAGE} characters)`;
        setErrors(next);
        if (next.issue || next.message) return;
        setBusy(true);
        try {
          setTicket(await onSubmit({ orderId: orderId && orderId !== "none" ? orderId : null, issue, message: message.trim(), attachments: files.map((f) => f.file), contactBy }));
        } catch {
          setErrors({ form: "Couldn’t send your request. Check your connection and try again." });
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="flex flex-col gap-1">
        <h3 id={`${id}-title`} className="text-heading-sm">
          Contact support
        </h3>
        <p className="text-body text-fg-muted">Include the order so we don’t need to ask again.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Order">
          <Select value={orderId} onValueChange={setOrderId} placeholder="Choose an order" options={[...orders.map((o) => ({ value: o.id, label: o.label })), { value: "none", label: "Not about an order" }]} />
        </Field>
        <Field label="What’s it about?" required error={errors.issue}>
          <Select
            value={issue}
            onValueChange={(v) => {
              setIssue(v);
              setErrors((x) => ({ ...x, issue: undefined }));
            }}
            placeholder="Choose an issue"
            options={issueTypes}
          />
        </Field>
      </div>

      <Field label="Describe the problem" required error={errors.message} hint={errors.message ? undefined : `${message.trim().length} / 1000`}>
        <Textarea
          rows={5}
          maxLength={1000}
          value={message}
          placeholder="What happened, and what would you like us to do?"
          onChange={(e) => {
            setMessage(e.target.value);
            if (errors.message && e.target.value.trim().length >= MIN_MESSAGE) setErrors((x) => ({ ...x, message: undefined }));
          }}
        />
      </Field>

      <FileUpload
        accept="image/*,.pdf"
        maxFiles={3}
        maxSize={5 * 1024 * 1024}
        value={files}
        onValueChange={setFiles}
        variant={showPhotos ? "dropzone" : "button"}
        title={showPhotos ? "Add photos of the item and packaging" : "Attach files (optional)"}
        description="Up to 3 images or PDFs, 5 MB each"
      />

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-label">How should we reply?</legend>
        <RadioGroup value={contactBy} onValueChange={(v) => setContactBy(v as SupportRequest["contactBy"])} orientation="horizontal" className="flex flex-wrap gap-x-6 gap-y-2">
          <Radio value="email" label="Email" />
          <Radio value="phone" label="Phone call" />
          <Radio value="whatsapp" label="WhatsApp" />
        </RadioGroup>
      </fieldset>

      {errors.form && (
        <p role="alert" className="text-body text-danger-fg">
          {errors.form}
        </p>
      )}

      <Button type="submit" loading={busy} className="self-start max-sm:w-full">
        Send request
      </Button>
    </form>
  );
}

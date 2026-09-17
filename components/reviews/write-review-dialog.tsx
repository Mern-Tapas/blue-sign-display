"use client";

import { useId, useState } from "react";
import { CircleCheck, PenLine } from "lucide-react";
import { ProductImage } from "@/components/commerce/product-image";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { FileUpload, type UploadItem } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Inset } from "@/components/ui/inset";
import { RatingInput } from "@/components/ui/rating-input";
import { Textarea } from "@/components/ui/textarea";

export type ReviewDraft = { rating: number; aspects: Record<string, number>; title: string; body: string; photos: File[] };

export type WriteReviewDialogProps = {
  product: { name: string; image: string };
  /** Aspects to rate optionally ("Comfort", "Battery life"). */
  aspects?: string[];
  /** Resolve when saved; throw with a message to show it. */
  onSubmit: (draft: ReviewDraft) => Promise<void>;
  trigger?: React.ReactElement;
  /** Moderation note on the success screen. */
  moderationNote?: string;
  /** Controlled open state (e.g. opened from RateProductPrompt). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Star rating already chosen before opening. */
  defaultRating?: number;
};

const MIN_BODY = 30;
const MAX_BODY = 1500;

/**
 * Review form in a dialog: overall stars (required), optional aspect stars, title, body with a
 * live character count, and up to 5 photos. Errors appear per field; the success screen says
 * when the review will be visible.
 */
export function WriteReviewDialog({
  product,
  aspects = [],
  onSubmit,
  trigger,
  moderationNote = "Reviews are checked against our guidelines and usually appear within 24 hours.",
  open: openProp,
  onOpenChange,
  defaultRating = 0,
}: WriteReviewDialogProps) {
  const id = useId();
  const [openState, setOpenState] = useState(false);
  const open = openProp ?? openState;
  const setOpen = (o: boolean) => {
    if (openProp === undefined) setOpenState(o);
    onOpenChange?.(o);
  };
  const [ratingState, setRating] = useState(0);
  const rating = ratingState || defaultRating;
  const [aspectValues, setAspectValues] = useState<Record<string, number>>({});
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [photos, setPhotos] = useState<UploadItem[]>([]);
  const [errors, setErrors] = useState<{ rating?: string; title?: string; body?: string }>({});
  const [formError, setFormError] = useState<string>();
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  function reset() {
    setRating(0);
    setAspectValues({});
    setTitle("");
    setBody("");
    setPhotos([]);
    setErrors({});
    setFormError(undefined);
    setDone(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const next = {
      rating: rating ? undefined : "Choose a star rating",
      title: title.trim() ? undefined : "Add a short title",
      body: body.trim().length < MIN_BODY ? `Write at least ${MIN_BODY} characters about your experience` : undefined,
    };
    setErrors(next);
    if (next.rating || next.title || next.body) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-review-form="${id}"] [aria-invalid="true"], [data-review-form="${id}"] [role=alert]`)?.scrollIntoView({ block: "center" }));
      return;
    }
    setPending(true);
    setFormError(undefined);
    try {
      await onSubmit({ rating, aspects: aspectValues, title: title.trim(), body: body.trim(), photos: photos.map((p) => p.file) });
      setDone(true);
    } catch (err) {
      setFormError(err instanceof Error && err.message ? err.message : "Couldn’t submit your review. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) reset();
      }}
    >
      {/* Controlled dialogs opened elsewhere don't need a trigger */}
      {(openProp === undefined || trigger) && (
        <DialogTrigger asChild>
          {trigger ?? (
            <Button variant="secondary" leadingIcon={<PenLine aria-hidden />}>
              Write a review
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent size="lg">
        {done ? (
          <>
            <DialogHeader icon={<CircleCheck />} title="Thanks for your review" description={moderationNote} />
            <DialogFooter className="pt-5">
              <Button onClick={() => setOpen(false)}>Done</Button>
            </DialogFooter>
          </>
        ) : (
          <form noValidate onSubmit={submit} data-review-form={id} className="flex min-h-0 flex-1 flex-col">
            <DialogHeader title="Write a review" description="Tell other shoppers what you liked and what could be better." />
            <DialogBody className="flex flex-col gap-5">
              <Inset size="sm" className="flex items-center gap-3">
                <ProductImage src={product.image} alt="" sizes="48px" wrapperClassName="size-12 shrink-0 rounded-md" />
                <p className="text-body-strong">{product.name}</p>
              </Inset>
              {formError && <Alert tone="danger">{formError}</Alert>}
              <Field id={`${id}-rating`} label="Overall rating" error={errors.rating} required>
                <RatingInput
                  value={rating}
                  onValueChange={(v) => {
                    setRating(v);
                    setErrors((er) => ({ ...er, rating: undefined }));
                  }}
                />
              </Field>
              {aspects.length > 0 && (
                <fieldset className="flex flex-col gap-3">
                  <legend className="mb-1 text-label">
                    Rate the details <span className="font-normal text-fg-muted">(optional)</span>
                  </legend>
                  {aspects.map((a) => (
                    <div key={a} className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-body text-fg-muted">{a}</span>
                      <RatingInput aria-label={a} size="md" showLabel={false} value={aspectValues[a] ?? 0} onValueChange={(v) => setAspectValues((s) => ({ ...s, [a]: v }))} />
                    </div>
                  ))}
                </fieldset>
              )}
              <Field id={`${id}-title`} label="Title" error={errors.title} required>
                <Input
                  maxLength={80}
                  placeholder="Sum it up in a line"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors((er) => ({ ...er, title: undefined }));
                  }}
                />
              </Field>
              <Field id={`${id}-body`} label="Your review" error={errors.body} hint={`${body.trim().length}/${MAX_BODY} · at least ${MIN_BODY} characters`} required>
                <Textarea
                  rows={5}
                  maxLength={MAX_BODY}
                  placeholder="How does it fit, feel or perform? Would you buy it again?"
                  value={body}
                  onChange={(e) => {
                    setBody(e.target.value);
                    if (errors.body && e.target.value.trim().length >= MIN_BODY) setErrors((er) => ({ ...er, body: undefined }));
                  }}
                />
              </Field>
              <Field label="Add photos" hint="Up to 5 photos · no faces or personal details">
                <FileUpload accept="image/*" maxFiles={5} variant="button" value={photos} onValueChange={setPhotos} />
              </Field>
            </DialogBody>
            <DialogFooter className="border-t border-border-subtle pt-4">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={pending}>
                Cancel
              </Button>
              <Button type="submit" loading={pending}>
                Submit review
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useId, useState } from "react";
import { BadgeCheck, Eye, EyeOff, ImageIcon, MessageSquareReply, ShieldAlert } from "lucide-react";
import { ProductImage } from "@/components/commerce/product-image";
import { RatingPill } from "@/components/reviews/rating-pill";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Inset } from "@/components/ui/inset";
import { TextLink } from "@/components/ui/text-link";
import { Textarea } from "@/components/ui/textarea";
import { adminDate } from "@/lib/admin-format";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";
import type { ModerationReview } from "./catalog-data";

const REPLY_MAX = 500;

export type ModerationReviewCardProps = {
  review: ModerationReview;
  selected: boolean;
  onSelectedChange: (selected: boolean) => void;
  onPublish: () => void;
  onHide: () => void;
  onReply: (reply: string) => void;
};

/** One review in the moderation queue: the content, automatic flags, and publish / hide / reply. */
export function ModerationReviewCard({ review, selected, onSelectedChange, onPublish, onHide, onReply }: ModerationReviewCardProps) {
  const id = useId();
  const [replying, setReplying] = useState(false);
  const [text, setText] = useState(review.reply ?? "");
  const tooLong = text.length > REPLY_MAX;

  return (
    <article aria-labelledby={`${id}-title`} data-state={selected ? "selected" : undefined} className="flex gap-3 p-4 transition-colors duration-(--dur-instant) data-[state=selected]:bg-selected sm:gap-4 sm:p-5">
      <Checkbox aria-label={`Select review “${review.title}” by ${review.author}`} checked={selected} onCheckedChange={(on) => onSelectedChange(on === true)} className="mt-0.5" />

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-start gap-3">
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <RatingPill value={review.rating} size="md" />
              <h3 id={`${id}-title`} className="min-w-0 text-body-strong">
                {review.title}
              </h3>
            </div>
            <p className="max-w-[70ch] text-body text-fg-muted">{review.body}</p>
          </div>
          <ProductImage src={review.productImage} alt="" sizes="48px" wrapperClassName="size-12 shrink-0 rounded-sm max-sm:hidden" />
        </div>

        <p className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-caption text-fg-muted">
          <span className="text-fg">{review.author}</span>
          {review.verified ? (
            <span className="inline-flex items-center gap-1 text-success-fg">
              <BadgeCheck aria-hidden className="size-icon-sm" /> Verified buyer
            </span>
          ) : (
            <span>Not a verified purchase</span>
          )}
          <time dateTime={review.date} className="figures">
            {adminDate(review.date)}
          </time>
          <span className="min-w-0">
            on{" "}
            <TextLink href={`/admin/products/${review.productId}`} size="sm">
              {review.productName}
            </TextLink>
          </span>
          {review.media > 0 && (
            <span className="inline-flex items-center gap-1 figures">
              <ImageIcon aria-hidden className="size-icon-sm" />
              {formatNumber(review.media)} {review.media === 1 ? "photo" : "photos"}
            </span>
          )}
          {review.demo && (
            <Badge tone="outline" size="sm">
              Demo review
            </Badge>
          )}
        </p>

        {review.flag && review.status === "pending" && (
          <Alert size="sm" tone="warning" icon={<ShieldAlert aria-hidden />} role="note">
            {review.flag}. Check it follows the review guidelines before publishing.
          </Alert>
        )}
        {review.status === "hidden" && (
          <Alert size="sm" tone="neutral" icon={<EyeOff aria-hidden />} role="note">
            Hidden from the storefront{review.hiddenReason ? `: ${review.hiddenReason.toLowerCase()}` : ""}.
          </Alert>
        )}

        {review.reply && !replying && (
          <Inset size="sm" className="flex flex-col gap-0.5">
            <p className="text-caption text-fg-muted">Reply from BlueSigns{review.status !== "published" ? " · shows once the review is published" : ""}</p>
            <p className="text-body">{review.reply}</p>
          </Inset>
        )}

        {replying ? (
          <div className="flex flex-col gap-3">
            <Field label="Public reply" error={tooLong ? `Keep replies under ${REPLY_MAX} characters.` : undefined} labelAction={<span className={cn("text-caption figures", tooLong ? "text-danger-fg" : "text-fg-muted")}>{formatNumber(text.length)} / {REPLY_MAX}</span>}>
              <Textarea rows={3} autoFocus value={text} onChange={(e) => setText(e.target.value)} placeholder="Thank the customer and say what you’ll do about it." />
            </Field>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                disabled={!text.trim() || tooLong}
                onClick={() => {
                  onReply(text.trim());
                  setReplying(false);
                }}
              >
                Save reply
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setText(review.reply ?? "");
                  setReplying(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {review.status !== "published" && (
              <Button variant="secondary" size="sm" leadingIcon={<Eye aria-hidden />} onClick={onPublish}>
                Publish
              </Button>
            )}
            {review.status !== "hidden" && (
              <Button variant="ghost" size="sm" leadingIcon={<EyeOff aria-hidden />} onClick={onHide}>
                Hide
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              leadingIcon={<MessageSquareReply aria-hidden />}
              onClick={() => {
                setText(review.reply ?? "");
                setReplying(true);
              }}
            >
              {review.reply ? "Edit reply" : "Reply"}
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}

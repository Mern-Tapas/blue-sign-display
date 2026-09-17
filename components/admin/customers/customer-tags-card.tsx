"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "@/components/providers/toast-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const MAX_TAG = 24;

/** Staff-only tags: removable chips plus an add field with duplicate and length checks. */
export function CustomerTagsCard({ initialTags }: { initialTags: string[] }) {
  const [tags, setTags] = useState(initialTags);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  function add(e: React.FormEvent) {
    e.preventDefault();
    const tag = draft.trim().replace(/\s+/g, " ");
    if (!tag) return setError("Type a tag first, e.g. Wholesale.");
    if (tag.length > MAX_TAG) return setError(`Keep tags under ${MAX_TAG} characters.`);
    if (tags.some((t) => t.toLowerCase() === tag.toLowerCase())) return setError(`“${tag}” is already on this customer.`);
    setTags((t) => [...t, tag]);
    setDraft("");
    setError(null);
  }

  function remove(tag: string) {
    const before = tags;
    setTags((t) => t.filter((x) => x !== tag));
    toast({ title: `Removed “${tag}”`, tone: "neutral", action: { label: "Undo", onClick: () => setTags(before) } });
  }

  return (
    <Card padding="md" className="gap-4">
      <h2 className="text-title">Tags</h2>
      {tags.length > 0 ? (
        <ul className="flex flex-wrap gap-2" aria-label="Customer tags">
          {tags.map((t) => (
            <li key={t}>
              <Chip size="xs" variant="sunken" onRemove={() => remove(t)} removeLabel={`Remove tag ${t}`}>
                {t}
              </Chip>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-body text-fg-muted">No tags yet. Tags like “Wholesale” or “Gifting” help you filter and target customers later.</p>
      )}
      <form onSubmit={add} className="flex items-start gap-2" noValidate>
        <Field error={error ?? undefined} className="min-w-0 flex-1">
          <Input
            size="sm"
            aria-label="New tag"
            placeholder="Add a tag"
            value={draft}
            maxLength={MAX_TAG + 8}
            onChange={(e) => {
              setDraft(e.target.value);
              if (error) setError(null);
            }}
          />
        </Field>
        <Button type="submit" size="sm" variant="secondary" leadingIcon={<Plus aria-hidden />}>
          Add
        </Button>
      </form>
    </Card>
  );
}

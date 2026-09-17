"use client";

import { useRef, useState } from "react";
import { toast } from "@/components/providers/toast-store";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useDraft } from "../admin-parts";

const MAX = 500;

/** Internal note for the team (packing instructions, customer calls). Never shown to the customer. */
export function OrderNotesCard({ initialNote = "" }: { initialNote?: string }) {
  const { draft, setDraft, dirty, commit, discard } = useDraft(initialNote);
  const [saving, setSaving] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const tooLong = draft.length > MAX;

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!dirty || tooLong) return;
    setSaving(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      commit();
      setSaving(false);
      toast({ title: "Note saved", description: "Visible to your team only.", tone: "success" });
    }, 400);
  }

  return (
    <Card asChild padding="md">
      <form onSubmit={save}>
        <CardHeader title="Notes" description="Only your team sees this." />
        <Field label="Internal note" error={tooLong ? `Keep notes under ${MAX} characters (${draft.length} now).` : undefined} hint={`${draft.length}/${MAX}`} className="[&>div:first-child]:sr-only">
          <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={3} placeholder="e.g. Gift wrap, no invoice in the box" disabled={saving} />
        </Field>
        <div className="flex flex-wrap justify-end gap-2">
          {dirty && !saving && (
            <Button variant="ghost" size="sm" onClick={discard}>
              Discard
            </Button>
          )}
          <Button type="submit" variant="secondary" size="sm" disabled={!dirty || tooLong} loading={saving}>
            Save note
          </Button>
        </div>
      </form>
    </Card>
  );
}

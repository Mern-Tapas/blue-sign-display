"use client";

import { useState } from "react";
import { toast } from "@/components/providers/toast-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useDraft } from "../admin-parts";

const MAX_NOTE = 500;

/** Internal notes only staff can see. Save is enabled once the note changes. */
export function CustomerNotesCard({ firstName }: { firstName: string }) {
  const { draft, setDraft, dirty, commit, discard } = useDraft("");
  const [saving, setSaving] = useState(false);
  const tooLong = draft.length > MAX_NOTE;

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (tooLong || !dirty) return;
    setSaving(true);
    // Demo: a short pause stands in for the network round-trip.
    window.setTimeout(() => {
      commit();
      setSaving(false);
      toast({ title: "Note saved", description: `Visible to staff on ${firstName}’s profile and their orders.`, tone: "success" });
    }, 400);
  }

  return (
    <Card asChild padding="md" className="gap-4">
      <form onSubmit={save} noValidate>
        <h2 className="text-title">Internal notes</h2>
        <Field
          label="Note for staff"
          hint={`Shoppers never see this. ${draft.length}/${MAX_NOTE}`}
          error={tooLong ? `Shorten the note by ${draft.length - MAX_NOTE} characters.` : undefined}
        >
          <Textarea rows={3} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="e.g. Prefers delivery after 6 pm. Call before sending a replacement." disabled={saving} />
        </Field>
        <div className="flex justify-end gap-2">
          {dirty && (
            <Button variant="ghost" size="sm" onClick={discard} disabled={saving}>
              Discard
            </Button>
          )}
          <Button type="submit" variant="secondary" size="sm" loading={saving} disabled={!dirty || tooLong}>
            Save note
          </Button>
        </div>
      </form>
    </Card>
  );
}

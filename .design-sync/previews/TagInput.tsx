import { useState } from "react";
import { Field, TagInput } from "@bluesigns/ui";

function Tags({ initial, ...props }: { initial: string[] } & Omit<React.ComponentProps<typeof TagInput>, "value" | "onValueChange">) {
  const [tags, setTags] = useState(initial);
  return <TagInput value={tags} onValueChange={setTags} {...props} />;
}

export const SearchTags = () => (
  <div style={{ maxWidth: 420 }}>
    <Field label="Search tags" hint="Enter or comma adds · Backspace removes the last · paste a list">
      <Tags initial={["watches", "gifting", "analog"]} max={6} placeholder="Add a tag" />
    </Field>
  </div>
);

export const States = () => (
  <div className="flex flex-col gap-4" style={{ maxWidth: 420 }}>
    <Field label="Tags">
      <Tags initial={[]} placeholder="Add a tag" />
    </Field>
    <Field label="Colours" hint="Up to 2">
      <Tags initial={["Black", "Sand"]} max={2} />
    </Field>
    <Field label="Keywords" error="Add at least 3 keywords">
      <Tags initial={["sneakers"]} placeholder="Add a keyword" />
    </Field>
    <Field label="Locked tags">
      <Tags initial={["bestseller"]} disabled />
    </Field>
  </div>
);

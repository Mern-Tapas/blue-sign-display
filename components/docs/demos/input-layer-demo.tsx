"use client";

import { useEffect, useRef, useState } from "react";
import { Field } from "@/components/ui/field";
import { FormRow } from "@/components/ui/form-row";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { MoneyInput } from "@/components/ui/money-input";
import { NumberInput } from "@/components/ui/number-input";
import { TagInput } from "@/components/ui/tag-input";
import { SlugInput } from "@/components/ui/slug-input";
import { RepeatableList } from "@/components/ui/repeatable-list";
import { MediaGrid, type MediaItem } from "@/components/ui/media-grid";
import { OptionSetEditor } from "@/components/ui/option-set-editor";
import { FileUpload, type UploadItem } from "@/components/ui/file-upload";
import type { OptionSet } from "@/lib/form/cartesian";
import { Textarea } from "@/components/ui/textarea";
import { DsStates } from "@/components/docs/ds-section";
import { useMask } from "@/lib/form/use-mask";
import { slugify } from "@/lib/form/slugify";

/* ---------------------------------------------------------------- numbers */

export function NumberInputDemo() {
  const [stock, setStock] = useState<number | null>(12);
  const [price, setPrice] = useState<number | null>(3999);
  const [gst, setGst] = useState<number | null>(18);

  return (
    <FormRow columns={3}>
      <Field label="Stock on hand" hint="↑ ↓ to step · Shift for ten">
        <NumberInput aria-label="Stock on hand" value={stock} onValueChange={setStock} min={0} max={999} stepper="inline" />
      </Field>
      <Field label="Selling price">
        <MoneyInput aria-label="Selling price" value={price} onValueChange={setPrice} />
      </Field>
      <Field label="GST rate">
        <NumberInput aria-label="GST rate" value={gst} onValueChange={setGst} min={0} max={100} suffix="%" />
      </Field>
    </FormRow>
  );
}

/* ---------------------------------------------------------------- clear & status */

/** A value being checked against something — the surface only; the caller owns the request. */
export function ClearableInputDemo() {
  const [value, setValue] = useState("everyday-sneaker");
  const [status, setStatus] = useState<"idle" | "checking" | "valid">("valid");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const check = (next: string) => {
    setValue(next);
    clearTimeout(timer.current);
    if (!next) return setStatus("idle");
    setStatus("checking");
    timer.current = setTimeout(() => setStatus("valid"), 900);
  };

  return (
    <FormRow columns={2}>
      <Field label="Handle" hint="Clears, then re-checks">
        <Input
          aria-label="Handle"
          value={value}
          onChange={(e) => check(slugify(e.target.value))}
          clearable
          onClear={() => check("")}
          status={status}
          statusLabel={status === "checking" ? "Checking availability" : "Available"}
        />
      </Field>
      <Field label="Order ID" hint="Read-only: readable, focusable, not editable">
        <Input aria-label="Order ID" value="LM-200600" readOnly />
      </Field>
    </FormRow>
  );
}

/* ---------------------------------------------------------------- mask */

export function MaskDemo() {
  const [gstin, setGstin] = useState("");
  const mask = useMask({ pattern: "##AAAAA####A#Z#", uppercase: true });

  return (
    <Field label="GSTIN" hint="Append-only mask: 15 characters, letters upper-cased" counter={{ value: gstin.length, max: mask.maxLength }}>
      <Input aria-label="GSTIN" value={gstin} inputMode={mask.inputMode} maxLength={mask.maxLength} onChange={(e) => setGstin(mask.onChange(e))} placeholder="29AAECL4821K1Z6" />
    </Field>
  );
}

/* ---------------------------------------------------------------- tags */

export function TagInputDemo() {
  const [tags, setTags] = useState(["watches", "gifting"]);
  return (
    <Field label="Search tags" hint="Enter or comma adds · Backspace removes the last · paste a list">
      <TagInput aria-label="Search tags" value={tags} onValueChange={setTags} max={6} placeholder="Add a tag" />
    </Field>
  );
}

/* ---------------------------------------------------------------- async combobox */

const CATALOG = ["Aura Wireless Headphones", "Court Low Sneaker", "Daily Glow Serum", "Everyday Sneaker", "Field Jacket", "Fleece Hoodie", "Meridian Classic Watch", "Nomad Backpack", "Pulse Smart Watch", "Trail Hiker"];

/** Async search plus "add new" — the surface. Debounce and cancellation stay with the caller. */
export function AsyncComboboxDemo() {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<ComboboxOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [created, setCreated] = useState<string[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const search = (q: string) => {
    setQuery(q);
    clearTimeout(timer.current);
    if (!q.trim()) {
      setLoading(false);
      setOptions([]);
      return;
    }
    setLoading(true);
    // Stands in for a request: the point is the component's states, not the transport.
    timer.current = setTimeout(() => {
      const hits = [...CATALOG, ...created].filter((name) => name.toLowerCase().includes(q.toLowerCase()));
      setOptions(hits.map((name) => ({ value: name, label: name })));
      setLoading(false);
    }, 700);
  };

  return (
    <Field label="Linked product" hint="Type at least one letter">
      <Combobox
        aria-label="Linked product"
        options={options}
        searchValue={query}
        onSearchChange={search}
        loading={loading}
        creatable
        onCreate={(label) => {
          setCreated((c) => [...c, label]);
          setValue(label);
          setOptions([{ value: label, label }]);
        }}
        value={value}
        onValueChange={setValue}
        placeholder="Search the catalog"
        searchPlaceholder="Search products"
        emptyText="No products match"
      />
    </Field>
  );
}

/* ---------------------------------------------------------------- autosize */

export function AutosizeDemo() {
  const [text, setText] = useState("Lightweight everyday sneakers with a cushioned sole.");
  return (
    <Field label="Description" hint="Grows to 8 rows, then scrolls" counter={{ value: text.length, max: 300 }}>
      <Textarea aria-label="Description" autosize minRows={2} maxRows={8} value={text} onChange={(e) => setText(e.target.value)} />
    </Field>
  );
}

/** The state matrix lives here rather than on the page: every state needs a handler, and a
 *  server component cannot pass one to a client component. */
export function TagInputStates() {
  const noop = () => {};
  return (
    <DsStates
      states={[
        { label: "Empty", node: <TagInput aria-label="Tags" value={[]} onValueChange={noop} className="w-56" /> },
        { label: "With tags", node: <TagInput aria-label="Tags" value={["watches", "gifting"]} onValueChange={noop} className="w-56" /> },
        { label: "At limit", node: <TagInput aria-label="Tags" value={["a", "b"]} max={2} onValueChange={noop} className="w-56" />, note: "input says why" },
        { label: "Disabled", node: <TagInput aria-label="Tags" value={["watches"]} disabled onValueChange={noop} className="w-56" /> },
      ]}
    />
  );
}

/* ---------------------------------------------------------------- composites */

export function SlugInputDemo() {
  const [name, setName] = useState("Premium Running Shoes");
  const [slug, setSlug] = useState("");
  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <Field label="Product name">
        <Input aria-label="Product name" value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label="Handle">
        <SlugInput aria-label="Handle" value={slug} onValueChange={setSlug} source={name} sourceLabel="product name" prefix="bluesigns.shop/products/" />
      </Field>
    </div>
  );
}

type Spec = { id: string; label: string; detail: string };

export function RepeatableListDemo() {
  const [specs, setSpecs] = useState<Spec[]>([
    { id: "s1", label: "Material", detail: "Recycled knit upper" },
    { id: "s2", label: "Weight", detail: "268 g" },
  ]);
  return (
    <div className="w-full max-w-2xl">
      <RepeatableList
        items={specs}
        onItemsChange={setSpecs}
        newItem={() => ({ id: `s${Date.now()}`, label: "", detail: "" })}
        getKey={(s) => s.id}
        itemLabel="Specification"
        addLabel="Add specification"
        max={6}
        min={1}
        sortable
        renderRow={(spec, { index }) => (
          <div className="grid gap-2 sm:grid-cols-2">
            <Field label={index === 0 ? "Label" : undefined}>
              <Input aria-label={`Specification ${index + 1} label`} value={spec.label} placeholder="Material" onChange={(e) => setSpecs((all) => all.map((s) => (s.id === spec.id ? { ...s, label: e.target.value } : s)))} />
            </Field>
            <Field label={index === 0 ? "Detail" : undefined}>
              <Input aria-label={`Specification ${index + 1} detail`} value={spec.detail} placeholder="Recycled knit upper" onChange={(e) => setSpecs((all) => all.map((s) => (s.id === spec.id ? { ...s, detail: e.target.value } : s)))} />
            </Field>
          </div>
        )}
      />
    </div>
  );
}

const SWATCHES = ["#037ec2", "#1baf7a", "#eb6834", "#aa7fe4"];

export function MediaGridDemo() {
  const [items, setItems] = useState<MediaItem[]>(
    SWATCHES.map((color, i) => ({
      id: `m${i + 1}`,
      label: `Image ${i + 1}`,
      // A flat swatch stands in for a photo: the point is the arranging, not the picture.
      preview: <span className="block size-full" style={{ background: color }} />,
    })),
  );
  const [cover, setCover] = useState("m1");

  return (
    <div className="w-full max-w-2xl">
      <MediaGrid
        items={items}
        onItemsChange={setItems}
        primaryId={cover}
        onPrimaryChange={setCover}
        onRemove={(id) => setItems((all) => all.filter((i) => i.id !== id))}
      />
    </div>
  );
}

export function OptionSetDemo() {
  const [sets, setSets] = useState<OptionSet[]>([
    { id: "set-size", name: "Size", values: ["S", "M", "L"].map((label) => ({ id: label.toLowerCase(), label })) },
    { id: "set-colour", name: "Colour", values: ["Black", "Sand"].map((label) => ({ id: label.toLowerCase(), label })) },
  ]);
  return (
    <div className="w-full max-w-3xl">
      <OptionSetEditor value={sets} onValueChange={setSets} />
    </div>
  );
}

export function UploadProgressDemo() {
  const [items, setItems] = useState<UploadItem[]>([]);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => () => clearInterval(timer.current), []);

  // Stands in for a real upload so the states are visible without a server.
  const fakeUpload = (next: UploadItem[]) => {
    setItems(next.map((item) => ({ ...item, status: "uploading", progress: 0 })));
    clearInterval(timer.current);
    timer.current = setInterval(() => {
      setItems((all) => {
        const done = all.every((i) => (i.progress ?? 0) >= 100);
        if (done) clearInterval(timer.current);
        return all.map((item, i) => {
          const progress = Math.min(100, (item.progress ?? 0) + 12 + i * 3);
          // One failure on purpose: an upload UI that only shows success is not finished.
          if (progress >= 100 && i === 1) return { ...item, status: "error" as const, progress: 100, error: "Server rejected this file" };
          return { ...item, progress, status: progress >= 100 ? ("done" as const) : ("uploading" as const) };
        });
      });
    }, 320);
  };

  return (
    <div className="w-full max-w-xl">
      <FileUpload accept="image/*,.pdf" layout="list" value={items} onValueChange={fakeUpload} title="Add files to watch them upload" />
    </div>
  );
}

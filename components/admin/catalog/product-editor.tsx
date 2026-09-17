"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, Plus, Trash2, Wand2, X } from "lucide-react";
import { ProductImage } from "@/components/commerce/product-image";
import { toast } from "@/components/providers/toast-store";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Combobox } from "@/components/ui/combobox";
import { DescriptionList } from "@/components/ui/description-list";
import { Field } from "@/components/ui/field";
import { FileUpload, type UploadItem } from "@/components/ui/file-upload";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Inset } from "@/components/ui/inset";
import { RadioCard, RadioCardGroup } from "@/components/ui/radio-card";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { TextButton } from "@/components/ui/text-button";
import { TextLink } from "@/components/ui/text-link";
import { Textarea } from "@/components/ui/textarea";
import { adminDate } from "@/lib/admin-format";
import { ADMIN_DEMO_NOTE } from "@/lib/data/admin";
import { discountPercent, formatNumber, formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";
import { FormActionsBar, useDraft } from "../admin-parts";
import { StatusPill } from "../admin-display";
import { isMoney as isMoneyValue } from "@/lib/form/money";
import { slugify } from "@/lib/form/slugify";
import { PageHeader } from "../page-header";
import { brandNames, categoryNames, collectionOptions, productStatusMeta, type EditorDraft, type EditorMeta } from "./catalog-data";
import { EditorSection } from "./editor-section";

const MAX_IMAGES = 8;
const MAX_HIGHLIGHTS = 6;
const LIMITS = { description: 2000, seoTitle: 70, metaDescription: 160 };

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));
/** Prices here carry paise; the settings screen takes whole rupees (minorUnits: 0). */
const isMoney = (s: string) => isMoneyValue(s, { minorUnits: 2 });

/** Field id → message, in on-screen order (the first one receives focus on submit). */
function validate(d: EditorDraft): [string, string][] {
  const errors: [string, string][] = [];
  const add = (id: string, msg: string) => errors.push([id, msg]);

  if (d.status === "active" && d.images.length === 0) add("images", "Add at least one image before making the product active.");
  if (d.name.trim().length < 3) add("name", d.name.trim() ? "Use at least 3 characters." : "Enter a product name.");
  if (!d.category) add("category", "Choose a category.");
  if (d.description.length > LIMITS.description) add("description", `Keep the description under ${formatNumber(LIMITS.description)} characters.`);

  if (!isMoney(d.mrp) || num(d.mrp) <= 0) add("mrp", "Enter the MRP in rupees.");
  if (!isMoney(d.price) || num(d.price) <= 0) add("price", "Enter the selling price in rupees.");
  else if (isMoney(d.mrp) && num(d.price) > num(d.mrp)) add("price", "Selling price can’t be higher than MRP.");
  if (d.cost.trim() && !isMoney(d.cost)) add("cost", "Enter the cost in rupees, or leave it empty.");
  if (!/^(\d{4}|\d{6}|\d{8})$/.test(d.hsn.trim())) add("hsn", d.hsn.trim() ? "HSN codes are 4, 6 or 8 digits." : "Enter the HSN code from your GST invoice.");

  const skus = d.variants.map((v) => v.sku.trim().toUpperCase());
  d.variants.forEach((v, i) => {
    if (!v.label.trim()) add(`variant-${v.id}-label`, "Name this variant.");
    if (!v.sku.trim()) add(`variant-${v.id}-sku`, "Enter a SKU.");
    else if (skus.indexOf(skus[i]!) !== i) add(`variant-${v.id}-sku`, "Each variant needs its own SKU.");
    if (!/^\d+$/.test(v.stock.trim())) add(`variant-${v.id}-stock`, "Whole units, 0 or more.");
  });

  if (!(num(d.weight) > 0)) add("weight", "Enter the packed weight in grams.");
  (["length", "width", "height"] as const).forEach((k) => {
    if (d[k].trim() && !(num(d[k]) > 0)) add(k, "Enter centimetres.");
  });

  if (d.seoTitle.length > LIMITS.seoTitle) add("seoTitle", `Search engines cut titles after about ${LIMITS.seoTitle} characters.`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(d.slug)) add("slug", d.slug ? "Use lowercase letters, numbers and single hyphens." : "Enter a URL handle.");
  if (d.metaDescription.length > LIMITS.metaDescription) add("metaDescription", `Keep it under ${LIMITS.metaDescription} characters.`);
  return errors;
}

export type ProductEditorProps = {
  initial: EditorDraft;
  meta: EditorMeta;
};

/**
 * Product create / edit form. Local demo state: validation runs on submit (then live), the sticky
 * actions bar appears once something changes, and saving confirms with a toast.
 */
export function ProductEditor({ initial, meta }: ProductEditorProps) {
  const { draft, setDraft, dirty, commit, discard } = useDraft(initial);
  const [saved, setSaved] = useState({ name: initial.name, status: initial.status, slug: meta.storefrontSlug });
  const [attempted, setAttempted] = useState(false);
  const [saving, setSaving] = useState(false);

  const errorList = attempted ? validate(draft) : [];
  const errors = errorList.reduce<Record<string, string>>((acc, [id, msg]) => (id in acc ? acc : { ...acc, [id]: msg }), {});
  const set = <K extends keyof EditorDraft>(key: K, value: EditorDraft[K]) => setDraft((d) => ({ ...d, [key]: value }));
  const fid = (id: string) => `pe-${id}`;

  const isNew = meta.id === null;
  const mrp = num(draft.mrp);
  const price = num(draft.price);
  const cost = num(draft.cost);
  const gst = Number(draft.gstRate);
  const pricesOk = mrp > 0 && price > 0;
  const gstInPrice = price > 0 ? price - price / (1 + gst / 100) : NaN;
  const netOfGst = price > 0 ? price / (1 + gst / 100) : NaN;
  const margin = netOfGst > 0 && cost >= 0 && draft.cost.trim() ? (netOfGst - cost) / netOfGst : NaN;
  const totalStock = draft.variants.reduce((s, v) => s + (/^\d+$/.test(v.stock.trim()) ? Number(v.stock) : 0), 0);
  const volumetricKg = [draft.length, draft.width, draft.height].every((s) => num(s) > 0) ? (num(draft.length) * num(draft.width) * num(draft.height)) / 5000 : NaN;
  const chargeableKg = Math.max(num(draft.weight) > 0 ? num(draft.weight) / 1000 : 0, Number.isNaN(volumetricKg) ? 0 : volumetricKg);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAttempted(true);
    const found = validate(draft);
    if (found.length > 0) {
      document.getElementById(fid(found[0]![0]))?.focus();
      return;
    }
    setSaving(true);
    const snapshot = draft;
    setTimeout(() => {
      commit();
      setSaving(false);
      setAttempted(false);
      setSaved((s) => ({ name: snapshot.name, status: snapshot.status, slug: s.slug }));
      toast({
        tone: "success",
        title: isNew ? `${snapshot.name} created` : `${snapshot.name} saved`,
        description: snapshot.status === "active" ? "Live on the storefront. Demo: saved in this tab only." : "Saved as a draft. Demo: saved in this tab only.",
      });
    }, 600);
  }

  function addImages(items: UploadItem[]) {
    const room = MAX_IMAGES - draft.images.length;
    const accepted = items.slice(0, room).filter((i) => i.url);
    if (items.length > room) toast({ tone: "neutral", title: `Only ${MAX_IMAGES} images per product`, description: `${items.length - room} ${items.length - room === 1 ? "image was" : "images were"} not added.` });
    if (accepted.length) set("images", [...draft.images, ...accepted.map((i) => ({ id: i.id, src: i.url! }))]);
  }

  function moveImage(from: number, to: number) {
    const next = [...draft.images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item!);
    set("images", next);
  }

  const updateVariant = (id: string, patch: Partial<EditorDraft["variants"][number]>) => set("variants", draft.variants.map((v) => (v.id === id ? { ...v, ...patch } : v)));
  const baseSku = meta.sku || (draft.category && draft.name ? `LM-${draft.category.slice(0, 3).toUpperCase()}-${slugify(draft.name).split("-").slice(0, 2).join("").toUpperCase().slice(0, 8)}` : "");

  const counter = (n: number, max: number) => (
    <span className={cn("text-caption figures", n > max ? "text-danger-fg" : "text-fg-muted")} aria-live={n > max ? "polite" : undefined}>
      {formatNumber(n)} / {formatNumber(max)}
    </span>
  );

  const cover = draft.images[0];
  const discount = pricesOk ? discountPercent(price, mrp) : 0;

  return (
    <>
      <PageHeader
        title={saved.name || "New product"}
        breadcrumbs={[{ label: "Products", href: "/admin/products" }, { label: saved.name || "New product" }]}
        meta={
          <>
            <StatusPill tone={productStatusMeta[saved.status].tone} label={productStatusMeta[saved.status].label} />
            {meta.sku && <span className="text-code">{meta.sku}</span>}
            {meta.updatedAt && <span>Updated {adminDate(meta.updatedAt)}</span>}
            <span aria-hidden>·</span>
            <span>{ADMIN_DEMO_NOTE}</span>
          </>
        }
        actions={
          saved.slug && (
            <Button asChild variant="secondary" leadingIcon={<ExternalLink aria-hidden />}>
              <a href={`/products/${saved.slug}`} target="_blank" rel="noopener noreferrer">
                View on storefront<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </Button>
          )
        }
      />

      <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4" aria-label={isNew ? "New product" : `Edit ${saved.name}`}>
        {errorList.length > 1 && (
          <Alert tone="danger" title={`${errorList.length} fields need attention`}>
            Fix the highlighted fields, then save again.
          </Alert>
        )}

        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="flex min-w-0 flex-col gap-4">
            {/* ------------------------------------------------ Media */}
            <EditorSection
              title="Media"
              description="The first image is the cover in listings. Square photos at 1200 px or more look sharpest."
              action={<span className="text-caption text-fg-muted figures">{draft.images.length} / {MAX_IMAGES}</span>}
            >
              {draft.images.length > 0 ? (
                <ul aria-label="Product images" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {draft.images.map((img, i) => (
                    <li key={img.id} className="flex flex-col gap-2">
                      <div className="relative">
                        <ProductImage src={img.src} alt={`${draft.name || "Product"} image ${i + 1}`} sizes="(min-width: 640px) 160px, 45vw" preload={i === 0} unoptimized={img.src.startsWith("blob:")} wrapperClassName="aspect-square rounded-lg shadow-flat" />
                        {i === 0 && (
                          <Badge tone="inverse" size="sm" className="absolute top-2 left-2">
                            Cover
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <IconButton label={`Move image ${i + 1} earlier`} variant="ghost" size="xs" disabled={i === 0} onClick={() => moveImage(i, i - 1)}>
                          <ArrowLeft aria-hidden />
                        </IconButton>
                        <IconButton label={`Move image ${i + 1} later`} variant="ghost" size="xs" disabled={i === draft.images.length - 1} onClick={() => moveImage(i, i + 1)}>
                          <ArrowRight aria-hidden />
                        </IconButton>
                        <IconButton label={`Remove image ${i + 1}`} variant="ghost" size="xs" onClick={() => set("images", draft.images.filter((x) => x.id !== img.id))}>
                          <Trash2 aria-hidden />
                        </IconButton>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <Inset size="sm" className="text-caption text-fg-muted">
                  No images yet. Listings with three or more photos, including one on a plain background, get more clicks.
                </Inset>
              )}
              <FileUpload
                id={fid("images")}
                accept="image/jpeg,image/png,image/webp"
                maxFiles={MAX_IMAGES}
                value={[]}
                onValueChange={addImages}
                disabled={draft.images.length >= MAX_IMAGES}
                title={draft.images.length >= MAX_IMAGES ? `All ${MAX_IMAGES} image slots used` : undefined}
              />
              {errors.images && (
                <p role="alert" className="text-caption text-danger-fg">
                  {errors.images}
                </p>
              )}
            </EditorSection>

            {/* ------------------------------------------------ Details */}
            <EditorSection title="Details">
              <Field id={fid("name")} label="Product name" required error={errors.name}>
                <Input value={draft.name} maxLength={120} onChange={(e) => set("name", e.target.value)} placeholder="Aura Wireless Headphones" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id={fid("brand")} label="Brand" hint="Leave empty for unbranded products">
                  <Combobox options={brandNames.map((b) => ({ value: b, label: b }))} value={draft.brand} onValueChange={(v) => set("brand", v)} placeholder="Choose a brand" searchPlaceholder="Search brands" />
                </Field>
                <Field id={fid("category")} label="Category" required error={errors.category}>
                  <Select options={categoryNames.map((c) => ({ value: c, label: c }))} value={draft.category} onValueChange={(v) => set("category", v)} placeholder="Choose a category" />
                </Field>
              </div>
              <Field id={fid("description")} label="Description" error={errors.description} labelAction={counter(draft.description.length, LIMITS.description)}>
                <Textarea rows={5} value={draft.description} onChange={(e) => set("description", e.target.value)} placeholder="What it is, what it’s made of, and who it’s for." />
              </Field>
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-2 flex w-full items-baseline justify-between gap-2">
                  <span className="text-label">Highlights</span>
                  <span className="text-caption text-fg-muted">Short points under the price · up to {MAX_HIGHLIGHTS}</span>
                </legend>
                <ul className="flex flex-col gap-2">
                  {draft.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Input size="sm" aria-label={`Highlight ${i + 1}`} value={h} maxLength={60} placeholder="40-hour battery" onChange={(e) => set("highlights", draft.highlights.map((x, j) => (j === i ? e.target.value : x)))} />
                      <IconButton label={`Remove highlight ${i + 1}`} variant="ghost" size="sm" disabled={draft.highlights.length === 1} onClick={() => set("highlights", draft.highlights.filter((_, j) => j !== i))}>
                        <X aria-hidden />
                      </IconButton>
                    </li>
                  ))}
                </ul>
                <div>
                  <Button variant="ghost" size="sm" leadingIcon={<Plus aria-hidden />} disabled={draft.highlights.length >= MAX_HIGHLIGHTS} onClick={() => set("highlights", [...draft.highlights, ""])}>
                    Add highlight
                  </Button>
                </div>
              </fieldset>
            </EditorSection>

            {/* ------------------------------------------------ Pricing & tax */}
            <EditorSection title="Pricing & tax" description="Prices include GST. Shoppers see the selling price with the MRP struck through.">
              <div className="grid gap-4 sm:grid-cols-3">
                <Field id={fid("mrp")} label="MRP" required error={errors.mrp}>
                  <Input inputMode="decimal" value={draft.mrp} onChange={(e) => set("mrp", e.target.value)} startSlot={<span className="text-fg-muted">₹</span>} className="figures" />
                </Field>
                <Field id={fid("price")} label="Selling price" required error={errors.price}>
                  <Input inputMode="decimal" value={draft.price} onChange={(e) => set("price", e.target.value)} startSlot={<span className="text-fg-muted">₹</span>} className="figures" />
                </Field>
                <Field id={fid("cost")} label="Cost per item" hint="Private, for margin" error={errors.cost}>
                  <Input inputMode="decimal" value={draft.cost} onChange={(e) => set("cost", e.target.value)} startSlot={<span className="text-fg-muted">₹</span>} className="figures" />
                </Field>
              </div>
              <Inset size="sm" asChild>
                <dl className="grid gap-3 sm:grid-cols-3" aria-live="polite">
                  <div>
                    <dt className="text-caption text-fg-muted">Discount</dt>
                    <dd className="text-body-strong figures">{pricesOk && price <= mrp ? (discount > 0 ? `${discount}% off MRP` : "No discount") : "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-caption text-fg-muted">GST in selling price</dt>
                    <dd className="text-body-strong figures">{Number.isNaN(gstInPrice) ? "—" : formatPrice(Math.round(gstInPrice))}</dd>
                  </div>
                  <div>
                    <dt className="text-caption text-fg-muted">Margin after GST</dt>
                    <dd className={cn("text-body-strong figures", margin < 0 && "text-danger-fg")}>
                      {Number.isNaN(margin) ? "Add a cost to see margin" : `${formatNumber(Math.round(margin * 100))}% · ${formatPrice(Math.round(netOfGst - cost))} a unit`}
                    </dd>
                  </div>
                </dl>
              </Inset>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id={fid("gst")} label="GST rate" required>
                  <Select
                    value={draft.gstRate}
                    onValueChange={(v) => set("gstRate", v as EditorDraft["gstRate"])}
                    options={[
                      { value: "5", label: "5%" },
                      { value: "12", label: "12%" },
                      { value: "18", label: "18%" },
                    ]}
                  />
                </Field>
                <Field id={fid("hsn")} label="HSN code" required hint="4, 6 or 8 digits, as on your purchase invoice" error={errors.hsn}>
                  <Input inputMode="numeric" maxLength={8} value={draft.hsn} onChange={(e) => set("hsn", e.target.value.replace(/\s/g, ""))} className="text-code" placeholder="8518" />
                </Field>
              </div>
            </EditorSection>

            {/* ------------------------------------------------ Variants & stock */}
            <EditorSection
              title="Variants & stock"
              description="One row per size or colour. Stock is units on hand in your warehouse."
              action={
                <span className="text-caption text-fg-muted figures" aria-live="polite">
                  {formatNumber(totalStock)} units in {draft.variants.length} {draft.variants.length === 1 ? "variant" : "variants"}
                </span>
              }
            >
              <div className="flex flex-col gap-3">
                <div aria-hidden className="hidden grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_6.5rem_2rem] gap-3 px-1 text-overline text-fg-muted sm:grid">
                  <span>Variant</span>
                  <span>SKU</span>
                  <span className="text-right">Stock</span>
                  <span />
                </div>
                <ul className="flex flex-col gap-3 max-sm:divide-y max-sm:divide-border-subtle" aria-label="Variants">
                  {draft.variants.map((v, i) => {
                    const cellsFor = (key: "label" | "sku" | "stock") => {
                      const id = fid(`variant-${v.id}-${key}`);
                      const err = errors[`variant-${v.id}-${key}`];
                      return { id, err, errId: `${id}-error`, input: { id, "aria-invalid": err ? (true as const) : undefined, "aria-describedby": err ? `${id}-error` : undefined } };
                    };
                    const label = cellsFor("label");
                    const sku = cellsFor("sku");
                    const stock = cellsFor("stock");
                    return (
                      <li key={v.id} className="grid grid-cols-[minmax(0,1fr)_6.5rem_2rem] items-start gap-x-3 gap-y-2 max-sm:pt-3 max-sm:first:pt-0 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_6.5rem_2rem]">
                        <div className="flex min-w-0 flex-col gap-1 max-sm:col-span-3">
                          <label htmlFor={label.id} className="text-caption text-fg-muted sm:sr-only">
                            Variant {i + 1} name
                          </label>
                          <Input size="sm" {...label.input} value={v.label} onChange={(e) => updateVariant(v.id, { label: e.target.value })} placeholder="M / Black" />
                          {label.err && <p id={label.errId} className="text-caption text-danger-fg">{label.err}</p>}
                        </div>
                        <div className="flex min-w-0 flex-col gap-1">
                          <label htmlFor={sku.id} className="text-caption text-fg-muted sm:sr-only">
                            Variant {i + 1} SKU
                          </label>
                          <Input size="sm" {...sku.input} value={v.sku} onChange={(e) => updateVariant(v.id, { sku: e.target.value.toUpperCase() })} className="text-code" placeholder="LM-APP-P9-M" />
                          {sku.err && <p id={sku.errId} className="text-caption text-danger-fg">{sku.err}</p>}
                        </div>
                        <div className="flex min-w-0 flex-col gap-1">
                          <label htmlFor={stock.id} className="text-caption text-fg-muted sm:sr-only">
                            Variant {i + 1} stock
                          </label>
                          <Input size="sm" inputMode="numeric" {...stock.input} value={v.stock} onChange={(e) => updateVariant(v.id, { stock: e.target.value })} className="text-right figures" />
                          {stock.err && <p id={stock.errId} className="text-caption text-danger-fg">{stock.err}</p>}
                        </div>
                        <IconButton
                          label={`Remove variant ${v.label || i + 1}`}
                          variant="ghost"
                          size="sm"
                          className="max-sm:mt-5"
                          disabled={draft.variants.length === 1}
                          onClick={() => set("variants", draft.variants.filter((x) => x.id !== v.id))}
                        >
                          <Trash2 aria-hidden />
                        </IconButton>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  leadingIcon={<Plus aria-hidden />}
                  onClick={() => {
                    const n = draft.variants.reduce((m, v) => Math.max(m, Number(v.id.replace(/\D/g, "")) || 0), 0) + 1;
                    set("variants", [...draft.variants, { id: `v-${n}`, label: "", sku: "", stock: "0" }]);
                  }}
                >
                  Add variant
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  leadingIcon={<Wand2 aria-hidden />}
                  disabled={!baseSku}
                  onClick={() => set("variants", draft.variants.map((v) => ({ ...v, sku: v.sku.trim() ? v.sku : `${baseSku}-${(v.label || "DEFAULT").replace(/[^a-z0-9]+/gi, "").toUpperCase()}` })))}
                >
                  Fill empty SKUs
                </Button>
              </div>
            </EditorSection>

            {/* ------------------------------------------------ Shipping */}
            <EditorSection title="Shipping & returns" description="Couriers bill the higher of packed weight and volumetric weight (L × W × H ÷ 5000).">
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4">
                <Field id={fid("weight")} label="Packed weight" required error={errors.weight} className="col-span-3 sm:col-span-1">
                  <Input inputMode="numeric" value={draft.weight} onChange={(e) => set("weight", e.target.value)} endSlot={<span className="text-fg-muted">g</span>} className="figures" />
                </Field>
                {(["length", "width", "height"] as const).map((k) => (
                  <Field key={k} id={fid(k)} label={k[0]!.toUpperCase() + k.slice(1)} error={errors[k]}>
                    <Input inputMode="decimal" value={draft[k]} onChange={(e) => set(k, e.target.value)} endSlot={<span className="text-fg-muted">cm</span>} className="figures" />
                  </Field>
                ))}
              </div>
              <p className="text-caption text-fg-muted figures" aria-live="polite">
                {chargeableKg > 0 ? `Chargeable weight ${formatNumber(chargeableKg, { maximumFractionDigits: 2 })} kg${!Number.isNaN(volumetricKg) && volumetricKg > num(draft.weight) / 1000 ? " (volumetric)" : ""}` : "Add weight and dimensions to see the chargeable weight."}
              </p>
              <div className="flex flex-col gap-4 border-t border-border-subtle pt-4 sm:flex-row sm:items-start sm:gap-6">
                <Switch className="flex-1" label="Accept returns" description="Customers can request a return or exchange from their orders page." checked={draft.returnable} onCheckedChange={(on) => set("returnable", on)} />
                <Field id={fid("returnWindow")} label="Return window" hint="After delivery" className="sm:w-44">
                  <Select
                    disabled={!draft.returnable}
                    value={draft.returnWindow}
                    onValueChange={(v) => set("returnWindow", v)}
                    options={["7", "10", "15", "30"].map((d) => ({ value: d, label: `${d} days` }))}
                  />
                </Field>
              </div>
            </EditorSection>

            {/* ------------------------------------------------ SEO */}
            <EditorSection title="Search engine listing" description="How this product appears in Google results and link previews.">
              <Field id={fid("seoTitle")} label="Page title" error={errors.seoTitle} labelAction={counter(draft.seoTitle.length, LIMITS.seoTitle)}>
                <Input value={draft.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} placeholder={draft.name ? `${draft.name} | BlueSigns` : "Product name | BlueSigns"} />
              </Field>
              <Field
                id={fid("slug")}
                label="URL handle"
                required
                error={errors.slug}
                hint={`bluesigns.shop/products/${draft.slug || "…"}`}
                labelAction={
                  <TextButton size="sm" disabled={!draft.name.trim()} onClick={() => set("slug", slugify(draft.name))}>
                    Use product name
                  </TextButton>
                }
              >
                <Input value={draft.slug} onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))} className="text-code" startSlot={<span className="text-caption text-fg-muted">/products/</span>} />
              </Field>
              <Field id={fid("metaDescription")} label="Meta description" error={errors.metaDescription} labelAction={counter(draft.metaDescription.length, LIMITS.metaDescription)}>
                <Textarea rows={3} value={draft.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} placeholder="One or two sentences that make someone click." />
              </Field>
              <Inset size="md" className="flex flex-col gap-0.5" aria-label="Search result preview">
                <p className="text-caption text-fg-muted">Preview</p>
                <p className="truncate text-body-lg text-accent-fg">{draft.seoTitle || draft.name || "Page title"}</p>
                <p className="truncate text-caption text-success-fg">bluesigns.shop › products › {draft.slug || "…"}</p>
                <p className="line-clamp-2 text-caption text-fg-muted">{draft.metaDescription || draft.description || "Add a meta description to control this snippet."}</p>
              </Inset>
            </EditorSection>
          </div>

          {/* ------------------------------------------------ Side column */}
          <div className="flex min-w-0 flex-col gap-4">
            <EditorSection title="Status">
              <RadioCardGroup aria-label="Product status" value={draft.status} onValueChange={(v) => set("status", v as EditorDraft["status"])} className="gap-2">
                <RadioCard size="sm" value="active" title="Active" description="Listed on the storefront and in search" />
                <RadioCard size="sm" value="draft" title="Draft" description="Only staff can see it" />
                {initial.status === "archived" && <RadioCard size="sm" value="archived" title="Archived" description="Hidden everywhere, order history kept" />}
              </RadioCardGroup>
            </EditorSection>

            <EditorSection title="Organisation">
              <Field id={fid("collections")} label="Collections" hint="Where the product shows up in merchandising">
                <Combobox multiple options={collectionOptions.map((c) => ({ value: c, label: c }))} value={draft.collections} onValueChange={(v) => set("collections", v)} placeholder="Add to collections" searchPlaceholder="Search collections" />
              </Field>
              <Field id={fid("tags")} label="Search tags" hint="Comma-separated, e.g. wireless, gifting">
                <Input value={draft.tags} onChange={(e) => set("tags", e.target.value)} />
              </Field>
            </EditorSection>

            <Card padding="md" className="gap-4">
              <h2 className="text-title">Storefront preview</h2>
              <div className="flex gap-3">
                {cover ? (
                  // Same src as the preloaded cover above, so eager costs no extra request —
                  // and leaving it lazy makes it the measured LCP element.
                  <ProductImage src={cover.src} alt="" sizes="72px" loading="eager" unoptimized={cover.src.startsWith("blob:")} wrapperClassName="size-18 shrink-0 rounded-md" />
                ) : (
                  <span aria-hidden className="size-18 shrink-0 rounded-md bg-surface-sunken" />
                )}
                <div className="flex min-w-0 flex-col gap-0.5">
                  <p className="line-clamp-2 text-body-strong">{draft.name || "Product name"}</p>
                  {draft.brand && <p className="text-caption text-fg-muted">{draft.brand}</p>}
                  <p className="flex flex-wrap items-baseline gap-x-1.5 text-body figures">
                    {price > 0 ? formatPrice(price) : "₹—"}
                    {pricesOk && mrp > price && <span className="text-caption text-fg-muted line-through">{formatPrice(mrp)}</span>}
                    {discount > 0 && <span className="text-caption text-success-fg">{discount}% off</span>}
                  </p>
                </div>
              </div>
              {saved.slug ? (
                <p className="text-caption text-fg-muted">
                  {dirty ? "The storefront shows the last saved version. " : ""}
                  <TextLink href={`/products/${saved.slug}`} external size="sm">
                    Open product page
                  </TextLink>
                </p>
              ) : (
                <p className="text-caption text-fg-muted">Save the product to get a storefront link.</p>
              )}
              {!isNew && (
                <DescriptionList
                  size="sm"
                  items={[
                    { term: "Units sold, 30 days", description: <span className="figures">{formatNumber(meta.sold30d)}</span> },
                    { term: "Stock on hand", description: <span className="figures">{formatNumber(totalStock)}</span> },
                  ]}
                />
              )}
            </Card>
          </div>
        </div>

        <FormActionsBar dirty={dirty} saving={saving} onDiscard={() => { discard(); setAttempted(false); }} saveLabel={isNew ? "Create product" : "Save product"} />
      </form>
    </>
  );
}

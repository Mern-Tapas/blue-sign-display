import { useState } from "react";
import { Field, Input, SlugInput } from "@bluesigns/ui";

export const ProductHandle = () => {
  const [name, setName] = useState("Premium Running Shoes");
  const [slug, setSlug] = useState("");
  return (
    <div className="flex flex-col gap-4" style={{ maxWidth: 520 }}>
      <Field label="Product name">
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label="Handle">
        <SlugInput value={slug} onValueChange={setSlug} source={name} sourceLabel="product name" prefix="bluesigns.shop/products/" />
      </Field>
    </div>
  );
};

export const CustomisedSlug = () => {
  const [slug, setSlug] = useState("diwali-sale-2026");
  return (
    <div style={{ maxWidth: 520 }}>
      <Field label="Collection handle">
        <SlugInput value={slug} onValueChange={setSlug} source="Festive Offers on Home Decor" sourceLabel="collection title" prefix="bluesigns.shop/c/" autoSync={false} />
      </Field>
    </div>
  );
};

export const Invalid = () => {
  const [slug, setSlug] = useState("court-low-sneaker");
  return (
    <div style={{ maxWidth: 520 }}>
      <Field label="Handle" error="Another product already uses this handle">
        <SlugInput value={slug} onValueChange={setSlug} source="Court Low Sneaker" prefix="bluesigns.shop/products/" />
      </Field>
    </div>
  );
};

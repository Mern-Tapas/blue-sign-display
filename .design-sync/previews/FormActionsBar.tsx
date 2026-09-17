import { useState } from "react";
import { Field, FormActionsBar, Input } from "@bluesigns/ui";

const StoreForm = ({ saving = false }: { saving?: boolean }) => {
  const [name, setName] = useState("BlueSigns Bengaluru");
  return (
    <form className="flex flex-col gap-4" style={{ width: 520 }} onSubmit={(e) => e.preventDefault()}>
      <Field label="Store name">
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label="Support email">
        <Input type="email" defaultValue="support@bluesigns.shop" />
      </Field>
      <FormActionsBar dirty saving={saving} onDiscard={() => setName("BlueSigns")} />
    </form>
  );
};

export const UnsavedChanges = () => <StoreForm />;

export const Saving = () => <StoreForm saving />;

export const CustomLabel = () => (
  <form style={{ width: 520 }} onSubmit={(e) => e.preventDefault()}>
    <FormActionsBar dirty onDiscard={() => {}} saveLabel="Publish product" />
  </form>
);

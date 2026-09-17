import { Field, Input, Textarea, TextButton, icons } from "@bluesigns/ui";

const { Mail, Lock } = icons;

export const WithHint = () => (
  <div style={{ maxWidth: 360 }}>
    <Field label="Email" hint="We’ll send your receipt here." required>
      <Input type="email" placeholder="you@example.com" startSlot={<Mail aria-hidden />} />
    </Field>
  </div>
);

export const WithError = () => (
  <div style={{ maxWidth: 360 }}>
    <Field label="GSTIN" hint="15 characters" error="Check the state code and the Z in the 14th place.">
      <Input defaultValue="29AAECL48" />
    </Field>
  </div>
);

export const LabelAction = () => (
  <div style={{ maxWidth: 360 }}>
    <Field label="Password" labelAction={<TextButton size="sm">Forgot?</TextButton>}>
      <Input type="password" defaultValue="bengaluru2026" startSlot={<Lock aria-hidden />} />
    </Field>
  </div>
);

export const Counter = () => (
  <div className="flex flex-col gap-5" style={{ maxWidth: 360 }}>
    <Field label="Meta description" counter={{ value: 52, max: 160 }}>
      <Textarea rows={2} defaultValue="Lightweight everyday sneakers with a cushioned sole." />
    </Field>
    <Field label="Meta description" counter={{ value: 172, max: 160 }}>
      <Textarea
        autosize
        minRows={2}
        defaultValue="Lightweight everyday sneakers with a cushioned sole and a breathable knit upper for long days on your feet around Bengaluru and beyond, in every season."
      />
    </Field>
  </div>
);

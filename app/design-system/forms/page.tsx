import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { ChoicesDemo, CommerceInputsDemo, TextInputsDemo } from "@/components/docs/demos/forms-demo";
import { OtpDemo, OtpStatesDemo, PasswordDemo, PhoneDemo } from "@/components/docs/demos/auth-inputs-demo";
import { ChipDemo, ComboboxDemo, RatingInputDemo } from "@/components/docs/demos/selection-demo";
import { AsyncComboboxDemo, AutosizeDemo, ClearableInputDemo, MaskDemo, NumberInputDemo, TagInputDemo, TagInputStates } from "@/components/docs/demos/input-layer-demo";
import { CalendarDemo, FileUploadDemo } from "@/components/docs/demos/date-upload-demo";
import { DsGrid, DsPageHeader, DsPreview, DsProps, DsSection, DsStates } from "@/components/docs/ds-section";
import { Field, FieldGroup } from "@/components/ui/field";
import { FormRow } from "@/components/ui/form-row";
import { FormSection } from "@/components/ui/form-section";
import { Radio, RadioGroup } from "@/components/ui/radio-group";
import { RatingInput } from "@/components/ui/rating-input";
import { Textarea } from "@/components/ui/textarea";
import { NumberInput } from "@/components/ui/number-input";
import { MoneyInput } from "@/components/ui/money-input";
import { Checkbox } from "@/components/ui/checkbox";
import { Chip } from "@/components/ui/chip";
import { RadioCard, RadioCardGroup } from "@/components/ui/radio-card";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export const metadata: Metadata = { title: "Forms" };

export default function FormsPage() {
  return (
    <>
      <DsPageHeader
        title="Forms &"
        muted="inputs"
        description="Wrap any control in <Field> and the label, hint, error and aria attributes are wired automatically. Fields share the button height scale; focus draws a solid 2px ring inside the field and invalid fields switch that ring to red."
      />

      <DsSection title="Text inputs">
        <TextInputsDemo />
      </DsSection>

      <DsSection title="Field states" description="The same shell drives Input, Select and SearchBar, so every text-like control changes state identically.">
        <DsStates
          states={[
            { label: "Default", node: <Input aria-label="Default" placeholder="you@example.com" startSlot={<Mail aria-hidden />} /> },
            {
              label: "Hover",
              node: <Input aria-label="Hover" placeholder="you@example.com" startSlot={<Mail aria-hidden />} wrapperClassName="border-border-strong" />,
              note: "border-strong",
            },
            {
              label: "Focus",
              node: (
                <Input
                  aria-label="Focus"
                  placeholder="you@example.com"
                  startSlot={<Mail aria-hidden />}
                  wrapperClassName="outline-2 -outline-offset-1 outline-focus-ring"
                />
              ),
              note: "inset 2px ring",
            },
            { label: "Filled", node: <Input aria-label="Filled" defaultValue="maria@bluesigns.shop" startSlot={<Mail aria-hidden />} /> },
            {
              label: "Invalid",
              node: <Input aria-label="Invalid" aria-invalid defaultValue="maria@" startSlot={<Mail aria-hidden />} />,
              note: "danger border; focus ring turns red",
            },
            { label: "Disabled", node: <Input aria-label="Disabled" disabled placeholder="Unavailable" startSlot={<Mail aria-hidden />} />, note: "neutral fill" },
            {
              label: "Choice controls",
              node: (
                <div className="flex flex-col gap-2">
                  <Checkbox label="Checked" defaultChecked />
                  <Checkbox label="Disabled" disabled />
                </div>
              ),
            },
            { label: "Switch", node: <Switch aria-label="Notifications" defaultChecked /> },
          ]}
        />
      </DsSection>

      <DsSection
        title="Errors & counters"
        description="An error replaces the hint, marks the control aria-invalid, and is announced as it appears (role=alert). A counter sits on the label row and only interrupts once the limit is passed."
      >
        <DsStates
          states={[
            { label: "Hint", node: <Field label="GSTIN" hint="15 characters" className="w-56"><Input aria-label="GSTIN" defaultValue="29AAECL4821K1Z6" /></Field>, note: "described by the hint" },
            { label: "Error", node: <Field label="GSTIN" hint="15 characters" error="Check the state code and the Z in the 14th place." className="w-56"><Input aria-label="GSTIN" defaultValue="29AAECL48" /></Field>, note: "role=alert · hint id dropped" },
            { label: "Required", node: <Field label="Product name" required className="w-56"><Input aria-label="Product name" placeholder="Everyday Sneaker" /></Field>, note: "aria-required" },
            { label: "Counter", node: <Field label="Meta description" counter={{ value: 118, max: 160 }} className="w-56"><Textarea aria-label="Meta description" rows={2} defaultValue="Lightweight everyday sneakers with a cushioned sole." /></Field> },
            { label: "Counter · over", node: <Field label="Meta description" counter={{ value: 172, max: 160 }} className="w-56"><Textarea aria-label="Meta description" rows={2} defaultValue="Lightweight everyday sneakers with a cushioned sole and a breathable knit upper for long days." /></Field>, note: "danger + announced once" },
            { label: "Select · empty", node: <Select aria-label="Sub-category" placeholder="Pick a category first" options={[]} emptyText="Choose a category first" className="w-48" />, note: "says why it's empty" },
          ]}
        />
      </DsSection>

      <DsSection
        title="Grouped choices"
        description="One <label for> can only point at one control, so a set of choices gets a fieldset and a legend. The error lands on the group once; each option only inherits the state it has to paint."
      >
        <DsGrid cols={2}>
          <DsPreview label="FieldGroup · radios" className="block">
            <FieldGroup legend="Product type" hint="Changes which fields appear below.">
              <RadioGroup defaultValue="simple">
                <Radio value="simple" label="Simple" description="One price, one SKU" />
                <Radio value="variable" label="With variants" description="Size or colour options" />
              </RadioGroup>
            </FieldGroup>
          </DsPreview>
          <DsPreview label="FieldGroup · invalid" className="block">
            <FieldGroup legend="Product type" error="Choose how this product is sold." required>
              <RadioGroup>
                <Radio value="simple" label="Simple" description="One price, one SKU" />
                <Radio value="variable" label="With variants" description="Size or colour options" />
              </RadioGroup>
            </FieldGroup>
          </DsPreview>
        </DsGrid>
      </DsSection>

      <DsSection
        title="Invalid, on every control"
        description="A Field error used to print a message while checkboxes, radios, switches and stars stayed neutral. Each one now paints the state it is in."
      >
        <DsStates
          states={[
            { label: "Checkbox", node: <Checkbox label="I agree" aria-invalid /> , note: "danger border" },
            { label: "Radio", node: <RadioGroup><Radio value="a" label="Standard" aria-invalid /></RadioGroup>, note: "danger border" },
            { label: "Switch", node: <Switch label="COD" aria-invalid className="w-40" />, note: "danger ring outside the track" },
            { label: "Rating", node: <RatingInput aria-label="Rating" aria-invalid />, note: "empty stars turn danger" },
            { label: "Radio card", node: <RadioCardGroup aria-label="Payment" className="w-52"><RadioCard value="upi" size="sm" title="UPI" description="GPay, PhonePe" aria-invalid /></RadioCardGroup> },
            { label: "Input", node: <Input aria-label="Price" aria-invalid defaultValue="-99" />, note: "ring switches to danger" },
          ]}
        />
      </DsSection>

      <DsSection
        title="Sections & rows"
        description="FormSection is the one titled group: a card for editors, a split row for settings. Both are labelled landmarks. FormRow puts fields side by side from sm and is hook-free, so a server component can lay out the form and hydrate only the controls."
      >
        <div className="flex flex-col gap-5">
          <DsPreview label='FormSection layout="card"' className="block">
            <FormSection title="Pricing" description="Prices include GST.">
              <FormRow columns={2}>
                <Field label="MRP"><Input aria-label="MRP" defaultValue="4999" /></Field>
                <Field label="Selling price"><Input aria-label="Selling price" defaultValue="3999" /></Field>
              </FormRow>
            </FormSection>
          </DsPreview>
          <DsPreview label='FormSection layout="split"' className="block">
            <FormSection title="Shipping" description="Orders at or above the threshold ship free." layout="split" divided={false}>
              <Field label="Free delivery above"><Input aria-label="Free delivery above" defaultValue="499" /></Field>
            </FormSection>
          </DsPreview>
        </div>
      </DsSection>

      <DsSection
        title="Numbers & money"
        description="A number is typed as text, so a half-typed value is never fought over — clamping waits for blur. It only claims to be a spinbutton when it has the buttons to back it up. MoneyInput adds the currency symbol and the decimals, so “rupees or paise” is answered once."
      >
        <DsPreview label="NumberInput · MoneyInput" className="block">
          <div className="w-full max-w-2xl">
            <NumberInputDemo />
          </div>
        </DsPreview>
        <DsStates
          states={[
            { label: "Default", node: <NumberInput aria-label="Quantity" defaultValue={4} className="w-24" /> },
            { label: "Stepper", node: <NumberInput aria-label="Quantity" defaultValue={4} stepper="inline" wrapperClassName="w-36" />, note: "role=spinbutton" },
            { label: "At minimum", node: <NumberInput aria-label="Quantity" defaultValue={0} min={0} stepper="inline" wrapperClassName="w-36" />, note: "− disabled" },
            { label: "Suffix", node: <NumberInput aria-label="GST" defaultValue={18} suffix="%" max={100} className="w-20" />, note: "no PercentInput needed" },
            { label: "Money", node: <MoneyInput aria-label="Price" defaultValue={1499} wrapperClassName="w-36" />, note: "symbol from Intl" },
            { label: "Money · whole", node: <MoneyInput aria-label="Fee" defaultValue={49} wholeUnits wrapperClassName="w-32" />, note: "no paise" },
            { label: "Invalid", node: <NumberInput aria-label="Weight" defaultValue={-2} aria-invalid wrapperClassName="w-28" /> },
            { label: "Disabled", node: <NumberInput aria-label="Quantity" defaultValue={4} disabled stepper="inline" wrapperClassName="w-36" /> },
          ]}
        />
      </DsSection>

      <DsSection
        title="Clearing, checking & masks"
        description="A clear button appears only when there is something to clear. The checking and valid states are a surface for an availability check — the debounce, the request and the race are the application's. Read-only stays readable and focusable, unlike disabled."
      >
        <DsPreview label="Input · clearable, status, read-only" className="block">
          <div className="w-full max-w-2xl">
            <ClearableInputDemo />
          </div>
        </DsPreview>
        <DsPreview label="useMask · append-only" className="block">
          <div className="w-full max-w-sm">
            <MaskDemo />
          </div>
        </DsPreview>
      </DsSection>

      <DsSection
        title="Tags & async search"
        description="TagInput turns free text into chips: Enter or a comma commits, Backspace removes the last, and pasting a comma-separated list does the obvious thing. Combobox gained an async mode and an “add new” row, so a catalog search no longer needs a second component."
      >
        <DsGrid cols={2}>
          <DsPreview label="TagInput" className="block">
            <TagInputDemo />
          </DsPreview>
          <DsPreview label="Combobox · loading + creatable" className="block">
            <AsyncComboboxDemo />
          </DsPreview>
        </DsGrid>
        <TagInputStates />
      </DsSection>

      <DsSection
        title="Autosize"
        description="A textarea that grows with its content up to a limit, then scrolls. It measures in a layout effect and re-measures on resize, so the first paint is already the right height and a late-loading font doesn't leave it one line short."
      >
        <DsPreview label="Textarea autosize" className="block">
          <div className="w-full max-w-xl">
            <AutosizeDemo />
          </div>
        </DsPreview>
      </DsSection>

      <DsSection title="Choice states" description="Triggers share the field shell, so Select, Combobox and DatePicker show disabled and invalid exactly like Input. Selected cards and chips use one language: soft accent fill plus a 2px accent ring.">
        <DsStates
          states={[
            { label: "Select", node: <Select aria-label="Address type" placeholder="Select a type" options={[{ value: "home", label: "Home" }]} className="w-44" /> },
            { label: "Select · invalid", node: <Select aria-label="Address type" aria-invalid placeholder="Select a type" options={[{ value: "home", label: "Home" }]} className="w-44" />, note: "danger border" },
            { label: "Select · disabled", node: <Select aria-label="Address type" disabled placeholder="Unavailable" options={[{ value: "home", label: "Home" }]} className="w-44" />, note: "neutral fill" },
            {
              label: "Radio card · selected",
              node: (
                <RadioCardGroup defaultValue="upi" aria-label="Payment" className="w-52">
                  <RadioCard value="upi" size="sm" title="UPI" description="GPay, PhonePe" />
                </RadioCardGroup>
              ),
              note: "selected: soft + 2px ring",
            },
            {
              label: "Radio card · disabled",
              node: (
                <RadioCardGroup aria-label="Payment" className="w-52">
                  <RadioCard value="cod" size="sm" title="Cash on Delivery" description="Not for this PIN" disabled />
                </RadioCardGroup>
              ),
            },
            { label: "Chip · selected", node: <Chip selected>Under ₹999</Chip>, note: "same selected language" },
            { label: "Chip · xs", node: <Chip size="xs" variant="sunken">4★ & above</Chip>, note: "dense review / Q&A filters" },
            { label: "Switch · disabled", node: <Switch label="WhatsApp updates" disabled className="w-48" />, note: "label dims too" },
          ]}
        />
      </DsSection>

      <DsSection title="Choices">
        <ChoicesDemo />
      </DsSection>

      <DsSection title="Commerce inputs">
        <CommerceInputsDemo />
      </DsSection>

      <DsSection
        title="Searchable select"
        description="Combobox for long lists — states, banks, brands. Type to filter; arrow keys, Home / End and Enter pick; popular values can be pinned above the full list."
      >
        <ComboboxDemo />
      </DsSection>

      <DsSection title="Chips" description="Toggle chips for quick filters and sizes (aria-pressed / ToggleGroup with arrow-key focus) and removable chips for applied values.">
        <ChipDemo />
      </DsSection>

      <DsSection title="Rating input" description="Native radios under the stars: one tab stop, arrow keys change the score, and a word label backs up the colour.">
        <RatingInputDemo />
      </DsSection>

      <DsSection
        title="Dates"
        description="Calendar is a keyboard date grid with min / max, disabled days and optional per-day notes. DatePicker puts it in a popover behind a field trigger; the dropdown caption suits dates of birth."
      >
        <CalendarDemo />
      </DsSection>

      <DsSection title="File upload" description="The visible zone is the label of a real file input, so it stays keyboard- and screen-reader-operable. Type, size and count limits explain themselves when a file is rejected.">
        <FileUploadDemo />
      </DsSection>

      <DsSection
        title="Sign-in inputs"
        description="Password with show / hide and strength, +91 mobile number and one-time codes. The OTP field is one real input under presentational cells, so SMS autofill, paste and backspace work natively."
      >
        <div className="flex flex-col gap-5">
          <DsGrid>
            <PasswordDemo />
            <PhoneDemo />
          </DsGrid>
          <OtpDemo />
          <OtpStatesDemo />
        </div>
      </DsSection>

      <DsSection title="Props">
        <div className="flex flex-col gap-5">
          <DsProps
            component="Field · FieldGroup"
            rows={[
              { name: "label · hint · error", type: "ReactNode", description: "Error replaces the hint, marks the control invalid and is announced (role=alert)." },
              { name: "counter", type: "{ value, max }", description: "Character count on the label row; turns danger and announces once over the limit." },
              { name: "announce", type: '"alert" | "off"', default: '"alert"', description: 'Set "off" when a FormErrorSummary announces the whole list on submit.' },
              { name: "labelAction", type: "ReactNode", description: "Right of the label, e.g. a “Forgot?” link." },
              { name: "legend", type: "ReactNode", description: "FieldGroup only: renders a fieldset + legend for a set of controls." },
            ]}
          />
          <DsProps
            component="FormSection · FormRow"
            rows={[
              { name: "title · description · action", type: "string · ReactNode · ReactNode", description: "Heading, prose and a right-aligned slot. Labels the section landmark." },
              { name: "layout", type: '"card" | "split"', default: '"card"', description: "Card for editors; split puts the prose left of the fields from 1024px." },
              { name: "divided", type: "boolean", default: "true", description: "split only: the hairline under each section in a stack." },
              { name: "columns", type: "1 | 2 | 3 | 4", default: "2", description: "FormRow: columns from sm; always one on phones." },
              { name: "align", type: '"start" | "end"', default: '"start"', description: "FormRow: end lines a field up with a button beside it." },
            ]}
          />
          <DsProps
            component="Combobox"
            rows={[
              { name: "options", type: "ComboboxOption[]", description: "label, value, description, icon, disabled, keywords (matched but hidden)." },
              { name: "multiple", type: "boolean", default: "false", description: "Multi-select with checkboxes, a count badge and a Done footer." },
              { name: "value · onValueChange", type: "string | null · string[]", description: "Controlled or uncontrolled via defaultValue." },
              { name: "popularValues · popularLabel", type: "string[] · string", description: "Pinned group shown while the search is empty." },
              { name: "maxDisplay", type: "number", default: "2", description: "Multiple: labels listed in the trigger before “+N”." },
              { name: "name", type: "string", description: "Adds a hidden input (comma-joined values) for native forms." },
            ]}
          />
          <DsProps
            component="Chip · ChipGroup"
            rows={[
              { name: "selected", type: "boolean", description: "Chip: toggle state (aria-pressed)." },
              { name: "onRemove · removeLabel", type: "() => void · string", description: "Chip: removable variant with its own button." },
              { name: "type", type: '"single" | "multiple"', default: '"multiple"', description: "ChipGroup: selection mode (Radix ToggleGroup)." },
              { name: "options", type: "ChipOption[]", description: "ChipGroup: value, label, icon, count, disabled." },
              { name: "scroll", type: "boolean", default: "false", description: "ChipGroup: single-line horizontal rail." },
              { name: "variant · size", type: '"outline" | "sunken" · "sm" | "md"', default: '"outline" · "sm"', description: "32 or 40 px." },
            ]}
          />
          <DsProps
            component="RatingInput"
            rows={[
              { name: "value · onValueChange", type: "number · (n) => void", description: "0 means unrated." },
              { name: "labels", type: "string[]", default: "Terrible … Loved it", description: "Word per score; used in the visible label and each radio’s name." },
              { name: "size", type: '"md" | "lg" | "xl"', default: '"lg"', description: "28 / 36 / 44 px stars." },
              { name: "showLabel · disabled · required", type: "boolean", description: "Label word, disabled look, required radio group." },
            ]}
          />
          <DsProps
            component="Calendar · DatePicker"
            rows={[
              { name: "value · onValueChange", type: "Date | null · (d: Date) => void", description: "Local calendar date (no time-zone shift)." },
              { name: "min · max · isDateDisabled", type: "Date · Date · (d) => boolean", description: "Out-of-range and disabled days stay focusable but can’t be picked." },
              { name: "defaultMonth", type: "Date", description: "First month shown; pass it for server-rendered calendars." },
              { name: "weekStartsOn", type: "0 | 1", default: "0", description: "Sunday or Monday." },
              { name: "captionLayout · fromYear · toYear", type: '"label" | "dropdown"', default: '"label"', description: "Month / year selects for far-away dates." },
              { name: "renderDayNote", type: "(d: Date) => ReactNode", description: "Calendar: small note under the date, e.g. a delivery fee." },
              { name: "format · clearable · name", type: "Intl options · boolean · string", description: "DatePicker: trigger text, clear button, hidden ISO input." },
            ]}
          />
          <DsProps
            component="FileUpload"
            rows={[
              { name: "accept · maxSize · maxFiles", type: "string · bytes · number", default: "— · 5 MB · 5", description: "Rejections are listed in an alert with the reason." },
              { name: "multiple", type: "boolean", default: "true", description: "Single mode replaces the file." },
              { name: "value · onValueChange", type: "UploadItem[]", description: "{ id, file, url } — url is an object URL for image previews." },
              { name: "variant · layout", type: '"dropzone" | "button" · "grid" | "list"', default: '"dropzone" · "grid"', description: "Big drop area or compact button; thumbnails or file rows." },
              { name: "title · description", type: "ReactNode", description: "Override the zone text and the limits hint." },
            ]}
          />
          <DsProps
            component="PasswordInput"
            rows={[
              { name: "autoComplete", type: "string", default: '"current-password"', description: "Use \"new-password\" on sign-up and reset so managers can generate one." },
              { name: "visible · onVisibleChange", type: "boolean · (v) => void", description: "Controlled visibility (toggle is aria-pressed)." },
              { name: "showIcon", type: "boolean", default: "true", description: "Lock icon at the start." },
              { name: "…Input props", type: "InputProps", description: "variant, size, shape, Field wiring." },
            ]}
          />
          <DsProps
            component="PasswordStrengthMeter"
            rows={[
              { name: "password", type: "string", description: "Value to score (0–4 via scorePassword)." },
              { name: "rules", type: "PasswordRule[]", default: "defaultPasswordRules", description: "Checklist rules; each has a label and a test." },
              { name: "showRules", type: "boolean", default: "true", description: "Show the checklist under the bar." },
            ]}
          />
          <DsProps
            component="PhoneInput"
            rows={[
              { name: "value · defaultValue", type: "string", description: "Bare 10-digit national number." },
              { name: "onValueChange", type: "(digits: string) => void", description: "Receives digits only; pasted +91 / 0 prefixes are dropped." },
              { name: "countryCode", type: "string", default: '"+91"', description: "Fixed prefix label." },
            ]}
          />
          <DsProps
            component="OtpInput"
            rows={[
              { name: "length", type: "number", default: "6", description: "Number of cells." },
              { name: "value · onValueChange", type: "string · (code) => void", description: "Controlled or uncontrolled." },
              { name: "onComplete", type: "(code: string) => void", description: "Fires when every cell is filled." },
              { name: "status", type: '"default" | "error" | "success"', default: '"default"', description: "Error also sets aria-invalid." },
              { name: "size", type: '"md" | "lg"', default: '"lg"', description: "40 px or 48–52 px cells." },
            ]}
          />
          <DsProps
            component="ResendTimer"
            rows={[
              { name: "seconds", type: "number", default: "30", description: "Cooldown before resend unlocks." },
              { name: "onResend", type: "() => void | Promise<void>", description: "Async resend; the countdown restarts after it resolves." },
              { name: "attemptsLeft · exhaustedText", type: "number · ReactNode", description: "Locks the action at 0 attempts." },
            ]}
          />
          <DsProps
            component="Field"
            rows={[
              { name: "label", type: "ReactNode", description: "Visible label, linked to the control via htmlFor/id." },
              { name: "hint", type: "ReactNode", description: "Helper text announced through aria-describedby (hidden while an error shows)." },
              { name: "error", type: "ReactNode", description: "Error message; marks the control aria-invalid and turns its focus ring red." },
              { name: "required", type: "boolean", default: "false", description: "Adds the required marker and the required attribute on the control." },
              { name: "labelAction", type: "ReactNode", description: "Right-aligned element on the label row, e.g. “Forgot?”." },
            ]}
          />
          <DsProps
            component="Input"
            rows={[
              { name: "variant", type: '"surface" | "sunken"', default: '"surface"', description: "Surface on white cards; sunken inside toolbars and filters." },
              { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "32 / 40 / 48 px — matches Button sizes." },
              { name: "shape", type: '"pill" | "rounded"', default: '"pill"', description: "Rounded for dense data forms." },
              { name: "startSlot · endSlot", type: "ReactNode", description: "Icons or inline actions inside the field." },
              { name: "wrapperClassName", type: "string", description: "Classes for the outer shell (the element that draws border and focus)." },
            ]}
          />
          <DsProps
            component="Select"
            rows={[
              { name: "options · groups", type: "SelectOption[] · SelectGroup[]", description: "Flat or grouped options; each option may carry an icon or be disabled." },
              { name: "prefix", type: "ReactNode", description: "Inline label inside the trigger, e.g. “Sort:”." },
              { name: "placeholder", type: "string", default: '"Select…"', description: "Shown until a value is chosen." },
              { name: "variant · size · shape", type: "same as Input", description: "Trigger uses the shared field shell." },
            ]}
          />
        </div>
      </DsSection>
    </>
  );
}

import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight, Bell, Heart, Plus, Search, ShoppingBag, SlidersHorizontal, Trash2 } from "lucide-react";
import { CopyShareDemo } from "@/components/docs/demos/display-extras-demo";
import { DsGrid, DsPageHeader, DsPreview, DsProps, DsSection, DsStates } from "@/components/docs/ds-section";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { TextButton } from "@/components/ui/text-button";

export const metadata: Metadata = { title: "Buttons" };

export default function ButtonsPage() {
  return (
    <>
      <DsPageHeader
        title="Buttons &"
        muted="actions"
        description="Pill-shaped, on the shared control scale. Use one primary (blue) action per view; neutral for strong secondary actions, inverse on dark or blue panels."
      />

      <DsSection title="Variants">
        <DsPreview
          label="Variants"
          code={`<Button variant="primary">Add to cart</Button>`}
        >
          <Button leadingIcon={<ShoppingBag aria-hidden />}>Add to cart</Button>
          <Button variant="neutral">Buy now</Button>
          <Button variant="secondary">Save for later</Button>
          <Button variant="soft">Apply coupon</Button>
          <Button variant="ghost">Cancel</Button>
          <Button variant="danger" leadingIcon={<Trash2 aria-hidden />}>
            Remove
          </Button>
          <Button variant="link">View details</Button>
        </DsPreview>
      </DsSection>

      <DsSection
        title="States"
        description="Every button shares one state language: a currentColor layer for hover and pressed, a subtle press scale, one focus ring, a neutral disabled fill, and a loading state that keeps its color."
      >
        <DsStates
          states={[
            { label: "Default", node: <Button>Add to cart</Button> },
            { label: "Hover", node: <Button className="bg-accent-hover">Add to cart</Button>, note: "accent-hover" },
            { label: "Focus visible", node: <Button data-force-state="focus">Add to cart</Button>, note: "2px ring · 2px gap" },
            { label: "Pressed", node: <Button data-force-state="active">Add to cart</Button>, note: "scale 0.97" },
            { label: "Loading", node: <Button loading>Adding</Button>, note: "keeps color · aria-busy" },
            { label: "Disabled", node: <Button disabled>Add to cart</Button>, note: "neutral fill" },
            { label: "Secondary · hover", node: <Button variant="secondary" data-force-state="hover">Save for later</Button>, note: "state layer 6%" },
            { label: "Secondary · pressed", node: <Button variant="secondary" data-force-state="active">Save for later</Button>, note: "state layer 12%" },
          ]}
        />
      </DsSection>

      <DsSection title="Sizes & compositions">
        <DsGrid>
          <DsPreview label="Sizes" code={`<Button size="sm | md | lg | xl" />`}>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button size="xl">Extra large</Button>
          </DsPreview>
          <DsPreview label="Loading, disabled and icons" code={`<Button loading>Placing order</Button>`}>
            <Button loading>Placing order</Button>
            <Button disabled>Out of stock</Button>
            <Button variant="secondary" trailingIcon={<ArrowRight aria-hidden />}>
              Continue
            </Button>
            <Button variant="neutral" trailingIcon={<ArrowUpRight aria-hidden />}>
              Payout now
            </Button>
          </DsPreview>
        </DsGrid>
        <div className="mt-5">
          <DsPreview label="Full width" className="max-w-md">
            <Button fullWidth size="lg">
              Place order · ₹21,596
            </Button>
            <Button fullWidth size="lg" variant="secondary">
              Continue shopping
            </Button>
          </DsPreview>
        </div>
      </DsSection>

      <DsSection title="Icon buttons" description="Circular, 40px by default. The label prop is required and becomes aria-label + title.">
        <DsGrid>
          <DsPreview label="Icon button variants">
            <IconButton label="Search">
              <Search aria-hidden />
            </IconButton>
            <IconButton label="Filters" variant="sunken">
              <SlidersHorizontal aria-hidden />
            </IconButton>
            <IconButton label="Wishlist" variant="ghost">
              <Heart aria-hidden />
            </IconButton>
            <IconButton label="Add" variant="primary">
              <Plus aria-hidden />
            </IconButton>
            <IconButton label="Open" variant="neutral">
              <ArrowUpRight aria-hidden />
            </IconButton>
            <IconButton label="Soft" variant="soft">
              <Heart aria-hidden />
            </IconButton>
          </DsPreview>
          <DsPreview label="Sizes and badges">
            <IconButton label="Extra small" size="xs">
              <ArrowUpRight aria-hidden />
            </IconButton>
            <IconButton label="Small" size="sm">
              <ArrowUpRight aria-hidden />
            </IconButton>
            <IconButton label="Medium">
              <ArrowUpRight aria-hidden />
            </IconButton>
            <IconButton label="Large" size="lg">
              <ArrowUpRight aria-hidden />
            </IconButton>
            <IconButton label="Notifications" badge>
              <Bell aria-hidden />
            </IconButton>
            <IconButton label="Cart, 3 items" badge={3}>
              <ShoppingBag aria-hidden />
            </IconButton>
          </DsPreview>
        </DsGrid>
        <div className="mt-5">
          <DsPreview label="On a contrast surface" className="bg-surface-contrast">
            <IconButton label="Open" variant="contrast">
              <ArrowUpRight aria-hidden />
            </IconButton>
            <Button variant="inverse">Payout now</Button>
          </DsPreview>
        </div>
      </DsSection>

      <DsSection title="Icon & text button states" description="IconButton follows the Button state language — including a neutral disabled fill on every filled variant. TextButton is a link-styled action that doesn't navigate.">
        <DsStates
          states={[
            { label: "Default", node: <IconButton label="Save to wishlist"><Heart aria-hidden /></IconButton> },
            { label: "Hover", node: <IconButton label="Save to wishlist" data-force-state="hover"><Heart aria-hidden /></IconButton>, note: "state layer 6%" },
            { label: "Focus visible", node: <IconButton label="Save to wishlist" data-force-state="focus"><Heart aria-hidden /></IconButton>, note: "2px ring · 2px gap" },
            { label: "Pressed", node: <IconButton label="Save to wishlist" data-force-state="active"><Heart aria-hidden /></IconButton>, note: "state layer 12% · scale" },
            { label: "Disabled", node: <IconButton label="Save to wishlist" disabled><Heart aria-hidden /></IconButton>, note: "disabled edge + text" },
            { label: "Primary · disabled", node: <IconButton label="Add" variant="primary" disabled><Plus aria-hidden /></IconButton>, note: "neutral fill" },
            { label: "Text button", node: <TextButton>Size chart</TextButton>, note: "accent-fg · underline on hover" },
            { label: "Text button · disabled", node: <TextButton disabled>Change</TextButton>, note: "disabled-fg, no underline" },
          ]}
        />
      </DsSection>

      <DsSection title="Copy & share" description="CopyButton confirms with an icon swap plus a live-region message (and an optional toast). ShareButton prefers the system share sheet and falls back to a menu.">
        <CopyShareDemo />
      </DsSection>

      <DsSection title="Segmented control" description="Compact single-choice switcher with optional count bubbles — Monthly/Annually, All/Draft/Unpaid.">
        <DsGrid>
          <DsPreview label="Surface (default)">
            <SegmentedControl
              aria-label="Period"
              defaultValue="monthly"
              options={[
                { value: "monthly", label: "Monthly" },
                { value: "annually", label: "Annually" },
              ]}
            />
          </DsPreview>
          <DsPreview label="Accent with counts">
            <SegmentedControl
              aria-label="Invoice status"
              variant="surface"
              active="accent"
              defaultValue="unpaid"
              options={[
                { value: "all", label: "All orders" },
                { value: "draft", label: "Draft", count: 3 },
                { value: "unpaid", label: "Unpaid", count: 5 },
              ]}
            />
          </DsPreview>
          <DsPreview label="Neutral, small and large">
            <SegmentedControl
              aria-label="Size"
              size="sm"
              active="neutral"
              defaultValue="m"
              options={["XS", "S", "M", "L", "XL"].map((s) => ({ value: s.toLowerCase(), label: s }))}
            />
            <SegmentedControl
              aria-label="View"
              size="lg"
              defaultValue="grid"
              options={[
                { value: "grid", label: "Grid" },
                { value: "list", label: "List" },
              ]}
            />
          </DsPreview>
          <DsPreview label="Contrast" className="bg-surface-contrast">
            <SegmentedControl
              aria-label="Section"
              variant="contrast"
              active="contrast"
              defaultValue="orders"
              options={[
                { value: "overview", label: "Overview" },
                { value: "orders", label: "Orders" },
                { value: "returns", label: "Returns" },
              ]}
            />
          </DsPreview>
        </DsGrid>
      </DsSection>

      <DsSection title="Props">
        <div className="flex flex-col gap-5">
          <DsProps
            component="CopyButton"
            rows={[
              { name: "value", type: "string", description: "Text written to the clipboard (textarea fallback when the API is blocked)." },
              { name: "appearance", type: '"icon" | "button" | "inline"', default: '"icon"', description: "IconButton, secondary Button or inline link style." },
              { name: "label · copiedLabel", type: "string", default: '"Copy" · "Copied"', description: "Name before and after; the confirmation lasts 2 s." },
              { name: "notify · onCopied", type: "boolean · (value) => void", description: "Toast confirmation; callback after a successful copy." },
            ]}
          />
          <DsProps
            component="ShareButton"
            rows={[
              { name: "title · text · url", type: "string", description: "Share payload; url defaults to the current page." },
              { name: "appearance", type: '"icon" | "button"', default: '"icon"', description: "Icon-only or labelled button." },
              { name: "variant · size · label", type: '"secondary" | "ghost" | "sunken" · "sm" | "md" · string', description: "Trigger styling and name." },
            ]}
          />
          <DsProps
            component="Button"
            rows={[
              { name: "variant", type: '"primary" | "neutral" | "secondary" | "soft" | "ghost" | "danger" | "inverse" | "link"', default: '"primary"', description: "Visual emphasis. One primary per view; inverse for accent/contrast panels." },
              { name: "size", type: '"sm" | "md" | "lg" | "xl"', default: '"md"', description: "Height from the control scale: 32 / 40 / 48 / 56 px." },
              { name: "loading", type: "boolean", default: "false", description: "Shows a spinner, keeps the variant color, sets aria-busy and blocks activation." },
              { name: "leadingIcon · trailingIcon", type: "ReactNode", description: "Icons sized from the control scale; the leading slot shows the spinner while loading." },
              { name: "fullWidth", type: "boolean", default: "false", description: "Stretches to the container width." },
              { name: "asChild", type: "boolean", default: "false", description: "Render the child element (e.g. next/link) with button styling." },
            ]}
          />
          <DsProps
            component="IconButton"
            rows={[
              { name: "label", type: "string", description: "Required accessible name; also used as the tooltip title." },
              { name: "variant", type: '"secondary" | "sunken" | "ghost" | "primary" | "neutral" | "soft" | "contrast"', default: '"secondary"', description: "contrast is for dark and blue panels." },
              { name: "size", type: '"xs" | "sm" | "md" | "lg"', default: '"md"', description: "28 / 32 / 40 / 48 px. xs and sm expand their hit area to 44 px on touch." },
              { name: "badge", type: "number | boolean", description: "Count bubble or notification dot." },
            ]}
          />
        </div>
      </DsSection>
    </>
  );
}

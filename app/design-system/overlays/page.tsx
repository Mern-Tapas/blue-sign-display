import type { Metadata } from "next";
import { Copy, Pencil } from "lucide-react";
import { OverlaysDemo } from "@/components/docs/demos/overlays-demo";
import { AlertDialogDemo, HoverCardDemo, ScrollAreaDemo } from "@/components/docs/demos/overlay-extras-demo";
import { DsCode } from "@/components/docs/ds-code";
import { DsPageHeader, DsProps, DsSection, DsStates } from "@/components/docs/ds-section";

export const metadata: Metadata = { title: "Overlays" };

const menuItem = "flex h-9 w-44 items-center gap-2.5 rounded-md px-3 text-body [&_svg]:size-icon-md [&_svg]:text-fg-muted";

export default function OverlaysPage() {
  return (
    <>
      <DsPageHeader
        title="Overlays"
        muted="& menus"
        description="Built on Radix primitives: focus is trapped in modals, Escape closes, focus returns to the trigger, and popover layers stack above dialogs. Overlays use the popover and modal elevation tiers; enters ease out, exits are faster."
      />

      <DsSection title="Dialogs, sheets, menus, tooltips">
        <OverlaysDemo />
      </DsSection>

      <DsSection
        title="Confirmations"
        description="AlertDialog interrupts for destructive or irreversible choices: no close button, outside clicks are ignored and focus starts on the safe option. ConfirmDialog wires the common case, including async confirms and an optional body such as a reason select."
      >
        <AlertDialogDemo />
      </DsSection>

      <DsSection title="Hover card & scroll area" description="HoverCard previews extra detail for pointer and keyboard users only, so its trigger must still lead somewhere. ScrollArea draws theme-aware overlay scrollbars and keeps the region keyboard-scrollable.">
        <div className="flex flex-col gap-5">
          <HoverCardDemo />
          <ScrollAreaDemo />
        </div>
      </DsSection>

      <DsSection title="Menu item states" description="Menus, selects and search suggestions share one highlight token that works on raised surfaces in both themes.">
        <DsStates
          surface="sunken"
          states={[
            {
              label: "Default",
              node: (
                <div className={`${menuItem} bg-surface-raised`}>
                  <Pencil aria-hidden /> Edit
                </div>
              ),
            },
            {
              label: "Highlighted",
              node: (
                <div className="rounded-md bg-surface-raised">
                  <div className={`${menuItem} bg-highlight`}>
                    <Copy aria-hidden /> Duplicate
                  </div>
                </div>
              ),
              note: "bg-highlight (hover or arrow keys)",
            },
            {
              label: "Disabled",
              node: (
                <div className={`${menuItem} bg-surface-raised text-disabled-fg`}>
                  <Copy aria-hidden /> Duplicate
                </div>
              ),
            },
            {
              label: "Destructive",
              node: (
                <div className="rounded-md bg-surface-raised">
                  <div className={`${menuItem} bg-danger-soft text-danger-fg [&_svg]:text-danger-fg`}>Sign out</div>
                </div>
              ),
            },
          ]}
        />
      </DsSection>

      <DsSection title="Usage">
        <div className="overflow-hidden rounded-2xl shadow-flat">
          <DsCode
            code={`<Dialog>
  <DialogTrigger asChild>
    <Button variant="secondary">Edit address</Button>
  </DialogTrigger>
  <DialogContent size="md">
    <DialogHeader title="Shipping address" description="Used for this and future orders." />
    <DialogBody>…</DialogBody>
    <DialogFooter>
      <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
      <Button>Save address</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`}
          />
        </div>
      </DsSection>

      <DsSection title="Props">
        <div className="flex flex-col gap-5">
          <DsProps
            component="DialogContent"
            rows={[
              { name: "size", type: '"sm" | "md" | "lg" | "xl"', default: '"md"', description: "Max width 384 / 512 / 672 / 896 px." },
              { name: "hideClose", type: "boolean", default: "false", description: "Hide the corner close button (keep another way to dismiss)." },
            ]}
          />
          <DsProps
            component="SheetContent"
            rows={[
              { name: "side", type: '"right" | "left" | "bottom"', default: '"right"', description: "Edge the sheet slides from; bottom sheets get a drag handle." },
              { name: "hideClose", type: "boolean", default: "false", description: "Hide the corner close button." },
            ]}
          />
          <DsProps
            component="Tooltip"
            rows={[
              { name: "content", type: "ReactNode", description: "Tooltip text. Keep it short; never the only way to reach information." },
              { name: "side", type: '"top" | "right" | "bottom" | "left"', default: '"top"', description: "Preferred placement; flips on collision." },
            ]}
          />
          <DsProps
            component="ConfirmDialog"
            rows={[
              { name: "title · description · icon", type: "ReactNode", description: "Question, consequence and optional icon badge." },
              { name: "tone", type: '"default" | "danger"', default: '"default"', description: "Danger switches the icon badge and confirm button to red." },
              { name: "onConfirm", type: "() => void | Promise<void>", description: "Async keeps the dialog open with a loading button; throw to stay open." },
              { name: "confirmLabel · cancelLabel", type: "string", default: '"Confirm" · "Cancel"', description: "Name the action (“Remove”, “Cancel order”), not “OK”." },
              { name: "trigger · open · onOpenChange", type: "ReactElement · boolean · fn", description: "Uncontrolled with a trigger, or controlled." },
              { name: "body · confirmDisabled", type: "ReactNode · boolean", description: "Extra fields (reason) and a gate until they’re filled." },
            ]}
          />
          <DsProps
            component="ScrollArea"
            rows={[
              { name: "orientation", type: '"vertical" | "horizontal" | "both"', default: '"vertical"', description: "Which scrollbars render." },
              { name: "type", type: '"hover" | "scroll" | "auto" | "always"', default: '"hover"', description: "When scrollbars are visible (Radix)." },
              { name: "fade", type: "boolean", default: "false", description: "Masks the edges to hint at more content." },
              { name: "aria-label", type: "string", description: "Names the scrollable region for keyboard and screen-reader users." },
            ]}
          />
        </div>
      </DsSection>
    </>
  );
}

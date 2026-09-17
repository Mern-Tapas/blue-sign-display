import {
  Button,
  Checkbox,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  Field,
  icons,
  Input,
  Select,
} from "@bluesigns/ui";

const { MapPin, Ruler, Trash2 } = icons;

export const FormBody = () => (
  <Dialog defaultOpen>
    <DialogTrigger asChild>
      <Button variant="secondary" leadingIcon={<MapPin aria-hidden />}>
        Edit address
      </Button>
    </DialogTrigger>
    <DialogContent onInteractOutside={(e) => e.preventDefault()} onOpenAutoFocus={(e) => e.preventDefault()}>
      <DialogHeader icon={<MapPin aria-hidden />} title="Shipping address" description="Used for this and future orders." />
      <DialogBody className="flex flex-col gap-4">
        <Field label="Street">
          <Input defaultValue="Flat 402, Prestige Lakeside" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="City">
            <Input defaultValue="Bengaluru" />
          </Field>
          <Field label="State">
            <Select
              defaultValue="KA"
              options={[
                { value: "KA", label: "Karnataka" },
                { value: "MH", label: "Maharashtra" },
                { value: "DL", label: "Delhi" },
              ]}
            />
          </Field>
        </div>
        <Checkbox label="Set as default address" defaultChecked />
      </DialogBody>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="ghost">Cancel</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button>Save address</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export const TableBody = () => (
  <Dialog defaultOpen>
    <DialogTrigger asChild>
      <Button variant="soft" leadingIcon={<Ruler aria-hidden />}>
        Size chart
      </Button>
    </DialogTrigger>
    <DialogContent size="lg" onInteractOutside={(e) => e.preventDefault()} onOpenAutoFocus={(e) => e.preventDefault()}>
      <DialogHeader
        icon={<Ruler aria-hidden />}
        title="Velocity Runner size chart"
        description="Measure your foot from heel to longest toe and pick the nearest size."
      />
      <DialogBody>
        <div className="grid grid-cols-4 gap-2 text-body figures">
          {["UK", "EU", "US", "Foot length"].map((h) => (
            <span key={h} className="text-caption text-fg-muted">
              {h}
            </span>
          ))}
          {[
            ["6", "40", "7", "24.8 cm"],
            ["7", "41", "8", "25.4 cm"],
            ["8", "42", "9", "26.0 cm"],
            ["9", "43", "10", "26.7 cm"],
            ["10", "44", "11", "27.3 cm"],
          ].flatMap((row) =>
            row.map((cell, i) => (
              <span key={row[0] + "-" + i} className="rounded-sm bg-surface-sunken px-3 py-2">
                {cell}
              </span>
            )),
          )}
        </div>
      </DialogBody>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="secondary">Got it</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export const TextBody = () => (
  <Dialog defaultOpen>
    <DialogTrigger asChild>
      <Button variant="danger" leadingIcon={<Trash2 aria-hidden />}>
        Clear bag
      </Button>
    </DialogTrigger>
    <DialogContent size="sm" aria-describedby={undefined} onInteractOutside={(e) => e.preventDefault()} onOpenAutoFocus={(e) => e.preventDefault()}>
      <DialogHeader title="Remove all items?" />
      <DialogBody>
        <p className="text-body text-fg-muted">This clears 4 items from your bag. You can’t undo this.</p>
      </DialogBody>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="secondary">Keep items</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button variant="danger">Remove all</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

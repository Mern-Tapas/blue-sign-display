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

const { CircleCheck, MapPin, Truck } = icons;

export const ShippingAddress = () => (
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

export const WithoutCloseIcon = () => (
  <Dialog defaultOpen>
    <DialogContent size="sm" hideClose onInteractOutside={(e) => e.preventDefault()} onOpenAutoFocus={(e) => e.preventDefault()}>
      <DialogHeader
        icon={<CircleCheck aria-hidden />}
        title="Order placed"
        description="Order LM-100251 · ₹21,596 paid with UPI. Arriving by Fri, 19 Sept in Bengaluru."
      />
      <DialogFooter className="pt-5">
        <DialogClose asChild>
          <Button variant="secondary">Continue shopping</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button leadingIcon={<Truck aria-hidden />}>Track order</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

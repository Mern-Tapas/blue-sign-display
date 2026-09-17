import { useState } from "react";
import type { ComponentProps } from "react";
import { Button, Checkbox, ConfirmDialog, Field, icons, Select, toast } from "@bluesigns/ui";

const { PackageX, Trash2, Wallet } = icons;

function OpenConfirm(props: Omit<ComponentProps<typeof ConfirmDialog>, "open" | "onOpenChange">) {
  const [open, setOpen] = useState(true);
  return <ConfirmDialog {...props} open={open} onOpenChange={setOpen} onOpenAutoFocus={(e) => e.preventDefault()} />;
}

export const RemoveFromBag = () => (
  <OpenConfirm
    trigger={
      <Button variant="secondary" leadingIcon={<Trash2 aria-hidden />}>
        Remove from bag
      </Button>
    }
    tone="danger"
    icon={<Trash2 />}
    title="Remove this item?"
    description="Aura Wireless Headphones will be removed from your bag. You can move it to your wishlist instead."
    confirmLabel="Remove"
    cancelLabel="Keep it"
    onConfirm={() => toast({ title: "Removed from bag", tone: "info" })}
  />
);

export const CancelWithReason = () => (
  <OpenConfirm
    trigger={<Button variant="ghost">Cancel order</Button>}
    tone="danger"
    icon={<PackageX />}
    title="Cancel order LM-100251?"
    description="The refund of ₹3,499 goes back to the original payment method within 5–7 days."
    confirmLabel="Cancel order"
    cancelLabel="Don’t cancel"
    body={
      <Field label="Reason for cancellation" required>
        <Select
          defaultValue="price"
          options={[
            { value: "late", label: "Delivery is taking too long" },
            { value: "price", label: "Found a better price" },
            { value: "mistake", label: "Ordered by mistake" },
          ]}
        />
      </Field>
    }
    onConfirm={() => new Promise<void>((resolve) => setTimeout(resolve, 900))}
  />
);

export const DefaultTone = () => (
  <OpenConfirm
    trigger={<Button>Place order</Button>}
    icon={<Wallet />}
    title="Pay ₹21,596 with UPI?"
    description="We’ll send a collect request to sujon@okaxis. Approve it in your UPI app within 5 minutes."
    confirmLabel="Send request"
    onConfirm={() => toast({ title: "Payment request sent", tone: "success" })}
  />
);

export const ConfirmDisabled = () => (
  <OpenConfirm
    trigger={<Button variant="danger">Delete account</Button>}
    tone="danger"
    icon={<Trash2 />}
    title="Delete your account?"
    description="Orders, addresses and ₹1,200 in gift card balance will be removed permanently."
    confirmLabel="Delete account"
    confirmDisabled
    body={<Checkbox label="I understand this can’t be undone" />}
    onConfirm={() => {}}
  />
);

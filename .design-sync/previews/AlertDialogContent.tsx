import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
  Button,
  Field,
  icons,
  Select,
} from "@bluesigns/ui";

const { LogOut, PackageX, ShoppingBag, Trash2 } = icons;

export const DangerTone = () => (
  <AlertDialog defaultOpen>
    <AlertDialogTrigger asChild>
      <Button variant="secondary" leadingIcon={<Trash2 aria-hidden />}>
        Remove from bag
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent
      onOpenAutoFocus={(e) => e.preventDefault()}
      tone="danger"
      icon={<Trash2 />}
      title="Remove this item?"
      description="Aura Wireless Headphones will be removed from your bag. You can move it to your wishlist instead."
    >
      <AlertDialogFooter>
        <AlertDialogCancel asChild>
          <Button variant="secondary">Keep it</Button>
        </AlertDialogCancel>
        <AlertDialogAction asChild>
          <Button variant="danger">Remove</Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export const DefaultTone = () => (
  <AlertDialog defaultOpen>
    <AlertDialogTrigger asChild>
      <Button variant="ghost">Back to bag</Button>
    </AlertDialogTrigger>
    <AlertDialogContent
      onOpenAutoFocus={(e) => e.preventDefault()}
      icon={<ShoppingBag />}
      title="Leave checkout?"
      description="Your bag and saved address stay as they are. The ₹250 first-order coupon is held for 15 more minutes."
    >
      <AlertDialogFooter>
        <AlertDialogCancel asChild>
          <Button variant="secondary">Stay</Button>
        </AlertDialogCancel>
        <AlertDialogAction asChild>
          <Button>Leave checkout</Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export const WithBody = () => (
  <AlertDialog defaultOpen>
    <AlertDialogTrigger asChild>
      <Button variant="ghost">Cancel order</Button>
    </AlertDialogTrigger>
    <AlertDialogContent
      onOpenAutoFocus={(e) => e.preventDefault()}
      tone="danger"
      icon={<PackageX />}
      title="Cancel order LM-100251?"
      description="The refund of ₹3,499 goes back to the original payment method within 5–7 days."
    >
      <Field label="Reason for cancellation" required>
        <Select
          defaultValue="late"
          options={[
            { value: "late", label: "Delivery is taking too long" },
            { value: "price", label: "Found a better price" },
            { value: "mistake", label: "Ordered by mistake" },
            { value: "other", label: "Other" },
          ]}
        />
      </Field>
      <AlertDialogFooter>
        <AlertDialogCancel asChild>
          <Button variant="secondary">Don’t cancel</Button>
        </AlertDialogCancel>
        <AlertDialogAction asChild>
          <Button variant="danger">Cancel order</Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export const WithoutIcon = () => (
  <AlertDialog defaultOpen>
    <AlertDialogTrigger asChild>
      <Button variant="secondary" leadingIcon={<LogOut aria-hidden />}>
        Sign out of all devices
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent
      onOpenAutoFocus={(e) => e.preventDefault()}
      title="Sign out of all devices?"
      description="You’ll be signed out on 3 devices, including the Pixel 8 in Bengaluru. This one stays signed in."
    >
      <AlertDialogFooter>
        <AlertDialogCancel asChild>
          <Button variant="secondary">Cancel</Button>
        </AlertDialogCancel>
        <AlertDialogAction asChild>
          <Button variant="neutral">Sign out everywhere</Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
  Button,
  icons,
} from "@bluesigns/ui";

const { ShoppingBag, Trash2 } = icons;

export const RemoveItem = () => (
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

export const LeaveCheckout = () => (
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

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

const { LogOut, Trash2 } = icons;

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

export const SignOutEverywhere = () => (
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

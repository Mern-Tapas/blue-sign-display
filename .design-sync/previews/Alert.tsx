import { Alert, Button, IconButton, icons } from "@bluesigns/ui";

const { X } = icons;

export const Tones = () => (
  <div className="flex flex-col gap-3" style={{ maxWidth: 560 }}>
    <Alert tone="info" title="Free shipping unlocked">
      Orders above ₹499 get free delivery — you’re all set.
    </Alert>
    <Alert tone="success" title="Payment confirmed">
      Order LM-100482 is being packed.
    </Alert>
    <Alert tone="warning" title="Only 3 left in stock">
      Complete checkout within 10 minutes to reserve your item.
    </Alert>
    <Alert tone="danger" title="Card declined">
      Your bank declined the charge. Try another payment method.
    </Alert>
    <Alert tone="accent" title="Bank offer applied">
      10% instant discount with HDFC Bank cards.
    </Alert>
    <Alert tone="neutral" title="Invoice ready">
      GST invoice is emailed after delivery.
    </Alert>
  </div>
);

export const WithActions = () => (
  <div className="flex flex-col gap-3" style={{ maxWidth: 560 }}>
    <Alert
      tone="warning"
      title="Only 3 left in stock"
      action={
        <Button size="sm" variant="secondary">
          Notify me
        </Button>
      }
    >
      Complete checkout within 10 minutes to reserve your item.
    </Alert>
    <Alert
      tone="danger"
      title="Card declined"
      action={
        <IconButton label="Dismiss" variant="ghost" size="sm">
          <X aria-hidden />
        </IconButton>
      }
    >
      Your bank declined the charge. Try another payment method.
    </Alert>
  </div>
);

export const InlineNotes = () => (
  <div className="flex flex-col gap-2" style={{ maxWidth: 380 }}>
    <Alert size="sm" tone="accent">
      You save ₹1,240 on this order
    </Alert>
    <Alert size="sm" tone="success">
      Delivery by Thu, 18 Sept
    </Alert>
    <Alert size="sm" tone="warning">
      Only 2 left in size M
    </Alert>
    <Alert size="sm" tone="danger">
      This PIN code isn’t serviceable
    </Alert>
  </div>
);

export const NoIcon = () => (
  <div style={{ maxWidth: 560 }}>
    <Alert tone="info" icon={false} title="Delivery slots are filling up">
      Order before 6 PM for delivery tomorrow in Bengaluru.
    </Alert>
  </div>
);

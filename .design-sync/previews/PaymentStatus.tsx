import { Button, PaymentStatus } from "@bluesigns/ui";

export const Success = () => (
  <div style={{ maxWidth: 440 }}>
    <PaymentStatus status="success" amount={12999} method="UPI · sujon@okaxis" reference="TXN48213377" actions={<Button variant="neutral">View order</Button>} />
  </div>
);

export const Failed = () => (
  <div style={{ maxWidth: 440 }}>
    <PaymentStatus
      status="failed"
      amount={12999}
      method="HDFC Bank card •••• 4242"
      reason="Your bank declined the payment because the OTP wasn’t entered in time."
      reference="TXN48213412"
      actions={
        <>
          <Button>Try again</Button>
          <Button variant="secondary">Use another method</Button>
        </>
      }
    />
  </div>
);

export const Pending = () => (
  <div style={{ maxWidth: 440 }}>
    <PaymentStatus status="pending" amount={12999} method="Net banking · State Bank of India" reference="TXN48213590" actions={<Button variant="secondary">Check status</Button>} />
  </div>
);

export const MinimalFailed = () => (
  <div style={{ maxWidth: 440 }}>
    <PaymentStatus status="failed" amount={3527} />
  </div>
);

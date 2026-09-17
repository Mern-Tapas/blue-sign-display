import { FieldGroup, Radio, RadioGroup } from "@bluesigns/ui";

export const Payment = () => (
  <div style={{ maxWidth: 380 }}>
    <RadioGroup defaultValue="upi" aria-label="Payment">
      <Radio value="upi" label="UPI" description="Google Pay, PhonePe, Paytm or any UPI ID" />
      <Radio value="card" label="Credit / debit card" description="RuPay, Visa, Mastercard, Amex" />
      <Radio value="cod" label="Cash on delivery" description="Not available for this PIN code" disabled />
    </RadioGroup>
  </div>
);

export const Horizontal = () => (
  <RadioGroup defaultValue="home" aria-label="Address type" className="flex flex-row gap-6">
    <Radio value="home" label="Home" />
    <Radio value="work" label="Work" />
    <Radio value="other" label="Other" />
  </RadioGroup>
);

export const InFieldGroup = () => (
  <div style={{ maxWidth: 380 }}>
    <FieldGroup legend="Delivery slot" error="Pick a slot to continue." required>
      <RadioGroup>
        <Radio value="morning" label="Morning" description="8 AM – 12 PM" />
        <Radio value="evening" label="Evening" description="4 PM – 9 PM" />
      </RadioGroup>
    </FieldGroup>
  </div>
);

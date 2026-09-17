import { PaymentCardVisual } from "@bluesigns/ui";

export const Wallet = () => (
  <div className="flex flex-wrap gap-4">
    <PaymentCardVisual last4="6782" expiry="09/29" status="active" holder="Sujon Ahmed" />
    <PaymentCardVisual brand="mastercard" last4="4356" expiry="02/28" variant="accent" status="active" holder="Sujon Ahmed" />
  </div>
);

export const Brands = () => (
  <div className="grid grid-cols-2 gap-4" style={{ maxWidth: 660 }}>
    <PaymentCardVisual brand="visa" last4="4242" expiry="09/29" holder="HDFC Bank" />
    <PaymentCardVisual brand="rupay" last4="8210" expiry="02/28" holder="State Bank of India" />
    <PaymentCardVisual brand="amex" last4="1005" expiry="11/27" holder="American Express" variant="accent" />
    <PaymentCardVisual brand="mastercard" last4="7781" expiry="05/30" holder="Axis Bank" />
  </div>
);

export const Inactive = () => (
  <PaymentCardVisual brand="rupay" last4="8210" expiry="02/28" status="inactive" holder="State Bank of India" />
);

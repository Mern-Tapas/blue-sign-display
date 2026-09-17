import type { Metadata } from "next";
import { PaymentOptionsDemo, PaymentStatesDemo } from "@/components/docs/demos/payments-demo";
import { DsPageHeader, DsPreview, DsProps, DsSection } from "@/components/docs/ds-section";
import { SecureCheckoutBadges } from "@/components/payment/secure-checkout-badges";
import { PaymentCardVisual } from "@/components/commerce/payment-card-visual";

export const metadata: Metadata = { title: "Payments" };

const rules = [
  ["Show every fee first", "COD fee, EMI interest and processing fees appear before the shopper commits; the Pay button carries the exact amount."],
  ["Never store card data", "Card fields here are demo inputs. Production uses the gateway’s hosted fields; saved cards are tokens, CVV is always re-entered."],
  ["Explain unavailability", "EMI under ₹3,000, COD for a PIN code, a wallet short on balance — each says why instead of disappearing."],
  ["Failures keep the order", "A declined payment returns to the method list with the bag intact and says whether money was taken."],
] as const;

export default function PaymentsPage() {
  return (
    <>
      <DsPageHeader
        title="Payments"
        description="Indian payment methods for checkout: UPI, saved and new cards, net banking, wallets, EMI and Cash on Delivery, plus gift cards, the approval wait and the result screens. Nothing here takes real money."
      />

      <DsSection title="Payment options" description="Vertical tabs from 1024 px, an accordion on phones — one layout is mounted at a time, so each form keeps its state. Try card 4242 4242 4242 4242, a UPI ID containing “unknown”, or EMI plans.">
        <PaymentOptionsDemo />
      </DsSection>

      <DsSection title="Waiting, results & gift cards">
        <PaymentStatesDemo />
      </DsSection>

      <DsSection title="Security & methods" description="Plain claims the store actually meets and the accepted methods — no borrowed certification logos.">
        <DsPreview className="block">
          <SecureCheckoutBadges demo variant="row" />
        </DsPreview>
      </DsSection>

      <DsSection title="Rules">
        <dl className="grid gap-x-8 gap-y-5 rounded-2xl bg-surface p-6 shadow-flat md:grid-cols-2">
          {rules.map(([term, text]) => (
            <div key={term} className="flex flex-col gap-1">
              <dt className="text-title">{term}</dt>
              <dd className="text-body text-fg-muted">{text}</dd>
            </div>
          ))}
        </dl>
      </DsSection>

      <DsSection title="Card visuals" description="Saved card faces for wallets and saved-payment lists. Only the last four digits are ever shown.">
        <DsPreview label="PaymentCardVisual" className="gap-4">
          <PaymentCardVisual last4="6782" expiry="09/29" status="active" />
          <PaymentCardVisual brand="mastercard" last4="4356" expiry="02/28" variant="accent" status="active" holder="Sujon Ahmed" />
        </DsPreview>
      </DsSection>

      <DsSection title="Props">
        <div className="flex flex-col gap-5">
          <DsProps
            component="PaymentOptionsList"
            rows={[
              { name: "options", type: "{ id, label, description?, icon, offer?, unavailable?, content }[]", description: "content is the method’s form; unavailable greys the row and explains." },
              { name: "value · onValueChange", type: "string · (id) => void", description: "Selected method (tab or open accordion item)." },
            ]}
          />
          <DsProps
            component="UpiPayment · CardPaymentForm · SavedCardsList"
            rows={[
              { name: "amount · apps · savedIds · verify · onPay", type: "UpiPayment", description: "Apps on touch devices, UPI ID with verify (shows account name), QR on desktop. onPay({ mode, … })." },
              { name: "amount · onPay · submitLabel · showVisual", type: "CardPaymentForm", description: "Brand detection, Luhn, expiry, CVV, RBI tokenisation checkbox. onPay gets last4/brand only." },
              { name: "cards · amount · onPay · onUseNewCard · thisMonth", type: "SavedCardsList", description: "CVV for the selected card; “expires soon” badge." },
            ]}
          />
          <DsProps
            component="NetBankingSelector · WalletSelector · EmiPlanSelector · CodOption"
            rows={[
              { name: "banks · amount · onPay", type: "NetBankingSelector", description: "Popular tiles + searchable combobox." },
              { name: "wallets · amount · onPay", type: "WalletSelector", description: "Linked balances; short wallets disabled with the gap." },
              { name: "banks · amount · minAmount · onContinue", type: "EmiPlanSelector", description: "Monthly amount, interest, total, no-cost badge." },
              { name: "amount · pinEligible · maxAmount · fee · pincode · onConfirm", type: "CodOption", description: "Fee shown before confirming; specific unavailability reason." },
            ]}
          />
          <DsProps
            component="GiftCardRedeem · PaymentProcessingOverlay · PaymentStatus · SecureCheckoutBadges"
            rows={[
              { name: "orderTotal · applied · checkBalance · onApply", type: "GiftCardRedeem", description: "Partial payment up to the order total." },
              { name: "open · amount · kind · target · timeoutSeconds · onCancel · onTimeout", type: "PaymentProcessingOverlay", description: 'kind "upi" | "redirect" | "processing"; not dismissable by accident.' },
              { name: "status · amount · reference · method · reason · actions", type: "PaymentStatus", description: "success / failed (refund timeframe) / pending (don’t pay again)." },
              { name: "methods · demo · variant", type: "SecureCheckoutBadges", description: "Security statements and accepted methods." },
            ]}
          />
        </div>
      </DsSection>
    </>
  );
}

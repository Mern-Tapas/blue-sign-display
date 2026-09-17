import { Field, OtpInput, ResendTimer } from "@bluesigns/ui";

export const CountingDown = () => <ResendTimer seconds={30} onResend={() => {}} />;

export const Ready = () => <ResendTimer startLocked={false} onResend={() => {}} attemptsLeft={2} />;

export const Exhausted = () => (
  <ResendTimer onResend={() => {}} attemptsLeft={0} exhaustedText="Too many attempts. Try again in 30 minutes." />
);

export const WithOtp = () => (
  <div className="flex flex-col items-start gap-3">
    <Field label="Enter the code sent to maria@bluesigns.shop">
      <OtpInput size="md" defaultValue="81" />
    </Field>
    <ResendTimer seconds={45} label="Resend code" onResend={() => {}} attemptsLeft={3} />
  </div>
);

import { SocialAuthButtons } from "@bluesigns/ui";

const social = async () => {
  await new Promise((r) => setTimeout(r, 900));
};

export const Stacked = () => (
  <div style={{ maxWidth: 400 }}>
    <SocialAuthButtons onSelect={social} divider={false} />
  </div>
);

export const RowWithDivider = () => (
  <div style={{ maxWidth: 400 }}>
    <SocialAuthButtons onSelect={social} layout="row" divider="or continue with" />
  </div>
);

export const DividerBelow = () => (
  <div style={{ maxWidth: 400 }}>
    <SocialAuthButtons onSelect={social} verb="Sign up with" divider="or sign up with email" dividerPosition="bottom" />
  </div>
);

export const GoogleOnlyDisabled = () => (
  <div style={{ maxWidth: 400 }}>
    <SocialAuthButtons onSelect={social} providers={["google"]} divider={false} disabled />
  </div>
);

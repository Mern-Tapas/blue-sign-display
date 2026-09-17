import type { Metadata } from "next";
import { AccountMenuList } from "@/components/account/account-nav";
import {
  AccountSidebarView,
  AddressesView,
  CouponsView,
  GiftCardsView,
  NotificationSettingsView,
  PaymentsView,
  ProfileView,
  SecurityView,
} from "@/components/account/account-views";
import { RewardsCard } from "@/components/account/rewards-card";
import { DsGrid, DsPageHeader, DsPreview, DsProps, DsSection } from "@/components/docs/ds-section";
import { rewards } from "@/lib/data/account";

export const metadata: Metadata = { title: "Account & profile" };

export default function AccountDocsPage() {
  return (
    <>
      <DsPageHeader
        title="Account"
        muted="& profile"
        description="Everything a shopper manages about themselves: profile and contact details, login and devices, addresses, saved payments, coupons, gift cards, points and notification settings. Live under /account."
      />

      <DsSection title="Navigation" description="A grouped sidebar from 1024 px; on phones the account home lists the same destinations as large rows.">
        <DsGrid>
          <DsPreview label="AccountSidebar" surface="canvas" className="block">
            <div className="max-w-64">
              <AccountSidebarView />
            </div>
          </DsPreview>
          <DsPreview label="AccountMenuList" surface="canvas" className="block">
            <AccountMenuList />
          </DsPreview>
        </DsGrid>
      </DsSection>

      <DsSection title="Profile" description="Photo upload, verified contacts, and details that only save when changed. Changing the mobile number needs an OTP to the new number (demo code 246810).">
        <ProfileView />
      </DsSection>

      <DsSection title="Login & security" description="Current password is BlueSigns@2026 in the demo. Deleting the account is blocked while orders are open.">
        <SecurityView />
      </DsSection>

      <DsSection title="Addresses">
        <AddressesView />
      </DsSection>

      <DsSection title="Saved payments">
        <PaymentsView />
      </DsSection>

      <DsSection title="Coupons, gift cards & points">
        <div className="flex flex-col gap-5">
          <CouponsView />
          <GiftCardsView />
          <div className="max-w-xl">
            <RewardsCard {...rewards} demo />
          </div>
        </div>
      </DsSection>

      <DsSection title="Notification settings" description="Category × channel. Order SMS and security email stay on, with the reason; marketing starts off.">
        <NotificationSettingsView />
      </DsSection>

      <DsSection title="Props">
        <div className="flex flex-col gap-5">
          <DsProps
            component="AccountSidebar · AccountMenuList · ProfileHeader · AvatarUpload"
            rows={[
              { name: "user · groups · onSignOut", type: "AccountSidebar", description: "accountNavGroups by default; active item by pathname." },
              { name: "groups · onSignOut", type: "AccountMenuList", description: "Phone rows with descriptions." },
              { name: "name · avatar · email(Verified) · mobile(Verified) · tier · memberSince · action · avatarSlot", type: "ProfileHeader", description: "Server-safe." },
              { name: "name · src · onChange(file | null) · maxSizeMb", type: "AvatarUpload", description: "Type/size validation, instant preview, remove." },
            ]}
          />
          <DsProps
            component="EditProfileForm · ChangePasswordForm · ActiveDevicesList · DeleteAccountSection"
            rows={[
              { name: "defaultValue · emailVerified · onSave · onSendMobileOtp · onVerifyMobileOtp · onVerifyEmail", type: "EditProfileForm", description: "Dirty-tracked save; mobile change via OtpVerifyStep." },
              { name: "onSubmit · onForgotPassword · hasPassword", type: "ChangePasswordForm", description: "Field errors from the server map back to inputs." },
              { name: "devices · onSignOut · onSignOutOthers", type: "ActiveDevicesList", description: "This device marked; confirm before signing out others." },
              { name: "openOrders · points · giftCardBalance · onExportData · onDelete", type: "DeleteAccountSection", description: "Typed DELETE confirmation and reason." },
            ]}
          />
          <DsProps
            component="AddressBook · SavedPaymentsManager · CouponsWallet · GiftCardsWallet · RewardsCard · NotificationPreferences"
            rows={[
              { name: "addresses · lookup · onChange · max", type: "AddressBook", description: "Default first; set default; add/edit dialog." },
              { name: "cards · upiIds · wallets · on…Change", type: "SavedPaymentsManager", description: "Tabs with confirmed removal and UPI validation." },
              { name: "coupons · today", type: "CouponsWallet", description: "Active / Expired tabs." },
              { name: "cards · today · onAdd", type: "GiftCardsWallet", description: "Balance hero, per-card progress, add by number + PIN." },
              { name: "points · pointValue · tier · nextTier · nextTierAt · expiringPoints · expiringOn · demo", type: "RewardsCard", description: "Server-safe." },
              { name: "categories · defaultValue · onSave", type: "NotificationPreferences", description: "Locked channels per category; table or cards." },
            ]}
          />
        </div>
      </DsSection>
    </>
  );
}

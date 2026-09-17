"use client";

/* Demo wiring for the store's account pages: each view connects a component to local state and
   simulated requests. Replace the handlers with API calls in production. */

import { useState } from "react";
import { toast } from "@/components/providers/toast-store";
import { Card } from "@/components/ui/card";
import { AccountMenuList, AccountSidebar } from "./account-nav";
import { ActiveDevicesList } from "./active-devices-list";
import { AddressBook } from "./address-book";
import { AvatarUpload } from "./avatar-upload";
import { ChangePasswordForm } from "./change-password-form";
import { CouponsWallet } from "./coupons-wallet";
import { DeleteAccountSection } from "./delete-account-section";
import { EditProfileForm } from "./edit-profile-form";
import { GiftCardsWallet } from "./gift-cards-wallet";
import { NotificationPreferences } from "./notification-preferences";
import { ProfileHeader } from "./profile-header";
import { SavedPaymentsManager } from "./saved-payments-manager";
import { defaultNotificationPrefs, devices, giftCards, notificationCategories, profile, rewards } from "@/lib/data/account";
import { addresses as seedAddresses, coupons, lookupPincode, savedCards, savedUpiIds, wallets as seedWallets } from "@/lib/data/india";
import { demoUser } from "@/lib/data/session";
import { formatPrice } from "@/lib/format";
import { useHydrated } from "@/lib/use-hydrated";

const wait = (ms = 700) => new Promise<void>((r) => setTimeout(r, ms));
const signOut = () => toast({ title: "Demo: signed out", tone: "info" });

export function AccountSidebarView() {
  return <AccountSidebar user={demoUser} onSignOut={signOut} />;
}

export function AccountHomeView() {
  return (
    <div className="flex flex-col gap-5">
      <ProfileHeader name={profile.name} avatar={demoUser.avatar} email={profile.email} emailVerified mobile={profile.mobile} mobileVerified tier={rewards.tier} memberSince={profile.memberSince} />
      <AccountMenuList onSignOut={signOut} className="lg:hidden" />
    </div>
  );
}

export function ProfileView() {
  return (
    <div className="flex flex-col gap-5">
      <ProfileHeader
        name={profile.name}
        email={profile.email}
        emailVerified={profile.emailVerified}
        mobile={profile.mobile}
        mobileVerified
        tier={rewards.tier}
        memberSince={profile.memberSince}
        avatarSlot={
          <AvatarUpload
            name={profile.name}
            src={demoUser.avatar}
            onChange={async (file) => {
              await wait();
              toast({ title: file ? "Profile photo updated" : "Profile photo removed", tone: "success" });
            }}
          />
        }
      />
      <Card asChild className="gap-5">
        <section>
          <h2 className="text-title">Personal details</h2>
          <EditProfileForm
            defaultValue={{ name: profile.name, email: profile.email, mobile: profile.mobile, alternateMobile: "", gender: profile.gender, dateOfBirth: profile.dateOfBirth }}
            emailVerified={profile.emailVerified}
            onSave={async () => {
              await wait();
              toast({ title: "Profile saved", tone: "success" });
            }}
            onSendMobileOtp={async () => {
              await wait(500);
              toast({ title: "OTP sent", description: "Demo code: 246810" });
            }}
            onVerifyMobileOtp={async (_m, code) => {
              await wait(700);
              return code === "246810";
            }}
          />
        </section>
      </Card>
    </div>
  );
}

export function SecurityView() {
  return (
    <div className="flex flex-col gap-5">
      <Card asChild className="gap-5">
        <section>
          <h2 className="text-title">Change password</h2>
          <ChangePasswordForm
            onForgotPassword={() => toast({ title: "Opens password reset" })}
            onSubmit={async ({ current }) => {
              await wait();
              return current === "BlueSigns@2026" ? { ok: true } : { ok: false, field: "current", error: "That’s not your current password (demo: BlueSigns@2026)" };
            }}
          />
        </section>
      </Card>
      <section id="devices" className="flex flex-col gap-3">
        <h2 className="text-heading-sm">Where you’re signed in</h2>
        <ActiveDevicesList devices={devices} onSignOut={() => wait(500)} onSignOutOthers={() => wait(800)} />
      </section>
      <DeleteAccountSection
        openOrders={2}
        points={rewards.points}
        giftCardBalance={formatPrice(giftCards.reduce((n, g) => n + g.balance, 0))}
        onExportData={() => toast({ title: "We’ll email your data within 48 hours", tone: "success" })}
        onDelete={async () => {
          await wait();
        }}
      />
    </div>
  );
}

export function AddressesView() {
  const [list, setList] = useState(seedAddresses);
  return <AddressBook addresses={list} lookup={lookupPincode} onChange={setList} />;
}

export function PaymentsView() {
  const [cards, setCards] = useState(savedCards);
  const [upi, setUpi] = useState(savedUpiIds);
  const [wallets, setWallets] = useState(seedWallets);
  return <SavedPaymentsManager cards={cards} upiIds={upi} wallets={wallets} onCardsChange={setCards} onUpiChange={setUpi} onWalletsChange={setWallets} />;
}

export function CouponsView() {
  const hydrated = useHydrated();
  return <CouponsWallet coupons={coupons} today={hydrated ? new Date().toISOString().slice(0, 10) : ""} />;
}

export function GiftCardsView() {
  const hydrated = useHydrated();
  return (
    <GiftCardsWallet
      cards={giftCards}
      today={hydrated ? new Date().toISOString().slice(0, 10) : ""}
      onAdd={async (number) => {
        await wait(900);
        if (number.endsWith("0000")) throw new Error("This gift card isn’t valid or has already been added");
        return { id: `g-${number.slice(-4)}`, last4: number.slice(-4), balance: 750, original: 750, expiresOn: "2027-09-30" };
      }}
    />
  );
}

export function NotificationSettingsView() {
  return (
    <NotificationPreferences
      categories={notificationCategories}
      defaultValue={defaultNotificationPrefs}
      onSave={async () => {
        await wait();
      }}
    />
  );
}

import { Button, ProfileHeader, icons, sampleData } from "@bluesigns/ui";

const { Pencil } = icons;
const { profile, demoUser, rewards } = sampleData;

export const Verified = () => (
  <div style={{ maxWidth: 720 }}>
    <ProfileHeader
      name={profile.name}
      avatar={demoUser.avatar}
      email={profile.email}
      emailVerified
      mobile={profile.mobile}
      mobileVerified
      tier={rewards.tier}
      memberSince={profile.memberSince}
    />
  </div>
);

export const WithEditAction = () => (
  <div style={{ maxWidth: 720 }}>
    <ProfileHeader
      name={profile.name}
      avatar={demoUser.avatar}
      email={profile.email}
      emailVerified
      mobile={profile.mobile}
      mobileVerified
      tier={rewards.tier}
      memberSince={profile.memberSince}
      action={
        <Button variant="secondary" size="sm" leadingIcon={<Pencil aria-hidden />}>
          Edit profile
        </Button>
      }
    />
  </div>
);

export const NewMemberUnverified = () => (
  <div style={{ maxWidth: 720 }}>
    <ProfileHeader name="Priya Raghavan" email="priya.r@gmail.com" emailVerified={false} mobile="9812345670" mobileVerified memberSince="2026-09-01" />
  </div>
);

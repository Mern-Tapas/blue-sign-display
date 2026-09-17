import { AvatarUpload, ProfileHeader, sampleData, toast } from "@bluesigns/ui";

const { demoUser, profile, rewards } = sampleData;
const save = async (file: File | null) => {
  await new Promise((r) => setTimeout(r, 700));
  toast({ title: file ? "Profile photo updated" : "Profile photo removed", tone: "success" });
};

export const WithPhoto = () => <AvatarUpload name={demoUser.name} src={demoUser.avatar} onChange={save} />;

export const Initials = () => <AvatarUpload name="Priya Raghavan" onChange={save} maxSizeMb={2} />;

export const InProfileHeader = () => (
  <div style={{ maxWidth: 720 }}>
    <ProfileHeader
      name={profile.name}
      email={profile.email}
      emailVerified
      mobile={profile.mobile}
      mobileVerified
      tier={rewards.tier}
      memberSince={profile.memberSince}
      avatarSlot={<AvatarUpload name={profile.name} src={demoUser.avatar} onChange={save} />}
    />
  </div>
);

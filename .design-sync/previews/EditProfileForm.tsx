import { Card, EditProfileForm, sampleData, toast } from "@bluesigns/ui";

const { profile } = sampleData;
const wait = (ms = 700) => new Promise<void>((r) => setTimeout(r, ms));
const handlers = {
  onSave: async () => {
    await wait();
    toast({ title: "Profile saved", tone: "success" });
  },
  onSendMobileOtp: async () => {
    await wait(500);
    toast({ title: "OTP sent", description: "Demo code: 246810" });
  },
  onVerifyMobileOtp: async (_mobile: string, code: string) => {
    await wait();
    return code === "246810";
  },
};

export const PersonalDetails = () => (
  <Card className="gap-5" style={{ maxWidth: 720 }}>
    <h2 className="text-title">Personal details</h2>
    <EditProfileForm
      defaultValue={{ name: profile.name, email: profile.email, mobile: profile.mobile, alternateMobile: "", gender: profile.gender, dateOfBirth: profile.dateOfBirth }}
      emailVerified
      {...handlers}
    />
  </Card>
);

export const UnverifiedEmail = () => (
  <Card className="gap-5" style={{ maxWidth: 720 }}>
    <h2 className="text-title">Personal details</h2>
    <EditProfileForm
      defaultValue={{ name: "Priya Raghavan", email: "priya.r@gmail.com", mobile: "9812345670", alternateMobile: "9123456780", gender: "female", dateOfBirth: null }}
      emailVerified={false}
      onVerifyEmail={() => toast({ title: "Verification link sent to priya.r@gmail.com", tone: "success" })}
      {...handlers}
    />
  </Card>
);

import { BadgeCheck, CircleAlert, Mail, Phone } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { formatDate, formatPhone } from "@/lib/format";

export type ProfileHeaderProps = {
  name: string;
  avatar?: string;
  email?: string;
  emailVerified?: boolean;
  mobile?: string;
  mobileVerified?: boolean;
  tier?: string;
  memberSince?: string;
  /** Right-aligned action, e.g. Edit profile. */
  action?: React.ReactNode;
  /** Replaces the avatar, e.g. AvatarUpload. */
  avatarSlot?: React.ReactNode;
  className?: string;
};

function Contact({ icon, value, verified }: { icon: React.ReactNode; value: string; verified?: boolean }) {
  return (
    <li className="flex flex-wrap items-center gap-1.5 text-body text-fg-muted [&>svg]:size-icon-sm">
      {icon}
      <span className="text-fg figures">{value}</span>
      {verified === true && (
        <span className="inline-flex items-center gap-0.5 text-caption text-success-fg">
          <BadgeCheck aria-hidden className="size-icon-sm" /> Verified
        </span>
      )}
      {verified === false && (
        <span className="inline-flex items-center gap-0.5 text-caption text-warning-fg">
          <CircleAlert aria-hidden className="size-icon-sm" /> Not verified
        </span>
      )}
    </li>
  );
}

/** Who this account belongs to: avatar, name, tier, verified contacts and tenure. Server-safe. */
export function ProfileHeader({ name, avatar, email, emailVerified, mobile, mobileVerified, tier, memberSince, action, avatarSlot, className }: ProfileHeaderProps) {
  return (
    <Card asChild className={cn("sm:flex-row sm:items-center", className)}>
      <section data-slot="profile-header" aria-label="Profile">
        {avatarSlot ?? <Avatar name={name} src={avatar} size="xl" />}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-heading-lg">{name}</h1>
            {tier && <Badge tone="accent">{tier} member</Badge>}
          </div>
          <ul className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:gap-x-5">
            {email && <Contact icon={<Mail aria-hidden />} value={email} verified={emailVerified} />}
            {mobile && <Contact icon={<Phone aria-hidden />} value={formatPhone(mobile)} verified={mobileVerified} />}
          </ul>
          {memberSince && <p className="text-caption text-fg-muted">Member since {formatDate(memberSince, { month: "long", year: "numeric" })}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </section>
    </Card>
  );
}

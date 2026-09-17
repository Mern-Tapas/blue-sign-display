import { cva, type VariantProps } from "class-variance-authority";
import { Avatar as AvatarPrimitive } from "radix-ui";
import { cn } from "@/lib/cn";

export const avatarVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-pill bg-accent-soft font-medium text-accent-soft-fg select-none",
  {
    variants: {
      size: {
        xs: "size-6 text-[0.625rem]",
        sm: "size-8 text-caption",
        md: "size-10 text-label",
        lg: "size-12 text-body",
        xl: "size-16 text-body-lg",
      },
    },
    defaultVariants: { size: "md" },
  },
);

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

export type AvatarProps = React.ComponentProps<typeof AvatarPrimitive.Root> &
  VariantProps<typeof avatarVariants> & {
    name: string;
    src?: string;
  };

export function Avatar({ name, src, size, className, ...props }: AvatarProps) {
  return (
    <AvatarPrimitive.Root data-slot="avatar" className={cn(avatarVariants({ size }), className)} {...props}>
      {src && <AvatarPrimitive.Image src={src} alt={name} className="size-full object-cover" />}
      <AvatarPrimitive.Fallback delayMs={src ? 400 : 0} aria-label={name}>
        {initials(name)}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}

export type AvatarGroupProps = React.ComponentProps<"div"> &
  VariantProps<typeof avatarVariants> & {
    people: { name: string; src?: string }[];
    max?: number;
  };

export function AvatarGroup({ people, max = 4, size = "md", className, ...props }: AvatarGroupProps) {
  const shown = people.slice(0, max);
  const rest = people.length - shown.length;
  return (
    <div data-slot="avatar-group" className={cn("flex items-center -space-x-2.5", className)} {...props}>
      {shown.map((p) => (
        <Avatar key={p.name} name={p.name} src={p.src} size={size} className="ring-2 ring-surface" />
      ))}
      {rest > 0 && (
        <span
          className={cn(avatarVariants({ size }), "bg-accent text-fg-on-accent ring-2 ring-surface")}
          aria-label={`${rest} more`}
        >
          +{rest}
        </span>
      )}
    </div>
  );
}

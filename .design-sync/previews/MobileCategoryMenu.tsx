import { useEffect, useState } from "react";
import { MobileCategoryMenu, sampleData } from "@bluesigns/ui";

const { navCategories } = sampleData;

const links = [
  { href: "/shop?sort=newest", label: "New in" },
  { href: "/shop?sale=1", label: "Offers" },
  { href: "/account/orders", label: "Orders" },
];

function Open(props: { userName?: string; drillInto?: string; withSignIn?: boolean }) {
  const [open, setOpen] = useState(true);
  // The sheet focuses its close button on open; drop that ring so the resting state is shown.
  useEffect(() => {
    const t = window.setTimeout(() => (document.activeElement as HTMLElement | null)?.blur(), 400);
    return () => window.clearTimeout(t);
  }, []);
  useEffect(() => {
    if (!props.drillInto) return;
    const t = window.setTimeout(() => {
      document.querySelector<HTMLButtonElement>(`[data-slot='mobile-category-menu'] button[aria-label^='${props.drillInto}']`)?.click();
    }, 80);
    return () => window.clearTimeout(t);
  }, [props.drillInto]);
  return (
    <MobileCategoryMenu
      open={open}
      onOpenChange={setOpen}
      categories={navCategories}
      links={links}
      userName={props.userName}
      onSignIn={props.withSignIn ? () => {} : undefined}
    />
  );
}

export const SignedIn = () => <Open userName="Sujon Ahmed" />;

export const SignedOut = () => <Open withSignIn />;

export const SubcategoryLevel = () => <Open userName="Sujon Ahmed" drillInto={navCategories[2]!.name} />;

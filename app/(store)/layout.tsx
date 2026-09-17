import { SiteFooter } from "@/components/store/site-footer";
import { SiteHeader } from "@/components/store/site-header";
import { SkipLink } from "@/components/ui/skip-link";

export default function StoreLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SkipLink />
      <SiteHeader />
      <main id="main" className="flex-1 pt-8 pb-16">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}

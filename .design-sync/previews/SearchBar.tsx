import { useEffect, useRef } from "react";
import { SearchBar, sampleData } from "@bluesigns/ui";

const { products } = sampleData;

const suggestions = products.map((p) => ({ id: p.slug, label: p.name, meta: p.brand }));

// SearchBar keeps its query and open state internally. For these static previews we focus the
// field (shows recent searches) or type a query into it once on mount.
function Drive({ query, children }: { query?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const input = ref.current?.querySelector("input");
    if (!input) return;
    input.focus();
    if (query) {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
      setter?.call(input, query);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }, [query]);
  return (
    <div ref={ref} style={{ maxWidth: 440, minHeight: 320 }}>
      {children}
    </div>
  );
}

export const Suggestions = () => (
  <Drive query="wat">
    <SearchBar suggestions={suggestions} recent={["Headphones", "Hoodie"]} />
  </Drive>
);

export const RecentSearches = () => (
  <Drive>
    <SearchBar suggestions={suggestions} recent={["Headphones", "Running shoes", "Hoodie"]} />
  </Drive>
);

export const Variants = () => (
  <div className="flex flex-col gap-3" style={{ maxWidth: 440 }}>
    <SearchBar suggestions={suggestions} size="sm" placeholder="Search orders" />
    <SearchBar suggestions={suggestions} />
    <SearchBar suggestions={suggestions} variant="surface" size="lg" placeholder="Search for products, brands and more" />
  </div>
);

export const NoMatches = () => (
  <Drive query="saree">
    <SearchBar suggestions={suggestions} />
  </Drive>
);

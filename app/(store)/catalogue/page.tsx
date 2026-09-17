import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { CatalogueCard } from "@/components/store/catalogue-card";
import { CatalogueToolbar } from "@/components/store/catalogue-toolbar";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { activeCategories, catalogueProducts, getCatalogueCategory, searchCatalogue } from "@/lib/data/catalogue";

export const metadata: Metadata = {
  title: "Product catalogue",
  description: "Digital signage, kiosks, touch displays, POS, mini PCs, refurbished laptops and desktops, and software.",
};

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function CataloguePage({ searchParams }: PageProps<"/catalogue">) {
  const params = await searchParams;
  const current = getCatalogueCategory(first(params.category));
  const query = first(params.q) ?? "";
  const results = searchCatalogue({ query, category: current?.slug });

  return (
    <div className="container-ds flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Catalogue", href: current ? "/catalogue" : undefined },
            ...(current ? [{ label: current.name }] : []),
          ]}
        />
        <div className="flex flex-col gap-2">
          <h1 className="text-display-lg">
            {current ? current.name : "Product catalogue"}
            {!current && <span className="text-fg-muted">, all in one place</span>}
          </h1>
          <p className="line-clamp-3 max-w-3xl text-body-lg text-fg-muted">
            {current
              ? current.description || `${current.productCount} products in ${current.name}. Ask us for pricing and availability on any of them.`
              : `${catalogueProducts.length} products across ${activeCategories.length} categories: digital signage, kiosks, touch displays, POS, computing and software.`}
          </p>
        </div>
      </div>

      <CatalogueToolbar
        categories={activeCategories.map(({ slug, name, productCount }) => ({ slug, name, productCount }))}
        total={catalogueProducts.length}
        category={current?.slug ?? null}
        query={query}
      />

      <p className="-mt-4 text-body text-fg-muted" aria-live="polite">
        {results.length} {results.length === 1 ? "product" : "products"}
        {query && (
          <>
            {" "}
            for <span className="text-fg">“{query}”</span>
          </>
        )}
      </p>

      {results.length ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {results.map((p, i) => (
            <li key={p.slug}>
              <CatalogueCard product={p} categoryName={current ? undefined : getCatalogueCategory(p.category)?.name} preload={i < 4} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={<SearchX aria-hidden />}
          title="No products match"
          description="Try a different word or clear the category filter."
          action={
            <Button asChild variant="secondary">
              <Link href="/catalogue">Show all products</Link>
            </Button>
          }
        />
      )}
    </div>
  );
}

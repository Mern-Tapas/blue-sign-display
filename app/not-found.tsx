import type { Metadata } from "next";
import Link from "next/link";
import { BrandMark } from "@/components/layout/brand-mark";
import { NotFoundState } from "@/components/ui/not-found-state";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col px-(--gutter)">
      <header className="mx-auto flex w-full max-w-(--container-max) py-5">
        <Link href="/" aria-label="BlueSigns home" className="rounded-md focus-visible:outline-2 focus-visible:outline-focus-ring">
          <BrandMark />
        </Link>
      </header>
      <main id="main" className="flex flex-1 items-center justify-center">
        <NotFoundState />
      </main>
    </div>
  );
}

"use client";

import { Ticket } from "lucide-react";
import { CouponCard } from "@/components/product/coupon-card";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/cn";
import type { Coupon } from "@/lib/data/types";

export type CouponsWalletProps = {
  coupons: Coupon[];
  /** yyyy-mm-dd */
  today: string;
  className?: string;
};

/** The shopper's coupons split into Active and Expired, each with code copy, terms and expiry. */
export function CouponsWallet({ coupons, today, className }: CouponsWalletProps) {
  const active = coupons.filter((c) => !today || c.expiresOn >= today).sort((a, b) => a.expiresOn.localeCompare(b.expiresOn));
  const expired = coupons.filter((c) => today && c.expiresOn < today);
  const grid = (list: Coupon[], emptyText: string) =>
    list.length === 0 ? (
      <Card variant="outline" padding="none">
        <EmptyState compact icon={<Ticket aria-hidden />} title={emptyText} />
      </Card>
    ) : (
      <ul className="grid gap-3 md:grid-cols-2">
        {list.map((c) => (
          <li key={c.code}>
            <CouponCard coupon={c} today={today} className="h-full" />
          </li>
        ))}
      </ul>
    );

  return (
    <Tabs defaultValue="active" data-slot="coupons-wallet" className={cn(className)}>
      <TabsList>
        <TabsTrigger value="active" count={active.length}>
          Active
        </TabsTrigger>
        <TabsTrigger value="expired" count={expired.length}>
          Expired
        </TabsTrigger>
      </TabsList>
      <TabsContent value="active">{grid(active, "No active coupons right now")}</TabsContent>
      <TabsContent value="expired">{grid(expired, "No expired coupons")}</TabsContent>
    </Tabs>
  );
}

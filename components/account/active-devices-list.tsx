"use client";

import { useState } from "react";
import { Laptop, Smartphone, Tablet } from "lucide-react";
import { toast } from "@/components/providers/toast-store";
import { ConfirmDialog } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";
import type { Device } from "@/lib/data/account";

export type ActiveDevicesListProps = {
  devices: Device[];
  onSignOut: (deviceId: string) => Promise<void>;
  onSignOutOthers: () => Promise<void>;
  className?: string;
};

const icons = { phone: Smartphone, desktop: Laptop, tablet: Tablet };

/** Where the account is signed in, with this device marked, and sign-out per device or everywhere else. */
export function ActiveDevicesList({ devices, onSignOut, onSignOutOthers, className }: ActiveDevicesListProps) {
  const [list, setList] = useState(devices);
  const others = list.filter((d) => !d.current);

  return (
    <section data-slot="active-devices" aria-label="Signed-in devices" className={cn("flex flex-col gap-3", className)}>
      <Card asChild variant="outline" padding="none" className="divide-y divide-border-subtle overflow-hidden">
        <ul>
          {list.map((d) => {
            const Icon = icons[d.kind];
            return (
              <li key={d.id} className="flex flex-wrap items-center gap-3 p-4">
                <IconTile size="md" tone="muted">
                  <Icon />
                </IconTile>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="flex flex-wrap items-center gap-2 text-body-strong">
                    {d.name}
                    {d.current && (
                      <Badge tone="success" size="sm">
                        This device
                      </Badge>
                    )}
                  </span>
                  <span className="text-caption text-fg-muted">
                    {d.location} · {d.current ? "Active now" : `Last active ${formatDate(d.lastActive, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}`}
                  </span>
                </div>
                {!d.current && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={async () => {
                      await onSignOut(d.id);
                      setList((l) => l.filter((x) => x.id !== d.id));
                      toast({ title: `Signed out of ${d.name}`, tone: "info" });
                    }}
                  >
                    Sign out
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      </Card>
      {others.length > 0 && (
        <ConfirmDialog
          trigger={
            <Button variant="ghost" className="self-start text-danger-fg">
              Sign out of all other devices
            </Button>
          }
          tone="danger"
          title={`Sign out of ${others.length} other ${others.length === 1 ? "device" : "devices"}?`}
          description="You’ll stay signed in here. Anyone using those devices will need your password or an OTP to sign in again."
          confirmLabel="Sign out others"
          onConfirm={async () => {
            await onSignOutOthers();
            setList((l) => l.filter((x) => x.current));
            toast({ title: "Signed out of other devices", tone: "success" });
          }}
        />
      )}
      <p className="text-caption text-fg-muted">Don’t recognise a device? Sign it out and change your password.</p>
    </section>
  );
}

"use client";

import { useState } from "react";
import {
  Copy,
  Filter,
  HelpCircle,
  LogOut,
  MapPin,
  MoreHorizontal,
  Package,
  Pencil,
  Settings,
  Share2,
  Trash2,
  User,
} from "lucide-react";
import { DsGrid, DsPreview } from "@/components/docs/ds-section";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogBody, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field } from "@/components/ui/field";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select } from "@/components/ui/select";
import { Sheet, SheetBody, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip } from "@/components/ui/tooltip";
import { toast } from "@/components/providers/toast-store";

export function OverlaysDemo() {
  const [density, setDensity] = useState("comfortable");
  const [showSold, setShowSold] = useState(true);
  return (
    <DsGrid>
      <DsPreview label="Dialog">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" leadingIcon={<MapPin aria-hidden />}>
              Edit address
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader icon={<MapPin aria-hidden />} title="Shipping address" description="Used for this and future orders." />
            <DialogBody className="flex flex-col gap-4">
              <Field label="Street">
                <Input defaultValue="Flat 402, Prestige Lakeside" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="City">
                  <Input defaultValue="Bengaluru" />
                </Field>
                <Field label="State">
                  <Select
                    defaultValue="KA"
                    options={[
                      { value: "KA", label: "Karnataka" },
                      { value: "MH", label: "Maharashtra" },
                      { value: "DL", label: "Delhi" },
                    ]}
                  />
                </Field>
              </div>
              <Checkbox label="Set as default address" defaultChecked />
            </DialogBody>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button onClick={() => toast({ title: "Address saved", tone: "success" })}>Save address</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="danger" leadingIcon={<Trash2 aria-hidden />}>
              Delete
            </Button>
          </DialogTrigger>
          <DialogContent size="sm" aria-describedby={undefined}>
            <DialogHeader title="Remove all items?" />
            <DialogBody>
              <p className="text-body text-fg-muted">This clears 4 items from your cart. You can’t undo this.</p>
            </DialogBody>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Keep items</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button variant="danger">Remove all</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DsPreview>

      <DsPreview label="Sheet: right, left and bottom">
        {(["right", "left", "bottom"] as const).map((side) => (
          <Sheet key={side}>
            <SheetTrigger asChild>
              <Button variant="secondary" leadingIcon={side === "left" ? <Filter aria-hidden /> : undefined} className="capitalize">
                {side}
              </Button>
            </SheetTrigger>
            <SheetContent side={side}>
              <SheetHeader title={side === "left" ? "Filters" : "Sheet"} description={`Slides in from the ${side}.`} />
              <SheetBody className="flex flex-col gap-3 pb-4">
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="h-16 rounded-lg bg-surface-sunken" />
                ))}
              </SheetBody>
              <SheetFooter>
                <SheetClose asChild>
                  <Button fullWidth>Apply</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        ))}
      </DsPreview>

      <DsPreview label="Dropdown menu">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" leadingIcon={<User aria-hidden />}>
              Account
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Sujon Ahmed</DropdownMenuLabel>
            <DropdownMenuItem>
              <Package aria-hidden /> Orders
            </DropdownMenuItem>
            <DropdownMenuItem shortcut="⌘,">
              <Settings aria-hidden /> Settings
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <HelpCircle aria-hidden /> Help
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Shipping</DropdownMenuItem>
                <DropdownMenuItem>Returns</DropdownMenuItem>
                <DropdownMenuItem>Contact us</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive>
              <LogOut aria-hidden /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IconButton label="More actions">
              <MoreHorizontal aria-hidden />
            </IconButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52">
            <DropdownMenuItem>
              <Pencil aria-hidden /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy aria-hidden /> Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share2 aria-hidden /> Share
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Density</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={density} onValueChange={setDensity}>
              <DropdownMenuRadioItem value="comfortable">Comfortable</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="compact">Compact</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked={showSold} onCheckedChange={setShowSold}>
              Show sold out
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </DsPreview>

      <DsPreview label="Tooltip and popover">
        <Tooltip content="Free returns within 30 days">
          <Button variant="secondary">Hover me</Button>
        </Tooltip>
        <Tooltip content="Share" side="bottom">
          <IconButton label="Share product">
            <Share2 aria-hidden />
          </IconButton>
        </Tooltip>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="soft">Size guide</Button>
          </PopoverTrigger>
          <PopoverContent>
            <p className="text-body-strong">Find your size</p>
            <p className="mt-1 text-caption text-fg-muted">Measure your foot from heel to longest toe.</p>
            <div className="mt-3 grid grid-cols-3 gap-1.5 text-center text-caption figures">
              {["EU 40 · 25.4cm", "EU 41 · 26cm", "EU 42 · 26.7cm"].map((s) => (
                <span key={s} className="rounded-sm bg-surface-sunken px-2 py-2">
                  {s}
                </span>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </DsPreview>
    </DsGrid>
  );
}

"use client";

import { useState } from "react";
import { DsGrid, DsPreview } from "@/components/docs/ds-section";
import { addDays, Calendar, startOfDay } from "@/components/ui/calendar";
import { DatePicker } from "@/components/ui/date-picker";
import { Field } from "@/components/ui/field";
import { FileUpload } from "@/components/ui/file-upload";
import { EXPRESS_FEE } from "@/lib/data/india";

// Fixed reference date so server and client render the same month
const REF = new Date(2026, 8, 15);
const isSunday = (d: Date) => d.getDay() === 0;

export function CalendarDemo() {
  const [day, setDay] = useState<Date | null>(addDays(REF, 2));
  const min = addDays(REF, 1);
  const max = addDays(REF, 21);
  return (
    <DsGrid>
      <DsPreview label="Calendar · delivery date" className="flex-col items-start" code={`<Calendar min={tomorrow} max={in3Weeks} isDateDisabled={isSunday} renderDayNote={fee} />`}>
        <Calendar
          value={day}
          onValueChange={setDay}
          defaultMonth={REF}
          min={min}
          max={max}
          isDateDisabled={isSunday}
          weekStartsOn={1}
          renderDayNote={(d) => (startOfDay(d).getTime() === min.getTime() ? `₹${EXPRESS_FEE}` : null)}
          aria-label="Delivery date"
        />
        <p className="text-caption text-fg-muted">No Sunday deliveries · next-day delivery costs ₹{EXPRESS_FEE} · arrows, PageUp / PageDown to move.</p>
      </DsPreview>
      <DsPreview label="DatePicker" className="flex-col items-stretch" overflowVisible>
        <Field label="Date of birth" hint="Used for birthday offers only.">
          <DatePicker captionLayout="dropdown" defaultMonth={new Date(1995, 5, 1)} fromYear={1930} toYear={2012} max={new Date(2012, 11, 31)} placeholder="DD MMM YYYY" clearable />
        </Field>
        <Field label="Pickup date" required>
          <DatePicker defaultValue={addDays(REF, 3)} min={addDays(REF, 1)} max={addDays(REF, 7)} defaultMonth={REF} format={{ weekday: "short", day: "numeric", month: "short" }} />
        </Field>
        <Field label="Disabled">
          <DatePicker disabled placeholder="Not editable" />
        </Field>
      </DsPreview>
    </DsGrid>
  );
}

export function FileUploadDemo() {
  return (
    <DsGrid>
      <DsPreview label="FileUpload · review photos" className="flex-col items-stretch">
        <Field label="Add photos" hint="Photos help other shoppers — no faces or personal details, please.">
          <FileUpload accept="image/*" maxFiles={4} maxSize={5 * 1024 * 1024} />
        </Field>
      </DsPreview>
      <DsPreview label="Compact · list" className="flex-col items-stretch">
        <Field label="Attach invoice or screenshot">
          <FileUpload variant="button" layout="list" accept="image/*,.pdf" maxFiles={3} maxSize={2 * 1024 * 1024} />
        </Field>
        <Field label="Disabled">
          <FileUpload disabled multiple={false} accept="image/*" />
        </Field>
      </DsPreview>
    </DsGrid>
  );
}

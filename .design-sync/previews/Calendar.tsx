import { Calendar, sampleData } from "@bluesigns/ui";

const { EXPRESS_FEE } = sampleData;

// Fixed reference date so the preview always shows the same month.
const REF = new Date(2026, 8, 15);
const day = (n: number) => new Date(2026, 8, 15 + n);
const isSunday = (d: Date) => d.getDay() === 0;

export const DeliveryDate = () => (
  <div className="flex flex-col gap-2" style={{ maxWidth: 340 }}>
    <Calendar
      defaultValue={day(2)}
      defaultMonth={REF}
      min={day(1)}
      max={day(21)}
      isDateDisabled={isSunday}
      weekStartsOn={1}
      renderDayNote={(d) => (d.getTime() === day(1).getTime() ? `₹${EXPRESS_FEE}` : null)}
      aria-label="Delivery date"
    />
    <p className="text-caption text-fg-muted">No Sunday deliveries · next-day delivery costs ₹{EXPRESS_FEE}</p>
  </div>
);

export const DateOfBirth = () => (
  <div style={{ maxWidth: 340 }}>
    <Calendar
      captionLayout="dropdown"
      fromYear={1930}
      toYear={2012}
      defaultValue={new Date(1995, 5, 14)}
      max={new Date(2012, 11, 31)}
      aria-label="Date of birth"
    />
  </div>
);

export const Unselected = () => (
  <div style={{ maxWidth: 340 }}>
    <Calendar defaultMonth={REF} aria-label="Pickup date" />
  </div>
);

import { CouponBuilder, Sheet, SheetContent, sampleData } from "@bluesigns/ui";

const { adminCoupons } = sampleData;
const codes = adminCoupons.map((c) => c.code);
const festive = adminCoupons.find((c) => c.code === "FESTIVE15")!;

export const CreateCoupon = () => (
  <Sheet open>
    <SheetContent side="right" className="max-w-xl" aria-describedby={undefined} onOpenAutoFocus={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
      <CouponBuilder mode="create" existingCodes={codes} onSave={() => {}} onCancel={() => {}} />
    </SheetContent>
  </Sheet>
);

export const EditScheduled = () => (
  <Sheet open>
    <SheetContent side="right" className="max-w-xl" aria-describedby={undefined} onOpenAutoFocus={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
      <CouponBuilder
        mode="edit"
        initial={{ ...festive, perCustomerLimit: 1, eligibility: "all", stackable: false }}
        existingCodes={codes}
        onSave={() => {}}
        onCancel={() => {}}
      />
    </SheetContent>
  </Sheet>
);

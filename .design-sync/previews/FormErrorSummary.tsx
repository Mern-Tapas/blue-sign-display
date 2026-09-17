import { Field, FormErrorSummary, Input } from "@bluesigns/ui";

export const AfterSubmit = () => (
  <div style={{ maxWidth: 480 }}>
    <FormErrorSummary
      result={{
        errors: {
          "addr-name": "Enter the recipient’s full name",
          "addr-phone": "Enter a valid 10-digit mobile number",
          "addr-pincode": "We don’t deliver to 000000 yet",
        },
        order: ["addr-name", "addr-phone", "addr-pincode"],
      }}
    />
  </div>
);

export const SingleProblem = () => (
  <div style={{ maxWidth: 480 }}>
    <FormErrorSummary
      title="Fix this before saving the product"
      result={{ errors: { price: "Selling price can’t be higher than the MRP (₹4,999)" }, order: ["price"] }}
    />
  </div>
);

export const WithForm = () => (
  <div className="flex flex-col gap-4" style={{ maxWidth: 480 }}>
    <FormErrorSummary
      result={{
        errors: { "gst-number": "Check the state code and the Z in the 14th place.", "gst-name": "Enter the business name on the certificate" },
        order: ["gst-number", "gst-name"],
      }}
    />
    <Field id="gst-number" label="GSTIN" error="Check the state code and the Z in the 14th place." announce="off">
      <Input defaultValue="29AAECL48" />
    </Field>
    <Field id="gst-name" label="Business name" error="Enter the business name on the certificate" announce="off">
      <Input placeholder="Lakeside Retail Pvt Ltd" />
    </Field>
  </div>
);

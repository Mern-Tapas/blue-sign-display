import { Field, Select, icons } from "@bluesigns/ui";

const { Home, Briefcase } = icons;

export const WithField = () => (
  <div style={{ maxWidth: 320 }}>
    <Field label="Address type">
      <Select
        defaultValue="home"
        options={[
          { value: "home", label: "Home (all day delivery)", icon: <Home aria-hidden /> },
          { value: "work", label: "Work (10 AM – 6 PM)", icon: <Briefcase aria-hidden /> },
        ]}
      />
    </Field>
  </div>
);

export const SortPrefix = () => (
  <div style={{ maxWidth: 280 }}>
    <Select
      aria-label="Sort products"
      prefix="Sort:"
      defaultValue="featured"
      variant="sunken"
      groups={[
        { label: "Popular", options: [{ value: "featured", label: "Featured" }, { value: "rating", label: "Top rated" }] },
        { label: "Price", options: [{ value: "price-asc", label: "Low to high" }, { value: "price-desc", label: "High to low" }] },
      ]}
    />
  </div>
);

export const States = () => (
  <div className="flex flex-col gap-3" style={{ maxWidth: 280 }}>
    <Select aria-label="Address type" placeholder="Select a type" options={[{ value: "home", label: "Home" }]} />
    <Select aria-label="State" aria-invalid placeholder="Select a state" options={[{ value: "KA", label: "Karnataka" }]} />
    <Select aria-label="City" disabled placeholder="Pick a state first" options={[]} />
  </div>
);

export const Sizes = () => (
  <div className="flex flex-col gap-3" style={{ maxWidth: 280 }}>
    <Select aria-label="Rows, small" size="sm" defaultValue="10" options={[{ value: "10", label: "10 per page" }]} />
    <Select aria-label="Rows, medium" size="md" defaultValue="20" options={[{ value: "20", label: "20 per page" }]} />
    <Select aria-label="Rows, large" size="lg" shape="rounded" defaultValue="50" options={[{ value: "50", label: "50 per page" }]} />
  </div>
);

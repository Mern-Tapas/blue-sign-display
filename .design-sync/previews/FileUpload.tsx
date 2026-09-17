import { Field, FileUpload, sampleData } from "@bluesigns/ui";

const { products } = sampleData;

const photo = (name: string, url: string) => ({
  id: name,
  file: new File(["x".repeat(1_240_000)], name, { type: "image/jpeg" }),
  url,
});

export const ReviewPhotos = () => (
  <div style={{ maxWidth: 440 }}>
    <Field label="Add photos" hint="Photos help other shoppers — no faces or personal details, please.">
      <FileUpload
        accept="image/*"
        maxFiles={4}
        maxSize={5 * 1024 * 1024}
        defaultValue={[photo("watch-dial.jpg", products[2]!.images[0]!), photo("watch-strap.jpg", products[2]!.images[1] ?? products[2]!.images[0]!)]}
      />
    </Field>
  </div>
);

export const Empty = () => (
  <div style={{ maxWidth: 440 }}>
    <FileUpload accept="image/*" maxFiles={4} maxSize={5 * 1024 * 1024} />
  </div>
);

export const ListWithProgress = () => (
  <div style={{ maxWidth: 440 }}>
    <FileUpload
      accept="image/*,.pdf"
      layout="list"
      title="Add files to your return request"
      defaultValue={[
        { id: "inv", file: new File(["x".repeat(184_000)], "invoice-LM-200600.pdf", { type: "application/pdf" }), status: "done", progress: 100 },
        { id: "box", file: new File(["x".repeat(2_300_000)], "headphones-damage.jpg", { type: "image/jpeg" }), url: products[1]!.images[0], status: "uploading", progress: 64 },
        { id: "tag", file: new File(["x".repeat(920_000)], "price-tag.heic", { type: "image/heic" }), status: "error", error: "Server rejected this file" },
      ]}
    />
  </div>
);

export const CompactButton = () => (
  <div className="flex flex-col gap-4" style={{ maxWidth: 440 }}>
    <Field label="Attach invoice or screenshot">
      <FileUpload variant="button" layout="list" accept="image/*,.pdf" maxFiles={3} maxSize={2 * 1024 * 1024} />
    </Field>
    <Field label="Disabled">
      <FileUpload variant="button" disabled multiple={false} accept="image/*" />
    </Field>
  </div>
);

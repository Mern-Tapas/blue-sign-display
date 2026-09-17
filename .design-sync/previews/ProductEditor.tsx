import { ProductEditor, sampleData } from "@bluesigns/ui";

const admin = sampleData.adminProducts[0]!;
const product = sampleData.products.find((p) => p.id === admin.id)!;

/** Edit mode: a draft built from the admin product (same shape the /admin/products/[id] page passes). */
const editDraft = {
  name: admin.name,
  brand: admin.brand,
  category: admin.category,
  description: product.description,
  highlights: product.features.length ? product.features : [""],
  mrp: String(admin.mrp),
  price: String(admin.price),
  cost: String(Math.round((admin.price * 0.52) / 10) * 10),
  gstRate: String(admin.gstRate) as "5" | "12" | "18",
  hsn: admin.hsn,
  variants: admin.variants.map((v, i) => ({ id: `v-${i + 1}`, label: v.label, sku: v.sku, stock: String(v.stock) })),
  weight: "350",
  length: "22",
  width: "20",
  height: "9",
  returnable: true,
  returnWindow: "10",
  seoTitle: `${admin.name} by ${admin.brand} | BlueSigns`,
  slug: admin.slug,
  metaDescription: product.description.slice(0, 155),
  status: admin.status,
  images: product.images.map((src, i) => ({ id: `img-${i + 1}`, src })),
  collections: ["Bestsellers", "Gifting"],
  tags: `${product.category}, ${admin.brand.toLowerCase()}`,
};

/** Create mode: the empty draft for /admin/products/new. */
const newDraft = {
  name: "",
  brand: null,
  category: "",
  description: "",
  highlights: [""],
  mrp: "",
  price: "",
  cost: "",
  gstRate: "18" as const,
  hsn: "",
  variants: [{ id: "v-1", label: "Default", sku: "", stock: "0" }],
  weight: "",
  length: "",
  width: "",
  height: "",
  returnable: true,
  returnWindow: "10",
  seoTitle: "",
  slug: "",
  metaDescription: "",
  status: "draft" as const,
  images: [],
  collections: [],
  tags: "",
};

export const EditProduct = () => (
  <div className="flex flex-col gap-6" style={{ width: 1200 }}>
    <ProductEditor
      initial={editDraft}
      meta={{ id: admin.id, sku: admin.sku, sold30d: admin.sold30d, updatedAt: admin.updatedAt, storefrontSlug: admin.slug }}
    />
  </div>
);

export const NewProduct = () => (
  <div className="flex flex-col gap-6" style={{ width: 1200 }}>
    <ProductEditor initial={newDraft} meta={{ id: null, sku: "", sold30d: 0, updatedAt: null, storefrontSlug: null }} />
  </div>
);

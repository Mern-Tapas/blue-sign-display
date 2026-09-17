import { avatars } from "./images";
import { categories, products } from "./products";

/** Demo signed-in user. */
export const demoUser = {
  name: "Sujon Ahmed",
  firstName: "Sujon",
  email: "sujon@bluesigns.shop",
  mobile: "9876543210",
  avatar: avatars.noah,
  pincode: "560066",
  tier: "Gold",
  points: 1840,
};

export const navCategories = categories.map(({ slug, name, image, subcategories }) => ({ slug, name, image, subcategories }));

export const searchSuggestions = products.map((p) => ({ id: p.slug, label: p.name, meta: p.brand, image: p.images[0] }));

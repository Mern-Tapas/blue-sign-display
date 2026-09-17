import { ProductsTable, sampleData } from "@bluesigns/ui";

export const B1Few = () => <ProductsTable initialProducts={sampleData.adminProducts.slice(0, 3)} />;

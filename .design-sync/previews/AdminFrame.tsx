import { AdminFrame, Button, icons, KpiRow, KpiTile, PageHeader, sampleData } from "@bluesigns/ui";

const { Download, Plus } = icons;
const last14 = sampleData.dailySales.slice(-14);

export const WithPage = () => (
  <div style={{ width: "100%", height: 720, overflow: "hidden" }}>
    <AdminFrame>
      <PageHeader
        title="Products"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Products" }]}
        meta={<span>{sampleData.adminProducts.length} products · GST-inclusive prices · demo data</span>}
        actions={
          <>
            <Button variant="secondary" leadingIcon={<Download aria-hidden />}>
              Export
            </Button>
            <Button leadingIcon={<Plus aria-hidden />}>Add product</Button>
          </>
        }
      />
      <KpiRow>
        <KpiTile label="Net sales" value="₹1.01Cr" delta={{ value: 9.1, period: "vs previous 30 days" }} trend={last14.map((d) => d.revenue)} />
        <KpiTile label="Units sold" value="1,482" delta={{ value: 4.6, period: "vs previous 30 days" }} trend={last14.map((d) => d.orders)} />
        <KpiTile label="Low stock" value={String(sampleData.pendingWork.lowStock)} note="at or below reorder point" />
        <KpiTile label="Drafts" value="1" note="not visible on the storefront" />
      </KpiRow>
    </AdminFrame>
  </div>
);

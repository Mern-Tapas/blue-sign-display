import { Button, icons, PageHeader, StatusPill } from "@bluesigns/ui";

const { Download } = icons;

export const WithActions = () => (
  <div style={{ width: 640 }}>
    <PageHeader
      title="Orders"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Orders" }]}
      meta={<span>120 orders · last 30 days · demo data</span>}
      actions={
        <>
          <Button variant="secondary" leadingIcon={<Download aria-hidden />}>
            Export
          </Button>
          <Button>Create order</Button>
        </>
      }
    />
  </div>
);

export const RecordDetail = () => (
  <div style={{ width: 640 }}>
    <PageHeader
      title="LM-200600"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Orders", href: "/admin/orders" }, { label: "LM-200600" }]}
      meta={
        <>
          <StatusPill tone="info" label="To pack" />
          <span>Placed 15 Sep, 10:42 am</span>
          <span>UPI · ₹4,298</span>
        </>
      }
      actions={
        <>
          <Button variant="ghost">Cancel order</Button>
          <Button>Mark as packed</Button>
        </>
      }
    />
  </div>
);

export const WithDescription = () => (
  <div style={{ width: 640 }}>
    <PageHeader title="Payouts & GST" description="Weekly settlements from Razorpay, the fees and taxes deducted from them, and your GSTR-1 summaries." />
  </div>
);

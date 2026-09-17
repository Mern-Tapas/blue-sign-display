import { Tabs, TabsContent, TabsList, TabsTrigger } from "@bluesigns/ui";

export const PillList = () => (
  <div style={{ maxWidth: 560 }}>
    <Tabs defaultValue="details">
      <TabsList>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="reviews" count={1284}>
          Reviews
        </TabsTrigger>
        <TabsTrigger value="shipping">Shipping</TabsTrigger>
      </TabsList>
      <TabsContent value="details" className="text-body text-fg-muted">
        Adaptive noise cancelling, 40-hour battery and memory-foam cushions.
      </TabsContent>
      <TabsContent value="reviews" className="text-body text-fg-muted">
        4.7 average from 1,284 verified buyers.
      </TabsContent>
      <TabsContent value="shipping" className="text-body text-fg-muted">
        Free delivery above ₹499. Express delivery available at checkout.
      </TabsContent>
    </Tabs>
  </div>
);

export const UnderlineList = () => (
  <div style={{ maxWidth: 560 }}>
    <Tabs defaultValue="open">
      <TabsList variant="underline">
        <TabsTrigger value="all">All orders</TabsTrigger>
        <TabsTrigger value="open" count={2}>
          Open
        </TabsTrigger>
        <TabsTrigger value="returns">Returns</TabsTrigger>
        <TabsTrigger value="cancelled" disabled>
          Cancelled
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="text-body text-fg-muted">
        All orders from the last 12 months.
      </TabsContent>
      <TabsContent value="open" className="text-body text-fg-muted">
        2 orders are being packed or shipped to Bengaluru.
      </TabsContent>
      <TabsContent value="returns" className="text-body text-fg-muted">
        No returns in progress.
      </TabsContent>
    </Tabs>
  </div>
);

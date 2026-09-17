import { Button, Card, CardContent, CardFooter, CardHeader, TextButton } from "@bluesigns/ui";

export const WithActions = () => (
  <div style={{ width: 380 }}>
    <Card>
      <CardHeader title="Home" description="Sujon Ahmed · +91 98765 43210" />
      <CardContent>
        <p className="text-body text-fg-muted">Flat 402, Prestige Lakeside, Whitefield, Bengaluru, Karnataka 560066</p>
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="secondary">
          Edit
        </Button>
        <Button size="sm" variant="ghost">
          Remove
        </Button>
      </CardFooter>
    </Card>
  </div>
);

export const SplitFooter = () => (
  <div style={{ width: 380 }}>
    <Card>
      <CardHeader title="Aura Wireless Headphones" description="Qty 1 · Sand" />
      <CardFooter className="justify-between">
        <span className="text-label figures">₹12,999</span>
        <TextButton size="sm">Move to wishlist</TextButton>
      </CardFooter>
    </Card>
  </div>
);

export const InteractiveOutline = () => (
  <div style={{ width: 320 }}>
    <Card variant="outline" interactive>
      <CardHeader title="Gift cards" description="2 active · ₹3,500 balance" />
      <CardFooter>
        <Button size="sm" variant="secondary">
          View details
        </Button>
      </CardFooter>
    </Card>
  </div>
);

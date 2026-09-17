import { Button, IconButton, icons, Tooltip } from "@bluesigns/ui";

const { Heart, Info, RotateCcw, Share2 } = icons;

export const Default = () => (
  <div className="flex pt-12">
    <Tooltip content="Free returns within 14 days">
      <Button variant="secondary" leadingIcon={<RotateCcw aria-hidden />} autoFocus>
        Easy returns
      </Button>
    </Tooltip>
  </div>
);

export const BottomOnIconButton = () => (
  <div className="flex gap-2">
    <Tooltip content="Save to wishlist" side="bottom">
      <IconButton label="Save to wishlist" autoFocus>
        <Heart aria-hidden />
      </IconButton>
    </Tooltip>
    <Tooltip content="Share" side="bottom">
      <IconButton label="Share product">
        <Share2 aria-hidden />
      </IconButton>
    </Tooltip>
  </div>
);

export const RightWithDetail = () => (
  <div className="flex items-center gap-1 text-body">
    <span className="text-fg-muted">Platform fee</span>
    <Tooltip content="A flat ₹9 per order covers payment processing and order support." side="right">
      <IconButton label="About the platform fee" variant="ghost" size="xs" autoFocus>
        <Info aria-hidden />
      </IconButton>
    </Tooltip>
    <span className="ml-auto figures" style={{ marginLeft: 240 }}>
      ₹9
    </span>
  </div>
);

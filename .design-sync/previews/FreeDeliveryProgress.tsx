import { FreeDeliveryProgress } from "@bluesigns/ui";

export const AlmostThere = () => (
  <div style={{ maxWidth: 400 }}>
    <FreeDeliveryProgress subtotal={349} />
  </div>
);

export const Unlocked = () => (
  <div style={{ maxWidth: 400 }}>
    <FreeDeliveryProgress subtotal={2999} />
  </div>
);

export const Inline = () => (
  <div className="flex flex-col gap-3" style={{ maxWidth: 400 }}>
    <FreeDeliveryProgress subtotal={199} variant="inline" />
    <FreeDeliveryProgress subtotal={1299} variant="inline" />
  </div>
);

export const CustomThreshold = () => (
  <div style={{ maxWidth: 400 }}>
    <FreeDeliveryProgress subtotal={650} threshold={999} fee={79} />
  </div>
);

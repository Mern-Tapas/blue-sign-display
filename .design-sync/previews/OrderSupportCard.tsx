import { OrderSupportCard, icons } from "@bluesigns/ui";

const { MapPin, Package, RotateCcw } = icons;

export const Default = () => (
  <div style={{ maxWidth: 400 }}>
    <OrderSupportCard orderId="LM-100482" />
  </div>
);

export const CustomTopics = () => (
  <div style={{ maxWidth: 400 }}>
    <OrderSupportCard
      orderId="LM-100377"
      topics={[
        { id: "return", label: "Start a return or exchange", href: "/help?topic=returns&order=LM-100377", icon: <RotateCcw /> },
        { id: "damaged", label: "Item arrived damaged", href: "/help?topic=damaged&order=LM-100377", icon: <Package /> },
        { id: "address", label: "Delivered to the wrong address", href: "/help?topic=address&order=LM-100377", icon: <MapPin /> },
      ]}
      phone="1800 419 0099"
      hours="9 AM – 9 PM, Mon–Sat"
    />
  </div>
);

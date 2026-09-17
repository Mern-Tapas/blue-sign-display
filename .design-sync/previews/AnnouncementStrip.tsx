import { AnnouncementStrip } from "@bluesigns/ui";

export const WithCode = () => (
  <div style={{ width: 760 }}>
    <AnnouncementStrip id="festive-2026" title="Festive Sale: extra 10% off" description="on orders above ₹1,999 · ends Sunday" code="FESTIVE10" />
  </div>
);

export const TitleOnly = () => (
  <div style={{ width: 760 }}>
    <AnnouncementStrip id="free-delivery" title="Free delivery on orders above ₹499 across India" />
  </div>
);

export const WithDescription = () => (
  <div style={{ width: 760 }}>
    <AnnouncementStrip id="cod-launch" title="Cash on Delivery now in 19,000+ PIN codes" description="Pay at your doorstep with UPI or cash" />
  </div>
);

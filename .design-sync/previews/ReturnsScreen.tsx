import { ReturnsScreen, sampleData } from "@bluesigns/ui";

const { adminReturns } = sampleData;

export const AllReturns = () => (
  <div className="flex flex-col gap-6 bg-canvas p-6" style={{ width: 1200 }}>
    <ReturnsScreen initialTab="all" />
  </div>
);

export const ReviewingARequest = () => (
  <div className="flex flex-col gap-6 bg-canvas p-6" style={{ width: 1200 }}>
    <ReturnsScreen initialTab="requested" initialReturnId={adminReturns.find((r) => r.status === "requested")!.id} />
  </div>
);

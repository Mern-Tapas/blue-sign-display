import { RateProductPrompt, sampleData, toast } from "@bluesigns/ui";

const { getProduct } = sampleData;
const hoodie = getProduct("fleece-hoodie")!;
const sneaker = getProduct("velocity-runner-red")!;

export const Default = () => (
  <div style={{ maxWidth: 480 }}>
    <RateProductPrompt product={{ name: hoodie.name, image: hoodie.images[0]! }} aspects={["Fit", "Fabric quality"]} onDismiss={() => toast({ title: "We’ll ask later" })} />
  </div>
);

export const Stacked = () => (
  <div className="flex flex-col gap-3" style={{ maxWidth: 480 }}>
    <RateProductPrompt product={{ name: sneaker.name, image: sneaker.images[0]! }} aspects={["Comfort", "Fit", "Grip"]} />
    <RateProductPrompt product={{ name: hoodie.name, image: hoodie.images[0]! }} />
  </div>
);

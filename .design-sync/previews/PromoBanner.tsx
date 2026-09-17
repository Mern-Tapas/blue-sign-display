import { Button, icons, PromoBanner } from "@bluesigns/ui";

const { ArrowRight } = icons;

export const Hero = () => (
  <div style={{ maxWidth: 860 }}>
    <PromoBanner
      eyebrow="Festive sale · ends Sunday"
      title="Up to 40% off audio"
      description="Noise cancelling headphones and speakers, while stock lasts."
      code="BLUESIGNS20"
    />
  </div>
);

export const Contrast = () => (
  <div style={{ maxWidth: 860 }}>
    <PromoBanner
      variant="contrast"
      eyebrow="New customers"
      title="Flat ₹500 off your first order"
      description="On orders above ₹1,999. Free delivery across Bengaluru in 2 days."
      code="FIRST500"
      action={
        <Button variant="inverse" size="lg" trailingIcon={<ArrowRight aria-hidden />}>
          Start shopping
        </Button>
      }
    />
  </div>
);

export const Strip = () => (
  <div className="flex flex-col gap-3" style={{ maxWidth: 860 }}>
    <PromoBanner variant="strip" title="Free delivery above ₹499" description="· 14-day easy returns" code="FREESHIP" className="rounded-pill" />
    <PromoBanner variant="strip" title="Festive sale is live" description="· Extra 10% off with HDFC Bank cards" onDismiss={() => {}} />
  </div>
);

import { HeroCarousel, sampleData } from "@bluesigns/ui";

const { heroSlides } = sampleData;

export const Campaigns = () => (
  <div style={{ width: 1100 }}>
    <HeroCarousel slides={heroSlides} autoplay={0} />
  </div>
);

export const TextOnTheRight = () => (
  <div style={{ width: 1100 }}>
    <HeroCarousel slides={[heroSlides[1]!, heroSlides[2]!]} autoplay={0} aria-label="Footwear campaigns" />
  </div>
);

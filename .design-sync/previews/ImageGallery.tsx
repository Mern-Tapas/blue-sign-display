import { Badge, ImageGallery, sampleData } from "@bluesigns/ui";

const { getProduct } = sampleData;
const headphones = getProduct("aura-wireless-headphones")!;
const hoodie = getProduct("fleece-hoodie")!;
const lamp = getProduct("orbit-table-lamp")!;

export const WithThumbnails = () => (
  <div style={{ maxWidth: 560 }}>
    <ImageGallery images={headphones.images} alt={headphones.name} overlay={<Badge tone="sale">-22%</Badge>} />
  </div>
);

export const WithBadges = () => (
  <div style={{ maxWidth: 560 }}>
    <ImageGallery
      images={hoodie.images}
      alt={hoodie.name}
      overlay={
        <>
          <Badge tone="inverse">Bestseller</Badge>
          <Badge tone="sale">Sale</Badge>
        </>
      }
    />
  </div>
);

export const SingleImage = () => (
  <div style={{ maxWidth: 420 }}>
    <ImageGallery images={[lamp.images[0]!]} alt={lamp.name} />
  </div>
);

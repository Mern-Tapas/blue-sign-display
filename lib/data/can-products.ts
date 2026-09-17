/**
 * CAN digital signage catalogue. Every figure comes from the CAN product brochure
 * (www.cansignage.com). Nothing here is priced: the store sells on enquiry.
 */

export type Placement = "floor" | "portable" | "wall" | "desk";
export type Resolution = "HD" | "Full HD" | "4K Ultra HD";
export type AppName = "YouTube" | "Media Center" | "Web Browser" | "Android" | "IQ World";

export type ProductImage = { src: string; alt: string; width: number; height: number };

export type Model = {
  /** Model code as printed, e.g. "CANLit Pro 4301". */
  name: string;
  /** Diagonal in inches. */
  size: number;
  /** Panel resolution as printed in the brochure. */
  pixels?: string;
  brightness?: number;
  /** Extra line printed after the model, e.g. "with wheels". */
  note?: string;
  /** W x H x D in inches. */
  dimensions?: string;
  netWeight?: string;
  grossWeight?: string;
};

export type SpecRow = { label: string; value: string };
export type SpecGroup = { title: string; rows: SpecRow[] };

export type Series = {
  slug: string;
  name: string;
  /** Brochure strapline, e.g. "Best and brightest." */
  eyebrow: string;
  /** Brochure headline, e.g. "Show your best." */
  headline: string;
  summary: string;
  placement: Placement;
  orientation: "portrait" | "landscape";
  images: ProductImage[];
  models: Model[];
  resolutions: Resolution[];
  apps: AppName[];
  features: string[];
  specs: SpecGroup[];
  /** Short facts shown on cards and the product hero. */
  highlights: string[];
  /** Listed in the brochure's range guide, but its spec page isn't in the brochure. */
  specsOnRequest?: boolean;
};

export const placements: { value: Placement; label: string; description: string }[] = [
  { value: "floor", label: "Floor standing", description: "Pedestal, easel and totem displays for entrances, lobbies and aisles." },
  { value: "portable", label: "Portable", description: "Battery-powered displays that go where the crowd is." },
  { value: "wall", label: "Wall mounted", description: "Slim portrait and landscape screens for walls and menu boards." },
  { value: "desk", label: "Desk & counter", description: "Compact 10–15.6″ displays for counters, tables and reception desks." },
];

export const WARRANTY = "1 year warranty";
export const SITE_URL = "www.cansignage.com";

const img = (file: string, alt: string, width = 1400, height = 1400): ProductImage => ({
  src: `/products/can/${file}.webp`,
  alt,
  width,
  height,
});

const ALL_APPS: AppName[] = ["YouTube", "Media Center", "Web Browser", "Android", "IQ World"];

const SIGNAGE_FEATURES = [
  "Inbuilt image & video editor",
  "Toughened glass body protection",
  "Continuous scrolling text effect",
  "Multi-level authentication",
  "User-friendly UI / UX",
];

/** Spec blocks shared by the 32″ and larger CAN displays. */
function signageSpecs(aspect: string, hardware: SpecRow[] = []): SpecGroup[] {
  return [
    {
      title: "LED display",
      rows: [
        { label: "Panel", value: "IPS, A+ grade" },
        { label: "Contrast ratio", value: "100000:1 (static)" },
        { label: "Colours", value: "16.7 M" },
        { label: "Aspect ratio", value: aspect },
        { label: "Viewing angle", value: "178° / 178°" },
        { label: "Motion rate", value: "60 Hz" },
      ],
    },
    { title: "Audio", rows: [{ label: "Speakers", value: "10W audio" }] },
    {
      title: "Hardware",
      rows: [{ label: "RAM", value: "1 GB" }, { label: "Storage (ROM)", value: "8 GB" }, ...hardware],
    },
    {
      title: "Connectivity",
      rows: [
        { label: "USB", value: "2 ports" },
        { label: "Wi-Fi", value: "Yes" },
        { label: "LAN", value: "RJ45" },
      ],
    },
    {
      title: "Extra features",
      rows: [
        { label: "Auto on", value: "Yes" },
        { label: "Blue back", value: "Yes" },
        { label: "Media center", value: "Yes" },
        { label: "Local keyboard", value: "Single key operation" },
        { label: "Colour temperature", value: "Auto" },
        { label: "Software language", value: "English" },
      ],
    },
  ];
}

export const series: Series[] = [
  {
    slug: "canlit",
    name: "CANLit",
    eyebrow: "Best and brightest.",
    headline: "Show your best.",
    summary:
      "A slim portrait display on a round pedestal base: a brilliant IPS panel behind full toughened glass, ready for entrances, showrooms and lobbies.",
    placement: "floor",
    orientation: "portrait",
    images: [img("canlit-finishes", "CANLit pedestal displays in white, black and silver finishes")],
    models: [
      { name: "CANLit 3201", size: 32, pixels: "768 × 1366", brightness: 300, dimensions: "18.01 × 69.13 × 2.35 in, 15″ base radius", netWeight: "19.5 kg", grossWeight: "24 kg" },
      { name: "CANLit Pro 4301", size: 43, pixels: "1080 × 1920", brightness: 380, dimensions: "22.06 × 76.01 × 2.65 in, 15″ base radius", netWeight: "27.9 kg", grossWeight: "32.5 kg" },
    ],
    resolutions: ["HD", "Full HD"],
    apps: ALL_APPS,
    features: SIGNAGE_FEATURES,
    specs: signageSpecs("9:16"),
    highlights: ["Pedestal stand", "Up to 380 nits", "Full toughened glass"],
  },
  {
    slug: "canwalk",
    name: "CANWalk",
    eyebrow: "Best and brightest.",
    headline: "Walk your best.",
    summary:
      "A 32″ display you wear as a backpack. Up to 5 hours on battery puts your promotion in malls, events and busy streets.",
    placement: "portable",
    orientation: "portrait",
    images: [img("canwalk-views", "CANWalk backpack display shown from the back, front and side")],
    models: [
      { name: "CANWalk 3201", size: 32, pixels: "768 × 1366", brightness: 300, dimensions: "18.01 × 36.14 × 2.35 in", netWeight: "13.35 kg", grossWeight: "17.13 kg" },
    ],
    resolutions: ["HD"],
    apps: ALL_APPS,
    features: SIGNAGE_FEATURES,
    specs: signageSpecs("9:16", [{ label: "Battery", value: "Up to 5 hours" }]),
    highlights: ["Wearable backpack", "Up to 5 hr battery", "32″ HD"],
  },
  {
    slug: "canmount",
    name: "CANMount",
    eyebrow: "Best and brightest.",
    headline: "True-to-life display.",
    summary:
      "Wall-mounted portrait displays from 32″ to 55″, with 4K Ultra HD on the 50″ and 55″ models. Built for menu boards, corridors and retail walls.",
    placement: "wall",
    orientation: "portrait",
    images: [img("canmount-finishes", "CANMount wall displays in white, silver and black finishes")],
    models: [
      { name: "CANMount 3201", size: 32, pixels: "768 × 1366", brightness: 300, dimensions: "18.01 × 36.14 × 2.35 in", netWeight: "10.4 kg", grossWeight: "13.5 kg" },
      { name: "CANMount Pro 4301", size: 43, pixels: "1080 × 1920", brightness: 350, dimensions: "22.06 × 48.16 × 2.65 in", netWeight: "16.9 kg", grossWeight: "20 kg" },
      { name: "CANMount Pro+ 5001", size: 50, pixels: "2160 × 3840", brightness: 380, dimensions: "26 × 50 × 3 in", netWeight: "21 kg", grossWeight: "26 kg" },
      { name: "CANMount Max 5501", size: 55, pixels: "2160 × 3840", brightness: 380, dimensions: "28 × 55 × 3.3 in", netWeight: "25 kg", grossWeight: "29 kg" },
    ],
    resolutions: ["HD", "Full HD", "4K Ultra HD"],
    apps: ALL_APPS,
    features: SIGNAGE_FEATURES,
    specs: signageSpecs("9:16"),
    highlights: ["Wall mount", "4K on 50″ & 55″", "32″ to 55″"],
  },
  {
    slug: "can",
    name: "CAN",
    eyebrow: "Every day. More extraordinary.",
    headline: "Multi-task your best.",
    summary:
      "The easel-style CAN folds out on an A-frame stand. It's light enough to move between shop floors, events and entrances, with a 32″ or 43″ portrait screen.",
    placement: "floor",
    orientation: "portrait",
    images: [
      img("can-easel-finishes", "CAN easel displays in black, silver and white"),
      img("can-easel-front", "CAN easel display, front view", 1120, 1400),
      img("can-easel-angle-left", "CAN easel display, angled view", 1120, 1400),
      img("can-easel-side", "CAN easel display, side profile showing the A-frame", 1120, 1400),
      img("can-easel-angle-right", "CAN easel display, angled from the other side", 1120, 1400),
    ],
    models: [
      { name: "CAN 3201", size: 32, pixels: "768 × 1366", brightness: 300, dimensions: "18.01 × 52.06 × 2.30 in", netWeight: "13.4 kg", grossWeight: "16.43 kg" },
      { name: "CAN Pro 4301", size: 43, pixels: "1080 × 1920", brightness: 350, dimensions: "22.06 × 58.05 × 2.56 in", netWeight: "20.1 kg", grossWeight: "23.6 kg" },
    ],
    resolutions: ["HD", "Full HD"],
    apps: ALL_APPS,
    features: SIGNAGE_FEATURES,
    specs: signageSpecs("9:16"),
    highlights: ["A-frame easel", "Easy to move", "32″ & 43″"],
  },
  {
    slug: "canvue",
    name: "CANVue",
    eyebrow: "Experience the best.",
    headline: "The ultimate experience.",
    summary:
      "Freestanding 4K totems from 32″ to 65″. Models from 43″ up roll on wheels, so a showroom-scale screen can move with your layout.",
    placement: "floor",
    orientation: "portrait",
    images: [
      img("canvue-finishes", "CANVue totems in white, black and silver finishes"),
      img("canvue-front", "CANVue totem, front view", 1120, 1400),
      img("canvue-angle-left", "CANVue totem on wheels, angled view", 1120, 1400),
      img("canvue-angle-right", "CANVue totem on wheels, angled from the other side", 1120, 1400),
    ],
    models: [
      { name: "CANVue 3201", size: 32, pixels: "768 × 1366", brightness: 300, dimensions: "18.01 × 53.16 × 2.25 in", netWeight: "16.5 kg", grossWeight: "19.7 kg" },
      { name: "CANVue Pro 4301", size: 43, pixels: "1080 × 1920", brightness: 350, note: "With wheels", dimensions: "22.06 × 67.01 × 2.50 in", netWeight: "34.5 kg", grossWeight: "39.1 kg" },
      { name: "CANVue Pro+ 5001", size: 50, pixels: "2160 × 3840", brightness: 380, note: "With wheels", dimensions: "26 × 69 × 2.50 in", netWeight: "45 kg", grossWeight: "50 kg" },
      { name: "CANVue Mini 5501", size: 55, pixels: "2160 × 3840", brightness: 380, note: "With wheels", dimensions: "28 × 69 × 2.50 in", netWeight: "47 kg", grossWeight: "50 kg" },
      { name: "CANVue Max 5501", size: 55, pixels: "2160 × 3840", brightness: 380, note: "With wheels", dimensions: "28.06 × 80 × 2.50 in", netWeight: "49 kg", grossWeight: "54.7 kg" },
      { name: "CANVue Max+ 6501", size: 65, pixels: "2160 × 3840", brightness: 380, note: "With wheels", dimensions: "33 × 80 × 2.50 in", netWeight: "57 kg", grossWeight: "64 kg" },
    ],
    resolutions: ["HD", "Full HD", "4K Ultra HD"],
    apps: ALL_APPS,
    features: SIGNAGE_FEATURES,
    specs: signageSpecs("9:16"),
    highlights: ["4K totem", "Wheels from 43″", "32″ to 65″"],
  },
  {
    slug: "cannx",
    name: "CANNX",
    eyebrow: "Experience the best.",
    headline: "See all the details.",
    summary:
      "Landscape 16:9 IPS displays from 32″ to 65″, with 4K Ultra HD from 50″. Slim and light, from 4.1 kg, for walls, receptions and meeting rooms.",
    placement: "wall",
    orientation: "landscape",
    images: [img("cannx-range", "CANNX landscape displays in silver, white and black bezels", 1040, 735)],
    models: [
      { name: "CANNX 3201", size: 32, pixels: "1366 × 768", brightness: 300, dimensions: "17.08 × 28.16 × 1.68 in", netWeight: "4.1 kg", grossWeight: "5.1 kg" },
      { name: "CANNX Pro 4301", size: 43, pixels: "1080 × 1920", brightness: 350, dimensions: "22.13 × 37.18 × 2.30 in", netWeight: "5.8 kg", grossWeight: "7.64 kg" },
      { name: "CANNX Pro+ 5001", size: 50, pixels: "2160 × 3840", brightness: 380, dimensions: "43.18 × 25.16 × 1.70 in", netWeight: "9.15 kg", grossWeight: "11.95 kg" },
      { name: "CANNX Max 5501", size: 55, pixels: "2160 × 3840", brightness: 380, dimensions: "48.08 × 28.08 × 1.70 in", netWeight: "11.42 kg", grossWeight: "14.6 kg" },
      { name: "CANNX Max+ 6501", size: 65, pixels: "2160 × 3840", brightness: 380, dimensions: "57 × 32.7 × 1.70 in", netWeight: "15 kg", grossWeight: "19 kg" },
    ],
    resolutions: ["HD", "Full HD", "4K Ultra HD"],
    apps: ALL_APPS,
    features: SIGNAGE_FEATURES.filter((f) => f !== "Toughened glass body protection"),
    specs: signageSpecs("16:9"),
    highlights: ["Landscape 16:9", "4K from 50″", "From 4.1 kg"],
  },
  {
    slug: "candesk",
    name: "CANDesk",
    eyebrow: "A new dimension.",
    headline: "Pretty much everywhere.",
    summary:
      "Portable desk promotion in 10.1″, 13.3″ and 15.6″. Load it over USB and it autoplays your content on counters, tables and reception desks.",
    placement: "desk",
    orientation: "portrait",
    images: [img("candesk-finishes", "CANDesk counter displays in black and white", 940, 750)],
    models: [
      { name: "CANDesk 1001", size: 10.1, pixels: "1280 × 800" },
      { name: "CANDesk 1301", size: 13.3, pixels: "1280 × 800" },
      { name: "CANDesk 1501", size: 15.6, pixels: "1280 × 800" },
    ],
    resolutions: [],
    apps: ["Media Center"],
    features: ["Toughened glass body protection", "AutoPlay", "User-friendly UI"],
    specs: [
      {
        title: "Display",
        rows: [
          { label: "Panel", value: "A+ grade" },
          { label: "Contrast ratio", value: "1000:1" },
          { label: "Colours", value: "16.7 M" },
          { label: "Aspect ratio", value: "10:16" },
          { label: "Viewing angle", value: "85/85/85/85 (L/R/U/D)" },
          { label: "Motion rate", value: "60 Hz" },
        ],
      },
      { title: "Audio", rows: [{ label: "Speakers", value: "1 × 2W" }] },
      { title: "Hardware", rows: [{ label: "RAM", value: "2 GB" }, { label: "Internal memory", value: "8 GB" }] },
      { title: "Connectivity", rows: [{ label: "USB", value: "1 port" }] },
      {
        title: "Extra features",
        rows: [
          { label: "Auto on", value: "Yes" },
          { label: "Media center", value: "Yes" },
          { label: "Working temperature", value: "0–40 °C" },
          { label: "Software language", value: "English" },
        ],
      },
    ],
    highlights: ["Counter display", "AutoPlay over USB", "10.1″ to 15.6″"],
  },
  {
    slug: "candesk-touch",
    name: "CANDesk Touch",
    eyebrow: "Interactive surface.",
    headline: "Interaction for desk.",
    summary:
      "The desk display you can touch. A 10-point capacitive screen, front camera and full app support turn a counter into a self-service point.",
    placement: "desk",
    orientation: "portrait",
    images: [img("candesk-touch", "CANDesk Touch displays in white and black, with a hand tapping the screen", 1345, 780)],
    models: [
      { name: "CANDesk Touch 1001", size: 10.1, pixels: "1280 × 800", note: "10-point capacitive touch" },
      { name: "CANDesk Touch 1301", size: 13.3, pixels: "1280 × 800", note: "10-point capacitive touch" },
      { name: "CANDesk Touch 1501", size: 15.6, pixels: "1280 × 800", note: "10-point capacitive touch" },
    ],
    resolutions: [],
    apps: ALL_APPS,
    features: [...SIGNAGE_FEATURES, "Capacitive touch screen"],
    specs: [
      {
        title: "Display",
        rows: [
          { label: "Panel", value: "A+ grade" },
          { label: "Touch", value: "10-point capacitive" },
          { label: "Contrast ratio", value: "800:1" },
          { label: "Colours", value: "16.7 M" },
          { label: "Aspect ratio", value: "10:16" },
          { label: "Viewing angle", value: "85/85/85/85 (L/R/U/D)" },
          { label: "Motion rate", value: "60 Hz" },
        ],
      },
      { title: "Audio", rows: [{ label: "Speakers", value: "2 × 2W" }] },
      { title: "Hardware", rows: [{ label: "RAM", value: "2 GB" }, { label: "Internal memory", value: "16 GB" }] },
      {
        title: "Connectivity",
        rows: [
          { label: "USB", value: "2 ports" },
          { label: "Wi-Fi", value: "Yes" },
          { label: "Memory card", value: "32 GB card slot" },
          { label: "LAN", value: "RJ45" },
          { label: "Audio out", value: "Earphone jack" },
        ],
      },
      {
        title: "Extra features",
        rows: [
          { label: "Camera", value: "2.0 MP front camera" },
          { label: "Auto on", value: "Yes" },
          { label: "Blue back", value: "Yes" },
          { label: "Media center", value: "Yes" },
          { label: "Working temperature", value: "0–40 °C" },
          { label: "Software language", value: "English" },
        ],
      },
    ],
    highlights: ["10-point touch", "2 MP front camera", "16 GB memory"],
  },
  {
    slug: "candesk-tab",
    name: "CANDesk Tab",
    eyebrow: "A new dimension.",
    headline: "Flat-out on the counter.",
    summary: "A low-profile, tilted 10.1″ desk display in a slim base, made for checkout counters and tables.",
    placement: "desk",
    orientation: "landscape",
    images: [img("candesk-tab", "CANDesk Tab displays in silver and black")],
    models: [{ name: "CANDesk Tab 1001", size: 10.1 }],
    resolutions: [],
    apps: [],
    features: [],
    specs: [],
    highlights: ["Low-profile base", "10.1″"],
    specsOnRequest: true,
  },
  {
    slug: "candesk-wid",
    name: "CANDesk Wid",
    eyebrow: "A new dimension.",
    headline: "Widescreen on the desk.",
    summary: "Landscape desk displays on an L-shaped stand, in 10.1″, 13.3″ and 15.6″, for reception and service desks.",
    placement: "desk",
    orientation: "landscape",
    images: [img("candesk-wid", "CANDesk Wid landscape desk displays in white and black")],
    models: [
      { name: "CANDesk Wid 1001", size: 10.1 },
      { name: "CANDesk Wid 1301", size: 13.3 },
      { name: "CANDesk Wid 1501", size: 15.6 },
    ],
    resolutions: [],
    apps: [],
    features: [],
    specs: [],
    highlights: ["Landscape stand", "10.1″ to 15.6″"],
    specsOnRequest: true,
  },
];

/** Range-guide models with no photo or spec page in the brochure. */
export const moreModels = ["CANDesk Tent 1001", "CANDesk Mount"];

export function getSeries(slug: string) {
  return series.find((s) => s.slug === slug);
}

export function sizeRange(s: Series) {
  const sizes = s.models.map((m) => m.size);
  const min = Math.min(...sizes);
  const max = Math.max(...sizes);
  return min === max ? `${min}″` : `${min}″–${max}″`;
}

export function placementLabel(p: Placement) {
  return placements.find((x) => x.value === p)?.label ?? p;
}

/** Digital vs traditional signage, as compared in the brochure. */
export const signageComparison: { question: string; digital: string; traditional: string; digitalWins: boolean }[] = [
  { question: "Is power consumption required?", digital: "Yes", traditional: "No", digitalWins: true },
  { question: "Is reliability critical?", digital: "No", traditional: "Yes", digitalWins: false },
  { question: "Is flexibility a priority?", digital: "Yes", traditional: "No", digitalWins: true },
  { question: "Upfront costs", digital: "Lower", traditional: "Higher", digitalWins: true },
  { question: "Maintenance costs", digital: "Higher", traditional: "Lower", digitalWins: false },
  { question: "Content updating", digital: "Flexible", traditional: "Inflexible", digitalWins: true },
  { question: "Audience targeting", digital: "High", traditional: "Limited", digitalWins: true },
  { question: "Interactivity", digital: "High", traditional: "Limited", digitalWins: true },
  { question: "Data analytics", digital: "Robust", traditional: "Limited", digitalWins: true },
  { question: "Exposure", digital: "Advantageous", traditional: "Limited", digitalWins: true },
];

/** IQ World content management app: Basic vs PRO plan features. */
export const iqWorldPlans: { feature: string; basic: boolean; pro: boolean }[] = [
  { feature: "Customer registration", basic: true, pro: true },
  { feature: "Customer detailed report", basic: true, pro: true },
  { feature: "Playlist management", basic: true, pro: true },
  { feature: "Schedule management", basic: true, pro: true },
  { feature: "Devices management", basic: true, pro: true },
  { feature: "Text scroller / URL / PDF", basic: true, pro: true },
  { feature: "YouTube URL link upload", basic: true, pro: true },
  { feature: "PDF upload", basic: true, pro: true },
  { feature: "Remote device power on/off", basic: true, pro: true },
  { feature: "Device analytics", basic: false, pro: true },
  { feature: "Screen time report", basic: false, pro: true },
  { feature: "OTP authentication when uploading new content", basic: false, pro: true },
  { feature: "Intelligent split screen", basic: false, pro: true },
  { feature: "On-demand screen orientation", basic: false, pro: true },
  { feature: "IQ Editor (in-built text, image & video editor)", basic: false, pro: true },
  { feature: "Technical support", basic: true, pro: true },
];

export const iqWorldCapabilities = [
  "Content management system (CMS)",
  "Real-time lead analytics and statistics",
  "Schedule management",
  "YouTube",
  "Automated email system",
  "Smart split screen",
  "In-built image & video editor",
  "Easy-to-edit layouts",
  "Stickers and font collection",
  "Video maker and editor",
  "Continuous scrolling text",
  "Effects and photo filters",
];

export const iqWorldPlatforms = ["Android", "Windows", "macOS", "Web (ds.iqtv.in)"];

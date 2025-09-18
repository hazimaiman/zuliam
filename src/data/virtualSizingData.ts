export type ShoeVariant = {
  id: string;
  brand: "Zuliam";
  model: "Signature" | "Peak";
  subType?: "Sign" | "Mature"; // only for Signature
  sizeLabel: string;
  footLengthCm: [number, number];
  footWidthCm: [number, number];
  footThicknessMm?: [number, number];
  profile: "narrow" | "standard" | "wide";
  notes?: string;
  comingSoon?: boolean; // Peak "coming soon"
};

export type SizeChartRow = {
  mondoCm: number;
  us: number;
  uk: number;
  eu: number;
};

/**
 * Zuliam-only catalog
 * - Signature → two subtypes: Sign (snug/athletic) and Mature (roomier/comfort)
 * - Peak → listed but marked comingSoon
 */
export const shoeFittingCatalog: ShoeVariant[] = [
  {
    id: "zuliam-signature-sign-us9",
    brand: "Zuliam",
    model: "Signature",
    subType: "Sign",
    sizeLabel: "US 9 / UK 8 / EU 42.5",
    footLengthCm: [26.5, 27.1],
    footWidthCm: [9.8, 10.3],
    footThicknessMm: [44, 55],
    profile: "narrow",
    notes:
      "Snug athletic wrap. Consider half-size up if you prefer extra toe room.",
  },
  {
    id: "zuliam-signature-mature-us9",
    brand: "Zuliam",
    model: "Signature",
    subType: "Mature",
    sizeLabel: "US 9 / UK 8 / EU 42.5",
    footLengthCm: [26.4, 27.2],
    footWidthCm: [10.1, 10.8],
    footThicknessMm: [46, 60],
    profile: "standard",
    notes: "Roomier forefoot and extra depth for comfort or orthotics.",
  },
  {
    id: "zuliam-peak-us9",
    brand: "Zuliam",
    model: "Peak",
    sizeLabel: "US 9 / UK 8 / EU 42.5",
    footLengthCm: [26.6, 27.3],
    footWidthCm: [10.0, 10.6],
    footThicknessMm: [45, 58],
    profile: "standard",
    notes: "Lightweight daily trainer. Launching soon.",
    comingSoon: true,
  },
];

export const unisexSizeChart: SizeChartRow[] = [
  { mondoCm: 22.8, us: 5, uk: 4, eu: 37 },
  { mondoCm: 23.5, us: 6, uk: 5, eu: 38.5 },
  { mondoCm: 24.1, us: 7, uk: 6, eu: 39.5 },
  { mondoCm: 24.8, us: 7.5, uk: 6.5, eu: 40.5 },
  { mondoCm: 25.4, us: 8, uk: 7, eu: 41 },
  { mondoCm: 25.7, us: 8.5, uk: 7.5, eu: 41.5 },
  { mondoCm: 26.0, us: 9, uk: 8, eu: 42 },
  { mondoCm: 26.7, us: 9.5, uk: 8.5, eu: 43 },
  { mondoCm: 27.0, us: 10, uk: 9, eu: 44 },
  { mondoCm: 27.3, us: 10.5, uk: 9.5, eu: 44.5 },
  { mondoCm: 27.9, us: 11, uk: 10, eu: 45.5 },
  { mondoCm: 28.3, us: 11.5, uk: 10.5, eu: 46 },
  { mondoCm: 28.6, us: 12, uk: 11, eu: 46.5 },
];

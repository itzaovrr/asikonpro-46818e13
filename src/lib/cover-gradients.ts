// Cover gradient presets used when no cover image is uploaded.
// Stored in profiles.cover_gradient (text key).

export type CoverGradientKey =
  | "gradient-1"
  | "gradient-2"
  | "gradient-3"
  | "gradient-4"
  | "gradient-5"
  | "gradient-6";

export const COVER_GRADIENTS: Record<CoverGradientKey, { label: string; css: string }> = {
  "gradient-1": {
    label: "Indigo Dusk",
    css: "linear-gradient(135deg, hsl(233 80% 30%) 0%, hsl(280 80% 25%) 50%, hsl(220 90% 20%) 100%)",
  },
  "gradient-2": {
    label: "Ember Brand",
    css: "linear-gradient(135deg, hsl(0 75% 35%) 0%, hsl(15 85% 45%) 55%, hsl(345 80% 30%) 100%)",
  },
  "gradient-3": {
    label: "Aurora",
    css: "linear-gradient(135deg, hsl(160 70% 30%) 0%, hsl(195 80% 35%) 50%, hsl(260 75% 40%) 100%)",
  },
  "gradient-4": {
    label: "Sunset",
    css: "linear-gradient(135deg, hsl(20 90% 50%) 0%, hsl(340 80% 45%) 50%, hsl(280 70% 35%) 100%)",
  },
  "gradient-5": {
    label: "Forest",
    css: "linear-gradient(135deg, hsl(150 60% 20%) 0%, hsl(170 50% 25%) 55%, hsl(120 40% 18%) 100%)",
  },
  "gradient-6": {
    label: "Charcoal Gold",
    css: "linear-gradient(135deg, hsl(220 15% 15%) 0%, hsl(220 12% 22%) 55%, hsl(42 70% 35%) 100%)",
  },
};

export function getCoverGradient(key?: string | null): string {
  if (key && key in COVER_GRADIENTS) {
    return COVER_GRADIENTS[key as CoverGradientKey].css;
  }
  return COVER_GRADIENTS["gradient-1"].css;
}

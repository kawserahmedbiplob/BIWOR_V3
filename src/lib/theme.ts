export type ThemeColors = {
  navy: string;
  navyMid: string;
  accent: string;
  accentSoft: string;
  charcoal: string;
  slate: string;
  slateLight: string;
  border: string;
  surface: string;
  white: string;
};

export type ThemePreset = {
  id: string;
  name: string;
  description: string;
  colors: ThemeColors;
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "teal-amber",
    name: "Teal & Amber",
    description: "Original warm professional look (recommended)",
    colors: {
      navy: "#0F766E",
      navyMid: "#0D5C56",
      accent: "#D97706",
      accentSoft: "#FEF3C7",
      charcoal: "#0F172A",
      slate: "#475569",
      slateLight: "#94A3B8",
      border: "#E2E8F0",
      surface: "#F8FAFC",
      white: "#FFFFFF",
    },
  },
  {
    id: "corporate-navy",
    name: "Corporate Navy",
    description: "Classic B2B navy & blue",
    colors: {
      navy: "#0B1F3A",
      navyMid: "#132B4A",
      accent: "#1E4D8C",
      accentSoft: "#E8EEF6",
      charcoal: "#1A1A1A",
      slate: "#64748B",
      slateLight: "#94A3B8",
      border: "#E2E8F0",
      surface: "#F7F8FA",
      white: "#FFFFFF",
    },
  },
  {
    id: "forest",
    name: "Forest Green",
    description: "Deep green, calm & trustworthy",
    colors: {
      navy: "#14532D",
      navyMid: "#166534",
      accent: "#CA8A04",
      accentSoft: "#FEF9C3",
      charcoal: "#14532D",
      slate: "#4B5563",
      slateLight: "#9CA3AF",
      border: "#E5E7EB",
      surface: "#F9FAFB",
      white: "#FFFFFF",
    },
  },
  {
    id: "charcoal",
    name: "Charcoal Minimal",
    description: "Black, gray, minimal contrast",
    colors: {
      navy: "#171717",
      navyMid: "#262626",
      accent: "#525252",
      accentSoft: "#F5F5F5",
      charcoal: "#171717",
      slate: "#737373",
      slateLight: "#A3A3A3",
      border: "#E5E5E5",
      surface: "#FAFAFA",
      white: "#FFFFFF",
    },
  },
  {
    id: "slate-blue",
    name: "Slate Blue",
    description: "Cool professional blue-gray",
    colors: {
      navy: "#1E293B",
      navyMid: "#334155",
      accent: "#0284C7",
      accentSoft: "#E0F2FE",
      charcoal: "#0F172A",
      slate: "#64748B",
      slateLight: "#94A3B8",
      border: "#E2E8F0",
      surface: "#F8FAFC",
      white: "#FFFFFF",
    },
  },
];

export type ThemeConfig = {
  presetId: string;
  custom: boolean;
  colors: ThemeColors;
};

export const DEFAULT_THEME: ThemeConfig = {
  presetId: "teal-amber",
  custom: false,
  colors: THEME_PRESETS[0].colors,
};

export function themeToCssVars(colors: ThemeColors): string {
  return `
    --navy: ${colors.navy};
    --navy-mid: ${colors.navyMid};
    --accent: ${colors.accent};
    --accent-soft: ${colors.accentSoft};
    --charcoal: ${colors.charcoal};
    --slate: ${colors.slate};
    --slate-light: ${colors.slateLight};
    --border: ${colors.border};
    --surface: ${colors.surface};
    --white: ${colors.white};
  `.trim();
}

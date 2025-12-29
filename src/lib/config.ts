/**
 * Default theme colors (hex values)
 * Based on Tailwind's emerald/slate/amber palette
 */
const defaultTheme = {
  primary: {
    50: "#ecfdf5",
    100: "#d1fae5",
    200: "#a7f3d0",
    300: "#6ee7b7",
    400: "#34d399",
    500: "#10b981",
    600: "#059669",
    700: "#047857",
    800: "#065f46",
    900: "#064e3b",
    950: "#022c22",
  },
  secondary: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
    950: "#020617",
  },
  tertiary: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
    950: "#451a03",
  },
} as const;

type ColorScale = {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
};

/**
 * Parse theme colors from environment variable
 * Expects JSON format: {"50":"#hex","100":"#hex",...}
 */
function parseThemeColor(
  envVar: string | undefined,
  fallback: ColorScale
): ColorScale {
  if (!envVar) return fallback;
  try {
    return JSON.parse(envVar) as ColorScale;
  } catch {
    return fallback;
  }
}

/**
 * White-label configuration
 * These values can be customized via environment variables
 */
export const config = {
  /** Product/App name displayed in the sidebar header */
  appName: process.env.NEXT_PUBLIC_APP_NAME || "Pregón",

  /** Organization or tenant name displayed below the app name */
  organizationName: process.env.NEXT_PUBLIC_ORGANIZATION_NAME || "Costa Norte",

  /** Full organization name with prefix (e.g. "Delegación Costa Norte") */
  organizationFullName:
    process.env.NEXT_PUBLIC_ORGANIZATION_FULL_NAME || "Delegación Costa Norte",

  /** App description for SEO and footers */
  appDescription:
    process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
    "Sistema de notificaciones comunitarias",

  /**
   * Theme colors (full color scales with shades 50-950)
   * - primary: Main brand color for buttons, links, accents
   * - secondary: Supporting color for backgrounds, borders
   * - tertiary: Optional accent for highlights, warnings, badges
   */
  theme: {
    primary: parseThemeColor(
      process.env.NEXT_PUBLIC_THEME_PRIMARY,
      defaultTheme.primary
    ),
    secondary: parseThemeColor(
      process.env.NEXT_PUBLIC_THEME_SECONDARY,
      defaultTheme.secondary
    ),
    tertiary: parseThemeColor(
      process.env.NEXT_PUBLIC_THEME_TERTIARY,
      defaultTheme.tertiary
    ),
  },
} as const;

/**
 * Generate CSS custom properties object for theme injection
 * Returns an object like { "--color-primary-500": "#10b981", ... }
 */
export function getThemeCSSVariables(): Record<string, string> {
  const vars: Record<string, string> = {};

  for (const [colorName, scale] of Object.entries(config.theme)) {
    for (const [shade, value] of Object.entries(scale)) {
      vars[`--color-${colorName}-${shade}`] = value;
    }
  }

  return vars;
}

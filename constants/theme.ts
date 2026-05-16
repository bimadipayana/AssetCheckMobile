import { Platform } from 'react-native';

export const palette = {
  background: '#F8FAF9',
  surface: '#FFFFFF',
  surfaceMuted: '#ECFDF5',
  surfaceContainer: '#D1FAE5',
  border: '#E5E7EB',
  borderStrong: '#A7B4AE',
  text: '#1F2937',
  textMuted: '#374151',
  textSubtle: '#6B7280',
  primary: '#064E3B',
  primaryDark: '#022C22',
  primarySoft: '#D1FAE5',
  secondary: '#10B981',
  secondarySoft: '#D1FAE5',
  warning: '#EF9900',
  warningSoft: '#FFF4DC',
  danger: '#BA1A1A',
  dangerSoft: '#FFDAD6',
  info: '#047857',
  infoSoft: '#ECFDF5',
};

const tintColorLight = palette.primary;
const tintColorDark = '#A7F3D0';

export const Colors = {
  light: {
    text: palette.text,
    background: palette.background,
    tint: tintColorLight,
    icon: palette.textMuted,
    tabIconDefault: palette.textSubtle,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECFDF5',
    background: '#1F2937',
    tint: tintColorDark,
    icon: '#D1FAE5',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 2,
  md: 4,
  lg: 8,
  xl: 12,
  full: 999,
};

export const typography = {
  displayLg: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  headlineMd: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  headlineSm: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  bodyLg: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyMd: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  labelMd: {
    fontSize: 12,
    fontWeight: '600' as const,
    lineHeight: 16,
    letterSpacing: 0.6,
    textTransform: 'uppercase' as const,
  },
  labelSm: {
    fontSize: 11,
    fontWeight: '500' as const,
    lineHeight: 14,
  },
};

export const shadows = {
  floating: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'Inter',
    serif: 'ui-serif',
    rounded: 'Inter',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'Inter',
    serif: 'serif',
    rounded: 'Inter',
    mono: 'monospace',
  },
  web: {
    sans: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "Inter, 'SF Pro Rounded', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

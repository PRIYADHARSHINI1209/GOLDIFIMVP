export const Colors = {
  // Brand
  primary: '#EA6329',
  primaryPressed: '#C94F1F',
  primaryLight: '#FCE5DA',

  // Dark & Neutral
  charcoal: '#323031',
  textPrimary: '#323031',
  textSecondary: '#6B696A',
  textMuted: '#929091',

  // Surfaces & Backgrounds
  background: '#FFFFFF',
  surface: '#F8F8F8',
  surfaceSecondary: '#F3F3F3',
  border: '#E4E2E2',
  divider: '#ECEAEA',

  // Functional Status
  success: '#2E7D5B',
  successLight: '#E7F4EE',
  warning: '#B7791F',
  warningLight: '#FFF4DC',
  error: '#C73E3E',
  errorLight: '#FCE8E8',
  info: '#356D9B',
  infoLight: '#E8F1F8',

  // Utility
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(50, 48, 49, 0.5)',
} as const;

export type ColorToken = keyof typeof Colors;

import { TextStyle, Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const Typography: Record<string, TextStyle> = {
  display: {
    fontFamily,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  screenTitle: {
    fontFamily,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  sectionTitle: {
    fontFamily,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
  },
  body: {
    fontFamily,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  bodyMedium: {
    fontFamily,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  secondary: {
    fontFamily,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  secondaryMedium: {
    fontFamily,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  secondarySemibold: {
    fontFamily,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  caption: {
    fontFamily,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  },
  captionMedium: {
    fontFamily,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  captionSemibold: {
    fontFamily,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
  },
  metricLarge: {
    fontFamily,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  metricMedium: {
    fontFamily,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
  },
};

export const FontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

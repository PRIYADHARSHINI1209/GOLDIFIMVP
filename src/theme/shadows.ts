import { ViewStyle, Platform } from 'react-native';

export const Shadows: Record<string, ViewStyle> = {
  none: {
    shadowOpacity: 0,
    elevation: 0,
  },
  subtle: Platform.select({
    ios: {
      shadowColor: '#323031',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
    },
    android: {
      elevation: 1,
    },
    default: {},
  }) as ViewStyle,
  card: Platform.select({
    ios: {
      shadowColor: '#323031',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
    },
    android: {
      elevation: 2,
    },
    default: {},
  }) as ViewStyle,
  modal: Platform.select({
    ios: {
      shadowColor: '#323031',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
    },
    android: {
      elevation: 8,
    },
    default: {},
  }) as ViewStyle,
};

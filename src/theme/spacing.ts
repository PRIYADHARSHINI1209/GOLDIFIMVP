export const Spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
  giant: 64,

  // Semantic mobile layout tokens
  screenHorizontal: 20,
  screenVertical: 16,
  cardPadding: 16,
  cardPaddingSm: 12,
  sectionGap: 24,
  rowGap: 12,
  itemGap: 8,
  inputHeight: 52,
  buttonHeight: 50,
  buttonHeightSm: 38,
} as const;

export type SpacingToken = keyof typeof Spacing;

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@/theme/colors';

interface GoldifiDividerProps {
  style?: ViewStyle;
  marginVertical?: number;
}

export const GoldifiDivider: React.FC<GoldifiDividerProps> = ({
  style,
  marginVertical = 12,
}) => {
  return (
    <View
      style={[
        styles.divider,
        { marginVertical },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    width: '100%',
  },
});

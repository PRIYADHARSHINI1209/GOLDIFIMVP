import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';

interface TabBarIconProps {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  color: string;
  size?: number;
}

export const TabBarIcon: React.FC<TabBarIconProps> = ({
  name,
  focused,
  color,
  size = 22,
}) => {
  return (
    <View style={styles.container}>
      <Ionicons name={name} size={size} color={color} />
      {focused && <View style={styles.activeDot} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    marginTop: 2,
  },
});

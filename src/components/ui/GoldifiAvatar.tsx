import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';

interface GoldifiAvatarProps {
  initials: string;
  size?: 'sm' | 'md' | 'lg';
  backgroundColor?: string;
}

export const GoldifiAvatar: React.FC<GoldifiAvatarProps> = ({
  initials,
  size = 'md',
  backgroundColor = Colors.charcoal,
}) => {
  const dimension = size === 'sm' ? 32 : size === 'md' ? 42 : 56;
  const fontSize = size === 'sm' ? 12 : size === 'md' ? 16 : 20;

  return (
    <View
      style={[
        styles.avatar,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
          backgroundColor,
        },
      ]}
    >
      <Text style={[styles.text, { fontSize }]}>{initials.toUpperCase()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...Typography.bodyMedium,
    color: Colors.white,
    fontWeight: '700',
  },
});

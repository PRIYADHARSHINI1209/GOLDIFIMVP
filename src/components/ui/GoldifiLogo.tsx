import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';

interface GoldifiLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  lightBackground?: boolean;
}

export const GoldifiLogo: React.FC<GoldifiLogoProps> = ({
  size = 'md',
  showTagline = true,
  lightBackground = true,
}) => {
  const iconSize = size === 'sm' ? 24 : size === 'md' ? 36 : 48;
  const titleSize = size === 'sm' ? 18 : size === 'md' ? 26 : 34;

  return (
    <View style={styles.container}>
      <View style={styles.logoRow}>
        <View style={[styles.iconBadge, { width: iconSize + 14, height: iconSize + 14, borderRadius: (iconSize + 14) / 4 }]}>
          <Ionicons name="shield-checkmark" size={iconSize} color={Colors.white} />
        </View>
        <View style={styles.textContainer}>
          <View style={styles.brandRow}>
            <Text style={[styles.title, { fontSize: titleSize, color: lightBackground ? Colors.charcoal : Colors.white }]}>
              GOLDI<Text style={{ color: Colors.primary }}>FI</Text>
            </Text>
          </View>
          {showTagline && (
            <Text style={[styles.tagline, { color: lightBackground ? Colors.textSecondary : Colors.textMuted }]}>
              PAWNSHOP CRM
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBadge: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    justifyContent: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  title: {
    ...Typography.screenTitle,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  tagline: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: -2,
  },
});

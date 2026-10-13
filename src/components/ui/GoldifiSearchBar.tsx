import React from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Radius } from '@/theme/radius';
import { Typography } from '@/theme/typography';

interface GoldifiSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  onFilterPress?: () => void;
  isFilterActive?: boolean;
}

export const GoldifiSearchBar: React.FC<GoldifiSearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  onClear,
  onFilterPress,
  isFilterActive = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={Colors.textMuted} style={styles.icon} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {value.length > 0 && (
          <Pressable
            onPress={() => {
              onChangeText('');
              onClear?.();
            }}
            style={styles.clearBtn}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
          >
            <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
          </Pressable>
        )}
      </View>
      {onFilterPress && (
        <Pressable
          onPress={onFilterPress}
          style={[
            styles.filterBtn,
            isFilterActive && { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Open filters"
        >
          <Ionicons
            name="options-outline"
            size={20}
            color={isFilterActive ? Colors.primary : Colors.textPrimary}
          />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    ...Typography.secondary,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
  },
  filterBtn: {
    width: 46,
    height: 46,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

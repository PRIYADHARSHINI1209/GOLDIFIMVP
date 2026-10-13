import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { Radius } from '@/theme/radius';
import { formatINR } from '@/utils/currency';
import { usePermissions } from '@/hooks/usePermissions';
import { mockInventoryService } from '@/services/inventory/inventoryService';
import { PledgedItem, ItemStatus } from '@/types';
import { InventoryCard } from '@/components/cards/InventoryCard';
import { GoldifiSearchBar } from '@/components/ui/GoldifiSearchBar';
import { GoldifiEmptyState } from '@/components/feedback/GoldifiEmptyState';
import { GoldifiLoadingState } from '@/components/feedback/GoldifiLoadingState';
import { GoldifiAccessDenied } from '@/components/feedback/GoldifiAccessDenied';
import { RoleSimulatorWidget } from '@/components/navigation/RoleSimulatorWidget';

type FilterTab = 'ALL' | ItemStatus;

export default function InventoryScreen() {
  const router = useRouter();
  const { canViewInventory } = usePermissions();

  const [items, setItems] = useState<PledgedItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterTab>('ALL');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadItems = async () => {
    try {
      const list = await mockInventoryService.getInventory(selectedFilter, searchQuery);
      setItems(list);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (canViewInventory) {
      loadItems();
    }
  }, [searchQuery, selectedFilter, canViewInventory]);

  const onRefresh = () => {
    setRefreshing(true);
    loadItems();
  };

  if (!canViewInventory) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <GoldifiAccessDenied
          requiredPermission="inventory.view"
          customMessage="You do not have security clearance to view vault storage inventory."
        />
      </SafeAreaView>
    );
  }

  const totalVaultValue = items.reduce((sum, item) => sum + item.estimatedMarketValue, 0);

  const filterTabs: { key: FilterTab; label: string }[] = [
    { key: 'ALL', label: 'All Items' },
    { key: 'PLEDGED', label: 'Pledged' },
    { key: 'IN_STORAGE', label: 'In Safe' },
    { key: 'RELEASED', label: 'Released' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Vault Inventory</Text>
          <Text style={styles.headerSubtitle}>{items.length} items logged</Text>
        </View>
        <RoleSimulatorWidget />
      </View>

      {/* Vault Valuation Banner */}
      <View style={styles.vaultBanner}>
        <View style={styles.vaultIconBox}>
          <Ionicons name="cube" size={24} color={Colors.white} />
        </View>
        <View style={styles.vaultInfo}>
          <Text style={styles.vaultLabel}>ESTIMATED VAULT ASSETS</Text>
          <Text style={styles.vaultValue}>{formatINR(totalVaultValue)}</Text>
        </View>
      </View>

      <View style={styles.searchSection}>
        <GoldifiSearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search item, locker, customer, or loan..."
        />

        <View style={styles.filterRow}>
          {filterTabs.map((tab) => {
            const active = selectedFilter === tab.key;
            return (
              <Pressable
                key={tab.key}
                onPress={() => setSelectedFilter(tab.key)}
                style={[styles.filterChip, active && styles.filterChipActive]}
              >
                <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {loading ? (
        <GoldifiLoadingState message="Scanning vault inventory register..." />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <InventoryCard
              item={item}
              onPress={() => router.push(`/(app)/inventory/${item.id}` as any)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
          }
          ListEmptyComponent={
            <GoldifiEmptyState
              iconName="cube-outline"
              title="No Items Found"
              description={
                searchQuery
                  ? `No inventory items matching "${searchQuery}".`
                  : 'Items will appear here once pledged in pawn loans.'
              }
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenHorizontal,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    ...Typography.screenTitle,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  vaultBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.charcoal,
    marginHorizontal: Spacing.screenHorizontal,
    marginTop: 14,
    borderRadius: Radius.md,
    padding: 14,
    gap: 12,
  },
  vaultIconBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vaultInfo: {
    flex: 1,
  },
  vaultLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.primaryLight,
    letterSpacing: 1,
  },
  vaultValue: {
    ...Typography.metricMedium,
    color: Colors.white,
    fontWeight: '800',
    marginTop: 2,
  },
  searchSection: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: 14,
    paddingBottom: 4,
    backgroundColor: Colors.white,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.charcoal,
    borderColor: Colors.charcoal,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: Colors.white,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: 8,
    paddingBottom: 32,
  },
});

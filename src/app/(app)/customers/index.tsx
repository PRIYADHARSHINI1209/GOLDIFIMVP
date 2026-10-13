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
import { usePermissions } from '@/hooks/usePermissions';
import { mockCustomerService } from '@/services/customers/customerService';
import { Customer, CustomerStatus } from '@/types';
import { CustomerCard } from '@/components/cards/CustomerCard';
import { GoldifiSearchBar } from '@/components/ui/GoldifiSearchBar';
import { GoldifiEmptyState } from '@/components/feedback/GoldifiEmptyState';
import { GoldifiLoadingState } from '@/components/feedback/GoldifiLoadingState';
import { GoldifiAccessDenied } from '@/components/feedback/GoldifiAccessDenied';
import { RoleSimulatorWidget } from '@/components/navigation/RoleSimulatorWidget';

type FilterTab = 'ALL' | CustomerStatus;

export default function CustomersScreen() {
  const router = useRouter();
  const { canViewCustomers, canCreateCustomer } = usePermissions();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterTab>('ALL');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadCustomers = async () => {
    try {
      const data = await mockCustomerService.getCustomers(searchQuery, selectedFilter);
      setCustomers(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (canViewCustomers) {
      loadCustomers();
    }
  }, [searchQuery, selectedFilter, canViewCustomers]);

  const onRefresh = () => {
    setRefreshing(true);
    loadCustomers();
  };

  if (!canViewCustomers) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <GoldifiAccessDenied
          requiredPermission="customers.view"
          customMessage="You do not have permission to view or manage customer records in this branch."
        />
      </SafeAreaView>
    );
  }

  const filterTabs: { key: FilterTab; label: string }[] = [
    { key: 'ALL', label: 'All' },
    { key: 'VERIFIED', label: 'Verified KYC' },
    { key: 'PENDING', label: 'Pending' },
    { key: 'FLAGGED', label: 'Flagged' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Customers</Text>
          <Text style={styles.headerSubtitle}>{customers.length} registered borrowers</Text>
        </View>
        <View style={styles.headerRight}>
          <RoleSimulatorWidget />
          {canCreateCustomer && (
            <Pressable
              onPress={() => router.push('/(app)/customers/create')}
              style={styles.addBtn}
              accessibilityRole="button"
              accessibilityLabel="Add Customer"
            >
              <Ionicons name="person-add" size={18} color={Colors.white} />
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.searchSection}>
        <GoldifiSearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search name, customer code, or phone..."
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
        <GoldifiLoadingState message="Fetching customer records..." />
      ) : (
        <FlatList
          data={customers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CustomerCard
              customer={item}
              onPress={() => router.push(`/(app)/customers/${item.id}` as any)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
          }
          ListEmptyComponent={
            <GoldifiEmptyState
              iconName="people-outline"
              title="No Customers Found"
              description={
                searchQuery
                  ? `No customer profiles matching "${searchQuery}".`
                  : 'Start by onboarding your first customer with verified ID proof.'
              }
              actionLabel={canCreateCustomer ? 'Add New Customer' : undefined}
              onActionPress={() => router.push('/(app)/customers/create')}
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
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

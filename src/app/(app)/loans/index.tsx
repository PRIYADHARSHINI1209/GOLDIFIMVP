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
import { mockLoanService } from '@/services/loans/loanService';
import { Loan, LoanStatus } from '@/types';
import { LoanCard } from '@/components/cards/LoanCard';
import { GoldifiSearchBar } from '@/components/ui/GoldifiSearchBar';
import { GoldifiEmptyState } from '@/components/feedback/GoldifiEmptyState';
import { GoldifiLoadingState } from '@/components/feedback/GoldifiLoadingState';
import { GoldifiAccessDenied } from '@/components/feedback/GoldifiAccessDenied';
import { RoleSimulatorWidget } from '@/components/navigation/RoleSimulatorWidget';

type FilterTab = 'ALL' | LoanStatus;

export default function LoansScreen() {
  const router = useRouter();
  const { canViewLoans, canCreateLoan } = usePermissions();

  const [loans, setLoans] = useState<Loan[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterTab>('ALL');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadLoans = async () => {
    try {
      const data = await mockLoanService.getLoans(selectedFilter, searchQuery);
      setLoans(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (canViewLoans) {
      loadLoans();
    }
  }, [searchQuery, selectedFilter, canViewLoans]);

  const onRefresh = () => {
    setRefreshing(true);
    loadLoans();
  };

  if (!canViewLoans) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <GoldifiAccessDenied
          requiredPermission="loans.view"
          customMessage="You do not have permission to view or manage pawn loans."
        />
      </SafeAreaView>
    );
  }

  const filterTabs: { key: FilterTab; label: string }[] = [
    { key: 'ALL', label: 'All' },
    { key: 'ACTIVE', label: 'Active' },
    { key: 'DUE_SOON', label: 'Due Soon' },
    { key: 'OVERDUE', label: 'Overdue' },
    { key: 'CLOSED', label: 'Closed' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Pawn Loans</Text>
          <Text style={styles.headerSubtitle}>{loans.length} loans in register</Text>
        </View>
        <View style={styles.headerRight}>
          <RoleSimulatorWidget />
          {canCreateLoan && (
            <Pressable
              onPress={() => router.push('/(app)/loans/create')}
              style={styles.addBtn}
              accessibilityRole="button"
              accessibilityLabel="Create New Loan"
            >
              <Ionicons name="add" size={22} color={Colors.white} />
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.searchSection}>
        <GoldifiSearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search loan number, borrower, or item..."
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
        <GoldifiLoadingState message="Fetching active loan records..." />
      ) : (
        <FlatList
          data={loans}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <LoanCard
              loan={item}
              onPress={() => router.push(`/(app)/loans/${item.id}` as any)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
          }
          ListEmptyComponent={
            <GoldifiEmptyState
              iconName="receipt-outline"
              title="No Loans Found"
              description={
                searchQuery
                  ? `No loans matching query "${searchQuery}".`
                  : 'Originate a new gold loan against customer collateral.'
              }
              actionLabel={canCreateLoan ? 'New Pawn Loan' : undefined}
              onActionPress={() => router.push('/(app)/loans/create')}
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

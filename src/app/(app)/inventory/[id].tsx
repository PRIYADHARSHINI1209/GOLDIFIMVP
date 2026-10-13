import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { Radius } from '@/theme/radius';
import { formatINR } from '@/utils/currency';
import { formatDateTime } from '@/utils/date';
import { usePermissions } from '@/hooks/usePermissions';
import { mockInventoryService } from '@/services/inventory/inventoryService';
import { PledgedItem } from '@/types';
import { GoldifiHeader } from '@/components/ui/GoldifiHeader';
import { GoldifiStatusBadge } from '@/components/ui/GoldifiStatusBadge';
import { GoldifiButton } from '@/components/ui/GoldifiButton';
import { GoldifiModal } from '@/components/feedback/GoldifiModal';
import { GoldifiInput } from '@/components/ui/GoldifiInput';
import { GoldifiLoadingState } from '@/components/feedback/GoldifiLoadingState';

export default function InventoryDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { canManageInventory } = usePermissions();

  const [item, setItem] = useState<PledgedItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newLocker, setNewLocker] = useState('');

  useEffect(() => {
    if (!id) return;
    mockInventoryService.getItemById(id).then((res) => {
      if (res) {
        setItem(res);
        setNewLocker(res.storageLocker);
      }
      setLoading(false);
    });
  }, [id]);

  const handleUpdateLocker = async () => {
    if (!item || !newLocker.trim()) return;
    const updated = await mockInventoryService.updateStorageLocation(item.id, newLocker.trim());
    if (updated) setItem({ ...updated });
    setModalVisible(false);
    alert('Vault storage location updated.');
  };

  if (loading || !item) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <GoldifiHeader title="Vault Item Dossier" showBack />
        <GoldifiLoadingState message="Fetching item custody file..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <GoldifiHeader
        title={item.id}
        subtitle={item.description}
        showBack
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Card */}
        <View style={styles.card}>
          <View style={styles.statusHeader}>
            <View>
              <Text style={styles.metaLabel}>ITEM CATEGORY</Text>
              <Text style={styles.categoryTitle}>{item.category.replace('_', ' ')}</Text>
            </View>
            <GoldifiStatusBadge status={item.status} />
          </View>

          <Text style={styles.description}>{item.description}</Text>

          {/* Vault Locker Card */}
          <View style={styles.lockerBox}>
            <View style={styles.lockerLeft}>
              <View style={styles.lockerIconCircle}>
                <Ionicons name="cube" size={20} color={Colors.white} />
              </View>
              <View>
                <Text style={styles.lockerLabel}>CUSTODIAL VAULT LOCKER</Text>
                <Text style={styles.lockerNumber}>{item.storageLocker}</Text>
              </View>
            </View>

            {canManageInventory && (
              <Pressable
                onPress={() => setModalVisible(true)}
                style={styles.reassignBtn}
                accessibilityRole="button"
              >
                <Text style={styles.reassignText}>Relocate</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Physical Specs */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Physical Specifications</Text>

          <View style={styles.specGrid}>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Purity Benchmark</Text>
              <Text style={styles.specVal}>{item.purityKarat || '22K Standard'}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Gross Weight</Text>
              <Text style={styles.specVal}>{item.grossWeightGrams} g</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Net Gold Weight</Text>
              <Text style={styles.specVal}>{item.netWeightGrams} g</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Deposit Date</Text>
              <Text style={styles.specVal}>{formatDateTime(item.receivedDate)}</Text>
            </View>
          </View>
        </View>

        {/* Valuation Assessment */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Valuation & Disbursed Advance</Text>
          <View style={styles.valueRow}>
            <View>
              <Text style={styles.specLabel}>Estimated Market Value</Text>
              <Text style={styles.marketVal}>{formatINR(item.estimatedMarketValue)}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.specLabel}>Assessed Loan Principal</Text>
              <Text style={styles.loanVal}>{formatINR(item.assessedLoanValue)}</Text>
            </View>
          </View>
        </View>

        {/* Quick Links */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Pledge References</Text>
          <Pressable
            onPress={() => router.push(`/(app)/loans/${item.loanId}` as any)}
            style={styles.linkRow}
            accessibilityRole="button"
          >
            <View style={styles.linkLeft}>
              <Ionicons name="receipt-outline" size={20} color={Colors.primary} />
              <View>
                <Text style={styles.linkTitle}>Pawn Loan Account</Text>
                <Text style={styles.linkSub}>{item.loanNumber}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </Pressable>
        </View>
      </ScrollView>

      {/* Relocate Locker Modal */}
      <GoldifiModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Relocate Vault Locker"
        subtitle={`Item: ${item.id}`}
      >
        <GoldifiInput
          label="New Locker / Shelf / Safe Tray"
          placeholder="e.g. Vault Safe Box B-09"
          value={newLocker}
          onChangeText={setNewLocker}
          leadingIcon="cube-outline"
        />
        <View style={{ height: 10 }} />
        <GoldifiButton
          label="Save & Log Chain of Custody"
          onPress={handleUpdateLocker}
          size="md"
        />
      </GoldifiModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    padding: Spacing.screenHorizontal,
    paddingTop: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: 16,
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  metaLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.8,
  },
  categoryTitle: {
    ...Typography.bodyMedium,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  description: {
    ...Typography.body,
    color: Colors.charcoal,
    fontWeight: '600',
    marginBottom: 16,
  },
  lockerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: 12,
  },
  lockerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  lockerIconCircle: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: Colors.charcoal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockerLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  lockerNumber: {
    ...Typography.secondarySemibold,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginTop: 1,
  },
  reassignBtn: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.pill,
  },
  reassignText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  sectionTitle: {
    ...Typography.sectionTitle,
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: 12,
  },
  specGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specItem: {
    flexBasis: '48%',
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  specLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  specVal: {
    ...Typography.captionSemibold,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  marketVal: {
    ...Typography.sectionTitle,
    color: Colors.primary,
    fontWeight: '800',
    marginTop: 2,
  },
  loanVal: {
    ...Typography.sectionTitle,
    color: Colors.textPrimary,
    fontWeight: '800',
    marginTop: 2,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  linkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  linkTitle: {
    ...Typography.captionMedium,
    color: Colors.textSecondary,
  },
  linkSub: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});

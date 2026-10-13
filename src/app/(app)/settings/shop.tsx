import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { Radius } from '@/theme/radius';
import { MOCK_ORGANIZATION, MOCK_BRANCHES } from '@/mock/organizations';
import { useAuth } from '@/context/AuthContext';
import { GoldifiHeader } from '@/components/ui/GoldifiHeader';

export default function ShopSettingsScreen() {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <GoldifiHeader title="Shop & Branches" subtitle={MOCK_ORGANIZATION.name} showBack />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Business Profile */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>BUSINESS REGISTRATION</Text>
          <Text style={styles.shopName}>{MOCK_ORGANIZATION.name}</Text>
          <Text style={styles.tagline}>{MOCK_ORGANIZATION.tagline}</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>GSTIN / Tax ID:</Text>
            <Text style={styles.infoVal}>{MOCK_ORGANIZATION.taxNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Shop Identifier:</Text>
            <Text style={styles.infoVal}>{MOCK_ORGANIZATION.code}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Headquarters:</Text>
            <Text style={styles.infoVal} numberOfLines={2}>{MOCK_ORGANIZATION.address}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoVal}>{MOCK_ORGANIZATION.phone}</Text>
          </View>
        </View>

        {/* Branches List */}
        <Text style={styles.sectionHeader}>REGISTERED BRANCHES ({MOCK_BRANCHES.length})</Text>

        {MOCK_BRANCHES.map((b) => {
          const isUserBranch = b.id === user.branchId;
          return (
            <View key={b.id} style={styles.branchCard}>
              <View style={styles.branchTop}>
                <View style={styles.branchTitleRow}>
                  <Text style={styles.branchName}>{b.name}</Text>
                  {b.isMainBranch && (
                    <View style={styles.hqTag}>
                      <Text style={styles.hqText}>HQ</Text>
                    </View>
                  )}
                </View>
                {isUserBranch && (
                  <View style={styles.currentTag}>
                    <Text style={styles.currentText}>YOUR BRANCH</Text>
                  </View>
                )}
              </View>

              <Text style={styles.branchAddr}>{b.address}</Text>

              <View style={styles.branchFooter}>
                <Text style={styles.managerText}>Manager: {b.managerName}</Text>
                <Text style={styles.branchPhone}>{b.phone}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
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
    marginBottom: 20,
  },
  cardHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: 6,
  },
  shopName: {
    ...Typography.sectionTitle,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  tagline: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: 14,
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  infoLabel: {
    ...Typography.captionMedium,
    color: Colors.textSecondary,
  },
  infoVal: {
    ...Typography.captionSemibold,
    color: Colors.textPrimary,
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
    marginLeft: 8,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: 12,
  },
  branchCard: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: 14,
    marginBottom: 10,
  },
  branchTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  branchTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  branchName: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  hqTag: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  hqText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.primary,
  },
  currentTag: {
    backgroundColor: Colors.surfaceSecondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  currentText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  branchAddr: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginBottom: 8,
  },
  branchFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: 8,
  },
  managerText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.charcoal,
  },
  branchPhone: {
    fontSize: 11,
    color: Colors.textMuted,
  },
});

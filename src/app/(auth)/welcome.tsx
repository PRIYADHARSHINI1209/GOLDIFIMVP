import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { Radius } from '@/theme/radius';
import { GoldifiLogo } from '@/components/ui/GoldifiLogo';
import { GoldifiButton } from '@/components/ui/GoldifiButton';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';

export default function WelcomeScreen() {
  const router = useRouter();
  const { switchDemoRole } = useAuth();

  const handleQuickDemo = async (role: UserRole) => {
    await switchDemoRole(role);
    router.replace('/(app)/dashboard');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <GoldifiLogo size="lg" showTagline />
          <Text style={styles.leadText}>
            Professional mobile pawnshop CRM engineered for precision collateral evaluation, vault custody, and RBI-aligned gold loan management.
          </Text>
        </View>

        <View style={styles.featuresCard}>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="sparkles" size={18} color={Colors.primary} />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Instant Gold Loan Origination</Text>
              <Text style={styles.featureDesc}>Accurate LTV calculation against current 22K/24K purity benchmarks.</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="shield-checkmark" size={18} color={Colors.primary} />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Locker & Vault Tracking</Text>
              <Text style={styles.featureDesc}>Secure bag-to-shelf chain of custody for all pledged jewelry.</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="receipt" size={18} color={Colors.primary} />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Multi-Role Access Control</Text>
              <Text style={styles.featureDesc}>Strict separation between cashier receipts, pawn appraisals, and managerial auditing.</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionSection}>
          <GoldifiButton
            label="Enter Shop Code"
            onPress={() => router.push('/(auth)/shop-code')}
            size="lg"
            iconName="arrow-forward"
            iconPosition="right"
          />
          <View style={{ height: 10 }} />
          <GoldifiButton
            label="Direct Login"
            onPress={() => router.push('/(auth)/login')}
            variant="outline"
            size="md"
          />
        </View>

        {/* Development Quick Role Launchers */}
        <View style={styles.demoSection}>
          <View style={styles.demoBadge}>
            <Ionicons name="construct" size={12} color={Colors.primary} />
            <Text style={styles.demoBadgeText}>DEVELOPMENT ROLE PREVIEW</Text>
          </View>
          <Text style={styles.demoHeading}>Instant Demo Sign-in:</Text>
          <View style={styles.demoGrid}>
            <GoldifiButton
              label="Owner (All Access)"
              onPress={() => handleQuickDemo('OWNER')}
              variant="secondary"
              size="sm"
              style={styles.demoBtn}
            />
            <GoldifiButton
              label="Branch Manager"
              onPress={() => handleQuickDemo('MANAGER')}
              variant="secondary"
              size="sm"
              style={styles.demoBtn}
            />
            <GoldifiButton
              label="Pawn Appraiser"
              onPress={() => handleQuickDemo('PAWN_OFFICER')}
              variant="secondary"
              size="sm"
              style={styles.demoBtn}
            />
            <GoldifiButton
              label="Cashier Counter"
              onPress={() => handleQuickDemo('CASHIER')}
              variant="secondary"
              size="sm"
              style={styles.demoBtn}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: 32,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  leadText: {
    ...Typography.secondary,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  featuresCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: 18,
    marginBottom: 28,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  featureDesc: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  actionSection: {
    marginBottom: 28,
  },
  demoSection: {
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: 16,
  },
  demoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  demoBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.8,
  },
  demoHeading: {
    ...Typography.captionSemibold,
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  demoGrid: {
    gap: 8,
  },
  demoBtn: {
    marginBottom: 4,
  },
});

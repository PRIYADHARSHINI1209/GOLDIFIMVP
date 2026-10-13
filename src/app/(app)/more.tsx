import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { Radius } from '@/theme/radius';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { GoldifiAvatar } from '@/components/ui/GoldifiAvatar';
import { GoldifiListItem } from '@/components/lists/GoldifiListItem';
import { RoleSimulatorWidget } from '@/components/navigation/RoleSimulatorWidget';

export default function MoreScreen() {
  const router = useRouter();
  const { user, role, logout } = useAuth();
  const {
    canViewInventory,
    canViewReports,
    canViewEmployees,
    canViewSettings,
    canViewAudit,
  } = usePermissions();

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2);

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/welcome');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>More Options</Text>
        <RoleSimulatorWidget />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={styles.userCard}>
          <GoldifiAvatar initials={initials} size="lg" backgroundColor={Colors.charcoal} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <View style={styles.roleTag}>
              <Text style={styles.roleTagText}>{role.replace('_', ' ')}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionHeading}>SECONDARY CRM MODULES</Text>

        <View style={styles.groupedList}>
          {canViewInventory && (
            <GoldifiListItem
              title="Vault Inventory"
              subtitle="Pledged jewelry, bullion & storage lockers"
              leadingIcon="cube-outline"
              leadingIconBg={Colors.infoLight}
              leadingIconColor={Colors.info}
              onPress={() => router.push('/(app)/inventory')}
            />
          )}

          {canViewReports && (
            <GoldifiListItem
              title="Reports & Analytics"
              subtitle="Financial intelligence, risk & ledger reports"
              leadingIcon="bar-chart-outline"
              leadingIconBg={Colors.primaryLight}
              leadingIconColor={Colors.primary}
              onPress={() => router.push('/(app)/reports')}
            />
          )}

          {canViewEmployees && (
            <GoldifiListItem
              title="Staff & Permissions"
              subtitle="Branch employee directory & RBAC matrix"
              leadingIcon="shield-checkmark-outline"
              leadingIconBg={Colors.successLight}
              leadingIconColor={Colors.success}
              onPress={() => router.push('/(app)/employees')}
            />
          )}

          {canViewAudit && (
            <GoldifiListItem
              title="Compliance Audit Trail"
              subtitle="System security events & transaction logs"
              leadingIcon="document-text-outline"
              leadingIconBg={Colors.surfaceSecondary}
              leadingIconColor={Colors.charcoal}
              onPress={() => router.push('/(app)/settings/audit')}
            />
          )}
        </View>

        <Text style={styles.sectionHeading}>SYSTEM & CONFIGURATION</Text>

        <View style={styles.groupedList}>
          {canViewSettings && (
            <GoldifiListItem
              title="Settings"
              subtitle="Shop profile, branches & security preferences"
              leadingIcon="settings-outline"
              onPress={() => router.push('/(app)/settings')}
            />
          )}

          <GoldifiListItem
            title="Session Security Test"
            subtitle="Demonstrate 15-minute inactive session lock"
            leadingIcon="timer-outline"
            leadingIconBg={Colors.warningLight}
            leadingIconColor={Colors.warning}
            onPress={() => router.push('/(auth)/session-expired')}
          />

          <GoldifiListItem
            title="Sign Out"
            subtitle="Revoke branch mobile access"
            leadingIcon="log-out-outline"
            leadingIconBg={Colors.errorLight}
            leadingIconColor={Colors.error}
            destructive
            onPress={handleLogout}
          />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenHorizontal,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  headerTitle: {
    ...Typography.screenTitle,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  content: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: 16,
    paddingBottom: 40,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: 16,
    marginBottom: 24,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...Typography.sectionTitle,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  userEmail: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  roleTag: {
    backgroundColor: Colors.charcoal,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.pill,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  roleTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.white,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: 10,
  },
  groupedList: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    overflow: 'hidden',
    marginBottom: 24,
  },
});

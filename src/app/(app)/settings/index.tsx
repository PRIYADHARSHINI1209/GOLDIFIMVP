import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { Radius } from '@/theme/radius';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { GoldifiHeader } from '@/components/ui/GoldifiHeader';
import { GoldifiListItem } from '@/components/lists/GoldifiListItem';
import { GoldifiAccessDenied } from '@/components/feedback/GoldifiAccessDenied';

export default function SettingsIndexScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { canViewSettings, canManageSettings, canViewAudit } = usePermissions();

  if (!canViewSettings) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <GoldifiAccessDenied
          requiredPermission="settings.view"
          customMessage="You do not have authorization to view shop configurations."
        />
      </SafeAreaView>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/welcome');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <GoldifiHeader title="Shop Settings" subtitle="Branch profile & security" showBack />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionHeader}>SHOP & BRANCH</Text>
        <View style={styles.group}>
          <GoldifiListItem
            title="Shop & Branch Profile"
            subtitle="Business name, GSTIN, address and branches"
            leadingIcon="business-outline"
            onPress={() => router.push('/(app)/settings/shop')}
          />
          {canManageSettings && (
            <GoldifiListItem
              title="Access & Default Terms"
              subtitle="Interest rates, tenure ceilings, LTV thresholds"
              leadingIcon="options-outline"
              onPress={() => router.push('/(app)/settings/access')}
            />
          )}
        </View>

        <Text style={styles.sectionHeader}>SECURITY & COMPLIANCE</Text>
        <View style={styles.group}>
          <GoldifiListItem
            title="Security & Session State"
            subtitle="MFA configuration, active devices, auto-lock"
            leadingIcon="shield-checkmark-outline"
            onPress={() => router.push('/(app)/settings/security')}
          />
          {canViewAudit && (
            <GoldifiListItem
              title="Audit Logs"
              subtitle="Transaction and staff event audit history"
              leadingIcon="document-text-outline"
              onPress={() => router.push('/(app)/settings/audit')}
            />
          )}
        </View>

        <Text style={styles.sectionHeader}>APPLICATION INFO</Text>
        <View style={styles.group}>
          <GoldifiListItem
            title="About Goldifi"
            subtitle="Version 1.0.0 • Expo SDK 57 Native"
            leadingIcon="information-circle-outline"
            onPress={() => alert('GOLDIFI Mobile Pawnshop CRM v1.0.0 (Expo SDK 57)')}
          />
          <GoldifiListItem
            title="Sign Out"
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
  content: {
    padding: Spacing.screenHorizontal,
    paddingTop: 16,
    paddingBottom: 40,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: 8,
  },
  group: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    overflow: 'hidden',
    marginBottom: 20,
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { Radius } from '@/theme/radius';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { PERMISSION_GROUPS } from '@/permissions/permissions';
import { Permission } from '@/types';
import { GoldifiHeader } from '@/components/ui/GoldifiHeader';
import { GoldifiPermissionRow } from '@/components/ui/GoldifiPermissionRow';
import { GoldifiAccessDenied } from '@/components/feedback/GoldifiAccessDenied';

export default function PermissionsMatrixScreen() {
  const { user, permissions } = useAuth();
  const { canManageEmployees } = usePermissions();

  const [activePerms, setActivePerms] = useState<Permission[]>([...permissions]);

  if (!canManageEmployees) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <GoldifiAccessDenied
          requiredPermission="employees.manage"
          customMessage="Only branch managers and owners can access the RBAC permission matrix."
        />
      </SafeAreaView>
    );
  }

  const handleToggle = (permissionKey: Permission, granted: boolean) => {
    let updated: Permission[];
    if (granted) {
      updated = [...activePerms, permissionKey];
    } else {
      updated = activePerms.filter((p) => p !== permissionKey);
    }
    setActivePerms(updated);
    user.permissions = updated; // Updates session immediately for dynamic testing
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <GoldifiHeader
        title="Permission Matrix"
        subtitle={`Role: ${user.role.replace('_', ' ')} (${activePerms.length} Active)`}
        showBack
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Banner */}
        <View style={styles.infoCard}>
          <Ionicons name="shield-checkmark" size={20} color={Colors.primary} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Role-Based Access Control (RBAC)</Text>
            <Text style={styles.infoDesc}>
              Toggle individual permissions below to test real-time UI adaptation, feature gates, and operational limits.
            </Text>
          </View>
        </View>

        {PERMISSION_GROUPS.map((group) => {
          return (
            <View key={group.id} style={styles.groupCard}>
              <View style={styles.groupHeader}>
                <Text style={styles.groupTitle}>{group.name}</Text>
                <Text style={styles.groupDesc}>{group.description}</Text>
              </View>

              {group.permissions.map((p) => {
                const isGranted = activePerms.includes(p.key);
                return (
                  <GoldifiPermissionRow
                    key={p.key}
                    label={p.label}
                    description={p.description}
                    isGranted={isGranted}
                    onToggle={(granted) => handleToggle(p.key, granted)}
                  />
                );
              })}
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
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: Colors.primaryLight,
    padding: 14,
    borderRadius: Radius.md,
    marginBottom: 20,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.charcoal,
  },
  infoDesc: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  groupCard: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: 16,
    marginBottom: 16,
  },
  groupHeader: {
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    paddingBottom: 8,
  },
  groupTitle: {
    ...Typography.sectionTitle,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  groupDesc: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});

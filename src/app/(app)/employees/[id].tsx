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
import { usePermissions } from '@/hooks/usePermissions';
import { mockEmployeeService } from '@/services/employees/employeeService';
import { Employee, UserRole } from '@/types';
import { ROLE_DEFINITIONS } from '@/permissions/roles';
import { GoldifiHeader } from '@/components/ui/GoldifiHeader';
import { GoldifiAvatar } from '@/components/ui/GoldifiAvatar';
import { GoldifiButton } from '@/components/ui/GoldifiButton';
import { GoldifiModal } from '@/components/feedback/GoldifiModal';
import { GoldifiLoadingState } from '@/components/feedback/GoldifiLoadingState';

const ROLES: UserRole[] = ['OWNER', 'MANAGER', 'PAWN_OFFICER', 'CASHIER', 'INVENTORY_STAFF'];

export default function EmployeeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { canManageEmployees } = usePermissions();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [roleModalVisible, setRoleModalVisible] = useState(false);

  useEffect(() => {
    if (!id) return;
    mockEmployeeService.getEmployeeById(id).then((emp) => {
      if (emp) setEmployee(emp);
      setLoading(false);
    });
  }, [id]);

  const handleChangeRole = async (newRole: UserRole) => {
    if (!employee) return;
    const updated = await mockEmployeeService.updateRole(employee.id, newRole);
    if (updated) setEmployee({ ...updated });
    setRoleModalVisible(false);
    alert(`Employee role updated to ${newRole}`);
  };

  if (loading || !employee) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <GoldifiHeader title="Employee File" showBack />
        <GoldifiLoadingState message="Loading staff credentials..." />
      </SafeAreaView>
    );
  }

  const initials = employee.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2);

  const roleDef = ROLE_DEFINITIONS[employee.role];

  return (
    <SafeAreaView style={styles.safeArea}>
      <GoldifiHeader
        title={employee.name}
        subtitle={roleDef.displayName}
        showBack
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <GoldifiAvatar initials={initials} size="lg" backgroundColor={Colors.charcoal} />
          <Text style={styles.name}>{employee.name}</Text>
          <Text style={styles.email}>{employee.email}</Text>
          <Text style={styles.phone}>{employee.phone}</Text>

          <View style={styles.statusBadge}>
            <View style={styles.activeDot} />
            <Text style={styles.statusText}>Active Branch Staff</Text>
          </View>
        </View>

        {/* Assigned Role & Capabilities */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Assigned Role & Permissions</Text>
            {canManageEmployees && (
              <Pressable
                onPress={() => setRoleModalVisible(true)}
                style={styles.changeRoleBtn}
              >
                <Text style={styles.changeRoleText}>Change Role</Text>
              </Pressable>
            )}
          </View>

          <View style={styles.roleSummaryBox}>
            <Text style={styles.roleName}>{roleDef.displayName}</Text>
            <Text style={styles.roleDesc}>{roleDef.description}</Text>
            <View style={styles.badgeRow}>
              <View style={styles.scopeTag}>
                <Ionicons name="business-outline" size={12} color={Colors.textSecondary} />
                <Text style={styles.scopeTagText}>
                  Scope: {roleDef.defaultScope === 'ALL_BRANCHES' ? 'All Branches' : 'Main Branch Only'}
                </Text>
              </View>
              <Text style={styles.permCountText}>
                {employee.permissions.length} Active Permissions
              </Text>
            </View>
          </View>
        </View>

        {/* Permissions Breakdown Preview */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Authorized Capabilities</Text>
          <View style={styles.permTags}>
            {employee.permissions.map((p) => (
              <View key={p} style={styles.permChip}>
                <Ionicons name="checkmark-circle" size={13} color={Colors.success} />
                <Text style={styles.permChipText}>{p}</Text>
              </View>
            ))}
          </View>
        </View>

        {canManageEmployees && (
          <View style={{ marginTop: 8 }}>
            <GoldifiButton
              label="Open Full Permission Matrix"
              onPress={() => router.push('/(app)/employees/permissions')}
              variant="outline"
              iconName="shield-checkmark-outline"
              size="lg"
            />
          </View>
        )}
      </ScrollView>

      {/* Change Role Modal */}
      <GoldifiModal
        visible={roleModalVisible}
        onClose={() => setRoleModalVisible(false)}
        title="Modify Staff Role"
        subtitle={`Employee: ${employee.name}`}
      >
        <ScrollView style={{ maxHeight: 380 }}>
          {ROLES.map((r) => {
            const def = ROLE_DEFINITIONS[r];
            const isSelected = r === employee.role;

            return (
              <Pressable
                key={r}
                onPress={() => handleChangeRole(r)}
                style={[styles.roleSelectRow, isSelected && styles.roleSelectRowActive]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.selectRoleTitle, isSelected && { color: Colors.primary }]}>
                    {def.displayName}
                  </Text>
                  <Text style={styles.selectRoleDesc}>{def.description}</Text>
                </View>
                <Ionicons
                  name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                  size={20}
                  color={isSelected ? Colors.primary : Colors.textMuted}
                />
              </Pressable>
            );
          })}
        </ScrollView>
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
  profileCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    ...Typography.sectionTitle,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 10,
  },
  email: {
    ...Typography.secondary,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  phone: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.successLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    marginTop: 12,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.success,
  },
  card: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  changeRoleBtn: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  changeRoleText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  roleSummaryBox: {
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: Radius.sm,
  },
  roleName: {
    ...Typography.bodyMedium,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  roleDesc: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scopeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scopeTagText: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  permCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
  permTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  permChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surfaceSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  permChipText: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.charcoal,
  },
  roleSelectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    marginBottom: 8,
  },
  roleSelectRowActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  selectRoleTitle: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  selectRoleDesc: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});

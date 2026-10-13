import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { Radius } from '@/theme/radius';
import { usePermissions } from '@/hooks/usePermissions';
import { mockEmployeeService } from '@/services/employees/employeeService';
import { Employee } from '@/types';
import { GoldifiHeader } from '@/components/ui/GoldifiHeader';
import { GoldifiAvatar } from '@/components/ui/GoldifiAvatar';
import { GoldifiLoadingState } from '@/components/feedback/GoldifiLoadingState';
import { GoldifiAccessDenied } from '@/components/feedback/GoldifiAccessDenied';
import { Shadows } from '@/theme/shadows';

export default function EmployeesScreen() {
  const router = useRouter();
  const { canViewEmployees, canManageEmployees } = usePermissions();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (canViewEmployees) {
      mockEmployeeService.getEmployees().then((data) => {
        setEmployees(data);
        setLoading(false);
      });
    }
  }, [canViewEmployees]);

  if (!canViewEmployees) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <GoldifiAccessDenied
          requiredPermission="employees.view"
          customMessage="Only branch managers and owners can access employee records and security credentials."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <GoldifiHeader
        title="Staff & Roles"
        subtitle={`${employees.length} team members`}
        showBack
        rightAction={
          canManageEmployees ? (
            <Pressable
              onPress={() => router.push('/(app)/employees/permissions')}
              style={styles.matrixBtn}
              accessibilityRole="button"
            >
              <Ionicons name="shield-checkmark" size={16} color={Colors.primary} />
              <Text style={styles.matrixBtnText}>Matrix</Text>
            </Pressable>
          ) : undefined
        }
      />

      {loading ? (
        <GoldifiLoadingState message="Loading branch employee directory..." />
      ) : (
        <FlatList
          data={employees}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const initials = item.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .substring(0, 2);

            return (
              <Pressable
                onPress={() => router.push(`/(app)/employees/${item.id}` as any)}
                style={({ pressed }) => [
                  styles.card,
                  pressed && styles.pressed,
                ]}
                accessibilityRole="button"
              >
                <View style={styles.cardLeft}>
                  <GoldifiAvatar initials={initials} size="md" backgroundColor={Colors.charcoal} />
                  <View style={styles.info}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.email}>{item.email}</Text>
                    <View style={styles.branchTag}>
                      <Ionicons name="business-outline" size={11} color={Colors.textSecondary} />
                      <Text style={styles.branchText}>{item.branchName}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.cardRight}>
                  <View style={styles.roleTag}>
                    <Text style={styles.roleText}>{item.role.replace('_', ' ')}</Text>
                  </View>
                  <Text style={styles.activeText}>Active</Text>
                </View>
              </Pressable>
            );
          }}
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
  list: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: 16,
    paddingBottom: 40,
  },
  matrixBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.pill,
  },
  matrixBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: 14,
    marginBottom: 10,
    ...Shadows.subtle,
  },
  pressed: {
    backgroundColor: Colors.surface,
    borderColor: Colors.primary,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  info: {
    flex: 1,
  },
  name: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  email: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  branchTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  branchText: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  cardRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  roleTag: {
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.sm,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.charcoal,
  },
  activeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.success,
  },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Radius } from '@/theme/radius';
import { Typography } from '@/theme/typography';
import { Shadows } from '@/theme/shadows';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { ROLE_DEFINITIONS } from '@/permissions/roles';
import { GoldifiModal } from '../feedback/GoldifiModal';

const ROLES: UserRole[] = ['OWNER', 'MANAGER', 'PAWN_OFFICER', 'CASHIER', 'INVENTORY_STAFF'];

export const RoleSimulatorWidget: React.FC = () => {
  const { user, role, switchDemoRole } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectRole = async (selectedRole: UserRole) => {
    await switchDemoRole(selectedRole);
    setModalVisible(false);
  };

  return (
    <>
      <Pressable
        onPress={() => setModalVisible(true)}
        style={styles.floatingTrigger}
        accessibilityRole="button"
        accessibilityLabel="Open Development Role Simulator"
      >
        <View style={styles.pillContent}>
          <View style={styles.badgeIcon}>
            <Ionicons name="construct" size={12} color={Colors.white} />
          </View>
          <View>
            <Text style={styles.triggerLabel}>SIMULATOR</Text>
            <Text style={styles.currentRole}>{role.replace('_', ' ')}</Text>
          </View>
        </View>
      </Pressable>

      <GoldifiModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Role Simulator"
        subtitle="DEVELOPMENT PROTOTYPE ONLY"
      >
        <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.devDisclaimer}>
            <Ionicons name="information-circle-outline" size={18} color={Colors.info} />
            <Text style={styles.disclaimerText}>
              Switch authenticated role to preview live UI changes, tab access, and operational permission restrictions.
            </Text>
          </View>

          <Text style={styles.sectionHeader}>SELECT DEMO ACCOUNT</Text>

          {ROLES.map((r) => {
            const def = ROLE_DEFINITIONS[r];
            const isSelected = r === role;

            return (
              <Pressable
                key={r}
                onPress={() => handleSelectRole(r)}
                style={[
                  styles.roleOption,
                  isSelected && styles.selectedOption,
                ]}
                accessibilityRole="button"
              >
                <View style={styles.optionHeader}>
                  <View style={styles.roleTitleRow}>
                    <Text style={[styles.roleTitle, isSelected && { color: Colors.primary }]}>
                      {def.displayName}
                    </Text>
                    {isSelected && (
                      <View style={styles.activeTag}>
                        <Text style={styles.activeTagText}>ACTIVE</Text>
                      </View>
                    )}
                  </View>
                  <Ionicons
                    name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                    size={20}
                    color={isSelected ? Colors.primary : Colors.textMuted}
                  />
                </View>

                <Text style={styles.roleDesc}>{def.description}</Text>

                <View style={styles.metaRow}>
                  <View style={styles.scopeTag}>
                    <Ionicons name="business-outline" size={12} color={Colors.textSecondary} />
                    <Text style={styles.scopeText}>
                      Scope: {def.defaultScope === 'ALL_BRANCHES' ? 'All Branches' : 'Single Branch'}
                    </Text>
                  </View>
                  <Text style={styles.permCount}>
                    {def.defaultPermissions.length} Permissions
                  </Text>
                </View>
              </Pressable>
            );
          })}

          <View style={styles.currentUserFooter}>
            <Text style={styles.footerLabel}>Current Mock Profile:</Text>
            <Text style={styles.footerValue}>{user.name} ({user.email})</Text>
            <Text style={styles.footerBranch}>Branch: {user.branchName}</Text>
          </View>
        </ScrollView>
      </GoldifiModal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingTrigger: {
    backgroundColor: Colors.charcoal,
    borderRadius: Radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    ...Shadows.subtle,
  },
  pillContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgeIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  triggerLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: Colors.primaryLight,
    letterSpacing: 0.8,
  },
  currentRole: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.white,
    marginTop: -2,
  },
  modalScroll: {
    maxHeight: 460,
  },
  devDisclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Colors.infoLight,
    padding: 10,
    borderRadius: Radius.sm,
    marginBottom: 16,
  },
  disclaimerText: {
    ...Typography.caption,
    color: Colors.info,
    flex: 1,
    lineHeight: 16,
  },
  sectionHeader: {
    ...Typography.captionSemibold,
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: 10,
  },
  roleOption: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: 12,
    marginBottom: 10,
  },
  selectedOption: {
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  roleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleTitle: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  activeTag: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  activeTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.primary,
  },
  roleDesc: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: 8,
    lineHeight: 16,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scopeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scopeText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  permCount: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
  },
  currentUserFooter: {
    marginTop: 8,
    padding: 12,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.sm,
  },
  footerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  footerValue: {
    ...Typography.captionSemibold,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  footerBranch: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 1,
  },
});

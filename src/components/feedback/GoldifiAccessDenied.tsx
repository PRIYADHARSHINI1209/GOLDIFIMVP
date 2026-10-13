import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import { Radius } from '@/theme/radius';
import { GoldifiButton } from '../ui/GoldifiButton';
import { useAuth } from '@/context/AuthContext';

interface GoldifiAccessDeniedProps {
  requiredPermission?: string;
  customMessage?: string;
}

export const GoldifiAccessDenied: React.FC<GoldifiAccessDeniedProps> = ({
  requiredPermission,
  customMessage,
}) => {
  const router = useRouter();
  const { role } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="lock-closed" size={38} color={Colors.warning} />
      </View>
      <Text style={styles.title}>Access Restricted</Text>
      <Text style={styles.message}>
        {customMessage ||
          'Your authenticated account role does not have authorization to view or execute operations in this section.'}
      </Text>

      <View style={styles.detailBox}>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Current Role:</Text>
          <Text style={styles.metaValue}>{role}</Text>
        </View>
        {requiredPermission && (
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Required Scope:</Text>
            <Text style={styles.metaValue}>{requiredPermission}</Text>
          </View>
        )}
      </View>

      <View style={styles.btnRow}>
        <GoldifiButton
          label="Return to Dashboard"
          onPress={() => router.replace('/(app)/dashboard')}
          variant="outline"
          iconName="arrow-back"
          fullWidth={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: Colors.white,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: Radius.pill,
    backgroundColor: Colors.warningLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    ...Typography.sectionTitle,
    fontSize: 20,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: 8,
  },
  message: {
    ...Typography.secondary,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  detailBox: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    marginBottom: 24,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  metaLabel: {
    ...Typography.captionMedium,
    color: Colors.textSecondary,
  },
  metaValue: {
    ...Typography.captionSemibold,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  btnRow: {
    minWidth: 200,
  },
});

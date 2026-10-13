import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { Radius } from '@/theme/radius';
import { GoldifiHeader } from '@/components/ui/GoldifiHeader';
import { GoldifiButton } from '@/components/ui/GoldifiButton';

export default function SecuritySettingsScreen() {
  const router = useRouter();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <GoldifiHeader title="Security & Sessions" subtitle="Access protection" showBack />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Security Controls */}
        <Text style={styles.sectionHeader}>MULTI-FACTOR & AUTH</Text>
        <View style={styles.card}>
          <View style={styles.toggleRow}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text style={styles.toggleTitle}>Two-Factor Verification (2FA)</Text>
              <Text style={styles.toggleDesc}>
                Requires SMS/App OTP on every new employee login.
              </Text>
            </View>
            <Switch
              value={twoFactorEnabled}
              onValueChange={setTwoFactorEnabled}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={twoFactorEnabled ? Colors.primary : Colors.surfaceSecondary}
            />
          </View>

          <View style={[styles.toggleRow, { borderBottomWidth: 0 }]}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text style={styles.toggleTitle}>Biometric Unlock</Text>
              <Text style={styles.toggleDesc}>
                Use Fingerprint or FaceID to unlock branch vault terminal.
              </Text>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={biometricEnabled ? Colors.primary : Colors.surfaceSecondary}
            />
          </View>
        </View>

        {/* Inactivity Auto-Lock */}
        <Text style={styles.sectionHeader}>SESSION TIMEOUT</Text>
        <View style={styles.card}>
          <View style={styles.sessionRow}>
            <View>
              <Text style={styles.sessionTitle}>Idle Session Auto-Lock</Text>
              <Text style={styles.sessionSub}>Compliant with RBI cyber security framework</Text>
            </View>
            <View style={styles.timeTag}>
              <Text style={styles.timeText}>15 Minutes</Text>
            </View>
          </View>

          <View style={{ marginTop: 14 }}>
            <GoldifiButton
              label="Test Session Expired Screen"
              onPress={() => router.push('/(auth)/session-expired')}
              variant="outline"
              size="sm"
              iconName="timer-outline"
            />
          </View>
        </View>

        {/* Active Branch Devices */}
        <Text style={styles.sectionHeader}>ACTIVE REGISTERED DEVICES</Text>
        <View style={styles.card}>
          <View style={styles.deviceRow}>
            <Ionicons name="phone-portrait-outline" size={24} color={Colors.primary} />
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceName}>Expo Native Mobile Client (Current)</Text>
              <Text style={styles.deviceMeta}>Chennai, India • IP 103.28.14.92</Text>
            </View>
            <View style={styles.onlineBadge}>
              <Text style={styles.onlineText}>THIS DEVICE</Text>
            </View>
          </View>

          <View style={[styles.deviceRow, { borderBottomWidth: 0, marginTop: 10, paddingTop: 10 }]}>
            <Ionicons name="tablet-landscape-outline" size={24} color={Colors.textMuted} />
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceName}>Counter Tablet 01 (T. Nagar)</Text>
              <Text style={styles.deviceMeta}>Last active: 45 mins ago</Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <GoldifiButton
            label="Revoke All Other Sessions"
            onPress={() => alert('All other branch sessions revoked.')}
            variant="secondary"
            size="md"
            iconName="lock-closed-outline"
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
  card: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: 14,
    marginBottom: 20,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  toggleTitle: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  toggleDesc: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  sessionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionTitle: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sessionSub: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  timeTag: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    paddingBottom: 10,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    ...Typography.captionSemibold,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  deviceMeta: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 1,
  },
  onlineBadge: {
    backgroundColor: Colors.successLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  onlineText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.success,
  },
});

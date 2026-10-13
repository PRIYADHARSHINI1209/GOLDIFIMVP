import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import { Radius } from '@/theme/radius';
import { GoldifiButton } from '@/components/ui/GoldifiButton';

export default function SessionExpiredScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="timer-outline" size={44} color={Colors.warning} />
        </View>

        <Text style={styles.title}>Session Expired</Text>
        <Text style={styles.message}>
          For pawnshop vault security and compliance protection, inactive sessions are automatically locked after 15 minutes of inactivity.
        </Text>

        <View style={styles.noteBox}>
          <Text style={styles.noteTitle}>SECURITY AUDIT LOGGED</Text>
          <Text style={styles.noteText}>
            Branch session token was securely revoked. Please re-authenticate to resume CRM transactions.
          </Text>
        </View>

        <View style={styles.btnRow}>
          <GoldifiButton
            label="Re-authenticate Now"
            onPress={() => router.replace('/(auth)/login')}
            size="lg"
            iconName="log-in-outline"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: Radius.pill,
    backgroundColor: Colors.warningLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    ...Typography.screenTitle,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    ...Typography.secondary,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  noteBox: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: 14,
    width: '100%',
    marginBottom: 28,
  },
  noteTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.warning,
    letterSpacing: 1,
    marginBottom: 4,
  },
  noteText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  btnRow: {
    width: '100%',
  },
});

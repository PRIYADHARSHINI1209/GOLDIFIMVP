import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import { Radius } from '@/theme/radius';
import { GoldifiButton } from '@/components/ui/GoldifiButton';

export default function AuthErrorScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="close-circle-outline" size={44} color={Colors.error} />
        </View>

        <Text style={styles.title}>Authentication Failed</Text>
        <Text style={styles.message}>
          The branch security service was unable to verify your employee credentials. Account status may be suspended or branch IP may be unverified.
        </Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>ERROR CODE: ERR_AUTH_MOCK_DISALLOWED</Text>
          <Text style={styles.infoDesc}>
            Check your email address spelling or request an employee password reset from your branch manager.
          </Text>
        </View>

        <View style={styles.btnRow}>
          <GoldifiButton
            label="Try Again"
            onPress={() => router.replace('/(auth)/login')}
            size="lg"
            iconName="refresh"
          />
          <View style={{ height: 10 }} />
          <GoldifiButton
            label="Return Home"
            onPress={() => router.replace('/(auth)/welcome')}
            variant="outline"
            size="md"
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
    backgroundColor: Colors.errorLight,
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
  infoCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: 14,
    width: '100%',
    marginBottom: 28,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.error,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  infoDesc: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  btnRow: {
    width: '100%',
  },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { Radius } from '@/theme/radius';
import { GoldifiHeader } from '@/components/ui/GoldifiHeader';
import { GoldifiInput } from '@/components/ui/GoldifiInput';
import { GoldifiButton } from '@/components/ui/GoldifiButton';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 400);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <GoldifiHeader title="Reset Password" showBack />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.iconCircle}>
          <Ionicons name="lock-open-outline" size={32} color={Colors.primary} />
        </View>

        <Text style={styles.heading}>Account Recovery</Text>
        <Text style={styles.subtext}>
          Enter your registered employee email. Your branch administrator will receive the recovery notification.
        </Text>

        {submitted ? (
          <View style={styles.successCard}>
            <Ionicons name="checkmark-circle" size={44} color={Colors.success} />
            <Text style={styles.successTitle}>Recovery Request Submitted</Text>
            <Text style={styles.successDesc}>
              A secure password reset authorization request has been routed to your branch owner/manager.
            </Text>
            <View style={{ height: 16 }} />
            <GoldifiButton
              label="Back to Login"
              onPress={() => router.back()}
              variant="outline"
              size="md"
            />
          </View>
        ) : (
          <View style={styles.form}>
            <GoldifiInput
              label="Employee Email"
              placeholder="e.g. employee@goldifi.test"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leadingIcon="mail-outline"
            />

            <GoldifiButton
              label="Send Recovery Request"
              onPress={handleSubmit}
              loading={loading}
              size="lg"
            />
          </View>
        )}
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
    paddingTop: 24,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: Radius.pill,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  heading: {
    ...Typography.screenTitle,
    color: Colors.textPrimary,
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 8,
  },
  subtext: {
    ...Typography.secondary,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  form: {
    backgroundColor: Colors.white,
  },
  successCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: 24,
    alignItems: 'center',
    textAlign: 'center',
  },
  successTitle: {
    ...Typography.sectionTitle,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 6,
  },
  successDesc: {
    ...Typography.secondary,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

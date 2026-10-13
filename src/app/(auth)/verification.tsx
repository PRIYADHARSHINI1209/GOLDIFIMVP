import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { Radius } from '@/theme/radius';
import { GoldifiHeader } from '@/components/ui/GoldifiHeader';
import { GoldifiInput } from '@/components/ui/GoldifiInput';
import { GoldifiButton } from '@/components/ui/GoldifiButton';

export default function VerificationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const [otp, setOtp] = useState('7492');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const email = params.email || 'employee@goldifi.test';

  const handleVerify = () => {
    if (otp.length < 4) {
      setError('Please enter the 4-digit code');
      return;
    }
    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      router.replace('/(app)/dashboard');
    }, 400);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <GoldifiHeader title="Two-Factor Security" showBack />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.iconCircle}>
          <Ionicons name="keypad" size={32} color={Colors.primary} />
        </View>

        <Text style={styles.heading}>Security Code</Text>
        <Text style={styles.subtext}>
          A one-time verification passcode has been sent to your registered device for {email}.
        </Text>

        <View style={styles.form}>
          <GoldifiInput
            label="4-Digit Authorization Code"
            placeholder="7492"
            value={otp}
            onChangeText={(t) => {
              setOtp(t);
              if (error) setError('');
            }}
            keyboardType="number-pad"
            maxLength={6}
            leadingIcon="shield-checkmark-outline"
            error={error}
            helperText="Demo passcode is pre-filled (7492)"
          />

          <GoldifiButton
            label="Verify & Open CRM"
            onPress={handleVerify}
            loading={loading}
            size="lg"
            iconName="checkmark-circle"
          />

          <View style={styles.resendRow}>
            <Text style={styles.resendLabel}>Didn't receive code?</Text>
            <Pressable onPress={() => alert('New verification code sent.')}>
              <Text style={styles.resendLink}>Resend Code</Text>
            </Pressable>
          </View>
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
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 20,
  },
  resendLabel: {
    ...Typography.secondary,
    color: Colors.textMuted,
  },
  resendLink: {
    ...Typography.secondaryMedium,
    color: Colors.primary,
    fontWeight: '600',
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
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
import { useAuth } from '@/context/AuthContext';
import { DEMO_USERS } from '@/mock/users';

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ shopCode?: string; shopName?: string }>();
  const { login } = useAuth();

  const [email, setEmail] = useState('demo-owner@goldifi.test');
  const [password, setPassword] = useState('goldifi123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const shopCode = params.shopCode || 'KUMAR-TN';

  const handleLogin = async () => {
    if (!email.trim()) {
      setError('Please enter your employee email');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email.trim(), shopCode);
      // Navigate to 2FA verification step for complete security flow demonstration
      router.push({
        pathname: '/(auth)/verification',
        params: { email: email.trim() },
      });
    } catch {
      setError('Invalid credentials for this branch.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemoPill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('goldifi123');
    setError('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <GoldifiHeader title="Sign In" showBack />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.shopBadge}>
            <Ionicons name="business" size={14} color={Colors.primary} />
            <Text style={styles.shopText}>Shop: {shopCode}</Text>
          </View>

          <Text style={styles.heading}>Employee Login</Text>
          <Text style={styles.subtext}>
            Enter your authorized Goldifi credentials to access branch records.
          </Text>

          {/* Development Demo Quick Select */}
          <View style={styles.demoBox}>
            <Text style={styles.demoLabel}>QUICK SELECT DEMO ROLE:</Text>
            <View style={styles.pillsRow}>
              {Object.keys(DEMO_USERS).map((roleKey) => {
                const u = DEMO_USERS[roleKey];
                const isSelected = email.toLowerCase() === u.email.toLowerCase();
                return (
                  <Pressable
                    key={roleKey}
                    onPress={() => handleSelectDemoPill(u.email)}
                    style={[styles.pill, isSelected && styles.pillActive]}
                  >
                    <Text style={[styles.pillText, isSelected && styles.pillTextActive]}>
                      {u.role.replace('_', ' ')}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.form}>
            <GoldifiInput
              label="Employee Email"
              placeholder="e.g. employee@goldifi.test"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                if (error) setError('');
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              leadingIcon="mail-outline"
            />

            <GoldifiInput
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                if (error) setError('');
              }}
              isPassword
              leadingIcon="lock-closed-outline"
              error={error}
            />

            <View style={styles.forgotRow}>
              <Pressable onPress={() => router.push('/(auth)/forgot-password')}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </Pressable>
            </View>

            <GoldifiButton
              label="Sign In"
              onPress={handleLogin}
              loading={loading}
              size="lg"
            />
          </View>

          <View style={styles.footerNote}>
            <Ionicons name="shield-checkmark-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.footerText}>
              Role-based session enforcement & audit trails active.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  },
  shopBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  shopText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  heading: {
    ...Typography.screenTitle,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtext: {
    ...Typography.secondary,
    color: Colors.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  demoBox: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: 12,
    marginBottom: 20,
  },
  demoLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pillActive: {
    backgroundColor: Colors.charcoal,
    borderColor: Colors.charcoal,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  pillTextActive: {
    color: Colors.white,
    fontWeight: '700',
  },
  form: {
    marginBottom: 20,
  },
  forgotRow: {
    alignItems: 'flex-end',
    marginBottom: 20,
    marginTop: -8,
  },
  forgotText: {
    ...Typography.secondaryMedium,
    color: Colors.primary,
    fontWeight: '600',
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
  },
  footerText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
});

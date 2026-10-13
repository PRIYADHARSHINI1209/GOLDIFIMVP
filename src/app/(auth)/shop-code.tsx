import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
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
import { MOCK_ORGANIZATION } from '@/mock/organizations';

export default function ShopCodeScreen() {
  const router = useRouter();
  const [shopCode, setShopCode] = useState('KUMAR-TN');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = () => {
    if (!shopCode.trim()) {
      setError('Please enter your 6 to 8 character shop code');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      if (shopCode.trim().toUpperCase() === MOCK_ORGANIZATION.code || shopCode.trim().toUpperCase() === 'GOLDIFI') {
        router.push({
          pathname: '/(auth)/login',
          params: { shopCode: shopCode.trim().toUpperCase(), shopName: MOCK_ORGANIZATION.name },
        });
      } else {
        setError('Shop code not found. For demo, use: KUMAR-TN');
      }
    }, 400);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <GoldifiHeader title="Organization Access" showBack />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.iconCircle}>
            <Ionicons name="business" size={32} color={Colors.primary} />
          </View>

          <Text style={styles.heading}>Enter Shop Code</Text>
          <Text style={styles.subtext}>
            Enter the unique shop or organization identifier provided by your administrator.
          </Text>

          <View style={styles.formCard}>
            <GoldifiInput
              label="Shop Identifier"
              placeholder="e.g. KUMAR-TN"
              value={shopCode}
              onChangeText={(text) => {
                setShopCode(text);
                if (error) setError('');
              }}
              autoCapitalize="characters"
              leadingIcon="key-outline"
              error={error}
              helperText="Demo organization code: KUMAR-TN"
            />

            <GoldifiButton
              label="Continue to Login"
              onPress={handleVerify}
              loading={loading}
              size="lg"
              iconName="arrow-forward"
              iconPosition="right"
            />
          </View>

          <View style={styles.orgPreview}>
            <Text style={styles.previewTitle}>CURRENT DEMO TENANT</Text>
            <Text style={styles.orgName}>{MOCK_ORGANIZATION.name}</Text>
            <Text style={styles.orgMeta}>Branches: 3 | Code: {MOCK_ORGANIZATION.code}</Text>
            <Text style={styles.orgAddress}>{MOCK_ORGANIZATION.address}</Text>
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
    paddingHorizontal: 12,
  },
  formCard: {
    backgroundColor: Colors.white,
    marginBottom: 24,
  },
  orgPreview: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: 16,
  },
  previewTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  orgName: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  orgMeta: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  orgAddress: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 4,
    lineHeight: 16,
  },
});

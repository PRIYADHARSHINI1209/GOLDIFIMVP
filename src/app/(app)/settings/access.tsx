import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { Radius } from '@/theme/radius';
import { GoldifiHeader } from '@/components/ui/GoldifiHeader';
import { GoldifiInput } from '@/components/ui/GoldifiInput';
import { GoldifiButton } from '@/components/ui/GoldifiButton';

export default function AccessSettingsScreen() {
  const [baseInterest, setBaseInterest] = useState('1.50');
  const [maxLtv, setMaxLtv] = useState('75');
  const [defaultTenure, setDefaultTenure] = useState('12');
  const [gracePeriodDays, setGracePeriodDays] = useState('7');

  const handleSave = () => {
    alert('Branch lending terms and risk thresholds updated.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <GoldifiHeader title="Lending Rules & Terms" subtitle="Default branch parameters" showBack />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionHeader}>REGULATORY & RISK CEILINGS</Text>
        <View style={styles.card}>
          <GoldifiInput
            label="Standard Monthly Interest Rate (%)"
            placeholder="1.50"
            value={baseInterest}
            onChangeText={setBaseInterest}
            keyboardType="numeric"
            helperText="Applied to standard gold jewelry loan origination"
          />

          <GoldifiInput
            label="Maximum Allowed LTV (%)"
            placeholder="75"
            value={maxLtv}
            onChangeText={setMaxLtv}
            keyboardType="numeric"
            helperText="RBI regulatory cap for gold jewelry lending"
          />

          <GoldifiInput
            label="Default Loan Tenure (Months)"
            placeholder="12"
            value={defaultTenure}
            onChangeText={setDefaultTenure}
            keyboardType="numeric"
          />

          <GoldifiInput
            label="Maturity Notice Grace Period (Days)"
            placeholder="7"
            value={gracePeriodDays}
            onChangeText={setGracePeriodDays}
            keyboardType="numeric"
            helperText="Days before maturity when loan is marked 'Due Soon'"
          />
        </View>

        <GoldifiButton
          label="Save Lending Policy"
          onPress={handleSave}
          size="lg"
          iconName="checkmark-circle"
        />
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
});

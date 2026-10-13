import React, { useState, useEffect } from 'react';
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
import { formatINR, parseINR } from '@/utils/currency';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { mockLoanService } from '@/services/loans/loanService';
import { mockCustomerService } from '@/services/customers/customerService';
import { Customer, ItemCategory } from '@/types';
import { GoldifiHeader } from '@/components/ui/GoldifiHeader';
import { GoldifiInput } from '@/components/ui/GoldifiInput';
import { GoldifiButton } from '@/components/ui/GoldifiButton';
import { GoldifiAccessDenied } from '@/components/feedback/GoldifiAccessDenied';

const CATEGORIES: { key: ItemCategory; label: string }[] = [
  { key: 'GOLD_JEWELRY', label: 'Gold Jewelry' },
  { key: 'GOLD_COIN', label: 'Gold Bullion Coin' },
  { key: 'SILVER', label: 'Silver Articles' },
  { key: 'WATCH', label: 'Luxury Watch' },
  { key: 'ELECTRONICS', label: 'Electronics' },
];

export default function CreateLoanScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    customerId?: string;
    customerName?: string;
    customerPhone?: string;
  }>();
  const { user } = useAuth();
  const { canCreateLoan } = usePermissions();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(params.customerId || '');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const [principalStr, setPrincipalStr] = useState('');
  const [interestRate, setInterestRate] = useState('1.5');
  const [tenureMonths, setTenureMonths] = useState('12');

  const [category, setCategory] = useState<ItemCategory>('GOLD_JEWELRY');
  const [description, setDescription] = useState('');
  const [purity, setPurity] = useState('22K (916 Hallmarked)');
  const [grossWeight, setGrossWeight] = useState('');
  const [netWeight, setNetWeight] = useState('');
  const [marketValueStr, setMarketValueStr] = useState('');
  const [storageLocker, setStorageLocker] = useState('Vault Locker A-05');

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    mockCustomerService.getCustomers().then((list) => {
      setCustomers(list);
      if (params.customerId) {
        const found = list.find((c) => c.id === params.customerId);
        if (found) setSelectedCustomer(found);
      } else if (list.length > 0) {
        setSelectedCustomerId(list[0].id);
        setSelectedCustomer(list[0]);
      }
    });
  }, [params.customerId]);

  const handleSelectCustomer = (c: Customer) => {
    setSelectedCustomerId(c.id);
    setSelectedCustomer(c);
  };

  if (!canCreateLoan) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <GoldifiAccessDenied
          requiredPermission="loans.create"
          customMessage="You do not have authorization to originate new pawn loans."
        />
      </SafeAreaView>
    );
  }

  const principal = parseINR(principalStr);
  const marketVal = parseINR(marketValueStr);
  const ltvRatio = marketVal > 0 ? Math.round((principal / marketVal) * 100) : 0;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!selectedCustomerId) errs.customer = 'Please select a borrower';
    if (!principal || principal <= 0) errs.principal = 'Enter valid principal amount';
    if (!marketVal || marketVal <= 0) errs.marketValue = 'Enter estimated market value';
    if (!description.trim()) errs.description = 'Item description is required';
    if (!grossWeight.trim()) errs.grossWeight = 'Gross weight required';
    if (principal > marketVal) errs.principal = 'Principal exceeds 100% of collateral value';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleDisburse = async () => {
    if (!validate() || !selectedCustomer) return;
    setLoading(true);

    try {
      const newLoan = await mockLoanService.createLoan({
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.name,
        customerPhone: selectedCustomer.phone,
        branchId: user.branchId,
        branchName: user.branchName,
        principalAmount: principal,
        monthlyInterestRatePercent: parseFloat(interestRate) || 1.5,
        tenureMonths: parseInt(tenureMonths, 10) || 12,
        itemCategory: category,
        itemDescription: description.trim(),
        purityKarat: purity,
        grossWeightGrams: parseFloat(grossWeight) || 0,
        netWeightGrams: parseFloat(netWeight) || parseFloat(grossWeight) || 0,
        estimatedMarketValue: marketVal,
        storageLocker: storageLocker.trim() || 'Vault Tray 01',
        actorName: `${user.name} (${user.role.replace('_', ' ')})`,
      });

      router.replace(`/(app)/loans/${newLoan.id}` as any);
    } catch {
      alert('Failed to originate loan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <GoldifiHeader title="New Pawn Ticket" showBack />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {/* Customer Selection */}
          <View style={styles.sectionHeaderBox}>
            <Ionicons name="person-outline" size={18} color={Colors.primary} />
            <Text style={styles.sectionHeading}>SELECT BORROWER *</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.customerScroll}>
            {customers.map((c) => {
              const active = c.id === selectedCustomerId;
              return (
                <Pressable
                  key={c.id}
                  onPress={() => handleSelectCustomer(c)}
                  style={[styles.customerChip, active && styles.customerChipActive]}
                >
                  <Text style={[styles.chipName, active && styles.chipNameActive]}>{c.name}</Text>
                  <Text style={[styles.chipCode, active && styles.chipCodeActive]}>{c.customerCode}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {selectedCustomer && (
            <View style={styles.selectedCustomerBox}>
              <View>
                <Text style={styles.selectedName}>{selectedCustomer.name}</Text>
                <Text style={styles.selectedPhone}>Ph: {selectedCustomer.phone}</Text>
              </View>
              <View style={styles.verifiedTag}>
                <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
                <Text style={styles.verifiedText}>KYC Verified</Text>
              </View>
            </View>
          )}

          {/* Loan Terms */}
          <View style={styles.sectionHeaderBox}>
            <Ionicons name="cash-outline" size={18} color={Colors.primary} />
            <Text style={styles.sectionHeading}>LOAN TERMS & ADVANCE</Text>
          </View>

          <GoldifiInput
            label="Principal Advance Amount (₹) *"
            placeholder="e.g. 50,000"
            value={principalStr}
            onChangeText={(t) => {
              setPrincipalStr(t);
              if (errors.principal) setErrors({ ...errors, principal: '' });
            }}
            keyboardType="numeric"
            prefix="₹"
            error={errors.principal}
            helperText={principal > 0 ? `Formatted: ${formatINR(principal)}` : undefined}
          />

          <View style={styles.twoCol}>
            <GoldifiInput
              label="Monthly Interest %"
              placeholder="1.5"
              value={interestRate}
              onChangeText={setInterestRate}
              keyboardType="numeric"
              containerStyle={{ flex: 1 }}
            />
            <GoldifiInput
              label="Tenure (Months)"
              placeholder="12"
              value={tenureMonths}
              onChangeText={setTenureMonths}
              keyboardType="numeric"
              containerStyle={{ flex: 1 }}
            />
          </View>

          {/* Collateral Appraisal */}
          <View style={styles.sectionHeaderBox}>
            <Ionicons name="sparkles" size={18} color={Colors.primary} />
            <Text style={styles.sectionHeading}>PLEDGED COLLATERAL APPRAISAL</Text>
          </View>

          <Text style={styles.pickerLabel}>Item Category *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {CATEGORIES.map((cat) => {
                const active = category === cat.key;
                return (
                  <Pressable
                    key={cat.key}
                    onPress={() => setCategory(cat.key)}
                    style={[styles.categoryChip, active && styles.categoryChipActive]}
                  >
                    <Text style={[styles.categoryText, active && styles.categoryTextActive]}>
                      {cat.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          <GoldifiInput
            label="Pledged Item Description *"
            placeholder="e.g. 22K Gold Antique Choker with Kundan Work"
            value={description}
            onChangeText={(t) => {
              setDescription(t);
              if (errors.description) setErrors({ ...errors, description: '' });
            }}
            error={errors.description}
          />

          <GoldifiInput
            label="Purity Assessment"
            placeholder="e.g. 22K (916 Hallmarked)"
            value={purity}
            onChangeText={setPurity}
          />

          <View style={styles.twoCol}>
            <GoldifiInput
              label="Gross Wt (Grams) *"
              placeholder="e.g. 24.5"
              value={grossWeight}
              onChangeText={(t) => {
                setGrossWeight(t);
                if (errors.grossWeight) setErrors({ ...errors, grossWeight: '' });
              }}
              keyboardType="numeric"
              containerStyle={{ flex: 1 }}
              error={errors.grossWeight}
            />
            <GoldifiInput
              label="Net Gold Wt (Grams)"
              placeholder="e.g. 23.8"
              value={netWeight}
              onChangeText={setNetWeight}
              keyboardType="numeric"
              containerStyle={{ flex: 1 }}
            />
          </View>

          <GoldifiInput
            label="Assessed Market Valuation (₹) *"
            placeholder="e.g. 85,000"
            value={marketValueStr}
            onChangeText={(t) => {
              setMarketValueStr(t);
              if (errors.marketValue) setErrors({ ...errors, marketValue: '' });
            }}
            keyboardType="numeric"
            prefix="₹"
            error={errors.marketValue}
          />

          {/* Live LTV Meter */}
          {marketVal > 0 && (
            <View style={styles.ltvPreviewCard}>
              <View style={styles.ltvHeader}>
                <Text style={styles.ltvPreviewLabel}>LTV Ratio Exposure:</Text>
                <Text
                  style={[
                    styles.ltvPercentText,
                    { color: ltvRatio > 75 ? Colors.error : Colors.success },
                  ]}
                >
                  {ltvRatio}% LTV
                </Text>
              </View>
              <View style={styles.ltvBarBg}>
                <View
                  style={[
                    styles.ltvBarFill,
                    {
                      width: `${Math.min(ltvRatio, 100)}%`,
                      backgroundColor: ltvRatio > 75 ? Colors.error : Colors.primary,
                    },
                  ]}
                />
              </View>
              <Text style={styles.ltvNotice}>
                {ltvRatio > 75
                  ? 'High risk: Exceeds standard 75% RBI regulatory loan-to-value ceiling.'
                  : 'Regulatory compliant: Safe collateral coverage margin.'}
              </Text>
            </View>
          )}

          <GoldifiInput
            label="Assigned Vault Locker / Shelf"
            placeholder="e.g. Vault Locker A-05"
            value={storageLocker}
            onChangeText={setStorageLocker}
            leadingIcon="cube-outline"
            containerStyle={{ marginBottom: 24 }}
          />

          <GoldifiButton
            label="Approve Collateral & Disburse Loan"
            onPress={handleDisburse}
            loading={loading}
            size="lg"
            iconName="receipt-outline"
          />
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
    paddingBottom: 40,
  },
  sectionHeaderBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  customerScroll: {
    marginBottom: 12,
  },
  customerChip: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  customerChipActive: {
    backgroundColor: Colors.charcoal,
    borderColor: Colors.charcoal,
  },
  chipName: {
    ...Typography.captionSemibold,
    color: Colors.textPrimary,
  },
  chipNameActive: {
    color: Colors.white,
  },
  chipCode: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  chipCodeActive: {
    color: Colors.primaryLight,
  },
  selectedCustomerBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 12,
    marginBottom: 16,
  },
  selectedName: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  selectedPhone: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.success,
  },
  twoCol: {
    flexDirection: 'row',
    gap: 12,
  },
  pickerLabel: {
    ...Typography.secondaryMedium,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: 6,
  },
  categoryChip: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  categoryTextActive: {
    color: Colors.white,
    fontWeight: '700',
  },
  ltvPreviewCard: {
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: 12,
    marginBottom: 16,
  },
  ltvHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  ltvPreviewLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  ltvPercentText: {
    fontSize: 13,
    fontWeight: '800',
  },
  ltvBarBg: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  ltvBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  ltvNotice: {
    fontSize: 10,
    color: Colors.textMuted,
  },
});

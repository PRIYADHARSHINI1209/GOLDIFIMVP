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
import { mockPaymentService } from '@/services/payments/paymentService';
import { Loan, PaymentType, PaymentMethod } from '@/types';
import { GoldifiHeader } from '@/components/ui/GoldifiHeader';
import { GoldifiInput } from '@/components/ui/GoldifiInput';
import { GoldifiButton } from '@/components/ui/GoldifiButton';
import { GoldifiAccessDenied } from '@/components/feedback/GoldifiAccessDenied';

const PAYMENT_TYPES: { key: PaymentType; label: string }[] = [
  { key: 'INTEREST', label: 'Interest Only' },
  { key: 'PRINCIPAL', label: 'Principal Part' },
  { key: 'CLOSURE', label: 'Full Settlement / Closure' },
  { key: 'RENEWAL', label: 'Loan Renewal' },
];

const PAYMENT_METHODS: { key: PaymentMethod; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'CASH', label: 'Cash', icon: 'cash-outline' },
  { key: 'UPI', label: 'UPI / GPay / PhonePe', icon: 'phone-portrait-outline' },
  { key: 'BANK_TRANSFER', label: 'NEFT / IMPS', icon: 'business-outline' },
  { key: 'CHEQUE', label: 'Cheque', icon: 'document-text-outline' },
];

export default function RecordPaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    loanId?: string;
    loanNumber?: string;
    customerId?: string;
    customerName?: string;
  }>();

  const { user } = useAuth();
  const { canCreatePayment } = usePermissions();

  const [activeLoans, setActiveLoans] = useState<Loan[]>([]);
  const [selectedLoanId, setSelectedLoanId] = useState(params.loanId || '');
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  const [paymentType, setPaymentType] = useState<PaymentType>('INTEREST');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [amountStr, setAmountStr] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    mockLoanService.getLoans('ALL').then((list) => {
      const open = list.filter((l) => l.status !== 'CLOSED');
      setActiveLoans(open);

      if (params.loanId) {
        const found = open.find((l) => l.id === params.loanId);
        if (found) {
          setSelectedLoan(found);
          setAmountStr(found.accumulatedInterest.toString());
        }
      } else if (open.length > 0) {
        setSelectedLoanId(open[0].id);
        setSelectedLoan(open[0]);
        setAmountStr(open[0].accumulatedInterest.toString());
      }
    });
  }, [params.loanId]);

  const handleSelectLoan = (loan: Loan) => {
    setSelectedLoanId(loan.id);
    setSelectedLoan(loan);
    if (paymentType === 'INTEREST') {
      setAmountStr(loan.accumulatedInterest.toString());
    } else if (paymentType === 'CLOSURE') {
      setAmountStr(loan.totalAmountDue.toString());
    }
  };

  const handleTypeChange = (type: PaymentType) => {
    setPaymentType(type);
    if (!selectedLoan) return;
    if (type === 'INTEREST') {
      setAmountStr(selectedLoan.accumulatedInterest.toString());
    } else if (type === 'CLOSURE') {
      setAmountStr(selectedLoan.totalAmountDue.toString());
    }
  };

  if (!canCreatePayment) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <GoldifiAccessDenied
          requiredPermission="payments.create"
          customMessage="You do not have cashier authorization to collect payments or issue receipts."
        />
      </SafeAreaView>
    );
  }

  const amount = parseINR(amountStr);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!selectedLoan) errs.loan = 'Please select a loan';
    if (!amount || amount <= 0) errs.amount = 'Please enter a valid payment amount';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRecord = async () => {
    if (!validate() || !selectedLoan) return;
    setLoading(true);

    try {
      const receipt = await mockPaymentService.recordPayment({
        loanId: selectedLoan.id,
        loanNumber: selectedLoan.loanNumber,
        customerId: selectedLoan.customerId,
        customerName: selectedLoan.customerName,
        amount,
        paymentType,
        paymentMethod,
        receivedByUserId: user.id,
        receivedByUserName: user.name,
        branchName: user.branchName,
        notes: notes.trim(),
      });

      router.replace(`/(app)/payments/${receipt.id}` as any);
    } catch {
      alert('Failed to record payment transaction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <GoldifiHeader title="Record Collection" showBack />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {/* Select Loan */}
          <View style={styles.sectionHeaderBox}>
            <Ionicons name="receipt-outline" size={18} color={Colors.primary} />
            <Text style={styles.sectionHeading}>SELECT LOAN ACCOUNT *</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {activeLoans.map((l) => {
                const active = l.id === selectedLoanId;
                return (
                  <Pressable
                    key={l.id}
                    onPress={() => handleSelectLoan(l)}
                    style={[styles.loanChip, active && styles.loanChipActive]}
                  >
                    <Text style={[styles.loanChipNum, active && styles.loanChipNumActive]}>
                      {l.loanNumber}
                    </Text>
                    <Text style={[styles.loanChipCust, active && styles.loanChipCustActive]}>
                      {l.customerName}
                    </Text>
                    <Text style={[styles.loanChipDue, active && { color: Colors.white }]}>
                      Due: {formatINR(l.totalAmountDue)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          {/* Payment Type Selection */}
          <Text style={styles.pickerLabel}>Payment Classification *</Text>
          <View style={styles.typesRow}>
            {PAYMENT_TYPES.map((t) => {
              const active = paymentType === t.key;
              return (
                <Pressable
                  key={t.key}
                  onPress={() => handleTypeChange(t.key)}
                  style={[styles.typeChip, active && styles.typeChipActive]}
                >
                  <Text style={[styles.typeText, active && styles.typeTextActive]}>
                    {t.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Amount Input */}
          <GoldifiInput
            label="Collection Amount (₹) *"
            placeholder="e.g. 2,500"
            value={amountStr}
            onChangeText={(t) => {
              setAmountStr(t);
              if (errors.amount) setErrors({ ...errors, amount: '' });
            }}
            keyboardType="numeric"
            prefix="₹"
            error={errors.amount}
            helperText={amount > 0 ? `Net Total: ${formatINR(amount)}` : undefined}
          />

          {/* Payment Method Selector */}
          <Text style={styles.pickerLabel}>Payment Mode *</Text>
          <View style={styles.methodsGrid}>
            {PAYMENT_METHODS.map((m) => {
              const active = paymentMethod === m.key;
              return (
                <Pressable
                  key={m.key}
                  onPress={() => setPaymentMethod(m.key)}
                  style={[styles.methodCard, active && styles.methodCardActive]}
                >
                  <Ionicons
                    name={m.icon}
                    size={20}
                    color={active ? Colors.primary : Colors.textSecondary}
                  />
                  <Text style={[styles.methodLabel, active && styles.methodLabelActive]}>
                    {m.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Transaction Note */}
          <GoldifiInput
            label="Reference ID / Counter Remarks"
            placeholder="e.g. UPI Ref 4019283019 or Cash Bill No"
            value={notes}
            onChangeText={setNotes}
            leadingIcon="document-text-outline"
            containerStyle={{ marginBottom: 24 }}
          />

          <GoldifiButton
            label="Record & Issue Official Receipt"
            onPress={handleRecord}
            loading={loading}
            size="lg"
            iconName="checkmark-circle"
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
  loanChip: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: 12,
    minWidth: 140,
  },
  loanChipActive: {
    backgroundColor: Colors.charcoal,
    borderColor: Colors.charcoal,
  },
  loanChipNum: {
    ...Typography.captionSemibold,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  loanChipNumActive: {
    color: Colors.white,
  },
  loanChipCust: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  loanChipCustActive: {
    color: Colors.primaryLight,
  },
  loanChipDue: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 4,
  },
  pickerLabel: {
    ...Typography.secondaryMedium,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: 8,
  },
  typesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typeChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  typeTextActive: {
    color: Colors.white,
    fontWeight: '700',
  },
  methodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    flexBasis: '48%',
    flexGrow: 1,
  },
  methodCardActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  methodLabel: {
    ...Typography.captionMedium,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  methodLabelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
});

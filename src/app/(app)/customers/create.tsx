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
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { Radius } from '@/theme/radius';
import { usePermissions } from '@/hooks/usePermissions';
import { mockCustomerService } from '@/services/customers/customerService';
import { GoldifiHeader } from '@/components/ui/GoldifiHeader';
import { GoldifiInput } from '@/components/ui/GoldifiInput';
import { GoldifiButton } from '@/components/ui/GoldifiButton';
import { GoldifiAccessDenied } from '@/components/feedback/GoldifiAccessDenied';

const ID_TYPES: ('Aadhaar' | 'PAN' | 'Voter ID' | 'Driving License')[] = [
  'Aadhaar',
  'PAN',
  'Voter ID',
  'Driving License',
];

export default function CreateCustomerScreen() {
  const router = useRouter();
  const { canCreateCustomer } = usePermissions();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Chennai');
  const [idType, setIdType] = useState<'Aadhaar' | 'PAN' | 'Voter ID' | 'Driving License'>('Aadhaar');
  const [idNumber, setIdNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!canCreateCustomer) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <GoldifiAccessDenied
          requiredPermission="customers.create"
          customMessage="You do not have permission to register new customers."
        />
      </SafeAreaView>
    );
  }

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!phone.trim()) errs.phone = 'Phone number is required';
    else if (phone.replace(/\D/g, '').length < 10) errs.phone = 'Enter a valid 10-digit mobile number';
    if (!idNumber.trim()) errs.idNumber = `${idType} number is required for KYC compliance`;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      const created = await mockCustomerService.createCustomer({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        city: city.trim(),
        idProofType: idType,
        idProofNumber: idNumber.trim(),
        status: 'VERIFIED',
        notes: notes.trim(),
      });

      router.replace(`/(app)/customers/${created.id}` as any);
    } catch {
      alert('Error creating customer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <GoldifiHeader title="Add New Customer" showBack />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.sectionHeaderBox}>
            <Ionicons name="person-outline" size={18} color={Colors.primary} />
            <Text style={styles.sectionHeading}>BORROWER INFORMATION</Text>
          </View>

          <GoldifiInput
            label="Full Name *"
            placeholder="e.g. R. Subramanian"
            value={name}
            onChangeText={(t) => {
              setName(t);
              if (errors.name) setErrors({ ...errors, name: '' });
            }}
            leadingIcon="person-outline"
            error={errors.name}
          />

          <GoldifiInput
            label="Mobile Number *"
            placeholder="e.g. 98401 22334"
            value={phone}
            onChangeText={(t) => {
              setPhone(t);
              if (errors.phone) setErrors({ ...errors, phone: '' });
            }}
            keyboardType="phone-pad"
            leadingIcon="call-outline"
            prefix="+91"
            error={errors.phone}
          />

          <GoldifiInput
            label="Email Address"
            placeholder="e.g. subramanian@gmail.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leadingIcon="mail-outline"
          />

          <View style={styles.sectionHeaderBox}>
            <Ionicons name="shield-checkmark-outline" size={18} color={Colors.primary} />
            <Text style={styles.sectionHeading}>IDENTIFICATION & KYC</Text>
          </View>

          <Text style={styles.pickerLabel}>Select ID Proof Type *</Text>
          <View style={styles.idTypeRow}>
            {ID_TYPES.map((type) => {
              const isSelected = idType === type;
              return (
                <Pressable
                  key={type}
                  onPress={() => setIdType(type)}
                  style={[styles.idTypeChip, isSelected && styles.idTypeChipActive]}
                >
                  <Text style={[styles.idTypeText, isSelected && styles.idTypeTextActive]}>
                    {type}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <GoldifiInput
            label={`${idType} Number *`}
            placeholder={idType === 'Aadhaar' ? 'e.g. 7842 9012 3456' : 'e.g. ABCDE1234F'}
            value={idNumber}
            onChangeText={(t) => {
              setIdNumber(t);
              if (errors.idNumber) setErrors({ ...errors, idNumber: '' });
            }}
            autoCapitalize="characters"
            leadingIcon="card-outline"
            error={errors.idNumber}
          />

          <View style={styles.sectionHeaderBox}>
            <Ionicons name="location-outline" size={18} color={Colors.primary} />
            <Text style={styles.sectionHeading}>RESIDENCE ADDRESS</Text>
          </View>

          <GoldifiInput
            label="Street Address"
            placeholder="e.g. 18/4, M.G. Road"
            value={address}
            onChangeText={setAddress}
            leadingIcon="business-outline"
          />

          <GoldifiInput
            label="City / Town"
            placeholder="e.g. Chennai"
            value={city}
            onChangeText={setCity}
            leadingIcon="map-outline"
          />

          <GoldifiInput
            label="Branch Internal Notes (Optional)"
            placeholder="e.g. Reference through Mr. Natarajan"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            containerStyle={{ marginBottom: 24 }}
          />

          <GoldifiButton
            label="Register Customer & Complete KYC"
            onPress={handleSave}
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
  pickerLabel: {
    ...Typography.secondaryMedium,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: 8,
  },
  idTypeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  idTypeChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  idTypeChipActive: {
    backgroundColor: Colors.charcoal,
    borderColor: Colors.charcoal,
  },
  idTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  idTypeTextActive: {
    color: Colors.white,
    fontWeight: '700',
  },
});

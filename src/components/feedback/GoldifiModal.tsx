import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Radius } from '@/theme/radius';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { Shadows } from '@/theme/shadows';

interface GoldifiModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const GoldifiModal: React.FC<GoldifiModalProps> = ({
  visible,
  onClose,
  title,
  subtitle,
  children,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.modalCard}
            >
              <View style={styles.header}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>{title}</Text>
                  {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                </View>
                <Pressable
                  onPress={onClose}
                  style={styles.closeBtn}
                  accessibilityRole="button"
                  accessibilityLabel="Close modal"
                >
                  <Ionicons name="close" size={22} color={Colors.textSecondary} />
                </Pressable>
              </View>

              <View style={styles.content}>{children}</View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    padding: Spacing.screenHorizontal,
  },
  modalCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    maxHeight: '85%',
    ...Shadows.modal,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    ...Typography.sectionTitle,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    marginLeft: 10,
  },
  content: {
    padding: 20,
  },
});

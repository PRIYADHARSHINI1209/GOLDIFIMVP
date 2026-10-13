import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { Radius } from '@/theme/radius';
import { formatDateTime } from '@/utils/date';
import { usePermissions } from '@/hooks/usePermissions';
import { mockAuditService } from '@/services/audit/auditService';
import { AuditLog } from '@/types';
import { GoldifiHeader } from '@/components/ui/GoldifiHeader';
import { GoldifiLoadingState } from '@/components/feedback/GoldifiLoadingState';
import { GoldifiAccessDenied } from '@/components/feedback/GoldifiAccessDenied';
import { Shadows } from '@/theme/shadows';

export default function AuditLogsScreen() {
  const { canViewAudit } = usePermissions();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadLogs = async () => {
    try {
      const data = await mockAuditService.getAuditLogs();
      setLogs(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (canViewAudit) {
      loadLogs();
    }
  }, [canViewAudit]);

  const onRefresh = () => {
    setRefreshing(true);
    loadLogs();
  };

  if (!canViewAudit) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <GoldifiAccessDenied
          requiredPermission="audit.view"
          customMessage="You do not have authorization to view compliance audit trails and security event logs."
        />
      </SafeAreaView>
    );
  }

  const getResultBadge = (result: AuditLog['result']) => {
    switch (result) {
      case 'SUCCESS':
        return { bg: Colors.successLight, text: Colors.success, icon: 'checkmark-circle' as const };
      case 'WARNING':
        return { bg: Colors.warningLight, text: Colors.warning, icon: 'alert-circle' as const };
      case 'FAILED':
        return { bg: Colors.errorLight, text: Colors.error, icon: 'close-circle' as const };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <GoldifiHeader
        title="Audit Trail"
        subtitle="System compliance & security log"
        showBack
      />

      {loading ? (
        <GoldifiLoadingState message="Retrieving compliance event logs..." />
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
          }
          renderItem={({ item }) => {
            const badge = getResultBadge(item.result);
            return (
              <View style={styles.card}>
                <View style={styles.topRow}>
                  <View style={styles.objectTag}>
                    <Text style={styles.objectText}>{item.objectType}</Text>
                  </View>
                  <View style={[styles.resultBadge, { backgroundColor: badge.bg }]}>
                    <Ionicons name={badge.icon} size={12} color={badge.text} />
                    <Text style={[styles.resultText, { color: badge.text }]}>{item.result}</Text>
                  </View>
                </View>

                <Text style={styles.actionTitle}>{item.action}</Text>
                <Text style={styles.detailsText}>{item.details}</Text>

                <View style={styles.metaFooter}>
                  <View style={styles.actorRow}>
                    <Ionicons name="person-outline" size={12} color={Colors.textMuted} />
                    <Text style={styles.actorText}>
                      {item.userName} ({item.role.replace('_', ' ')})
                    </Text>
                  </View>
                  <Text style={styles.timeText}>{formatDateTime(item.timestamp)}</Text>
                </View>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  list: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: 14,
    marginBottom: 10,
    ...Shadows.subtle,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  objectTag: {
    backgroundColor: Colors.surfaceSecondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  objectText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  resultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  resultText: {
    fontSize: 9,
    fontWeight: '800',
  },
  actionTitle: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  detailsText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
    marginBottom: 10,
  },
  metaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: 8,
  },
  actorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  actorText: {
    fontSize: 11,
    color: Colors.charcoal,
    fontWeight: '600',
  },
  timeText: {
    fontSize: 10,
    color: Colors.textMuted,
  },
});

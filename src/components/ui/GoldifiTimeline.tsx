import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import { formatDateTime } from '@/utils/date';
import { LoanTimelineEvent } from '@/types';

interface GoldifiTimelineProps {
  events: LoanTimelineEvent[];
}

export const GoldifiTimeline: React.FC<GoldifiTimelineProps> = ({ events }) => {
  const getEventIcon = (type: LoanTimelineEvent['type']) => {
    switch (type) {
      case 'CREATED':
        return { name: 'add-circle-outline' as const, color: Colors.primary };
      case 'PAYMENT':
        return { name: 'cash-outline' as const, color: Colors.success };
      case 'RENEWED':
        return { name: 'sync-outline' as const, color: Colors.info };
      case 'OVERDUE_ALERT':
        return { name: 'alert-circle-outline' as const, color: Colors.error };
      case 'CLOSED':
        return { name: 'checkmark-done-circle-outline' as const, color: Colors.charcoal };
    }
  };

  return (
    <View style={styles.container}>
      {events.map((event, index) => {
        const isLast = index === events.length - 1;
        const iconConfig = getEventIcon(event.type);

        return (
          <View key={event.id} style={styles.eventRow}>
            <View style={styles.timelineColumn}>
              <View style={[styles.circle, { borderColor: iconConfig.color }]}>
                <Ionicons name={iconConfig.name} size={14} color={iconConfig.color} />
              </View>
              {!isLast && <View style={styles.verticalLine} />}
            </View>

            <View style={[styles.eventContent, !isLast && { paddingBottom: 20 }]}>
              <View style={styles.headerRow}>
                <Text style={styles.title}>{event.title}</Text>
                <Text style={styles.date}>{formatDateTime(event.date)}</Text>
              </View>
              <Text style={styles.description}>{event.description}</Text>
              <Text style={styles.actor}>By {event.actor}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  eventRow: {
    flexDirection: 'row',
  },
  timelineColumn: {
    alignItems: 'center',
    width: 28,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticalLine: {
    flex: 1,
    width: 2,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  eventContent: {
    flex: 1,
    paddingLeft: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...Typography.secondaryMedium,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  date: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  description: {
    ...Typography.secondary,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  actor: {
    ...Typography.captionMedium,
    color: Colors.textMuted,
    marginTop: 4,
    fontStyle: 'italic',
  },
});

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, Text, View } from 'react-native';

import { getStatusTone, StatusTone } from '@/constants/status';
import { typography } from '@/constants/theme';

export type ReportSubmissionStatus = 'Submitted' | 'Not Submitted' | 'Approved';

type InlineStatusBadgeProps = {
  compact?: boolean;
  label: string;
  tone?: StatusTone;
};

export function getReportSubmissionStatus(condition: string): ReportSubmissionStatus | null {
  if (condition === 'Damaged') {
    return 'Submitted';
  }

  if (condition === 'Missing') {
    return 'Not Submitted';
  }

  if (condition === 'Minor Damage') {
    return 'Approved';
  }

  return null;
}

export function getConditionStatusTone(condition: string): StatusTone {
  return getStatusTone(condition);
}

export function getReportStatusTone(status: ReportSubmissionStatus): StatusTone {
  return getStatusTone(status);
}

export function InlineStatusBadge({ compact = false, label, tone = getConditionStatusTone(label) }: InlineStatusBadgeProps) {
  return (
    <View style={[styles.badge, compact && styles.badgeCompact]}>
      <MaterialIcons name={tone.icon} size={13} color={tone.color} />
      <Text style={[styles.text, compact && styles.textCompact, { color: tone.color }]}>{label}</Text>
    </View>
  );
}

export function ReportStatusBadge({ compact = false, status }: { compact?: boolean; status: ReportSubmissionStatus }) {
  return <InlineStatusBadge compact={compact} label={status} tone={getReportStatusTone(status)} />;
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 0,
    paddingVertical: 2,
  },
  badgeCompact: {
    gap: 4,
    paddingVertical: 1,
  },
  text: {
    ...typography.labelSm,
    fontWeight: '800',
  },
  textCompact: {
    fontSize: 10,
    lineHeight: 13,
  },
});

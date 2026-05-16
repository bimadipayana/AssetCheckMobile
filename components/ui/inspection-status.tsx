import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, Text, View } from 'react-native';

import { palette, typography } from '@/constants/theme';

export type ReportSubmissionStatus = 'Submitted' | 'Not Submitted' | 'Approved';

type StatusTone = {
  color: string;
  icon: keyof typeof MaterialIcons.glyphMap;
};

type InlineStatusBadgeProps = {
  compact?: boolean;
  label: string;
  tone?: StatusTone;
};

export function getReportSubmissionStatus(condition: string): ReportSubmissionStatus | null {
  if (condition === 'Major Damage') {
    return 'Submitted';
  }

  if (condition === 'Missing') {
    return 'Not Submitted';
  }

  if (condition === 'Minor Damage' || condition === 'Minor Damaged') {
    return 'Approved';
  }

  return null;
}

export function getConditionStatusTone(condition: string): StatusTone {
  if (condition === 'Good' || condition === 'Checked' || condition === 'Approved') {
    return {
      color: condition === 'Approved' ? palette.secondary : palette.primary,
      icon: 'check-circle',
    };
  }

  if (condition === 'Major Damage' || condition === 'Missing' || condition === 'Failed') {
    return {
      color: palette.danger,
      icon: condition === 'Missing' ? 'error-outline' : 'report-problem',
    };
  }

  if (condition === 'Minor Damage' || condition === 'Minor Damaged' || condition === 'Damaged') {
    return {
      color: palette.warning,
      icon: 'warning-amber',
    };
  }

  return {
    color: palette.info,
    icon: 'pending',
  };
}

export function getReportStatusTone(status: ReportSubmissionStatus): StatusTone {
  if (status === 'Approved') {
    return {
      color: palette.secondary,
      icon: 'check-circle',
    };
  }

  if (status === 'Submitted') {
    return {
      color: '#2563EB',
      icon: 'assignment-turned-in',
    };
  }

  return {
    color: palette.warning,
    icon: 'assignment-late',
  };
}

export function InlineStatusBadge({ compact = false, label, tone = getConditionStatusTone(label) }: InlineStatusBadgeProps) {
  return (
    <View style={[styles.badge, compact && styles.badgeCompact]}>
      <MaterialIcons name={tone.icon} size={compact ? 12 : 13} color={tone.color} />
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

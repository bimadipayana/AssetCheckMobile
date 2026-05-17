import { StyleSheet, Text, View } from 'react-native';

import { getStatusTone, normalizeStatusLabel } from '@/constants/status';
import { AssetCondition, InspectionStatus, ReviewStatus } from '@/data/mock';
import { palette, radius, spacing, typography } from '@/constants/theme';

type StatusBadgeProps = {
  label: AssetCondition | InspectionStatus | ReviewStatus | string;
  surface?: 'transparent' | 'white';
};

export function StatusBadge({ label, surface = 'transparent' }: StatusBadgeProps) {
  const displayLabel = normalizeStatusLabel(label);
  const tone = getStatusTone(displayLabel);

  return (
    <View style={[styles.badge, surface === 'white' && styles.badgeWhite, { borderColor: tone.borderColor }]}>
      <Text style={[styles.text, { color: tone.color }]}>{displayLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'transparent',
    borderRadius: radius.full,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  badgeWhite: {
    backgroundColor: palette.surface,
  },
  text: {
    ...typography.labelSm,
    fontWeight: '700',
  },
});

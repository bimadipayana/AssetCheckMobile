import { StyleSheet, Text, View } from 'react-native';

import { AssetCondition, InspectionStatus, ReviewStatus } from '@/data/mock';
import { palette, radius, spacing, typography } from '@/constants/theme';

type StatusBadgeProps = {
  label: AssetCondition | InspectionStatus | ReviewStatus | string;
  surface?: 'transparent' | 'white';
};

const toneByLabel: Record<string, { borderColor: string; color: string }> = {
  Good: { borderColor: '#9ADBC4', color: palette.primary },
  Checked: { borderColor: '#9ADBC4', color: palette.primary },
  Completed: { borderColor: '#9ADBC4', color: palette.primary },
  Approved: { borderColor: '#8DD7C3', color: palette.secondary },
  Pending: { borderColor: '#9ADBC4', color: palette.info },
  Draft: { borderColor: '#9ADBC4', color: palette.info },
  Submitted: { borderColor: '#BFDBFE', color: '#2563EB' },
  Revision: { borderColor: '#FFD58D', color: palette.warning },
  'Revision Requested': { borderColor: '#FFD58D', color: palette.warning },
  Damaged: { borderColor: '#FFD58D', color: palette.warning },
  'Minor Damage': { borderColor: '#FFD58D', color: palette.warning },
  'Major Damage': { borderColor: '#F7A7A1', color: palette.danger },
  Missing: { borderColor: '#F7A7A1', color: palette.danger },
  Failed: { borderColor: '#F7A7A1', color: palette.danger },
};

export function StatusBadge({ label, surface = 'transparent' }: StatusBadgeProps) {
  const tone = toneByLabel[label] ?? { borderColor: palette.borderStrong, color: palette.textMuted };

  return (
    <View style={[styles.badge, surface === 'white' && styles.badgeWhite, { borderColor: tone.borderColor }]}>
      <Text style={[styles.text, { color: tone.color }]}>{label}</Text>
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

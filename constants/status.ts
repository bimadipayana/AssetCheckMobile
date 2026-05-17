import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { palette } from '@/constants/theme';

export type StatusTone = {
  backgroundColor?: string;
  borderColor: string;
  color: string;
  icon: keyof typeof MaterialIcons.glyphMap;
};

export const statusTones: Record<string, StatusTone> = {
  Approved: { borderColor: '#8DD7C3', color: palette.secondary, icon: 'check-circle' },
  Checked: { borderColor: '#9ADBC4', color: palette.primary, icon: 'check-circle' },
  Completed: { borderColor: '#9ADBC4', color: palette.primary, icon: 'check-circle' },
  Damaged: { borderColor: '#F7A7A1', color: palette.danger, icon: 'report-problem' },
  Draft: { borderColor: '#9ADBC4', color: palette.info, icon: 'pending' },
  Failed: { borderColor: '#F7A7A1', color: palette.danger, icon: 'report-problem' },
  Good: { borderColor: '#9ADBC4', color: palette.primary, icon: 'thumb-up-off-alt' },
  'Minor Damage': { borderColor: '#FFD58D', color: palette.warning, icon: 'build' },
  Missing: { borderColor: '#F7A7A1', color: palette.danger, icon: 'error-outline' },
  'Not Submitted': { borderColor: '#FFD58D', color: palette.warning, icon: 'assignment-late' },
  Pending: { borderColor: '#FFD58D', color: palette.warning, icon: 'pending' },
  Revision: { borderColor: '#FFD58D', color: palette.warning, icon: 'warning-amber' },
  'Revision Requested': { borderColor: '#FFD58D', color: palette.warning, icon: 'warning-amber' },
  Submitted: { borderColor: '#BFDBFE', color: '#2563EB', icon: 'assignment-turned-in' },
};

export function normalizeStatusLabel(label: string) {
  if (/^minor damage$/i.test(label) || /^minor damaged$/i.test(label)) {
    return 'Minor Damage';
  }

  if (/^damaged$/i.test(label) || /^major damage$/i.test(label) || /^major damaged$/i.test(label)) {
    return 'Damaged';
  }

  return label;
}

export function getStatusTone(label: string): StatusTone {
  return statusTones[normalizeStatusLabel(label)] ?? {
    borderColor: palette.borderStrong,
    color: palette.textMuted,
    icon: 'info-outline',
  };
}

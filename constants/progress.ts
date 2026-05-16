import { palette } from '@/constants/theme';

export function getProgressColor(value: number) {
  if (value >= 100) {
    return palette.secondary;
  }

  if (value < 30) {
    return palette.danger;
  }

  if (value < 50) {
    return palette.warning;
  }

  return palette.primary;
}

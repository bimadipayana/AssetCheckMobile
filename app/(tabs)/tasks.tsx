import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/app-screen';
import {
  InlineStatusBadge,
  getReportSubmissionStatus,
} from '@/components/ui/inspection-status';
import { getProgressColor } from '@/constants/progress';
import { assets, branchSummary } from '@/data/mock';
import { palette, spacing, typography } from '@/constants/theme';

const activeAssets = assets.filter((asset) => asset.status !== 'Checked');
const taskProgressColor = getProgressColor(branchSummary.progress);
const listCardMinHeight = 162;

export default function TasksScreen() {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = useMemo(() => {
    const statusFilters = Array.from(new Set(activeAssets.map((asset) => asset.status))).map((status) => ({
      label: status,
      count: activeAssets.filter((asset) => asset.status === status).length,
    }));

    return [{ label: 'All', count: activeAssets.length }, ...statusFilters];
  }, []);

  const visibleAssets =
    activeFilter === 'All'
      ? activeAssets
      : activeAssets.filter((asset) => asset.status === activeFilter);

  return (
    <AppScreen scroll={false}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}>
        <View style={styles.stickyHeader}>
          <View style={styles.progressCard}>
            <View style={styles.progressCopy}>
              <Text style={styles.progressLabel}>Inspection Progress</Text>
              <Text style={styles.progressCount}>
                {branchSummary.checked} / {branchSummary.totalAssets} Checked
              </Text>
            </View>
            <View style={styles.circularProgress}>
              <View
                style={[
                  styles.progressArc,
                  {
                    borderLeftColor: taskProgressColor,
                    borderRightColor: taskProgressColor,
                    borderTopColor: taskProgressColor,
                  },
                ]}
              />
              <Text style={[styles.progressPercent, { color: taskProgressColor }]}>
                {branchSummary.progress}%
              </Text>
            </View>
          </View>

          <View style={styles.filterRow}>
            {filters.map((filter) => {
              const isActive = activeFilter === filter.label;

              return (
                <Pressable
                  accessibilityRole="button"
                  key={filter.label}
                  onPress={() => setActiveFilter(filter.label)}
                  style={({ pressed }) => [
                    styles.filterChip,
                    isActive && styles.filterChipActive,
                    pressed && styles.pressed,
                  ]}>
                  <Text style={[styles.filterText, isActive && styles.filterTextActive]}>{filter.label}</Text>
                  <View style={[styles.filterCount, isActive && styles.filterCountActive]}>
                    <Text style={[styles.filterCountText, isActive && styles.filterCountTextActive]}>
                      {filter.count}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.list}>
          {visibleAssets.map((asset) => {
            const action = getAssetAction(asset.status);
            const categoryIcon = getCategoryIcon(asset.category);
            const reportStatus = getReportSubmissionStatus(asset.condition);
            const primaryStatus = asset.condition === 'Unknown' ? asset.status : asset.condition;
            const showActionButton = action.variant === 'scan' || reportStatus === 'Not Submitted';

            return (
              <View key={asset.id} style={[styles.taskCard, !showActionButton && styles.taskCardCompact]}>
                <View style={styles.cardHeader}>
                  <View style={styles.assetIconBox}>
                    <MaterialIcons name={categoryIcon} size={22} color={palette.primary} />
                  </View>
                  <View style={styles.cardContent}>
                    <View style={styles.cardTitleRow}>
                      <Text style={styles.assetName} numberOfLines={1}>
                        {asset.name}
                      </Text>
                      <View style={styles.statusStack}>
                        <InlineStatusBadge compact label={primaryStatus} />
                      </View>
                    </View>
                    <Text style={styles.assetCategory}>{asset.category}</Text>
                    <View style={styles.metaGrid}>
                      <View style={styles.metaItem}>
                        <MaterialIcons name="tag" size={15} color={palette.textSubtle} />
                        <Text style={styles.assetCode}>{asset.code}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <MaterialIcons name="location-on" size={15} color={palette.textSubtle} />
                        <Text numberOfLines={1} style={styles.assetLocation}>
                          {asset.defaultLocation}
                        </Text>
                      </View>
                      <View style={styles.metaItem}>
                        <MaterialIcons name="event-available" size={15} color={palette.textSubtle} />
                        <Text style={styles.assetLocation}>Last: {asset.lastInspection}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {showActionButton ? (
                  <>
                    <View style={styles.cardDivider} />
                  <Pressable
                    accessibilityRole="button"
                    onPress={() =>
                      router.push(
                        action.href === '/inspection-form'
                          ? { pathname: '/inspection-form', params: { assetId: asset.id } }
                          : action.href,
                      )
                    }
                    style={({ pressed }) => [
                      styles.cardAction,
                      action.variant === 'report' && styles.reportAction,
                      pressed && styles.pressed,
                    ]}>
                      <MaterialIcons name={action.icon} size={16} color={palette.surface} />
                    <Text style={styles.actionText}>{action.label}</Text>
                    <MaterialIcons
                      name="chevron-right"
                      size={17}
                      color={palette.surface}
                      style={styles.actionChevron}
                    />
                  </Pressable>
                  </>
                ) : null}
              </View>
            );
          })}
        </View>
      </ScrollView>

    </AppScreen>
  );
}

function getAssetAction(status: string): {
  href: '/scan' | '/inspection-form';
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  variant: 'scan' | 'report';
} {
  if (status === 'Damaged') {
    return {
      href: '/inspection-form',
      icon: 'assignment-late',
      label: 'Submit Damage Report',
      variant: 'report',
    };
  }

  if (status === 'Missing') {
    return {
      href: '/inspection-form',
      icon: 'report-problem',
      label: 'Report Missing Asset',
      variant: 'report',
    };
  }

  return {
    href: '/scan',
    icon: 'qr-code-scanner',
    label: 'Scan Asset',
    variant: 'scan',
  };
}

function getCategoryIcon(category: string): keyof typeof MaterialIcons.glyphMap {
  if (category.includes('OTDR')) {
    return 'cable';
  }

  if (category.includes('Splicer')) {
    return 'precision-manufacturing';
  }

  if (category.includes('Power')) {
    return 'electrical-services';
  }

  if (category.includes('Grandmax')) {
    return 'local-shipping';
  }

  if (category.includes('Motor')) {
    return 'two-wheeler';
  }

  if (category.includes('Laptop')) {
    return 'laptop-mac';
  }

  if (category.includes('WFM')) {
    return 'support-agent';
  }

  return 'inventory-2';
}

const styles = StyleSheet.create({
  actionChevron: {
    position: 'absolute',
    right: spacing.xs,
  },
  actionText: {
    ...typography.labelSm,
    color: palette.surface,
    fontWeight: '900',
  },
  assetCategory: {
    ...typography.labelSm,
    color: palette.textSubtle,
    fontWeight: '800',
  },
  assetCode: {
    ...typography.labelSm,
    color: palette.text,
    fontWeight: '800',
  },
  assetIconBox: {
    alignItems: 'center',
    backgroundColor: palette.infoSoft,
    borderRadius: 8,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  assetLocation: {
    ...typography.labelSm,
    color: palette.textSubtle,
    fontWeight: '700',
  },
  assetName: {
    color: palette.text,
    flex: 1,
    flexShrink: 1,
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 20,
  },
  cardAction: {
    alignItems: 'center',
    backgroundColor: palette.primary,
    borderRadius: 6,
    flexDirection: 'row',
    gap: 6,
    height: 34,
    justifyContent: 'center',
    position: 'relative',
  },
  cardDivider: {
    backgroundColor: palette.border,
    height: 1,
    marginVertical: 6,
  },
  cardContent: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  cardHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  cardTitleRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.xs,
    minWidth: 0,
  },
  contextText: {
    ...typography.labelMd,
    color: palette.textMuted,
    fontWeight: '900',
    letterSpacing: 0.7,
  },
  filterChip: {
    alignItems: 'center',
    backgroundColor: '#F8FAF9',
    borderColor: '#D1DAD5',
    borderRadius: 8,
    borderWidth: 1,
    flexBasis: '48%',
    flexGrow: 1,
    flexDirection: 'row',
    gap: 7,
    minHeight: 34,
    justifyContent: 'space-between',
    paddingLeft: 9,
    paddingRight: 6,
  },
  filterChipActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  filterCount: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderRadius: 6,
    height: 20,
    justifyContent: 'center',
    minWidth: 24,
    paddingHorizontal: 5,
  },
  filterCountActive: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  filterCountText: {
    ...typography.labelSm,
    color: palette.primary,
    fontWeight: '900',
  },
  filterCountTextActive: {
    color: palette.surface,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 3,
  },
  filterText: {
    ...typography.labelSm,
    color: palette.textMuted,
    flexShrink: 1,
    fontWeight: '900',
  },
  filterTextActive: {
    color: palette.surface,
  },
  header: {
    gap: 3,
    paddingTop: spacing.xs,
  },
  list: {
    gap: spacing.sm,
    marginTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  locationLine: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  metaGrid: {
    gap: 3,
  },
  metaItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    minWidth: 0,
  },
  pressed: {
    opacity: 0.86,
  },
  circularProgress: {
    alignItems: 'center',
    height: 54,
    justifyContent: 'center',
    position: 'relative',
    width: 54,
  },
  progressArc: {
    borderBottomColor: '#D1FAE5',
    borderRadius: 999,
    borderWidth: 6,
    height: 50,
    position: 'absolute',
    transform: [{ rotate: '35deg' }],
    width: 50,
  },
  progressCard: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderRadius: 8,
    borderWidth: 0,
    elevation: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 56,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    shadowColor: '#022C22',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  progressCount: {
    ...typography.bodyMd,
    color: palette.textMuted,
    fontWeight: '800',
  },
  progressCopy: {
    flex: 1,
    gap: 1,
  },
  progressLabel: {
    color: palette.text,
    fontSize: 17,
    fontWeight: '900',
    lineHeight: 22,
  },
  progressPercent: {
    ...typography.labelMd,
    fontWeight: '900',
  },
  reportAction: {
    backgroundColor: '#065F46',
  },
  scrollContent: {
    gap: 4,
    paddingBottom: spacing.lg,
  },
  stickyHeader: {
    backgroundColor: palette.background,
    elevation: 5,
    gap: 0,
    marginHorizontal: -spacing.md,
    paddingBottom: 7,
    paddingHorizontal: spacing.md,
    paddingTop: 2,
    shadowColor: '#022C22',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.045,
    shadowRadius: 10,
    zIndex: 10,
  },
  statusStack: {
    alignItems: 'flex-end',
    flexShrink: 0,
    gap: 3,
    paddingTop: 1,
  },
  subtitle: {
    ...typography.bodyMd,
    color: palette.textMuted,
    fontWeight: '700',
  },
  taskCard: {
    backgroundColor: palette.surface,
    borderColor: '#D1DAD5',
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
    justifyContent: 'space-between',
    minHeight: listCardMinHeight,
    shadowColor: '#1F2937',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.045,
    shadowRadius: 8,
    elevation: 2,
  },
  taskCardCompact: {
    minHeight: 126,
  },
  title: {
    color: palette.text,
    fontSize: 25,
    fontWeight: '900',
    lineHeight: 31,
  },
});

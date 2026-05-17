import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppScreen } from '@/components/app-screen';
import {
  InlineStatusBadge,
  ReportStatusBadge,
  getReportSubmissionStatus,
} from '@/components/ui/inspection-status';
import { getAssetIcon } from '@/constants/asset-icons';
import { palette, radius, shadows, spacing, typography } from '@/constants/theme';
import { assets, currentUser } from '@/data/mock';

type HistoryStatus = 'Good' | 'Minor Damage' | 'Damaged' | 'Missing';
type AssetType = 'Tools' | 'Vehicle' | 'Laptop' | 'WFM';
type SortOption = 'Newest' | 'Oldest' | 'Unit Name';
type ConditionFilterOption = 'All Conditions' | HistoryStatus;
type AssetTypeFilterOption = 'All Asset Types' | AssetType;
type ReportStatusFilterOption = 'All Report Status' | 'Submitted' | 'Not Submitted' | 'Approved';
type FilterOption = ConditionFilterOption | AssetTypeFilterOption | ReportStatusFilterOption;

type HistoryRecord = {
  id: string;
  assetName: string;
  assetCode: string;
  location: string;
  inspectedAt: string;
  timestamp: number;
  inspector: string;
  status: HistoryStatus;
  assetType: AssetType;
  category: string;
};

const sortOptions: SortOption[] = ['Newest', 'Oldest', 'Unit Name'];
const statusFilterOptions: ConditionFilterOption[] = ['All Conditions', 'Good', 'Minor Damage', 'Damaged', 'Missing'];
const assetTypeFilterOptions: AssetTypeFilterOption[] = ['All Asset Types', 'Tools', 'Vehicle', 'Laptop', 'WFM'];
const reportStatusFilterOptions: ReportStatusFilterOption[] = [
  'All Report Status',
  'Submitted',
  'Not Submitted',
  'Approved',
];
const listCardMinHeight = 124;

const historyRecords: HistoryRecord[] = [
  {
    id: 'AST-OTD-0144',
    assetName: 'DEVISER OTDR AE2300',
    assetCode: '#AST-OTD-0144',
    location: 'Tool Room Rack B1',
    inspectedAt: '14 May 2026, 09:21',
    timestamp: new Date('2026-05-14T09:21:00').getTime(),
    inspector: currentUser.fullName,
    status: 'Damaged',
    assetType: 'Tools',
    category: 'OTDR',
  },
  {
    id: 'AST-SPL-0091',
    assetName: 'Fujikura Splicer 90S',
    assetCode: '#AST-SPL-0091',
    location: 'Tool Room Rack A2',
    inspectedAt: '14 May 2026, 14:40',
    timestamp: new Date('2026-05-14T14:40:00').getTime(),
    inspector: currentUser.fullName,
    status: 'Good',
    assetType: 'Tools',
    category: 'Splicer',
  },
  {
    id: 'DK-3015-BN',
    assetName: 'Grandmax Fiber Support',
    assetCode: '#DK 3015 BN',
    location: 'Branch Parking Area',
    inspectedAt: '12 May 2026, 16:05',
    timestamp: new Date('2026-05-12T16:05:00').getTime(),
    inspector: currentUser.fullName,
    status: 'Minor Damage',
    assetType: 'Vehicle',
    category: 'Daihatsu Grandmax',
  },
  {
    id: 'AST-PWR-0302',
    assetName: 'Biznet Power Unit',
    assetCode: '#AST-PWR-0302',
    location: 'Warehouse Power Shelf',
    inspectedAt: '10 May 2026, 10:30',
    timestamp: new Date('2026-05-10T10:30:00').getTime(),
    inspector: currentUser.fullName,
    status: 'Good',
    assetType: 'Tools',
    category: 'Biznet Power',
  },
  {
    id: 'LTP-MAC-1301',
    assetName: 'MacBook Pro M1',
    assetCode: '#LTP-MAC-1301',
    location: 'Network Operation Desk',
    inspectedAt: '07 Apr 2026, 15:10',
    timestamp: new Date('2026-04-07T15:10:00').getTime(),
    inspector: currentUser.fullName,
    status: 'Missing',
    assetType: 'Laptop',
    category: 'Laptop',
  },
  {
    id: 'NOE3-WFM-DPS-0003',
    assetName: 'Honeywell Barcode Scanner 003',
    assetCode: '#NOE3-WFM-DPS-0003',
    location: 'Network Operation Desk',
    inspectedAt: '12 May 2026, 11:15',
    timestamp: new Date('2026-05-12T11:15:00').getTime(),
    inspector: currentUser.fullName,
    status: 'Damaged',
    assetType: 'WFM',
    category: 'WFM',
  },
];

export default function HistoryScreen() {
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('Newest');
  const [conditionFilter, setConditionFilter] = useState<ConditionFilterOption>('All Conditions');
  const [assetTypeFilter, setAssetTypeFilter] = useState<AssetTypeFilterOption>('All Asset Types');
  const [reportStatusFilter, setReportStatusFilter] = useState<ReportStatusFilterOption>('All Report Status');
  const [activeSheet, setActiveSheet] = useState<'sort' | 'filter' | null>(null);
  const hasActiveFilter =
    conditionFilter !== 'All Conditions' ||
    assetTypeFilter !== 'All Asset Types' ||
    reportStatusFilter !== 'All Report Status';

  const filteredRecords = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const records = historyRecords.filter((record) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        [
          record.assetName,
          record.assetCode,
          record.location,
          record.inspector,
          record.status,
          record.assetType,
        ].some((value) => value.toLowerCase().includes(normalizedQuery));
      const reportStatus = getReportSubmissionStatus(record.status);
      const matchesCondition = conditionFilter === 'All Conditions' || record.status === conditionFilter;
      const matchesAssetType = assetTypeFilter === 'All Asset Types' || record.assetType === assetTypeFilter;
      const matchesReportStatus =
        reportStatusFilter === 'All Report Status' || reportStatus === reportStatusFilter;

      return matchesSearch && matchesCondition && matchesAssetType && matchesReportStatus;
    });

    return records.sort((first, second) => {
      if (sortBy === 'Oldest') {
        return first.timestamp - second.timestamp;
      }

      if (sortBy === 'Unit Name') {
        return first.assetName.localeCompare(second.assetName);
      }

      return second.timestamp - first.timestamp;
    });
  }, [assetTypeFilter, conditionFilter, query, reportStatusFilter, sortBy]);

  return (
    <AppScreen scroll={false}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}>
        <View style={styles.stickyControls}>
          <View style={styles.controlsPanel}>
            <View style={styles.searchBox}>
              <MaterialIcons name="search" size={18} color={palette.textSubtle} />
              <TextInput
                onChangeText={setQuery}
                placeholder="Search History"
                placeholderTextColor={palette.textSubtle}
                style={styles.searchInput}
                value={query}
              />
            </View>

            <Pressable
              accessibilityLabel="Open sort options"
              accessibilityRole="button"
              onPress={() => setActiveSheet('sort')}
              style={({ pressed }) => [
                styles.iconControl,
                sortBy !== 'Newest' && styles.iconControlActive,
                pressed && styles.pressed,
              ]}>
              <MaterialIcons name="sort" size={22} color={sortBy === 'Newest' ? palette.primary : palette.surface} />
            </Pressable>

            <Pressable
              accessibilityLabel="Open filter options"
              accessibilityRole="button"
              onPress={() => setActiveSheet('filter')}
              style={({ pressed }) => [
                styles.iconControl,
                hasActiveFilter && styles.iconControlActive,
                pressed && styles.pressed,
              ]}>
              <MaterialIcons
                name="tune"
                size={22}
                color={hasActiveFilter ? palette.surface : palette.primary}
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.list}>
          {filteredRecords.length > 0 ? (
            filteredRecords.map((record) => <HistoryCard key={record.id} record={record} />)
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No records found</Text>
              <Text style={styles.emptyText}>Try another keyword, sorting option, or filter category.</Text>
            </View>
          )}
        </View>

      </ScrollView>

      <SortBottomSheet
        activeSort={sortBy}
        onClose={() => setActiveSheet(null)}
        onSelect={(option) => {
          setSortBy(option);
          setActiveSheet(null);
        }}
        visible={activeSheet === 'sort'}
      />

      <FilterBottomSheet
        activeAssetType={assetTypeFilter}
        activeCondition={conditionFilter}
        activeReportStatus={reportStatusFilter}
        onClose={() => setActiveSheet(null)}
        onSelectAssetType={setAssetTypeFilter}
        onSelectCondition={setConditionFilter}
        onSelectReportStatus={setReportStatusFilter}
        visible={activeSheet === 'filter'}
      />
    </AppScreen>
  );
}

function HistoryCard({ record }: { record: HistoryRecord }) {
  const reportStatus = getReportSubmissionStatus(record.status);
  const assetId = getHistoryRecordAssetId(record);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push({ pathname: '/inspection-detail', params: { assetId } })}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.cardTop}>
        <View style={styles.assetIconBox}>
          <MaterialIcons name={getAssetIcon(record.category)} size={22} color={palette.primary} />
        </View>

        <View style={styles.titleGroup}>
          <Text numberOfLines={1} style={styles.assetName}>
            {record.assetName}
          </Text>
          <Text style={styles.assetCode}>{record.assetCode}</Text>
        </View>

        <View style={styles.statusStack}>
          <InlineStatusBadge label={record.status} />
          {reportStatus ? <ReportStatusBadge status={reportStatus} /> : null}
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.metaRow}>
        <View style={styles.metaLeft}>
          <MaterialIcons name="location-on" size={14} color={palette.textSubtle} />
          <Text numberOfLines={1} style={styles.metaText}>
            {record.location}
          </Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaLeft}>
          <MaterialIcons name="access-time" size={14} color={palette.textSubtle} />
          <Text numberOfLines={1} style={styles.metaText}>
            {record.inspectedAt} - {record.inspector}
          </Text>
        </View>

      </View>
    </Pressable>
  );
}

function SortBottomSheet({
  activeSort,
  onClose,
  onSelect,
  visible,
}: {
  activeSort: SortOption;
  onClose: () => void;
  onSelect: (option: SortOption) => void;
  visible: boolean;
}) {
  return (
    <BottomSheet onClose={onClose} title="Sort Records" visible={visible}>
      <View style={styles.sheetOptionList}>
        {sortOptions.map((option) => {
          const isActive = activeSort === option;

          return (
            <Pressable
              accessibilityLabel={`Sort by ${option}`}
              accessibilityRole="button"
              key={option}
              onPress={() => onSelect(option)}
              style={({ pressed }) => [styles.sortOption, isActive && styles.sortOptionActive, pressed && styles.pressed]}>
              <View>
                <Text style={[styles.sortOptionTitle, isActive && styles.sortOptionTitleActive]}>{option}</Text>
                <Text style={styles.sortOptionCaption}>{getSortCaption(option)}</Text>
              </View>
              {isActive ? <MaterialIcons name="check-circle" size={20} color={palette.primary} /> : null}
            </Pressable>
          );
        })}
      </View>
    </BottomSheet>
  );
}

function FilterBottomSheet({
  activeAssetType,
  activeCondition,
  activeReportStatus,
  onClose,
  onSelectAssetType,
  onSelectCondition,
  onSelectReportStatus,
  visible,
}: {
  activeAssetType: AssetTypeFilterOption;
  activeCondition: ConditionFilterOption;
  activeReportStatus: ReportStatusFilterOption;
  onClose: () => void;
  onSelectAssetType: (option: AssetTypeFilterOption) => void;
  onSelectCondition: (option: ConditionFilterOption) => void;
  onSelectReportStatus: (option: ReportStatusFilterOption) => void;
  visible: boolean;
}) {
  return (
    <BottomSheet onClose={onClose} title="Filter Records" visible={visible}>
      <FilterSection activeFilter={activeCondition} onSelect={onSelectCondition} options={statusFilterOptions} title="Condition" />
      <FilterSection activeFilter={activeAssetType} onSelect={onSelectAssetType} options={assetTypeFilterOptions} title="Asset Type" />
      <FilterSection
        activeFilter={activeReportStatus}
        onSelect={onSelectReportStatus}
        options={reportStatusFilterOptions}
        title="Report Status"
      />
    </BottomSheet>
  );
}

function FilterSection<T extends FilterOption>({
  activeFilter,
  onSelect,
  options,
  title,
}: {
  activeFilter: T;
  onSelect: (option: T) => void;
  options: readonly T[];
  title: string;
}) {
  return (
    <View style={styles.sheetSection}>
      <Text style={styles.sheetSectionTitle}>{title}</Text>
      <View style={styles.pillGrid}>
        {options.map((option) => {
          const isActive = activeFilter === option;

          return (
            <Pressable
              accessibilityLabel={`Filter by ${option}`}
              accessibilityRole="button"
              key={option}
              onPress={() => onSelect(option)}
              style={({ pressed }) => [styles.sheetPill, isActive && styles.sheetPillActive, pressed && styles.pressed]}>
              <Text style={[styles.sheetPillText, isActive && styles.sheetPillTextActive]}>{option}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function BottomSheet({
  children,
  onClose,
  title,
  visible,
}: {
  children: ReactNode;
  onClose: () => void;
  title: string;
  visible: boolean;
}) {
  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={visible}>
      <View style={styles.modalRoot}>
        <Pressable accessibilityLabel="Close options" style={styles.modalBackdrop} onPress={onClose} />
        <View style={styles.bottomSheet}>
          <View style={styles.dragHandle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{title}</Text>
            <Pressable accessibilityLabel="Close options" accessibilityRole="button" onPress={onClose} style={styles.sheetClose}>
              <MaterialIcons name="close" size={20} color={palette.textMuted} />
            </Pressable>
          </View>
          <ScrollView
            bounces={false}
            contentContainerStyle={styles.sheetScrollContent}
            showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function getHistoryRecordAssetId(record: HistoryRecord) {
  const code = record.assetCode.replace(/^#/, '');
  return assets.find((asset) => asset.code === code)?.id ?? record.id;
}

function getSortCaption(option: SortOption) {
  if (option === 'Oldest') {
    return 'Date ascending: oldest inspections first.';
  }

  if (option === 'Unit Name') {
    return 'Name ascending: A to Z by asset unit.';
  }

  return 'Date descending: newest inspections first.';
}

const styles = StyleSheet.create({
  assetCode: {
    ...typography.labelSm,
    color: palette.textSubtle,
    fontWeight: '700',
  },
  assetIconBox: {
    alignItems: 'center',
    backgroundColor: palette.infoSoft,
    borderRadius: radius.md,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  assetName: {
    ...typography.bodyMd,
    color: palette.primary,
    fontWeight: '800',
  },
  card: {
    backgroundColor: palette.surface,
    borderColor: '#D1DAD5',
    borderRadius: radius.lg,
    borderWidth: 1,
    elevation: 2,
    gap: 6,
    justifyContent: 'space-between',
    minHeight: listCardMinHeight,
    padding: 12,
    shadowColor: '#022C22',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  cardTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  bottomSheet: {
    backgroundColor: palette.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    gap: spacing.md,
    maxHeight: '78%',
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
  },
  divider: {
    backgroundColor: palette.border,
    height: 1,
    marginLeft: 46,
  },
  dragHandle: {
    alignSelf: 'center',
    backgroundColor: '#D1DAD5',
    borderRadius: radius.full,
    height: 5,
    width: 68,
  },
  header: {
    gap: 3,
  },
  headerTitle: {
    color: palette.text,
    fontSize: 25,
    fontWeight: '900',
    lineHeight: 31,
  },
  contextText: {
    ...typography.labelMd,
    color: palette.textMuted,
    fontWeight: '900',
    letterSpacing: 0.7,
  },
  headerMeta: {
    ...typography.bodyMd,
    color: palette.textMuted,
    fontWeight: '700',
  },
  locationLine: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  list: {
    gap: spacing.xs,
  },
  controlButton: {
    alignItems: 'center',
    backgroundColor: '#F8FAF9',
    borderColor: '#D1DAD5',
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'space-between',
    minHeight: 46,
    minWidth: 96,
    paddingHorizontal: spacing.sm,
  },
  controlLabel: {
    ...typography.labelSm,
    color: palette.textSubtle,
    fontWeight: '800',
  },
  controlsPanel: {
    ...shadows.floating,
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    padding: spacing.xs,
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  controlValue: {
    ...typography.labelSm,
    color: palette.primary,
    fontWeight: '900',
    maxWidth: 72,
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: 4,
    padding: spacing.lg,
  },
  emptyText: {
    ...typography.bodyMd,
    color: palette.textSubtle,
    textAlign: 'center',
  },
  emptyTitle: {
    ...typography.bodyLg,
    color: palette.text,
    fontWeight: '800',
  },
  iconControl: {
    alignItems: 'center',
    backgroundColor: '#F8FAF9',
    borderColor: '#D1DAD5',
    borderRadius: radius.lg,
    borderWidth: 1,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  iconControlActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  metaLeft: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 4,
    minWidth: 0,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'space-between',
  },
  metaText: {
    ...typography.labelSm,
    color: palette.textSubtle,
    flex: 1,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.8,
  },
  modalBackdrop: {
    backgroundColor: 'rgba(31, 41, 55, 0.45)',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  optionChip: {
    alignItems: 'center',
    backgroundColor: '#F8FAF9',
    borderColor: '#D1DAD5',
    borderRadius: radius.full,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: spacing.lg,
    shadowColor: '#022C22',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
  },
  optionChipActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  optionChipText: {
    ...typography.labelSm,
    color: palette.textMuted,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  optionChipTextActive: {
    color: palette.surface,
  },
  optionRow: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingRight: spacing.md,
  },
  optionScroll: {
    flexGrow: 0,
    height: 42,
    marginHorizontal: -spacing.md,
    maxHeight: 42,
    paddingHorizontal: spacing.md,
  },
  pillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  sheetClose: {
    alignItems: 'center',
    backgroundColor: '#F8FAF9',
    borderRadius: radius.full,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  sheetHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sheetOptionList: {
    gap: spacing.sm,
  },
  sheetScrollContent: {
    gap: spacing.md,
    paddingBottom: spacing.sm,
  },
  sheetPill: {
    alignItems: 'center',
    backgroundColor: '#F8FAF9',
    borderColor: '#D1DAD5',
    borderRadius: radius.full,
    borderWidth: 1,
    minHeight: 40,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  sheetPillActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  sheetPillText: {
    ...typography.bodyMd,
    color: palette.textMuted,
    fontWeight: '700',
  },
  sheetPillTextActive: {
    color: palette.surface,
  },
  sheetSection: {
    gap: spacing.sm,
  },
  sheetSectionTitle: {
    ...typography.bodyLg,
    color: palette.text,
    fontWeight: '800',
  },
  sheetTitle: {
    ...typography.headlineSm,
    color: palette.text,
    fontWeight: '800',
  },
  sortOption: {
    alignItems: 'center',
    backgroundColor: '#F8FAF9',
    borderColor: '#D1DAD5',
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 62,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  sortOptionActive: {
    backgroundColor: palette.primarySoft,
    borderColor: palette.primary,
  },
  sortOptionCaption: {
    ...typography.labelSm,
    color: palette.textSubtle,
    fontWeight: '700',
  },
  sortOptionTitle: {
    ...typography.bodyMd,
    color: palette.text,
    fontWeight: '800',
  },
  sortOptionTitleActive: {
    color: palette.primary,
  },
  statusStack: {
    alignItems: 'flex-end',
    flexShrink: 0,
    gap: 2,
  },
  titleGroup: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  searchBox: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderColor: '#D1DAD5',
    borderRadius: radius.lg,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    minHeight: 46,
    minWidth: 0,
    paddingHorizontal: spacing.sm,
  },
  searchInput: {
    ...typography.bodyMd,
    color: palette.text,
    flex: 1,
    minWidth: 0,
  },
  scrollContent: {
    flexGrow: 1,
    gap: spacing.md,
    paddingBottom: 0,
  },
  stickyControls: {
    backgroundColor: 'rgba(248, 250, 249, 0.72)',
    paddingBottom: spacing.xs,
    zIndex: 10,
  },
});

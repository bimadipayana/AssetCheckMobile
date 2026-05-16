import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/app-screen';
import { palette, radius, shadows, spacing, typography } from '@/constants/theme';

type AssetType = 'Tools' | 'Vehicle' | 'Laptop' | 'WFM';
type SubCategory = 'Splicer' | 'OTDR' | 'Togo Power' | 'Mobil Grandmax' | 'Motor Honda Revo';
type InspectionStatus = 'Checked' | 'Pending' | 'Missing';
type AssetCondition = 'Good' | 'Minor Damaged' | 'Damaged' | 'Missing';
type AssetRow = {
  code: string;
  condition: AssetCondition | null;
  lastCheck: string;
  name: string;
  picLaptop?: string;
  status: InspectionStatus;
  subCategory: SubCategory | null;
  type: AssetType;
};
type SummaryData = {
  total: number;
  icon: keyof typeof MaterialIcons.glyphMap;
  inspection: { checked: number; pending: number; missing: number };
  condition: { good: number; minor: number; damaged: number; missing: number };
};

const userName = 'Akmal Jeddi';
const userBranch = 'Badung Nusa Dua';
const profitCenter = '2705';

const assetTypeIcons: Record<AssetType, keyof typeof MaterialIcons.glyphMap> = {
  Laptop: 'laptop-mac',
  Tools: 'construction',
  Vehicle: 'directions-car',
  WFM: 'support-agent',
};

const subCategories: Partial<Record<AssetType, { label: SubCategory; icon: keyof typeof MaterialIcons.glyphMap }[]>> = {
  Tools: [
    { label: 'Splicer', icon: 'precision-manufacturing' },
    { label: 'OTDR', icon: 'cable' },
    { label: 'Togo Power', icon: 'electrical-services' },
  ],
  Vehicle: [
    { label: 'Mobil Grandmax', icon: 'local-shipping' },
    { label: 'Motor Honda Revo', icon: 'two-wheeler' },
  ],
};

const subCategoryIcons: Record<SubCategory, keyof typeof MaterialIcons.glyphMap> = {
  'Mobil Grandmax': 'local-shipping',
  'Motor Honda Revo': 'two-wheeler',
  OTDR: 'cable',
  Splicer: 'precision-manufacturing',
  'Togo Power': 'electrical-services',
};

const assetRows: AssetRow[] = [
  { code: 'AST-SPL-0091', name: 'Fujikura Splicer 90S', type: 'Tools', subCategory: 'Splicer', status: 'Checked', condition: 'Good', lastCheck: '14 May 2026' },
  { code: 'AST-SPL-0140', name: 'Sumitomo Splicer T-72C', type: 'Tools', subCategory: 'Splicer', status: 'Pending', condition: null, lastCheck: '18 Apr 2026' },
  { code: 'AST-SPL-0188', name: 'Fujikura Cleaver CT50', type: 'Tools', subCategory: 'Splicer', status: 'Checked', condition: 'Good', lastCheck: '13 May 2026' },
  { code: 'AST-SPL-0217', name: 'Fujikura Splicer 88S', type: 'Tools', subCategory: 'Splicer', status: 'Checked', condition: 'Minor Damaged', lastCheck: '12 May 2026' },
  { code: 'AST-OTD-0144', name: 'DEVISER OTDR AE2300', type: 'Tools', subCategory: 'OTDR', status: 'Checked', condition: 'Damaged', lastCheck: '14 May 2026' },
  { code: 'AST-OTD-0201', name: 'Anritsu MT9085', type: 'Tools', subCategory: 'OTDR', status: 'Pending', condition: null, lastCheck: '16 Apr 2026' },
  { code: 'AST-OTD-0265', name: 'Yokogawa AQ7280', type: 'Tools', subCategory: 'OTDR', status: 'Missing', condition: 'Missing', lastCheck: '09 Apr 2026' },
  { code: 'AST-OTD-0298', name: 'EXFO MaxTester 730C', type: 'Tools', subCategory: 'OTDR', status: 'Checked', condition: 'Good', lastCheck: '11 May 2026' },
  { code: 'AST-PWR-0302', name: 'Togo Biznet Power Unit', type: 'Tools', subCategory: 'Togo Power', status: 'Checked', condition: 'Good', lastCheck: '10 May 2026' },
  { code: 'AST-PWR-0331', name: 'Togo Backup Power Kit', type: 'Tools', subCategory: 'Togo Power', status: 'Pending', condition: null, lastCheck: '15 Apr 2026' },
  { code: 'AST-PWR-0348', name: 'Portable Genset 2200W', type: 'Tools', subCategory: 'Togo Power', status: 'Checked', condition: 'Minor Damaged', lastCheck: '13 May 2026' },
  { code: 'AST-PWR-0360', name: 'Field Power Stabilizer', type: 'Tools', subCategory: 'Togo Power', status: 'Missing', condition: 'Missing', lastCheck: '06 Apr 2026' },
  { code: 'DK 2705 GA', name: 'Grandmax Operational Unit', type: 'Vehicle', subCategory: 'Mobil Grandmax', status: 'Checked', condition: 'Good', lastCheck: '14 May 2026' },
  { code: 'DK 1842 BX', name: 'Grandmax Field Support', type: 'Vehicle', subCategory: 'Mobil Grandmax', status: 'Pending', condition: null, lastCheck: '20 Apr 2026' },
  { code: 'DK 3015 BN', name: 'Grandmax Fiber Support', type: 'Vehicle', subCategory: 'Mobil Grandmax', status: 'Checked', condition: 'Minor Damaged', lastCheck: '12 May 2026' },
  { code: 'DK 2250 NA', name: 'Grandmax Maintenance Unit', type: 'Vehicle', subCategory: 'Mobil Grandmax', status: 'Checked', condition: 'Good', lastCheck: '11 May 2026' },
  { code: 'DK 4128 RE', name: 'Honda Revo Technician', type: 'Vehicle', subCategory: 'Motor Honda Revo', status: 'Missing', condition: 'Missing', lastCheck: '08 Apr 2026' },
  { code: 'DK 2904 RV', name: 'Honda Revo Patrol Unit', type: 'Vehicle', subCategory: 'Motor Honda Revo', status: 'Pending', condition: null, lastCheck: '17 Apr 2026' },
  { code: 'DK 1187 HR', name: 'Honda Revo Field Unit', type: 'Vehicle', subCategory: 'Motor Honda Revo', status: 'Checked', condition: 'Damaged', lastCheck: '13 May 2026' },
  { code: 'LTP-THK-1022', name: 'ThinkPad T14 Gen 3', type: 'Laptop', subCategory: null, status: 'Checked', condition: 'Good', lastCheck: '14 May 2026', picLaptop: 'Akmal Jeddi' },
  { code: 'LTP-DEL-1140', name: 'Dell Latitude 5530', type: 'Laptop', subCategory: null, status: 'Pending', condition: null, lastCheck: '19 Apr 2026', picLaptop: 'Michael Chen' },
  { code: 'LTP-HP-1209', name: 'HP EliteBook 840 G8', type: 'Laptop', subCategory: null, status: 'Checked', condition: 'Good', lastCheck: '13 May 2026', picLaptop: 'Sarah Rogers' },
  { code: 'LTP-MAC-1301', name: 'MacBook Pro M1', type: 'Laptop', subCategory: null, status: 'Missing', condition: 'Missing', lastCheck: '07 Apr 2026', picLaptop: 'Aditya Putra' },
  { code: 'LTP-ASU-1422', name: 'ASUS ExpertBook B9', type: 'Laptop', subCategory: null, status: 'Checked', condition: 'Minor Damaged', lastCheck: '12 May 2026', picLaptop: 'Dian Kurnia' },
  { code: 'LTP-LEN-1510', name: 'Lenovo ThinkBook 14', type: 'Laptop', subCategory: null, status: 'Pending', condition: null, lastCheck: '21 Apr 2026', picLaptop: 'Rafi Mahendra' },
  { code: 'WFM-FLD-0401', name: 'WFM Field Tablet A1', type: 'WFM', subCategory: null, status: 'Checked', condition: 'Good', lastCheck: '14 May 2026' },
  { code: 'WFM-RDR-0408', name: 'WFM Barcode Reader Kit', type: 'WFM', subCategory: null, status: 'Pending', condition: null, lastCheck: '22 Apr 2026' },
  { code: 'WFM-RTR-0415', name: 'WFM Mobile Router', type: 'WFM', subCategory: null, status: 'Checked', condition: 'Minor Damaged', lastCheck: '12 May 2026' },
  { code: 'WFM-HHD-0422', name: 'WFM Handheld Device', type: 'WFM', subCategory: null, status: 'Missing', condition: 'Missing', lastCheck: '05 Apr 2026' },
];

function buildSummary(rows: AssetRow[], icon: keyof typeof MaterialIcons.glyphMap): SummaryData {
  return rows.reduce<SummaryData>(
    (summary, asset) => {
      summary.total += 1;

      if (asset.status === 'Checked') {
        summary.inspection.checked += 1;
      } else if (asset.status === 'Pending') {
        summary.inspection.pending += 1;
      } else {
        summary.inspection.missing += 1;
      }

      if (asset.condition === 'Good') {
        summary.condition.good += 1;
      } else if (asset.condition === 'Minor Damaged') {
        summary.condition.minor += 1;
      } else if (asset.condition === 'Damaged') {
        summary.condition.damaged += 1;
      } else if (asset.condition === 'Missing') {
        summary.condition.missing += 1;
      }

      return summary;
    },
    {
      condition: { damaged: 0, good: 0, minor: 0, missing: 0 },
      icon,
      inspection: { checked: 0, missing: 0, pending: 0 },
      total: 0,
    },
  );
}

const assetTypeData: Record<AssetType, SummaryData> = {
  Tools: buildSummary(
    assetRows.filter((asset) => asset.type === 'Tools'),
    assetTypeIcons.Tools,
  ),
  Vehicle: buildSummary(
    assetRows.filter((asset) => asset.type === 'Vehicle'),
    assetTypeIcons.Vehicle,
  ),
  Laptop: buildSummary(
    assetRows.filter((asset) => asset.type === 'Laptop'),
    assetTypeIcons.Laptop,
  ),
  WFM: buildSummary(
    assetRows.filter((asset) => asset.type === 'WFM'),
    assetTypeIcons.WFM,
  ),
};

const subCategoryData: Record<SubCategory, SummaryData> = {
  'Mobil Grandmax': buildSummary(
    assetRows.filter((asset) => asset.subCategory === 'Mobil Grandmax'),
    subCategoryIcons['Mobil Grandmax'],
  ),
  'Motor Honda Revo': buildSummary(
    assetRows.filter((asset) => asset.subCategory === 'Motor Honda Revo'),
    subCategoryIcons['Motor Honda Revo'],
  ),
  OTDR: buildSummary(
    assetRows.filter((asset) => asset.subCategory === 'OTDR'),
    subCategoryIcons.OTDR,
  ),
  Splicer: buildSummary(
    assetRows.filter((asset) => asset.subCategory === 'Splicer'),
    subCategoryIcons.Splicer,
  ),
  'Togo Power': buildSummary(
    assetRows.filter((asset) => asset.subCategory === 'Togo Power'),
    subCategoryIcons['Togo Power'],
  ),
};

export default function HomeScreen() {
  const [selectedType, setSelectedType] = useState<AssetType>('Tools');
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [pageSize, setPageSize] = useState<5 | 10>(5);
  const [currentPage, setCurrentPage] = useState(1);

  const visibleSubCategories = subCategories[selectedType] ?? [];
  const activeSummary = selectedSubCategory ? subCategoryData[selectedSubCategory] : assetTypeData[selectedType];
  const filteredAssets = useMemo(
    () =>
      assetRows.filter((asset) => {
        if (asset.type !== selectedType) {
          return false;
        }

        return selectedSubCategory ? asset.subCategory === selectedSubCategory : true;
      }),
    [selectedSubCategory, selectedType],
  );
  const totalPages = Math.max(1, Math.ceil(filteredAssets.length / pageSize));
  const paginatedAssets = filteredAssets.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const pageSizeOptions = filteredAssets.length > 10 ? ([5, 10] as const) : ([5] as const);
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  useEffect(() => {
    if (filteredAssets.length <= 10 && pageSize === 10) {
      setPageSize(5);
    }

    setCurrentPage(1);
  }, [filteredAssets.length, pageSize, selectedSubCategory, selectedType]);

  const inspectionRows = [
    { label: 'Checked', value: activeSummary.inspection.checked, icon: 'check-circle' as const, color: palette.primary },
    { label: 'Pending', value: activeSummary.inspection.pending, icon: 'pending' as const, color: palette.warning },
    { label: 'Missing', value: activeSummary.inspection.missing, icon: 'highlight-off' as const, color: palette.danger },
  ];
  const conditionRows = [
    { label: 'Good', value: activeSummary.condition.good, icon: 'thumb-up-off-alt' as const, color: palette.primary },
    { label: 'Minor Damaged', value: activeSummary.condition.minor, icon: 'build' as const, color: palette.warning },
    { label: 'Damaged', value: activeSummary.condition.damaged, icon: 'image-not-supported' as const, color: palette.danger },
    { label: 'Missing', value: activeSummary.condition.missing, icon: 'error-outline' as const, color: palette.danger },
  ];

  return (
    <AppScreen>
      <View style={styles.heroSection}>
        <SectionBackground />
        <View style={styles.header}>
          <Text style={styles.contextText}>Network Operation East 3 - Asset Check</Text>
          <Text style={styles.greeting}>Hi, {userName}</Text>
          <View style={styles.locationLine}>
            <MaterialIcons name="location-on" size={16} color={palette.textMuted} />
            <Text style={styles.locationText}>
              {userBranch} - {profitCenter}
            </Text>
          </View>
        </View>

        <View style={styles.assetTypePanel}>
          <Text style={styles.sectionTitle}>Asset Types</Text>
          <View style={styles.divider} />
          <View style={styles.assetTypeRow}>
            {(Object.keys(assetTypeData) as AssetType[]).map((type) => {
              const item = assetTypeData[type];
              const isSelected = selectedType === type;

              return (
                <Pressable
                  accessibilityLabel={`Filter asset type ${type}`}
                  accessibilityRole="button"
                  key={type}
                  onPress={() => {
                    setSelectedType(type);
                    setSelectedSubCategory(null);
                  }}
                  style={({ pressed }) => [
                    styles.assetTypeCard,
                    isSelected && styles.assetTypeCardSelected,
                    pressed && styles.pressed,
                  ]}>
                  <AssetTypeBorderGlow active={isSelected} />
                  <MaterialIcons name={item.icon} size={27} color={isSelected ? palette.surface : palette.primary} />
                  <Text style={[styles.assetTypeLabel, isSelected && styles.assetTypeLabelSelected]}>{type}</Text>
                  <Text style={[styles.assetTypeValue, isSelected && styles.assetTypeValueSelected]}>{item.total}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {visibleSubCategories.length > 0 ? (
          <View style={styles.subCategoryRow}>
            {visibleSubCategories.map((item) => {
              const isSelected = selectedSubCategory === item.label;

              return (
                <Pressable
                  accessibilityLabel={`Filter sub category ${item.label}`}
                  accessibilityRole="button"
                  key={item.label}
                  onPress={() => setSelectedSubCategory((current) => (current === item.label ? null : item.label))}
                  style={({ pressed }) => [
                    styles.subCategoryCard,
                    isSelected && styles.subCategoryCardSelected,
                    pressed && styles.pressed,
                  ]}>
                  <MaterialIcons name={item.icon} size={20} color={isSelected ? palette.primaryDark : palette.primary} />
                  <Text style={[styles.subCategoryLabel, isSelected && styles.subCategoryLabelSelected]}>{item.label}</Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}

        <View style={styles.summaryGrid}>
          <SummaryPanel title="Inspection" rows={inspectionRows} />
          <SummaryPanel title="Condition" rows={conditionRows} />
        </View>
      </View>

      <View style={styles.assetListCard}>
        <View style={styles.assetListHeader}>
          <Text style={styles.sectionTitle}>List Asset</Text>
          <Text style={styles.assetListMeta}>{filteredAssets.length} records</Text>
        </View>
        <View style={styles.tableToolbar}>
          <Text style={styles.showDataLabel}>Show Data</Text>
          <View style={styles.showDataOptions}>
            {pageSizeOptions.map((option) => {
              const isSelected = pageSize === option;

              return (
                <Pressable
                  accessibilityRole="button"
                  key={option}
                  onPress={() => setPageSize(option)}
                  style={({ pressed }) => [
                    styles.showDataButton,
                    isSelected && styles.showDataButtonSelected,
                    pressed && styles.pressed,
                  ]}>
                  <Text style={[styles.showDataButtonText, isSelected && styles.showDataButtonTextSelected]}>
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tableScroll}
          contentContainerStyle={styles.tableScrollContent}>
          <View style={[styles.tableContent, selectedType === 'Laptop' && styles.tableContentLaptop]}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.codeColumn]}>
                {selectedType === 'Vehicle' ? 'Nomor Polisi' : 'Asset Code'}
              </Text>
              <Text style={[styles.tableHeaderText, styles.nameColumn]}>Asset Name</Text>
              <Text style={[styles.tableHeaderText, styles.lastCheckColumn]}>Last Check</Text>
              {selectedType === 'Laptop' ? (
                <Text style={[styles.tableHeaderText, styles.picColumn]}>PIC Laptop</Text>
              ) : null}
              <Text style={[styles.tableHeaderText, styles.statusHeaderColumn]}>Status</Text>
            </View>
            <View style={styles.tableRows}>
              {paginatedAssets.map((asset) => (
                <View key={asset.code} style={styles.tableRow}>
                  <Text numberOfLines={1} style={[styles.assetCode, styles.codeColumn]}>
                    {asset.code}
                  </Text>
                  <Text numberOfLines={2} style={[styles.assetName, styles.nameColumn]}>
                    {asset.name}
                  </Text>
                  <Text numberOfLines={2} style={[styles.lastCheckText, styles.lastCheckColumn]}>
                    {asset.lastCheck}
                  </Text>
                  {selectedType === 'Laptop' ? (
                    <Text numberOfLines={2} style={[styles.picText, styles.picColumn]}>
                      {asset.picLaptop ?? '-'}
                    </Text>
                  ) : null}
                  <View style={styles.statusColumn}>
                    <StatusPill label={asset.status} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
        <View style={styles.paginationRow}>
          <Pressable
            accessibilityRole="button"
            disabled={!canGoPrevious}
            onPress={() => setCurrentPage((page) => Math.max(1, page - 1))}
            style={({ pressed }) => [
              styles.paginationButton,
              !canGoPrevious && styles.paginationButtonDisabled,
              pressed && canGoPrevious && styles.pressed,
            ]}>
            <Text style={[styles.paginationButtonText, !canGoPrevious && styles.paginationButtonTextDisabled]}>
              Previous
            </Text>
          </Pressable>
          <Text style={styles.pageIndicator}>
            Page {currentPage} / {totalPages}
          </Text>
          <Pressable
            accessibilityRole="button"
            disabled={!canGoNext}
            onPress={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            style={({ pressed }) => [
              styles.paginationButton,
              !canGoNext && styles.paginationButtonDisabled,
              pressed && canGoNext && styles.pressed,
            ]}>
            <Text style={[styles.paginationButtonText, !canGoNext && styles.paginationButtonTextDisabled]}>
              Next
            </Text>
          </Pressable>
        </View>
      </View>
    </AppScreen>
  );
}

function SectionBackground() {
  return (
    <View pointerEvents="none" style={styles.sectionBackground}>
      <View style={styles.sectionBase} />
      <View style={styles.sectionMintWashTop} />
      <View style={styles.sectionMintWashBottom} />
      <View style={styles.sectionDiagonalLarge} />
      <View style={styles.sectionDiagonalSmall} />
      <View style={[styles.sectionCircuitLine, styles.sectionCircuitLineOne]} />
      <View style={[styles.sectionCircuitLine, styles.sectionCircuitLineTwo]} />
      <View style={[styles.sectionCircuitLine, styles.sectionCircuitLineThree]} />
      <View style={[styles.sectionCircuitDot, styles.sectionCircuitDotOne]} />
      <View style={[styles.sectionCircuitDot, styles.sectionCircuitDotTwo]} />
      <View style={styles.sectionHudRing} />
      <View style={styles.sectionDotMatrix} />
    </View>
  );
}

function AssetTypeBorderGlow({ active }: { active: boolean }) {
  const progress = useRef(new Animated.Value(0)).current;
  const [layout, setLayout] = useState({ height: 0, width: 0 });

  useEffect(() => {
    progress.setValue(0);

    const animation = Animated.loop(
      Animated.timing(progress, {
        duration: active ? 2400 : 3600,
        easing: Easing.linear,
        toValue: 1,
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => animation.stop();
  }, [active, progress]);

  const width = layout.width;
  const height = layout.height;

  if (!width || !height) {
    return (
      <View
        pointerEvents="none"
        style={styles.assetTypeGlowLayer}
        onLayout={(event) => setLayout(event.nativeEvent.layout)}
      />
    );
  }

  const horizontalLength = Math.min(36, Math.max(24, width * 0.36));
  const verticalLength = Math.min(30, Math.max(20, height * 0.34));
  const sideInset = 10;
  const topTravel = Math.max(0, width - horizontalLength - sideInset * 2);
  const sideTravel = Math.max(0, height - verticalLength - sideInset * 2);
  const glowOpacity = active ? 0.95 : 0.58;

  const topX = progress.interpolate({
    inputRange: [0, 0.25, 1],
    outputRange: [0, topTravel, topTravel],
  });
  const rightY = progress.interpolate({
    inputRange: [0, 0.25, 0.5, 1],
    outputRange: [0, 0, sideTravel, sideTravel],
  });
  const bottomX = progress.interpolate({
    inputRange: [0, 0.5, 0.75, 1],
    outputRange: [0, 0, -topTravel, -topTravel],
  });
  const leftY = progress.interpolate({
    inputRange: [0, 0.75, 1],
    outputRange: [0, 0, -sideTravel],
  });
  const topOpacity = progress.interpolate({
    inputRange: [0, 0.03, 0.23, 0.28, 1],
    outputRange: [0, glowOpacity, glowOpacity, 0, 0],
  });
  const rightOpacity = progress.interpolate({
    inputRange: [0, 0.22, 0.28, 0.48, 0.53, 1],
    outputRange: [0, 0, glowOpacity, glowOpacity, 0, 0],
  });
  const bottomOpacity = progress.interpolate({
    inputRange: [0, 0.47, 0.53, 0.73, 0.78, 1],
    outputRange: [0, 0, glowOpacity, glowOpacity, 0, 0],
  });
  const leftOpacity = progress.interpolate({
    inputRange: [0, 0.72, 0.78, 0.98, 1],
    outputRange: [0, 0, glowOpacity, glowOpacity, 0],
  });

  return (
    <View
      pointerEvents="none"
      style={styles.assetTypeGlowLayer}
      onLayout={(event) => setLayout(event.nativeEvent.layout)}>
      <Animated.View
        style={[
          styles.assetTypeGlow,
          styles.assetTypeGlowHorizontal,
          {
            left: sideInset,
            opacity: topOpacity,
            top: 0,
            transform: [{ translateX: topX }],
            width: horizontalLength,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.assetTypeGlow,
          styles.assetTypeGlowVertical,
          {
            height: verticalLength,
            opacity: rightOpacity,
            right: 0,
            top: sideInset,
            transform: [{ translateY: rightY }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.assetTypeGlow,
          styles.assetTypeGlowHorizontal,
          {
            bottom: 0,
            opacity: bottomOpacity,
            right: sideInset,
            transform: [{ translateX: bottomX }],
            width: horizontalLength,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.assetTypeGlow,
          styles.assetTypeGlowVertical,
          {
            bottom: sideInset,
            height: verticalLength,
            left: 0,
            opacity: leftOpacity,
            transform: [{ translateY: leftY }],
          },
        ]}
      />
    </View>
  );
}

function SummaryPanel({
  rows,
  title,
}: {
  rows: {
    label: string;
    value: number;
    icon: keyof typeof MaterialIcons.glyphMap;
    color: string;
  }[];
  title: string;
}) {
  return (
    <View style={styles.summaryPanel}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.divider} />
      <View style={styles.summaryRows}>
        {rows.map((row) => (
          <View key={row.label} style={styles.summaryRow}>
            <MaterialIcons name={row.icon} size={18} color={row.color} />
            <Text style={[styles.summaryLabel, { color: row.color }]}>{row.label}</Text>
            <Text style={styles.summaryValue}>{row.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function StatusPill({ label }: { label: string }) {
  const tone =
    label === 'Checked'
      ? { border: '#9ADBC4', text: palette.primary }
      : label === 'Pending'
        ? { border: '#FFD58D', text: palette.warning }
        : { border: '#F7A7A1', text: palette.danger };

  return (
    <View style={[styles.statusPill, { borderColor: tone.border }]}>
      <Text style={[styles.statusPillText, { color: tone.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  assetCode: {
    ...typography.labelSm,
    color: palette.primary,
    fontWeight: '900',
  },
  assetListCard: {
    ...shadows.floating,
    backgroundColor: palette.surface,
    borderColor: '#D1DAD5',
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.sm,
    shadowOpacity: 0.04,
    shadowRadius: 9,
  },
  assetListHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  assetListMeta: {
    ...typography.labelSm,
    color: palette.textSubtle,
    fontWeight: '800',
  },
  assetName: {
    ...typography.labelSm,
    color: palette.text,
    fontWeight: '800',
  },
  assetTypeCard: {
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderColor: '#BFEAD8',
    borderRadius: radius.md,
    borderWidth: 1,
    flex: 1,
    gap: 3,
    minHeight: 88,
    overflow: 'hidden',
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
    position: 'relative',
  },
  assetTypeCardSelected: {
    backgroundColor: palette.primary,
    borderColor: '#10B981',
  },
  assetTypeGlow: {
    backgroundColor: '#CFFCE8',
    elevation: 2,
    position: 'absolute',
    shadowColor: '#10B981',
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 6,
  },
  assetTypeGlowHorizontal: {
    borderRadius: 999,
    height: 2,
  },
  assetTypeGlowLayer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  assetTypeGlowVertical: {
    borderRadius: 999,
    width: 2,
  },
  assetTypeLabel: {
    ...typography.bodyMd,
    color: palette.textMuted,
    fontWeight: '700',
  },
  assetTypeLabelSelected: {
    color: '#D1FAE5',
  },
  assetTypePanel: {
    ...shadows.floating,
    backgroundColor: palette.surface,
    borderColor: '#D1DAD5',
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.sm,
    shadowOpacity: 0.04,
    shadowRadius: 9,
  },
  assetTypeRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  assetTypeValue: {
    color: palette.text,
    fontSize: 19,
    fontWeight: '900',
    lineHeight: 23,
  },
  assetTypeValueSelected: {
    color: palette.surface,
  },
  circularProgress: {
    alignItems: 'center',
    height: 64,
    justifyContent: 'center',
    position: 'relative',
    width: 64,
  },
  codeColumn: {
    width: 104,
  },
  contextText: {
    ...typography.labelSm,
    color: palette.textMuted,
    fontWeight: '900',
    letterSpacing: 0.7,
    lineHeight: 14,
    textTransform: 'uppercase',
  },
  divider: {
    backgroundColor: '#D1DAD5',
    height: 1,
  },
  greeting: {
    color: palette.text,
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 29,
  },
  header: {
    gap: 1,
  },
  heroSection: {
    gap: spacing.md,
    marginHorizontal: -spacing.md,
    marginTop: -spacing.md,
    overflow: 'hidden',
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    position: 'relative',
  },
  locationLine: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  locationText: {
    ...typography.bodyMd,
    color: palette.textMuted,
    fontWeight: '700',
  },
  nameColumn: {
    width: 136,
  },
  lastCheckColumn: {
    width: 82,
  },
  lastCheckText: {
    ...typography.labelSm,
    color: palette.textMuted,
    fontWeight: '800',
  },
  pageIndicator: {
    ...typography.labelSm,
    color: palette.textSubtle,
    fontWeight: '800',
  },
  picColumn: {
    width: 116,
  },
  picText: {
    ...typography.labelSm,
    color: palette.text,
    fontWeight: '800',
  },
  paginationButton: {
    alignItems: 'center',
    backgroundColor: palette.primary,
    borderRadius: radius.md,
    minWidth: 80,
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
  },
  paginationButtonDisabled: {
    backgroundColor: '#F8FAF9',
    borderColor: '#D1DAD5',
    borderWidth: 1,
  },
  paginationButtonText: {
    ...typography.labelSm,
    color: palette.surface,
    fontWeight: '900',
  },
  paginationButtonTextDisabled: {
    color: palette.textSubtle,
  },
  paginationRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
  },
  pressed: {
    opacity: 0.84,
  },
  sectionTitle: {
    ...typography.bodyLg,
    color: palette.text,
    fontWeight: '900',
  },
  sectionBackground: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  sectionBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F7FBFA',
  },
  sectionCircuitDot: {
    backgroundColor: 'rgba(6, 78, 59, 0.16)',
    borderRadius: 999,
    height: 5,
    position: 'absolute',
    width: 5,
  },
  sectionCircuitDotOne: {
    right: 74,
    top: 70,
  },
  sectionCircuitDotTwo: {
    left: 72,
    top: 238,
  },
  sectionCircuitLine: {
    backgroundColor: 'rgba(6, 78, 59, 0.08)',
    height: 1,
    position: 'absolute',
  },
  sectionCircuitLineOne: {
    right: -18,
    top: 76,
    transform: [{ rotate: '0deg' }],
    width: 220,
  },
  sectionCircuitLineTwo: {
    left: -34,
    top: 264,
    transform: [{ rotate: '-42deg' }],
    width: 188,
  },
  sectionCircuitLineThree: {
    bottom: 42,
    right: -36,
    transform: [{ rotate: '-42deg' }],
    width: 230,
  },
  sectionDiagonalLarge: {
    backgroundColor: 'rgba(209, 250, 229, 0.42)',
    height: 430,
    position: 'absolute',
    right: -138,
    top: -42,
    transform: [{ rotate: '32deg' }],
    width: 170,
  },
  sectionDiagonalSmall: {
    backgroundColor: 'rgba(255, 255, 255, 0.68)',
    bottom: -64,
    height: 260,
    left: -88,
    position: 'absolute',
    transform: [{ rotate: '43deg' }],
    width: 160,
  },
  sectionDotMatrix: {
    backgroundColor: 'rgba(6, 78, 59, 0.05)',
    borderRadius: radius.md,
    height: 54,
    position: 'absolute',
    right: 92,
    top: 168,
    width: 54,
  },
  sectionHudRing: {
    borderColor: 'rgba(16, 185, 129, 0.16)',
    borderRadius: 999,
    borderWidth: 14,
    height: 110,
    position: 'absolute',
    right: -40,
    top: -28,
    width: 110,
  },
  sectionMintWashBottom: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderRadius: 999,
    bottom: -86,
    height: 188,
    left: -76,
    position: 'absolute',
    width: 208,
  },
  sectionMintWashTop: {
    backgroundColor: 'rgba(209, 250, 229, 0.56)',
    borderRadius: 999,
    height: 170,
    position: 'absolute',
    right: -74,
    top: 18,
    width: 180,
  },
  statusColumn: {
    alignItems: 'center',
    width: 76,
  },
  statusHeaderColumn: {
    textAlign: 'center',
    width: 76,
  },
  statusPill: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: radius.full,
    borderWidth: 1,
    minWidth: 66,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  statusPillText: {
    ...typography.labelSm,
    fontWeight: '900',
  },
  subCategoryCard: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderColor: '#D1DAD5',
    borderRadius: radius.lg,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center',
    minHeight: 34,
    paddingHorizontal: 6,
    paddingVertical: 5,
  },
  subCategoryCardSelected: {
    backgroundColor: palette.primarySoft,
    borderColor: palette.primary,
  },
  subCategoryLabel: {
    ...typography.labelSm,
    color: palette.primary,
    fontWeight: '900',
    textAlign: 'center',
  },
  subCategoryLabelSelected: {
    color: palette.primaryDark,
  },
  subCategoryRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  summaryLabel: {
    ...typography.bodyMd,
    flex: 1,
    fontWeight: '800',
  },
  summaryPanel: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderRadius: radius.lg,
    borderWidth: 0,
    flex: 1,
    gap: 6,
    paddingHorizontal: 2,
    paddingVertical: spacing.xs,
  },
  summaryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    minHeight: 22,
  },
  summaryRows: {
    gap: 4,
  },
  summaryValue: {
    color: palette.text,
    fontSize: 17,
    fontWeight: '900',
    lineHeight: 22,
  },
  tableHeader: {
    backgroundColor: '#F8FAF9',
    borderRadius: radius.md,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: spacing.xs,
    paddingVertical: 7,
  },
  tableToolbar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -2,
  },
  showDataButton: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: radius.sm,
    minWidth: 30,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  showDataButtonSelected: {
    backgroundColor: palette.primary,
  },
  showDataButtonText: {
    ...typography.labelSm,
    color: palette.textMuted,
    fontWeight: '900',
  },
  showDataButtonTextSelected: {
    color: palette.surface,
  },
  showDataLabel: {
    ...typography.labelSm,
    color: palette.textSubtle,
    fontWeight: '900',
  },
  showDataOptions: {
    backgroundColor: '#F8FAF9',
    borderColor: '#D1DAD5',
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 2,
    padding: 2,
  },
  tableHeaderText: {
    ...typography.labelSm,
    color: palette.textSubtle,
    fontWeight: '900',
  },
  tableContent: {
    minWidth: 426,
  },
  tableContentLaptop: {
    minWidth: 548,
  },
  tableRow: {
    alignItems: 'center',
    borderBottomColor: palette.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 4,
    minHeight: 48,
    paddingHorizontal: spacing.xs,
    paddingVertical: 7,
  },
  tableRows: {
    gap: 0,
  },
  tableScroll: {
    marginHorizontal: -2,
  },
  tableScrollContent: {
    paddingHorizontal: 2,
  },
});

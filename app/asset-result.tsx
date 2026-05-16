import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/app-screen';
import { assets } from '@/data/mock';
import { palette, radius, spacing, typography } from '@/constants/theme';

const formattedInspectionDate = '14 May 2026';

export default function AssetResultScreen() {
  const { assetId } = useLocalSearchParams<{ assetId?: string }>();
  const asset = assets.find((item) => item.id === assetId) ?? assets[0];

  return (
    <AppScreen scroll={false}>
      <View style={styles.screen}>
        <View style={styles.topBar}>
          <Text style={styles.headerTitle}>SCAN RESULT</Text>
        </View>

        <View style={styles.resultSection}>
          <View style={styles.successOuter}>
            <View style={styles.successBox}>
              <MaterialIcons name="check-circle-outline" size={52} color="#047857" />
            </View>
          </View>
          <Text style={styles.resultTitle}>Asset Identified</Text>
          <Text style={styles.resultSubtitle}>
            {asset.category} - {asset.name}
          </Text>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.detailsHeader}>
            <MaterialIcons name="info-outline" size={22} color={palette.primary} />
            <Text style={styles.detailsTitle}>ASSET DETAILS</Text>
          </View>

          <DetailRow
            icon="tag"
            label="Asset Code"
            value={asset.code}
            valueStyle="badge"
          />
          <DetailRow
            icon="pin"
            label="SN Number"
            value={asset.serialNumber}
          />
          <DetailRow
            icon="category"
            label="Category Inspection"
            value={asset.category}
          />
          <DetailRow
            icon="event-available"
            label="Date"
            value={formattedInspectionDate}
            valueStyle="success"
          />
        </View>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push({ pathname: '/inspection-form', params: { assetId: asset.id } })}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
            <Text style={styles.primaryButtonText}>START MONTHLY INSPECTION</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() =>
              router.push({ pathname: '/inspection-detail', params: { assetId: asset.id, returnTo: 'home' } })
            }
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
            <Text style={styles.secondaryButtonText}>VIEW LAST INSPECTION</Text>
          </Pressable>
        </View>
      </View>
    </AppScreen>
  );
}

function DetailRow({
  icon,
  label,
  value,
  valueStyle = 'default',
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string;
  valueStyle?: 'badge' | 'default' | 'success';
}) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailLabelGroup}>
        <MaterialIcons name={icon} size={21} color={palette.textMuted} />
        <Text style={styles.detailLabel}>{label}</Text>
      </View>
      {valueStyle === 'badge' ? (
        <View style={styles.codeBadge}>
          <Text style={styles.codeBadgeText}>{value}</Text>
        </View>
      ) : valueStyle === 'success' ? (
        <View style={styles.successValueGroup}>
          <View style={styles.successDot} />
          <Text style={styles.successValue}>{value}</Text>
        </View>
      ) : (
        <Text numberOfLines={1} style={styles.detailValue}>
          {value}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.xs,
    marginTop: 'auto',
  },
  codeBadge: {
    backgroundColor: palette.primarySoft,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
  },
  codeBadgeText: {
    ...typography.bodyMd,
    color: palette.text,
    fontWeight: '900',
  },
  detailLabel: {
    ...typography.labelMd,
    color: palette.textMuted,
    fontWeight: '900',
  },
  detailLabelGroup: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    minWidth: 0,
  },
  detailRow: {
    alignItems: 'center',
    borderTopColor: '#F8FAF9',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
    minHeight: 62,
    paddingHorizontal: spacing.md,
  },
  detailsCard: {
    backgroundColor: palette.surface,
    borderColor: '#D1DAD5',
    borderRadius: radius.xl,
    borderWidth: 1,
    elevation: 4,
    overflow: 'hidden',
    shadowColor: '#022C22',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
  },
  detailsHeader: {
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: 52,
    paddingHorizontal: spacing.md,
  },
  detailsTitle: {
    ...typography.labelMd,
    color: palette.primary,
    fontWeight: '900',
    letterSpacing: 1,
  },
  detailValue: {
    ...typography.labelMd,
    color: palette.text,
    flexShrink: 1,
    fontWeight: '900',
    maxWidth: 180,
    textAlign: 'right',
  },
  headerTitle: {
    color: palette.primary,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2.2,
    lineHeight: 24,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  pressed: {
    opacity: 0.82,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: palette.primary,
    borderRadius: radius.lg,
    elevation: 4,
    flexDirection: 'row',
    gap: spacing.sm,
    height: 54,
    justifyContent: 'center',
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
  },
  primaryButtonText: {
    ...typography.labelMd,
    color: palette.surface,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  resultSection: {
    alignItems: 'center',
    paddingBottom: spacing.lg,
    paddingTop: 38,
  },
  resultSubtitle: {
    ...typography.bodyLg,
    color: palette.textMuted,
    fontWeight: '600',
    lineHeight: 24,
    marginTop: 4,
    textAlign: 'center',
  },
  resultTitle: {
    color: palette.primary,
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 34,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  screen: {
    flex: 1,
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: '#F8FAF9',
    borderColor: '#D1DAD5',
    borderRadius: radius.lg,
    borderWidth: 1,
    elevation: 2,
    flexDirection: 'row',
    gap: spacing.xs,
    height: 52,
    justifyContent: 'center',
    shadowColor: '#022C22',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  secondaryButtonText: {
    ...typography.labelMd,
    color: palette.primary,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  successBox: {
    alignItems: 'center',
    backgroundColor: '#10B981',
    borderRadius: 13,
    height: 92,
    justifyContent: 'center',
    width: 92,
  },
  successDot: {
    backgroundColor: '#047857',
    borderRadius: radius.full,
    height: 10,
    width: 10,
  },
  successOuter: {
    backgroundColor: '#A7F3D0',
    borderRadius: 17,
    padding: 5,
  },
  successValue: {
    ...typography.labelMd,
    color: '#047857',
    fontWeight: '900',
  },
  successValueGroup: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  topBar: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
});

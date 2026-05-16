import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, InteractionManager, Linking, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/app-screen';
import { StatusBadge } from '@/components/ui/status-badge';
import { assets, inspections } from '@/data/mock';
import { palette, radius, shadows, spacing, typography } from '@/constants/theme';

const inspection = inspections[0];
const inspectionDate = '14 May 2026';
const lastLocation = {
  address: 'Biznet Branch Badung Nusa Dua',
  coordinates: '-8.8016, 115.2298',
  latitude: -8.8016,
  longitude: 115.2298,
};
const detailRows = [
  { label: 'Inspector Name', value: inspection.inspector, icon: 'person' },
  { label: 'Notes', value: inspection.notes, icon: 'notes' },
] as const;

const gallery = [
  { id: 'front', title: 'Front View', caption: 'Outer casing evidence', icon: 'photo-camera' },
  { id: 'serial', title: 'Serial Plate', caption: 'Asset identity verification', icon: 'badge' },
  { id: 'damage', title: 'Damage Area', caption: 'Minor crack documentation', icon: 'report-problem' },
] as const;

type DetectedLocation = {
  address: string;
  coordinates: string;
  latitude: number;
  longitude: number;
};

export default function InspectionDetailScreen() {
  const { assetId, returnTo } = useLocalSearchParams<{ assetId?: string; returnTo?: string }>();
  const asset = assets.find((item) => item.id === assetId) ?? assets[4] ?? assets[0];
  const [previewPhoto, setPreviewPhoto] = useState<(typeof gallery)[number] | null>(null);
  const [detectedLocation, setDetectedLocation] = useState<DetectedLocation | null>(null);
  const [locationStatus, setLocationStatus] = useState<'loading' | 'ready' | 'denied' | 'error'>('loading');
  const shouldShowHomeShortcut = returnTo === 'home';

  useEffect(() => {
    let isMounted = true;

    const detectLocation = async () => {
      try {
        setLocationStatus('loading');
        const permission = await Location.requestForegroundPermissionsAsync();

        if (permission.status !== Location.PermissionStatus.GRANTED) {
          if (isMounted) {
            setLocationStatus('denied');
          }
          return;
        }

        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const { latitude, longitude } = position.coords;
        const addressResult = await Location.reverseGeocodeAsync({ latitude, longitude });

        if (isMounted) {
          setDetectedLocation({
            address: formatAddress(addressResult[0]),
            coordinates: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            latitude,
            longitude,
          });
          setLocationStatus('ready');
        }
      } catch {
        if (isMounted) {
          setLocationStatus('error');
        }
      }
    };

    const task = InteractionManager.runAfterInteractions(() => {
      void detectLocation();
    });

    return () => {
      isMounted = false;
      task.cancel();
    };
  }, []);

  const displayedLocation = detectedLocation ?? lastLocation;
  const googleMapsUrl = getGoogleMapsUrl(displayedLocation.latitude, displayedLocation.longitude);
  const handleShareReport = () => {
    Alert.alert('Share Report', 'Inspection report is ready to share.');
  };
  const handleDownloadReport = () => {
    Alert.alert('Download Report', 'Inspection report download has been prepared.');
  };
  const handleGoHome = () => {
    router.replace('/');
  };

  return (
    <AppScreen edges={['top', 'left', 'right']} scroll={false}>
      <View style={styles.screenRoot}>
      <View style={styles.navbar}>
        <View style={styles.navbarLeft}>
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            onPress={() => router.back()}
            style={({ pressed }) => [styles.navIconButton, pressed && styles.pressed]}>
            <MaterialIcons name="arrow-back-ios-new" size={21} color={palette.primary} />
          </Pressable>
          {shouldShowHomeShortcut ? (
            <Pressable
              accessibilityLabel="Go to home"
              accessibilityRole="button"
              onPress={handleGoHome}
              style={({ pressed }) => [styles.navIconButton, pressed && styles.pressed]}>
              <MaterialIcons name="home" size={22} color={palette.primary} />
            </Pressable>
          ) : null}
        </View>
        <Text style={styles.navbarTitle}>Inspection Detail</Text>
        <View style={styles.navbarActions}>
          <Pressable
            accessibilityLabel="Share report"
            accessibilityRole="button"
            onPress={handleShareReport}
            style={({ pressed }) => [styles.navIconButton, pressed && styles.pressed]}>
            <MaterialIcons name="ios-share" size={21} color={palette.primary} />
          </Pressable>
          <Pressable
            accessibilityLabel="Download report"
            accessibilityRole="button"
            onPress={handleDownloadReport}
            style={({ pressed }) => [styles.navIconButton, pressed && styles.pressed]}>
            <MaterialIcons name="file-download" size={22} color={palette.primary} />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View style={styles.heroIcon}>
            <MaterialIcons name="fact-check" size={24} color={palette.surface} />
          </View>
          <View style={styles.heroCopy}>
            <Text style={styles.kicker}>{inspectionDate}</Text>
            <Text style={styles.title}>Weekly Inspection</Text>
          </View>
        </View>

        <View style={styles.assetCard}>
          <View style={styles.assetBadge}>
            <MaterialIcons name="memory" size={20} color={palette.primary} />
          </View>
          <View style={styles.assetCopy}>
            <Text style={styles.assetCode}>{asset.code}</Text>
            <Text style={styles.assetName}>{asset.name}</Text>
            <Text style={styles.assetMeta}>{asset.category} - SN {asset.serialNumber}</Text>
            <Text style={styles.assetBranch}>{asset.branch}</Text>
          </View>
        </View>

        <View style={styles.statusRow}>
          <StatusBadge label={inspection.condition} surface="white" />
          <StatusBadge label={inspection.reviewStatus} surface="white" />
        </View>
      </View>

      <View style={styles.gallerySection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Photo Gallery</Text>
          <Text style={styles.sectionMeta}>{gallery.length} photos</Text>
        </View>
        <ScrollView
          contentContainerStyle={styles.carouselContent}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.carousel}>
          {gallery.map((photo, index) => (
            <Pressable
              accessibilityLabel={`Open ${photo.title} preview`}
              accessibilityRole="button"
              key={photo.id}
              onPress={() => setPreviewPhoto(photo)}
              style={({ pressed }) => [styles.photoSlide, pressed && styles.pressed]}>
              <View style={styles.photoArtwork}>
                <MaterialIcons name={photo.icon} size={42} color={palette.primary} />
              </View>
              <View style={styles.photoFooter}>
                <View>
                  <Text style={styles.photoTitle}>{photo.title}</Text>
                  <Text style={styles.photoCaption}>{photo.caption}</Text>
                </View>
                <Text style={styles.photoIndex}>{index + 1}/{gallery.length}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.detailCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Inspection Information</Text>
          <Text style={styles.sectionMeta}>Submitted record</Text>
        </View>
        <View style={styles.detailList}>
          {detailRows.map((row) => (
            <InfoRow key={row.label} icon={row.icon} label={row.label} value={row.value} />
          ))}
        </View>
      </View>

      <View style={styles.locationCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Last Location</Text>
          <Text style={styles.sectionMeta}>Google Maps</Text>
        </View>
        <Pressable
          accessibilityLabel="Open last location in Google Maps"
          accessibilityRole="link"
          onPress={() => Linking.openURL(googleMapsUrl)}
          style={({ pressed }) => [styles.mapPreview, pressed && styles.pressed]}>
          <View style={styles.mapParkTop} />
          <View style={styles.mapParkBottom} />
          <View style={styles.mapWater} />
          <View style={styles.mapGridHorizontal} />
          <View style={styles.mapGridVertical} />
          <View style={styles.mapRoadPrimary} />
          <View style={styles.mapRoadSecondary} />
          <View style={styles.mapRoadTertiary} />
          <View style={styles.mapPin}>
            <MaterialIcons name="location-on" size={26} color={palette.danger} />
          </View>
          <View style={styles.mapLabel}>
            <Text style={styles.mapLabelTitle}>{getLocationTitle(locationStatus, displayedLocation.address)}</Text>
            <Text style={styles.mapLabelText}>{displayedLocation.coordinates}</Text>
          </View>
          <View style={styles.mapOpenBadge}>
            <MaterialIcons name="open-in-new" size={14} color={palette.primary} />
            <Text style={styles.mapOpenText}>Open Maps</Text>
          </View>
        </Pressable>
        <View style={styles.locationStatusRow}>
          <MaterialIcons name={getLocationIcon(locationStatus)} size={18} color={getLocationColor(locationStatus)} />
          <Text style={styles.locationStatusText}>{getLocationMessage(locationStatus)}</Text>
        </View>
      </View>

      </ScrollView>

      <PhotoPreviewModal photo={previewPhoto} onClose={() => setPreviewPhoto(null)} />
      </View>
    </AppScreen>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <MaterialIcons name={icon} size={18} color={palette.primary} />
      </View>
      <View style={styles.infoCopy}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function PhotoPreviewModal({
  onClose,
  photo,
}: {
  onClose: () => void;
  photo: (typeof gallery)[number] | null;
}) {
  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={photo !== null}>
      <View style={styles.previewRoot}>
        <Pressable accessibilityLabel="Close photo preview" style={styles.previewBackdrop} onPress={onClose} />
        <View style={styles.previewCard}>
          <Pressable accessibilityLabel="Close photo preview" accessibilityRole="button" onPress={onClose} style={styles.previewClose}>
            <MaterialIcons name="close" size={22} color={palette.surface} />
          </Pressable>
          <View style={styles.previewImage}>
            <MaterialIcons name={photo?.icon ?? 'image'} size={74} color={palette.primary} />
          </View>
          <View style={styles.previewFooter}>
            <Text style={styles.previewTitle}>{photo?.title}</Text>
            <Text style={styles.previewCaption}>{photo?.caption}</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function formatAddress(address?: Location.LocationGeocodedAddress) {
  if (!address) {
    return 'Detected location';
  }

  return [
    address.name,
    address.street,
    address.district,
    address.city,
    address.region,
    address.postalCode,
  ]
    .filter(Boolean)
    .join(', ') || 'Detected location';
}

function getGoogleMapsUrl(latitude: number, longitude: number) {
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
}

function getLocationIcon(status: 'loading' | 'ready' | 'denied' | 'error') {
  if (status === 'ready') {
    return 'check-circle' as const;
  }

  if (status === 'denied' || status === 'error') {
    return 'error-outline' as const;
  }

  return 'my-location' as const;
}

function getLocationColor(status: 'loading' | 'ready' | 'denied' | 'error') {
  if (status === 'ready') {
    return palette.secondary;
  }

  if (status === 'denied' || status === 'error') {
    return palette.danger;
  }

  return palette.primary;
}

function getLocationTitle(status: 'loading' | 'ready' | 'denied' | 'error', address: string) {
  if (status === 'loading') {
    return 'Detecting location...';
  }

  if (status === 'denied') {
    return lastLocation.address;
  }

  if (status === 'error') {
    return lastLocation.address;
  }

  return address;
}

function getLocationMessage(status: 'loading' | 'ready' | 'denied' | 'error') {
  if (status === 'loading') {
    return 'Reading device GPS for the latest location.';
  }

  if (status === 'denied') {
    return 'Location permission denied. Showing saved inspection location.';
  }

  if (status === 'error') {
    return 'Unable to detect current GPS. Showing saved inspection location.';
  }

  return 'Location synchronized from device GPS.';
}

const styles = StyleSheet.create({
  carousel: {
    marginHorizontal: -spacing.md,
    paddingHorizontal: spacing.md,
  },
  carouselContent: {
    gap: spacing.sm,
    paddingRight: spacing.md,
  },
  content: {
    gap: spacing.md,
    paddingBottom: spacing.md,
    paddingTop: spacing.xs,
  },
  assetBadge: {
    alignItems: 'center',
    backgroundColor: palette.primarySoft,
    borderRadius: radius.lg,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  assetBranch: {
    ...typography.labelSm,
    color: palette.textMuted,
    fontWeight: '800',
    lineHeight: 15,
  },
  assetCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderRadius: radius.xl,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 10,
  },
  assetCode: {
    ...typography.labelSm,
    color: palette.primary,
    fontWeight: '900',
    letterSpacing: 0.2,
    lineHeight: 15,
  },
  assetCopy: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },
  assetMeta: {
    ...typography.labelSm,
    color: palette.text,
    fontWeight: '800',
    lineHeight: 15,
  },
  assetName: {
    ...typography.bodyMd,
    color: palette.text,
    fontWeight: '900',
    lineHeight: 18,
  },
  detailCard: {
    ...shadows.floating,
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: radius.xl,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.md,
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  detailList: {
    gap: spacing.xs,
  },
  gallerySection: {
    gap: spacing.sm,
  },
  heroCard: {
    ...shadows.floating,
    backgroundColor: palette.primary,
    borderRadius: 20,
    gap: spacing.md,
    padding: spacing.md,
    shadowColor: '#022C22',
    shadowOpacity: 0.12,
    shadowRadius: 14,
  },
  heroCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  heroIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: radius.lg,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  heroTop: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  infoCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  infoIcon: {
    alignItems: 'center',
    backgroundColor: palette.primarySoft,
    borderRadius: radius.md,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  infoLabel: {
    ...typography.bodyMd,
    color: palette.textSubtle,
    fontWeight: '900',
    lineHeight: 18,
  },
  infoRow: {
    alignItems: 'flex-start',
    borderBottomColor: palette.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: 54,
    paddingVertical: spacing.sm,
  },
  infoValue: {
    ...typography.bodyMd,
    color: palette.text,
    fontWeight: '500',
  },
  kicker: {
    ...typography.labelSm,
    color: '#A7F3D0',
    fontWeight: '900',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  locationCard: {
    ...shadows.floating,
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: radius.xl,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md,
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  locationStatusRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  locationStatusText: {
    ...typography.labelSm,
    color: palette.textSubtle,
    flex: 1,
    fontWeight: '700',
  },
  mapGridHorizontal: {
    backgroundColor: 'rgba(6, 78, 59, 0.12)',
    height: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 58,
  },
  mapGridVertical: {
    backgroundColor: 'rgba(6, 78, 59, 0.12)',
    bottom: 0,
    left: 132,
    position: 'absolute',
    top: 0,
    width: 1,
  },
  mapLabel: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: radius.lg,
    bottom: spacing.sm,
    left: spacing.sm,
    maxWidth: '78%',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    position: 'absolute',
  },
  mapLabelText: {
    ...typography.labelSm,
    color: palette.textSubtle,
    fontWeight: '700',
  },
  mapLabelTitle: {
    ...typography.labelSm,
    color: palette.primary,
    fontWeight: '900',
  },
  mapPin: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: radius.full,
    height: 36,
    justifyContent: 'center',
    left: '52%',
    position: 'absolute',
    top: '32%',
    width: 36,
  },
  mapPreview: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7B4AE',
    borderRadius: radius.xl,
    borderWidth: 1,
    height: 156,
    overflow: 'hidden',
    position: 'relative',
  },
  mapOpenBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderRadius: radius.full,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: spacing.xs,
    paddingVertical: 5,
    position: 'absolute',
    right: spacing.sm,
    top: spacing.sm,
  },
  mapOpenText: {
    ...typography.labelSm,
    color: palette.primary,
    fontWeight: '900',
  },
  mapParkBottom: {
    backgroundColor: '#DDF4E8',
    borderRadius: radius.xl,
    bottom: -14,
    height: 78,
    left: -12,
    position: 'absolute',
    transform: [{ rotate: '-10deg' }],
    width: 130,
  },
  mapParkTop: {
    backgroundColor: '#DDF4E8',
    borderRadius: radius.xl,
    height: 74,
    position: 'absolute',
    right: -20,
    top: -18,
    transform: [{ rotate: '16deg' }],
    width: 150,
  },
  mapRoadPrimary: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.full,
    height: 13,
    left: -18,
    position: 'absolute',
    right: 34,
    top: 86,
    transform: [{ rotate: '-9deg' }],
  },
  mapRoadSecondary: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.full,
    bottom: 30,
    height: 11,
    left: 118,
    position: 'absolute',
    right: -8,
    transform: [{ rotate: '22deg' }],
  },
  mapRoadTertiary: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.full,
    height: 9,
    left: 78,
    position: 'absolute',
    right: 72,
    top: 42,
    transform: [{ rotate: '32deg' }],
  },
  mapWater: {
    backgroundColor: '#D1FAE5',
    borderRadius: radius.xl,
    bottom: 18,
    height: 48,
    position: 'absolute',
    right: -8,
    transform: [{ rotate: '-18deg' }],
    width: 120,
  },
  photoArtwork: {
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderColor: '#A7B4AE',
    borderRadius: radius.xl,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
  },
  photoCaption: {
    ...typography.labelSm,
    color: palette.textSubtle,
    fontWeight: '700',
  },
  photoFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  photoIndex: {
    ...typography.labelSm,
    color: palette.primary,
    fontWeight: '900',
  },
  photoSlide: {
    ...shadows.floating,
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: radius.xl,
    borderWidth: 1,
    gap: spacing.sm,
    height: 190,
    padding: spacing.sm,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    width: 292,
  },
  photoTitle: {
    ...typography.bodyMd,
    color: palette.text,
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.82,
  },
  navbar: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    minHeight: 38,
  },
  navbarActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 2,
    justifyContent: 'flex-end',
    width: 88,
  },
  navbarLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 2,
    width: 88,
  },
  navbarTitle: {
    color: palette.text,
    flex: 1,
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 22,
    textAlign: 'center',
  },
  navIconButton: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: radius.full,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  screenRoot: {
    flex: 1,
    gap: 0,
    minHeight: 0,
  },
  previewBackdrop: {
    backgroundColor: 'rgba(31, 41, 55, 0.64)',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  previewCaption: {
    ...typography.bodyMd,
    color: palette.textSubtle,
    fontWeight: '700',
    textAlign: 'center',
  },
  previewCard: {
    width: '88%',
    gap: spacing.sm,
  },
  previewClose: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: radius.full,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  previewFooter: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderRadius: radius.xl,
    gap: 3,
    padding: spacing.sm,
  },
  previewImage: {
    alignItems: 'center',
    aspectRatio: 1,
    backgroundColor: '#ECFDF5',
    borderColor: '#A7B4AE',
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: 'center',
    width: '100%',
  },
  previewRoot: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  previewTitle: {
    ...typography.bodyLg,
    color: palette.text,
    fontWeight: '900',
    textAlign: 'center',
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionMeta: {
    ...typography.labelSm,
    color: palette.textSubtle,
    fontWeight: '800',
  },
  sectionTitle: {
    ...typography.bodyLg,
    color: palette.text,
    fontWeight: '900',
  },
  statusRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  title: {
    ...typography.headlineSm,
    color: palette.surface,
    fontWeight: '900',
  },
});

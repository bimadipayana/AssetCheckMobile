import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, InteractionManager, Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppScreen } from '@/components/app-screen';
import { assets, currentUser } from '@/data/mock';
import { palette, radius, shadows, spacing, typography } from '@/constants/theme';

const conditions = ['Good', 'Minor Damage', 'Major Damage', 'Missing'];
const inspectionDate = '14 May 2026';
const currentLocation = {
  address: 'Biznet Branch Badung Nusa Dua',
  coordinates: '-8.8016, 115.2298',
  latitude: -8.8016,
  longitude: 115.2298,
};
const maxNotesLength = 300;

type DetectedLocation = {
  address: string;
  coordinates: string;
  latitude: number;
  longitude: number;
};

export default function InspectionFormScreen() {
  const { assetId } = useLocalSearchParams<{ assetId?: string }>();
  const asset = assets.find((item) => item.id === assetId) ?? assets[0];
  const [selectedCondition, setSelectedCondition] = useState('');
  const [notes, setNotes] = useState('');
  const [detectedLocation, setDetectedLocation] = useState<DetectedLocation | null>(null);
  const [locationStatus, setLocationStatus] = useState<'loading' | 'ready' | 'denied' | 'error'>('loading');

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
        const address = formatAddress(addressResult[0]);

        if (isMounted) {
          setDetectedLocation({
            address,
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

  const displayedLocation = detectedLocation ?? currentLocation;
  const googleMapsUrl = getGoogleMapsUrl(displayedLocation.latitude, displayedLocation.longitude);
  const handleSaveDraft = () => {
    Alert.alert('Draft Saved', 'Inspection draft is ready to sync when backend storage is connected.');
  };
  const handleSubmit = () => {
    if (!selectedCondition) {
      Alert.alert('Condition Required', 'Please select the asset condition before submitting the inspection.');
      return;
    }

    Alert.alert('Inspection Submitted', 'Inspection data is ready for backend submission.');
    router.push({ pathname: '/inspection-detail', params: { assetId: asset.id } });
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
          </View>
          <Text style={styles.navbarTitle}>Weekly Inspection</Text>
          <View style={styles.navbarRightSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          style={styles.formScroll}>
          <View style={styles.headerCard}>
            <View style={styles.headerTop}>
              <View style={styles.headerIcon}>
                <MaterialIcons name="fact-check" size={24} color={palette.surface} />
              </View>
              <View style={styles.headerCopy}>
                <Text style={styles.kicker}>{inspectionDate}</Text>
                <Text style={styles.title}>Weekly Inspection</Text>
              </View>
            </View>

            <View style={styles.assetCard}>
              <View style={styles.assetBadge}>
                <MaterialIcons name="memory" size={20} color={palette.primary} />
              </View>
              <View style={styles.assetCopy}>
                <Text style={styles.assetNumber}>{asset.code}</Text>
                <Text style={styles.assetDescription}>{asset.name}</Text>
                <Text style={styles.assetTypeSerial}>{asset.category} - SN {asset.serialNumber}</Text>
                <Text style={styles.assetBranch}>{asset.branch}</Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <SectionTitle icon="assignment-ind" title="Inspection Details" />
            <LastInspectorButton assetId={asset.id} />
            <ReadOnlyField icon="verified-user" label="Inspector" value={currentUser.fullName} />
          </View>

          <View style={styles.sectionCard}>
            <SectionTitle icon="tune" title="Asset Condition" />
            <ScrollView
              contentContainerStyle={styles.conditionGrid}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.conditionScroll}>
              {conditions.map((condition) => {
                const isActive = selectedCondition === condition;

                return (
                  <Pressable
                    accessibilityRole="button"
                    key={condition}
                    onPress={() => setSelectedCondition(condition)}
                    style={({ pressed }) => [styles.conditionChip, isActive && styles.activeChip, pressed && styles.pressed]}>
                    <Text style={[styles.conditionText, isActive && styles.activeConditionText]}>{condition}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

      <View style={styles.sectionCard}>
        <SectionTitle icon="notes" title="Inspection Notes" />
        <View style={styles.notesField}>
          <TextInput
            maxLength={maxNotesLength}
            multiline
            onChangeText={(text) => setNotes(text.slice(0, maxNotesLength))}
            placeholder="Add findings, damage details, or missing asset context"
            placeholderTextColor={palette.textSubtle}
            scrollEnabled={false}
            style={styles.notesInput}
            textAlignVertical="top"
            value={notes}
          />
          <Text style={styles.notesCounter}>
            {notes.length}/{maxNotesLength}
          </Text>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <SectionTitle icon="add-a-photo" title="Photo Evidence" />
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push({ pathname: '/photo-upload', params: { assetId: asset.id } })}
          style={({ pressed }) => [styles.photoButton, pressed && styles.pressed]}>
          <View style={styles.photoIcon}>
            <MaterialIcons name="attachment" size={22} color={palette.primary} />
          </View>
          <View style={styles.photoCopy}>
            <Text style={styles.photoTitle}>Add Photo Evidence</Text>
            <Text style={styles.photoText}>Attach visual proof for this asset inspection</Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={palette.textSubtle} />
        </Pressable>
      </View>

      <View style={styles.sectionCard}>
        <SectionTitle icon="my-location" title="Current Location" />
        <Pressable
          accessibilityLabel="Open current location in Google Maps"
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
            <Text style={styles.mapLabelTitle}>Google Maps Preview</Text>
            <Text style={styles.mapLabelText}>{displayedLocation.coordinates}</Text>
          </View>
          <View style={styles.mapOpenBadge}>
            <MaterialIcons name="open-in-new" size={14} color={palette.primary} />
            <Text style={styles.mapOpenText}>Open Maps</Text>
          </View>
        </Pressable>

        <View style={styles.locationInfo}>
          <View style={styles.locationStatusIcon}>
            <MaterialIcons name={getLocationIcon(locationStatus)} size={20} color={getLocationColor(locationStatus)} />
          </View>
          <View style={styles.locationCopy}>
            <Text style={styles.locationTitle}>{getLocationTitle(locationStatus, displayedLocation.address)}</Text>
            <Text style={styles.locationText}>{getLocationMessage(locationStatus)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityLabel="Save draft inspection"
          accessibilityRole="button"
          onPress={handleSaveDraft}
          style={({ pressed }) => [styles.draftButton, pressed && styles.pressed]}>
          <MaterialIcons name="save" size={20} color={palette.primary} />
          <Text style={styles.draftButtonText}>Save Draft</Text>
        </Pressable>
        <Pressable
          accessibilityLabel="Submit final inspection"
          accessibilityRole="button"
          onPress={handleSubmit}
          style={({ pressed }) => [styles.submitButton, pressed && styles.pressed]}>
          <MaterialIcons name="send" size={20} color={palette.surface} />
          <Text style={styles.submitButtonText}>Submit Final Inspection</Text>
        </Pressable>
      </View>
        </ScrollView>

      </View>
    </AppScreen>
  );
}

function SectionTitle({ icon, title }: { icon: keyof typeof MaterialIcons.glyphMap; title: string }) {
  return (
    <View style={styles.sectionTitleRow}>
      <View style={styles.sectionIcon}>
        <MaterialIcons name={icon} size={18} color={palette.primary} />
      </View>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function LastInspectorButton({ assetId }: { assetId: string }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push({ pathname: '/inspection-detail', params: { assetId } })}
      style={({ pressed }) => [styles.lastInspectorButton, pressed && styles.pressed]}>
      <MaterialIcons name="history" size={20} color={palette.primary} />
      <View style={styles.fieldCopy}>
        <Text style={styles.fieldLabel}>Last Inspector</Text>
        <Text style={styles.lastInspectorText}>M. Chen</Text>
      </View>
      <MaterialIcons name="chevron-right" size={22} color={palette.textSubtle} />
    </Pressable>
  );
}

function ReadOnlyField({
  icon,
  label,
  value,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.readOnlyField}>
      <MaterialIcons name={icon} size={19} color={palette.textSubtle} />
      <View style={styles.fieldCopy}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <TextInput editable={false} selectTextOnFocus={false} style={styles.readOnlyInput} value={value} />
      </View>
      <MaterialIcons name="lock" size={16} color={palette.textSubtle} />
    </View>
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
    return 'Detecting current location...';
  }

  if (status === 'denied') {
    return 'Location permission denied';
  }

  if (status === 'error') {
    return 'Unable to detect location';
  }

  return address;
}

function getLocationMessage(status: 'loading' | 'ready' | 'denied' | 'error') {
  if (status === 'loading') {
    return 'Please wait while GPS finds your current position.';
  }

  if (status === 'denied') {
    return 'Enable location permission on your phone to attach the inspection location.';
  }

  if (status === 'error') {
    return 'Check GPS signal or network connection, then reopen this page.';
  }

  return 'Location detected automatically from device GPS.';
}

function getGoogleMapsUrl(latitude: number, longitude: number) {
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
}

const styles = StyleSheet.create({
  actions: {
    backgroundColor: palette.background,
    flexDirection: 'row',
    gap: spacing.sm,
    marginHorizontal: -spacing.md,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  activeChip: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  activeConditionText: {
    color: palette.surface,
  },
  content: {
    gap: spacing.md,
    paddingBottom: spacing.sm,
    paddingTop: spacing.xs,
  },
  screenRoot: {
    flex: 1,
    gap: 0,
    minHeight: 0,
  },
  navbar: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    minHeight: 38,
  },
  navbarLeft: {
    alignItems: 'flex-start',
    width: 88,
  },
  navbarRightSpacer: {
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
  assetBadge: {
    alignItems: 'center',
    backgroundColor: palette.primarySoft,
    borderRadius: radius.lg,
    height: 42,
    justifyContent: 'center',
    width: 42,
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
  assetCopy: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },
  assetBranch: {
    ...typography.labelSm,
    color: palette.textMuted,
    fontWeight: '800',
    lineHeight: 15,
  },
  assetDescription: {
    ...typography.bodyMd,
    color: palette.text,
    fontWeight: '900',
    lineHeight: 18,
  },
  assetNumber: {
    ...typography.labelSm,
    color: palette.primary,
    fontWeight: '900',
    letterSpacing: 0.2,
    lineHeight: 15,
  },
  assetTypeSerial: {
    ...typography.labelSm,
    color: palette.text,
    fontWeight: '800',
    lineHeight: 15,
  },
  conditionChip: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderColor: '#D1DAD5',
    borderRadius: radius.full,
    borderWidth: 1,
    minHeight: 34,
    paddingHorizontal: spacing.sm,
    justifyContent: 'center',
  },
  conditionGrid: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    paddingRight: spacing.md,
  },
  conditionScroll: {
    flexGrow: 0,
    height: 36,
    marginRight: -spacing.md,
    maxHeight: 36,
  },
  conditionText: {
    ...typography.labelSm,
    color: palette.textMuted,
    fontWeight: '900',
  },
  draftButton: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderColor: 'rgba(6, 78, 59, 0.12)',
    borderRadius: radius.lg,
    borderWidth: 1,
    elevation: 1,
    flex: 0.9,
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
    minHeight: 50,
    paddingHorizontal: spacing.sm,
    shadowColor: '#022C22',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  draftButtonText: {
    ...typography.bodyMd,
    color: palette.primary,
    fontWeight: '900',
  },
  fieldCopy: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },
  fieldLabel: {
    ...typography.labelSm,
    color: palette.textSubtle,
    fontWeight: '800',
  },
  formScroll: {
    flex: 1,
  },
  headerCard: {
    ...shadows.floating,
    backgroundColor: palette.primary,
    borderRadius: 20,
    gap: spacing.md,
    overflow: 'hidden',
    padding: spacing.md,
    shadowColor: '#022C22',
    shadowOpacity: 0.12,
    shadowRadius: 14,
  },
  headerCopy: {
    flex: 1,
  },
  headerIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: radius.lg,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  headerTop: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  input: {
    ...typography.bodyMd,
    backgroundColor: '#F8FAF9',
    borderColor: '#D1DAD5',
    borderRadius: radius.lg,
    borderWidth: 1,
    color: palette.text,
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
  kicker: {
    ...typography.labelSm,
    color: '#A7F3D0',
    fontWeight: '900',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  locationCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  locationInfo: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  locationStatusIcon: {
    alignItems: 'center',
    backgroundColor: palette.primarySoft,
    borderRadius: radius.lg,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  locationText: {
    ...typography.labelSm,
    color: palette.textSubtle,
    fontWeight: '700',
  },
  locationTitle: {
    ...typography.bodyMd,
    color: palette.text,
    fontWeight: '900',
  },
  lastInspectorButton: {
    alignItems: 'center',
    backgroundColor: '#F8FAF9',
    borderColor: '#D1DAD5',
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: 58,
    paddingHorizontal: spacing.sm,
  },
  lastInspectorText: {
    ...typography.bodyMd,
    color: palette.primary,
    fontWeight: '900',
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
  photoButton: {
    alignItems: 'center',
    backgroundColor: '#F8FAF9',
    borderColor: '#D1DAD5',
    borderRadius: radius.xl,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: 68,
    paddingHorizontal: spacing.md,
  },
  notesCounter: {
    ...typography.labelSm,
    alignSelf: 'flex-end',
    color: palette.textSubtle,
    fontWeight: '800',
    paddingBottom: spacing.xs,
    paddingRight: spacing.sm,
  },
  notesField: {
    backgroundColor: '#F8FAF9',
    borderColor: '#D1DAD5',
    borderRadius: radius.lg,
    borderWidth: 1,
    height: 172,
    overflow: 'hidden',
  },
  notesInput: {
    ...typography.bodyMd,
    color: palette.text,
    flex: 1,
    height: 140,
    lineHeight: 20,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  photoCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  photoIcon: {
    alignItems: 'center',
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  photoText: {
    ...typography.labelSm,
    color: palette.textSubtle,
    fontWeight: '700',
  },
  photoTitle: {
    ...typography.bodyMd,
    color: palette.text,
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.82,
  },
  readOnlyField: {
    alignItems: 'center',
    backgroundColor: '#F8FAF9',
    borderColor: '#D1DAD5',
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: 58,
    paddingHorizontal: spacing.sm,
  },
  readOnlyInput: {
    ...typography.bodyMd,
    color: palette.text,
    fontWeight: '800',
    padding: 0,
  },
  sectionCard: {
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
  sectionIcon: {
    alignItems: 'center',
    backgroundColor: palette.primarySoft,
    borderRadius: radius.md,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  sectionTitle: {
    ...typography.bodyMd,
    color: palette.text,
    fontWeight: '900',
  },
  sectionTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: palette.primary,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderRadius: radius.lg,
    elevation: 1,
    flex: 1.35,
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
    minHeight: 50,
    paddingHorizontal: spacing.sm,
    shadowColor: palette.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  submitButtonText: {
    ...typography.bodyMd,
    color: palette.surface,
    fontWeight: '900',
  },
  textArea: {
    minHeight: 104,
    paddingTop: spacing.sm,
  },
  title: {
    ...typography.headlineSm,
    color: palette.surface,
    fontWeight: '900',
  },
});

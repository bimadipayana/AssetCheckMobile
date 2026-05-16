import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/app-screen';
import { palette, radius, shadows, spacing, typography } from '@/constants/theme';

type PhotoKey = 'front' | 'serial' | 'damage';

type PhotoRequirement = {
  key: PhotoKey;
  title: string;
  caption: string;
  icon: keyof typeof MaterialIcons.glyphMap;
};

const photoRequirements: PhotoRequirement[] = [
  {
    key: 'front',
    title: 'Front View',
    caption: 'Capture the full front side of the asset clearly.',
    icon: 'crop-original',
  },
  {
    key: 'serial',
    title: 'Serial Number',
    caption: 'Capture the serial label so the number is readable.',
    icon: 'tag',
  },
  {
    key: 'damage',
    title: 'Damage Detail',
    caption: 'Capture close-up evidence of visible damage.',
    icon: 'report-problem',
  },
];

const emptyPhotos: Record<PhotoKey, string | null> = {
  front: null,
  serial: null,
  damage: null,
};

export default function PhotoUploadScreen() {
  const { assetId } = useLocalSearchParams<{ assetId?: string }>();
  const [permission, requestPermission] = useCameraPermissions();
  const [photos, setPhotos] = useState(emptyPhotos);
  const [activePhotoType, setActivePhotoType] = useState<PhotoKey | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const cameraRef = useRef<CameraView>(null);

  const completedCount = photoRequirements.filter((item) => photos[item.key]).length;
  const allPhotosCompleted = completedCount === photoRequirements.length;
  const activeRequirement = photoRequirements.find((item) => item.key === activePhotoType);

  const openCamera = async (photoType: PhotoKey) => {
    setCameraError('');
    setCameraReady(false);
    setActivePhotoType(photoType);

    if (!permission?.granted && permission?.canAskAgain !== false) {
      await requestPermission();
    }
  };

  const closeCamera = () => {
    setActivePhotoType(null);
    setCameraReady(false);
    setCapturing(false);
  };

  const capturePhoto = async () => {
    if (!activePhotoType || !cameraReady || capturing) {
      return;
    }

    try {
      setCapturing(true);
      const photo = await cameraRef.current?.takePictureAsync({
        quality: 0.82,
      });

      if (photo?.uri) {
        setPhotos((current) => ({
          ...current,
          [activePhotoType]: photo.uri,
        }));
        closeCamera();
      }
    } catch {
      setCameraError('Unable to capture photo. Please try again.');
    } finally {
      setCapturing(false);
    }
  };

  const permissionDenied = permission && !permission.granted && !permission.canAskAgain;

  return (
    <AppScreen>
      <View style={styles.headerCard}>
        <View style={styles.headerIcon}>
          <MaterialIcons name="attachment" size={24} color={palette.surface} />
        </View>
        <View style={styles.headerCopy}>
          <Text style={styles.kicker}>Photo Evidence</Text>
          <Text style={styles.title}>Capture Required Photos</Text>
          <Text style={styles.headerCaption}>{completedCount}/3 evidence photos completed</Text>
        </View>
      </View>

      <View style={styles.photoList}>
        {photoRequirements.map((item) => (
          <PhotoEvidenceSection
            key={item.key}
            photoUri={photos[item.key]}
            requirement={item}
            onPress={() => openCamera(item.key)}
          />
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        disabled={!allPhotosCompleted}
        onPress={() => router.push({ pathname: '/inspection-form', params: assetId ? { assetId } : undefined })}
        style={({ pressed }) => [
          styles.continueButton,
          !allPhotosCompleted && styles.continueButtonDisabled,
          pressed && allPhotosCompleted && styles.pressed,
        ]}>
        <MaterialIcons name="check" size={20} color={allPhotosCompleted ? palette.surface : palette.textSubtle} />
        <Text style={[styles.continueText, !allPhotosCompleted && styles.continueTextDisabled]}>Continue</Text>
      </Pressable>

      <Modal animationType="slide" onRequestClose={closeCamera} visible={activePhotoType !== null}>
        <View style={styles.cameraScreen}>
          {permission?.granted ? (
            <CameraView
              facing="back"
              mode="picture"
              onCameraReady={() => setCameraReady(true)}
              onMountError={() => setCameraError('Camera could not be opened on this device.')}
              ref={cameraRef}
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <View style={styles.permissionSurface}>
              <MaterialIcons name="photo-camera" size={46} color={palette.surface} />
              <Text style={styles.permissionTitle}>
                {permissionDenied ? 'Camera permission is blocked.' : 'Camera permission required.'}
              </Text>
              <Text style={styles.permissionCaption}>
                {permissionDenied
                  ? 'Enable camera access from phone settings, then open this page again.'
                  : 'Allow camera access to capture photo evidence directly.'}
              </Text>
              {!permissionDenied ? (
                <Pressable accessibilityRole="button" onPress={requestPermission} style={styles.permissionButton}>
                  <Text style={styles.permissionButtonText}>Allow Camera</Text>
                </Pressable>
              ) : null}
            </View>
          )}

          <View style={styles.cameraOverlay} pointerEvents="box-none">
            <View style={styles.cameraTopBar}>
              <Pressable
                accessibilityLabel="Close camera"
                accessibilityRole="button"
                onPress={closeCamera}
                style={styles.cameraIconButton}>
                <MaterialIcons name="close" size={24} color={palette.surface} />
              </Pressable>
              <View style={styles.cameraTitleGroup}>
                <Text style={styles.cameraTitle}>{activeRequirement?.title}</Text>
                <Text style={styles.cameraCaption}>Align the asset inside the frame</Text>
              </View>
              <View style={styles.cameraIconButtonPlaceholder} />
            </View>

            {permission?.granted ? (
              <View style={styles.cameraFrame}>
                <View style={[styles.corner, styles.cornerTopLeft]} />
                <View style={[styles.corner, styles.cornerTopRight]} />
                <View style={[styles.corner, styles.cornerBottomLeft]} />
                <View style={[styles.corner, styles.cornerBottomRight]} />
              </View>
            ) : null}

            <View style={styles.cameraBottomPanel}>
              {cameraError ? <Text style={styles.cameraError}>{cameraError}</Text> : null}
              <Pressable
                accessibilityLabel="Capture photo evidence"
                accessibilityRole="button"
                disabled={!permission?.granted || !cameraReady || capturing}
                onPress={capturePhoto}
                style={[
                  styles.captureButton,
                  (!permission?.granted || !cameraReady || capturing) && styles.captureButtonDisabled,
                ]}>
                <View style={styles.captureButtonInner} />
              </Pressable>
              <Text style={styles.captureHint}>{capturing ? 'Capturing...' : 'Tap to capture'}</Text>
            </View>
          </View>
        </View>
      </Modal>
    </AppScreen>
  );
}

function PhotoEvidenceSection({
  onPress,
  photoUri,
  requirement,
}: {
  onPress: () => void;
  photoUri: string | null;
  requirement: PhotoRequirement;
}) {
  const completed = Boolean(photoUri);

  return (
    <Pressable
      accessibilityLabel={`Capture ${requirement.title}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.photoSection, completed && styles.photoSectionCompleted, pressed && styles.pressed]}>
      <View style={styles.photoHeader}>
        <View style={[styles.photoIcon, completed && styles.photoIconCompleted]}>
          <MaterialIcons name={completed ? 'check-circle' : requirement.icon} size={22} color={completed ? palette.secondary : palette.primary} />
        </View>
        <View style={styles.photoCopy}>
          <Text style={styles.photoTitle}>{requirement.title}</Text>
          <Text style={styles.photoCaption}>{requirement.caption}</Text>
        </View>
      </View>

      <View style={styles.previewArea}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.previewImage} />
        ) : (
          <View style={styles.emptyPreview}>
            <MaterialIcons name="photo-camera" size={32} color={palette.primary} />
            <Text style={styles.emptyPreviewText}>Tap to open camera</Text>
          </View>
        )}
      </View>

      <View style={styles.photoFooter}>
        <View style={[styles.statusBadge, completed ? styles.statusBadgeSubmitted : styles.statusBadgeRequired]}>
          <MaterialIcons
            name={completed ? 'check-circle' : 'error-outline'}
            size={14}
            color={completed ? '#2563EB' : palette.danger}
          />
          <Text style={[styles.photoStatus, completed ? styles.photoStatusCompleted : styles.photoStatusRequired]}>
            {completed ? 'Photo Submitted' : 'Required Photo'}
          </Text>
        </View>
        <View style={styles.retakeGroup}>
          <Text style={styles.retakeText}>{completed ? 'Retake' : 'Capture'}</Text>
          <MaterialIcons name="chevron-right" size={20} color={palette.primary} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cameraBottomPanel: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingBottom: spacing.lg,
    width: '100%',
  },
  cameraCaption: {
    ...typography.labelSm,
    color: '#D1FAE5',
    fontWeight: '700',
    textAlign: 'center',
  },
  cameraError: {
    ...typography.bodyMd,
    color: '#FFDAD6',
    fontWeight: '800',
    textAlign: 'center',
  },
  cameraFrame: {
    height: 300,
    position: 'relative',
    width: 260,
  },
  cameraIconButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.42)',
    borderRadius: radius.full,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  cameraIconButtonPlaceholder: {
    height: 44,
    width: 44,
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  cameraScreen: {
    backgroundColor: '#05070D',
    flex: 1,
  },
  cameraTitle: {
    ...typography.bodyLg,
    color: palette.surface,
    fontWeight: '900',
    textAlign: 'center',
  },
  cameraTitleGroup: {
    flex: 1,
    gap: 2,
  },
  cameraTopBar: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    width: '100%',
  },
  captureButton: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderRadius: radius.full,
    height: 74,
    justifyContent: 'center',
    width: 74,
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  captureButtonInner: {
    backgroundColor: palette.primary,
    borderRadius: radius.full,
    height: 58,
    width: 58,
  },
  captureHint: {
    ...typography.labelSm,
    color: palette.surface,
    fontWeight: '800',
  },
  continueButton: {
    alignItems: 'center',
    backgroundColor: palette.primary,
    borderRadius: radius.lg,
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
    minHeight: 50,
    paddingHorizontal: spacing.md,
  },
  continueButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  continueText: {
    ...typography.bodyMd,
    color: palette.surface,
    fontWeight: '900',
  },
  continueTextDisabled: {
    color: palette.textSubtle,
  },
  corner: {
    borderColor: palette.surface,
    height: 42,
    position: 'absolute',
    width: 42,
  },
  cornerBottomLeft: {
    borderBottomLeftRadius: radius.md,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    bottom: 0,
    left: 0,
  },
  cornerBottomRight: {
    borderBottomRightRadius: radius.md,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    bottom: 0,
    right: 0,
  },
  cornerTopLeft: {
    borderLeftWidth: 4,
    borderTopLeftRadius: radius.md,
    borderTopWidth: 4,
    left: 0,
    top: 0,
  },
  cornerTopRight: {
    borderRightWidth: 4,
    borderTopRightRadius: radius.md,
    borderTopWidth: 4,
    right: 0,
    top: 0,
  },
  emptyPreview: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.xs,
    justifyContent: 'center',
  },
  emptyPreviewText: {
    ...typography.labelSm,
    color: palette.primary,
    fontWeight: '900',
  },
  headerCaption: {
    ...typography.bodyMd,
    color: '#D1FAE5',
    fontWeight: '700',
  },
  headerCard: {
    ...shadows.floating,
    alignItems: 'center',
    backgroundColor: palette.primary,
    borderRadius: 20,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    shadowColor: '#022C22',
    shadowOpacity: 0.12,
    shadowRadius: 14,
  },
  headerCopy: {
    flex: 1,
    gap: 2,
  },
  headerIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: radius.lg,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  kicker: {
    ...typography.labelSm,
    color: '#A7F3D0',
    fontWeight: '900',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  permissionButton: {
    backgroundColor: palette.primary,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  permissionButtonText: {
    ...typography.bodyMd,
    color: palette.surface,
    fontWeight: '900',
  },
  permissionCaption: {
    ...typography.bodyMd,
    color: '#D7DCE8',
    textAlign: 'center',
  },
  permissionSurface: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  permissionTitle: {
    ...typography.bodyLg,
    color: palette.surface,
    fontWeight: '900',
    textAlign: 'center',
  },
  photoCaption: {
    ...typography.labelSm,
    color: palette.textSubtle,
    fontWeight: '700',
  },
  photoCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  photoFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  photoHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  photoIcon: {
    alignItems: 'center',
    backgroundColor: palette.primarySoft,
    borderRadius: radius.lg,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  photoIconCompleted: {
    backgroundColor: palette.secondarySoft,
  },
  photoList: {
    gap: spacing.sm,
  },
  photoSection: {
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
  photoSectionCompleted: {
    borderColor: '#BFDBFE',
  },
  photoStatus: {
    ...typography.labelSm,
    fontWeight: '800',
  },
  photoStatusCompleted: {
    color: '#2563EB',
  },
  photoStatusRequired: {
    color: palette.danger,
  },
  photoTitle: {
    ...typography.bodyLg,
    color: palette.text,
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.82,
  },
  previewArea: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7B4AE',
    borderRadius: radius.xl,
    borderWidth: 1,
    height: 158,
    overflow: 'hidden',
  },
  previewImage: {
    height: '100%',
    width: '100%',
  },
  retakeGroup: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 2,
  },
  retakeText: {
    ...typography.labelSm,
    color: palette.primary,
    fontWeight: '900',
  },
  statusBadge: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderRadius: radius.full,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: spacing.xs,
    paddingVertical: 5,
  },
  statusBadgeRequired: {
    borderColor: '#F7A7A1',
  },
  statusBadgeSubmitted: {
    borderColor: '#BFDBFE',
  },
  title: {
    ...typography.headlineSm,
    color: palette.surface,
    fontWeight: '900',
  },
});

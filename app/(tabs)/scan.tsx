import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { palette, radius, spacing, typography } from '@/constants/theme';
import { assets } from '@/data/mock';

type ScanWarning = {
  icon: keyof typeof MaterialIcons.glyphMap;
  message: string;
  tone: 'danger' | 'warning';
};

const unclearDetectionDelay = 7000;
const warningCooldown = 9000;
const warningVisibleDuration = 4200;
const scanHelperWarnings: ScanWarning[] = [
  {
    icon: 'center-focus-strong',
    message: 'Barcode not detected clearly. Please point the camera directly at the barcode and try again.',
    tone: 'warning',
  },
  {
    icon: 'flashlight-on',
    message: 'Camera view is too dark. Move to a brighter area or turn on the flashlight.',
    tone: 'warning',
  },
  {
    icon: 'zoom-in',
    message: 'Move closer to the barcode and keep it inside the scan frame.',
    tone: 'warning',
  },
];

const registeredAssetsByBarcode = new Map(
  assets.flatMap((asset) =>
    [asset.id, asset.code, asset.serialNumber].map((barcode) => [normalizeBarcode(barcode), asset.id] as const),
  ),
);

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [message, setMessage] = useState('Opening camera...');
  const [warning, setWarning] = useState<ScanWarning | null>(null);
  const scanLockedRef = useRef(false);
  const lastDetectionAtRef = useRef(Date.now());
  const lastWarningAtRef = useRef(0);
  const helperWarningIndexRef = useRef(0);
  const warningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useFocusEffect(
    useCallback(() => {
      scanLockedRef.current = false;
      lastDetectionAtRef.current = Date.now();
      setScanned(false);
      setWarning(null);
      setMessage(permission?.granted ? 'Align the barcode inside the frame.' : 'Opening camera...');
    }, [permission?.granted]),
  );

  useEffect(() => {
    if (!permission) {
      return;
    }

    if (permission.granted) {
      lastDetectionAtRef.current = Date.now();
      setMessage('Align the barcode inside the frame.');
      return;
    }

    if (permission.canAskAgain) {
      requestPermission();
      return;
    }

    setMessage('Camera permission denied.');
  }, [permission, requestPermission]);

  useEffect(() => {
    if (!permission?.granted || scanned) {
      return undefined;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const hasNoRecentDetection = now - lastDetectionAtRef.current > unclearDetectionDelay;

      if (!hasNoRecentDetection) {
        return;
      }

      const helperWarning = scanHelperWarnings[helperWarningIndexRef.current % scanHelperWarnings.length];

      helperWarningIndexRef.current += 1;
      showWarning(helperWarning);
      lastDetectionAtRef.current = now;
    }, 1000);

    return () => clearInterval(interval);
  }, [permission?.granted, scanned]);

  useEffect(
    () => () => {
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    },
    [],
  );

  const showWarning = (nextWarning: ScanWarning) => {
    const now = Date.now();

    if (now - lastWarningAtRef.current < warningCooldown) {
      return;
    }

    lastWarningAtRef.current = now;
    setWarning(nextWarning);
    setMessage('Ready to scan again.');

    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    warningTimeoutRef.current = setTimeout(() => {
      setWarning(null);
    }, warningVisibleDuration);
  };

  const handleBarcodeScanned = ({ data }: BarcodeScanningResult) => {
    if (scanned || scanLockedRef.current) {
      return;
    }

    lastDetectionAtRef.current = Date.now();
    const barcode = normalizeBarcode(data);

    const assetId = registeredAssetsByBarcode.get(barcode);

    if (assetId) {
      scanLockedRef.current = true;
      setScanned(true);
      setMessage(`Barcode detected: ${data}`);
      router.push({ pathname: '/asset-result', params: { assetId } });
      return;
    }

    if (!isExpectedAssetBarcodeFormat(barcode)) {
      showWarning({
        icon: 'warning-amber',
        message: 'Invalid barcode. This barcode does not match any registered asset.',
        tone: 'danger',
      });
      return;
    }

    showWarning({
      icon: 'inventory-2',
      message: 'Invalid barcode. This barcode does not match any registered asset.',
      tone: 'danger',
    });
  };

  const permissionDenied = permission && !permission.granted && !permission.canAskAgain;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.cameraSurface}>
        {permission?.granted ? (
          <CameraView
            barcodeScannerSettings={{
              barcodeTypes: ['qr', 'code128', 'ean13'],
            }}
            enableTorch={torchEnabled}
            facing="back"
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            style={StyleSheet.absoluteFill}
          />
        ) : (
          <View style={styles.permissionSurface}>
            <MaterialIcons name="photo-camera" size={48} color={palette.surface} />
            <Text style={styles.permissionText}>
              {permissionDenied ? 'Camera permission is blocked.' : 'Requesting camera permission...'}
            </Text>
            {permissionDenied ? (
              <Text style={styles.permissionHint}>
                Enable camera access from phone settings, then open this scanner again.
              </Text>
            ) : null}
            {!permissionDenied ? (
              <Pressable accessibilityRole="button" onPress={requestPermission} style={styles.permissionButton}>
                <Text style={styles.permissionButtonText}>Allow Camera</Text>
              </Pressable>
            ) : null}
          </View>
        )}

        <View style={styles.overlay} pointerEvents="box-none">
          <View style={styles.topBar}>
            <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.iconButton}>
              <MaterialIcons name="arrow-back" size={24} color={palette.surface} />
            </Pressable>
            <Text style={styles.title}>Scan Barcode</Text>
            <Pressable
              accessibilityRole="button"
              disabled={!permission?.granted}
              onPress={() => setTorchEnabled((current) => !current)}
              style={[styles.iconButton, !permission?.granted && styles.iconButtonDisabled]}>
              <MaterialIcons
                name={torchEnabled ? 'flashlight-off' : 'flashlight-on'}
                size={24}
                color={palette.surface}
              />
            </Pressable>
          </View>

          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.cornerTopLeft]} />
            <View style={[styles.corner, styles.cornerTopRight]} />
            <View style={[styles.corner, styles.cornerBottomLeft]} />
            <View style={[styles.corner, styles.cornerBottomRight]} />
          </View>

          {warning ? <WarningBanner warning={warning} /> : null}

          <View style={styles.statusPanel}>
            <Text style={styles.statusText}>{message}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function normalizeBarcode(value: string) {
  return value.trim().replace(/\s+/g, ' ').toUpperCase();
}

function isExpectedAssetBarcodeFormat(value: string) {
  return (
    /^ASSET-\d{3}$/.test(value) ||
    /^NOE3-(TOOLS|WFM|VEH|LAP)-[A-Z]{3}-\d{4}$/.test(value) ||
    /^AST-[A-Z]{3}-\d{4}$/.test(value) ||
    /^LTP-[A-Z]{2,4}-\d{4}$/.test(value) ||
    /^WFM-[A-Z]{3}-\d{4}$/.test(value) ||
    /^DK \d{4} [A-Z]{2}$/.test(value)
  );
}

function WarningBanner({ warning }: { warning: ScanWarning }) {
  const isDanger = warning.tone === 'danger';

  return (
    <View style={[styles.warningBanner, isDanger ? styles.warningBannerDanger : styles.warningBannerWarning]}>
      <View style={[styles.warningIcon, isDanger ? styles.warningIconDanger : styles.warningIconWarning]}>
        <MaterialIcons name={warning.icon} size={19} color={isDanger ? palette.danger : palette.warning} />
      </View>
      <Text style={[styles.warningText, isDanger ? styles.warningTextDanger : styles.warningTextWarning]}>
        {warning.message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cameraSurface: {
    backgroundColor: '#05070D',
    flex: 1,
    overflow: 'hidden',
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
  iconButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.42)',
    borderRadius: radius.full,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  iconButtonDisabled: {
    opacity: 0.45,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  permissionButton: {
    backgroundColor: palette.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  permissionButtonText: {
    ...typography.bodyMd,
    color: palette.surface,
    fontWeight: '800',
  },
  permissionHint: {
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
  permissionText: {
    ...typography.bodyLg,
    color: palette.surface,
    fontWeight: '800',
    textAlign: 'center',
  },
  safeArea: {
    backgroundColor: '#05070D',
    flex: 1,
  },
  scanFrame: {
    height: 260,
    position: 'relative',
    width: 260,
  },
  statusPanel: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.52)',
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  statusText: {
    ...typography.bodyMd,
    color: palette.surface,
    fontWeight: '700',
    textAlign: 'center',
  },
  title: {
    ...typography.bodyLg,
    color: palette.surface,
    fontWeight: '800',
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  warningBanner: {
    alignItems: 'center',
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.sm,
    maxWidth: 360,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    width: '100%',
  },
  warningBannerDanger: {
    backgroundColor: 'rgba(255, 218, 214, 0.96)',
    borderColor: 'rgba(186, 26, 26, 0.28)',
  },
  warningBannerWarning: {
    backgroundColor: 'rgba(255, 244, 220, 0.96)',
    borderColor: 'rgba(239, 153, 0, 0.32)',
  },
  warningIcon: {
    alignItems: 'center',
    borderRadius: radius.full,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  warningIconDanger: {
    backgroundColor: 'rgba(186, 26, 26, 0.1)',
  },
  warningIconWarning: {
    backgroundColor: 'rgba(239, 153, 0, 0.12)',
  },
  warningText: {
    ...typography.labelSm,
    flex: 1,
    fontWeight: '800',
    lineHeight: 16,
  },
  warningTextDanger: {
    color: palette.danger,
  },
  warningTextWarning: {
    color: '#8A5700',
  },
});

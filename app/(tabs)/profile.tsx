import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/app-screen';
import { currentUser } from '@/data/mock';
import { palette, radius, shadows, spacing, typography } from '@/constants/theme';

export default function ProfileScreen() {
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleLogout = () => {
    setLogoutModalVisible(false);
    router.replace('/login');
  };

  return (
    <AppScreen>
      <View style={styles.profileHero}>
        <View style={styles.heroAccent} />
        <View style={styles.avatarRing}>
          <View style={styles.avatar}>
            <MaterialIcons name="person" size={38} color={palette.surface} />
          </View>
        </View>
        <View style={styles.identity}>
          <Text style={styles.name}>{currentUser.fullName}</Text>
          <View style={styles.rolePill}>
            <MaterialIcons name="verified-user" size={15} color={palette.secondary} />
            <Text style={styles.role}>{currentUser.role}</Text>
          </View>
        </View>
      </View>

      <View style={styles.infoCard}>
        <InfoItem icon="domain" label="Assigned Branch" value={currentUser.branch} />
        <View style={styles.divider} />
        <InfoItem icon="alternate-email" label="Email" value={currentUser.email} />
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => setLogoutModalVisible(true)}
        style={({ pressed }) => [styles.logoutButton, pressed && styles.pressed]}>
        <View style={styles.logoutIcon}>
          <MaterialIcons name="logout" size={20} color={palette.danger} />
        </View>
        <View style={styles.logoutTextGroup}>
          <Text style={styles.logoutTitle}>Logout</Text>
          <Text style={styles.logoutCaption}>Exit from this account securely</Text>
        </View>
      </Pressable>

      <View style={styles.versionBox}>
        <Text style={styles.footerTitle}>Network Operation East 3 Mobile Application</Text>
        <Text style={styles.footerVersion}>Version 1.0.0</Text>
        <Text style={styles.footerCredit}>Developed by Bima Darmawangsa Dipayana</Text>
        <Text style={styles.footerCopyright}>© 2026 All Rights Reserved</Text>
      </View>

      <Modal
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
        transparent
        visible={logoutModalVisible}>
        <View style={styles.modalRoot}>
          <Pressable
            accessibilityLabel="Close logout confirmation"
            onPress={() => setLogoutModalVisible(false)}
            style={styles.modalBackdrop}
          />
          <View style={styles.confirmCard}>
            <View style={styles.confirmGlow} />
            <View style={styles.confirmIconRing}>
              <View style={styles.confirmIcon}>
                <MaterialIcons name="logout" size={28} color={palette.surface} />
              </View>
            </View>
            <Text style={styles.confirmTitle}>Logout from account?</Text>
            <Text style={styles.confirmMessage}>
              Make sure your inspection progress is saved before leaving this session.
            </Text>
            <View style={styles.confirmActions}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setLogoutModalVisible(false)}
                style={({ pressed }) => [styles.cancelButton, pressed && styles.pressed]}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={handleLogout}
                style={({ pressed }) => [styles.confirmLogoutButton, pressed && styles.pressed]}>
                <Text adjustsFontSizeToFit minimumFontScale={0.86} numberOfLines={1} style={styles.confirmLogoutText}>
                  Yes, Logout
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </AppScreen>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoItem}>
      <View style={styles.infoIcon}>
        <MaterialIcons name={icon} size={19} color={palette.primary} />
      </View>
      <View style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: palette.primary,
    borderRadius: radius.full,
    height: 76,
    justifyContent: 'center',
    width: 76,
  },
  avatarRing: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: radius.full,
    height: 90,
    justifyContent: 'center',
    shadowColor: '#022C22',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    width: 90,
  },
  cancelButton: {
    alignItems: 'center',
    backgroundColor: '#F8FAF9',
    borderColor: '#D1DAD5',
    borderRadius: radius.lg,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 46,
    paddingHorizontal: spacing.sm,
  },
  cancelText: {
    ...typography.bodyMd,
    color: palette.textMuted,
    fontWeight: '900',
  },
  confirmActions: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  confirmCard: {
    ...shadows.floating,
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderColor: '#FFD1CC',
    borderRadius: 18,
    borderWidth: 1,
    gap: spacing.sm,
    maxWidth: 420,
    overflow: 'hidden',
    padding: spacing.lg,
    shadowColor: '#7F1D1D',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    width: '88%',
  },
  confirmGlow: {
    backgroundColor: '#FFF0E8',
    borderRadius: radius.full,
    height: 150,
    position: 'absolute',
    right: -42,
    top: -72,
    width: 150,
  },
  confirmIcon: {
    alignItems: 'center',
    backgroundColor: palette.danger,
    borderRadius: radius.full,
    height: 58,
    justifyContent: 'center',
    width: 58,
  },
  confirmIconRing: {
    alignItems: 'center',
    backgroundColor: '#FFE8E4',
    borderRadius: radius.full,
    height: 74,
    justifyContent: 'center',
    width: 74,
  },
  confirmLogoutButton: {
    alignItems: 'center',
    backgroundColor: palette.danger,
    borderRadius: radius.lg,
    flex: 1.12,
    justifyContent: 'center',
    minHeight: 46,
    paddingHorizontal: 10,
  },
  confirmLogoutText: {
    ...typography.bodyMd,
    color: palette.surface,
    flexShrink: 1,
    fontWeight: '900',
    textAlign: 'center',
  },
  confirmMessage: {
    ...typography.bodyMd,
    color: palette.textMuted,
    fontWeight: '600',
    maxWidth: 300,
    textAlign: 'center',
  },
  confirmTitle: {
    ...typography.headlineSm,
    color: palette.text,
    fontWeight: '900',
    textAlign: 'center',
  },
  divider: {
    backgroundColor: palette.border,
    height: 1,
    marginLeft: 52,
  },
  heroAccent: {
    backgroundColor: palette.primary,
    borderRadius: radius.full,
    height: 78,
    opacity: 0.1,
    position: 'absolute',
    right: -18,
    top: -22,
    width: 78,
  },
  identity: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  infoCard: {
    ...shadows.floating,
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  infoIcon: {
    alignItems: 'center',
    backgroundColor: palette.primarySoft,
    borderRadius: radius.lg,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  infoItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: 68,
  },
  infoLabel: {
    ...typography.labelSm,
    color: palette.textSubtle,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  infoText: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },
  infoValue: {
    ...typography.bodyMd,
    color: palette.text,
    fontWeight: '700',
  },
  logoutButton: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: radius.xl,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: 68,
    paddingHorizontal: spacing.md,
    shadowColor: '#7F1D1D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  logoutCaption: {
    ...typography.labelSm,
    color: palette.textSubtle,
    fontWeight: '700',
  },
  logoutIcon: {
    alignItems: 'center',
    backgroundColor: palette.dangerSoft,
    borderRadius: radius.lg,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  logoutTextGroup: {
    flex: 1,
    gap: 2,
  },
  logoutTitle: {
    ...typography.bodyMd,
    color: palette.danger,
    fontWeight: '900',
  },
  modalBackdrop: {
    backgroundColor: 'rgba(31, 41, 55, 0.52)',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  modalRoot: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    ...typography.headlineSm,
    color: palette.text,
    fontWeight: '900',
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.82,
  },
  profileHero: {
    ...shadows.floating,
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderColor: '#D1DAD5',
    borderRadius: 20,
    borderWidth: 1,
    gap: spacing.md,
    overflow: 'hidden',
    padding: spacing.lg,
    shadowColor: '#022C22',
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  role: {
    ...typography.labelSm,
    color: palette.secondary,
    fontWeight: '900',
  },
  rolePill: {
    alignItems: 'center',
    backgroundColor: palette.secondarySoft,
    borderColor: '#B9E8D2',
    borderRadius: radius.full,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  versionBox: {
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: 2,
    marginTop: 'auto',
    opacity: 0.72,
    paddingBottom: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.lg,
  },
  footerCredit: {
    ...typography.labelSm,
    color: '#8E94A3',
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 13,
    textAlign: 'center',
  },
  footerCopyright: {
    ...typography.labelSm,
    color: '#A0A5B2',
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 13,
    textAlign: 'center',
  },
  footerTitle: {
    ...typography.labelSm,
    color: '#6B7280',
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 13,
    textAlign: 'center',
  },
  footerVersion: {
    ...typography.labelSm,
    color: '#7A837F',
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 13,
    textAlign: 'center',
  },
});

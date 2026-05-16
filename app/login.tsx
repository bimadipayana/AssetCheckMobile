import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { palette, spacing, typography } from '@/constants/theme';

const commonPasswords = [
  'password',
  'password123',
  'qwerty123',
  'admin123',
  'welcome123',
  'letmein123',
  'assetcheck123',
  'biznet123',
];

const LOGIN_VALIDATION_ENABLED = false;

export default function LoginScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const usernameError = LOGIN_VALIDATION_ENABLED ? getUsernameError(username) : '';
  const passwordError = useMemo(
    () => (LOGIN_VALIDATION_ENABLED ? getPasswordError(password, username) : ''),
    [password, username],
  );
  const canSignIn = !usernameError && !passwordError;

  const handleSignIn = () => {
    setSubmitted(true);

    if (!canSignIn) {
      return;
    }

    router.replace('/');
  };

  const handlePasswordFocus = () => {
    setPasswordFocused(true);

    setTimeout(() => {
      scrollRef.current?.scrollTo({ animated: true, y: 180 });
    }, 120);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}
        style={styles.keyboardAvoider}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={[styles.mainContent, (usernameFocused || passwordFocused) && styles.mainContentFocused]}>
            <View style={styles.brand}>
              <View style={styles.logoStage}>
                <Image
                  accessibilityIgnoresInvertColors
                  resizeMode="contain"
                  source={require('@/assets/images/network-operation-east-3-logo.png')}
                  style={styles.logoImage}
                />
              </View>
              <Text style={styles.title}>Network Operation East 3</Text>
              <View style={styles.subtitlePill}>
                <MaterialIcons name="check-circle" size={14} color={palette.secondary} />
                <Text style={styles.subtitle}>Operational Asset Verification</Text>
              </View>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Employee User name</Text>
                <View style={[styles.inputBox, submitted && usernameError && styles.inputBoxError]}>
                  <MaterialIcons name="badge" size={23} color={palette.primary} />
                  <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    onBlur={() => setUsernameFocused(false)}
                    onChangeText={(value) => setUsername(value.trim().toLowerCase())}
                    onFocus={() => setUsernameFocused(true)}
                    placeholder="username"
                    placeholderTextColor="#B8BCC9"
                    style={styles.input}
                    value={username}
                  />
                </View>
                {submitted && usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
                {usernameFocused ? (
                  <HelperTip text="Use lowercase words joined by an underscore, e.g. akmal_jeddi." />
                ) : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                {passwordFocused ? (
                  <HelperTip text="Pattern: initials + DDMMYY + symbol, max 11 characters." />
                ) : null}
                <View style={[styles.inputBox, submitted && passwordError && styles.inputBoxError]}>
                  <MaterialIcons name="lock-outline" size={23} color={palette.primary} />
                  <TextInput
                    autoCapitalize="none"
                    onBlur={() => setPasswordFocused(false)}
                    onChangeText={setPassword}
                    onFocus={handlePasswordFocus}
                    placeholder="Password"
                    placeholderTextColor="#B8BCC9"
                    secureTextEntry
                    style={styles.input}
                    value={password}
                  />
                </View>
                {submitted && passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
              </View>

              <Pressable
                accessibilityRole="button"
                onPress={handleSignIn}
                style={({ pressed }) => [styles.signInBox, pressed && styles.pressed]}>
                <View style={styles.signInCenter}>
                  <Text style={styles.signInText}>Sign In</Text>
                  <MaterialIcons name="arrow-forward" size={22} color="#FFFFFF" />
                </View>
              </Pressable>

              <Text style={styles.forgot}>Forgot Password?</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Developed by Bima Darmawangsa Dipayana</Text>
            <Text style={styles.footerCopyright}>© 2026 All Rights Reserved</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function HelperTip({ text }: { text: string }) {
  return (
    <View style={styles.helperTip}>
      <MaterialIcons name="info-outline" size={14} color={palette.primary} />
      <Text style={styles.helperTipText}>{text}</Text>
    </View>
  );
}

function getUsernameError(value: string) {
  if (!value) {
    return 'Employee username is required.';
  }

  if (!/^[a-z]+(?:_[a-z]+)+$/.test(value)) {
    return 'Use lowercase username with underscore and no spaces, e.g. akmal_jeddi.';
  }

  return '';
}

function getPasswordError(value: string, username: string) {
  if (!value) {
    return 'Password is required.';
  }

  const normalizedPassword = value.toLowerCase();
  const usernameParts = username.split('_').filter(Boolean);
  const hasPersonalInfo = usernameParts.some((part) => part.length > 2 && normalizedPassword.includes(part));

  if (value.length > 11) {
    return 'Use maximum 11 characters for this generated password format.';
  }

  if (value.length < 9) {
    return 'Use initials, DDMMYY, and one special symbol.';
  }

  if (commonPasswords.some((common) => normalizedPassword.includes(common))) {
    return 'Do not use common or predictable passwords.';
  }

  if (hasPersonalInfo) {
    return 'Do not include your username or personal information in the password.';
  }

  if (!/[A-Z]/.test(value) || !/[a-z]/.test(value) || !/\d/.test(value) || !/[^A-Za-z0-9]/.test(value)) {
    return 'Use uppercase, lowercase, number, and special character.';
  }

  return '';
}

const styles = StyleSheet.create({
  brand: {
    alignItems: 'center',
    gap: 8,
  },
  container: {
    flexGrow: 1,
    paddingBottom: 18,
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  errorText: {
    ...typography.labelSm,
    color: palette.danger,
    fontWeight: '800',
  },
  forgot: {
    ...typography.bodyMd,
    color: palette.primary,
    fontWeight: '700',
    marginTop: 10,
    textAlign: 'center',
  },
  form: {
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    borderColor: '#D7E5DE',
    borderRadius: 16,
    borderWidth: 1,
    gap: 14,
    marginTop: 22,
    padding: 14,
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: 3,
  },
  footer: {
    alignItems: 'center',
    gap: 2,
  },
  footerCopyright: {
    ...typography.labelSm,
    color: '#8A928E',
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 13,
    textAlign: 'center',
  },
  footerText: {
    ...typography.labelSm,
    color: '#7A837F',
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 13,
    textAlign: 'center',
  },
  helperTip: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#ECFDF5',
    borderColor: '#CFE5DA',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    maxWidth: '100%',
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  helperTipText: {
    ...typography.labelSm,
    color: palette.primary,
    flexShrink: 1,
    fontWeight: '800',
    lineHeight: 15,
  },
  input: {
    ...typography.bodyLg,
    color: palette.text,
    flex: 1,
    fontWeight: '600',
    minHeight: 52,
    paddingVertical: 0,
  },
  inputBox: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#D1DAD5',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    height: 52,
    paddingHorizontal: 14,
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  inputBoxError: {
    borderColor: palette.danger,
  },
  inputGroup: {
    gap: 6,
  },
  keyboardAvoider: {
    flex: 1,
  },
  label: {
    ...typography.labelMd,
    color: '#1F2937',
    fontWeight: '900',
  },
  logoImage: {
    height: 236,
    width: 236,
  },
  logoStage: {
    alignItems: 'center',
    marginBottom: 0,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 24,
  },
  mainContentFocused: {
    justifyContent: 'flex-start',
    paddingTop: 54,
  },
  pressed: {
    opacity: 0.86,
  },
  safeArea: {
    backgroundColor: '#F8FAF9',
    flex: 1,
  },
  signInBox: {
    alignItems: 'center',
    backgroundColor: '#064E3B',
    borderRadius: 8,
    flexDirection: 'row',
    height: 54,
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 4,
    width: '100%',
  },
  signInCenter: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
  },
  signInText: {
    ...typography.bodyLg,
    color: '#FFFFFF',
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    ...typography.labelSm,
    color: palette.secondary,
    fontWeight: '900',
    textAlign: 'center',
  },
  subtitlePill: {
    alignItems: 'center',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  title: {
    color: palette.primary,
    fontSize: 23,
    fontWeight: '900',
    lineHeight: 29,
    maxWidth: 330,
    textAlign: 'center',
  },
});

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function AuthModal({
  visible,
  onClose,
  onLoginSuccess,
  actionTitle = 'Sign In to Continue Booking',
  actionSubtitle = 'Sign in or continue as guest to reserve sanctuary services and track your pet’s journey.',
}) {
  const [authMode, setAuthMode] = useState('GUEST_PROMPT'); // 'GUEST_PROMPT' | 'EMAIL_LOGIN' | 'EMAIL_REGISTER'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [guardianName, setGuardianName] = useState('');

  const handleGuestLogin = () => {
    const guestUser = {
      id: `guest-${Date.now()}`,
      name: guardianName.trim() || 'Guest Companion Guardian',
      email: email.trim() || 'guest.guardian@heaven.app',
      isGuest: true,
      membership: 'Guest Companion',
      avatarEmoji: '🐾',
    };
    onLoginSuccess(guestUser);
    onClose();
  };

  const handleEmailAuth = () => {
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Password Too Short', 'Password must be at least 6 characters.');
      return;
    }

    const authUser = {
      id: `user-${Date.now()}`,
      name: guardianName.trim() || email.split('@')[0],
      email: email.trim(),
      isGuest: false,
      membership: 'Guardian Member',
      avatarEmoji: '⭐',
    };
    onLoginSuccess(authUser);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modalBackdropTap}>
          <TouchableOpacity 
            style={StyleSheet.absoluteFill} 
            onPress={onClose} 
            activeOpacity={1} 
          />
        </View>

        <View style={styles.sheetContainer}>
          <View style={styles.sheetHandle} />

          {/* Close button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.headerBox}>
            <View style={styles.shieldBadge}>
              <Text style={styles.shieldEmoji}>🕊️</Text>
            </View>
            <Text style={styles.titleText}>{actionTitle}</Text>
            <Text style={styles.subtitleText}>{actionSubtitle}</Text>
          </View>

          {/* UX Notice: Login is NOT a barrier */}
          <View style={styles.uxBadgeBanner}>
            <Text style={styles.uxBadgeIcon}>⚡</Text>
            <Text style={styles.uxBadgeText}>
              Zero-barrier access: You can continue as a Guest instantly without setting up a password.
            </Text>
          </View>

          {authMode === 'GUEST_PROMPT' ? (
            <View style={styles.actionColumn}>
              {/* Optional Name for Guest */}
              <View style={styles.fieldGroup}>
                <Text style={styles.inputLabel}>Guardian Name (Optional)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Sarah K. / Guest Guardian"
                  placeholderTextColor="#64748B"
                  value={guardianName}
                  onChangeText={setGuardianName}
                />
              </View>

              {/* 1-Click Guest Login Button */}
              <TouchableOpacity
                style={styles.guestCtaBtn}
                activeOpacity={0.85}
                onPress={handleGuestLogin}
              >
                <LinearGradient
                  colors={['#7B2FBE', '#3B82F6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientBtnPad}
                >
                  <Text style={styles.btnIcon}>⚡</Text>
                  <Text style={styles.guestBtnText}>Continue as Guest Companion</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Secondary Options */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR SIGN IN</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={styles.secondaryOptionBtn}
                onPress={() => setAuthMode('EMAIL_LOGIN')}
              >
                <Text style={styles.secondaryOptionText}>✉️ Sign In with Email</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryOptionBtn}
                onPress={() => {
                  // Instant demo Google Sign In
                  const googleUser = {
                    id: `google-${Date.now()}`,
                    name: 'Google Companion User',
                    email: 'guardian@gmail.com',
                    isGuest: false,
                    membership: 'Google Verified Member',
                    avatarEmoji: '🌐',
                  };
                  onLoginSuccess(googleUser);
                  onClose();
                }}
              >
                <Text style={styles.secondaryOptionText}>🌐 Continue with Google</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.actionColumn}>
              {/* Email / Password Form */}
              <View style={styles.fieldGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="companion@heaven.app"
                  placeholderTextColor="#64748B"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="••••••••"
                  placeholderTextColor="#64748B"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <TouchableOpacity
                style={styles.guestCtaBtn}
                activeOpacity={0.85}
                onPress={handleEmailAuth}
              >
                <LinearGradient
                  colors={['#7B2FBE', '#3B82F6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientBtnPad}
                >
                  <Text style={styles.guestBtnText}>
                    {authMode === 'EMAIL_LOGIN' ? 'Sign In & Continue' : 'Create Account'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ marginTop: 12, alignItems: 'center' }}
                onPress={() => setAuthMode('GUEST_PROMPT')}
              >
                <Text style={styles.backLinkText}>← Back to Guest Instant Access</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={{ height: 20 }} />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalBackdropTap: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetContainer: {
    backgroundColor: '#0F1A3A',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(147, 197, 253, 0.25)',
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 20,
  },
  sheetHandle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'center',
    marginBottom: 12,
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 18,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeBtnText: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerBox: {
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 14,
  },
  shieldBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(123, 47, 190, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  shieldEmoji: {
    fontSize: 26,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 12,
    lineHeight: 18,
  },
  uxBadgeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: 16,
    gap: 8,
  },
  uxBadgeIcon: {
    fontSize: 16,
  },
  uxBadgeText: {
    flex: 1,
    fontSize: 12,
    color: '#93C5FD',
    lineHeight: 16,
  },
  actionColumn: {
    width: '100%',
  },
  fieldGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#CBD5E1',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: 'rgba(10, 18, 44, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(100, 140, 220, 0.35)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: '#FFFFFF',
  },
  guestCtaBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 4,
    shadowColor: '#7B2FBE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  gradientBtnPad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    gap: 8,
  },
  btnIcon: {
    fontSize: 16,
  },
  guestBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dividerText: {
    fontSize: 11,
    color: '#64748B',
    paddingHorizontal: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  secondaryOptionBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryOptionText: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '600',
  },
  backLinkText: {
    color: '#93C5FD',
    fontSize: 13,
    fontWeight: '600',
  },
});

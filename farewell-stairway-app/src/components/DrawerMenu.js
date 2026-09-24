import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  ImageBackground, 
  TouchableOpacity, 
  Modal, 
  Platform 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ASSETS } from '../constants/assets';
import { THEME } from '../constants/theme';

export default function DrawerMenu({ 
  visible, 
  onClose, 
  onNavigate,
  currentScreen 
}) {
  const menuItems = [
    { key: 'HOME', label: 'Home (Sanctuary Hub)', icon: '⌂', sub: null },
    { key: 'JOURNEY', label: 'Celestial Journey', icon: '🌌', sub: 'Soul Ascent' },
    { key: 'MAP', label: 'Map', icon: '🗺', sub: '(Public Access)' },
    { key: 'FORM', label: 'Funeral Form', icon: '📄', sub: null },
    { key: 'PROFILE', label: 'Login / Profile', icon: '👤', sub: null },
    { key: 'TEMPLES', label: 'Temples Directory', icon: '⛩', sub: null },
    { key: 'STARS', label: 'Memorial Stars', icon: '✨', sub: null },
    { key: 'GUIDES', label: 'Care Guides', icon: '📖', sub: null },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        {/* Tap outside to close */}
        <TouchableOpacity 
          style={styles.backdropDismiss} 
          activeOpacity={1} 
          onPress={onClose} 
        />

        <View style={styles.drawerCard}>
          <ImageBackground 
            source={ASSETS.bgDrawer} 
            style={styles.drawerBackground} 
            resizeMode="cover"
          >
            <LinearGradient
              colors={['rgba(7, 12, 30, 0.94)', 'rgba(10, 18, 44, 0.88)']}
              style={styles.drawerGradient}
            >
              {/* Header with Close */}
              <View style={styles.drawerTopRow}>
                <TouchableOpacity 
                  style={styles.closeBtn} 
                  onPress={onClose}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Brand Header */}
              <View style={styles.brandContainer}>
                <View style={styles.brandBadgeCircle}>
                  <Text style={styles.brandBadgeEmoji}>🐾</Text>
                </View>
                <Text style={styles.brandTitle}>Farewell to Stairway</Text>
                <Text style={styles.brandSubtitle}>Honoring Their Journey</Text>
              </View>

              {/* Menu List */}
              <View style={styles.menuList}>
                {menuItems.map((item) => {
                  const isSelected = currentScreen === item.key;
                  return (
                    <TouchableOpacity
                      key={item.key}
                      style={[styles.menuItem, isSelected && styles.activeMenuItem]}
                      activeOpacity={0.8}
                      onPress={() => {
                        onClose();
                        onNavigate(item.key);
                      }}
                    >
                      <Text style={[styles.menuItemIcon, isSelected && styles.activeItemText]}>
                        {item.icon}
                      </Text>
                      <View style={styles.menuItemTextCol}>
                        <Text style={[styles.menuItemLabel, isSelected && styles.activeItemText]}>
                          {item.label}
                        </Text>
                        {item.sub && (
                          <Text style={styles.menuItemSub}>{item.sub}</Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Bottom Quote Matching Image 8 */}
              <View style={styles.drawerFooter}>
                <Text style={styles.pawFooterIcon}>🐾</Text>
                <Text style={styles.footerQuote}>
                  Their love lives on in the stars.
                </Text>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  backdropDismiss: {
    flex: 1,
  },
  drawerCard: {
    width: 290,
    height: '100%',
    backgroundColor: THEME.colors.midnightBg,
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 20,
  },
  drawerBackground: {
    flex: 1,
  },
  drawerGradient: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: Platform.OS === 'ios' ? 52 : 36,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  drawerTopRow: {
    alignItems: 'flex-end',
  },
  closeBtn: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  closeText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  brandContainer: {
    marginTop: 6,
    marginBottom: 20,
  },
  brandBadgeCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(123, 47, 190, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  brandBadgeEmoji: {
    fontSize: 22,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    letterSpacing: 0.3,
  },
  brandSubtitle: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  menuList: {
    flex: 1,
    gap: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  activeMenuItem: {
    backgroundColor: 'rgba(123, 47, 190, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(147, 197, 253, 0.3)',
  },
  menuItemIcon: {
    fontSize: 18,
    color: THEME.colors.textSecondary,
    marginRight: 14,
    width: 24,
    textAlign: 'center',
  },
  menuItemTextCol: {
    flex: 1,
  },
  menuItemLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  menuItemSub: {
    fontSize: 11,
    color: THEME.colors.textHighlight,
    marginTop: 1,
  },
  activeItemText: {
    color: '#FFFFFF',
  },
  drawerFooter: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  pawFooterIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  footerQuote: {
    fontSize: 12,
    fontStyle: 'italic',
    color: THEME.colors.textSecondary,
    textAlign: 'center',
  },
});

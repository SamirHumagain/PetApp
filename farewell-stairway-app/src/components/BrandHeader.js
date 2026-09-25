import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import { ASSETS } from '../constants/assets';
import { THEME } from '../constants/theme';

export default function BrandHeader({ 
  onOpenMenu, 
  title = 'Farewell to Stairway',
  subtitle = 'Honoring Their Journey',
  showMenu = true,
  rightAction = null
}) {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.brandRow}>
        <Image 
          source={ASSETS.logoClean} 
          style={styles.brandLogo} 
          resizeMode="contain" 
        />
        <View style={styles.titleColumn}>
          <Text style={styles.titleText}>{title}</Text>
          {subtitle ? <Text style={styles.subtitleText}>{subtitle}</Text> : null}
        </View>
      </View>

      <View style={styles.rightActionsRow}>
        {rightAction}
        {showMenu && (
          <TouchableOpacity 
            style={styles.menuButton} 
            activeOpacity={0.7} 
            onPress={onOpenMenu}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <View style={styles.hamburgerIcon}>
              <View style={styles.menuLine} />
              <View style={styles.menuLine} />
              <View style={styles.menuLine} />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 12 : 8,
    paddingBottom: 12,
    zIndex: 10,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandLogo: {
    width: 32,
    height: 30,
  },
  titleColumn: {
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'web' ? '"Cormorant Garamond", Garamond, Georgia, serif' : Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  subtitleText: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    marginTop: 1,
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'web' ? '"Cormorant Garamond", Garamond, Georgia, serif' : Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  rightActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  hamburgerIcon: {
    width: 20,
    height: 14,
    justifyContent: 'space-between',
  },
  menuLine: {
    width: 20,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  }
});

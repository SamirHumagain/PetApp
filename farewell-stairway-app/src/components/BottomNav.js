import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { THEME } from '../constants/theme';

import { IconPin, IconDocument, IconProfile } from './Icons';

function IconHome({ size = 20, color = '#FFFFFF' }) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: size * 0.45,
        borderRightWidth: size * 0.45,
        borderBottomWidth: size * 0.38,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: color,
      }} />
      <View style={{
        width: size * 0.65,
        height: size * 0.45,
        backgroundColor: color,
        borderBottomLeftRadius: 2,
        borderBottomRightRadius: 2,
        marginTop: -1,
      }} />
    </View>
  );
}

export default function BottomNav({ currentTab, onSelectTab }) {
  const tabs = [
    { key: 'HOME', label: 'Home', renderIcon: (c) => <IconHome size={20} color={c} /> },
    { key: 'MAP', label: 'Map', renderIcon: (c) => <IconPin size={20} color={c} /> },
    { key: 'FORM', label: 'Form', renderIcon: (c) => <IconDocument size={20} color={c} /> },
    { key: 'PROFILE', label: 'Login', renderIcon: (c) => <IconProfile size={20} color={c} /> },
  ];

  return (
    <View style={styles.navContainer}>
      <View style={styles.navBlurOverlay}>
        {tabs.map((tab) => {
          const isActive = currentTab === tab.key;
          const activeColor = isActive ? '#93C5FD' : THEME.colors.textMuted;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabButton}
              activeOpacity={0.7}
              onPress={() => onSelectTab(tab.key)}
            >
              <View style={[styles.iconWrapper, isActive && styles.activeIconWrapper]}>
                {tab.renderIcon(activeColor)}
              </View>
              <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navContainer: {
    width: '100%',
    flexShrink: 0,
    backgroundColor: 'rgba(7, 12, 30, 0.98)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(126, 184, 255, 0.15)',
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    paddingTop: 8,
    zIndex: 100,
  },
  navBlurOverlay: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 12,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  activeIconWrapper: {
    backgroundColor: 'rgba(123, 47, 190, 0.25)',
  },
  tabIcon: {
    fontSize: 18,
    color: THEME.colors.textMuted,
  },
  activeTabIcon: {
    color: '#93C5FD',
    transform: [{ scale: 1.1 }],
  },
  tabLabel: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
  activeTabLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

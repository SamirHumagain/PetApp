import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { THEME } from '../constants/theme';

import { IconChevronRight } from './Icons';

export default function GlassCard({
  icon,
  title,
  subtitle,
  onPress,
  badge = null,
  iconBgColor = 'rgba(59, 130, 246, 0.22)',
  iconBorderColor = 'rgba(147, 197, 253, 0.45)'
}) {
  return (
    <TouchableOpacity
      style={styles.cardContainer}
      activeOpacity={0.82}
      onPress={onPress}
    >
      <View style={styles.cardInner}>
        {/* Glowing Circle Icon Container matching Image 5 */}
        <View style={[styles.iconCircle, { backgroundColor: iconBgColor, borderColor: iconBorderColor }]}>
          {React.isValidElement(icon) ? (
            icon
          ) : (
            <Text style={styles.iconText}>{icon}</Text>
          )}
        </View>

        {/* Text Area */}
        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.cardTitle}>{title}</Text>
            {badge ? <View style={styles.badgeWrapper}><Text style={styles.badgeText}>{badge}</Text></View> : null}
          </View>
          <Text style={styles.cardSubtitle}>{subtitle}</Text>
        </View>

        {/* Right Chevron Arrow */}
        <View style={styles.chevronContainer}>
          <IconChevronRight size={18} color="#93C5FD" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'rgba(15, 25, 62, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(126, 184, 255, 0.25)',
    borderRadius: 20,
    marginVertical: 7,
    overflow: 'hidden',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(59, 130, 246, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(147, 197, 253, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 22,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  badgeWrapper: {
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#34D399',
  },
  cardSubtitle: {
    fontSize: 13,
    color: THEME.colors.textMuted,
    marginTop: 4,
    lineHeight: 18,
  },
  chevronContainer: {
    paddingLeft: 8,
  },
  chevronText: {
    fontSize: 26,
    color: THEME.colors.textHighlight,
    fontWeight: '300',
  },
});

import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function PillButton({ 
  title, 
  onPress, 
  style, 
  variant = 'glowBorder', // 'glowBorder' | 'solidGradient'
  icon = null 
}) {
  if (variant === 'glowBorder') {
    return (
      <TouchableOpacity 
        style={[styles.glowWrapper, style]} 
        activeOpacity={0.8} 
        onPress={onPress}
      >
        <LinearGradient
          colors={['#7B2FBE', '#4A90D9', '#7B2FBE']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.borderGradient}
        >
          <View style={styles.glowInner}>
            <Text style={styles.glowButtonText}>{title}</Text>
            {icon ? <Text style={styles.btnIcon}>{icon}</Text> : null}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={[styles.solidWrapper, style]} 
      activeOpacity={0.85} 
      onPress={onPress}
    >
      <LinearGradient
        colors={['#7B2FBE', '#3B82F6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.solidGradient}
      >
        {icon ? <Text style={styles.btnIconLeft}>{icon}</Text> : null}
        <Text style={styles.solidButtonText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  glowWrapper: {
    borderRadius: 30,
    shadowColor: '#4A90D9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
  },
  borderGradient: {
    padding: 2,
    borderRadius: 30,
  },
  glowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 55, 0.85)',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 28,
  },
  glowButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  solidWrapper: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#7B2FBE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  solidGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  solidButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  btnIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 8,
  },
  btnIconLeft: {
    color: '#FFFFFF',
    fontSize: 16,
    marginRight: 8,
  }
});

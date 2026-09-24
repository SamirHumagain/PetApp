import React from 'react';
import { StyleSheet, View } from 'react-native';

// Clean, crisp vector-style icons rendered with pure React Native primitives
// Ensures 100% cross-platform compatibility with zero font or SVG loading issues

export function IconPin({ size = 24, color = '#FFFFFF' }) {
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      {/* Outer Pin Head */}
      <View style={[styles.pinHead, { 
        width: size * 0.75, 
        height: size * 0.75, 
        borderRadius: (size * 0.75) / 2, 
        borderColor: color,
        backgroundColor: 'rgba(59, 130, 246, 0.4)'
      }]}>
        {/* Inner Dot */}
        <View style={[styles.pinDot, { 
          width: size * 0.28, 
          height: size * 0.28, 
          borderRadius: (size * 0.28) / 2, 
          backgroundColor: color 
        }]} />
      </View>
      {/* Pin Point */}
      <View style={[styles.pinTail, { 
        borderTopColor: color, 
        borderTopWidth: size * 0.25,
        borderLeftWidth: size * 0.16,
        borderRightWidth: size * 0.16,
        marginTop: -1
      }]} />
    </View>
  );
}

export function IconDocument({ size = 24, color = '#FFFFFF' }) {
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View style={[styles.docBody, { 
        width: size * 0.7, 
        height: size * 0.88, 
        borderColor: color,
        borderRadius: size * 0.12,
        backgroundColor: 'rgba(123, 47, 190, 0.35)'
      }]}>
        {/* Fold corner */}
        <View style={[styles.docCorner, { borderBottomColor: color, borderRightColor: color }]} />
        {/* Lines */}
        <View style={[styles.docLine, { backgroundColor: color, width: '65%', top: size * 0.28 }]} />
        <View style={[styles.docLine, { backgroundColor: color, width: '50%', top: size * 0.44 }]} />
        <View style={[styles.docLine, { backgroundColor: color, width: '60%', top: size * 0.60 }]} />
      </View>
    </View>
  );
}

export function IconProfile({ size = 24, color = '#FFFFFF' }) {
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      {/* Head */}
      <View style={[styles.profileHead, { 
        width: size * 0.38, 
        height: size * 0.38, 
        borderRadius: (size * 0.38) / 2, 
        backgroundColor: color 
      }]} />
      {/* Shoulders */}
      <View style={[styles.profileBody, { 
        width: size * 0.75, 
        height: size * 0.42, 
        borderTopLeftRadius: size * 0.35, 
        borderTopRightRadius: size * 0.35, 
        backgroundColor: color,
        marginTop: 2
      }]} />
    </View>
  );
}

export function IconTemple({ size = 24, color = '#FFFFFF' }) {
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      {/* Spire */}
      <View style={[styles.templeSpire, { borderBottomColor: color, borderBottomWidth: size * 0.28, borderLeftWidth: size * 0.2, borderRightWidth: size * 0.2 }]} />
      {/* Roof */}
      <View style={[styles.templeRoof, { backgroundColor: color, width: size * 0.8, height: size * 0.1 }]} />
      {/* Pillars */}
      <View style={[styles.pillarsRow, { width: size * 0.65, height: size * 0.35 }]}>
        <View style={[styles.pillar, { backgroundColor: color }]} />
        <View style={[styles.pillar, { backgroundColor: color }]} />
        <View style={[styles.pillar, { backgroundColor: color }]} />
      </View>
      {/* Base */}
      <View style={[styles.templeBase, { backgroundColor: color, width: size * 0.85, height: size * 0.1 }]} />
    </View>
  );
}

export function IconStar({ size = 24, color = '#FFD700' }) {
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View style={[styles.starCore, { backgroundColor: color, width: size * 0.35, height: size * 0.35 }]} />
      <View style={[styles.starRayV, { backgroundColor: color, width: size * 0.12, height: size * 0.85 }]} />
      <View style={[styles.starRayH, { backgroundColor: color, width: size * 0.85, height: size * 0.12 }]} />
    </View>
  );
}

export function IconBook({ size = 24, color = '#FFFFFF' }) {
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View style={[styles.bookCover, { 
        width: size * 0.75, 
        height: size * 0.65, 
        borderColor: color,
        borderWidth: 2,
        borderRadius: 4
      }]}>
        <View style={[styles.bookSpine, { backgroundColor: color, width: 2, height: '100%', left: '48%' }]} />
      </View>
    </View>
  );
}

export function IconChevronRight({ size = 18, color = '#93C5FD' }) {
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View style={[styles.chevronArrow, { 
        width: size * 0.45, 
        height: size * 0.45, 
        borderColor: color,
        borderTopWidth: 2.5,
        borderRightWidth: 2.5,
        transform: [{ rotate: '45deg' }] 
      }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinHead: {
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinDot: {},
  pinTail: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  docBody: {
    borderWidth: 2,
    position: 'relative',
  },
  docCorner: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 5,
    borderLeftWidth: 5,
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderBottomWidth: 5,
    borderRightWidth: 5,
  },
  docLine: {
    position: 'absolute',
    left: '18%',
    height: 2,
    borderRadius: 1,
  },
  profileHead: {},
  profileBody: {
    opacity: 0.9,
  },
  templeSpire: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  templeRoof: {
    borderRadius: 1,
    marginTop: 1,
  },
  pillarsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  pillar: {
    width: 3,
    height: '100%',
    borderRadius: 1,
  },
  templeBase: {
    borderRadius: 1,
  },
  starCore: {
    borderRadius: 2,
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
  },
  starRayV: {
    borderRadius: 2,
    position: 'absolute',
  },
  starRayH: {
    borderRadius: 2,
    position: 'absolute',
  },
  bookCover: {
    position: 'relative',
  },
  bookSpine: {
    position: 'absolute',
  },
  chevronArrow: {},
});

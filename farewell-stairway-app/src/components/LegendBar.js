import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function LegendBar() {
  return (
    <View style={styles.legendWrapper}>
      <View style={styles.legendRow}>
        {/* Temple */}
        <View style={styles.legendItem}>
          <View style={styles.templeIconCircle}>
            <Text style={styles.templeIconText}>🛕</Text>
          </View>
          <Text style={styles.legendLabel}>Temple</Text>
        </View>

        {/* Driver on Trip */}
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#3B82F6' }]} />
          <Text style={styles.legendLabel}>Driver (On Trip)</Text>
        </View>

        {/* Driver Available */}
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
          <Text style={styles.legendLabel}>Driver (Available)</Text>
        </View>
      </View>

      <View style={[styles.legendRow, { marginTop: 6 }]}>
        {/* Your Location */}
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#2563EB', borderWidth: 2, borderColor: '#93C5FD' }]} />
          <Text style={styles.legendLabel}>Your Location</Text>
        </View>
        
        {/* Busy */}
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
          <Text style={styles.legendLabel}>Driver (En Route)</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  legendWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  templeIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  templeIconText: {
    fontSize: 11,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#334155',
  },
});

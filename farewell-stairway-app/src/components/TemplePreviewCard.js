import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

export default function TemplePreviewCard({ temple, onViewDetails }) {
  if (!temple) return null;

  return (
    <View style={styles.cardContainer}>
      <Image 
        source={{ uri: temple.image }} 
        style={styles.thumbnail} 
        resizeMode="cover" 
      />
      <View style={styles.infoCol}>
        <View style={styles.nameRow}>
          <Text style={styles.templeName} numberOfLines={1}>
            {temple.name}
          </Text>
        </View>
        <Text style={styles.templeLocation} numberOfLines={1}>
          📍 {temple.district || temple.address}
        </Text>
        
        {/* Parking & Turnkey badges */}
        <View style={styles.badgeRow}>
          <View style={styles.parkingMiniBadge}>
            <Text style={styles.parkingMiniBadgeText}>
              🅿️ {temple.parking?.capacity || 'Free Parking'}
            </Text>
          </View>
          <Text style={styles.priceTag}>From ฿{temple.pricing?.small?.toLocaleString()}</Text>
        </View>

        <TouchableOpacity 
          style={styles.detailsBtn} 
          activeOpacity={0.8}
          onPress={() => onViewDetails(temple)}
        >
          <Text style={styles.detailsBtnText}>View Details & Parking →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    flexDirection: 'row',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 5,
  },
  thumbnail: {
    width: 84,
    height: 84,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
  },
  infoCol: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  templeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  templeLocation: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  parkingMiniBadge: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  parkingMiniBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  priceTag: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D97706',
  },
  detailsBtn: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 16,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  detailsBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4338CA',
  },
});

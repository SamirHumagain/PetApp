import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../constants/theme';
import { templesList } from '../mockData/temples';

export default function TempleDirectoryScreen({
  onSelectTemple,
  onOpenMap,
  onBack,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');

  const filteredTemples = templesList.filter((temple) => {
    const matchesSearch = 
      temple.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      temple.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      temple.region.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'ALL' || temple.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity 
          style={styles.backBtn}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Find a Funeral Temple</Text>
        <TouchableOpacity style={styles.mapShortcutBtn} onPress={onOpenMap}>
          <Text style={styles.mapShortcutText}>🗺 Map</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollCanvas} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search temple by name, region, or ghat..."
            placeholderTextColor="#64748B"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Region Filter Chips */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.chipsScroll}
        >
          {[
            { key: 'ALL', label: 'All Bangkok Temples' },
            { key: 'Khlong Toei', label: '📍 Khlong Toei' },
            { key: 'Phasi Charoen', label: '📍 Phasi Charoen (Thonburi)' },
            { key: 'Yan Nawa', label: '📍 Rama III (Yan Nawa)' },
          ].map((chip) => (
            <TouchableOpacity
              key={chip.key}
              style={[styles.chip, selectedRegion === chip.key && styles.activeChip]}
              onPress={() => setSelectedRegion(chip.key)}
            >
              <Text style={[styles.chipText, selectedRegion === chip.key && styles.activeChipText]}>
                {chip.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Sponsored Dignified Banner (Prompt Section 23) */}
        <View style={styles.sponsoredCard}>
          <View style={styles.sponsoredHeader}>
            <Text style={styles.sponsoredBadge}>SPONSORED</Text>
            <Text style={styles.sponsoredBrand}>Chao Phraya Pet Sanctuary & Eco Urns</Text>
          </View>
          <Text style={styles.sponsoredTitle}>Handcrafted Sacred Clay Urns & Lotus Memorials</Text>
          <Text style={styles.sponsoredSub}>Eco-friendly ceremonial vessels blessed for river floating rituals.</Text>
        </View>

        {/* Temple List Cards */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCountText}>{filteredTemples.length} Bangkok Sanctuaries Available</Text>
        </View>

        {filteredTemples.map((temple) => (
          <TouchableOpacity
            key={temple.id}
            style={styles.templeCard}
            activeOpacity={0.85}
            onPress={() => onSelectTemple(temple)}
          >
            <Image 
              source={{ uri: temple.image }} 
              style={styles.templeCardImg} 
              resizeMode="cover" 
            />
            
            <View style={styles.templeCardBody}>
              <View style={styles.cardTopRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTempleName}>{temple.name}</Text>
                  {temple.nameLocal ? <Text style={styles.cardTempleThai}>{temple.nameLocal}</Text> : null}
                  <Text style={styles.cardAddress}>📍 {temple.address}</Text>
                </View>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingBadgeText}>★ {temple.rating}</Text>
                </View>
              </View>

              {/* Parking tag */}
              <View style={styles.parkingTagRow}>
                <View style={styles.parkingTagBadge}>
                  <Text style={styles.parkingTagText}>
                    🅿️ {temple.parking?.type} ({temple.parking?.capacity})
                  </Text>
                </View>
              </View>

              {/* Service Badges */}
              <View style={styles.servicesRow}>
                {temple.services.slice(0, 3).map((srv, idx) => (
                  <View key={idx} style={styles.servicePill}>
                    <Text style={styles.servicePillText}>{srv}</Text>
                  </View>
                ))}
              </View>

              {/* Card Footer with Price and View Details CTA */}
              <View style={styles.cardFooter}>
                <View style={styles.cardPriceRow}>
                  <View>
                    <Text style={styles.fromLabel}>Starting from</Text>
                    <Text style={styles.priceVal}>
                      ฿{temple.pricing.small?.toLocaleString()}{' '}
                      <Text style={styles.turnkeyText}>
                        • Turnkey ฿{temple.pricing.turnkey?.toLocaleString()}
                      </Text>
                    </Text>
                  </View>
                  <View style={styles.allInclusiveBadge}>
                    <Text style={styles.allInclusiveBadgeText}>All-Inclusive</Text>
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.viewDetailsBtn}
                  activeOpacity={0.85}
                  onPress={() => onSelectTemple(temple)}
                >
                  <LinearGradient
                    colors={['#7B2FBE', '#3B82F6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.viewDetailsGradient}
                  >
                    <Text style={styles.viewDetailsText}>View Details & Parking →</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070C1E',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 52 : 36,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  mapShortcutBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(59, 130, 246, 0.25)',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  mapShortcutText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#93C5FD',
  },
  scrollCanvas: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 25, 62, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(100, 140, 220, 0.3)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
  },
  chipsScroll: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  chip: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    marginRight: 8,
  },
  activeChip: {
    backgroundColor: '#7B2FBE',
  },
  chipText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  activeChipText: {
    color: '#FFFFFF',
  },
  sponsoredCard: {
    backgroundColor: 'rgba(24, 34, 76, 0.7)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(147, 197, 253, 0.25)',
    padding: 14,
    marginBottom: 16,
  },
  sponsoredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sponsoredBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#F59E0B',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  sponsoredBrand: {
    fontSize: 12,
    color: '#93C5FD',
    fontWeight: '600',
  },
  sponsoredTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  sponsoredSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 3,
  },
  resultsHeader: {
    marginBottom: 10,
  },
  resultsCountText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
  },
  templeCard: {
    backgroundColor: 'rgba(15, 25, 62, 0.85)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(126, 184, 255, 0.22)',
    overflow: 'hidden',
    marginBottom: 16,
  },
  templeCardImg: {
    width: '100%',
    height: 140,
    backgroundColor: '#1E293B',
  },
  templeCardBody: {
    padding: 16,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTempleName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardTempleThai: {
    fontSize: 12,
    color: '#CBD5E1',
    marginTop: 2,
    fontStyle: 'italic',
  },
  cardAddress: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 3,
  },
  parkingTagRow: {
    marginTop: 8,
    marginBottom: 4,
  },
  parkingTagBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
    borderWidth: 1,
    borderColor: '#34D399',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  parkingTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6EE7B7',
  },
  ratingBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  ratingBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFD700',
  },
  servicesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: 12,
  },
  servicePill: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  servicePillText: {
    fontSize: 11,
    color: '#93C5FD',
  },
  cardFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    marginTop: 4,
  },
  cardPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  fromLabel: {
    fontSize: 10,
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priceVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 1,
  },
  turnkeyText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '600',
  },
  allInclusiveBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.35)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  allInclusiveBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFD700',
  },
  viewDetailsBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#7B2FBE',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  viewDetailsGradient: {
    paddingVertical: 11,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewDetailsText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});

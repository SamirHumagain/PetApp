import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../constants/theme';

export default function TempleDetailModal({
  visible,
  temple,
  onClose,
  onBookService,
}) {
  if (!temple) return null;

  const openGPS = () => {
    const url = temple.googleMapsUrl || `https://www.google.com/maps/dir/?api=1&destination=${temple.lat},${temple.lng}&destination_place_id=${encodeURIComponent(temple.name)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('GPS Coordinates', `${temple.lat}° N, ${temple.lng}° E`);
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity 
            style={styles.backBtn}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.topBarTitle} numberOfLines={1}>{temple.name}</Text>
          <TouchableOpacity 
            style={styles.gpsSmallBtn}
            onPress={openGPS}
          >
            <Text style={styles.gpsSmallBtnText}>📍 GPS</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollCanvas} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Cover Image & Rating Badge */}
          <View style={styles.coverWrapper}>
            <Image 
              source={{ uri: temple.image }} 
              style={styles.coverImage} 
              resizeMode="cover" 
            />
            <LinearGradient
              colors={['transparent', 'rgba(7, 12, 30, 0.95)']}
              style={styles.coverGradient}
            />
            <View style={styles.floatingRatingBadge}>
              <Text style={styles.ratingStarText}>★ {temple.rating}</Text>
              <Text style={styles.reviewsCountText}>({temple.reviews} reviews)</Text>
            </View>
          </View>

          {/* Temple Title & Info */}
          <View style={styles.titleSection}>
            <Text style={styles.templeNameMain}>{temple.name}</Text>
            {temple.nameLocal ? <Text style={styles.templeNameLocal}>{temple.nameLocal}</Text> : null}
            <Text style={styles.templeAddressText}>📍 {temple.address}</Text>
            <Text style={styles.templePhoneText}>📞 Helpline: {temple.phone}</Text>
          </View>

          {/* About Section */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionHeaderTitle}>About the Sanctuary</Text>
            <Text style={styles.sectionParagraph}>
              A consecrated, peaceful sanctuary providing dignified Buddhist and compassionate funeral rites for beloved companion animals. Equipped with eco-friendly crematoriums and serene prayer halls.
            </Text>

            <View style={styles.featureChipsRow}>
              {temple.features?.map((feat, idx) => (
                <View key={idx} style={styles.featureChip}>
                  <Text style={styles.featureChipText}>✓ {feat}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Parking & Transport Information */}
          {temple.parking && (
            <View style={[styles.sectionBox, styles.parkingSectionBox]}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionHeaderTitle}>🅿️ Parking & Arrival Facilities</Text>
                <View style={styles.freeParkingBadge}>
                  <Text style={styles.freeParkingBadgeText}>FREE PARKING</Text>
                </View>
              </View>

              <View style={styles.parkingDetailRow}>
                <Text style={styles.parkingIcon}>🚗</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parkingLabel}>Facility Type & Capacity</Text>
                  <Text style={styles.parkingValue}>{temple.parking.type} • {temple.parking.capacity}</Text>
                </View>
              </View>

              <View style={styles.parkingDetailRow}>
                <Text style={styles.parkingIcon}>🚐</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parkingLabel}>Drop-off & Unloading Bay</Text>
                  <Text style={styles.parkingValue}>{temple.parking.dropOffBay}</Text>
                </View>
              </View>

              <View style={styles.parkingDetailRow}>
                <Text style={styles.parkingIcon}>♿</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parkingLabel}>Ambulance & Accessibility</Text>
                  <Text style={styles.parkingValue}>{temple.parking.accessibility}</Text>
                </View>
              </View>

              <View style={styles.parkingDetailRow}>
                <Text style={styles.parkingIcon}>🚇</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parkingLabel}>Public Transit Connection</Text>
                  <Text style={styles.parkingValue}>{temple.parking.transit}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Pricing by Pet Size (Prompt Section 8 & 9) */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionHeaderTitle}>Cremation Pricing by Pet Size</Text>
            <Text style={styles.pricingNote}>Rates include ceremonial chamber preparation and ash urn.</Text>

            <View style={styles.pricingTable}>
              <View style={styles.pricingRow}>
                <Text style={styles.petSizeLabel}>Small Pet (&lt;5kg, Cats / Toy Dogs)</Text>
                <Text style={styles.petSizePrice}>฿{temple.pricing.small?.toLocaleString()}</Text>
              </View>
              <View style={styles.pricingRow}>
                <Text style={styles.petSizeLabel}>Medium Pet (5-15kg)</Text>
                <Text style={styles.petSizePrice}>฿{temple.pricing.medium?.toLocaleString()}</Text>
              </View>
              <View style={styles.pricingRow}>
                <Text style={styles.petSizeLabel}>Large Pet (15-30kg)</Text>
                <Text style={styles.petSizePrice}>฿{temple.pricing.large?.toLocaleString()}</Text>
              </View>
              <View style={styles.pricingRow}>
                <Text style={styles.petSizeLabel}>Extra Large Pet (&gt;30kg)</Text>
                <Text style={styles.petSizePrice}>฿{temple.pricing.extraLarge?.toLocaleString()}</Text>
              </View>
            </View>
          </View>

          {/* Available Ceremony Packages */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionHeaderTitle}>Ceremony & Add-on Services</Text>

            <View style={styles.serviceItemBox}>
              <View style={{ flex: 1 }}>
                <Text style={styles.serviceTitle}>🕊 Buddhist Monk Chanting (สวดบังสุกุล)</Text>
                <Text style={styles.serviceDesc}>Monk blessing, incense, lotus offerings and spiritual prayers.</Text>
              </View>
              <Text style={styles.servicePriceVal}>฿{temple.pricing.praying1Day?.toLocaleString()}</Text>
            </View>

            <View style={styles.serviceItemBox}>
              <View style={{ flex: 1 }}>
                <Text style={styles.serviceTitle}>🌊 Chao Phraya Ash Boat Ceremony (ลอยอังคาร)</Text>
                <Text style={styles.serviceDesc}>Boat ride, lotus scattering, and sacred water farewell rite.</Text>
              </View>
              <Text style={styles.servicePriceVal}>฿{temple.pricing.ashToRiver?.toLocaleString()}</Text>
            </View>

            {/* Turnkey Highlight */}
            <View style={[styles.serviceItemBox, styles.turnkeyHighlightBox]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.turnkeyTitle}>🌟 Turnkey Complete Package</Text>
                <Text style={styles.turnkeyDesc}>
                  All-inclusive support: Climate-controlled pickup, monk chanting, cremation, ash-to-river boat, and digital tribute star.
                </Text>
              </View>
              <Text style={styles.turnkeyPriceVal}>฿{temple.pricing.turnkey?.toLocaleString()}</Text>
            </View>
          </View>

          {/* Action CTAs */}
          <View style={styles.ctaRow}>
            <TouchableOpacity 
              style={styles.gpsFullBtn}
              onPress={openGPS}
              activeOpacity={0.8}
            >
              <Text style={styles.gpsFullBtnText}>🧭 Get Directions</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.bookCtaBtn}
              activeOpacity={0.85}
              onPress={() => onBookService(temple)}
            >
              <LinearGradient
                colors={['#7B2FBE', '#3B82F6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.bookCtaGradient}
              >
                <Text style={styles.bookCtaText}>Book Service →</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </Modal>
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
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  gpsSmallBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#10B981',
  },
  gpsSmallBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scrollCanvas: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  coverWrapper: {
    height: 220,
    width: '100%',
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
  },
  floatingRatingBadge: {
    position: 'absolute',
    bottom: 14,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 55, 0.85)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.5)',
  },
  ratingStarText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFD700',
    marginRight: 4,
  },
  reviewsCountText: {
    fontSize: 11,
    color: '#CBD5E1',
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  templeNameMain: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  templeNameLocal: {
    fontSize: 15,
    color: '#93C5FD',
    marginTop: 2,
  },
  templeAddressText: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 8,
  },
  templePhoneText: {
    fontSize: 13,
    color: '#34D399',
    marginTop: 4,
  },
  sectionBox: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  sectionParagraph: {
    fontSize: 13,
    color: '#CBD5E1',
    lineHeight: 20,
  },
  featureChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  featureChip: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(147, 197, 253, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  featureChipText: {
    fontSize: 11,
    color: '#93C5FD',
    fontWeight: '500',
  },
  pricingNote: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 10,
  },
  pricingTable: {
    backgroundColor: 'rgba(15, 25, 62, 0.8)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(126, 184, 255, 0.2)',
    overflow: 'hidden',
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  petSizeLabel: {
    fontSize: 13,
    color: '#E2E8F0',
  },
  petSizePrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFD700',
  },
  serviceItemBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 25, 62, 0.8)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(126, 184, 255, 0.2)',
    padding: 14,
    marginBottom: 10,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 3,
  },
  serviceDesc: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 17,
  },
  servicePriceVal: {
    fontSize: 15,
    fontWeight: '700',
    color: '#93C5FD',
    marginLeft: 12,
  },
  turnkeyHighlightBox: {
    borderColor: 'rgba(255, 215, 0, 0.45)',
    backgroundColor: 'rgba(30, 41, 80, 0.9)',
  },
  turnkeyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: 3,
  },
  turnkeyDesc: {
    fontSize: 12,
    color: '#E2E8F0',
    lineHeight: 18,
  },
  turnkeyPriceVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFD700',
    marginLeft: 12,
  },
  ctaRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 12,
  },
  gpsFullBtn: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  gpsFullBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bookCtaBtn: {
    flex: 1.4,
    borderRadius: 22,
    overflow: 'hidden',
  },
  bookCtaGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  bookCtaText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  /* Parking Section Styles */
  parkingSectionBox: {
    borderColor: 'rgba(52, 211, 153, 0.35)',
    backgroundColor: 'rgba(10, 25, 45, 0.85)',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  freeParkingBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    borderWidth: 1,
    borderColor: '#34D399',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  freeParkingBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6EE7B7',
    letterSpacing: 0.5,
  },
  parkingDetailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 10,
  },
  parkingIcon: {
    fontSize: 18,
    marginTop: 1,
  },
  parkingLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 1,
  },
  parkingValue: {
    fontSize: 13,
    color: '#E2E8F0',
    lineHeight: 18,
  },
});

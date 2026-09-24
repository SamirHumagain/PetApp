import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import { THEME } from '../constants/theme';
import { templesList } from '../mockData/temples';
import { driversList } from '../mockData/drivers';
import LegendBar from '../components/LegendBar';
import TemplePreviewCard from '../components/TemplePreviewCard';
import GoogleMapView from '../components/GoogleMapView';

export default function MapScreen({ 
  onBack, 
  onInspectTemple,
  onBookTemple 
}) {
  const [selectedTemple, setSelectedTemple] = useState(templesList[0]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL' | 'TEMPLES' | 'DRIVERS'

  const handleOpenGoogleMapsApp = () => {
    const temple = selectedTemple || templesList[0];
    const url = temple.googleMapsUrl || `https://www.google.com/maps/dir/?api=1&destination=${temple.lat},${temple.lng}&destination_place_id=${encodeURIComponent(temple.name)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('GPS Location', `Coordinates: ${temple.lat}, ${temple.lng}`);
    });
  };

  const handleRecenter = () => {
    setSelectedTemple(templesList[0]);
    setSelectedDriver(null);
    Alert.alert('GPS Location Centered', 'Map centered to Bangkok, Thailand.');
  };

  const filteredTemples = filterMode === 'DRIVERS' ? [] : templesList;
  const filteredDrivers = filterMode === 'TEMPLES' ? [] : driversList;

  return (
    <View style={styles.container}>
      {/* Top App Bar matching WhatsApp Image 6 */}
      <View style={styles.topBar}>
        <TouchableOpacity 
          style={styles.backCircleBtn}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.titleColumn}>
          <Text style={styles.topBarTitle}>Google Map (Public)</Text>
          <Text style={styles.topBarSub}>Bangkok Cremation Temples & Drivers</Text>
        </View>

        <TouchableOpacity 
          style={styles.gpsTargetBtn}
          activeOpacity={0.7}
          onPress={handleOpenGoogleMapsApp}
        >
          <Text style={styles.gpsTargetIcon}>🧭</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Row: Temples & Drivers */}
      <View style={styles.filterRow}>
        {[
          { key: 'ALL', label: 'All Markers (8)' },
          { key: 'TEMPLES', label: '🛕 Temples (3)' },
          { key: 'DRIVERS', label: '🚗 Live Drivers (5)' },
        ].map(item => (
          <TouchableOpacity
            key={item.key}
            style={[styles.filterChip, filterMode === item.key && styles.activeFilterChip]}
            onPress={() => setFilterMode(item.key)}
          >
            <Text style={[styles.filterChipText, filterMode === item.key && styles.activeFilterChipText]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity 
          style={styles.openExternalGMapBtn}
          onPress={handleOpenGoogleMapsApp}
        >
          <Text style={styles.openExternalGMapText}>Open App ↗</Text>
        </TouchableOpacity>
      </View>

      {/* REAL INTERACTIVE GOOGLE MAP COMPONENT */}
      <View style={styles.mapCanvasWrapper}>
        <GoogleMapView
          temples={filteredTemples}
          drivers={filteredDrivers}
          selectedTemple={selectedTemple}
          onSelectTemple={(t) => {
            setSelectedTemple(t);
            setSelectedDriver(null);
          }}
          onSelectDriver={(d) => setSelectedDriver(d)}
          center={{ lat: 13.7050, lng: 100.5200 }}
        />
      </View>

      {/* Bottom Sheet Elements (Legend + Temple Card) matching Image 6 */}
      <View style={styles.bottomSheetContainer}>
        <LegendBar />

        {selectedTemple && (
          <TemplePreviewCard 
            temple={selectedTemple}
            onViewDetails={(t) => onInspectTemple(t)}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 52 : 36,
    paddingBottom: 12,
    backgroundColor: '#0F172A',
    zIndex: 10,
  },
  backCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  titleColumn: {
    alignItems: 'center',
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  topBarSub: {
    fontSize: 11,
    color: '#93C5FD',
    marginTop: 2,
  },
  gpsTargetBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(59, 130, 246, 0.25)',
    borderWidth: 1,
    borderColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpsTargetIcon: {
    fontSize: 18,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 14,
    paddingBottom: 10,
    gap: 8,
  },
  filterChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  activeFilterChip: {
    backgroundColor: '#3B82F6',
  },
  filterChipText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  activeFilterChipText: {
    color: '#FFFFFF',
  },
  openExternalGMapBtn: {
    marginLeft: 'auto',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  openExternalGMapText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#34D399',
  },
  mapCanvasWrapper: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  bottomSheetContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 12,
    left: 0,
    right: 0,
    zIndex: 30,
  },
});

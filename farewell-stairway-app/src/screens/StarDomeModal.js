import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Platform,
  Alert,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ASSETS } from '../constants/assets';
import { THEME } from '../constants/theme';
import { constellationStars as initialStars } from '../mockData/stars';

export default function StarDomeModal({
  visible,
  onClose,
  onOpenForm,
  customStars = [],
}) {
  const [stars, setStars] = useState([...customStars, ...initialStars]);
  const [selectedStar, setSelectedStar] = useState(null);

  // Sync custom stars when updated
  React.useEffect(() => {
    if (customStars.length > 0) {
      setStars([...customStars, ...initialStars]);
    }
  }, [customStars]);

  const handleOfferLotus = (starId) => {
    setStars(prev => prev.map(s => {
      if (s.id === starId) {
        const newLikes = (s.likes || 0) + 1;
        if (selectedStar?.id === starId) {
          setSelectedStar({ ...selectedStar, likes: newLikes });
        }
        return { ...s, likes: newLikes };
      }
      return s;
    }));
    Alert.alert('Lotus & Light Offering 🪷', `You offered a sacred lotus to ${selectedStar?.name || 'this soul'}. May their journey across the stars be peaceful.`);
  };

  const handleShareStar = async (star) => {
    const msg = `✨ In loving memory of ${star.name} (${star.type}).\n"${star.tribute}"\nShining forever in the Farewell to Stairway constellation sky.\n🌟 https://allpetsgotoheaven.app/star/${star.id}`;
    try {
      await Share.share({ message: msg, title: `Memorial for ${star.name}` });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <ImageBackground 
          source={ASSETS.bgFullGalaxy} 
          style={styles.fullBackground}
          resizeMode="cover"
        >
          {/* Top Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity 
              style={styles.backBtn}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.backIcon}>✕</Text>
            </TouchableOpacity>

            <View style={styles.topTitleCol}>
              <Text style={styles.topBarTitle}>Celestial Star Dome</Text>
              <Text style={styles.topBarSub}>Tap any glowing star to view tribute or offer a lotus</Text>
            </View>

            <View style={{ width: 38 }} />
          </View>

          {/* Star Sky Canvas with Interactive Stars */}
          <View style={styles.skyCanvas}>
            {stars.map((star) => (
              <TouchableOpacity
                key={star.id}
                style={[styles.starTouchable, { left: `${star.x}%`, top: `${star.y}%` }]}
                activeOpacity={0.7}
                onPress={() => setSelectedStar(star)}
              >
                <View style={[styles.starCore, { backgroundColor: star.color, shadowColor: star.color }]}>
                  <View style={[styles.starPulseHalo, { backgroundColor: star.color }]} />
                </View>
                <Text style={styles.starLabelText}>{star.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Bottom Floating Bar */}
          <View style={styles.bottomBar}>
            <TouchableOpacity 
              style={styles.dedicateBtn}
              activeOpacity={0.85}
              onPress={() => {
                onClose();
                onOpenForm();
              }}
            >
              <LinearGradient
                colors={['#7B2FBE', '#4A90D9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.dedicateGradient}
              >
                <Text style={styles.dedicateBtnText}>✨ Dedicate a Star for Your Pet</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Star Inspection Modal Dialog */}
          {selectedStar && (
            <View style={styles.starDetailBackdrop}>
              <View style={styles.starDetailCard}>
                <View style={styles.starDetailHeader}>
                  <View style={[styles.starDotIndicator, { backgroundColor: selectedStar.color }]} />
                  <Text style={styles.starDetailName}>{selectedStar.name}</Text>
                  <TouchableOpacity onPress={() => setSelectedStar(null)}>
                    <Text style={styles.closeStarDetail}>✕</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.starDetailType}>{selectedStar.type} • {selectedStar.years}</Text>
                <Text style={styles.starDetailTribute}>"{selectedStar.tribute}"</Text>

                <View style={styles.starActionsRow}>
                  <TouchableOpacity 
                    style={styles.lotusBtn}
                    onPress={() => handleOfferLotus(selectedStar.id)}
                  >
                    <Text style={styles.lotusBtnText}>🪷 Offer Lotus ({selectedStar.likes || 1})</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.shareBtn}
                    onPress={() => handleShareStar(selectedStar)}
                  >
                    <Text style={styles.shareBtnText}>📤 Share</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.starBlessingFootnote}>🌟 Shining eternally in our sky</Text>
              </View>
            </View>
          )}
        </ImageBackground>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070C1E',
  },
  fullBackground: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 52 : 36,
    paddingBottom: 12,
    backgroundColor: 'rgba(7, 12, 30, 0.75)',
    zIndex: 20,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  topTitleCol: {
    alignItems: 'center',
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  topBarSub: {
    fontSize: 11,
    color: '#93C5FD',
    marginTop: 2,
  },
  skyCanvas: {
    flex: 1,
    position: 'relative',
  },
  starTouchable: {
    position: 'absolute',
    alignItems: 'center',
    padding: 8,
    zIndex: 15,
  },
  starCore: {
    width: 12,
    height: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 8,
  },
  starPulseHalo: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
    opacity: 0.35,
  },
  starLabelText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 20,
    zIndex: 20,
  },
  dedicateBtn: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#7B2FBE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  dedicateGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 24,
  },
  dedicateBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  starDetailBackdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    zIndex: 100,
  },
  starDetailCard: {
    width: '100%',
    backgroundColor: '#0F1A3A',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.4)',
    padding: 20,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  starDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  starDotIndicator: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 10,
  },
  starDetailName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  closeStarDetail: {
    fontSize: 18,
    color: '#94A3B8',
    padding: 4,
  },
  starDetailType: {
    fontSize: 13,
    color: '#93C5FD',
    marginBottom: 12,
  },
  starDetailTribute: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#E2E8F0',
    lineHeight: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  starActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  lotusBtn: {
    flex: 1.3,
    backgroundColor: 'rgba(236, 72, 153, 0.2)',
    borderWidth: 1,
    borderColor: '#EC4899',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
  },
  lotusBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F472B6',
  },
  shareBtn: {
    flex: 1,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderWidth: 1,
    borderColor: '#3B82F6',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
  },
  shareBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#93C5FD',
  },
  starBlessingFootnote: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
});

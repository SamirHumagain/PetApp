import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ASSETS } from '../constants/assets';
import { THEME } from '../constants/theme';
import PillButton from '../components/PillButton';
import { IconStar } from '../components/Icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CANVAS_HEIGHT = Math.round(SCREEN_HEIGHT * 2.6);
const MAX_SCROLL = CANVAS_HEIGHT - SCREEN_HEIGHT;

export default function JourneyScrollScreen({ 
  onBeginJourney, 
  onOpenMenu, 
  onSelectStar,
  onBack 
}) {
  const [petType, setPetType] = useState('DOG'); // 'DOG' | 'CAT'
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef(null);

  // Floating gentle soul breathing hover animation
  const hoverAnim = useRef(new Animated.Value(0)).current;
  // Subtle pulse animation for scroll prompt
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(hoverAnim, {
          toValue: -8,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(hoverAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // 1. Initial Sitting Spirit: perfect and resting peacefully on Earth
  const sittingSoulOpacity = scrollY.interpolate({
    inputRange: [0, MAX_SCROLL * 0.07, MAX_SCROLL * 0.15],
    outputRange: [1, 0.6, 0],
    extrapolate: 'clamp',
  });

  // 2. Flying Spirit (dog_space_transparent.png): takes flight upon scroll, flies through cosmos, transforms into star
  const flyingSoulOpacity = scrollY.interpolate({
    inputRange: [0, MAX_SCROLL * 0.07, MAX_SCROLL * 0.82, MAX_SCROLL * 0.94],
    outputRange: [0, 1, 1, 0],
    extrapolate: 'clamp',
  });

  // Fluid interpolation keeps soul perfectly centered in viewport as user ascends
  const soulCanvasTranslateY = scrollY.interpolate({
    inputRange: [0, MAX_SCROLL],
    outputRange: [0, SCREEN_HEIGHT * 1.58],
    extrapolate: 'clamp',
  });

  const soulScale = scrollY.interpolate({
    inputRange: [0, MAX_SCROLL * 0.5, MAX_SCROLL],
    outputRange: [1, 0.88, 0.4],
    extrapolate: 'clamp',
  });

  const starBurstOpacity = scrollY.interpolate({
    inputRange: [MAX_SCROLL * 0.82, MAX_SCROLL],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const starBurstScale = scrollY.interpolate({
    inputRange: [MAX_SCROLL * 0.82, MAX_SCROLL],
    outputRange: [0.4, 1.25],
    extrapolate: 'clamp',
  });

  // Prompt smoothly disappears as user begins ascending
  const scrollPromptOpacity = scrollY.interpolate({
    inputRange: [0, MAX_SCROLL * 0.12],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const handleAscendSmooth = () => {
    scrollRef.current?.scrollTo({
      y: MAX_SCROLL,
      animated: true,
    });
  };

  const handleScrollToBottom = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  return (
    <View style={styles.container}>
      {/* FIXED TOP HEADER (MATCHING EXACT WHATSAPP IMAGE 1 - NO SOLID WHITE BOX) */}
      <View style={styles.fixedHeader}>
        <View style={styles.headerRow}>
          {/* Left: Pet Soul Toggle (Dog / Cat) and optional Back button */}
          <View style={styles.headerLeftCol}>
            {onBack && (
              <TouchableOpacity 
                style={styles.backCircleBtn}
                onPress={onBack}
                activeOpacity={0.7}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Text style={styles.backArrowText}>←</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={styles.petToggleBadge} 
              activeOpacity={0.8}
              onPress={() => setPetType(prev => prev === 'DOG' ? 'CAT' : 'DOG')}
            >
              <Text style={styles.petToggleText}>{petType === 'DOG' ? '🐕' : '🐈'}</Text>
            </TouchableOpacity>
          </View>

          {/* Center: Brand Title + Subtitle (clean typography matching mockup 1) */}
          <View style={styles.headerCenterCol}>
            <Text style={styles.centerTitle}>Farewell to Stairway</Text>
            <Text style={styles.centerSubtitle}>Pet Funeral & Memorial</Text>
          </View>

          {/* Right: Hamburger Menu */}
          <TouchableOpacity 
            style={styles.menuCircleBtn}
            onPress={onOpenMenu}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <View style={styles.hamburgerLines}>
              <View style={styles.hamburgerLine} />
              <View style={styles.hamburgerLine} />
              <View style={styles.hamburgerLine} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTINUOUS SINGLE CANVAS SCROLLVIEW (0 = EARTH, MAX = COSMOS) */}
      <Animated.ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        bounces={true}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        contentContainerStyle={{ height: CANVAS_HEIGHT }}
      >
        {/* LAYER 1: EARTH DUSK & MOUNTAINS (Initial Viewport) */}
        <ImageBackground 
          source={ASSETS.bgEarthNight} 
          style={styles.canvasSectionEarth}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(7, 12, 30, 0.1)', 'rgba(7, 12, 30, 0.45)', 'rgba(7, 12, 30, 0.95)']}
            style={styles.earthFadeGradient}
          />
        </ImageBackground>

        {/* LAYER 2: DEEP COSMIC GALAXY & NEBULA (Middle image removed) */}
        <ImageBackground 
          source={ASSETS.bgFullGalaxy} 
          style={styles.canvasSectionGalaxy}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(7, 12, 30, 0.95)', 'rgba(7, 12, 30, 0.25)', 'rgba(7, 12, 30, 0.90)']}
            style={styles.earthFadeGradient}
          />
        </ImageBackground>

        {/* ================= SECTION 1: INITIAL EARTH VIEWPORT (0 to SCREEN_HEIGHT) ================= */}
        {/* EXACT HERO TEXT & BUTTON MATCHING WHATSAPP IMAGE 1 */}
        <View style={styles.earthHeroCenterBox}>
          <Text style={styles.poeticText}>
            Every goodbye is a{"\n"}journey toward the stars.
          </Text>
          
          <PillButton 
            title="Begin the Journey →"
            onPress={onBeginJourney}
            style={styles.ctaPill}
          />
        </View>

        {/* PROMPT: SCROLL UP (AT BOTTOM OF EARTH VIEWPORT - FADES AS USER ASCENDS) */}
        <Animated.View style={[styles.scrollUpPromptBox, { opacity: scrollPromptOpacity }]}>
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={handleAscendSmooth}
          >
            <Animated.View style={{ transform: [{ scale: pulseAnim }], alignItems: 'center' }}>
              <Text style={styles.chevronUp}>⌃</Text>
              <Text style={styles.scrollUpPromptText}>Scroll Up</Text>
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>

        {/* ================= SECTION 2: CONSTELLATION MEMORIAL STARS ================= */}
        <TouchableOpacity 
          style={[styles.starBadge, { top: SCREEN_HEIGHT * 0.98, left: '16%' }]}
          onPress={() => onSelectStar({ name: 'Buddy', type: 'Golden Retriever', tribute: 'Run free across the endless golden stars.' })}
        >
          <Text style={styles.starGlowIcon}>✦</Text>
          <Text style={styles.starBadgeName}>Buddy</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.starBadge, { top: SCREEN_HEIGHT * 1.10, right: '15%' }]}
          onPress={() => onSelectStar({ name: 'Luna', type: 'Persian White Cat', tribute: 'Our quiet moonbeam warming the sky.' })}
        >
          <Text style={styles.starGlowIcon}>✦</Text>
          <Text style={styles.starBadgeName}>Luna</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.starBadge, { top: SCREEN_HEIGHT * 1.32, left: '22%' }]}
          onPress={() => onSelectStar({ name: 'Max', type: 'French Bulldog', tribute: 'Little body, biggest heart in the universe.' })}
        >
          <Text style={styles.starGlowIcon}>✦</Text>
          <Text style={styles.starBadgeName}>Max</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.starBadge, { top: SCREEN_HEIGHT * 1.45, right: '18%' }]}
          onPress={() => onSelectStar({ name: 'Bella', type: 'Pomeranian', tribute: 'The sweetest little cloud of happiness.' })}
        >
          <Text style={styles.starGlowIcon}>✦</Text>
          <Text style={styles.starBadgeName}>Bella</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.starBadge, { top: SCREEN_HEIGHT * 1.68, left: '35%' }]}
          onPress={() => onSelectStar({ name: 'Charlie', type: 'Beagle', tribute: 'Always following adventure.' })}
        >
          <Text style={styles.starGlowIcon}>✦</Text>
          <Text style={styles.starBadgeName}>Charlie</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.starBadge, { top: SCREEN_HEIGHT * 1.78, right: '24%' }]}
          onPress={() => onSelectStar({ name: 'Milo', type: 'Scottish Fold', tribute: 'Rest gently among the stars.' })}
        >
          <Text style={styles.starGlowIcon}>✦</Text>
          <Text style={styles.starBadgeName}>Milo</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.starBadge, { top: SCREEN_HEIGHT * 1.92, left: '16%' }]}
          onPress={() => onSelectStar({ name: 'Daisy', type: 'Labrador', tribute: 'Pure sunshine forever.' })}
        >
          <Text style={styles.starGlowIcon}>✦</Text>
          <Text style={styles.starBadgeName}>Daisy</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.starBadge, { top: SCREEN_HEIGHT * 2.04, right: '18%' }]}
          onPress={() => onSelectStar({ name: 'Rocky', type: 'Husky', tribute: 'Howling with cosmic freedom.' })}
        >
          <Text style={styles.starGlowIcon}>✦</Text>
          <Text style={styles.starBadgeName}>Rocky</Text>
        </TouchableOpacity>

        {/* ================= SECTION 3: GALACTIC CORE DESTINATION ================= */}
        <View style={styles.topDestinationStarBox}>
          <Animated.View style={[
            styles.radiantStarWrapper, 
            { 
              opacity: starBurstOpacity,
              transform: [{ scale: starBurstScale }]
            }
          ]}>
            <IconStar size={58} color="#FFD700" />
            <View style={styles.newStarBadge}>
              <Text style={styles.newStarBadgeText}>✨ Beloved Companion's Star</Text>
            </View>
          </Animated.View>

          <Text style={styles.topCosmosQuote}>
            "So many loved ones,{"\n"}forever in our sky."
          </Text>

          <View style={styles.destinationButtonRow}>
            <PillButton 
              title="Enter Sanctuary Hub →"
              onPress={onBeginJourney}
              style={{ minWidth: 230 }}
            />
            <TouchableOpacity 
              style={styles.revisitGroundBtn}
              onPress={handleScrollToBottom}
              activeOpacity={0.8}
            >
              <Text style={styles.revisitGroundText}>⌃ Return to Earth</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ================= THE ASCENDING PET SOUL ================= */}
        {/* Initially sits peacefully on Earth; seamlessly takes flight upon scrolling and becomes the beloved companion's star */}
        <Animated.View 
          style={[
            styles.continuousSoulWrapper, 
            { 
              transform: [
                { translateY: soulCanvasTranslateY },
                { translateY: hoverAnim },
                { scale: soulScale }
              ],
            }
          ]}
          pointerEvents="none"
        >
          {/* Initial sitting spirit dog (rests on the Earth mound) */}
          <Animated.Image 
            source={petType === 'DOG' ? ASSETS.dogSitting : ASSETS.catSitting} 
            style={[
              styles.soulImage,
              styles.absoluteFillImage,
              { opacity: sittingSoulOpacity }
            ]}
            resizeMode="contain"
          />

          {/* Flying spirit dog (dog_space_transparent.png taking flight into cosmos) */}
          <Animated.Image 
            source={petType === 'DOG' ? ASSETS.dogAscendingSpace : ASSETS.catAscendingSpace} 
            style={[
              styles.soulImage,
              styles.absoluteFillImage,
              { opacity: flyingSoulOpacity }
            ]}
            resizeMode="contain"
          />
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.midnightBg,
  },
  fixedHeader: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : 20,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  backArrowText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  petToggleBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  petToggleText: {
    fontSize: 18,
  },
  headerCenterCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  centerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 2,
    letterSpacing: 0.4,
  },
  menuCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hamburgerLines: {
    width: 22,
    height: 16,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    width: 22,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },

  /* Background Canvas Sections (Seamless Earth to Galaxy - middle image removed) */
  canvasSectionEarth: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 1.5,
  },
  canvasSectionGalaxy: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 1.3,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 1.4,
  },
  earthFadeGradient: {
    flex: 1,
  },

  /* Section 1: Earth Initial Viewport Layout */
  earthHeroCenterBox: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.35,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 28,
    zIndex: 50,
  },
  poeticText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 34,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  ctaPill: {
    minWidth: 225,
  },
  scrollUpPromptBox: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.87,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 60,
  },
  chevronUp: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '900',
    lineHeight: 24,
  },
  scrollUpPromptText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  /* The Pet Soul Sprite (Completely transparent PNG on the grassy mound) */
  continuousSoulWrapper: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.57,
    left: (SCREEN_WIDTH - SCREEN_WIDTH * 0.76) / 2,
    width: SCREEN_WIDTH * 0.76,
    height: SCREEN_HEIGHT * 0.34,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 40,
  },
  soulImage: {
    width: '100%',
    height: '100%',
  },
  absoluteFillImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  /* Star Badges */
  starBadge: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 55, 0.82)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.65)',
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 14,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 45,
  },
  starGlowIcon: {
    fontSize: 13,
    color: '#FFD700',
    marginRight: 6,
  },
  starBadgeName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },

  /* Climax Section: Galactic Destination */
  topDestinationStarBox: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 2.14,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 50,
  },
  radiantStarWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  radiantGlowHalo: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 215, 0, 0.28)',
  },
  newStarBadge: {
    backgroundColor: 'rgba(15, 25, 62, 0.90)',
    borderWidth: 1,
    borderColor: '#FFD700',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginTop: 14,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.75,
    shadowRadius: 10,
  },
  newStarBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFD700',
  },
  topCosmosQuote: {
    fontSize: 21,
    fontWeight: '600',
    fontStyle: 'italic',
    color: '#E2E8F0',
    textAlign: 'center',
    lineHeight: 29,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginVertical: 14,
  },
  destinationButtonRow: {
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  revisitGroundBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  revisitGroundText: {
    fontSize: 12,
    color: '#93C5FD',
    fontWeight: '600',
  },
});

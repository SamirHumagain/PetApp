import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
  PanResponder,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ASSETS } from '../constants/assets';
import PillButton from '../components/PillButton';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Curated constellation memorial stars
const MEMORIAL_STARS = [
  { id: '1', name: 'Buddy', type: 'Golden Retriever', tribute: 'Run free across the endless golden stars.', top: '16%', left: '14%' },
  { id: '2', name: 'Luna', type: 'Persian Cat', tribute: 'Our quiet moonbeam warming the sky.', top: '14%', right: '14%' },
  { id: '3', name: 'Max', type: 'French Bulldog', tribute: 'Little body, biggest heart in the universe.', top: '28%', left: '20%' },
  { id: '4', name: 'Bella', type: 'Pomeranian', tribute: 'The sweetest little cloud of happiness.', top: '32%', right: '16%' },
  { id: '5', name: 'Charlie', type: 'Beagle', tribute: 'Always following adventure in the cosmos.', top: '44%', left: '36%' },
  { id: '6', name: 'Milo', type: 'Scottish Fold', tribute: 'Rest gently among the stars.', top: '50%', right: '20%' },
  { id: '7', name: 'Daisy', type: 'Labrador', tribute: 'Pure sunshine forever.', top: '60%', left: '14%' },
  { id: '8', name: 'Rocky', type: 'Husky', tribute: 'Howling with cosmic freedom.', top: '64%', right: '16%' },
  { id: '9', name: 'Coco', type: 'Poodle', tribute: 'Forever shining in our hearts.', top: '72%', left: '24%' },
  { id: '10', name: 'Lucy', type: 'Corgi', tribute: 'Little paws dancing among the stars.', top: '74%', right: '26%' },
];

/**
 * Memorial star component:
 * Small glowing star icon always visible in the sky.
 * Plain rounded dark pill with NAME ONLY appears on hover / tap.
 * Clean subtle dark background, NO neon yellow glow.
 */
function MemorialStar({ star, onSelectStar }) {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <View 
      style={[
        styles.starPlacement, 
        { 
          top: star.top, 
          left: star.left, 
          right: star.right 
        }
      ]}
      onMouseEnter={() => setIsRevealed(true)}
      onMouseLeave={() => setIsRevealed(false)}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          if (!isRevealed) {
            setIsRevealed(true);
          } else {
            onSelectStar && onSelectStar(star);
          }
        }}
        style={styles.starRow}
      >
        <Text style={styles.starGlyphIcon}>✦</Text>

        {isRevealed && (
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => onSelectStar && onSelectStar(star)}
            style={styles.namePill}
          >
            <Text style={styles.namePillText}>{star.name}</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  );
}

export default function JourneyScrollScreen({ 
  onBeginJourney, 
  onOpenMenu, 
  onSelectStar,
  onBack 
}) {
  // Journey progress from 0 (Earth Landing) to 1 (Fully Scrolled Universe)
  const animProgress = useRef(new Animated.Value(0)).current;
  const currentProgressRef = useRef(0);
  const [displayProgress, setDisplayProgress] = useState(0);

  // Transition out guard when transitioning to home
  const isNavigatingHomeRef = useRef(false);
  const screenFadeAnim = useRef(new Animated.Value(1)).current;

  // Idle pulse animations for prompt chevrons
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const hoverAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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

    Animated.loop(
      Animated.sequence([
        Animated.timing(hoverAnim, {
          toValue: -6,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(hoverAnim, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Update progress helper
  const updateProgress = useCallback((newVal) => {
    const clamped = Math.max(0, Math.min(1, newVal));
    currentProgressRef.current = clamped;
    animProgress.setValue(clamped);
    setDisplayProgress(clamped);
  }, [animProgress]);

  // Transition smoothly to Home page
  const triggerNavigateHome = useCallback(() => {
    if (isNavigatingHomeRef.current) return;
    isNavigatingHomeRef.current = true;

    Animated.timing(screenFadeAnim, {
      toValue: 0,
      duration: 450,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      onBeginJourney && onBeginJourney();
    });
  }, [screenFadeAnim, onBeginJourney]);

  // Smoothly ascend upwards into the stars upon clicking "Scroll Up" or CTA
  const handleAscendSmooth = useCallback(() => {
    Animated.timing(animProgress, {
      toValue: 1,
      duration: 1800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      currentProgressRef.current = 1;
      setDisplayProgress(1);
    });
  }, [animProgress]);

  // Begin journey button click: smoothly ascends and transitions to home
  const handleBeginJourneyClick = useCallback(() => {
    Animated.timing(animProgress, {
      toValue: 1,
      duration: 1600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      currentProgressRef.current = 1;
      setDisplayProgress(1);
      setTimeout(() => {
        triggerNavigateHome();
      }, 500);
    });
  }, [animProgress, triggerNavigateHome]);

  // Wheel handling for Web:
  // deltaY < 0 = SCROLL UP => ascends upward into the stars!
  // At Earth: any scroll motion initiates the journey!
  const handleWheel = useCallback((e) => {
    if (isNavigatingHomeRef.current) return;
    const delta = e.deltaY;
    const isAtEarth = currentProgressRef.current <= 0.06;

    if (delta < 0) {
      // Scrolling UP: ascends into the stars
      const step = Math.abs(delta) * 0.0022;
      updateProgress(currentProgressRef.current + step);
    } else if (delta > 0) {
      if (isAtEarth) {
        // At Earth: any scroll starts the journey upward into the stars
        const step = delta * 0.0022;
        updateProgress(currentProgressRef.current + step);
      } else if (currentProgressRef.current >= 0.85) {
        // At Universe view: scrolling down navigates to Home
        triggerNavigateHome();
      } else {
        const step = delta * 0.0022;
        updateProgress(currentProgressRef.current - step);
      }
    }
  }, [updateProgress, triggerNavigateHome]);

  // Touch / PanResponder handling for Mobile & Gestures:
  const prevYRef = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 2,
      onPanResponderGrant: (_, gestureState) => {
        prevYRef.current = gestureState.moveY;
      },
      onPanResponderMove: (_, gestureState) => {
        if (isNavigatingHomeRef.current) return;
        const dragDelta = gestureState.moveY - prevYRef.current;
        prevYRef.current = gestureState.moveY;

        const isAtEarth = currentProgressRef.current <= 0.06;

        if (isAtEarth) {
          // At Earth: any swipe initiates the upward journey into the stars!
          const step = Math.abs(dragDelta) * 0.0035;
          updateProgress(currentProgressRef.current + step);
        } else if (dragDelta > 0) {
          // Dragging DOWN (mobile "scroll up" to see sky above) -> ascends into the stars!
          const step = dragDelta * 0.0035;
          updateProgress(currentProgressRef.current + step);
        } else if (dragDelta < 0) {
          // Dragging UP (mobile "scroll down")
          if (currentProgressRef.current >= 0.85) {
            triggerNavigateHome();
          } else {
            const step = Math.abs(dragDelta) * 0.0035;
            updateProgress(currentProgressRef.current - step);
          }
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (isNavigatingHomeRef.current) return;
        if (Math.abs(gestureState.vy) > 0.35 && currentProgressRef.current <= 0.25) {
          // Flick at Earth -> smoothly ascend all the way to universe!
          handleAscendSmooth();
        } else if (gestureState.vy < -0.35 && currentProgressRef.current >= 0.80) {
          // Fast flick at universe -> navigate home
          triggerNavigateHome();
        }
      },
    })
  ).current;

  // Keyboard navigation for desktop accessibility
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const handleKeyDown = (e) => {
        if (isNavigatingHomeRef.current) return;
        if (e.key === 'ArrowUp' || e.key === 'PageUp') {
          // Scroll up into stars
          updateProgress(currentProgressRef.current + 0.2);
        } else if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
          if (currentProgressRef.current <= 0.06) {
            updateProgress(currentProgressRef.current + 0.2);
          } else if (currentProgressRef.current >= 0.85) {
            triggerNavigateHome();
          } else {
            updateProgress(currentProgressRef.current - 0.2);
          }
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [updateProgress, triggerNavigateHome]);

  // Mobile Web touch gesture listener for deployed browser environments (Brave, Chrome, Safari)
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    let startTouchY = null;

    const onWebTouchStart = (e) => {
      if (e.touches && e.touches.length > 0) {
        startTouchY = e.touches[0].clientY;
      }
    };

    const onWebTouchMove = (e) => {
      if (isNavigatingHomeRef.current || startTouchY === null) return;
      if (e.touches && e.touches.length > 0) {
        const currentTouchY = e.touches[0].clientY;
        const dragDelta = currentTouchY - startTouchY;
        startTouchY = currentTouchY;

        if (e.cancelable) {
          e.preventDefault();
        }

        const isAtEarth = currentProgressRef.current <= 0.06;

        if (isAtEarth) {
          // At Earth: any swipe initiates the upward journey into the stars!
          const step = Math.abs(dragDelta) * 0.0035;
          updateProgress(currentProgressRef.current + step);
        } else if (dragDelta > 0) {
          // Dragging DOWN (mobile "scroll up") -> ascends into the stars!
          const step = dragDelta * 0.0035;
          updateProgress(currentProgressRef.current + step);
        } else if (dragDelta < 0) {
          // Dragging UP (mobile "scroll down")
          if (currentProgressRef.current >= 0.85) {
            triggerNavigateHome();
          } else {
            const step = Math.abs(dragDelta) * 0.0035;
            updateProgress(currentProgressRef.current - step);
          }
        }
      }
    };

    const onWebTouchEnd = () => {
      startTouchY = null;
    };

    window.addEventListener('touchstart', onWebTouchStart, { passive: true });
    window.addEventListener('touchmove', onWebTouchMove, { passive: false });
    window.addEventListener('touchend', onWebTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', onWebTouchStart);
      window.removeEventListener('touchmove', onWebTouchMove);
      window.removeEventListener('touchend', onWebTouchEnd);
    };
  }, [updateProgress, triggerNavigateHome]);

  // ================= ANIMATED INTERPOLATIONS =================
  // 1. Earth Dusk Viewport (0.0 to 0.45): fades out and recedes downward as you ascend
  const earthOpacity = animProgress.interpolate({
    inputRange: [0, 0.45, 0.7],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const earthTranslateY = animProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCREEN_HEIGHT * 0.25],
    extrapolate: 'clamp',
  });

  // 2. Orbital Horizon Layer (0.15 to 0.75): curve of Earth from space
  const horizonOpacity = animProgress.interpolate({
    inputRange: [0, 0.2, 0.5, 0.8],
    outputRange: [0, 0.4, 0.85, 0],
    extrapolate: 'clamp',
  });

  // 3. Deep Cosmic Universe Layer (0.35 to 1.0): swirling spiral galaxy
  const galaxyOpacity = animProgress.interpolate({
    inputRange: [0.15, 0.55, 1],
    outputRange: [0, 0.75, 1],
    extrapolate: 'clamp',
  });

  const galaxyScale = animProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [1.1, 1],
    extrapolate: 'clamp',
  });

  // 4. Hero Title & CTA Button on Earth: fades out quickly as user ascends
  const earthHeroOpacity = animProgress.interpolate({
    inputRange: [0, 0.18],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // 5. "Scroll Up" Prompt indicator: fades out as ascent begins
  const scrollUpPromptOpacity = animProgress.interpolate({
    inputRange: [0, 0.14],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // 6. Sitting dog resting on grassy mound:
  // Strictly 1 at rest (0 to 0.08), then fades out completely by 0.14
  const sittingSoulOpacity = animProgress.interpolate({
    inputRange: [0, 0.08, 0.14],
    outputRange: [1, 1, 0],
    extrapolate: 'clamp',
  });

  // 7. Ascending flying dog soul taking flight into the stars:
  // Strictly 0 at rest (0 to 0.08), only fades in once ascent starts!
  const flyingSoulOpacity = animProgress.interpolate({
    inputRange: [0, 0.08, 0.16, 0.78, 0.92],
    outputRange: [0, 0, 1, 1, 0],
    extrapolate: 'clamp',
  });

  const flyingSoulTranslateY = animProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -SCREEN_HEIGHT * 0.38],
    extrapolate: 'clamp',
  });

  const flyingSoulScale = animProgress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.82, 0.35],
    extrapolate: 'clamp',
  });

  // 8. Constellation Memorial Stars: appear gently in the sky
  const starsGroupOpacity = animProgress.interpolate({
    inputRange: [0.12, 0.45, 1],
    outputRange: [0, 0.85, 1],
    extrapolate: 'clamp',
  });

  // 9. Fully-scrolled Universe tagline & down chevron
  const universeElementsOpacity = animProgress.interpolate({
    inputRange: [0.72, 0.95, 1],
    outputRange: [0, 0.7, 1],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View 
      style={[styles.container, { opacity: screenFadeAnim }]}
      onWheel={Platform.OS === 'web' ? handleWheel : undefined}
      {...panResponder.panHandlers}
    >
      {/* ================= FIXED TOP HEADER ================= */}
      {/* Standalone logo centered at very top, centered title below, centered subtitle below */}
      <View style={styles.fixedHeader} pointerEvents="box-none">
        {/* Optional back button if provided */}
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

        {/* Centered Brand Stack */}
        <View style={styles.headerCenterColumn}>
          {/* Standalone logo icon - paw with shooting star flourish */}
          <Image 
            source={ASSETS.logoClean} 
            style={styles.standaloneLogoIcon} 
            resizeMode="contain" 
          />
          {/* Site name centered - classic elegant serif */}
          <Text style={styles.headerSiteName}>Farewell to Stairway</Text>
          {/* Subtitle centered - lighter weight, refined serif */}
          <Text style={styles.headerSubtitle}>Pet Funeral & Memorial</Text>
        </View>

        {/* Hamburger Menu on top right */}
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

      {/* ================= BACKGROUND COSMIC LAYERS ================= */}
      {/* LAYER 3: DEEP COSMIC GALAXY (Universe Climax) */}
      <Animated.Image 
        source={ASSETS.bgFullGalaxy} 
        style={[
          styles.fullScreenBg, 
          { 
            opacity: galaxyOpacity,
            transform: [{ scale: galaxyScale }]
          }
        ]}
        resizeMode="cover"
      />

      {/* LAYER 2: EARTH ORBITAL HORIZON (Middle Ascent Transition) */}
      <Animated.Image 
        source={ASSETS.bgEarthHorizon} 
        style={[
          styles.fullScreenBg, 
          { opacity: horizonOpacity }
        ]}
        resizeMode="cover"
      />

      {/* LAYER 1: EARTH NIGHT & MOUNTAINS (Initial Resting Ground) */}
      <Animated.Image 
        source={ASSETS.bgEarthNight} 
        style={[
          styles.fullScreenBg, 
          { 
            opacity: earthOpacity,
            transform: [{ translateY: earthTranslateY }]
          }
        ]}
        resizeMode="cover"
      />

      {/* Soft gradient overlay on Earth for text contrast */}
      <Animated.View 
        style={[styles.fullScreenBg, { opacity: earthOpacity }]} 
        pointerEvents="none"
      >
        <LinearGradient
          colors={['rgba(7, 12, 30, 0.1)', 'rgba(7, 12, 30, 0.35)', 'rgba(7, 12, 30, 0.85)']}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>

      {/* ================= SECTION 1: INITIAL EARTH VIEWPORT CONTENT ================= */}
      <Animated.View 
        style={[
          styles.earthHeroCenterBox, 
          { opacity: earthHeroOpacity }
        ]}
        pointerEvents={displayProgress < 0.2 ? 'auto' : 'none'}
      >
        <Text style={styles.poeticTaglineText}>
          Every goodbye is a{"\n"}journey toward the stars.
        </Text>
        
        <PillButton 
          title="Begin the Journey →"
          onPress={handleBeginJourneyClick}
          style={styles.ctaPill}
        />
      </Animated.View>

      {/* SCROLL UP PROMPT INDICATOR (At bottom of Earth viewport) */}
      <Animated.View 
        style={[
          styles.scrollUpPromptBox, 
          { opacity: scrollUpPromptOpacity }
        ]}
        pointerEvents={displayProgress < 0.2 ? 'auto' : 'none'}
      >
        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={handleAscendSmooth}
          style={{ alignItems: 'center' }}
        >
          <Animated.View style={{ transform: [{ scale: pulseAnim }], alignItems: 'center' }}>
            <Text style={styles.chevronUpText}>⌃</Text>
            <Text style={styles.scrollUpPromptLabel}>Scroll Up</Text>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>

      {/* ================= SECTION 2: CONSTELLATION MEMORIAL STARS ================= */}
      <Animated.View 
        style={[
          styles.fullScreenBg, 
          { opacity: starsGroupOpacity }
        ]}
        pointerEvents={displayProgress > 0.15 ? 'box-none' : 'none'}
      >
        {MEMORIAL_STARS.map((star) => (
          <MemorialStar 
            key={star.id} 
            star={star} 
            onSelectStar={onSelectStar} 
          />
        ))}
      </Animated.View>

      {/* ================= SECTION 3: THE ASCENDING PET SOUL ================= */}
      <Animated.View 
        style={[
          styles.soulSpriteContainer, 
          { 
            transform: [
              { translateY: flyingSoulTranslateY },
              { translateY: hoverAnim },
              { scale: flyingSoulScale }
            ],
          }
        ]}
        pointerEvents="none"
      >
        {/* Resting sitting spirit dog (rests on Earth mound at progress 0, disappears on ascent) */}
        <Animated.Image 
          source={ASSETS.dogSitting} 
          style={[
            styles.soulImage,
            styles.absoluteFillImage,
            { opacity: sittingSoulOpacity }
          ]}
          resizeMode="contain"
        />

        {/* Flying spirit dog ascending through cosmic sky (only visible once ascent starts) */}
        <Animated.Image 
          source={ASSETS.dogAscendingSpace} 
          style={[
            styles.soulImage,
            styles.absoluteFillImage,
            { opacity: flyingSoulOpacity }
          ]}
          resizeMode="contain"
        />
      </Animated.View>

      {/* ================= SECTION 4: UNIVERSE VIEWPORT CLIMAX ================= */}
      <Animated.View 
        style={[
          styles.universeBottomContentBox, 
          { opacity: universeElementsOpacity }
        ]}
        pointerEvents={displayProgress > 0.75 ? 'auto' : 'none'}
      >
        <Text style={styles.universeTaglineText}>
          So many loved ones,{"\n"}forever in our sky.
        </Text>

        {/* Down chevron indicator: continuing scroll or tapping transitions to Home */}
        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={triggerNavigateHome}
          style={styles.scrollDownIndicator}
          hitSlop={{ top: 16, bottom: 16, left: 24, right: 24 }}
        >
          <Animated.View style={{ transform: [{ scale: pulseAnim }], alignItems: 'center' }}>
            <Text style={styles.chevronDownText}>⌄</Text>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#070C1E',
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? { touchAction: 'none' } : {}),
  },

  fullScreenBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },

  /* FIXED HEADER - STANDALONE CENTERED LOGO, TITLE, SUBTITLE */
  fixedHeader: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : 20,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenterColumn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  standaloneLogoIcon: {
    width: 38,
    height: 34,
    marginBottom: 6,
  },
  headerSiteName: {
    fontSize: 22,
    fontWeight: '400',
    color: '#FFFFFF',
    letterSpacing: 1.1,
    fontFamily: Platform.OS === 'web' 
      ? '"Cormorant Garamond", Garamond, Georgia, serif' 
      : Platform.OS === 'ios' ? 'Georgia' : 'serif',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  headerSubtitle: {
    fontSize: 11.5,
    fontWeight: '300',
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 3,
    letterSpacing: 1.8,
    fontFamily: Platform.OS === 'web' 
      ? '"Cormorant Garamond", Garamond, Georgia, serif' 
      : Platform.OS === 'ios' ? 'Georgia' : 'serif',
    textAlign: 'center',
  },
  menuCircleBtn: {
    position: 'absolute',
    right: 18,
    top: 4,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hamburgerLines: {
    width: 22,
    height: 15,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    width: 22,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  backCircleBtn: {
    position: 'absolute',
    left: 18,
    top: 4,
    width: 38,
    height: 38,
    borderRadius: 19,
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

  /* SECTION 1: EARTH HERO VIEWPORT */
  earthHeroCenterBox: {
    position: 'absolute',
    top: '32%',
    left: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 50,
  },
  poeticTaglineText: {
    fontSize: 22,
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 32,
    letterSpacing: 0.6,
    fontFamily: Platform.OS === 'web' 
      ? '"Cormorant Garamond", Garamond, Georgia, serif' 
      : Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  ctaPill: {
    minWidth: 220,
  },

  /* PROMPT: SCROLL UP */
  scrollUpPromptBox: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 32 : 18,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 60,
  },
  chevronUpText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '300',
    lineHeight: 20,
  },
  scrollUpPromptLabel: {
    fontSize: 12.5,
    color: '#FFFFFF',
    fontWeight: '400',
    letterSpacing: 1.2,
    marginTop: 2,
    fontFamily: Platform.OS === 'web' ? '"Inter", -apple-system, sans-serif' : 'sans-serif',
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  /* PET SOUL SPRITE */
  soulSpriteContainer: {
    position: 'absolute',
    top: '52%',
    left: (SCREEN_WIDTH - SCREEN_WIDTH * 0.74) / 2,
    width: SCREEN_WIDTH * 0.74,
    height: '32%',
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

  /* MEMORIAL STARS & NAME LABELS */
  starPlacement: {
    position: 'absolute',
    zIndex: 45,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  starGlyphIcon: {
    fontSize: 16,
    color: '#FFDE7A',
    textShadowColor: 'rgba(255, 222, 122, 0.75)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  namePill: {
    backgroundColor: 'rgba(8, 14, 30, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: 10,
  },
  namePillText: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#FFFFFF',
    letterSpacing: 0.4,
    fontFamily: Platform.OS === 'web' ? '"Inter", -apple-system, sans-serif' : 'sans-serif',
  },

  /* SECTION 4: UNIVERSE VIEWPORT CLIMAX */
  universeBottomContentBox: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 32 : 18,
    left: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 60,
  },
  universeTaglineText: {
    fontSize: 16.5,
    fontWeight: '500',
    fontStyle: 'normal',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 25,
    letterSpacing: 0.4,
    fontFamily: Platform.OS === 'web' ? '"Inter", -apple-system, sans-serif' : 'sans-serif',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  scrollDownIndicator: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  chevronDownText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '300',
    lineHeight: 24,
  },
});

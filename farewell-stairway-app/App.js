import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ImageBackground, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  Modal, 
  SafeAreaView, 
  StatusBar, 
  Dimensions, 
  Alert,
  Linking,
  ActivityIndicator,
  Share
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { templesList, starsList as initialStarsList, guidanceArticles } from './data/templesData';
import { create2C2PPaymentToken } from './services/paymentService';
import { supabase } from './services/supabaseClient';

const { width, height } = Dimensions.get('window');

// Advertisement banners
const promoBanners = [
  {
    id: 'ad1',
    title: 'Muang Thai Pet Insurance',
    subtitle: 'Protecting your beloved companion with peace of mind',
    tag: 'SPONSOR',
    color: '#1E3A8A'
  },
  {
    id: 'ad2',
    title: 'Pawprints Artisan Keepsake Urns',
    subtitle: 'Handcrafted ceramic & crystal memorial reliquaries',
    tag: 'MEMORIAL',
    color: '#4C1D95'
  }
];

export default function App() {
  // Navigation Screens & Tabs: 'SPLASH' | 'HOME' | 'MAP' | 'WIZARD' | 'STARS' | 'GUIDES' | 'TEMPLE_DETAIL' | 'SHARE_CARD'
  const [currentScreen, setCurrentScreen] = useState('SPLASH');
  const [selectedTab, setSelectedTab] = useState('HOME');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvinceFilter, setSelectedProvinceFilter] = useState('ALL');
  const [expandedAccordion, setExpandedAccordion] = useState('g1');

  // Interactive Constellation Stars State
  const [stars, setStars] = useState(initialStarsList);
  const [selectedStar, setSelectedStar] = useState(null);

  // Selected Temple for Inspection
  const [inspectingTemple, setInspectingTemple] = useState(templesList[0]);

  // 5-STEP BOOKING WIZARD STATE
  const [wizardStep, setWizardStep] = useState(1);
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState('Dog 🐾');
  const [petBreed, setPetBreed] = useState('');
  const [petWeight, setPetWeight] = useState('8'); // kg
  const [dateOfPassing, setDateOfPassing] = useState('Today');
  const [selectedTempleId, setSelectedTempleId] = useState('1');
  const [servicePackage, setServicePackage] = useState('TURNKEY'); // 'TURNKEY' | 'CREMATION_ONLY' | 'CREMATION_CHANTING' | 'ASH_RIVER'
  const [includePickup, setIncludePickup] = useState(true);
  const [pickupAddress, setPickupAddress] = useState('123 Sukhumvit Soi 55, Thonglor, Bangkok');
  const [ceremonyDate, setCeremonyDate] = useState('Tomorrow');
  const [ceremonyTime, setCeremonyTime] = useState('13:00 (Afternoon Ceremony)');
  const [flowerPreference, setFlowerPreference] = useState('White Lotus & Jasmine Garland');
  const [tributeMessage, setTributeMessage] = useState('Run free across the endless golden stars, forever loved.');

  // 2C2P Payment State
  const [paymentChannel, setPaymentChannel] = useState('CC'); // 'CC' | 'PROMPTPAY'
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isGeneratingToken, setIsGeneratingToken] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [latestBooking, setLatestBooking] = useState(null);

  // Helper: Active Temple
  const getSelectedTemple = () => templesList.find(t => t.id === selectedTempleId) || templesList[0];

  // Dynamic Cost Calculator based on pet weight
  const calculateTotal = () => {
    const temple = getSelectedTemple();
    const weightNum = parseFloat(petWeight) || 8;
    
    // Determine base cremation rate by weight
    let cremationRate = temple.pricing.small;
    if (weightNum > 30) cremationRate = temple.pricing.extraLarge;
    else if (weightNum > 15) cremationRate = temple.pricing.large;
    else if (weightNum >= 5) cremationRate = temple.pricing.medium;

    let base = 0;
    if (servicePackage === 'TURNKEY') base = temple.pricing.turnkey;
    else if (servicePackage === 'CREMATION_ONLY') base = cremationRate;
    else if (servicePackage === 'CREMATION_CHANTING') base = cremationRate + temple.pricing.praying1Day;
    else if (servicePackage === 'ASH_RIVER') base = cremationRate + temple.pricing.ashToRiver;

    const pickup = includePickup ? temple.pricing.pickup : 0;
    return base + pickup;
  };

  // Launch 2C2P Sandbox Payment Handshake
  const handleInitiate2C2P = async () => {
    setIsGeneratingToken(true);
    setPaymentResult(null);
    try {
      const amount = calculateTotal();
      const temple = getSelectedTemple();
      const desc = `Farewell to Stairway: ${servicePackage} for ${petName || 'Companion'} at ${temple.name}`;
      
      const res = await create2C2PPaymentToken({
        amount,
        description: desc
      });

      setPaymentResult(res);
    } catch (err) {
      console.error(err);
      Alert.alert('2C2P Gateway', err.message || 'Payment initialization error');
    } finally {
      setIsGeneratingToken(false);
    }
  };

  // Confirm Payment & Ascend Star to Constellation
  const handleConfirmPaid = async () => {
    const temple = getSelectedTemple();
    const invoiceNumber = paymentResult?.invoiceNo || `INV-${Date.now()}`;
    const totalCost = calculateTotal();
    const starX = Math.floor(20 + Math.random() * 60);
    const starY = Math.floor(20 + Math.random() * 55);

    const newStar = {
      id: `star-${Date.now()}`,
      name: petName || 'Beloved Angel',
      type: `${petType} (${petBreed || 'Companion'})`,
      years: '2026',
      x: starX,
      y: starY,
      color: '#FFD700',
      tribute: tributeMessage || 'Shining brightly forever in our hearts.',
      temple: temple.name,
      likes: 1
    };

    setStars(prev => [newStar, ...prev]);
    setLatestBooking({
      petName,
      petType,
      templeName: temple.name,
      amount: totalCost,
      invoiceNo: invoiceNumber,
      star: newStar
    });
    setPaymentSuccess(true);

    // Save to live Supabase database
    try {
      const bNum = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
      const weightNum = parseFloat(petWeight) || 8;
      const petSizeVal = weightNum > 30 ? 'EXTRA_LARGE' : (weightNum > 15 ? 'LARGE' : (weightNum >= 5 ? 'MEDIUM' : 'SMALL'));

      const { data: bData } = await supabase.from('bookings').insert([{
        booking_number: bNum,
        temple_id: temple.id && temple.id.length > 10 ? temple.id : '11111111-1111-1111-1111-111111111101',
        pet_name: petName || 'Beloved Companion',
        pet_type: petType,
        pet_breed: petBreed || 'Companion',
        pet_weight_kg: weightNum,
        pet_size: petSizeVal,
        date_of_passing: new Date().toISOString().split('T')[0],
        service_type: servicePackage,
        ceremony_date: new Date().toISOString().split('T')[0],
        ceremony_time: ceremonyTime.split(' ')[0] || '13:00',
        include_pickup: includePickup,
        pickup_address: pickupAddress,
        subtotal_amount: totalCost - (includePickup ? temple.pricing.pickup : 0),
        pickup_fee: includePickup ? temple.pricing.pickup : 0,
        total_amount: totalCost,
        status: 'CONFIRMED'
      }]).select();

      if (bData && bData.length > 0) {
        const bookingId = bData[0].id;
        // Insert Payment record
        await supabase.from('payments').insert([{
          booking_id: bookingId,
          invoice_no: invoiceNumber,
          amount: totalCost,
          currency: 'THB',
          channel: paymentChannel || 'CC',
          payment_token: paymentResult?.paymentToken || '',
          web_payment_url: paymentResult?.webPaymentUrl || '',
          status: 'PAID',
          paid_at: new Date().toISOString()
        }]);

        // Insert Memorial Star record
        await supabase.from('memorials').insert([{
          booking_id: bookingId,
          pet_name: petName || 'Beloved Companion',
          pet_type: `${petType} (${petBreed || 'Companion'})`,
          years_lived: '2026',
          tribute_message: tributeMessage || 'Shining brightly forever in our hearts.',
          star_x: starX,
          star_y: starY,
          star_color: '#FFD700',
          is_star_memorial: true,
          likes_count: 1
        }]);
      }
    } catch (dbErr) {
      console.warn('Could not save to Supabase:', dbErr);
    }
  };

  // Like a Memorial Star (Light a Candle / Lotus Offering)
  const handleOfferLotusToStar = (starId) => {
    setStars(prev => prev.map(s => {
      if (s.id === starId) {
        const newLikes = (s.likes || 0) + 1;
        if (selectedStar && selectedStar.id === starId) {
          setSelectedStar({ ...selectedStar, likes: newLikes });
        }
        return { ...s, likes: newLikes };
      }
      return s;
    }));
    Alert.alert('Lotus Offering 🪷', `You offered a ceremonial lotus and light to ${selectedStar?.name || 'this star'}. May their journey be peaceful.`);
  };

  // Social Share Action (Facebook, TikTok, LINE)
  const handleShareMemorial = async (platform) => {
    const star = latestBooking?.star || selectedStar || stars[0];
    const message = `✨ In loving memory of ${star.name} (${star.type}).\n"${star.tribute}"\nShining forever in the Farewell to Stairway celestial constellation.\n🌟 View memorial: https://farewelltostairway.app/star/${star.id}`;

    if (platform === 'NATIVE') {
      try {
        await Share.share({ message, title: `Memorial for ${star.name}` });
      } catch (err) {
        console.error(err);
      }
    } else {
      Alert.alert(`Share on ${platform}`, `Generated photo card and memorial link ready for ${platform}!\n\nLink copied to clipboard.`);
    }
  };

  // Google Maps Turn-by-Turn GPS
  const openGPSDirections = (temple) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${temple.lat},${temple.lng}&destination_place_id=${encodeURIComponent(temple.name)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Navigation', `Location: ${temple.lat}, ${temple.lng}`);
    });
  };

  // Filtered Temples List
  const filteredTemples = templesList.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProvince = selectedProvinceFilter === 'ALL' || t.district.includes(selectedProvinceFilter);
    return matchesSearch && matchesProvince;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* SCREEN 1: SPLASH ONBOARDING */}
      {currentScreen === 'SPLASH' && (
        <ImageBackground 
          source={require('./assets/bg_earth_night.jpg')} 
          style={styles.fullBackground}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(7, 11, 26, 0.4)', 'rgba(7, 11, 26, 0.88)']}
            style={styles.gradientOverlay}
          >
            <View style={styles.splashContent}>
              <View style={styles.pawLogoBadge}>
                <Text style={styles.pawIcon}>🐾</Text>
              </View>
              <Text style={styles.splashTitle}>Farewell to Stairway</Text>
              <Text style={styles.splashSubtitle}>PET FUNERAL & CELESTIAL MEMORIAL</Text>
              
              <Text style={styles.splashTagline}>
                "Every goodbye is a gentle journey toward the stars."
              </Text>

              <TouchableOpacity 
                style={styles.primaryPillButton}
                activeOpacity={0.8}
                onPress={() => {
                  setCurrentScreen('HOME');
                  setSelectedTab('HOME');
                }}
              >
                <LinearGradient
                  colors={['#7B2FBE', '#4A90D9']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientButton}
                >
                  <Text style={styles.primaryButtonText}>Begin the Journey →</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.skipLink}
                onPress={() => {
                  setCurrentScreen('WIZARD');
                  setSelectedTab('WIZARD');
                  setWizardStep(1);
                }}
              >
                <Text style={styles.skipLinkText}>Quick Book Funeral (5-Step Wizard)</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </ImageBackground>
      )}

      {/* MAIN SHELL WITH HEADER & BOTTOM TABS */}
      {currentScreen !== 'SPLASH' && (
        <View style={{ flex: 1 }}>
          
          {/* TOP APP BAR */}
          <View style={styles.mainAppBar}>
            <TouchableOpacity 
              style={styles.iconCircleButton}
              onPress={() => setIsDrawerOpen(true)}
            >
              <Text style={styles.menuIconText}>☰</Text>
            </TouchableOpacity>
            <View style={styles.appBarTitleArea}>
              <Text style={styles.mainTitleText}>Farewell to Stairway</Text>
              <Text style={styles.mainSubText}>
                {selectedTab === 'HOME' && 'Temple Directory & Costing'}
                {selectedTab === 'MAP' && 'GPS Map & Navigation'}
                {selectedTab === 'WIZARD' && `Booking Wizard (${wizardStep}/5)`}
                {selectedTab === 'STARS' && 'Constellation of Loved Ones'}
                {selectedTab === 'GUIDES' && 'Care & Cremation Guidance'}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.actionIconButton}
              onPress={() => {
                setCurrentScreen('STARS');
                setSelectedTab('STARS');
              }}
            >
              <Text style={styles.starBadgeIcon}>✨</Text>
            </TouchableOpacity>
          </View>

          {/* TAB 1: HOME SCREEN (FEATURED TEMPLES + DIRECTORY + ACCORDIONS + ADS) */}
          {selectedTab === 'HOME' && (
            <ScrollView 
              style={styles.scrollFlex} 
              contentContainerStyle={styles.scrollPadding}
              showsVerticalScrollIndicator={false}
            >
              {/* Promo Banner Carousel */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.adsRow}>
                {promoBanners.map(ad => (
                  <View key={ad.id} style={[styles.adCard, { backgroundColor: ad.color }]}>
                    <View style={styles.adHeader}>
                      <Text style={styles.adTag}>{ad.tag}</Text>
                      <Text style={styles.adLearn}>Learn More ↗</Text>
                    </View>
                    <Text style={styles.adTitle}>{ad.title}</Text>
                    <Text style={styles.adSub}>{ad.subtitle}</Text>
                  </View>
                ))}
              </ScrollView>

              {/* Search Bar */}
              <View style={styles.searchContainer}>
                <Text style={styles.searchPrefixIcon}>🔍</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search temple by name, district, or province..."
                  placeholderTextColor="#6F80A8"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              {/* Province Filter Chips */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
                {[
                  { key: 'ALL', label: 'All Temples (8)' },
                  { key: 'Bangkok', label: '📍 Bangkok' },
                  { key: 'Nonthaburi', label: '📍 Nonthaburi' },
                  { key: 'Chiang Mai', label: '📍 Chiang Mai' }
                ].map(chip => (
                  <TouchableOpacity
                    key={chip.key}
                    style={[styles.filterChip, selectedProvinceFilter === chip.key && styles.activeFilterChip]}
                    onPress={() => setSelectedProvinceFilter(chip.key)}
                  >
                    <Text style={[styles.filterChipText, selectedProvinceFilter === chip.key && styles.activeFilterChipText]}>
                      {chip.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Featured Temples Horizontal Scroll */}
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionHeaderTitle}>Featured Verified Temples</Text>
                <TouchableOpacity onPress={() => setSelectedTab('MAP')}>
                  <Text style={styles.sectionActionText}>View on Map ➔</Text>
                </TouchableOpacity>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredRow}>
                {templesList.slice(0, 4).map(t => (
                  <TouchableOpacity 
                    key={t.id} 
                    style={styles.featuredCard}
                    activeOpacity={0.85}
                    onPress={() => {
                      setInspectingTemple(t);
                      setCurrentScreen('TEMPLE_DETAIL');
                    }}
                  >
                    <View style={styles.featuredTop}>
                      <Text style={styles.featuredBadge}>★ {t.rating}</Text>
                      <Text style={styles.featuredTurnkey}>Turnkey ฿{t.pricing.turnkey.toLocaleString()}</Text>
                    </View>
                    <Text style={styles.featuredName} numberOfLines={1}>{t.name}</Text>
                    <Text style={styles.featuredTh} numberOfLines={1}>{t.nameTh}</Text>
                    <Text style={styles.featuredLocation}>📍 {t.district}</Text>
                    <View style={styles.featuredBottomRow}>
                      <Text style={styles.featuredSmallPrice}>Small Dog: ฿{t.pricing.small.toLocaleString()}</Text>
                      <Text style={styles.featuredArrow}>Details →</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Educational Accordions */}
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionHeaderTitle}>Essential Funeral Guidance</Text>
                <TouchableOpacity onPress={() => setSelectedTab('GUIDES')}>
                  <Text style={styles.sectionActionText}>All Articles ➔</Text>
                </TouchableOpacity>
              </View>

              {guidanceArticles.map(article => {
                const isExpanded = expandedAccordion === article.id;
                return (
                  <View key={article.id} style={styles.accordionBox}>
                    <TouchableOpacity 
                      style={styles.accordionHeader}
                      onPress={() => setExpandedAccordion(isExpanded ? null : article.id)}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={styles.accordionTitle}>{article.title}</Text>
                        <Text style={styles.accordionTh}>{article.titleTh}</Text>
                      </View>
                      <Text style={styles.accordionChevron}>{isExpanded ? '▲' : '▼'}</Text>
                    </TouchableOpacity>

                    {isExpanded && (
                      <View style={styles.accordionBody}>
                        {article.tips.map((tip, idx) => (
                          <Text key={idx} style={styles.accordionTipText}>• {tip}</Text>
                        ))}
                      </View>
                    )}
                  </View>
                );
              })}

              {/* All Temple Costing Cards List */}
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionHeaderTitle}>All Temple Costing & Packages</Text>
                <Text style={styles.sectionCountText}>{filteredTemples.length} available</Text>
              </View>

              {filteredTemples.map(temple => (
                <View key={temple.id} style={styles.templeCard}>
                  <View style={styles.templeCardHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.templeCardName}>{temple.name}</Text>
                      <Text style={styles.templeCardNameTh}>{temple.nameTh}</Text>
                      <Text style={styles.templeCardAddress}>📍 {temple.address}</Text>
                    </View>
                    <View style={styles.ratingBadge}>
                      <Text style={styles.ratingText}>★ {temple.rating}</Text>
                    </View>
                  </View>

                  {/* 4-Column Costing Matrix */}
                  <View style={styles.costingGrid}>
                    <View style={styles.costCol}>
                      <Text style={styles.costLabel}>Small (&lt;5kg)</Text>
                      <Text style={styles.costValue}>฿{temple.pricing.small.toLocaleString()}</Text>
                    </View>
                    <View style={styles.costCol}>
                      <Text style={styles.costLabel}>Medium (5-15kg)</Text>
                      <Text style={styles.costValue}>฿{temple.pricing.medium.toLocaleString()}</Text>
                    </View>
                    <View style={styles.costCol}>
                      <Text style={styles.costLabel}>Large (&gt;15kg)</Text>
                      <Text style={styles.costValue}>฿{temple.pricing.large.toLocaleString()}</Text>
                    </View>
                    <View style={styles.costColHighlight}>
                      <Text style={styles.costLabelHighlight}>Full Turnkey</Text>
                      <Text style={styles.costValueHighlight}>฿{temple.pricing.turnkey.toLocaleString()}</Text>
                    </View>
                  </View>

                  <View style={styles.extraCostsRow}>
                    <Text style={styles.extraCostItem}>🕊 Praying (1d): ฿{temple.pricing.praying1Day.toLocaleString()}</Text>
                    <Text style={styles.extraCostItem}>🌊 Ash to River: ฿{temple.pricing.ashToRiver.toLocaleString()}</Text>
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.cardActionsRow}>
                    <TouchableOpacity 
                      style={styles.gpsButton}
                      onPress={() => openGPSDirections(temple)}
                    >
                      <Text style={styles.gpsButtonText}>📍 Directions</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.inspectButton}
                      onPress={() => {
                        setInspectingTemple(temple);
                        setCurrentScreen('TEMPLE_DETAIL');
                      }}
                    >
                      <Text style={styles.inspectButtonText}>Full Rates</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.bookCardButton}
                      onPress={() => {
                        setSelectedTempleId(temple.id);
                        setSelectedTab('WIZARD');
                        setWizardStep(1);
                      }}
                    >
                      <LinearGradient
                        colors={['#7B2FBE', '#4A90D9']}
                        style={styles.bookButtonGradient}
                      >
                        <Text style={styles.bookButtonText}>Book Ceremony →</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              <View style={{ height: 40 }} />
            </ScrollView>
          )}

          {/* TAB 2: GPS MAP SCREEN */}
          {selectedTab === 'MAP' && (
            <View style={styles.screenFlex}>
              <View style={styles.mapTopControl}>
                <Text style={styles.mapTopHeading}>Temple Locations & Directions (GPS)</Text>
                <Text style={styles.mapTopSub}>One-touch route calculation and temple hotline</Text>
              </View>

              <ScrollView style={styles.mapTemplesScroll} showsVerticalScrollIndicator={false}>
                {templesList.map(temple => (
                  <View key={temple.id} style={styles.mapTempleCard}>
                    <View style={styles.mapTempleTop}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.mapTempleTitle}>{temple.name}</Text>
                        <Text style={styles.mapTempleTh}>{temple.nameTh}</Text>
                        <Text style={styles.mapTempleCoords}>GPS: {temple.lat.toFixed(4)}° N, {temple.lng.toFixed(4)}° E</Text>
                      </View>
                      <View style={styles.mapPriceBadge}>
                        <Text style={styles.mapPriceText}>From ฿{temple.pricing.small.toLocaleString()}</Text>
                      </View>
                    </View>

                    <Text style={styles.mapAddressText}>📍 {temple.address}</Text>

                    <View style={styles.mapActionsBar}>
                      <TouchableOpacity 
                        style={styles.mapDirectionsCTA}
                        onPress={() => openGPSDirections(temple)}
                      >
                        <LinearGradient
                          colors={['#10B981', '#059669']}
                          style={styles.directionsGradient}
                        >
                          <Text style={styles.directionsCTAText}>🧭 Navigate via Google Maps</Text>
                        </LinearGradient>
                      </TouchableOpacity>

                      <TouchableOpacity 
                        style={styles.mapCallCTA}
                        onPress={() => Alert.alert('Temple Helpline', `${temple.name}\nPhone: ${temple.phone}`)}
                      >
                        <Text style={styles.mapCallCTAText}>📞 {temple.phone}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
                <View style={{ height: 60 }} />
              </ScrollView>
            </View>
          )}

          {/* TAB 3: 5-STEP BOOKING WIZARD & 2C2P CHECKOUT */}
          {selectedTab === 'WIZARD' && (
            <ScrollView 
              style={styles.formScroll} 
              contentContainerStyle={styles.formScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Step Progress Bar */}
              <View style={styles.wizardProgressRow}>
                {[1, 2, 3, 4, 5].map(step => (
                  <TouchableOpacity 
                    key={step}
                    style={[styles.wizardStepDot, wizardStep === step && styles.activeWizardStepDot, wizardStep > step && styles.completedWizardStepDot]}
                    onPress={() => setWizardStep(step)}
                  >
                    <Text style={[styles.wizardStepText, wizardStep === step && styles.activeWizardStepText]}>{step}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* STEP 1: PET DETAILS */}
              {wizardStep === 1 && (
                <View style={styles.wizardSection}>
                  <Text style={styles.wizardTitle}>Step 1: Beloved Companion Details</Text>
                  <Text style={styles.wizardDesc}>Tell us about your faithful friend so we can prepare their blessing.</Text>

                  <Text style={styles.formLabel}>Pet Name <Text style={styles.reqStar}>*</Text></Text>
                  <TextInput
                    style={styles.glassInput}
                    placeholder="e.g. Buddy, Luna, Max"
                    placeholderTextColor="#6F80A8"
                    value={petName}
                    onChangeText={setPetName}
                  />

                  <Text style={styles.formLabel}>Species / Type <Text style={styles.reqStar}>*</Text></Text>
                  <View style={styles.petTypeRow}>
                    {['Dog 🐾', 'Cat 🐱', 'Bird 🦜', 'Rabbit 🐰'].map(type => (
                      <TouchableOpacity
                        key={type}
                        style={[styles.typePill, petType === type && styles.activeTypePill]}
                        onPress={() => setPetType(type)}
                      >
                        <Text style={[styles.typePillText, petType === type && styles.activeTypePillText]}>
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={styles.formLabel}>Breed (Optional)</Text>
                  <TextInput
                    style={styles.glassInput}
                    placeholder="e.g. Golden Retriever, Persian, Frenchie"
                    placeholderTextColor="#6F80A8"
                    value={petBreed}
                    onChangeText={setPetBreed}
                  />

                  <Text style={styles.formLabel}>Approximate Weight (kg) <Text style={styles.reqStar}>*</Text></Text>
                  <TextInput
                    style={styles.glassInput}
                    placeholder="e.g. 8"
                    keyboardType="numeric"
                    placeholderTextColor="#6F80A8"
                    value={petWeight}
                    onChangeText={setPetWeight}
                  />
                  <Text style={styles.helperText}>Weight determines cremator chamber preparation and eco tray sizing.</Text>

                  <TouchableOpacity 
                    style={styles.nextStepBtn}
                    onPress={() => {
                      if (!petName.trim()) {
                        Alert.alert('Required', 'Please enter your pet companion name');
                        return;
                      }
                      setWizardStep(2);
                    }}
                  >
                    <Text style={styles.nextStepBtnText}>Next: Choose Services & Temple →</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* STEP 2: CHOOSE SERVICES & TEMPLE */}
              {wizardStep === 2 && (
                <View style={styles.wizardSection}>
                  <Text style={styles.wizardTitle}>Step 2: Temple & Service Selection</Text>
                  <Text style={styles.wizardDesc}>Choose the sacred ground and memorial ceremony package.</Text>

                  <Text style={styles.formLabel}>Select Temple</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templeSelectorScroll}>
                    {templesList.map(temple => (
                      <TouchableOpacity
                        key={temple.id}
                        style={[styles.templeOptionCard, selectedTempleId === temple.id && styles.activeTempleOptionCard]}
                        onPress={() => setSelectedTempleId(temple.id)}
                      >
                        <Text style={[styles.templeOptionName, selectedTempleId === temple.id && styles.activeTempleOptionName]}>
                          {temple.name}
                        </Text>
                        <Text style={styles.templeOptionDistrict}>{temple.district}</Text>
                        <Text style={styles.templeOptionPrice}>Turnkey ฿{temple.pricing.turnkey.toLocaleString()}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <Text style={styles.formLabel}>Ceremony Package</Text>
                  <TouchableOpacity 
                    style={[styles.serviceOption, servicePackage === 'TURNKEY' && styles.activeServiceOption]}
                    onPress={() => setServicePackage('TURNKEY')}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.serviceTitle}>🌟 Full Turnkey Package (All-Inclusive)</Text>
                      <Text style={styles.serviceDesc}>Pickup, 1-day monk chanting, individual cremation, Chao Phraya ash boat, memorial star.</Text>
                    </View>
                    <Text style={styles.servicePriceText}>฿{getSelectedTemple().pricing.turnkey.toLocaleString()}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.serviceOption, servicePackage === 'CREMATION_CHANTING' && styles.activeServiceOption]}
                    onPress={() => setServicePackage('CREMATION_CHANTING')}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.serviceTitle}>🕯 Cremation + 1-Day Monk Chanting</Text>
                      <Text style={styles.serviceDesc}>Buddhist merit-making rituals and bone relic presentation.</Text>
                    </View>
                    <Text style={styles.servicePriceText}>฿{(getSelectedTemple().pricing.medium + getSelectedTemple().pricing.praying1Day).toLocaleString()}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.serviceOption, servicePackage === 'ASH_RIVER' && styles.activeServiceOption]}
                    onPress={() => setServicePackage('ASH_RIVER')}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.serviceTitle}>🌊 Cremation + Ash to River (Loi Angkhan)</Text>
                      <Text style={styles.serviceDesc}>Scattering of ashes in the sacred waters with flower garlands.</Text>
                    </View>
                    <Text style={styles.servicePriceText}>฿{(getSelectedTemple().pricing.medium + getSelectedTemple().pricing.ashToRiver).toLocaleString()}</Text>
                  </TouchableOpacity>

                  <View style={styles.wizardBtnRow}>
                    <TouchableOpacity style={styles.prevStepBtn} onPress={() => setWizardStep(1)}>
                      <Text style={styles.prevStepBtnText}>← Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.nextStepBtn, { flex: 2 }]} onPress={() => setWizardStep(3)}>
                      <Text style={styles.nextStepBtnText}>Next: Schedule Date →</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* STEP 3: SCHEDULE DATE & TIME */}
              {wizardStep === 3 && (
                <View style={styles.wizardSection}>
                  <Text style={styles.wizardTitle}>Step 3: Ceremony Schedule</Text>
                  <Text style={styles.wizardDesc}>Choose your family's preferred date and prayer time slot.</Text>

                  <Text style={styles.formLabel}>Ceremony Date</Text>
                  <View style={styles.dateSelectorRow}>
                    {['Today (Urgent)', 'Tomorrow', 'In 2 Days'].map(d => (
                      <TouchableOpacity 
                        key={d} 
                        style={[styles.datePill, ceremonyDate === d && styles.activeDatePill]}
                        onPress={() => setCeremonyDate(d)}
                      >
                        <Text style={[styles.datePillText, ceremonyDate === d && styles.activeDatePillText]}>{d}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={styles.formLabel}>Time Slot</Text>
                  {[
                    '10:00 (Morning Buddhist Chant)',
                    '13:00 (Afternoon Ceremony)',
                    '15:30 (Sunset Cremation & Ash Dispersal)'
                  ].map(slot => (
                    <TouchableOpacity 
                      key={slot}
                      style={[styles.timeSlotCard, ceremonyTime === slot && styles.activeTimeSlotCard]}
                      onPress={() => setCeremonyTime(slot)}
                    >
                      <Text style={[styles.timeSlotText, ceremonyTime === slot && styles.activeTimeSlotText]}>
                        {slot}
                      </Text>
                      {ceremonyTime === slot && <Text style={styles.timeSlotCheck}>✓ Selected</Text>}
                    </TouchableOpacity>
                  ))}

                  <View style={styles.wizardBtnRow}>
                    <TouchableOpacity style={styles.prevStepBtn} onPress={() => setWizardStep(2)}>
                      <Text style={styles.prevStepBtnText}>← Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.nextStepBtn, { flex: 2 }]} onPress={() => setWizardStep(4)}>
                      <Text style={styles.nextStepBtnText}>Next: Transport & Message →</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* STEP 4: BODY TRANSPORT & TRIBUTE */}
              {wizardStep === 4 && (
                <View style={styles.wizardSection}>
                  <Text style={styles.wizardTitle}>Step 4: Body Transport & Loving Tribute</Text>
                  <Text style={styles.wizardDesc}>Arrange safe transfer and write their inscription for the celestial stars.</Text>

                  {/* Pickup Checkbox */}
                  <TouchableOpacity 
                    style={styles.checkboxRow}
                    onPress={() => setIncludePickup(!includePickup)}
                  >
                    <View style={[styles.checkboxBox, includePickup && styles.checkedBox]}>
                      {includePickup && <Text style={styles.checkMark}>✓</Text>}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.checkboxTitle}>Temperature-Controlled Body Transport</Text>
                      <Text style={styles.checkboxDesc}>Respectful pickup from home or veterinary hospital (+฿{getSelectedTemple().pricing.pickup})</Text>
                    </View>
                  </TouchableOpacity>

                  {includePickup && (
                    <View style={{ marginTop: 8 }}>
                      <Text style={styles.formLabel}>Pickup Address in Bangkok / Chiang Mai</Text>
                      <TextInput
                        style={styles.glassInput}
                        placeholder="Enter full address for ambulance pickup"
                        placeholderTextColor="#6F80A8"
                        value={pickupAddress}
                        onChangeText={setPickupAddress}
                      />
                    </View>
                  )}

                  <Text style={styles.formLabel}>Flower Garland Preference</Text>
                  <TextInput
                    style={styles.glassInput}
                    value={flowerPreference}
                    onChangeText={setFlowerPreference}
                  />

                  <Text style={styles.formLabel}>Loving Memorial Message</Text>
                  <TextInput
                    style={[styles.glassInput, styles.textAreaInput]}
                    placeholder="Share a loving tribute to accompany their star..."
                    placeholderTextColor="#6F80A8"
                    multiline
                    numberOfLines={3}
                    value={tributeMessage}
                    onChangeText={setTributeMessage}
                  />

                  <View style={styles.wizardBtnRow}>
                    <TouchableOpacity style={styles.prevStepBtn} onPress={() => setWizardStep(3)}>
                      <Text style={styles.prevStepBtnText}>← Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.nextStepBtn, { flex: 2 }]} onPress={() => setWizardStep(5)}>
                      <Text style={styles.nextStepBtnText}>Next: Review & Pay →</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* STEP 5: ORDER SUMMARY & 2C2P PAYMENT */}
              {wizardStep === 5 && (
                <View style={styles.wizardSection}>
                  <Text style={styles.wizardTitle}>Step 5: Order Review & 2C2P Checkout</Text>
                  <Text style={styles.wizardDesc}>Confirm your ceremony details and pay securely via 2C2P Gateway.</Text>

                  {/* Order Summary Box */}
                  <View style={styles.orderSummaryCard}>
                    <View style={styles.summaryItemRow}>
                      <Text style={styles.summaryItemKey}>Pet Companion:</Text>
                      <Text style={styles.summaryItemVal}>{petName} ({petType})</Text>
                    </View>
                    <View style={styles.summaryItemRow}>
                      <Text style={styles.summaryItemKey}>Selected Temple:</Text>
                      <Text style={styles.summaryItemVal}>{getSelectedTemple().name}</Text>
                    </View>
                    <View style={styles.summaryItemRow}>
                      <Text style={styles.summaryItemKey}>Package Tier:</Text>
                      <Text style={styles.summaryItemVal}>{servicePackage}</Text>
                    </View>
                    <View style={styles.summaryItemRow}>
                      <Text style={styles.summaryItemKey}>Schedule:</Text>
                      <Text style={styles.summaryItemVal}>{ceremonyDate} • {ceremonyTime.split(' ')[0]}</Text>
                    </View>
                    <View style={styles.summaryItemRow}>
                      <Text style={styles.summaryItemKey}>Body Transport:</Text>
                      <Text style={styles.summaryItemVal}>{includePickup ? `Yes (+฿${getSelectedTemple().pricing.pickup})` : 'Self Transport'}</Text>
                    </View>

                    <View style={styles.summaryDivider} />

                    <View style={styles.summaryTotalRow}>
                      <Text style={styles.summaryTotalLabel}>Total Amount (THB):</Text>
                      <Text style={styles.summaryTotalAmount}>฿{calculateTotal().toLocaleString()}</Text>
                    </View>
                  </View>

                  {/* Payment Channel Selector */}
                  <Text style={styles.formLabel}>Choose Payment Method</Text>
                  <View style={styles.paymentMethodRow}>
                    <TouchableOpacity 
                      style={[styles.paymentMethodBtn, paymentChannel === 'CC' && styles.activePaymentMethodBtn]}
                      onPress={() => setPaymentChannel('CC')}
                    >
                      <Text style={styles.paymentMethodIcon}>💳</Text>
                      <Text style={[styles.paymentMethodText, paymentChannel === 'CC' && styles.activePaymentMethodText]}>
                        Credit / Debit Card
                      </Text>
                      <Text style={styles.paymentMethodSub}>Visa • MasterCard</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.paymentMethodBtn, paymentChannel === 'PROMPTPAY' && styles.activePaymentMethodBtn]}
                      onPress={() => setPaymentChannel('PROMPTPAY')}
                    >
                      <Text style={styles.paymentMethodIcon}>📱</Text>
                      <Text style={[styles.paymentMethodText, paymentChannel === 'PROMPTPAY' && styles.activePaymentMethodText]}>
                        PromptPay QR
                      </Text>
                      <Text style={styles.paymentMethodSub}>Thai QR Scan</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Checkout Button */}
                  <TouchableOpacity 
                    style={styles.submitPillButton}
                    activeOpacity={0.85}
                    onPress={() => {
                      setIsPaymentModalOpen(true);
                      handleInitiate2C2P();
                    }}
                  >
                    <LinearGradient
                      colors={['#7B2FBE', '#4A90D9']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.gradientButton}
                    >
                      <Text style={styles.primaryButtonText}>
                        🔒 Pay ฿{calculateTotal().toLocaleString()} via 2C2P
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.prevStepBtn} onPress={() => setWizardStep(4)}>
                    <Text style={styles.prevStepBtnText}>← Edit Ceremony Details</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={{ height: 40 }} />
            </ScrollView>
          )}

          {/* TAB 4: CELESTIAL MEMORIAL STARS */}
          {selectedTab === 'STARS' && (
            <ImageBackground 
              source={require('./assets/bg_full_galaxy.jpg')} 
              style={styles.fullBackground}
              resizeMode="cover"
            >
              <View style={styles.starsInstructionBox}>
                <Text style={styles.starsInstructionTitle}>Constellation of Ascended Souls</Text>
                <Text style={styles.starsInstruction}>
                  Tap any glowing star to view tribute or offer a lotus
                </Text>
              </View>

              <View style={styles.starSkyCanvas}>
                {stars.map(star => (
                  <TouchableOpacity
                    key={star.id}
                    style={[styles.starTouchable, { left: `${star.x}%`, top: `${star.y}%` }]}
                    activeOpacity={0.7}
                    onPress={() => setSelectedStar(star)}
                  >
                    <View style={[styles.starCore, { backgroundColor: star.color, shadowColor: star.color }]}>
                      <View style={[styles.starHalo, { backgroundColor: star.color }]} />
                    </View>
                    <Text style={styles.starNameLabel}>{star.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.bottomFloatingContainer}>
                <TouchableOpacity 
                  style={styles.memorialPillButton}
                  activeOpacity={0.8}
                  onPress={() => {
                    setSelectedTab('WIZARD');
                    setWizardStep(1);
                  }}
                >
                  <LinearGradient
                    colors={['#7B2FBE', '#4A90D9']}
                    style={styles.gradientButton}
                  >
                    <Text style={styles.primaryButtonText}>✨ Dedicate a Star for Your Pet</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          )}

          {/* TAB 5: CARE GUIDES & ARTICLES */}
          {selectedTab === 'GUIDES' && (
            <ScrollView style={styles.scrollFlex} contentContainerStyle={styles.scrollPadding}>
              <Text style={styles.guideHeaderHeading}>How to Prepare for Pet Funeral Rites</Text>
              <Text style={styles.guideHeaderSub}>Practical steps and eco crematorium rules for caring families</Text>

              {guidanceArticles.map(art => (
                <View key={art.id} style={styles.articleCard}>
                  <View style={styles.articleHeader}>
                    <Text style={styles.articleBadge}>{art.category}</Text>
                    <Text style={styles.articleReadTime}>⏱ {art.readTime}</Text>
                  </View>
                  <Text style={styles.articleTitle}>{art.title}</Text>
                  <Text style={styles.articleTitleTh}>{art.titleTh}</Text>
                  <View style={styles.tipsList}>
                    {art.tips.map((tip, idx) => (
                      <Text key={idx} style={styles.tipText}>• {tip}</Text>
                    ))}
                  </View>
                </View>
              ))}
              <View style={{ height: 40 }} />
            </ScrollView>
          )}

          {/* BOTTOM TAB NAVIGATION BAR */}
          <View style={styles.bottomTabBar}>
            <TouchableOpacity 
              style={styles.tabButton} 
              onPress={() => setSelectedTab('HOME')}
            >
              <Text style={[styles.tabIcon, selectedTab === 'HOME' && styles.activeTabIcon]}>⛩</Text>
              <Text style={[styles.tabLabel, selectedTab === 'HOME' && styles.activeTabLabel]}>Temples</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.tabButton} 
              onPress={() => setSelectedTab('MAP')}
            >
              <Text style={[styles.tabIcon, selectedTab === 'MAP' && styles.activeTabIcon]}>🗺</Text>
              <Text style={[styles.tabLabel, selectedTab === 'MAP' && styles.activeTabLabel]}>GPS Map</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.tabButton} 
              onPress={() => {
                setSelectedTab('WIZARD');
                setWizardStep(1);
              }}
            >
              <Text style={[styles.tabIcon, selectedTab === 'WIZARD' && styles.activeTabIcon]}>📋</Text>
              <Text style={[styles.tabLabel, selectedTab === 'WIZARD' && styles.activeTabLabel]}>Wizard</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.tabButton} 
              onPress={() => setSelectedTab('STARS')}
            >
              <Text style={[styles.tabIcon, selectedTab === 'STARS' && styles.activeTabIcon]}>✨</Text>
              <Text style={[styles.tabLabel, selectedTab === 'STARS' && styles.activeTabLabel]}>Stars</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.tabButton} 
              onPress={() => setSelectedTab('GUIDES')}
            >
              <Text style={[styles.tabIcon, selectedTab === 'GUIDES' && styles.activeTabIcon]}>📖</Text>
              <Text style={[styles.tabLabel, selectedTab === 'GUIDES' && styles.activeTabLabel]}>Guides</Text>
            </TouchableOpacity>
          </View>

        </View>
      )}

      {/* 2C2P PAYMENT CHECKOUT MODAL */}
      <Modal 
        visible={isPaymentModalOpen} 
        transparent 
        animationType="slide"
        onRequestClose={() => setIsPaymentModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.paymentModalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>2C2P Gateway Checkout</Text>
              <TouchableOpacity onPress={() => {
                setIsPaymentModalOpen(false);
                setPaymentSuccess(false);
              }}>
                <Text style={styles.closeModalText}>✕</Text>
              </TouchableOpacity>
            </View>

            {paymentSuccess ? (
              <View style={styles.successView}>
                <View style={styles.successIconCircle}>
                  <Text style={styles.successCheckText}>✓</Text>
                </View>
                <Text style={styles.successHeading}>Ceremony Reserved & Paid!</Text>
                <Text style={styles.successSub}>
                  Order confirmed for {petName} at {getSelectedTemple().name}.
                </Text>
                <Text style={styles.successInvoiceText}>
                  Invoice: {paymentResult?.invoiceNo || 'INV-1789397'}
                </Text>
                <Text style={styles.successStarNote}>
                  🌟 {petName}'s star is now shining in our constellation sky!
                </Text>

                {/* Social Share Buttons */}
                <View style={styles.socialShareBox}>
                  <Text style={styles.socialShareTitle}>Share Memorial Card</Text>
                  <View style={styles.socialIconsRow}>
                    <TouchableOpacity 
                      style={[styles.socialIconBtn, { backgroundColor: '#1877F2' }]}
                      onPress={() => handleShareMemorial('Facebook')}
                    >
                      <Text style={styles.socialBtnText}>Facebook</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.socialIconBtn, { backgroundColor: '#000000' }]}
                      onPress={() => handleShareMemorial('TikTok')}
                    >
                      <Text style={styles.socialBtnText}>TikTok</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.socialIconBtn, { backgroundColor: '#06C755' }]}
                      onPress={() => handleShareMemorial('LINE')}
                    >
                      <Text style={styles.socialBtnText}>LINE</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.viewStarButton}
                  onPress={() => {
                    setIsPaymentModalOpen(false);
                    setPaymentSuccess(false);
                    setSelectedTab('STARS');
                  }}
                >
                  <Text style={styles.viewStarButtonText}>View Pet's Star in Constellation →</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.checkoutContent}>
                <Text style={styles.bookingSummaryPet}>{petName} ({petType})</Text>
                <Text style={styles.bookingSummaryTemple}>{getSelectedTemple().name}</Text>
                <Text style={styles.bookingSummaryAmount}>Total: ฿{calculateTotal().toLocaleString()}</Text>

                <View style={styles.gatewaySandboxBox}>
                  <Text style={styles.sandboxLabel}>2C2P SANDBOX VERIFIED (JT04 THB)</Text>
                  <Text style={styles.sandboxDesc}>HMAC-SHA256 JWT Signed Handshake</Text>
                  {isGeneratingToken && (
                    <View style={styles.tokenLoadingRow}>
                      <ActivityIndicator color="#7EB8FF" />
                      <Text style={styles.tokenLoadingText}>Requesting 2C2P payment token...</Text>
                    </View>
                  )}
                  {paymentResult && (
                    <View style={styles.tokenResultBox}>
                      <Text style={styles.tokenStatusText}>✓ Token: {paymentResult.paymentToken?.slice(0, 32)}...</Text>
                      <Text style={styles.tokenRespText}>Response: {paymentResult.respDesc} ({paymentResult.respCode})</Text>
                    </View>
                  )}
                </View>

                {/* Test Card Guidance */}
                <View style={styles.testCardBox}>
                  <Text style={styles.testCardTitle}>Live Sandbox Test Cards:</Text>
                  <Text style={styles.testCardNumber}>Visa: 4111 1111 1111 1111</Text>
                  <Text style={styles.testCardDetails}>Exp: 12/28 • CVV: 123 • OTP: 123456</Text>
                </View>

                {paymentResult?.webPaymentUrl ? (
                  <TouchableOpacity 
                    style={styles.openWebPaymentButton}
                    onPress={() => Linking.openURL(paymentResult.webPaymentUrl)}
                  >
                    <Text style={styles.openWebPaymentText}>Open 2C2P Web Checkout Page ↗</Text>
                  </TouchableOpacity>
                ) : null}

                <TouchableOpacity 
                  style={styles.confirmDemoPaidButton}
                  onPress={handleConfirmPaid}
                >
                  <Text style={styles.confirmDemoPaidText}>Confirm Demo Payment (Realtime Push) ✓</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* STAR MEMORIAL DETAILS POPUP MODAL WITH OFFERING & SOCIAL SHARING */}
      <Modal
        visible={!!selectedStar}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedStar(null)}
      >
        <View style={styles.modalBackdrop}>
          {selectedStar && (
            <View style={styles.starModalCard}>
              <View style={styles.starModalHeader}>
                <View style={[styles.starIconDot, { backgroundColor: selectedStar.color }]} />
                <Text style={styles.starModalName}>{selectedStar.name}</Text>
                <TouchableOpacity onPress={() => setSelectedStar(null)}>
                  <Text style={styles.closeModalText}>✕</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.starModalType}>{selectedStar.type} • {selectedStar.years}</Text>
              <Text style={styles.starModalTribute}>"{selectedStar.tribute}"</Text>
              
              <View style={styles.starOfferingRow}>
                <TouchableOpacity 
                  style={styles.lotusOfferingBtn}
                  onPress={() => handleOfferLotusToStar(selectedStar.id)}
                >
                  <Text style={styles.lotusOfferingText}>🪷 Offer Lotus ({selectedStar.likes || 1})</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.shareStarBtn}
                  onPress={() => handleShareMemorial('NATIVE')}
                >
                  <Text style={styles.shareStarBtnText}>📤 Share</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.starModalFooter}>
                <Text style={styles.starModalBlessing}>🌟 Shining eternally in our sky</Text>
              </View>
            </View>
          )}
        </View>
      </Modal>

      {/* TEMPLE DETAIL MODAL */}
      <Modal
        visible={currentScreen === 'TEMPLE_DETAIL'}
        animationType="slide"
        onRequestClose={() => setCurrentScreen('HOME')}
      >
        <SafeAreaView style={styles.detailScreenContainer}>
          <View style={styles.detailHeader}>
            <TouchableOpacity 
              style={styles.iconCircleButton}
              onPress={() => setCurrentScreen('HOME')}
            >
              <Text style={styles.backIconText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.detailHeaderTitle} numberOfLines={1}>{inspectingTemple.name}</Text>
            <TouchableOpacity 
              style={styles.gpsSmallButton}
              onPress={() => openGPSDirections(inspectingTemple)}
            >
              <Text style={styles.gpsSmallButtonText}>📍 GPS</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollFlex} contentContainerStyle={styles.detailContent}>
            <View style={styles.detailHeroBox}>
              <Text style={styles.detailTitle}>{inspectingTemple.name}</Text>
              <Text style={styles.detailTh}>{inspectingTemple.nameTh}</Text>
              <Text style={styles.detailAddress}>📍 {inspectingTemple.address}</Text>
              <Text style={styles.detailPhone}>📞 Phone: {inspectingTemple.phone}</Text>
            </View>

            <Text style={styles.detailSectionTitle}>💰 Complete Official Rates</Text>
            <View style={styles.fullPricingTable}>
              <View style={styles.pricingRow}>
                <Text style={styles.pricingRowLabel}>Small Dog / Cat (&lt;5kg)</Text>
                <Text style={styles.pricingRowVal}>฿{inspectingTemple.pricing.small.toLocaleString()}</Text>
              </View>
              <View style={styles.pricingRow}>
                <Text style={styles.pricingRowLabel}>Medium Dog (5-15kg)</Text>
                <Text style={styles.pricingRowVal}>฿{inspectingTemple.pricing.medium.toLocaleString()}</Text>
              </View>
              <View style={styles.pricingRow}>
                <Text style={styles.pricingRowLabel}>Large Dog (15-30kg)</Text>
                <Text style={styles.pricingRowVal}>฿{inspectingTemple.pricing.large.toLocaleString()}</Text>
              </View>
              <View style={styles.pricingRow}>
                <Text style={styles.pricingRowLabel}>Extra Large Dog (&gt;30kg)</Text>
                <Text style={styles.pricingRowVal}>฿{inspectingTemple.pricing.extraLarge.toLocaleString()}</Text>
              </View>
              <View style={styles.pricingRow}>
                <Text style={styles.pricingRowLabel}>Praying / Chanting (1 Day)</Text>
                <Text style={styles.pricingRowVal}>฿{inspectingTemple.pricing.praying1Day.toLocaleString()}</Text>
              </View>
              <View style={styles.pricingRow}>
                <Text style={styles.pricingRowLabel}>Praying / Chanting (3 Days)</Text>
                <Text style={styles.pricingRowVal}>฿{inspectingTemple.pricing.praying3Days.toLocaleString()}</Text>
              </View>
              <View style={styles.pricingRow}>
                <Text style={styles.pricingRowLabel}>Ash to River (Loi Angkhan boat)</Text>
                <Text style={styles.pricingRowVal}>฿{inspectingTemple.pricing.ashToRiver.toLocaleString()}</Text>
              </View>
              <View style={styles.pricingRowHighlight}>
                <Text style={styles.pricingRowHighlightLabel}>Full Turnkey Package</Text>
                <Text style={styles.pricingRowHighlightVal}>฿{inspectingTemple.pricing.turnkey.toLocaleString()}</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.detailBookCTA}
              onPress={() => {
                setSelectedTempleId(inspectingTemple.id);
                setCurrentScreen('HOME');
                setSelectedTab('WIZARD');
                setWizardStep(1);
              }}
            >
              <LinearGradient
                colors={['#7B2FBE', '#4A90D9']}
                style={styles.gradientButton}
              >
                <Text style={styles.primaryButtonText}>Book Ceremony at {inspectingTemple.name.split(' ')[1]} →</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* SIDE DRAWER NAVIGATION (Screen 9 of reference images) */}
      <Modal
        visible={isDrawerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDrawerOpen(false)}
      >
        <View style={styles.drawerBackdrop}>
          <ImageBackground 
            source={require('./assets/bg_drawer.jpg')}
            style={styles.drawerContainer}
            resizeMode="cover"
          >
            <LinearGradient
              colors={['rgba(7, 11, 26, 0.95)', 'rgba(13, 21, 53, 0.9)']}
              style={styles.drawerGradient}
            >
              <View style={styles.drawerHeader}>
                <TouchableOpacity onPress={() => setIsDrawerOpen(false)}>
                  <Text style={styles.drawerClose}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.drawerBrand}>
                <Text style={styles.drawerPaw}>🐾</Text>
                <Text style={styles.drawerAppName}>Farewell to</Text>
                <Text style={styles.drawerAppNameBold}>Stairway</Text>
                <Text style={styles.drawerTagline}>Honoring Their Journey</Text>
              </View>

              <View style={styles.drawerMenu}>
                <TouchableOpacity 
                  style={styles.drawerItem}
                  onPress={() => {
                    setIsDrawerOpen(false);
                    setSelectedTab('HOME');
                    setCurrentScreen('HOME');
                  }}
                >
                  <Text style={styles.drawerItemIcon}>🏠</Text>
                  <Text style={styles.drawerItemText}>Home & Directory</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.drawerItem}
                  onPress={() => {
                    setIsDrawerOpen(false);
                    setSelectedTab('MAP');
                    setCurrentScreen('HOME');
                  }}
                >
                  <Text style={styles.drawerItemIcon}>🗺</Text>
                  <View>
                    <Text style={styles.drawerItemText}>GPS Map & Directions</Text>
                    <Text style={styles.drawerItemSub}>(Public Access)</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.drawerItem}
                  onPress={() => {
                    setIsDrawerOpen(false);
                    setSelectedTab('WIZARD');
                    setWizardStep(1);
                    setCurrentScreen('HOME');
                  }}
                >
                  <Text style={styles.drawerItemIcon}>📋</Text>
                  <Text style={styles.drawerItemText}>5-Step Booking Wizard</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.drawerItem}
                  onPress={() => {
                    setIsDrawerOpen(false);
                    setSelectedTab('STARS');
                    setCurrentScreen('HOME');
                  }}
                >
                  <Text style={styles.drawerItemIcon}>✨</Text>
                  <Text style={styles.drawerItemText}>Memorial Stars</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.drawerItem}
                  onPress={() => {
                    setIsDrawerOpen(false);
                    setSelectedTab('GUIDES');
                    setCurrentScreen('HOME');
                  }}
                >
                  <Text style={styles.drawerItemIcon}>📖</Text>
                  <Text style={styles.drawerItemText}>Care Guides</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.drawerFooter}>
                <Text style={styles.drawerFooterText}>
                  "Their love lives on in the stars."
                </Text>
              </View>
            </LinearGradient>
          </ImageBackground>

          <TouchableOpacity style={{ flex: 1 }} onPress={() => setIsDrawerOpen(false)} />
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070B1A',
  },
  scrollFlex: {
    flex: 1,
  },
  screenFlex: {
    flex: 1,
    padding: 16,
  },
  scrollPadding: {
    padding: 16,
  },
  fullBackground: {
    width: width,
    height: height,
    flex: 1,
  },
  gradientOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  splashContent: {
    alignItems: 'center',
    width: '100%',
  },
  pawLogoBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(123, 47, 190, 0.35)',
    borderWidth: 1.5,
    borderColor: 'rgba(126, 184, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  pawIcon: {
    fontSize: 30,
  },
  splashTitle: {
    fontSize: 32,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: 1,
    textAlign: 'center',
  },
  splashSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7EB8FF',
    letterSpacing: 2.5,
    marginTop: 6,
    marginBottom: 20,
    textAlign: 'center',
  },
  splashTagline: {
    fontSize: 15,
    color: '#B8C4E0',
    fontStyle: 'italic',
    textAlign: 'center',
    maxWidth: 280,
    marginBottom: 40,
    lineHeight: 22,
  },
  primaryPillButton: {
    width: '85%',
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    shadowColor: '#7B2FBE',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  gradientButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  skipLink: {
    marginTop: 20,
    padding: 8,
  },
  skipLinkText: {
    color: '#7EB8FF',
    fontSize: 13,
  },

  // MAIN APP BAR
  mainAppBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    backgroundColor: '#0D1535',
  },
  iconCircleButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#141F4D',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  menuIconText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  backIconText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  appBarTitleArea: {
    alignItems: 'center',
  },
  mainTitleText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  mainSubText: {
    color: '#7EB8FF',
    fontSize: 11,
    marginTop: 2,
  },
  actionIconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#141F4D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starBadgeIcon: {
    fontSize: 18,
  },

  // ADS CAROUSEL
  adsRow: {
    marginBottom: 14,
  },
  adCard: {
    width: width * 0.78,
    borderRadius: 12,
    padding: 14,
    marginRight: 10,
  },
  adHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  adTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  adLearn: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  adTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  adSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    marginTop: 4,
  },

  // SEARCH BAR
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D1535',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 12,
  },
  searchPrefixIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 42,
    color: '#FFFFFF',
    fontSize: 13,
  },

  // FILTER CHIPS
  chipsRow: {
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#0D1535',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  activeFilterChip: {
    backgroundColor: '#1B2A6B',
    borderColor: '#7EB8FF',
  },
  filterChipText: {
    color: '#B8C4E0',
    fontSize: 12,
  },
  activeFilterChipText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // SECTION TITLES
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 4,
  },
  sectionHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  sectionActionText: {
    color: '#7EB8FF',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionCountText: {
    color: '#6F80A8',
    fontSize: 12,
  },

  // FEATURED TEMPLES
  featuredRow: {
    marginBottom: 20,
  },
  featuredCard: {
    width: 220,
    backgroundColor: '#0D1535',
    borderRadius: 12,
    padding: 14,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(126, 184, 255, 0.2)',
  },
  featuredTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  featuredBadge: {
    backgroundColor: 'rgba(255,215,0,0.15)',
    color: '#FFD700',
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  featuredTurnkey: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: '700',
  },
  featuredName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  featuredTh: {
    color: '#7EB8FF',
    fontSize: 11,
    marginTop: 2,
  },
  featuredLocation: {
    color: '#6F80A8',
    fontSize: 11,
    marginTop: 4,
  },
  featuredBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  featuredSmallPrice: {
    color: '#B8C4E0',
    fontSize: 11,
  },
  featuredArrow: {
    color: '#7EB8FF',
    fontSize: 11,
    fontWeight: '600',
  },

  // ACCORDIONS
  accordionBox: {
    backgroundColor: '#0D1535',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 10,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  accordionTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  accordionTh: {
    color: '#FFD700',
    fontSize: 11,
    marginTop: 2,
  },
  accordionChevron: {
    color: '#7EB8FF',
    fontSize: 12,
    marginLeft: 8,
  },
  accordionBody: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    gap: 6,
    paddingTop: 8,
  },
  accordionTipText: {
    color: '#B8C4E0',
    fontSize: 12,
    lineHeight: 18,
  },

  // TEMPLE DIRECTORY CARD
  templeCard: {
    backgroundColor: '#0D1535',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 14,
  },
  templeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  templeCardName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  templeCardNameTh: {
    color: '#7EB8FF',
    fontSize: 12,
    marginTop: 2,
  },
  templeCardAddress: {
    color: '#B8C4E0',
    fontSize: 11,
    marginTop: 4,
  },
  ratingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255,215,0,0.15)',
  },
  ratingText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
  },
  costingGrid: {
    flexDirection: 'row',
    backgroundColor: '#070B1A',
    borderRadius: 10,
    marginTop: 12,
    padding: 8,
    gap: 6,
  },
  costCol: {
    flex: 1,
    alignItems: 'center',
  },
  costColHighlight: {
    flex: 1.2,
    alignItems: 'center',
    backgroundColor: 'rgba(123,47,190,0.25)',
    borderRadius: 6,
    paddingVertical: 2,
  },
  costLabel: {
    color: '#6F80A8',
    fontSize: 9,
  },
  costValue: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  costLabelHighlight: {
    color: '#FFD700',
    fontSize: 9,
    fontWeight: '600',
  },
  costValueHighlight: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  extraCostsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  extraCostItem: {
    color: '#6F80A8',
    fontSize: 11,
  },
  cardActionsRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  gpsButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(16,185,129,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gpsButtonText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '600',
  },
  inspectButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#141F4D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inspectButtonText: {
    color: '#7EB8FF',
    fontSize: 12,
    fontWeight: '600',
  },
  bookCardButton: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    overflow: 'hidden',
  },
  bookButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  // GPS MAP TAB
  mapTopControl: {
    marginBottom: 12,
  },
  mapTopHeading: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  mapTopSub: {
    color: '#7EB8FF',
    fontSize: 12,
    marginTop: 2,
  },
  mapTemplesScroll: {
    flex: 1,
  },
  mapTempleCard: {
    backgroundColor: '#0D1535',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 12,
  },
  mapTempleTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  mapTempleTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  mapTempleTh: {
    color: '#7EB8FF',
    fontSize: 12,
    marginTop: 2,
  },
  mapTempleCoords: {
    color: '#FFD700',
    fontSize: 11,
    marginTop: 4,
    fontFamily: 'monospace',
  },
  mapPriceBadge: {
    backgroundColor: 'rgba(255,215,0,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  mapPriceText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '700',
  },
  mapAddressText: {
    color: '#B8C4E0',
    fontSize: 12,
    marginTop: 6,
  },
  mapActionsBar: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  mapDirectionsCTA: {
    flex: 1.5,
    height: 40,
    borderRadius: 8,
    overflow: 'hidden',
  },
  directionsGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  directionsCTAText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  mapCallCTA: {
    flex: 1,
    backgroundColor: '#141F4D',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapCallCTAText: {
    color: '#7EB8FF',
    fontSize: 12,
    fontWeight: '600',
  },

  // 5-STEP WIZARD STYLES
  formScroll: {
    flex: 1,
  },
  formScrollContent: {
    padding: 20,
  },
  wizardProgressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  wizardStepDot: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0D1535',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeWizardStepDot: {
    borderColor: '#7EB8FF',
    backgroundColor: '#141F4D',
  },
  completedWizardStepDot: {
    backgroundColor: 'rgba(16,185,129,0.2)',
    borderColor: '#10B981',
  },
  wizardStepText: {
    color: '#6F80A8',
    fontSize: 13,
    fontWeight: '600',
  },
  activeWizardStepText: {
    color: '#7EB8FF',
  },
  wizardSection: {
    gap: 12,
  },
  wizardTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  wizardDesc: {
    color: '#7EB8FF',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 6,
  },
  nextStepBtn: {
    backgroundColor: '#7B2FBE',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 14,
  },
  nextStepBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  prevStepBtn: {
    backgroundColor: '#141F4D',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
  },
  prevStepBtnText: {
    color: '#B8C4E0',
    fontSize: 14,
  },
  wizardBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  helperText: {
    color: '#6F80A8',
    fontSize: 11,
    marginTop: 2,
  },
  dateSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  datePill: {
    flex: 1,
    backgroundColor: '#0D1535',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  activeDatePill: {
    backgroundColor: '#1B2A6B',
    borderColor: '#7EB8FF',
  },
  datePillText: {
    color: '#B8C4E0',
    fontSize: 11,
  },
  activeDatePillText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  timeSlotCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0D1535',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  activeTimeSlotCard: {
    borderColor: '#7EB8FF',
    backgroundColor: '#141F4D',
  },
  timeSlotText: {
    color: '#B8C4E0',
    fontSize: 13,
  },
  activeTimeSlotText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  timeSlotCheck: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // ORDER SUMMARY CARD (STEP 5)
  orderSummaryCard: {
    backgroundColor: '#0D1535',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 10,
  },
  summaryItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItemKey: {
    color: '#6F80A8',
    fontSize: 12,
  },
  summaryItemVal: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    maxWidth: 200,
    textAlign: 'right',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 4,
  },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTotalLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  summaryTotalAmount: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
  },
  paymentMethodRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  paymentMethodBtn: {
    flex: 1,
    backgroundColor: '#0D1535',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
  },
  activePaymentMethodBtn: {
    borderColor: '#7EB8FF',
    backgroundColor: '#141F4D',
  },
  paymentMethodIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  paymentMethodText: {
    color: '#B8C4E0',
    fontSize: 12,
    fontWeight: '600',
  },
  activePaymentMethodText: {
    color: '#FFFFFF',
  },
  paymentMethodSub: {
    color: '#6F80A8',
    fontSize: 10,
    marginTop: 2,
  },

  // FORM INPUTS
  formLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 6,
  },
  reqStar: {
    color: '#FF6B6B',
  },
  glassInput: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    color: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    marginTop: 4,
  },
  textAreaInput: {
    height: 70,
    textAlignVertical: 'top',
  },
  petTypeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  typePill: {
    flex: 1,
    backgroundColor: '#0D1535',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  activeTypePill: {
    backgroundColor: '#1B2A6B',
    borderColor: '#7EB8FF',
  },
  typePillText: {
    color: '#B8C4E0',
    fontSize: 11,
  },
  activeTypePillText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  templeSelectorScroll: {
    marginTop: 4,
  },
  templeOptionCard: {
    width: 180,
    backgroundColor: '#0D1535',
    borderRadius: 10,
    padding: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  activeTempleOptionCard: {
    borderColor: '#7EB8FF',
    backgroundColor: '#141F4D',
  },
  templeOptionName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  activeTempleOptionName: {
    color: '#7EB8FF',
  },
  templeOptionDistrict: {
    color: '#6F80A8',
    fontSize: 10,
    marginTop: 2,
  },
  templeOptionPrice: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  serviceOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0D1535',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginTop: 4,
  },
  activeServiceOption: {
    borderColor: '#7B2FBE',
    backgroundColor: 'rgba(123,47,190,0.15)',
  },
  serviceTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  serviceDesc: {
    color: '#B8C4E0',
    fontSize: 10,
    marginTop: 2,
  },
  servicePriceText: {
    color: '#FFD700',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 8,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
    backgroundColor: '#0D1535',
    padding: 10,
    borderRadius: 8,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#7EB8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: '#7EB8FF',
  },
  checkMark: {
    color: '#070B1A',
    fontWeight: 'bold',
    fontSize: 12,
  },
  checkboxTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  checkboxDesc: {
    color: '#B8C4E0',
    fontSize: 10,
  },
  submitPillButton: {
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    marginTop: 10,
  },

  // STARS TAB
  starsInstructionBox: {
    paddingTop: 12,
    alignItems: 'center',
  },
  starsInstructionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  starsInstruction: {
    color: '#7EB8FF',
    fontSize: 12,
    marginTop: 4,
  },
  starSkyCanvas: {
    flex: 1,
    position: 'relative',
  },
  starTouchable: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
  starCore: {
    width: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 6,
  },
  starHalo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    opacity: 0.3,
  },
  starNameLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  bottomFloatingContainer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  memorialPillButton: {
    width: '75%',
    height: 46,
    borderRadius: 23,
    overflow: 'hidden',
  },

  // GUIDES TAB
  guideHeaderHeading: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  guideHeaderSub: {
    color: '#7EB8FF',
    fontSize: 12,
    marginTop: 2,
    marginBottom: 14,
  },
  articleCard: {
    backgroundColor: '#0D1535',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 14,
  },
  articleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  articleBadge: {
    color: '#7EB8FF',
    fontSize: 10,
    fontWeight: '600',
    backgroundColor: 'rgba(126,184,255,0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  articleReadTime: {
    color: '#6F80A8',
    fontSize: 10,
  },
  articleTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  articleTitleTh: {
    color: '#FFD700',
    fontSize: 11,
    marginTop: 2,
  },
  tipsList: {
    marginTop: 10,
    gap: 6,
  },
  tipText: {
    color: '#B8C4E0',
    fontSize: 12,
    lineHeight: 18,
  },

  // BOTTOM TAB BAR
  bottomTabBar: {
    flexDirection: 'row',
    backgroundColor: '#0A1029',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 8,
    paddingBottom: 16,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 18,
    color: '#6F80A8',
  },
  activeTabIcon: {
    color: '#7EB8FF',
  },
  tabLabel: {
    fontSize: 11,
    color: '#6F80A8',
    marginTop: 2,
  },
  activeTabLabel: {
    color: '#7EB8FF',
    fontWeight: '600',
  },

  // 2C2P MODAL
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  paymentModalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#0D1535',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(126,184,255,0.3)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    paddingBottom: 10,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  closeModalText: {
    color: '#B8C4E0',
    fontSize: 16,
    padding: 4,
  },
  checkoutContent: {
    marginTop: 12,
  },
  bookingSummaryPet: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bookingSummaryTemple: {
    color: '#7EB8FF',
    fontSize: 12,
    marginTop: 2,
  },
  bookingSummaryAmount: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 6,
  },
  gatewaySandboxBox: {
    backgroundColor: '#070B1A',
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  sandboxLabel: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '700',
  },
  sandboxDesc: {
    color: '#B8C4E0',
    fontSize: 10,
    marginTop: 2,
  },
  tokenLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  tokenLoadingText: {
    color: '#7EB8FF',
    fontSize: 10,
  },
  tokenResultBox: {
    marginTop: 6,
  },
  tokenStatusText: {
    color: '#10B981',
    fontSize: 10,
  },
  tokenRespText: {
    color: '#B8C4E0',
    fontSize: 10,
  },
  testCardBox: {
    backgroundColor: '#141F4D',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  testCardTitle: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: '600',
  },
  testCardNumber: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    marginTop: 2,
  },
  testCardDetails: {
    color: '#B8C4E0',
    fontSize: 10,
    marginTop: 2,
  },
  openWebPaymentButton: {
    backgroundColor: '#7B2FBE',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  openWebPaymentText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  confirmDemoPaidButton: {
    backgroundColor: '#10B981',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  confirmDemoPaidText: {
    color: '#070B1A',
    fontSize: 12,
    fontWeight: '700',
  },

  // SUCCESS VIEW & SOCIAL SHARE
  successView: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  successIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(16,185,129,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  successCheckText: {
    color: '#10B981',
    fontSize: 28,
    fontWeight: 'bold',
  },
  successHeading: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  successSub: {
    color: '#B8C4E0',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  successInvoiceText: {
    color: '#6F80A8',
    fontSize: 10,
    marginTop: 4,
  },
  successStarNote: {
    color: '#FFD700',
    fontSize: 11,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 16,
  },
  socialShareBox: {
    width: '100%',
    backgroundColor: '#070B1A',
    borderRadius: 10,
    padding: 12,
    marginTop: 14,
    alignItems: 'center',
  },
  socialShareTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  socialIconsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  socialIconBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  socialBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  viewStarButton: {
    backgroundColor: '#7B2FBE',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    marginTop: 14,
  },
  viewStarButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  // STAR MODAL WITH LOTUS OFFERING
  starModalCard: {
    width: '88%',
    maxWidth: 320,
    backgroundColor: '#0D1535',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
  },
  starModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  starIconDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  starModalName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginLeft: 8,
  },
  starModalType: {
    color: '#7EB8FF',
    fontSize: 11,
    marginTop: 4,
  },
  starModalTribute: {
    color: '#B8C4E0',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 10,
    lineHeight: 18,
  },
  starOfferingRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  lotusOfferingBtn: {
    flex: 1.5,
    backgroundColor: 'rgba(255,215,0,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.4)',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  lotusOfferingText: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: '600',
  },
  shareStarBtn: {
    flex: 1,
    backgroundColor: '#141F4D',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  shareStarBtnText: {
    color: '#7EB8FF',
    fontSize: 11,
    fontWeight: '600',
  },
  starModalFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    marginTop: 14,
    paddingTop: 8,
    alignItems: 'center',
  },
  starModalBlessing: {
    color: '#FFD700',
    fontSize: 11,
  },

  // TEMPLE DETAIL SCREEN
  detailScreenContainer: {
    flex: 1,
    backgroundColor: '#070B1A',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    backgroundColor: '#0D1535',
  },
  detailHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    marginHorizontal: 10,
  },
  gpsSmallButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#10B981',
  },
  gpsSmallButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  detailContent: {
    padding: 20,
    gap: 16,
  },
  detailHeroBox: {
    backgroundColor: '#0D1535',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  detailTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  detailTh: {
    color: '#7EB8FF',
    fontSize: 13,
    marginTop: 4,
  },
  detailAddress: {
    color: '#B8C4E0',
    fontSize: 13,
    marginTop: 8,
  },
  detailPhone: {
    color: '#FFD700',
    fontSize: 13,
    marginTop: 6,
    fontWeight: '500',
  },
  detailSectionTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  fullPricingTable: {
    backgroundColor: '#0D1535',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  pricingRowLabel: {
    color: '#B8C4E0',
    fontSize: 13,
  },
  pricingRowVal: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  pricingRowHighlight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'rgba(123,47,190,0.2)',
  },
  pricingRowHighlightLabel: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
  },
  pricingRowHighlightVal: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailBookCTA: {
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    marginTop: 10,
  },

  // DRAWER
  drawerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
  },
  drawerContainer: {
    width: width * 0.78,
    height: '100%',
  },
  drawerGradient: {
    flex: 1,
    padding: 22,
  },
  drawerHeader: {
    alignItems: 'flex-end',
  },
  drawerClose: {
    color: '#B8C4E0',
    fontSize: 20,
    padding: 4,
  },
  drawerBrand: {
    marginTop: 14,
    marginBottom: 26,
  },
  drawerPaw: {
    fontSize: 26,
  },
  drawerAppName: {
    color: '#B8C4E0',
    fontSize: 18,
    fontWeight: '300',
    marginTop: 4,
  },
  drawerAppNameBold: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  drawerTagline: {
    color: '#7EB8FF',
    fontSize: 11,
    marginTop: 4,
  },
  drawerMenu: {
    gap: 14,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  drawerItemIcon: {
    fontSize: 16,
  },
  drawerItemText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
  drawerItemSub: {
    color: '#6F80A8',
    fontSize: 10,
  },
  drawerFooter: {
    marginTop: 'auto',
    paddingTop: 16,
  },
  drawerFooterText: {
    color: '#6F80A8',
    fontSize: 11,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

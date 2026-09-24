import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  SafeAreaView, 
  StatusBar, 
  Alert,
  Modal,
  Text,
  TouchableOpacity,
  Platform
} from 'react-native';

// Constants & Theme
import { THEME } from './src/constants/theme';
import { ASSETS } from './src/constants/assets';

// Screens
import JourneyScrollScreen from './src/screens/JourneyScrollScreen';
import MainHomeScreen from './src/screens/MainHomeScreen';
import MapScreen from './src/screens/MapScreen';
import FuneralFormScreen from './src/screens/FuneralFormScreen';
import TempleDetailModal from './src/screens/TempleDetailModal';
import TempleDirectoryScreen from './src/screens/TempleDirectoryScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import CareGuidesScreen from './src/screens/CareGuidesScreen';
import StarDomeModal from './src/screens/StarDomeModal';

// Components
import BottomNav from './src/components/BottomNav';
import DrawerMenu from './src/components/DrawerMenu';
import AuthModal from './src/components/AuthModal';

// Services
import { supabase } from './services/supabaseClient';

export default function App() {
  // Navigation State
  // Views: 'LANDING' (WhatsApp Image 1) | 'HOME' (Image 5 Sanctuary Hub) | 'MAP' (Image 6) | 'FORM' (Image 7) | 'PROFILE' | 'TEMPLES' | 'GUIDES' | 'JOURNEY'
  const [currentView, setCurrentView] = useState('LANDING');
  const [bottomTab, setBottomTab] = useState('HOME'); // 'HOME' | 'MAP' | 'FORM' | 'PROFILE'
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Authentication State (UX Principle: Zero Barrier to discovery)
  // Guests can freely explore Map, Temples, Guides, and Stars.
  // When booking or managing, 1-click Guest login or Email login is provided.
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingPostAuthAction, setPendingPostAuthAction] = useState(null);

  // Modals & Inspections
  const [inspectingTemple, setInspectingTemple] = useState(null);
  const [bookingTemple, setBookingTemple] = useState(null);
  const [isStarDomeOpen, setIsStarDomeOpen] = useState(false);
  const [selectedStar, setSelectedStar] = useState(null);

  // User tributes & bookings
  const [userTributes, setUserTributes] = useState([
    {
      id: 'demo-trib-1',
      name: 'Buddy',
      type: 'Golden Retriever 🐕',
      years: '2012 - 2026',
      dateOfPassing: 'Today',
      templeName: 'Wat Khlong Toei Nai Pet Sanctuary',
      message: 'Run free across the endless golden stars, forever loyal and true.',
      color: '#FFD700',
      x: 35,
      y: 32,
      likes: 18
    }
  ]);
  const [activeBooking, setActiveBooking] = useState(null);

  // Handle Tab Switch
  const handleSelectTab = (tabKey) => {
    setBottomTab(tabKey);
    if (tabKey === 'HOME') setCurrentView('HOME'); // Exact WhatsApp Image 1 Home Screen
    else if (tabKey === 'MAP') setCurrentView('MAP');
    else if (tabKey === 'FORM') handleStartBookingTemple(null);
    else if (tabKey === 'PROFILE') setCurrentView('PROFILE');
  };

  // Handle Auth Login Success
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (pendingPostAuthAction) {
      const callback = pendingPostAuthAction;
      setPendingPostAuthAction(null);
      callback();
    }
  };

  // Handle Booking Initiation from Map or Temple Directory
  const handleStartBookingTemple = (temple = null) => {
    if (temple) setBookingTemple(temple);
    setInspectingTemple(null);

    // If user is not yet signed in or guest, offer zero-friction 1-click Guest Login
    if (!currentUser) {
      setPendingPostAuthAction(() => () => {
        setCurrentView('FORM');
        setBottomTab('FORM');
      });
      setIsAuthModalOpen(true);
      return;
    }

    setCurrentView('FORM');
    setBottomTab('FORM');
  };

  // Handle Drawer Navigation
  const handleDrawerNavigate = (screenKey) => {
    if (screenKey === 'HOME') {
      setCurrentView('HOME');
      setBottomTab('HOME');
    } else if (screenKey === 'JOURNEY') {
      setCurrentView('JOURNEY');
    } else if (screenKey === 'MAP') {
      setCurrentView('MAP');
      setBottomTab('MAP');
    } else if (screenKey === 'FORM') {
      handleStartBookingTemple(null);
    } else if (screenKey === 'PROFILE') {
      setCurrentView('PROFILE');
      setBottomTab('PROFILE');
    } else if (screenKey === 'TEMPLES') {
      setCurrentView('TEMPLES');
    } else if (screenKey === 'STARS') {
      setIsStarDomeOpen(true);
    } else if (screenKey === 'GUIDES') {
      setCurrentView('GUIDES');
    }
  };

  // Handle Tribute Form Submission & Database sync
  const handleFormSubmitSuccess = async (tributeData) => {
    setUserTributes(prev => [tributeData, ...prev]);
    
    // Set rich active booking for 10-stage timeline tracking
    const bookingInfo = tributeData.activeBookingData || {
      petName: tributeData.name,
      petType: tributeData.type,
      templeName: tributeData.templeName,
      packageName: 'TURNKEY CELESTIAL',
      totalAmount: 6500,
      invoiceNo: `INV-${Date.now().toString().slice(-6)}`,
      status: 'CONFIRMED',
      paymentMethod: 'PromptPay QR (2C2P)',
      driverName: 'Somchai K.',
      driverVehicle: 'Toyota HiAce Ambulance',
      driverPlate: '1ฒข 8842 กทม',
      driverPhone: '089-123-4567',
    };
    setActiveBooking(bookingInfo);

    // Transition directly to 10-Stage Journey Tracking (ProfileScreen)
    setCurrentView('PROFILE');
    setBottomTab('PROFILE');
  };

  return (
    <SafeAreaView style={styles.rootContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#070C1E" />

      {/* VIEW 0: INITIAL LANDING PAGE (WhatsApp Image 1 - Clean without bottom nav) */}
      {currentView === 'LANDING' && (
        <View style={styles.viewFlex}>
          <JourneyScrollScreen
            onBeginJourney={() => {
              setCurrentView('HOME');
              setBottomTab('HOME');
            }}
            onOpenMenu={() => setIsDrawerOpen(true)}
            onSelectStar={(star) => setSelectedStar(star)}
          />
        </View>
      )}

      {/* VIEW 1: HOME PAGE (WhatsApp Image 5 - Sanctuary Hub with Map, Form, Login) */}
      {currentView === 'HOME' && (
        <View style={styles.viewFlex}>
          <MainHomeScreen
            onOpenMenu={() => setIsDrawerOpen(true)}
            onNavigateMap={() => {
              setCurrentView('MAP');
              setBottomTab('MAP');
            }}
            onNavigateForm={() => handleStartBookingTemple(null)}
            onNavigateProfile={() => {
              setCurrentView('PROFILE');
              setBottomTab('PROFILE');
            }}
            onNavigateTemples={() => setCurrentView('TEMPLES')}
            onNavigateStars={() => setIsStarDomeOpen(true)}
            onNavigateGuides={() => setCurrentView('GUIDES')}
            onNavigateJourney={() => setCurrentView('JOURNEY')}
            currentUser={currentUser}
            onOpenLogin={() => setIsAuthModalOpen(true)}
          />
          <BottomNav currentTab={bottomTab} onSelectTab={handleSelectTab} />
        </View>
      )}

      {/* VIEW 2: CELESTIAL JOURNEY & SOUL ASCENT (WhatsApp Image 1 - Dog/Cat soul ascends to become star) */}
      {currentView === 'JOURNEY' && (
        <View style={styles.viewFlex}>
          <JourneyScrollScreen
            onBeginJourney={() => {
              setCurrentView('HOME');
              setBottomTab('HOME');
            }}
            onBack={() => {
              setCurrentView('HOME');
              setBottomTab('HOME');
            }}
            onOpenMenu={() => setIsDrawerOpen(true)}
            onSelectStar={(star) => setSelectedStar(star)}
          />
          <BottomNav currentTab={bottomTab} onSelectTab={handleSelectTab} />
        </View>
      )}

      {/* VIEW 3: PUBLIC INTERACTIVE MAP (WhatsApp Image 6) */}
      {currentView === 'MAP' && (
        <View style={styles.viewFlex}>
          <MapScreen
            onBack={() => {
              setCurrentView('HOME');
              setBottomTab('HOME');
            }}
            onInspectTemple={(temple) => setInspectingTemple(temple)}
            onBookTemple={(temple) => handleStartBookingTemple(temple)}
          />
          <BottomNav currentTab={bottomTab} onSelectTab={handleSelectTab} />
        </View>
      )}

      {/* VIEW 4: DIRECT FUNERAL & MEMORIAL FORM (WhatsApp Image 7 - Full 7-Step Funnel) */}
      {currentView === 'FORM' && (
        <View style={styles.viewFlex}>
          <FuneralFormScreen
            onBack={() => {
              setCurrentView('HOME');
              setBottomTab('HOME');
            }}
            onSubmitSuccess={handleFormSubmitSuccess}
            initialTemple={bookingTemple}
            currentUser={currentUser}
            onRequestLogin={(afterLoginCb) => {
              setPendingPostAuthAction(() => afterLoginCb);
              setIsAuthModalOpen(true);
            }}
            onOpenStarDome={() => setIsStarDomeOpen(true)}
          />
          <BottomNav currentTab={bottomTab} onSelectTab={handleSelectTab} />
        </View>
      )}

      {/* VIEW 5: JOURNEY TRACKING & PROFILE */}
      {currentView === 'PROFILE' && (
        <View style={styles.viewFlex}>
          <ProfileScreen
            onBack={() => {
              setCurrentView('HOME');
              setBottomTab('HOME');
            }}
            userTributes={userTributes}
            activeBooking={activeBooking}
            onNavigateForm={() => handleStartBookingTemple(null)}
            onNavigateStars={() => setIsStarDomeOpen(true)}
          />
          <BottomNav currentTab={bottomTab} onSelectTab={handleSelectTab} />
        </View>
      )}

      {/* VIEW 6: TEMPLE DIRECTORY */}
      {currentView === 'TEMPLES' && (
        <View style={styles.viewFlex}>
          <TempleDirectoryScreen
            onBack={() => {
              setCurrentView('HOME');
              setBottomTab('HOME');
            }}
            onOpenMap={() => {
              setCurrentView('MAP');
              setBottomTab('MAP');
            }}
            onSelectTemple={(temple) => setInspectingTemple(temple)}
          />
          <BottomNav currentTab={bottomTab} onSelectTab={handleSelectTab} />
        </View>
      )}

      {/* VIEW 7: CARE & CREMATION GUIDES */}
      {currentView === 'GUIDES' && (
        <View style={styles.viewFlex}>
          <CareGuidesScreen
            onBack={() => {
              setCurrentView('HOME');
              setBottomTab('HOME');
            }}
            onOpenTempleList={() => setCurrentView('TEMPLES')}
          />
          <BottomNav currentTab={bottomTab} onSelectTab={handleSelectTab} />
        </View>
      )}

      {/* NAVIGATION DRAWER (WhatsApp Image 8) */}
      <DrawerMenu
        visible={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onNavigate={handleDrawerNavigate}
        currentScreen={currentView}
      />

      {/* TEMPLE DETAIL MODAL (Pet Size Pricing Matrix & Free Parking Info) */}
      <TempleDetailModal
        visible={!!inspectingTemple}
        temple={inspectingTemple}
        onClose={() => setInspectingTemple(null)}
        onBookService={(t) => handleStartBookingTemple(t)}
      />

      {/* AUTHENTICATION / GUEST LOGIN MODAL (Zero Barrier UX Principle) */}
      <AuthModal
        visible={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        actionTitle="Sign In or Continue as Guest"
        actionSubtitle="You can explore everything first. Continuing lets you customize packages, pay securely via 2C2P, and track the funeral journey."
      />

      {/* CELESTIAL STAR DOME MODAL */}
      <StarDomeModal
        visible={isStarDomeOpen}
        onClose={() => setIsStarDomeOpen(false)}
        onOpenForm={() => {
          setCurrentView('FORM');
          setBottomTab('FORM');
        }}
        customStars={userTributes}
      />

      {/* QUICK STAR TOOLTIP DIALOG (FROM HERO JOURNEY) */}
      {selectedStar && (
        <Modal
          visible={!!selectedStar}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedStar(null)}
        >
          <View style={styles.starModalBackdrop}>
            <View style={styles.starModalCard}>
              <View style={styles.starModalHeader}>
                <Text style={styles.starModalBadge}>✨ Constellation Soul</Text>
                <TouchableOpacity onPress={() => setSelectedStar(null)}>
                  <Text style={styles.closeStarModal}>✕</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.starModalName}>{selectedStar.name}</Text>
              <Text style={styles.starModalType}>{selectedStar.type}</Text>
              <Text style={styles.starModalTribute}>"{selectedStar.tribute}"</Text>
              
              <TouchableOpacity 
                style={styles.openDomeBtn}
                onPress={() => {
                  setSelectedStar(null);
                  setIsStarDomeOpen(true);
                }}
              >
                <Text style={styles.openDomeBtnText}>Explore Full Star Dome ➔</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#070C1E',
  },
  viewFlex: {
    flex: 1,
  },
  starModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  starModalCard: {
    width: '100%',
    backgroundColor: '#0F1A3A',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.4)',
    padding: 20,
  },
  starModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  starModalBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFD700',
  },
  closeStarModal: {
    fontSize: 18,
    color: '#94A3B8',
    padding: 4,
  },
  starModalName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 4,
  },
  starModalType: {
    fontSize: 13,
    color: '#93C5FD',
    marginTop: 2,
    marginBottom: 10,
  },
  starModalTribute: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#E2E8F0',
    lineHeight: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  openDomeBtn: {
    backgroundColor: '#7B2FBE',
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
  },
  openDomeBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

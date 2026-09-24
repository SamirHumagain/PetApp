import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  ScrollView,
  Platform,
  TouchableOpacity
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ASSETS } from '../constants/assets';
import { THEME } from '../constants/theme';
import BrandHeader from '../components/BrandHeader';
import GlassCard from '../components/GlassCard';
import { IconPin, IconDocument, IconProfile, IconTemple, IconStar, IconBook } from '../components/Icons';

export default function MainHomeScreen({
  onOpenMenu,
  onNavigateMap,
  onNavigateForm,
  onNavigateProfile,
  onNavigateTemples,
  onNavigateStars,
  onNavigateGuides,
  onNavigateJourney,
  currentUser = null,
  onOpenLogin,
}) {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={ASSETS.bgMainPage}
        style={styles.fullBackground}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(7, 12, 30, 0.45)', 'rgba(7, 12, 30, 0.90)']}
          style={styles.gradientOverlay}
        >
          {/* Top Brand Header */}
          <BrandHeader
            onOpenMenu={onOpenMenu}
            title="Farewell to Stairway"
            subtitle="Honoring Their Journey"
            showMenu={true}
          />

          <ScrollView
            style={styles.scrollFlex}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Hero Welcome Texts (Matching Image 5) */}
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeHeading}>
                Welcome to{"\n"}Farewell to Stairway
              </Text>
              <Text style={styles.welcomeSubheading}>
                A peaceful place to manage your pet's final journey.
              </Text>
            </View>

            {/* 3 Prominent Action Cards (Matching Image 5) */}
            <View style={styles.actionCardsSection}>
              {/* Card 1: Map */}
              <GlassCard
                icon={<IconPin size={24} color="#93C5FD" />}
                title="Map"
                subtitle="View temples and drivers near you."
                onPress={onNavigateMap}
                badge="Public"
                iconBgColor="rgba(59, 130, 246, 0.22)"
                iconBorderColor="rgba(147, 197, 253, 0.45)"
              />

              {/* Card 2: Funeral / Memorial Form */}
              <GlassCard
                icon={<IconDocument size={24} color="#E8D0FF" />}
                title="Funeral / Memorial Form"
                subtitle="Create a lasting tribute for your beloved pet."
                onPress={onNavigateForm}
                iconBgColor="rgba(123, 47, 190, 0.28)"
                iconBorderColor="rgba(216, 180, 254, 0.45)"
              />

              {/* Card 3: Login / Account */}
              <GlassCard
                icon={<IconProfile size={24} color="#93C5FD" />}
                title={currentUser ? (currentUser.isGuest ? "Guest Profile" : "My Account") : "Login / Account"}
                subtitle={currentUser ? `Logged in as ${currentUser.name}` : "Sign in or explore freely as Guest Companion."}
                onPress={() => {
                  if (!currentUser && onOpenLogin) {
                    onOpenLogin();
                  } else {
                    onNavigateProfile();
                  }
                }}
                badge={currentUser ? (currentUser.isGuest ? "Guest Access" : "Member") : "Instant Access"}
                iconBgColor="rgba(37, 99, 235, 0.22)"
                iconBorderColor="rgba(147, 197, 253, 0.45)"
              />
            </View>

            {/* Quick Explore Row */}
            <View style={styles.quickExploreSection}>
              <Text style={styles.quickExploreTitle}>Explore Services & Sanctuary</Text>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.pillScrollContainer}
              >
                <TouchableOpacity 
                  style={styles.explorePill}
                  activeOpacity={0.8}
                  onPress={onNavigateTemples}
                >
                  <IconTemple size={16} color="#93C5FD" />
                  <Text style={styles.explorePillText}>Bangkok Temples (3)</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.explorePill}
                  activeOpacity={0.8}
                  onPress={onNavigateStars}
                >
                  <IconStar size={16} color="#FFD700" />
                  <Text style={styles.explorePillText}>Star Dome</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.explorePill, styles.journeyHighlightPill]}
                  activeOpacity={0.8}
                  onPress={onNavigateJourney}
                >
                  <Text style={{ fontSize: 14 }}>🌌</Text>
                  <Text style={styles.explorePillText}>Soul Ascent</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.explorePill}
                  activeOpacity={0.8}
                  onPress={onNavigateGuides}
                >
                  <IconBook size={16} color="#93C5FD" />
                  <Text style={styles.explorePillText}>Care Guides</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            {/* Brand Quote Footer (Exact Horizontal Layout Matching Image 5) */}
            <TouchableOpacity 
              style={styles.footerQuoteBox}
              activeOpacity={0.8}
              onPress={onNavigateJourney || onNavigateStars}
            >
              <View style={styles.footerQuoteRow}>
                <Text style={styles.footerPaw}>🐾</Text>
                <Text style={styles.footerQuoteText}>
                  Their love lives on{"\n"}in the stars.
                </Text>
              </View>
              <Text style={styles.footerSubHint}>Tap to view soul ascension into the cosmos ✨</Text>
            </TouchableOpacity>

            <View style={{ height: 20 }} />
          </ScrollView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.midnightBg,
  },
  fullBackground: {
    flex: 1,
  },
  gradientOverlay: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 44 : 20,
  },
  scrollFlex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  welcomeSection: {
    marginTop: 18,
    marginBottom: 20,
  },
  welcomeHeading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 36,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    letterSpacing: 0.3,
  },
  welcomeSubheading: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    marginTop: 8,
    lineHeight: 21,
    letterSpacing: 0.2,
  },
  actionCardsSection: {
    marginVertical: 8,
  },
  quickExploreSection: {
    marginTop: 14,
    marginBottom: 8,
  },
  quickExploreTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  pillScrollContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 2,
  },
  explorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(25, 38, 80, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(126, 184, 255, 0.25)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    gap: 6,
  },
  journeyHighlightPill: {
    backgroundColor: 'rgba(123, 47, 190, 0.45)',
    borderColor: 'rgba(216, 180, 254, 0.5)',
  },
  explorePillIcon: {
    fontSize: 14,
  },
  explorePillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#E0E7FF',
  },
  footerQuoteBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
    paddingVertical: 12,
  },
  footerQuoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  footerPaw: {
    fontSize: 24,
    color: '#FFD700',
  },
  footerQuoteText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: THEME.colors.textSecondary,
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  footerSubHint: {
    fontSize: 10,
    color: 'rgba(147, 197, 253, 0.7)',
    marginTop: 6,
    letterSpacing: 0.3,
  },
});

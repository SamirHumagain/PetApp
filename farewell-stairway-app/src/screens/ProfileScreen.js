import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Share,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../constants/theme';
import { driversList } from '../mockData/drivers';

export default function ProfileScreen({
  onBack,
  userTributes = [],
  activeBooking = null,
  onNavigateForm,
  onNavigateStars,
}) {
  const [selectedTimelineStage, setSelectedTimelineStage] = useState(4); // 4 = At Temple (live demo)

  const trackingStages = [
    { step: 1, title: 'Request Submitted', desc: 'Arrangements confirmed with sanctuary' },
    { step: 2, title: 'Temple Confirmed', desc: 'Priest and ceremony pavilion scheduled' },
    { step: 3, title: 'Driver Assigned', desc: 'Climate-controlled ambulance dispatched' },
    { step: 4, title: 'Pet Picked Up', desc: 'Resting peacefully in flower-lined carrier' },
    { step: 5, title: 'At Temple', desc: 'Welcomed with ceremonial incense & bell prayer' },
    { step: 6, title: 'Funeral / Ceremony', desc: 'Monk chanting and family farewell blessing' },
    { step: 7, title: 'Cremation Completed', desc: 'Smokeless chamber eco rite finished' },
    { step: 8, title: 'Ash Collected', desc: 'Bone relics curated into keepsake urn' },
    { step: 9, title: 'Ash to River', desc: 'Bagmati / Chao Phraya river release' },
    { step: 10, title: 'Memorial Completed', desc: 'Star dedicated in celestial constellation' },
  ];

  const assignedDriver = driversList[0];

  const handleShare = async (platform) => {
    const petName = activeBooking?.petName || userTributes[0]?.name || 'Buddy';
    const message = `✨ In loving memory of ${petName}.\n"Every goodbye is a journey toward the stars."\n🌟 View their eternal memorial: https://allpetsgotoheaven.app/tribute/${petName.toLowerCase()}`;
    
    if (platform === 'NATIVE') {
      try {
        await Share.share({ message, title: `Tribute for ${petName}` });
      } catch (e) {
        console.error(e);
      }
    } else {
      Alert.alert(`Share on ${platform}`, `Tribute link copied for ${platform}!\n\n"${message}"`);
    }
  };

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
        <Text style={styles.topBarTitle}>Journey Tracking & Profile</Text>
        <View style={styles.demoGuestBadge}>
          <Text style={styles.demoGuestText}>DEMO</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollCanvas} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>🐾</Text>
          </View>
          <View style={styles.profileInfoCol}>
            <Text style={styles.profileName}>Guest Companion Guardian</Text>
            <Text style={styles.profileEmail}>demo.companion@heaven.app</Text>
            <View style={styles.guardianPill}>
              <Text style={styles.guardianPillText}>★ Lifetime Member</Text>
            </View>
          </View>
        </View>

        {/* Active Booking & 2C2P Payment Card */}
        {activeBooking && (
          <View style={styles.activeBookingCard}>
            <View style={styles.bookingCardHeader}>
              <View>
                <Text style={styles.bookingCardTag}>ACTIVE 2C2P BOOKING</Text>
                <Text style={styles.bookingPetTitle}>
                  🐾 {activeBooking.petName} ({activeBooking.petType || 'Companion'})
                </Text>
              </View>
              <View style={styles.paidBadge}>
                <Text style={styles.paidBadgeText}>✓ PAID ฿{activeBooking.totalAmount ? Number(activeBooking.totalAmount).toLocaleString() : '6,500'}</Text>
              </View>
            </View>

            <View style={styles.bookingDetailsGrid}>
              <Text style={styles.bookingDetailItem}>🏛️ <Text style={styles.boldWhite}>{activeBooking.templeName}</Text></Text>
              <Text style={styles.bookingDetailItem}>📦 Package: <Text style={styles.boldWhite}>{activeBooking.packageName || 'TURNKEY CELESTIAL'}</Text></Text>
              <Text style={styles.bookingDetailItem}>📄 Invoice: {activeBooking.invoiceNo || 'INV-2026-001'}</Text>
              <Text style={styles.bookingDetailItem}>🔒 2C2P Ref: {activeBooking.transactionRef || '2C2P-TH-849201'}</Text>
            </View>

            {/* Quick Stage Simulator for Demo */}
            <View style={styles.stageSimulatorRow}>
              <Text style={styles.simulatorLabel}>Journey Stage: {selectedTimelineStage}/10</Text>
              <TouchableOpacity 
                style={styles.advanceStageBtn}
                onPress={() => setSelectedTimelineStage(prev => (prev < 10 ? prev + 1 : 1))}
              >
                <Text style={styles.advanceStageBtnText}>
                  {selectedTimelineStage === 10 ? '↺ Reset to Stage 1' : `Advance Stage → (${selectedTimelineStage + 1}/10)`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* 10-Stage Journey Tracking (Prompt Section 18) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>10-Stage Journey Tracking</Text>
            <Text style={styles.activeStageBadge}>Stage {selectedTimelineStage}/10</Text>
          </View>

          {/* Assigned Driver Box */}
          <View style={styles.driverBox}>
            <View style={styles.driverTopRow}>
              <Text style={styles.driverCarEmoji}>🚗</Text>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.driverName}>{activeBooking?.driverName || assignedDriver.name}</Text>
                <Text style={styles.driverVehicle}>{activeBooking?.driverVehicle || assignedDriver.vehicle} • {activeBooking?.driverPlate || assignedDriver.plate}</Text>
              </View>
              <View style={styles.driverStatusBadge}>
                <Text style={styles.driverStatusText}>
                  {selectedTimelineStage >= 7 ? '✓ Route Completed' : `🟢 On Route (ETA ${assignedDriver.etaMins}m)`}
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.callDriverBtn}
              onPress={() => Alert.alert('Helpline', `Calling driver: ${activeBooking?.driverPhone || assignedDriver.phone}`)}
            >
              <Text style={styles.callDriverBtnText}>📞 Contact Driver Hotline ({activeBooking?.driverPhone || assignedDriver.phone})</Text>
            </TouchableOpacity>
          </View>

          {/* Timeline Steps */}
          <View style={styles.timelineList}>
            {trackingStages.map((stage) => {
              const isPast = stage.step < selectedTimelineStage;
              const isCurrent = stage.step === selectedTimelineStage;

              return (
                <TouchableOpacity 
                  key={stage.step}
                  style={styles.timelineItem}
                  onPress={() => setSelectedTimelineStage(stage.step)}
                  activeOpacity={0.8}
                >
                  <View style={styles.timelineMarkerCol}>
                    <View style={[
                      styles.timelineDot,
                      isPast && styles.pastDot,
                      isCurrent && styles.currentDot
                    ]}>
                      <Text style={styles.dotNumberText}>
                        {isPast ? '✓' : stage.step}
                      </Text>
                    </View>
                    {stage.step < 10 && <View style={[styles.timelineLine, isPast && styles.pastLine]} />}
                  </View>

                  <View style={styles.timelineTextCol}>
                    <Text style={[styles.stageTitle, isCurrent && styles.currentStageTitle]}>
                      {stage.title}
                    </Text>
                    <Text style={styles.stageDesc}>{stage.desc}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Social Sharing & Digital Memorial Card (Prompt Section 21 & 22) */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Share Lasting Memorial</Text>
          <Text style={styles.shareSubtitle}>Share your companion’s star tribute with family and community.</Text>

          <View style={styles.memorialPreviewCard}>
            <Text style={styles.memorialStarIcon}>🌟</Text>
            <Text style={styles.memorialPetName}>{activeBooking?.petName || userTributes[0]?.name || 'Buddy'}</Text>
            <Text style={styles.memorialMotto}>"Every goodbye is a journey toward the stars."</Text>
            <Text style={styles.memorialTempleTag}>Sanctuary Blessing Confirmed</Text>
          </View>

          <View style={styles.socialButtonsRow}>
            <TouchableOpacity 
              style={[styles.socialShareBtn, { backgroundColor: '#1877F2' }]}
              onPress={() => handleShare('Facebook')}
            >
              <Text style={styles.socialShareBtnText}>Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.socialShareBtn, { backgroundColor: '#000000' }]}
              onPress={() => handleShare('TikTok')}
            >
              <Text style={styles.socialShareBtnText}>TikTok</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.socialShareBtn, { backgroundColor: '#E1306C' }]}
              onPress={() => handleShare('Instagram')}
            >
              <Text style={styles.socialShareBtnText}>Instagram</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.socialShareBtn, { backgroundColor: '#4F46E5' }]}
              onPress={() => handleShare('NATIVE')}
            >
              <Text style={styles.socialShareBtnText}>Share 📤</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Dedicated Pet Tributes List */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>My Memorial Tributes</Text>
            <TouchableOpacity onPress={onNavigateForm}>
              <Text style={styles.addTributeLink}>+ New Form</Text>
            </TouchableOpacity>
          </View>

          {userTributes.length === 0 ? (
            <View style={styles.emptyTributesBox}>
              <Text style={styles.emptyIcon}>🕯</Text>
              <Text style={styles.emptyTitle}>No Tributes Created Yet</Text>
              <Text style={styles.emptyDesc}>Fill out the Funeral & Memorial Form to dedicate a star.</Text>
              <TouchableOpacity style={styles.createFormBtn} onPress={onNavigateForm}>
                <Text style={styles.createFormBtnText}>Open Funeral Form →</Text>
              </TouchableOpacity>
            </View>
          ) : (
            userTributes.map((trib) => (
              <View key={trib.id} style={styles.tributeItemCard}>
                <View style={styles.tributeTopRow}>
                  <Text style={styles.tributePetTitle}>🌟 {trib.name}</Text>
                  <Text style={styles.tributePetType}>{trib.type}</Text>
                </View>
                <Text style={styles.tributeMessage}>"{trib.message}"</Text>
                <View style={styles.tributeFooter}>
                  <Text style={styles.tributeTemple}>🏛 {trib.templeName}</Text>
                  <TouchableOpacity onPress={onNavigateStars}>
                    <Text style={styles.viewInStarsText}>View in Sky ➔</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

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
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  demoGuestBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    borderWidth: 1,
    borderColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  demoGuestText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#34D399',
  },
  scrollCanvas: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 25, 62, 0.85)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(126, 184, 255, 0.25)',
    padding: 16,
    marginBottom: 16,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(123, 47, 190, 0.3)',
    borderWidth: 1,
    borderColor: '#7B2FBE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 24,
  },
  profileInfoCol: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileEmail: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  guardianPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 6,
  },
  guardianPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFD700',
  },
  sectionCard: {
    backgroundColor: 'rgba(15, 25, 62, 0.85)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(126, 184, 255, 0.22)',
    padding: 16,
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  activeStageBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#93C5FD',
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  driverBox: {
    backgroundColor: 'rgba(20, 32, 75, 0.9)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(147, 197, 253, 0.3)',
    padding: 12,
    marginBottom: 16,
  },
  driverTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverCarEmoji: {
    fontSize: 24,
  },
  driverName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  driverVehicle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  driverStatusBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  driverStatusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#34D399',
  },
  callDriverBtn: {
    marginTop: 10,
    paddingVertical: 7,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 10,
    alignItems: 'center',
  },
  callDriverBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#34D399',
  },
  timelineList: {
    marginTop: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  timelineMarkerCol: {
    alignItems: 'center',
    width: 30,
    marginRight: 10,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  pastDot: {
    backgroundColor: '#10B981',
    borderColor: '#34D399',
  },
  currentDot: {
    backgroundColor: '#7B2FBE',
    borderColor: '#93C5FD',
    transform: [{ scale: 1.15 }],
  },
  dotNumberText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginVertical: 3,
  },
  pastLine: {
    backgroundColor: '#10B981',
  },
  timelineTextCol: {
    flex: 1,
  },
  stageTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#CBD5E1',
  },
  currentStageTitle: {
    color: '#93C5FD',
    fontWeight: '800',
  },
  stageDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  shareSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 12,
  },
  memorialPreviewCard: {
    backgroundColor: 'rgba(30, 42, 86, 0.8)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.35)',
    padding: 16,
    alignItems: 'center',
    marginBottom: 14,
  },
  memorialStarIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  memorialPetName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  memorialMotto: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#E0E7FF',
    marginTop: 4,
    textAlign: 'center',
  },
  memorialTempleTag: {
    fontSize: 11,
    color: '#34D399',
    marginTop: 8,
    fontWeight: '600',
  },
  socialButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  socialShareBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialShareBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  addTributeLink: {
    fontSize: 13,
    color: '#93C5FD',
    fontWeight: '700',
  },
  emptyTributesBox: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyDesc: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'center',
  },
  createFormBtn: {
    marginTop: 12,
    backgroundColor: '#7B2FBE',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  createFormBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tributeItemCard: {
    backgroundColor: 'rgba(25, 38, 80, 0.8)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(126, 184, 255, 0.25)',
    padding: 12,
    marginBottom: 10,
  },
  tributeTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  tributePetTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tributePetType: {
    fontSize: 11,
    color: '#93C5FD',
  },
  tributeMessage: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#CBD5E1',
    lineHeight: 17,
  },
  tributeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  tributeTemple: {
    fontSize: 11,
    color: '#64748B',
  },
  viewInStarsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFD700',
  },
  activeBookingCard: {
    backgroundColor: 'rgba(15, 25, 62, 0.95)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  bookingCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bookingCardTag: {
    fontSize: 10,
    fontWeight: '900',
    color: '#34D399',
    letterSpacing: 0.8,
  },
  bookingPetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  paidBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderColor: '#34D399',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  paidBadgeText: {
    fontSize: 11,
    color: '#34D399',
    fontWeight: '800',
  },
  bookingDetailsGrid: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 12,
    padding: 10,
    gap: 4,
  },
  bookingDetailItem: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 18,
  },
  boldWhite: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  stageSimulatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  simulatorLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#93C5FD',
  },
  advanceStageBtn: {
    backgroundColor: '#7B2FBE',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  advanceStageBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});


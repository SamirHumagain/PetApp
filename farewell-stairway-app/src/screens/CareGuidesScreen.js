import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { THEME } from '../constants/theme';
import { guidanceSections } from '../mockData/guides';
import { templesList } from '../mockData/temples';

export default function CareGuidesScreen({ onBack, onOpenTempleList }) {
  const [activeTab, setActiveTab] = useState('PREP'); // 'PREP' | 'CREMATION'

  const prepSection = guidanceSections.find(g => g.id === 'guide-prep');
  const cremationSection = guidanceSections.find(g => g.id === 'guide-cremation');

  const handleAskTemple = () => {
    const temple = templesList[0];
    Alert.alert(
      'Ask Temple Sanctuary',
      `Direct Helpline for ${temple.name}:\n📞 ${temple.phone}\n\nOur monks and care coordinators are available 24/7 to answer questions regarding cremation items.`
    );
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
        <Text style={styles.topBarTitle}>Care & Cremation Guidance</Text>
        <TouchableOpacity style={styles.askTempleTopBtn} onPress={handleAskTemple}>
          <Text style={styles.askTempleTopText}>Ask Temple</Text>
        </TouchableOpacity>
      </View>

      {/* Guide Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity 
          style={[styles.guideTab, activeTab === 'PREP' && styles.activeGuideTab]}
          onPress={() => setActiveTab('PREP')}
        >
          <Text style={[styles.guideTabText, activeTab === 'PREP' && styles.activeGuideTabText]}>
            🌸 Preparing Your Pet
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.guideTab, activeTab === 'CREMATION' && styles.activeGuideTab]}
          onPress={() => setActiveTab('CREMATION')}
        >
          <Text style={[styles.guideTabText, activeTab === 'CREMATION' && styles.activeGuideTabText]}>
            🕯 What Can Be Cremated
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollCanvas} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'PREP' && (
          <View>
            <View style={styles.sectionHeaderBox}>
              <Text style={styles.guideTitle}>{prepSection.title}</Text>
              <Text style={styles.guideSubtitle}>{prepSection.titleSubtitle}</Text>
            </View>

            {prepSection.steps.map((step, idx) => (
              <View key={idx} style={styles.stepCard}>
                <View style={styles.stepNumberBadge}>
                  <Text style={styles.stepNumberText}>{idx + 1}</Text>
                </View>
                <View style={styles.stepTextCol}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDesc}>{step.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'CREMATION' && (
          <View>
            <View style={styles.sectionHeaderBox}>
              <Text style={styles.guideTitle}>{cremationSection.title}</Text>
              <Text style={styles.guideSubtitle}>{cremationSection.titleSubtitle}</Text>
            </View>

            {/* Crucial Temple Disclaimer Notice (Prompt Section 11) */}
            <View style={styles.disclaimerBanner}>
              <Text style={styles.disclaimerIcon}>⚠️</Text>
              <Text style={styles.disclaimerText}>
                {cremationSection.disclaimer}
              </Text>
              <TouchableOpacity style={styles.askTempleBtn} onPress={handleAskTemple}>
                <Text style={styles.askTempleBtnText}>Ask Temple Coordinator ➔</Text>
              </TouchableOpacity>
            </View>

            {cremationSection.categories.map((cat, idx) => (
              <View key={idx} style={styles.categoryCard}>
                <View style={[styles.categoryBadge, { borderColor: cat.badgeColor }]}>
                  <Text style={[styles.categoryBadgeText, { color: cat.badgeColor }]}>
                    {cat.badge}
                  </Text>
                </View>

                {cat.items.map((item, itemIdx) => (
                  <View key={itemIdx} style={styles.itemRow}>
                    <Text style={[styles.itemDot, { color: cat.badgeColor }]}>•</Text>
                    <Text style={styles.itemText}>{item}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

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
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  askTempleTopBtn: {
    backgroundColor: 'rgba(123, 47, 190, 0.3)',
    borderWidth: 1,
    borderColor: '#7B2FBE',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  askTempleTopText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#93C5FD',
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 25, 62, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  guideTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeGuideTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#7B2FBE',
    backgroundColor: 'rgba(123, 47, 190, 0.15)',
  },
  guideTabText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
  },
  activeGuideTabText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scrollCanvas: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  sectionHeaderBox: {
    marginBottom: 16,
  },
  guideTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  guideSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 25, 62, 0.85)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(126, 184, 255, 0.22)',
    padding: 14,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  stepNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#7B2FBE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  stepTextCol: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 18,
  },
  disclaimerBanner: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  disclaimerIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  disclaimerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FCD34D',
    lineHeight: 19,
  },
  askTempleBtn: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(245, 158, 11, 0.25)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  askTempleBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FCD34D',
  },
  categoryCard: {
    backgroundColor: 'rgba(15, 25, 62, 0.85)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(126, 184, 255, 0.22)',
    padding: 16,
    marginBottom: 14,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemDot: {
    fontSize: 18,
    marginRight: 8,
    lineHeight: 18,
  },
  itemText: {
    flex: 1,
    fontSize: 13,
    color: '#E2E8F0',
    lineHeight: 19,
  },
});

import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { 
  initialTemples, 
  initialBookings, 
  initialStars, 
  initialArticles, 
  initialAds 
} from './data/mockData';
import { 
  Building2, 
  MapPin, 
  CreditCard, 
  Sparkles, 
  BookOpen, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Search,
  Plus,
  ArrowUpRight,
  PawPrint,
  RefreshCw,
  Megaphone,
  TrendingUp,
  Edit3,
  Trash2,
  Eye,
  Save,
  X,
  Phone,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom gold paw marker for temples
const templeIcon = new L.DivIcon({
  className: 'custom-temple-marker',
  html: `<div style="background: linear-gradient(135deg, #FFD700, #FFA500); width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 14px rgba(255, 215, 0, 0.7); border: 2px solid #FFFFFF;">
    <span style="font-size: 15px;">🐾</span>
  </div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

export default function App() {
  const [activeTab, setActiveTab] = useState('temples');
  
  // Core Entities State
  const [temples, setTemples] = useState(initialTemples);
  const [bookings, setBookings] = useState(initialBookings);
  const [stars, setStars] = useState(initialStars);
  const [articles, setArticles] = useState(initialArticles);
  const [ads, setAds] = useState(initialAds);
  
  // Selection & Filters
  const [selectedTemple, setSelectedTemple] = useState(initialTemples[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingFilter, setBookingFilter] = useState('ALL'); // 'ALL' | 'PAID' | 'PENDING'
  const [notification, setNotification] = useState(null);

  // 2C2P Sandbox Live Simulator State
  const [testAmount, setTestAmount] = useState('1250');
  const [testDescription, setTestDescription] = useState('Farewell to Stairway - Memorial Demo Package');
  const [isRequesting2C2P, setIsRequesting2C2P] = useState(false);
  const [sandboxResult, setSandboxResult] = useState(null);

  // Modals & Editors
  const [isAddTempleOpen, setIsAddTempleOpen] = useState(false);
  const [newTempleData, setNewTempleData] = useState({
    name: '',
    name_th: '',
    address: '',
    district: '',
    province: 'Bangkok',
    lat: 13.7500,
    lng: 100.5200,
    phone: '02-000-0000',
    line_id: '@temple_pet',
    rating: 5.0,
    reviews: 1,
    pricing: {
      small: 1500,
      medium: 2000,
      large: 2800,
      extraLarge: 3500,
      praying1Day: 1200,
      praying3Days: 3000,
      ashToRiver: 1500,
      turnkey: 6500,
      pickup: 800
    },
    features: ['Smokeless Cremator', 'Memorial Wall', 'Monk Chanting']
  });

  const [isAddAdOpen, setIsAddAdOpen] = useState(false);
  const [newAdData, setNewAdData] = useState({
    sponsorName: '',
    category: 'Pet Insurance',
    tagline: '',
    placement: 'Mobile Home Top Banner',
    monthlyFee: 10000,
    badgeColor: '#1E3A8A'
  });

  const [editingArticle, setEditingArticle] = useState(null);
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Fetch live bookings & payments directly from Supabase
  const loadSupabaseData = async () => {
    try {
      const { data: bData, error } = await supabase
        .from('bookings')
        .select('*, temples(name), payments(*)')
        .order('created_at', { ascending: false });

      if (bData && bData.length > 0) {
        const mapped = bData.map(b => {
          const pay = b.payments && b.payments.length > 0 ? b.payments[0] : null;
          return {
            id: b.booking_number || b.id.slice(0, 8),
            petName: b.pet_name,
            petType: b.pet_type,
            ownerName: 'Customer',
            templeName: b.temples?.name || 'Wat Klong Toey Nai Pet Memorial',
            date: b.ceremony_date,
            service: b.service_type || 'Turnkey Package',
            amount: Number(b.total_amount),
            paymentStatus: pay?.status === 'PAID' ? 'PAID' : (b.status === 'CONFIRMED' ? 'PAID' : 'PENDING'),
            paymentMethod: pay?.channel === 'PROMPTPAY' ? '2C2P PromptPay QR' : '2C2P Credit Card (Visa)',
            gatewayInvoice: pay?.invoice_no || 'INV-PENDING',
            pickupAddress: b.pickup_address || 'Bangkok'
          };
        });
        setBookings(mapped);
      }
    } catch (err) {
      console.warn('Could not sync with Supabase:', err);
    }
  };

  useEffect(() => {
    loadSupabaseData();
  }, []);

  // Reset Demo State
  const handleResetDemo = () => {
    setTemples(initialTemples);
    setBookings(initialBookings);
    setStars(initialStars);
    setArticles(initialArticles);
    setAds(initialAds);
    setSelectedTemple(initialTemples[0]);
    setSandboxResult(null);
    showToast('✨ Demo state successfully reset to initial pristine data!');
  };

  // Simulate Instant Mobile Booking
  const handleSimulateMobileBooking = () => {
    const samplePets = [
      { name: 'Mochi', type: 'Shiba Inu', owner: 'Nutcha K.', temple: 'Wat Klong Toey Nai', pkg: 'Full Turnkey Memorial', amount: 6500 },
      { name: 'Kuro', type: 'Black Cat', owner: 'Anon T.', temple: 'Wat Umong Forest Sanctuary', pkg: 'Cremation + Loi Angkhan', amount: 2200 },
      { name: 'Oreo', type: 'Siberian Husky', owner: 'Somchai P.', temple: 'Wat Pha Suk Maneechak', pkg: 'Full Turnkey Memorial', amount: 7500 }
    ];
    const pick = samplePets[Math.floor(Math.random() * samplePets.length)];
    const newId = `BK-${Math.floor(2000 + Math.random() * 8000)}`;
    const newInvoice = `INV-${Date.now().toString().slice(-6)}`;
    
    const newBooking = {
      id: newId,
      petName: pick.name,
      petType: pick.type,
      ownerName: pick.owner,
      templeName: pick.temple,
      date: new Date().toISOString().split('T')[0],
      service: pick.pkg,
      amount: pick.amount,
      paymentStatus: 'PAID',
      paymentMethod: '2C2P Mobile App Checkout (Visa 4111)',
      gatewayInvoice: newInvoice,
      pickupAddress: 'Sukhumvit Soi 39, Watthana, Bangkok'
    };

    setBookings(prev => [newBooking, ...prev]);

    // Also ascend star to galaxy
    const newStar = {
      id: `star-${Date.now()}`,
      name: pick.name,
      type: pick.type,
      years: '2026',
      x: Math.floor(15 + Math.random() * 70),
      y: Math.floor(15 + Math.random() * 65),
      color: '#FFD700',
      tribute: `Beloved companion to ${pick.owner}. Running peacefully among the golden stars.`
    };
    setStars(prev => [newStar, ...prev]);

    showToast(`🐾 New Mobile Booking ${newId} received! ${pick.name} ascended to stars.`);
  };

  // Live 2C2P Payment Token Requester
  const handleTest2C2PPayment = async () => {
    setIsRequesting2C2P(true);
    setSandboxResult(null);
    try {
      const merchantID = 'JT04';
      const secretKey = 'CD229682D3297390B9F66FF4020B758F4A5E625AF4992E5D75D311D6458B38E2';
      const invoiceNo = `INV${Date.now()}`;
      
      const enc = new TextEncoder();
      const b64url = (buf) => {
        const bin = String.fromCharCode(...new Uint8Array(buf));
        return btoa(bin).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
      };
      
      const headerStr = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
      const payloadObj = {
        merchantID,
        invoiceNo,
        description: testDescription,
        amount: Number(testAmount),
        currencyCode: 'THB'
      };
      const payloadStr = btoa(unescape(encodeURIComponent(JSON.stringify(payloadObj)))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
      const input = `${headerStr}.${payloadStr}`;
      
      const key = await crypto.subtle.importKey(
        'raw',
        enc.encode(secretKey),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      const signature = await crypto.subtle.sign('HMAC', key, enc.encode(input));
      const jwtToken = `${input}.${b64url(signature)}`;

      const res = await fetch('https://sandbox-pgw.2c2p.com/payment/4.3/paymentToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload: jwtToken })
      });

      const data = await res.json();
      if (data.payload) {
        const parts = data.payload.split('.');
        const decodedPayload = JSON.parse(decodeURIComponent(escape(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))));
        
        setSandboxResult({
          success: decodedPayload.respCode === '0000',
          invoiceNo,
          ...decodedPayload
        });

        const bNum = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
        const newBooking = {
          id: bNum,
          petName: 'Bella',
          petType: 'Pomeranian',
          ownerName: 'Client Demo Guest',
          templeName: selectedTemple.name,
          date: new Date().toISOString().split('T')[0],
          service: testDescription,
          amount: Number(testAmount),
          paymentStatus: 'PAID',
          paymentMethod: '2C2P Visa (4111 1111...)',
          gatewayInvoice: invoiceNo,
          pickupAddress: 'Sukhumvit Rd, Bangkok'
        };
        setBookings(prev => [newBooking, ...prev]);

        // Persist into Supabase database
        try {
          const { data: bRes } = await supabase.from('bookings').insert([{
            booking_number: bNum,
            temple_id: selectedTemple.id && selectedTemple.id.length > 10 ? selectedTemple.id : '11111111-1111-1111-1111-111111111101',
            pet_name: 'Bella',
            pet_type: 'Pomeranian',
            date_of_passing: new Date().toISOString().split('T')[0],
            ceremony_date: new Date().toISOString().split('T')[0],
            service_type: 'Full Turnkey Ceremony',
            subtotal_amount: Number(testAmount),
            total_amount: Number(testAmount),
            status: 'CONFIRMED'
          }]).select();

          if (bRes && bRes.length > 0) {
            await supabase.from('payments').insert([{
              booking_id: bRes[0].id,
              invoice_no: invoiceNo,
              amount: Number(testAmount),
              currency: 'THB',
              channel: 'CC',
              payment_token: decodedPayload.paymentToken || 'token',
              web_payment_url: decodedPayload.webPaymentUrl || '',
              status: 'PAID',
              paid_at: new Date().toISOString()
            }]);
          }
        } catch (dbErr) {
          console.warn('DB persist error:', dbErr);
        }

        showToast('💳 2C2P Payment Token created & stored in Supabase!');
      }
    } catch (err) {
      console.error(err);
      setSandboxResult({ error: err.message });
      showToast('❌ 2C2P Sandbox error: ' + err.message);
    } finally {
      setIsRequesting2C2P(false);
    }
  };

  // Add Temple Handler
  const handleSaveNewTemple = (e) => {
    e.preventDefault();
    if (!newTempleData.name) return;
    const templeToAdd = {
      ...newTempleData,
      id: String(temples.length + 1),
      isApproved: true
    };
    setTemples(prev => [templeToAdd, ...prev]);
    setSelectedTemple(templeToAdd);
    setIsAddTempleOpen(false);
    showToast(`🏛️ ${newTempleData.name} added to GPS directory!`);
  };

  // Add Ad Handler
  const handleSaveNewAd = (e) => {
    e.preventDefault();
    if (!newAdData.sponsorName) return;
    const adToAdd = {
      ...newAdData,
      id: `ad-${Date.now()}`,
      impressions: 1200,
      clicks: 65,
      ctr: '5.41%',
      status: 'ACTIVE',
      bannerUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop'
    };
    setAds(prev => [adToAdd, ...prev]);
    setIsAddAdOpen(false);
    showToast(`📢 Sponsor campaign for ${newAdData.sponsorName} created!`);
  };

  // Save Article Changes
  const handleSaveArticle = () => {
    if (!editingArticle) return;
    setArticles(prev => prev.map(a => a.id === editingArticle.id ? editingArticle : a));
    setEditingArticle(null);
    showToast('📖 Article updated in CMS and synced with mobile app!');
  };

  // Calculate Platform Analytics
  const totalBookingsRevenue = bookings.filter(b => b.paymentStatus === 'PAID').reduce((sum, b) => sum + b.amount, 0);
  const totalAdRevenue = ads.filter(a => a.status === 'ACTIVE').reduce((sum, a) => sum + a.monthlyFee, 0);
  const estimatedTempleFees = Math.round(totalBookingsRevenue * 0.12); // 12% platform fee

  const filteredTemples = temples.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.province.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBookings = bookings.filter(b => {
    if (bookingFilter === 'ALL') return true;
    return b.paymentStatus === bookingFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#070b1a', color: '#FFFFFF', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      
      {/* Toast Notification Alert */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          zIndex: 9999,
          backgroundColor: '#141f4d',
          border: '1px solid #7eb8ff',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '13px',
          fontWeight: 500
        }}>
          <CheckCircle2 size={16} color="#10b981" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header style={{ 
        height: '64px', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)', 
        backgroundColor: '#0d1535', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '0 24px' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '38px', 
            height: '38px', 
            borderRadius: '10px', 
            background: 'linear-gradient(135deg, #7B2FBE, #4A90D9)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(123, 47, 190, 0.5)'
          }}>
            <PawPrint size={22} color="#FFFFFF" />
          </div>
          <div>
            <h1 style={{ fontSize: '17px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
              Farewell to Stairway
            </h1>
            <p style={{ fontSize: '11px', color: '#7eb8ff', margin: 0 }}>
              Pet Funeral & Memorial Platform • Master Command Console
            </p>
          </div>
        </div>

        {/* Action Controls & Health Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          <button 
            onClick={handleSimulateMobileBooking}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '8px',
              backgroundColor: 'rgba(123, 47, 190, 0.25)',
              border: '1px solid rgba(123, 47, 190, 0.5)',
              color: '#ffd700',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            ⚡ Simulate Mobile Booking
          </button>

          <button 
            onClick={handleResetDemo}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#b8c4e0',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={13} /> Reset Demo State
          </button>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '6px 14px', 
            borderRadius: '20px', 
            backgroundColor: 'rgba(16, 185, 129, 0.12)', 
            border: '1px solid rgba(16, 185, 129, 0.3)' 
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
            <span style={{ fontSize: '12px', fontWeight: 500, color: '#10b981' }}>2C2P Sandbox (JT04 THB)</span>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '6px 14px', 
            borderRadius: '20px', 
            backgroundColor: 'rgba(126, 184, 255, 0.1)', 
            border: '1px solid rgba(126, 184, 255, 0.25)' 
          }}>
            <ShieldCheck size={14} color="#7eb8ff" />
            <span style={{ fontSize: '12px', fontWeight: 500, color: '#7eb8ff' }}>Realtime PostgreSQL Ready</span>
          </div>
        </div>
      </header>

      {/* Main Layout Container */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Left Sidebar */}
        <aside style={{ 
          width: '240px', 
          backgroundColor: '#0a1029', 
          borderRight: '1px solid rgba(255, 255, 255, 0.08)', 
          display: 'flex', 
          flexDirection: 'column', 
          padding: '20px 12px',
          gap: '6px'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#6f80a8', textTransform: 'uppercase', paddingLeft: '12px', marginBottom: '6px' }}>
            Platform Modules
          </div>

          <button 
            onClick={() => setActiveTab('temples')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '10px 14px', 
              borderRadius: '8px', 
              backgroundColor: activeTab === 'temples' ? '#141f4d' : 'transparent',
              color: activeTab === 'temples' ? '#FFFFFF' : '#b8c4e0',
              fontWeight: activeTab === 'temples' ? 600 : 400,
              borderLeft: activeTab === 'temples' ? '3px solid #7eb8ff' : '3px solid transparent',
              textAlign: 'left',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <Building2 size={18} color={activeTab === 'temples' ? '#7eb8ff' : '#6f80a8'} />
            <span>Temples & GPS Map</span>
          </button>

          <button 
            onClick={() => setActiveTab('bookings')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '10px 14px', 
              borderRadius: '8px', 
              backgroundColor: activeTab === 'bookings' ? '#141f4d' : 'transparent',
              color: activeTab === 'bookings' ? '#FFFFFF' : '#b8c4e0',
              fontWeight: activeTab === 'bookings' ? 600 : 400,
              borderLeft: activeTab === 'bookings' ? '3px solid #7eb8ff' : '3px solid transparent',
              textAlign: 'left',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <CreditCard size={18} color={activeTab === 'bookings' ? '#7eb8ff' : '#6f80a8'} />
            <span>Bookings & 2C2P</span>
          </button>

          <button 
            onClick={() => setActiveTab('stars')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '10px 14px', 
              borderRadius: '8px', 
              backgroundColor: activeTab === 'stars' ? '#141f4d' : 'transparent',
              color: activeTab === 'stars' ? '#FFFFFF' : '#b8c4e0',
              fontWeight: activeTab === 'stars' ? 600 : 400,
              borderLeft: activeTab === 'stars' ? '3px solid #7eb8ff' : '3px solid transparent',
              textAlign: 'left',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <Sparkles size={18} color={activeTab === 'stars' ? '#ffd700' : '#6f80a8'} />
            <span>Star Constellations</span>
          </button>

          <button 
            onClick={() => setActiveTab('ads')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '10px 14px', 
              borderRadius: '8px', 
              backgroundColor: activeTab === 'ads' ? '#141f4d' : 'transparent',
              color: activeTab === 'ads' ? '#FFFFFF' : '#b8c4e0',
              fontWeight: activeTab === 'ads' ? 600 : 400,
              borderLeft: activeTab === 'ads' ? '3px solid #7eb8ff' : '3px solid transparent',
              textAlign: 'left',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <Megaphone size={18} color={activeTab === 'ads' ? '#7eb8ff' : '#6f80a8'} />
            <span>Ads & Sponsors</span>
          </button>

          <button 
            onClick={() => setActiveTab('articles')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '10px 14px', 
              borderRadius: '8px', 
              backgroundColor: activeTab === 'articles' ? '#141f4d' : 'transparent',
              color: activeTab === 'articles' ? '#FFFFFF' : '#b8c4e0',
              fontWeight: activeTab === 'articles' ? 600 : 400,
              borderLeft: activeTab === 'articles' ? '3px solid #7eb8ff' : '3px solid transparent',
              textAlign: 'left',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <BookOpen size={18} color={activeTab === 'articles' ? '#7eb8ff' : '#6f80a8'} />
            <span>Funeral Guides CMS</span>
          </button>

          <button 
            onClick={() => setActiveTab('analytics')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '10px 14px', 
              borderRadius: '8px', 
              backgroundColor: activeTab === 'analytics' ? '#141f4d' : 'transparent',
              color: activeTab === 'analytics' ? '#FFFFFF' : '#b8c4e0',
              fontWeight: activeTab === 'analytics' ? 600 : 400,
              borderLeft: activeTab === 'analytics' ? '3px solid #7eb8ff' : '3px solid transparent',
              textAlign: 'left',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <TrendingUp size={18} color={activeTab === 'analytics' ? '#ffd700' : '#6f80a8'} />
            <span>Platform Revenue</span>
          </button>

          {/* Quick Metrics Footer Card */}
          <div style={{ marginTop: 'auto', padding: '14px', borderRadius: '10px', backgroundColor: 'rgba(123, 47, 190, 0.15)', border: '1px solid rgba(123, 47, 190, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffd700', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
              <Sparkles size={14} /> 2C2P Day 1 Verified
            </div>
            <p style={{ fontSize: '11px', color: '#b8c4e0', lineHeight: 1.4, margin: 0 }}>
              Live Thailand Merchant <code>JT04</code> connected for production-ready demonstration.
            </p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* TAB 1: TEMPLES & MAP */}
          {activeTab === 'temples' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
              
              {/* Top Filters & Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ position: 'relative', width: '320px' }}>
                    <Search size={16} color="#6f80a8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input 
                      type="text"
                      placeholder="Search temples by name or district..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ 
                        width: '100%', 
                        padding: '10px 14px 10px 36px', 
                        borderRadius: '8px', 
                        backgroundColor: '#0d1535', 
                        border: '1px solid rgba(255, 255, 255, 0.1)', 
                        color: '#FFFFFF',
                        fontSize: '13px'
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '13px', color: '#b8c4e0' }}>
                    Showing <strong>{filteredTemples.length}</strong> temples in Thailand
                  </span>
                </div>

                <button 
                  onClick={() => setIsAddTempleOpen(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #7B2FBE, #4A90D9)',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: '13px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 0 16px rgba(123, 47, 190, 0.4)'
                  }}
                >
                  <Plus size={16} /> Add Partner Temple
                </button>
              </div>

              {/* Map & Detail Split View */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px', flex: 1, minHeight: '520px' }}>
                
                {/* Leaflet GPS Map Container */}
                <div style={{ 
                  borderRadius: '12px', 
                  overflow: 'hidden', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  position: 'relative'
                }}>
                  <MapContainer 
                    center={[13.7563, 100.5018]} 
                    zoom={10} 
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
                      url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />
                    {filteredTemples.map(t => (
                      <Marker 
                        key={t.id} 
                        position={[t.lat, t.lng]} 
                        icon={templeIcon}
                        eventHandlers={{
                          click: () => setSelectedTemple(t),
                        }}
                      >
                        <Popup>
                          <div style={{ color: '#070B1A', fontFamily: 'inherit' }}>
                            <strong style={{ fontSize: '14px' }}>{t.name}</strong>
                            <div style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>{t.name_th}</div>
                            <div style={{ fontSize: '12px', marginTop: '6px', fontWeight: 600, color: '#7B2FBE' }}>
                              Turnkey: ฿{t.pricing.turnkey.toLocaleString()}
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>

                {/* Selected Temple Inspector / Price Card */}
                {selectedTemple && (
                  <div style={{ 
                    backgroundColor: '#0d1535', 
                    borderRadius: '12px', 
                    border: '1px solid rgba(255, 255, 255, 0.1)', 
                    padding: '24px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '16px',
                    overflowY: 'auto'
                  }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>{selectedTemple.name}</h2>
                          <p style={{ fontSize: '13px', color: '#7eb8ff', margin: '4px 0 0 0' }}>{selectedTemple.name_th}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button
                            onClick={() => {
                              const updated = temples.map(t => t.id === selectedTemple.id ? { ...t, isApproved: !t.isApproved } : t);
                              setTemples(updated);
                              setSelectedTemple({ ...selectedTemple, isApproved: !selectedTemple.isApproved });
                              showToast(`Temple status updated to ${!selectedTemple.isApproved ? 'Approved' : 'Pending'}`);
                            }}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '12px',
                              backgroundColor: selectedTemple.isApproved !== false ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                              color: selectedTemple.isApproved !== false ? '#10b981' : '#f87171',
                              fontSize: '11px',
                              fontWeight: 600,
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            {selectedTemple.isApproved !== false ? '✓ Approved' : '⏳ Pending'}
                          </button>
                          <span style={{ padding: '4px 10px', borderRadius: '12px', backgroundColor: 'rgba(255, 215, 0, 0.15)', color: '#ffd700', fontSize: '12px', fontWeight: 600 }}>
                            ★ {selectedTemple.rating} ({selectedTemple.reviews} reviews)
                          </span>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                        <p style={{ fontSize: '12px', color: '#b8c4e0', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                          <MapPin size={14} color="#6f80a8" /> {selectedTemple.address}
                        </p>
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${selectedTemple.lat},${selectedTemple.lng}`} 
                          target="_blank" 
                          rel="noreferrer"
                          style={{ fontSize: '12px', color: '#10b981', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          Google Maps ↗
                        </a>
                      </div>

                      <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '12px', color: '#6f80a8' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Phone size={13} /> {selectedTemple.phone}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MessageSquare size={13} /> {selectedTemple.line_id}
                        </span>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px' }}>
                      <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#ffd700', textTransform: 'uppercase', marginBottom: '8px' }}>
                        💰 Official Costing Matrix (Direct Temple Rates)
                      </h3>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                        <div style={{ backgroundColor: '#141f4d', padding: '10px', borderRadius: '8px' }}>
                          <span style={{ color: '#6f80a8', display: 'block' }}>Small Dog (&lt;5kg)</span>
                          <strong style={{ color: '#FFFFFF', fontSize: '14px' }}>฿{selectedTemple.pricing.small.toLocaleString()}</strong>
                        </div>
                        <div style={{ backgroundColor: '#141f4d', padding: '10px', borderRadius: '8px' }}>
                          <span style={{ color: '#6f80a8', display: 'block' }}>Medium Dog (5-15kg)</span>
                          <strong style={{ color: '#FFFFFF', fontSize: '14px' }}>฿{selectedTemple.pricing.medium.toLocaleString()}</strong>
                        </div>
                        <div style={{ backgroundColor: '#141f4d', padding: '10px', borderRadius: '8px' }}>
                          <span style={{ color: '#6f80a8', display: 'block' }}>Large Dog (15-30kg)</span>
                          <strong style={{ color: '#FFFFFF', fontSize: '14px' }}>฿{selectedTemple.pricing.large.toLocaleString()}</strong>
                        </div>
                        <div style={{ backgroundColor: '#141f4d', padding: '10px', borderRadius: '8px' }}>
                          <span style={{ color: '#6f80a8', display: 'block' }}>Extra Large (&gt;30kg)</span>
                          <strong style={{ color: '#FFFFFF', fontSize: '14px' }}>฿{selectedTemple.pricing.extraLarge.toLocaleString()}</strong>
                        </div>
                      </div>

                      <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                        <div style={{ backgroundColor: 'rgba(123, 47, 190, 0.15)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(123, 47, 190, 0.25)' }}>
                          <span style={{ color: '#b8c4e0', display: 'block' }}>Praying (1 Day)</span>
                          <strong style={{ color: '#FFFFFF', fontSize: '14px' }}>฿{selectedTemple.pricing.praying1Day.toLocaleString()}</strong>
                        </div>
                        <div style={{ backgroundColor: 'rgba(123, 47, 190, 0.15)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(123, 47, 190, 0.25)' }}>
                          <span style={{ color: '#b8c4e0', display: 'block' }}>Praying (3 Days)</span>
                          <strong style={{ color: '#FFFFFF', fontSize: '14px' }}>฿{selectedTemple.pricing.praying3Days.toLocaleString()}</strong>
                        </div>
                        <div style={{ backgroundColor: 'rgba(0, 210, 255, 0.1)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(0, 210, 255, 0.2)' }}>
                          <span style={{ color: '#b8c4e0', display: 'block' }}>Ash to River (Loi Angkhan)</span>
                          <strong style={{ color: '#7eb8ff', fontSize: '14px' }}>฿{selectedTemple.pricing.ashToRiver.toLocaleString()}</strong>
                        </div>
                        <div style={{ backgroundColor: 'rgba(255, 215, 0, 0.1)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255, 215, 0, 0.2)' }}>
                          <span style={{ color: '#ffd700', display: 'block' }}>Full Turnkey Service</span>
                          <strong style={{ color: '#ffd700', fontSize: '14px' }}>฿{selectedTemple.pricing.turnkey.toLocaleString()}</strong>
                        </div>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px' }}>
                      <h4 style={{ fontSize: '12px', color: '#6f80a8', textTransform: 'uppercase', marginBottom: '8px' }}>
                        Temple Facilities & Ritual Services
                      </h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {selectedTemple.features.map((feat, idx) => (
                          <span key={idx} style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '6px', backgroundColor: '#141f4d', color: '#b8c4e0' }}>
                            ✓ {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: BOOKINGS & 2C2P LIVE TERMINAL */}
          {activeTab === 'bookings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* 2C2P Live Test Sandbox Runner Box */}
              <div style={{ 
                backgroundColor: '#0d1535', 
                borderRadius: '12px', 
                border: '1px solid rgba(126, 184, 255, 0.3)', 
                padding: '20px',
                background: 'linear-gradient(135deg, rgba(13, 21, 53, 0.95), rgba(27, 42, 107, 0.6))'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CreditCard size={20} color="#7eb8ff" />
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                      2C2P Sandbox Live Payment Terminal (Day 1 Verified Gateway)
                    </h3>
                  </div>
                  <span style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={14} /> Merchant ID: <strong>JT04 (Thailand THB)</strong>
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input 
                    type="text"
                    value={testDescription}
                    onChange={(e) => setTestDescription(e.target.value)}
                    style={{ flex: 2, padding: '10px 14px', borderRadius: '8px', backgroundColor: '#070b1a', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF', fontSize: '13px' }}
                    placeholder="Booking service description..."
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#070b1a', padding: '0 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <span style={{ color: '#ffd700', fontSize: '13px', fontWeight: 600 }}>฿</span>
                    <input 
                      type="number"
                      value={testAmount}
                      onChange={(e) => setTestAmount(e.target.value)}
                      style={{ width: '90px', padding: '10px 0', backgroundColor: 'transparent', border: 'none', color: '#FFFFFF', fontSize: '14px', fontWeight: 600 }}
                    />
                  </div>

                  <button 
                    onClick={handleTest2C2PPayment}
                    disabled={isRequesting2C2P}
                    style={{ 
                      padding: '10px 20px', 
                      borderRadius: '8px', 
                      background: 'linear-gradient(135deg, #7B2FBE, #4A90D9)', 
                      color: '#FFFFFF', 
                      fontWeight: 600, 
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 0 16px rgba(123, 47, 190, 0.4)'
                    }}
                  >
                    {isRequesting2C2P ? <RefreshCw size={14} className="animate-spin" /> : <ExternalLink size={14} />}
                    {isRequesting2C2P ? 'Signing JWT...' : 'Generate 2C2P Token & Pay'}
                  </button>
                </div>

                {sandboxResult && (
                  <div style={{ marginTop: '16px', padding: '14px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '13px', color: '#10b981', fontWeight: 600 }}>
                        ✓ 2C2P Token Generated Successfully! (Invoice: {sandboxResult.invoiceNo})
                      </div>
                      {sandboxResult.webPaymentUrl && (
                        <a 
                          href={sandboxResult.webPaymentUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          style={{ 
                            padding: '6px 14px', 
                            borderRadius: '6px', 
                            backgroundColor: '#10b981', 
                            color: '#070b1a', 
                            fontWeight: 600, 
                            fontSize: '12px',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          Open 2C2P Checkout UI <ArrowUpRight size={14} />
                        </a>
                      )}
                    </div>
                    <div style={{ fontSize: '11px', color: '#b8c4e0', marginTop: '6px', wordBreak: 'break-all' }}>
                      <strong>Payment Token:</strong> {sandboxResult.paymentToken}
                    </div>
                  </div>
                )}
              </div>

              {/* Bookings Table with Filters */}
              <div style={{ backgroundColor: '#0d1535', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>Temple Memorial Bookings</h3>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {['ALL', 'PAID', 'PENDING'].map(f => (
                        <button
                          key={f}
                          onClick={() => setBookingFilter(f)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 600,
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: bookingFilter === f ? '#7eb8ff' : '#141f4d',
                            color: bookingFilter === f ? '#070B1A' : '#b8c4e0'
                          }}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', color: '#6f80a8' }}>
                    {filteredBookings.length} records • Realtime sync active
                  </span>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#0a1029', color: '#6f80a8', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <th style={{ padding: '12px 20px' }}>Booking ID</th>
                      <th style={{ padding: '12px 20px' }}>Pet Companion</th>
                      <th style={{ padding: '12px 20px' }}>Temple</th>
                      <th style={{ padding: '12px 20px' }}>Service Selected</th>
                      <th style={{ padding: '12px 20px' }}>Amount</th>
                      <th style={{ padding: '12px 20px' }}>Payment Status</th>
                      <th style={{ padding: '12px 20px' }}>Gateway Reference</th>
                      <th style={{ padding: '12px 20px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map(b => (
                      <tr key={b.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <td style={{ padding: '14px 20px', fontWeight: 600, color: '#7eb8ff' }}>{b.id}</td>
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ fontWeight: 500, color: '#FFFFFF' }}>{b.petName}</div>
                          <div style={{ fontSize: '11px', color: '#6f80a8' }}>{b.petType} • {b.ownerName}</div>
                        </td>
                        <td style={{ padding: '14px 20px', color: '#b8c4e0' }}>{b.templeName}</td>
                        <td style={{ padding: '14px 20px', color: '#b8c4e0' }}>{b.service}</td>
                        <td style={{ padding: '14px 20px', fontWeight: 600, color: '#ffd700' }}>฿{b.amount.toLocaleString()}</td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{ 
                            padding: '4px 10px', 
                            borderRadius: '12px', 
                            fontSize: '11px', 
                            fontWeight: 600,
                            backgroundColor: b.paymentStatus === 'PAID' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: b.paymentStatus === 'PAID' ? '#10b981' : '#f87171'
                          }}>
                            {b.paymentStatus === 'PAID' ? '✓ PAID' : '⏳ PENDING'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px', fontSize: '11px', color: '#6f80a8', fontFamily: 'monospace' }}>
                          {b.gatewayInvoice}
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <button
                            onClick={() => setSelectedBookingDetails(b)}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '6px',
                              backgroundColor: '#141f4d',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              color: '#7eb8ff',
                              fontSize: '11px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Eye size={12} /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: STAR CONSTELLATIONS */}
          {activeTab === 'stars' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                    Journey to the Stars — Memorial Sky Constellation
                  </h3>
                  <p style={{ fontSize: '12px', color: '#7eb8ff', margin: '4px 0 0 0' }}>
                    Every pet commemorated ascends into the galaxy with personal coordinates and lasting tribute.
                  </p>
                </div>
                <div style={{ fontSize: '13px', color: '#ffd700', fontWeight: 600 }}>
                  ✨ {stars.length} Guardian Stars Shining
                </div>
              </div>

              {/* Cosmic Sky Preview Box */}
              <div style={{ 
                height: '340px', 
                borderRadius: '12px', 
                position: 'relative', 
                backgroundColor: '#040714',
                backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(123, 47, 190, 0.3) 0%, rgba(7, 11, 26, 0.9) 80%)',
                border: '1px solid rgba(126, 184, 255, 0.25)',
                overflow: 'hidden'
              }}>
                {stars.map(s => (
                  <div 
                    key={s.id}
                    style={{ 
                      position: 'absolute', 
                      left: `${s.x}%`, 
                      top: `${s.y}%`, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      transform: 'translate(-50%, -50%)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ 
                      width: '14px', 
                      height: '14px', 
                      borderRadius: '50%', 
                      backgroundColor: s.color, 
                      boxShadow: `0 0 16px ${s.color}, 0 0 32px ${s.color}` 
                    }} />
                    <span style={{ fontSize: '11px', color: '#FFFFFF', marginTop: '4px', fontWeight: 600, textShadow: '0 0 8px #000' }}>
                      {s.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Stars Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {stars.map(s => (
                  <div key={s.id} style={{ backgroundColor: '#0d1535', borderRadius: '10px', padding: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: s.color }}></span>
                        <strong style={{ color: '#FFFFFF', fontSize: '14px' }}>{s.name}</strong>
                      </div>
                      <span style={{ fontSize: '11px', color: '#ffd700' }}>{s.years}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#7eb8ff', marginBottom: '8px' }}>{s.type}</p>
                    <p style={{ fontSize: '12px', color: '#b8c4e0', fontStyle: 'italic', lineHeight: 1.4, margin: 0 }}>
                      "{s.tribute}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ADVERTISEMENTS & SPONSORS */}
          {activeTab === 'ads' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                    Sponsor Advertisements & Revenue Partners
                  </h3>
                  <p style={{ fontSize: '12px', color: '#7eb8ff', margin: '4px 0 0 0' }}>
                    Commercial partner campaigns across Pet Insurance, Veterinary Care, and Keepsake Urns.
                  </p>
                </div>
                <button 
                  onClick={() => setIsAddAdOpen(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #7B2FBE, #4A90D9)',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: '13px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 0 16px rgba(123, 47, 190, 0.4)'
                  }}
                >
                  <Plus size={16} /> Add Sponsor Partner
                </button>
              </div>

              {/* Sponsor KPI Summary */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div style={{ backgroundColor: '#0d1535', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span style={{ fontSize: '12px', color: '#6f80a8' }}>Active Campaigns</span>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF', marginTop: '4px' }}>
                    {ads.filter(a => a.status === 'ACTIVE').length} / {ads.length}
                  </div>
                </div>
                <div style={{ backgroundColor: '#0d1535', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span style={{ fontSize: '12px', color: '#6f80a8' }}>Monthly Ad Revenue</span>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#ffd700', marginTop: '4px' }}>
                    ฿{totalAdRevenue.toLocaleString()} / mo
                  </div>
                </div>
                <div style={{ backgroundColor: '#0d1535', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span style={{ fontSize: '12px', color: '#6f80a8' }}>Total Impressions</span>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#7eb8ff', marginTop: '4px' }}>
                    {ads.reduce((s, a) => s + (a.impressions || 0), 0).toLocaleString()}
                  </div>
                </div>
                <div style={{ backgroundColor: '#0d1535', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span style={{ fontSize: '12px', color: '#6f80a8' }}>Avg Click-Through Rate</span>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#10b981', marginTop: '4px' }}>
                    4.74%
                  </div>
                </div>
              </div>

              {/* Sponsor Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
                {ads.map(ad => (
                  <div key={ad.id} style={{ 
                    backgroundColor: '#0d1535', 
                    borderRadius: '12px', 
                    border: '1px solid rgba(255, 255, 255, 0.08)', 
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <div style={{ height: '100px', position: 'relative', overflow: 'hidden' }}>
                      <img src={ad.bannerUrl} alt={ad.sponsorName} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
                      <div style={{ position: 'absolute', top: '12px', left: '16px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '12px', backgroundColor: ad.badgeColor, color: '#FFFFFF', fontSize: '11px', fontWeight: 600 }}>
                          {ad.category}
                        </span>
                      </div>
                      <div style={{ position: 'absolute', top: '12px', right: '16px' }}>
                        <button
                          onClick={() => {
                            setAds(prev => prev.map(a => a.id === ad.id ? { ...a, status: a.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' } : a));
                            showToast(`${ad.sponsorName} status changed!`);
                          }}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 600,
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: ad.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.8)' : 'rgba(239, 68, 68, 0.8)',
                            color: '#FFFFFF'
                          }}
                        >
                          {ad.status === 'ACTIVE' ? '● Active' : '⏸ Paused'}
                        </button>
                      </div>
                    </div>

                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                      <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>{ad.sponsorName}</h4>
                      <p style={{ fontSize: '12px', color: '#b8c4e0', margin: 0, lineHeight: 1.4 }}>{ad.tagline}</p>
                      
                      <div style={{ fontSize: '11px', color: '#6f80a8' }}>
                        Placement: <strong style={{ color: '#7eb8ff' }}>{ad.placement}</strong>
                      </div>

                      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontSize: '11px', color: '#6f80a8' }}>Monthly Sponsorship</span>
                          <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffd700' }}>฿{ad.monthlyFee.toLocaleString()}/mo</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '11px', color: '#6f80a8' }}>Performance</span>
                          <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>{ad.clicks} clicks ({ad.ctr})</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: ARTICLES & GUIDES CMS */}
          {activeTab === 'articles' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                  Pet Funeral Guidance & Cremation Standards CMS
                </h3>
                <p style={{ fontSize: '12px', color: '#7eb8ff', margin: '4px 0 0 0' }}>
                  Educational guidance rendered directly in both mobile app and web portals for grieving pet parents.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {articles.map(art => (
                  <div key={art.id} style={{ backgroundColor: '#0d1535', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '10px', backgroundColor: 'rgba(126, 184, 255, 0.15)', color: '#7eb8ff', fontSize: '11px', fontWeight: 600 }}>
                        {art.category}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '11px', color: '#6f80a8' }}>⏱ {art.readTime} read</span>
                        <button
                          onClick={() => setEditingArticle(art)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            backgroundColor: '#141f4d',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#ffd700',
                            fontSize: '11px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Edit3 size={12} /> Edit in CMS
                        </button>
                      </div>
                    </div>

                    <h4 style={{ fontSize: '15px', color: '#FFFFFF', fontWeight: 600, margin: 0 }}>{art.title}</h4>
                    <p style={{ fontSize: '12px', color: '#ffd700', margin: 0 }}>{art.title_th}</p>
                    <p style={{ fontSize: '13px', color: '#b8c4e0', margin: 0, lineHeight: 1.5 }}>{art.summary}</p>
                    
                    {art.content && (
                      <div style={{ backgroundColor: '#070b1a', padding: '12px', borderRadius: '8px', fontSize: '12px', color: '#a0aec0', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                        {art.content}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: PLATFORM REVENUE & ECONOMICS */}
          {activeTab === 'analytics' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                  Consolidated Business Model & Financial Performance
                </h3>
                <p style={{ fontSize: '12px', color: '#7eb8ff', margin: '4px 0 0 0' }}>
                  Revenue distribution across consolidated turnkey ceremonies, temple commission fees, and brand sponsorships.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                <div style={{ backgroundColor: '#0d1535', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span style={{ fontSize: '12px', color: '#6f80a8' }}>Stream 1: Consolidated Turnkey Services</span>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: '#ffd700', marginTop: '6px' }}>
                    ฿{totalBookingsRevenue.toLocaleString()}
                  </div>
                  <p style={{ fontSize: '11px', color: '#b8c4e0', marginTop: '6px' }}>
                    Full pickup to the end (Chao Phraya ash scattering with professional digital memorial photos).
                  </p>
                </div>

                <div style={{ backgroundColor: '#0d1535', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span style={{ fontSize: '12px', color: '#6f80a8' }}>Stream 2: Temple Platform Partnership Fees</span>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: '#10b981', marginTop: '6px' }}>
                    ฿{estimatedTempleFees.toLocaleString()}
                  </div>
                  <p style={{ fontSize: '11px', color: '#b8c4e0', marginTop: '6px' }}>
                    10-15% commission fee from 8 certified smokeless partner temples nationwide.
                  </p>
                </div>

                <div style={{ backgroundColor: '#0d1535', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span style={{ fontSize: '12px', color: '#6f80a8' }}>Stream 3: Sponsor Advertisements</span>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: '#7eb8ff', marginTop: '6px' }}>
                    ฿{totalAdRevenue.toLocaleString()} / mo
                  </div>
                  <p style={{ fontSize: '11px', color: '#b8c4e0', marginTop: '6px' }}>
                    Recurring monthly brand sponsorships (Muang Thai Pet Insurance, Thonglor Hospital, Urns).
                  </p>
                </div>
              </div>

              {/* Economic Breakdown Table */}
              <div style={{ backgroundColor: '#0d1535', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <h4 style={{ fontSize: '14px', color: '#FFFFFF', fontWeight: 600, marginBottom: '16px' }}>
                  Platform Economic Model Breakdown
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#141f4d', borderRadius: '8px' }}>
                    <span style={{ color: '#b8c4e0' }}>Average Turnkey Order Value (AOV)</span>
                    <strong style={{ color: '#FFFFFF' }}>฿6,500 THB</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#141f4d', borderRadius: '8px' }}>
                    <span style={{ color: '#b8c4e0' }}>Pickup Transfer Fleet Margin</span>
                    <strong style={{ color: '#10b981' }}>฿800 - ฿1,000 THB / trip</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#141f4d', borderRadius: '8px' }}>
                    <span style={{ color: '#b8c4e0' }}>Loi Angkhan (Ash to River) Boat Charter Fee</span>
                    <strong style={{ color: '#7eb8ff' }}>฿1,200 - ฿1,800 THB</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#141f4d', borderRadius: '8px' }}>
                    <span style={{ color: '#b8c4e0' }}>Payment Gateway Processing Rate (2C2P Thailand Sandbox)</span>
                    <strong style={{ color: '#ffd700' }}>2.9% + ฿10 THB / transaction</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* MODAL: ADD TEMPLE */}
      {isAddTempleOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#0d1535',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            width: '560px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>Add New Partner Temple</h3>
              <button onClick={() => setIsAddTempleOpen(false)} style={{ background: 'none', border: 'none', color: '#6f80a8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveNewTemple} style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
              <div>
                <label style={{ display: 'block', color: '#b8c4e0', marginBottom: '4px' }}>Temple Name (English)</label>
                <input 
                  type="text" 
                  required 
                  value={newTempleData.name} 
                  onChange={e => setNewTempleData({ ...newTempleData, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#070b1a', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF' }}
                  placeholder="e.g. Wat Yannawa Pet Memorial"
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#b8c4e0', marginBottom: '4px' }}>Temple Name (Thai)</label>
                <input 
                  type="text" 
                  value={newTempleData.name_th} 
                  onChange={e => setNewTempleData({ ...newTempleData, name_th: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#070b1a', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF' }}
                  placeholder="e.g. วัดยานนาวา (แผนกส่งสัตว์เลี้ยง)"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', color: '#b8c4e0', marginBottom: '4px' }}>District</label>
                  <input 
                    type="text" 
                    value={newTempleData.district} 
                    onChange={e => setNewTempleData({ ...newTempleData, district: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#070b1a', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF' }}
                    placeholder="Sathon"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#b8c4e0', marginBottom: '4px' }}>Province</label>
                  <select 
                    value={newTempleData.province} 
                    onChange={e => setNewTempleData({ ...newTempleData, province: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#070b1a', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF' }}
                  >
                    <option value="Bangkok">Bangkok</option>
                    <option value="Nonthaburi">Nonthaburi</option>
                    <option value="Chiang Mai">Chiang Mai</option>
                    <option value="Nakhon Pathom">Nakhon Pathom</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', color: '#b8c4e0', marginBottom: '4px' }}>Latitude</label>
                  <input 
                    type="number" 
                    step="any"
                    value={newTempleData.lat} 
                    onChange={e => setNewTempleData({ ...newTempleData, lat: parseFloat(e.target.value) || 13.75 })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#070b1a', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#b8c4e0', marginBottom: '4px' }}>Longitude</label>
                  <input 
                    type="number" 
                    step="any"
                    value={newTempleData.lng} 
                    onChange={e => setNewTempleData({ ...newTempleData, lng: parseFloat(e.target.value) || 100.5 })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#070b1a', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', color: '#ffd700', fontWeight: 600, marginBottom: '6px' }}>Costing Rates (THB)</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#6f80a8' }}>Small Dog (&lt;5kg)</span>
                    <input 
                      type="number" 
                      value={newTempleData.pricing.small} 
                      onChange={e => setNewTempleData({ ...newTempleData, pricing: { ...newTempleData.pricing, small: Number(e.target.value) } })}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', backgroundColor: '#070b1a', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF' }}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#6f80a8' }}>Turnkey Package</span>
                    <input 
                      type="number" 
                      value={newTempleData.pricing.turnkey} 
                      onChange={e => setNewTempleData({ ...newTempleData, pricing: { ...newTempleData.pricing, turnkey: Number(e.target.value) } })}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', backgroundColor: '#070b1a', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsAddTempleOpen(false)}
                  style={{ padding: '8px 16px', borderRadius: '6px', backgroundColor: 'transparent', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#b8c4e0', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{ padding: '8px 18px', borderRadius: '6px', backgroundColor: '#7B2FBE', color: '#FFFFFF', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                >
                  Save Temple
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD SPONSOR AD */}
      {isAddAdOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#0d1535',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            width: '480px',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>Add Sponsor Partnership</h3>
              <button onClick={() => setIsAddAdOpen(false)} style={{ background: 'none', border: 'none', color: '#6f80a8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveNewAd} style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
              <div>
                <label style={{ display: 'block', color: '#b8c4e0', marginBottom: '4px' }}>Sponsor Brand Name</label>
                <input 
                  type="text" 
                  required 
                  value={newAdData.sponsorName} 
                  onChange={e => setNewAdData({ ...newAdData, sponsorName: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#070b1a', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF' }}
                  placeholder="e.g. Bangkok Pet Memorial Garden"
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#b8c4e0', marginBottom: '4px' }}>Category</label>
                <select 
                  value={newAdData.category} 
                  onChange={e => setNewAdData({ ...newAdData, category: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#070b1a', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF' }}
                >
                  <option value="Pet Insurance">Pet Insurance</option>
                  <option value="Pet Care & Veterinary">Pet Care & Veterinary</option>
                  <option value="Memorial Products">Memorial Products</option>
                  <option value="Temple & Ritual Partner">Temple & Ritual Partner</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', color: '#b8c4e0', marginBottom: '4px' }}>Tagline / Promotional Copy</label>
                <input 
                  type="text" 
                  value={newAdData.tagline} 
                  onChange={e => setNewAdData({ ...newAdData, tagline: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#070b1a', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF' }}
                  placeholder="e.g. Sacred ash scattering garden in natural pine forest"
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#b8c4e0', marginBottom: '4px' }}>Monthly Fee (THB)</label>
                <input 
                  type="number" 
                  value={newAdData.monthlyFee} 
                  onChange={e => setNewAdData({ ...newAdData, monthlyFee: Number(e.target.value) })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#070b1a', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsAddAdOpen(false)}
                  style={{ padding: '8px 16px', borderRadius: '6px', backgroundColor: 'transparent', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#b8c4e0', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{ padding: '8px 18px', borderRadius: '6px', backgroundColor: '#7B2FBE', color: '#FFFFFF', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                >
                  Add Sponsor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT CMS ARTICLE */}
      {editingArticle && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#0d1535',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            width: '640px',
            padding: '24px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>Edit Guidance Article</h3>
              <button onClick={() => setEditingArticle(null)} style={{ background: 'none', border: 'none', color: '#6f80a8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
              <div>
                <label style={{ display: 'block', color: '#b8c4e0', marginBottom: '4px' }}>English Title</label>
                <input 
                  type="text" 
                  value={editingArticle.title} 
                  onChange={e => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#070b1a', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#b8c4e0', marginBottom: '4px' }}>Thai Title</label>
                <input 
                  type="text" 
                  value={editingArticle.title_th} 
                  onChange={e => setEditingArticle({ ...editingArticle, title_th: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#070b1a', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#b8c4e0', marginBottom: '4px' }}>Summary</label>
                <textarea 
                  rows={2}
                  value={editingArticle.summary} 
                  onChange={e => setEditingArticle({ ...editingArticle, summary: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#070b1a', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#b8c4e0', marginBottom: '4px' }}>Article Full Content</label>
                <textarea 
                  rows={6}
                  value={editingArticle.content || ''} 
                  onChange={e => setEditingArticle({ ...editingArticle, content: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#070b1a', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF', fontFamily: 'monospace' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setEditingArticle(null)}
                  style={{ padding: '8px 16px', borderRadius: '6px', backgroundColor: 'transparent', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#b8c4e0', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveArticle}
                  style={{ padding: '8px 18px', borderRadius: '6px', backgroundColor: '#10b981', color: '#070B1A', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Save size={14} /> Save Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: BOOKING DETAIL VIEW */}
      {selectedBookingDetails && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#0d1535',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            width: '500px',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#7eb8ff', fontWeight: 600 }}>{selectedBookingDetails.id}</span>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', margin: '2px 0 0 0' }}>
                  Booking Details: {selectedBookingDetails.petName}
                </h3>
              </div>
              <button onClick={() => setSelectedBookingDetails(null)} style={{ background: 'none', border: 'none', color: '#6f80a8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ color: '#6f80a8' }}>Pet Type / Breed:</span>
                <strong style={{ color: '#FFFFFF' }}>{selectedBookingDetails.petType}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ color: '#6f80a8' }}>Owner:</span>
                <strong style={{ color: '#FFFFFF' }}>{selectedBookingDetails.ownerName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ color: '#6f80a8' }}>Temple Assigned:</span>
                <strong style={{ color: '#FFFFFF' }}>{selectedBookingDetails.templeName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ color: '#6f80a8' }}>Service Chosen:</span>
                <strong style={{ color: '#7eb8ff' }}>{selectedBookingDetails.service}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ color: '#6f80a8' }}>Pickup Address:</span>
                <strong style={{ color: '#FFFFFF' }}>{selectedBookingDetails.pickupAddress}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ color: '#6f80a8' }}>Payment Method:</span>
                <strong style={{ color: '#FFFFFF' }}>{selectedBookingDetails.paymentMethod}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ color: '#6f80a8' }}>Gateway Invoice:</span>
                <strong style={{ color: '#ffd700', fontFamily: 'monospace' }}>{selectedBookingDetails.gatewayInvoice}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 4px 0' }}>
                <span style={{ color: '#b8c4e0', fontSize: '14px' }}>Total Amount Paid:</span>
                <strong style={{ color: '#ffd700', fontSize: '18px' }}>฿{selectedBookingDetails.amount.toLocaleString()} THB</strong>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

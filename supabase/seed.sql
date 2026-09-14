-- ========================================================
-- Farewell to Stairway: Seed Data
-- ========================================================

-- Insert 8 Temples in Thailand (Bangkok, Nonthaburi, Chiang Mai)
INSERT INTO temples (id, name, name_th, description, address, district, province, latitude, longitude, phone, line_id, photos, rating, review_count)
VALUES
(
    '11111111-1111-1111-1111-111111111101',
    'Wat Klong Toey Nai Pet Memorial',
    'วัดคลองเตยใน (แผนกฌาปนกิจสัตว์เลี้ยง)',
    'Bangkok''s premier and most experienced pet funeral temple. Features 2 dedicated electric pet crematoriums, private air-conditioned chanting halls, and compassionate monk-led ceremonies.',
    '238 Sunthorn Kosa Rd, Khlong Toei',
    'Khlong Toei',
    'Bangkok',
    13.7126,
    100.5604,
    '02-249-1422',
    '@watklongtoeynai_pet',
    ARRAY['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=800&q=80'],
    4.9,
    128
),
(
    '11111111-1111-1111-1111-111111111102',
    'Wat Krathum Suea Pla Pet Crematorium',
    'วัดกระทุ่มเสือปลา (สุสานและฌาปนกิจสัตว์เลี้ยง)',
    'Serene riverside temple along Prawet Burirom canal. Renowned for respectful Buddhist ceremonies and boat services for ash dispersal into the Chao Phraya river mouth.',
    'Soi On Nut 67, Prawet',
    'Prawet',
    'Bangkok',
    13.7189,
    100.6781,
    '081-456-7890',
    '@watkrathumpet',
    ARRAY['https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=800&q=80'],
    4.8,
    94
),
(
    '11111111-1111-1111-1111-111111111103',
    'Wat Pha Suk Maneechak (Muang Thong)',
    'วัดผาสุกมณีจักร (เมืองทองธานี)',
    'Modern, spotless facility located in Muang Thong Thani. Offers complete turnkey funeral packages with personalized wooden photo urns and streaming for distant family members.',
    'Popular 3 Rd, Bang Phut, Pak Kret',
    'Pak Kret',
    'Nonthaburi',
    13.9135,
    100.5482,
    '089-890-1234',
    '@watphasuk_pet',
    ARRAY['https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=800&q=80'],
    5.0,
    156
),
(
    '11111111-1111-1111-1111-111111111104',
    'Wat Sam Phran Dragon Temple Pet Memorial',
    'วัดสามพราน (แผนกส่งดวงวิญญาณสัตว์เลี้ยง)',
    'Peaceful spiritual sanctuary surrounding the famous dragon tower. Offers private garden memorials, ash scattering under sacred bodhi trees, and riverside blessings.',
    '92/8 Village No. 7, Sam Phran',
    'Sam Phran',
    'Nakhon Pathom',
    13.7348,
    100.2155,
    '034-321-888',
    '@watsamphran_spirit',
    ARRAY['https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=800&q=80'],
    4.7,
    62
),
(
    '11111111-1111-1111-1111-111111111105',
    'Wat Yang (Luang Pho To) Pet Cremation',
    'วัดยาง พระอารามหลวง (หลวงพ่อโต อ่อนนุช)',
    'Historic temple on Sukhumvit 77 offering full Buddhist merit-making rituals, bespoke flower coffins, and private cremation rites.',
    'Soi Sukhumvit 77 (On Nut 23), Suan Luang',
    'Suan Luang',
    'Bangkok',
    13.7121,
    100.6105,
    '02-332-2114',
    '@watyang_petmerit',
    ARRAY['https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80'],
    4.8,
    88
),
(
    '11111111-1111-1111-1111-111111111106',
    'Wat Phra Si Mahathat Bang Khen',
    'วัดพระศรีมหาธาตุวรมหาวิหาร (บางเขน)',
    'Centrally accessible royal temple close to the BTS Green Line. Provides gentle, dignified individual pet cremations and keepsake glass reliquaries.',
    '149 Phahonyothin Rd, Anusawari, Bang Khen',
    'Bang Khen',
    'Bangkok',
    13.8741,
    100.5972,
    '02-521-0311',
    '@watphrasi_pet',
    ARRAY['https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80'],
    4.9,
    110
),
(
    '11111111-1111-1111-1111-111111111107',
    'Wat Umong Forest Sanctuary Pet Memorial',
    'วัดอุโมงค์ (สวนพุทธธรรม เชียงใหม่)',
    'Deep tranquil forest temple nestled at the foot of Doi Suthep. Provides woodland ash burials, natural stone tributes, and serene monk chants for Northern Thailand pet lovers.',
    '135 Moo 10, Suthep, Mueang Chiang Mai',
    'Mueang Chiang Mai',
    'Chiang Mai',
    18.7834,
    98.9515,
    '053-810-528',
    '@watumong_sanctuary',
    ARRAY['https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=800&q=80'],
    5.0,
    145
),
(
    '11111111-1111-1111-1111-111111111108',
    'Wat Phra That Doi Saket Pet Memorial Rites',
    'วัดพระธาตุดอยสะเก็ด (พิธีส่งสัตว์เลี้ยงสู่สุคติ)',
    'Elevated hilltop sanctuary overlooking Chiang Mai valleys. Dedicated stupa for beloved animal companions and scenic mountain ash dispersal ceremonies.',
    'Choeng Doi, Doi Saket',
    'Doi Saket',
    'Chiang Mai',
    18.8687,
    99.1352,
    '053-495-212',
    '@doisaket_pet',
    ARRAY['https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=800&q=80'],
    4.8,
    73
)
ON CONFLICT (id) DO NOTHING;

-- Temple Services & Pricing
INSERT INTO temple_services (temple_id, price_small_pet, price_medium_pet, price_large_pet, price_extra_large_pet, price_praying_1day, price_praying_3days, price_ash_to_river, price_turnkey_package, price_pickup, features)
VALUES
(
    '11111111-1111-1111-1111-111111111101',
    1500.00, 2000.00, 2800.00, 3500.00,
    1200.00, 3000.00, 1500.00, 6500.00, 800.00,
    ARRAY['2 Smokeless Cremators', 'Chao Phraya Ash Boat', 'Memorial Photo Wall', 'Private Chanting Room']
),
(
    '11111111-1111-1111-1111-111111111102',
    1400.00, 1900.00, 2600.00, 3200.00,
    1000.00, 2600.00, 1200.00, 5800.00, 700.00,
    ARRAY['Canal-side Pavilion', 'Loi Angkhan Ash Ceremony', 'Complimentary Lotus Flowers', 'Monk Blessings']
),
(
    '11111111-1111-1111-1111-111111111103',
    1800.00, 2400.00, 3200.00, 4000.00,
    1500.00, 3500.00, 1800.00, 7500.00, 900.00,
    ARRAY['VIP Air-Con Hall', 'Live Video Streaming', 'Engraved Wooden Urn', '24/7 Rapid Body Transfer']
),
(
    '11111111-1111-1111-1111-111111111104',
    1300.00, 1800.00, 2500.00, 3000.00,
    1000.00, 2500.00, 1200.00, 5500.00, 750.00,
    ARRAY['Sacred Bodhi Tree Scattering', 'Dragon Stupa Blessing', 'Garden Pet Cemetery', 'Eco Ceramic Keepsake']
),
(
    '11111111-1111-1111-1111-111111111105',
    1600.00, 2200.00, 2900.00, 3600.00,
    1300.00, 3200.00, 1500.00, 6800.00, 850.00,
    ARRAY['Fresh Flower Coffin', 'Traditional Robe Offering', 'High Temperature Cremator', 'Sukhumvit Location']
),
(
    '11111111-1111-1111-1111-111111111106',
    1700.00, 2300.00, 3000.00, 3800.00,
    1400.00, 3300.00, 1600.00, 7200.00, 800.00,
    ARRAY['Royal Stupa Area', 'BTS Bang Khen Accessible', 'Glass Crystal Reliquary', 'Personalized Memorial Banner']
),
(
    '11111111-1111-1111-1111-111111111107',
    1200.00, 1600.00, 2200.00, 2800.00,
    900.00, 2200.00, 1000.00, 4900.00, 600.00,
    ARRAY['Sacred Tunnel Reflection', 'Mountain Forest Burial', 'Lanna Buddhist Rituals', 'Natural River Release']
),
(
    '11111111-1111-1111-1111-111111111108',
    1300.00, 1700.00, 2400.00, 3000.00,
    1000.00, 2400.00, 1100.00, 5200.00, 650.00,
    ARRAY['Doi Saket Vista Pavilion', 'Scenic Ash Flight Scattering', 'Handmade Northern Urn', 'Private Family Rite']
)
ON CONFLICT DO NOTHING;

-- Seed Memorials ("Journey to the Stars" - Named stars appearing in the night sky)
INSERT INTO memorials (pet_name, pet_type, years_lived, tribute_message, is_star_memorial, star_x, star_y, star_color, star_brightness, likes_count)
VALUES
('Buddy', 'Golden Retriever', '2012 - 2026', 'You ran beside me through every high and low. Run free across the endless golden stars, my brave boy.', TRUE, 32.4, 28.5, '#FFD700', 1.0, 42),
('Luna', 'Persian Cat', '2015 - 2026', 'Our quiet moonbeam. Your gentle purr will always echo in our hearts whenever we look up at night.', TRUE, 68.1, 21.3, '#7EB8FF', 0.95, 38),
('Max', 'French Bulldog', '2016 - 2026', 'Little body, biggest personality in the world. Thank you for ten years of pure, unconditional joy.', TRUE, 22.8, 54.2, '#FFAAA6', 0.9, 29),
('Bella', 'Pomeranian', '2014 - 2026', 'The sweetest little cloud of happiness. You will always shine brightest in our constellation.', TRUE, 78.5, 42.0, '#E8D0FF', 0.92, 51),
('Charlie', 'Beagle', '2013 - 2026', 'Always on the trail of an adventure. Follow the starry paths above, good boy.', TRUE, 45.0, 38.6, '#FFD700', 0.88, 25),
('Milo', 'Scottish Fold', '2017 - 2026', 'Curled up forever in our souls. Rest peacefully among the stars.', TRUE, 55.3, 62.1, '#7EB8FF', 0.85, 33),
('Daisy', 'Cockatiel', '2018 - 2026', 'Your cheerful morning songs will serenade the angels now.', TRUE, 85.2, 70.4, '#FFFFB5', 0.82, 19);

-- Seed Knowledge Base Articles
INSERT INTO app_articles (title, title_th, slug, category, summary, content_markdown, read_time_mins, sort_order)
VALUES
(
    'How to Prepare Your Pet for the Funeral Rite',
    'วิธีเตรียมตัวและดูแลร่างสัตว์เลี้ยงเบื้องต้นก่อนทำพิธี',
    'how-to-prepare-pet-funeral',
    'FUNERAL_PREPARATION',
    'Step-by-step guidance on keeping your pet comfortable, positioning their body, and preserving them during the first crucial hours before ceremony arrival.',
    '# How to Prepare Your Beloved Pet for Funeral

When a pet passes away at home, knowing what immediate steps to take can offer comfort and preserve their dignity.

### 1. Position Their Body Gently
Within the first 1 to 2 hours (before rigor mortis sets in), gently position your pet in a natural, curled sleeping position:
- Tuck their legs close to their belly.
- Place a soft blanket or favorite towel underneath them.
- Close their eyes gently with light fingertip pressure if possible.

### 2. Temperature Management
- Keep the room cool with air-conditioning set to 18-20°C.
- Wrap ice packs in a clean cloth and place them under their lower abdomen and spine.
- Avoid placing direct ice on their fur to prevent moisture damage.

### 3. Contact Temple or Request Our Pickup
- Standard ceremony hours are between 10:00 - 17:00.
- Our dedicated transport team is equipped with temperature-controlled carriers to transfer your companion respectfully from your home or veterinary clinic.',
    4,
    1
),
(
    'What Can and Cannot Be Cremated With the Body',
    'สิ่งของที่สามารถและไม่สามารถนำเข้าเตาเผาพร้อมร่างสัตว์เลี้ยง',
    'what-can-be-cremated-with-pet',
    'CREMATION_GUIDE',
    'A practical guide to choosing meaningful keepsakes, favorite treats, and fresh flowers while complying with eco-friendly crematorium standards.',
    '# What Can Be Cremated With Your Pet

Modern pet crematoriums in Thailand adhere to eco-friendly smokeless standards. Here is what is welcomed and what must be kept as home keepsakes.

### ✅ Welcomed Items Inside the Coffin
- **Fresh flowers & petals**: Jasmine, lotus, roses, orchids, and marigolds.
- **Natural cotton or silk cloth**: Their favorite lightweight cotton blanket.
- **Small dry treats**: Favorite biscuits or dried snacks placed in paper wrappers.
- **Personal handwritten letters & family photos**: Written on plain paper without lamination.
- **Buddhist prayer cloths**: Robes or ceremonial cloth presented to the monks.

### ❌ Items That Cannot Be Placed in the Cremator
- **Plastic toys & rubber balls**: Synthetic materials cause toxic fumes and residue.
- **Metal collars, leash clips & microchips**: These melt and contaminate bone relics. (Our staff will respectfully unclip and return their collar to you).
- **Batteries & electronic gadgets**: Strictly prohibited due to combustion risk.
- **Synthetic beds containing synthetic foam**: Polyurethane foam produces dense black smoke.

*Tip: You can bring favorite toys to the prayer altar for monk blessings, and take them back home to treasure.*',
    3,
    2
);

-- Seed Advertisements
INSERT INTO advertisements (title, sponsor_name, category, banner_url, target_url, placement)
VALUES
('Muang Thai Pet Insurance - Caring for your family''s future', 'Muang Thai Insurance', 'Pet Insurance', 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1200&q=80', 'https://www.muangthai.co.th', 'HOME_BANNER'),
('Pawprints Artisan Crystal Urns & Keepsake Pendants', 'Starry Urns Thailand', 'Memorial Urns', 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80', 'https://starryurns.example.com', 'MEMORIAL_FOOTER');

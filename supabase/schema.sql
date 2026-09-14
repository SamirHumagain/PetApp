-- ========================================================
-- Farewell to Stairway: Database Schema
-- Supabase / PostgreSQL Migration
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
DO $$ BEGIN
    CREATE TYPE pet_size AS ENUM ('SMALL', 'MEDIUM', 'LARGE', 'EXTRA_LARGE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_channel AS ENUM ('CC', 'PROMPTPAY', 'IPP', 'LINEPAY', 'TRUEMONEY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. TEMPLES TABLE
CREATE TABLE IF NOT EXISTS temples (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    name_th VARCHAR(255),
    description TEXT,
    address TEXT NOT NULL,
    district VARCHAR(100),
    province VARCHAR(100) NOT NULL DEFAULT 'Bangkok',
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    phone VARCHAR(50),
    line_id VARCHAR(100),
    photos TEXT[] DEFAULT '{}',
    is_approved BOOLEAN DEFAULT TRUE,
    rating NUMERIC(2,1) DEFAULT 4.9,
    review_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TEMPLE SERVICES & PRICING
CREATE TABLE IF NOT EXISTS temple_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    temple_id UUID NOT NULL REFERENCES temples(id) ON DELETE CASCADE,
    
    -- Cremation base by pet size (in THB)
    price_small_pet NUMERIC(10,2) NOT NULL DEFAULT 1500.00,       -- < 5kg
    price_medium_pet NUMERIC(10,2) NOT NULL DEFAULT 2000.00,      -- 5-15kg
    price_large_pet NUMERIC(10,2) NOT NULL DEFAULT 2800.00,       -- 15-30kg
    price_extra_large_pet NUMERIC(10,2) NOT NULL DEFAULT 3500.00, -- > 30kg
    
    -- Praying / Chanting services
    price_praying_1day NUMERIC(10,2) NOT NULL DEFAULT 1200.00,
    price_praying_3days NUMERIC(10,2) NOT NULL DEFAULT 3000.00,
    
    -- Ash dispersal to river (Loi Angkhan)
    price_ash_to_river NUMERIC(10,2) NOT NULL DEFAULT 1500.00,
    
    -- Full Turnkey Package (Pickup, 1-day chanting, cremation, ash to river, photo memorial)
    price_turnkey_package NUMERIC(10,2) NOT NULL DEFAULT 6500.00,
    
    -- Pick-up service fee (standard zone)
    price_pickup NUMERIC(10,2) NOT NULL DEFAULT 800.00,
    
    -- Array of specific feature tags
    features TEXT[] DEFAULT ARRAY['Air-conditioned waiting room', 'Private chanting hall', 'Eco-friendly cremator', 'Flower arrangement included'],
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_number VARCHAR(64) UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    temple_id UUID NOT NULL REFERENCES temples(id),
    
    -- Pet Details
    pet_name VARCHAR(100) NOT NULL,
    pet_type VARCHAR(50) NOT NULL, -- Dog, Cat, Bird, Rabbit, etc.
    pet_breed VARCHAR(100),
    pet_weight_kg NUMERIC(5,2),
    pet_size pet_size NOT NULL DEFAULT 'MEDIUM',
    date_of_passing DATE NOT NULL,
    pet_photo_url TEXT,
    
    -- Selected Services
    service_type VARCHAR(100) NOT NULL DEFAULT 'FULL_CEREMONY', -- TURNKEY, CREMATION_ONLY, FULL_CEREMONY
    ceremony_date DATE NOT NULL,
    ceremony_time VARCHAR(20) NOT NULL DEFAULT '13:00',
    include_pickup BOOLEAN DEFAULT FALSE,
    pickup_address TEXT,
    include_ash_to_river BOOLEAN DEFAULT TRUE,
    praying_days INT DEFAULT 1, -- 0, 1, 3
    additional_notes TEXT,
    
    -- Pricing breakdown
    subtotal_amount NUMERIC(10,2) NOT NULL,
    pickup_fee NUMERIC(10,2) DEFAULT 0.00,
    total_amount NUMERIC(10,2) NOT NULL,
    
    status booking_status DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PAYMENTS TABLE (2C2P Integration)
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    invoice_no VARCHAR(100) UNIQUE NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'THB',
    channel payment_channel DEFAULT 'CC',
    payment_token TEXT,
    web_payment_url TEXT,
    gateway_ref_no VARCHAR(100),
    resp_code VARCHAR(20),
    resp_desc TEXT,
    status payment_status DEFAULT 'PENDING',
    paid_at TIMESTAMPTZ,
    raw_response JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. MEMORIALS TABLE ("Journey to the Stars")
CREATE TABLE IF NOT EXISTS memorials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    pet_name VARCHAR(100) NOT NULL,
    pet_type VARCHAR(50) NOT NULL,
    years_lived VARCHAR(50),
    tribute_message TEXT,
    photo_urls TEXT[] DEFAULT '{}',
    is_star_memorial BOOLEAN DEFAULT TRUE,
    star_x DOUBLE PRECISION, -- Coordinates on the cosmic galaxy canvas (0.0 to 100.0%)
    star_y DOUBLE PRECISION,
    star_color VARCHAR(20) DEFAULT '#FFD700',
    star_brightness NUMERIC(3,2) DEFAULT 1.0,
    likes_count INT DEFAULT 0,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ADVERTISEMENTS & SPONSORS
CREATE TABLE IF NOT EXISTS advertisements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    sponsor_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- Pet Insurance, Pet Care, Memorial Urns, Flowers
    banner_url TEXT NOT NULL,
    target_url TEXT,
    placement VARCHAR(50) DEFAULT 'HOME_BANNER', -- HOME_BANNER, TEMPLE_LIST, MEMORIAL_FOOTER
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    clicks INT DEFAULT 0,
    impressions INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. KNOWLEDGE BASE / CMS (How to prepare, what can be cremated)
CREATE TABLE IF NOT EXISTS app_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    title_th VARCHAR(255),
    slug VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL, -- FUNERAL_PREPARATION, CREMATION_GUIDE, GRIEF_SUPPORT
    summary TEXT,
    content_markdown TEXT NOT NULL,
    thumbnail_url TEXT,
    read_time_mins INT DEFAULT 3,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Realtime publication enable for payments & memorials
ALTER PUBLICATION supabase_realtime ADD TABLE payments;
ALTER PUBLICATION supabase_realtime ADD TABLE memorials;
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;

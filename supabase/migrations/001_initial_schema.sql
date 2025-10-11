-- Kesennuma Digital Experiences - Initial Schema Migration
-- Enable required extensions

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS extension for spatial data
CREATE EXTENSION IF NOT EXISTS postgis SCHEMA extensions;

-- Grant access to extensions schema
GRANT USAGE ON SCHEMA extensions TO postgres, anon, authenticated, service_role;

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Locations table (separate from stories)
-- Using PostGIS GEOGRAPHY type for accurate distance calculations
CREATE TABLE public.locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  description_en TEXT,
  -- PostGIS point (longitude, latitude order)
  point GEOGRAPHY(POINT, 4326) NOT NULL,
  -- Also store as separate columns for easy access
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  altitude DOUBLE PRECISION,
  address TEXT,
  address_en TEXT,
  location_type TEXT, -- 'landmark', 'memorial', 'business', 'cultural', etc.
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_latitude CHECK (latitude >= -90 AND latitude <= 90),
  CONSTRAINT valid_longitude CHECK (longitude >= -180 AND longitude <= 180)
);

-- Create spatial index on location point
CREATE INDEX idx_locations_point ON public.locations USING GIST(point);
CREATE INDEX idx_locations_type ON public.locations(location_type);

-- Tags table
CREATE TABLE public.tags (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  name_en TEXT,
  slug TEXT UNIQUE NOT NULL,
  color TEXT DEFAULT '#1D4ED8',
  icon TEXT,
  story_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stories table
CREATE TABLE public.stories (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  title_en TEXT,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  excerpt_en TEXT,
  cover_image_url TEXT,
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'published', 'archived')),
  featured BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Story indexes
CREATE INDEX idx_stories_author ON public.stories(author_id);
CREATE INDEX idx_stories_location ON public.stories(location_id);
CREATE INDEX idx_stories_status ON public.stories(status);
CREATE INDEX idx_stories_featured ON public.stories(featured) WHERE featured = TRUE;
CREATE INDEX idx_stories_published_at ON public.stories(published_at) WHERE published_at IS NOT NULL;

-- Story content blocks (polymorphic content system)
CREATE TABLE public.story_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id INTEGER REFERENCES public.stories(id) ON DELETE CASCADE,
  block_type TEXT NOT NULL CHECK (block_type IN ('text', 'image', 'video', 'gallery', 'quote', 'embed', 'model3d')),
  "order" INTEGER NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(story_id, "order")
);

CREATE INDEX idx_story_content_story ON public.story_content(story_id, "order");
CREATE INDEX idx_story_content_type ON public.story_content(block_type);

-- Story media
CREATE TABLE public.story_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id INTEGER REFERENCES public.stories(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video', 'audio', 'model3d', 'document')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  file_size INTEGER,
  mime_type TEXT,
  is_used BOOLEAN DEFAULT FALSE,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_story_media_story ON public.story_media(story_id);
CREATE INDEX idx_story_media_type ON public.story_media(media_type);
CREATE INDEX idx_story_media_used ON public.story_media(is_used);

-- Story tags (many-to-many)
CREATE TABLE public.story_tags (
  story_id INTEGER REFERENCES public.stories(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES public.tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (story_id, tag_id)
);

CREATE INDEX idx_story_tags_story ON public.story_tags(story_id);
CREATE INDEX idx_story_tags_tag ON public.story_tags(tag_id);

-- Camera keyframes for Cesium viewer
CREATE TABLE public.camera_keyframes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id INTEGER REFERENCES public.stories(id) ON DELETE CASCADE,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  altitude DOUBLE PRECISION DEFAULT 1000.0,
  heading DOUBLE PRECISION DEFAULT 0.0,
  pitch DOUBLE PRECISION DEFAULT -45.0,
  roll DOUBLE PRECISION DEFAULT 0.0,
  description TEXT,
  description_en TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_camera_latitude CHECK (latitude >= -90 AND latitude <= 90),
  CONSTRAINT valid_camera_longitude CHECK (longitude >= -180 AND longitude <= 180),
  CONSTRAINT valid_heading CHECK (heading >= 0 AND heading < 360),
  CONSTRAINT valid_pitch CHECK (pitch >= -90 AND pitch <= 90),
  CONSTRAINT valid_roll CHECK (roll >= -180 AND roll <= 180)
);

CREATE INDEX idx_camera_keyframes_story ON public.camera_keyframes(story_id);
CREATE INDEX idx_camera_keyframes_default ON public.camera_keyframes(story_id, is_default) WHERE is_default = TRUE;

-- Itineraries
CREATE TABLE public.itineraries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  description_en TEXT,
  cover_image_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  duration_minutes INTEGER,
  distance_km DOUBLE PRECISION,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_itineraries_featured ON public.itineraries(featured) WHERE featured = TRUE;
CREATE INDEX idx_itineraries_creator ON public.itineraries(created_by);

-- Itinerary stops
CREATE TABLE public.itinerary_stops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  itinerary_id UUID REFERENCES public.itineraries(id) ON DELETE CASCADE,
  story_id INTEGER REFERENCES public.stories(id) ON DELETE CASCADE,
  "order" INTEGER NOT NULL,
  keyframe_id UUID REFERENCES public.camera_keyframes(id) ON DELETE SET NULL,
  notes TEXT,
  notes_en TEXT,
  duration_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(itinerary_id, "order")
);

CREATE INDEX idx_itinerary_stops_itinerary ON public.itinerary_stops(itinerary_id, "order");
CREATE INDEX idx_itinerary_stops_story ON public.itinerary_stops(story_id);

-- ============================================================================
-- OPTIONAL: NFT/STAMP RALLY TABLES (Stretch goal)
-- ============================================================================

-- NFT Campaigns
CREATE TABLE public.nft_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  description_en TEXT,
  location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE,
  required_visits INTEGER DEFAULT 1,
  contract_address TEXT,
  token_metadata JSONB DEFAULT '{}'::jsonb,
  active BOOLEAN DEFAULT TRUE,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_nft_campaigns_location ON public.nft_campaigns(location_id);
CREATE INDEX idx_nft_campaigns_active ON public.nft_campaigns(active) WHERE active = TRUE;
CREATE INDEX idx_nft_campaigns_dates ON public.nft_campaigns(start_date, end_date);

-- Visits (proof of location)
CREATE TABLE public.visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,
  campaign_id UUID REFERENCES public.nft_campaigns(id) ON DELETE SET NULL,
  visit_timestamp TIMESTAMPTZ DEFAULT NOW(),
  verification_method TEXT, -- 'qr', 'geofence', 'manual'
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_visits_location ON public.visits(location_id);
CREATE INDEX idx_visits_wallet ON public.visits(wallet_address);
CREATE INDEX idx_visits_campaign ON public.visits(campaign_id);
CREATE INDEX idx_visits_timestamp ON public.visits(visit_timestamp);

-- NFT Stamps (minted SBTs)
CREATE TABLE public.nft_stamps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT NOT NULL,
  campaign_id UUID REFERENCES public.nft_campaigns(id) ON DELETE CASCADE,
  token_id TEXT,
  transaction_hash TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  minted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_nft_stamps_wallet ON public.nft_stamps(wallet_address);
CREATE INDEX idx_nft_stamps_campaign ON public.nft_stamps(campaign_id);
CREATE INDEX idx_nft_stamps_token ON public.nft_stamps(token_id);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON public.locations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stories_updated_at BEFORE UPDATE ON public.stories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_story_content_updated_at BEFORE UPDATE ON public.story_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_itineraries_updated_at BEFORE UPDATE ON public.itineraries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nft_campaigns_updated_at BEFORE UPDATE ON public.nft_campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TRIGGERS FOR MAINTAINING COUNTS
-- ============================================================================

-- Update tag story count
CREATE OR REPLACE FUNCTION update_tag_story_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.tags SET story_count = story_count + 1 WHERE id = NEW.tag_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.tags SET story_count = story_count - 1 WHERE id = OLD.tag_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tag_story_count_trigger
AFTER INSERT OR DELETE ON public.story_tags
FOR EACH ROW EXECUTE FUNCTION update_tag_story_count();

-- ============================================================================
-- HELPER FUNCTIONS FOR POSTGIS QUERIES
-- ============================================================================

-- Find locations within distance (meters)
CREATE OR REPLACE FUNCTION nearby_locations(
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  radius_meters INTEGER DEFAULT 5000,
  max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  distance_meters DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    l.id,
    l.name,
    l.latitude,
    l.longitude,
    ST_Distance(
      l.point,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
    ) as distance_meters
  FROM public.locations l
  WHERE ST_DWithin(
    l.point,
    ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
    radius_meters
  )
  ORDER BY distance_meters
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- Find locations within bounding box
CREATE OR REPLACE FUNCTION locations_in_bounds(
  bottom_left_lat DOUBLE PRECISION,
  bottom_left_lng DOUBLE PRECISION,
  top_right_lat DOUBLE PRECISION,
  top_right_lng DOUBLE PRECISION
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    l.id,
    l.name,
    l.latitude,
    l.longitude
  FROM public.locations l
  WHERE l.point && ST_SetSRID(
    ST_MakeBox2D(
      ST_Point(bottom_left_lng, bottom_left_lat),
      ST_Point(top_right_lng, top_right_lat)
    ),
    4326
  )::geography;
END;
$$ LANGUAGE plpgsql;

-- Get stories with location data (GeoJSON format ready)
CREATE OR REPLACE FUNCTION get_stories_geojson(
  status_filter TEXT DEFAULT 'published'
)
RETURNS TABLE (
  id INTEGER,
  title TEXT,
  slug TEXT,
  excerpt TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  location_name TEXT,
  cover_image_url TEXT,
  published_at TIMESTAMPTZ,
  tags JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id,
    s.title,
    s.slug,
    s.excerpt,
    l.latitude,
    l.longitude,
    l.name as location_name,
    s.cover_image_url,
    s.published_at,
    COALESCE(
      jsonb_agg(
        jsonb_build_object('id', t.id, 'name', t.name, 'color', t.color)
      ) FILTER (WHERE t.id IS NOT NULL),
      '[]'::jsonb
    ) as tags
  FROM public.stories s
  INNER JOIN public.locations l ON s.location_id = l.id
  LEFT JOIN public.story_tags st ON s.id = st.story_id
  LEFT JOIN public.tags t ON st.tag_id = t.id
  WHERE s.status = status_filter
  GROUP BY s.id, l.latitude, l.longitude, l.name;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SEED DEFAULT TAGS (Japanese-first)
-- ============================================================================

INSERT INTO public.tags (name, name_en, slug, color, icon) VALUES
  ('震災の記憶', 'Memorial', 'memorial', '#DC2626', '🕯️'),
  ('漁業', 'Fishing', 'fishing', '#0284C7', '🎣'),
  ('日常', 'Daily Life', 'daily-life', '#16A34A', '🏘️'),
  ('食', 'Food', 'food', '#D97706', '🍜'),
  ('イベント', 'Events', 'events', '#9333EA', '🎉'),
  ('自然', 'Nature', 'nature', '#059669', '🌲'),
  ('文化', 'Culture', 'culture', '#BE185D', '🎭'),
  ('観光', 'Tourism', 'tourism', '#7C3AED', '🗺️')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- SEED SAMPLE USER (for story authorship)
-- ============================================================================

INSERT INTO public.users (id, email, name, bio) VALUES
  ('00000000-0000-0000-0000-000000000001', 'community@kesennuma.jp', '気仙沼コミュニティ', 'Kesennuma community storyteller')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- SEED LOCATIONS (from existing viewpoints data)
-- ============================================================================

INSERT INTO public.locations (id, name, name_en, description, description_en, latitude, longitude, point, location_type, address) VALUES
  -- Port & Fishing
  (
    '10000000-0000-0000-0000-000000000001',
    '気仙沼港',
    'Kesennuma Port',
    '気仙沼の漁業の中心。マグロやカツオの水揚げで有名な港です。',
    'Main fishing port, heart of Kesennuma fishing industry',
    38.8626562,
    141.606009,
    ST_SetSRID(ST_MakePoint(141.606009, 38.8626562), 4326)::geography,
    'landmark',
    '宮城県気仙沼市港町'
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    '魚市場',
    'Fish Market',
    '気仙沼魚市場。日本有数の規模を誇る魚市場です。',
    'Kesennuma fish market, one of Japan''s largest',
    38.9047061,
    141.5786374,
    ST_SetSRID(ST_MakePoint(141.5786374, 38.9047061), 4326)::geography,
    'landmark',
    '宮城県気仙沼市魚市場前'
  ),

  -- Oshima Island
  (
    '10000000-0000-0000-0000-000000000003',
    '大島',
    'Oshima Island',
    '美しい島、大島。透き通った海と美しい海岸線が魅力です。',
    'Beautiful island connected by bridge, scenic views',
    38.878779,
    141.606243,
    ST_SetSRID(ST_MakePoint(141.606243, 38.878779), 4326)::geography,
    'landmark',
    '宮城県気仙沼市大島'
  ),
  (
    '10000000-0000-0000-0000-000000000004',
    '大島大橋',
    'Oshima Bridge',
    '2019年に開通した大島大橋。本土と大島を結ぶ重要な橋です。',
    'Bridge connecting mainland to Oshima Island',
    38.878779,
    141.606243,
    ST_SetSRID(ST_MakePoint(141.606243, 38.878779), 4326)::geography,
    'landmark',
    '宮城県気仙沼市〜大島'
  ),

  -- Memorial Sites
  (
    '10000000-0000-0000-0000-000000000005',
    '震災メモリアル',
    'Tsunami Memorial',
    '2011年東日本大震災の記憶を伝える場所。',
    '2011 tsunami memorial and recovery monuments',
    38.900,
    141.570,
    ST_SetSRID(ST_MakePoint(141.570, 38.900), 4326)::geography,
    'memorial',
    '宮城県気仙沼市'
  ),
  (
    '10000000-0000-0000-0000-000000000006',
    '市街地',
    'Downtown',
    '気仙沼の中心市街地。復興の歩みを続けています。',
    'Central commercial district and shopping area',
    38.907,
    141.568,
    ST_SetSRID(ST_MakePoint(141.568, 38.907), 4326)::geography,
    'cultural',
    '宮城県気仙沼市南町'
  ),

  -- Food & Culture
  (
    '10000000-0000-0000-0000-000000000007',
    '気仙沼のフカヒレ生産地',
    'Shark Fin Production Area',
    '気仙沼は日本最大のフカヒレ産地です。',
    'Japan''s largest shark fin production area',
    38.906,
    141.565,
    ST_SetSRID(ST_MakePoint(141.565, 38.906), 4326)::geography,
    'business',
    '宮城県気仙沼市'
  ),
  (
    '10000000-0000-0000-0000-000000000008',
    'みなとまつり会場',
    'Port Festival Grounds',
    '毎年開催される気仙沼みなとまつりの会場。',
    'Annual Kesennuma Port Festival venue',
    38.908,
    141.566,
    ST_SetSRID(ST_MakePoint(141.566, 38.908), 4326)::geography,
    'cultural',
    '宮城県気仙沼市'
  ),

  -- Bay Area
  (
    '10000000-0000-0000-0000-000000000009',
    '気仙沼湾（北側）',
    'Kesennuma Bay (North)',
    '北側湾岸エリア。美しい夕暮れが見られます。',
    'Northern bay area with fishing communities',
    38.915,
    141.570,
    ST_SetSRID(ST_MakePoint(141.570, 38.915), 4326)::geography,
    'landmark',
    '宮城県気仙沼市'
  ),
  (
    '10000000-0000-0000-0000-000000000010',
    '北側漁師町',
    'Northern Fishing Village',
    '昔ながらの漁師町の風景が残る地域。',
    'Traditional fishing village area',
    38.918,
    141.572,
    ST_SetSRID(ST_MakePoint(141.572, 38.918), 4326)::geography,
    'cultural',
    '宮城県気仙沼市'
  ),

  -- Attractions
  (
    '10000000-0000-0000-0000-000000000011',
    'シャークミュージアム',
    'Shark Museum',
    '気仙沼海の市にある日本唯一のサメ専門博物館。',
    'Kesennuma Umi no Ichi Shark Museum, Japan''s only shark museum',
    38.90009720623811,
    141.57946292489987,
    ST_SetSRID(ST_MakePoint(141.57946292489987, 38.90009720623811), 4326)::geography,
    'cultural',
    '宮城県気仙沼市魚市場前7-13'
  ),
  (
    '10000000-0000-0000-0000-000000000012',
    '気仙沼駅',
    'Kesennuma Station',
    'JR気仙沼駅。市の玄関口です。',
    'JR East Kesennuma Station, gateway to the city',
    38.90995,
    141.55931,
    ST_SetSRID(ST_MakePoint(141.55931, 38.90995), 4326)::geography,
    'landmark',
    '宮城県気仙沼市古町'
  ),
  (
    '10000000-0000-0000-0000-000000000013',
    'Pier7（創/ウマレル）',
    'Pier 7 (UMARERU)',
    '内湾に建つまち・ひと・しごと交流プラザ。復興のシンボルです。',
    'Waterfront community plaza, symbol of recovery and renewal',
    38.90522595237508,
    141.575339182962,
    ST_SetSRID(ST_MakePoint(141.575339182962, 38.90522595237508), 4326)::geography,
    'cultural',
    '宮城県気仙沼市南町海岸1-1'
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- SEED STORIES (from existing seed data)
-- ============================================================================

INSERT INTO public.stories (title, title_en, slug, excerpt, excerpt_en, location_id, author_id, status, published_at) VALUES
  -- Port & Fishing
  (
    '気仙沼港の朝',
    'Morning at Kesennuma Port',
    'kesennuma-port-morning',
    '早朝の気仙沼港。漁師たちが水揚げを始める活気ある風景。マグロやカツオの水揚げで有名な港です。',
    'Early morning at Kesennuma Port, where fishermen begin their catch unloading. Famous for tuna and bonito.',
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'published',
    NOW() - INTERVAL '30 days'
  ),
  (
    '魚市場の賑わい',
    'Bustling Fish Market',
    'fish-market-bustle',
    '気仙沼魚市場の競りの様子。新鮮な魚介類が並び、活気に満ちています。',
    'Auction scenes at Kesennuma Fish Market, full of fresh seafood and vibrant energy.',
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'published',
    NOW() - INTERVAL '25 days'
  ),

  -- Oshima Island
  (
    '大島の美しい海岸',
    'Beautiful Oshima Coast',
    'oshima-beautiful-coast',
    '大島の緑の真珠エリア。透き通った海と美しい海岸線が魅力です。',
    'The Green Pearl area of Oshima. Crystal clear waters and beautiful coastline.',
    '10000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'published',
    NOW() - INTERVAL '20 days'
  ),
  (
    '大島大橋',
    'Oshima Bridge',
    'oshima-bridge',
    '2019年に開通した大島大橋。本土と大島を結ぶ重要な橋で、復興のシンボルです。',
    'Oshima Bridge opened in 2019, connecting mainland to Oshima Island - a symbol of recovery.',
    '10000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    'published',
    NOW() - INTERVAL '15 days'
  ),

  -- Memorial Sites
  (
    '東日本大震災の記憶',
    'Memories of the Great East Japan Earthquake',
    'tsunami-memorial',
    '2011年3月11日、この地域を襲った津波の記憶。多くの命が失われましたが、復興の歩みは続いています。',
    'Memories of the tsunami that struck on March 11, 2011. Many lives were lost, but recovery continues.',
    '10000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000001',
    'published',
    NOW() - INTERVAL '10 days'
  ),
  (
    '復興への歩み',
    'Path to Recovery',
    'path-to-recovery',
    '震災から14年。気仙沼は着実に復興を遂げています。新しい街並みと共に、記憶を語り継いでいます。',
    '14 years since the disaster. Kesennuma is steadily recovering, passing on memories alongside new streetscapes.',
    '10000000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000001',
    'published',
    NOW() - INTERVAL '8 days'
  ),

  -- Food & Culture
  (
    '気仙沼のフカヒレ',
    'Kesennuma Shark Fin',
    'kesennuma-shark-fin',
    '気仙沼は日本最大のフカヒレ産地。高級食材として知られるフカヒレは、この地の名産品です。',
    'Kesennuma is Japan''s largest shark fin producer. This luxury ingredient is a local specialty.',
    '10000000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000001',
    'published',
    NOW() - INTERVAL '12 days'
  ),
  (
    'みなとまつり',
    'Port Festival',
    'port-festival',
    '毎年開催される気仙沼みなとまつり。港町の伝統と文化を感じられるイベントです。',
    'Annual Kesennuma Port Festival. Experience the traditions and culture of this port town.',
    '10000000-0000-0000-0000-000000000008',
    '00000000-0000-0000-0000-000000000001',
    'published',
    NOW() - INTERVAL '5 days'
  ),

  -- Bay Area
  (
    '気仙沼湾の夕暮れ',
    'Sunset at Kesennuma Bay',
    'kesennuma-bay-sunset',
    '湾に沈む夕日の美しさは格別。漁船が並ぶシルエットが印象的です。',
    'The beauty of sunset over the bay is exceptional. Silhouettes of fishing boats create a memorable scene.',
    '10000000-0000-0000-0000-000000000009',
    '00000000-0000-0000-0000-000000000001',
    'published',
    NOW() - INTERVAL '18 days'
  ),
  (
    '漁師町の日常',
    'Daily Life in the Fishing Village',
    'fishing-village-daily-life',
    '北側湾岸の漁師町。昔ながらの生活が今も息づいています。',
    'Fishing village on the northern bay. Traditional lifestyles still thrive here.',
    '10000000-0000-0000-0000-000000000010',
    '00000000-0000-0000-0000-000000000001',
    'published',
    NOW() - INTERVAL '22 days'
  ),

  -- Attractions
  (
    'シャークミュージアム',
    'Shark Museum',
    'shark-museum',
    '気仙沼海の市にある日本唯一のサメ専門博物館。サメの生態や歴史、気仙沼のサメ漁について学べます。',
    'Japan''s only shark-specialized museum at Umi no Ichi. Learn about shark ecology, history, and Kesennuma''s shark fishing.',
    '10000000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000001',
    'published',
    NOW() - INTERVAL '7 days'
  ),
  (
    '気仙沼駅前',
    'Kesennuma Station Area',
    'kesennuma-station',
    'JR気仙沼駅。市の玄関口として、多くの観光客を迎えています。',
    'JR Kesennuma Station, gateway to the city welcoming many tourists.',
    '10000000-0000-0000-0000-000000000012',
    '00000000-0000-0000-0000-000000000001',
    'published',
    NOW() - INTERVAL '14 days'
  ),
  (
    'Pier7（創/ウマレル）',
    'Pier 7 (UMARERU)',
    'pier7-umareru',
    '内湾に建つまち・ひと・しごと交流プラザ。復興のシンボルとして、カフェ、レストラン、コミュニティスペースが集まるモダンな施設です。ここから気仙沼湾の観光クルーズも出発します。',
    'Community plaza on the inner bay. A symbol of recovery with cafes, restaurants, and community spaces. Sightseeing cruises depart from here.',
    '10000000-0000-0000-0000-000000000013',
    '00000000-0000-0000-0000-000000000001',
    'published',
    NOW() - INTERVAL '3 days'
  );

-- ============================================================================
-- SEED STORY TAGS (map stories to tags)
-- ============================================================================

-- Get tag IDs (they're sequential starting from 1)
-- 1: 震災の記憶 (memorial), 2: 漁業 (fishing), 3: 日常 (daily-life), 4: 食 (food)
-- 5: イベント (events), 6: 自然 (nature), 7: 文化 (culture), 8: 観光 (tourism)

INSERT INTO public.story_tags (story_id, tag_id)
SELECT s.id, t.id FROM public.stories s, public.tags t WHERE s.slug = 'kesennuma-port-morning' AND t.slug IN ('fishing', 'daily-life')
UNION ALL
SELECT s.id, t.id FROM public.stories s, public.tags t WHERE s.slug = 'fish-market-bustle' AND t.slug IN ('fishing', 'food')
UNION ALL
SELECT s.id, t.id FROM public.stories s, public.tags t WHERE s.slug = 'oshima-beautiful-coast' AND t.slug IN ('nature', 'daily-life')
UNION ALL
SELECT s.id, t.id FROM public.stories s, public.tags t WHERE s.slug = 'oshima-bridge' AND t.slug IN ('memorial', 'culture')
UNION ALL
SELECT s.id, t.id FROM public.stories s, public.tags t WHERE s.slug = 'tsunami-memorial' AND t.slug = 'memorial'
UNION ALL
SELECT s.id, t.id FROM public.stories s, public.tags t WHERE s.slug = 'path-to-recovery' AND t.slug IN ('memorial', 'daily-life')
UNION ALL
SELECT s.id, t.id FROM public.stories s, public.tags t WHERE s.slug = 'kesennuma-shark-fin' AND t.slug IN ('food', 'fishing')
UNION ALL
SELECT s.id, t.id FROM public.stories s, public.tags t WHERE s.slug = 'port-festival' AND t.slug IN ('events', 'culture')
UNION ALL
SELECT s.id, t.id FROM public.stories s, public.tags t WHERE s.slug = 'kesennuma-bay-sunset' AND t.slug IN ('nature', 'daily-life')
UNION ALL
SELECT s.id, t.id FROM public.stories s, public.tags t WHERE s.slug = 'fishing-village-daily-life' AND t.slug IN ('fishing', 'daily-life', 'culture')
UNION ALL
SELECT s.id, t.id FROM public.stories s, public.tags t WHERE s.slug = 'shark-museum' AND t.slug IN ('culture', 'food', 'fishing')
UNION ALL
SELECT s.id, t.id FROM public.stories s, public.tags t WHERE s.slug = 'kesennuma-station' AND t.slug = 'daily-life'
UNION ALL
SELECT s.id, t.id FROM public.stories s, public.tags t WHERE s.slug = 'pier7-umareru' AND t.slug IN ('memorial', 'culture', 'daily-life');

-- ============================================================================
-- SEED CAMERA KEYFRAMES (from viewpoints data)
-- ============================================================================

INSERT INTO public.camera_keyframes (story_id, latitude, longitude, altitude, heading, pitch, roll, is_default, description, description_en)
SELECT s.id, 38.8626562, 141.606009, 500.0, 0.0, -60.0, 0.0, true, '気仙沼港全体を見渡せる視点', 'View of entire Kesennuma Port'
FROM public.stories s WHERE s.slug = 'kesennuma-port-morning'
UNION ALL
SELECT s.id, 38.9047061, 141.5786374, 400.0, 45.0, -55.0, 0.0, true, '魚市場の活気ある競りの様子', 'Lively auction scene at fish market'
FROM public.stories s WHERE s.slug = 'fish-market-bustle'
UNION ALL
SELECT s.id, 38.878779, 141.606243, 1000.0, 0.0, -60.0, 0.0, true, '大島の美しい海岸線', 'Beautiful Oshima coastline'
FROM public.stories s WHERE s.slug = 'oshima-beautiful-coast'
UNION ALL
SELECT s.id, 38.878779, 141.606243, 600.0, 90.0, -50.0, 0.0, true, '本土と大島を結ぶ橋', 'Bridge connecting mainland and Oshima'
FROM public.stories s WHERE s.slug = 'oshima-bridge'
UNION ALL
SELECT s.id, 38.900, 141.570, 300.0, 0.0, -45.0, 0.0, true, '震災メモリアルエリア', 'Tsunami memorial area'
FROM public.stories s WHERE s.slug = 'tsunami-memorial'
UNION ALL
SELECT s.id, 38.907, 141.568, 800.0, 0.0, -65.0, 0.0, true, '復興した市街地', 'Recovered downtown area'
FROM public.stories s WHERE s.slug = 'path-to-recovery'
UNION ALL
SELECT s.id, 38.915, 141.570, 2000.0, 180.0, -70.0, 0.0, true, '気仙沼湾北側の夕暮れ', 'Northern bay sunset view'
FROM public.stories s WHERE s.slug = 'kesennuma-bay-sunset'
UNION ALL
SELECT s.id, 38.90009720623811, 141.57946292489987, 350.0, 0.0, -55.0, 0.0, true, 'シャークミュージアム外観', 'Shark Museum exterior'
FROM public.stories s WHERE s.slug = 'shark-museum'
UNION ALL
SELECT s.id, 38.90995, 141.55931, 400.0, 0.0, -60.0, 0.0, true, '気仙沼駅前の様子', 'Kesennuma Station area'
FROM public.stories s WHERE s.slug = 'kesennuma-station'
UNION ALL
SELECT s.id, 38.90522595237508, 141.575339182962, 350.0, 180.0, -55.0, 0.0, true, 'Pier7の水辺の施設', 'Pier 7 waterfront facility'
FROM public.stories s WHERE s.slug = 'pier7-umareru';

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) - BASIC SETUP
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.camera_keyframes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_stops ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can view published stories"
  ON public.stories FOR SELECT
  USING (status = 'published');

CREATE POLICY "Public can view story content"
  ON public.story_content FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.stories
    WHERE stories.id = story_content.story_id
    AND stories.status = 'published'
  ));

CREATE POLICY "Public can view locations"
  ON public.locations FOR SELECT
  USING (true);

CREATE POLICY "Public can view tags"
  ON public.tags FOR SELECT
  USING (true);

CREATE POLICY "Public can view story tags"
  ON public.story_tags FOR SELECT
  USING (true);

CREATE POLICY "Public can view published itineraries"
  ON public.itineraries FOR SELECT
  USING (true);

CREATE POLICY "Public can view itinerary stops"
  ON public.itinerary_stops FOR SELECT
  USING (true);

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE public.locations IS 'Physical locations in Kesennuma with PostGIS spatial data';
COMMENT ON TABLE public.stories IS 'User-contributed stories and experiences tied to locations';
COMMENT ON TABLE public.story_content IS 'Polymorphic content blocks for rich story composition';
COMMENT ON TABLE public.tags IS 'Thematic categories for filtering and organizing stories';
COMMENT ON TABLE public.camera_keyframes IS 'Cesium camera positions for cinematic story viewing';
COMMENT ON TABLE public.itineraries IS 'Curated routes connecting multiple stories/locations';
COMMENT ON TABLE public.nft_campaigns IS 'Stamp rally campaigns with NFT/SBT rewards';

COMMENT ON COLUMN public.locations.point IS 'PostGIS GEOGRAPHY point (lng, lat order) for accurate distance calculations';
COMMENT ON COLUMN public.story_content.data IS 'JSON data specific to block_type (e.g., {"content": "text"} for text blocks)';
COMMENT ON COLUMN public.stories.status IS 'draft -> pending -> approved -> published workflow';

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- ============================================================================
-- COMPLETION
-- ============================================================================

-- Verify PostGIS installation
SELECT PostGIS_Version();

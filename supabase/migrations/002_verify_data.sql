-- ============================================================================
-- VERIFICATION SCRIPT
-- Run this after 001_initial_schema.sql to verify everything was created
-- ============================================================================

-- Check PostGIS is installed
SELECT PostGIS_Version() as postgis_version;

-- ============================================================================
-- TABLE COUNTS
-- ============================================================================

SELECT
  'users' as table_name,
  COUNT(*) as count,
  '1 expected' as expected
FROM users
UNION ALL
SELECT
  'locations',
  COUNT(*),
  '13 expected'
FROM locations
UNION ALL
SELECT
  'stories',
  COUNT(*),
  '13 expected'
FROM stories
UNION ALL
SELECT
  'tags',
  COUNT(*),
  '8 expected'
FROM tags
UNION ALL
SELECT
  'story_tags',
  COUNT(*),
  '~30 expected (multiple tags per story)'
FROM story_tags
UNION ALL
SELECT
  'camera_keyframes',
  COUNT(*),
  '10 expected'
FROM camera_keyframes
ORDER BY table_name;

-- ============================================================================
-- VERIFY POSTGIS SPATIAL DATA
-- ============================================================================

-- Check all locations have valid PostGIS points
SELECT
  'Valid PostGIS Points' as check_name,
  COUNT(*) as count,
  '13 expected' as expected
FROM locations
WHERE point IS NOT NULL
  AND ST_IsValid(point::geometry);

-- Check latitude/longitude ranges
SELECT
  'Valid Coordinates' as check_name,
  COUNT(*) as count,
  '13 expected' as expected
FROM locations
WHERE latitude BETWEEN -90 AND 90
  AND longitude BETWEEN -180 AND 180;

-- ============================================================================
-- VERIFY RELATIONSHIPS
-- ============================================================================

-- Check all stories have locations
SELECT
  'Stories with Locations' as check_name,
  COUNT(*) as count,
  '13 expected' as expected
FROM stories
WHERE location_id IS NOT NULL;

-- Check all stories have authors
SELECT
  'Stories with Authors' as check_name,
  COUNT(*) as count,
  '13 expected' as expected
FROM stories
WHERE author_id IS NOT NULL;

-- Check all camera keyframes link to stories
SELECT
  'Valid Camera Keyframes' as check_name,
  COUNT(*) as count,
  '10 expected' as expected
FROM camera_keyframes
WHERE story_id IN (SELECT id FROM stories);

-- ============================================================================
-- TEST SPATIAL QUERIES
-- ============================================================================

-- Test 1: Find locations near Kesennuma Port (38.8626562, 141.606009)
SELECT
  '1. Nearby Locations (5km)' as test_name,
  COUNT(*) as results_count,
  '~8-10 expected' as expected
FROM locations
WHERE ST_DWithin(
  point,
  ST_SetSRID(ST_MakePoint(141.606009, 38.8626562), 4326)::geography,
  5000  -- 5km radius
);

-- Test 2: Distance calculation between two specific locations
SELECT
  '2. Distance: Port to Station' as test_name,
  ROUND(
    ST_Distance(
      (SELECT point FROM locations WHERE name = '気仙沼港'),
      (SELECT point FROM locations WHERE name = '気仙沼駅')
    )::numeric,
    0
  ) as distance_meters,
  '~4000m expected' as expected;

-- Test 3: Bounding box query (Kesennuma area)
SELECT
  '3. Locations in Bounds' as test_name,
  COUNT(*) as results_count,
  '13 expected (all)' as expected
FROM locations
WHERE point && ST_SetSRID(
  ST_MakeBox2D(
    ST_Point(141.50, 38.85),  -- SW corner
    ST_Point(141.65, 38.95)   -- NE corner
  ),
  4326
)::geography;

-- ============================================================================
-- TEST HELPER FUNCTIONS
-- ============================================================================

-- Test nearby_locations() function
SELECT
  'nearby_locations() function' as test_name,
  COUNT(*) as results_count,
  '~8-10 expected' as expected
FROM nearby_locations(38.8626562, 141.606009, 5000, 20);

-- Test locations_in_bounds() function
SELECT
  'locations_in_bounds() function' as test_name,
  COUNT(*) as results_count,
  '13 expected (all)' as expected
FROM locations_in_bounds(38.85, 141.50, 38.95, 141.65);

-- Test get_stories_geojson() function
SELECT
  'get_stories_geojson() function' as test_name,
  COUNT(*) as results_count,
  '13 expected' as expected
FROM get_stories_geojson('published');

-- ============================================================================
-- VERIFY DATA QUALITY
-- ============================================================================

-- Check for duplicate story slugs (should be 0)
SELECT
  'Duplicate Slugs' as check_name,
  COUNT(*) as count,
  '0 expected' as expected
FROM (
  SELECT slug, COUNT(*)
  FROM stories
  GROUP BY slug
  HAVING COUNT(*) > 1
) duplicates;

-- Check for orphaned story_tags (should be 0)
SELECT
  'Orphaned Story Tags' as check_name,
  COUNT(*) as count,
  '0 expected' as expected
FROM story_tags st
WHERE NOT EXISTS (SELECT 1 FROM stories WHERE id = st.story_id)
   OR NOT EXISTS (SELECT 1 FROM tags WHERE id = st.tag_id);

-- Check for stories without tags (should be 0 in seed data)
SELECT
  'Stories Without Tags' as check_name,
  COUNT(*) as count,
  '0 expected' as expected
FROM stories s
WHERE NOT EXISTS (
  SELECT 1 FROM story_tags WHERE story_id = s.id
);

-- ============================================================================
-- SAMPLE DATA INSPECTION
-- ============================================================================

-- List all locations with coordinates
SELECT
  name,
  name_en,
  location_type,
  ROUND(latitude::numeric, 4) as lat,
  ROUND(longitude::numeric, 4) as lng
FROM locations
ORDER BY name;

-- List all stories with their locations
SELECT
  s.title,
  s.title_en,
  l.name as location_name,
  s.status,
  s.published_at::date as published_date
FROM stories s
INNER JOIN locations l ON s.location_id = l.id
ORDER BY s.published_at DESC;

-- List all tags with story counts
SELECT
  name,
  name_en,
  story_count,
  color,
  icon
FROM tags
ORDER BY story_count DESC;

-- ============================================================================
-- PERFORMANCE CHECK
-- ============================================================================

-- Explain plan for spatial query (should use GIST index)
EXPLAIN ANALYZE
SELECT name, latitude, longitude
FROM locations
WHERE ST_DWithin(
  point,
  ST_SetSRID(ST_MakePoint(141.566, 38.908), 4326)::geography,
  5000
);

-- ============================================================================
-- RLS VERIFICATION
-- ============================================================================

-- Check RLS is enabled
SELECT
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('users', 'locations', 'stories', 'tags', 'camera_keyframes')
ORDER BY tablename;

-- Check policies exist
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd as operation
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

SELECT
  '✅ VERIFICATION COMPLETE' as status,
  'Check results above for any unexpected counts' as note;

SELECT
  '📊 Summary' as section,
  (SELECT COUNT(*) FROM locations) as locations,
  (SELECT COUNT(*) FROM stories) as stories,
  (SELECT COUNT(*) FROM tags) as tags,
  (SELECT COUNT(*) FROM story_tags) as story_tags,
  (SELECT COUNT(*) FROM camera_keyframes) as keyframes;

-- Quick health check (all should return true)
SELECT
  PostGIS_Version() IS NOT NULL as postgis_installed,
  (SELECT COUNT(*) FROM locations) = 13 as locations_ok,
  (SELECT COUNT(*) FROM stories) = 13 as stories_ok,
  (SELECT COUNT(*) FROM tags) = 8 as tags_ok,
  (SELECT COUNT(*) FROM camera_keyframes) = 10 as keyframes_ok;

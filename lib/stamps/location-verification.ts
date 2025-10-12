/**
 * GPS Location Verification for Stamp Collection
 * Ensures users are physically present at the location
 */

/**
 * Calculate distance between two GPS coordinates using Haversine formula
 * @param lat1 Latitude of point 1
 * @param lon1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lon2 Longitude of point 2
 * @returns Distance in meters
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

/**
 * Location verification configuration
 */
export const LOCATION_VERIFICATION = {
  // Maximum allowed distance from location (meters)
  MAX_DISTANCE_METERS: 100,

  // Whether to enforce location verification
  // Set to false for testing, true for production
  ENABLED: process.env.NEXT_PUBLIC_ENABLE_LOCATION_VERIFICATION === 'true',

  // GPS accuracy threshold (meters)
  // If user's GPS accuracy is worse than this, show warning but allow
  MIN_ACCURACY_METERS: 50,
} as const;

/**
 * Verify if user is at the correct location
 */
export interface LocationVerificationResult {
  verified: boolean;
  distance?: number;
  error?: string;
  warning?: string;
}

export function verifyLocation(
  userLat: number | undefined,
  userLon: number | undefined,
  locationLat: number,
  locationLon: number,
  accuracy?: number
): LocationVerificationResult {
  // If verification is disabled, allow all
  if (!LOCATION_VERIFICATION.ENABLED) {
    return {
      verified: true,
      warning: 'Location verification is disabled (test mode)',
    };
  }

  // Check if user provided GPS coordinates
  if (userLat === undefined || userLon === undefined) {
    return {
      verified: false,
      error: 'GPS location is required. Please enable location services and try again.',
    };
  }

  // Validate coordinates are reasonable
  if (
    Math.abs(userLat) > 90 ||
    Math.abs(userLon) > 180 ||
    Math.abs(locationLat) > 90 ||
    Math.abs(locationLon) > 180
  ) {
    return {
      verified: false,
      error: 'Invalid GPS coordinates',
    };
  }

  // Calculate distance
  const distance = calculateDistance(userLat, userLon, locationLat, locationLon);

  // Check if within allowed radius
  if (distance > LOCATION_VERIFICATION.MAX_DISTANCE_METERS) {
    return {
      verified: false,
      distance: Math.round(distance),
      error: `You are too far from this location. You need to be within ${LOCATION_VERIFICATION.MAX_DISTANCE_METERS}m (you are ${Math.round(distance)}m away).`,
    };
  }

  // Check GPS accuracy if provided
  let warning: string | undefined;
  if (accuracy && accuracy > LOCATION_VERIFICATION.MIN_ACCURACY_METERS) {
    warning = `Your GPS accuracy is low (±${Math.round(accuracy)}m). For best results, try again in an open area.`;
  }

  return {
    verified: true,
    distance: Math.round(distance),
    warning,
  };
}

/**
 * Format distance for display
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

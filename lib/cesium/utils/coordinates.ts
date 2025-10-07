/**
 * Coordinate conversion utilities for Cesium
 * Handles lat/lng <-> Cartesian3 conversions, validations, etc.
 */

import type { CesiumModule } from '../types';

/**
 * Validate latitude (must be -90 to 90)
 */
export function isValidLatitude(lat: number): boolean {
  return lat >= -90 && lat <= 90;
}

/**
 * Validate longitude (must be -180 to 180)
 */
export function isValidLongitude(lng: number): boolean {
  return lng >= -180 && lng <= 180;
}

/**
 * Validate coordinate pair
 */
export function isValidCoordinate(lat: number, lng: number): boolean {
  return isValidLatitude(lat) && isValidLongitude(lng);
}

/**
 * Swap lat/lng if they appear reversed (common mistake)
 * Heuristic: if abs(first) > 90, likely they meant [lng, lat]
 */
export function maybeSwapLatLng(coord1: number, coord2: number): { lat: number; lng: number } {
  if (Math.abs(coord1) > 90 && Math.abs(coord2) <= 90) {
    // Likely [lng, lat] order - swap it
    return { lat: coord2, lng: coord1 };
  }
  // Assume [lat, lng]
  return { lat: coord1, lng: coord2 };
}

/**
 * Convert degrees to radians
 */
export function degreesToRadians(degrees: number, Cesium: CesiumModule): number {
  return Cesium.Math.toRadians(degrees);
}

/**
 * Convert radians to degrees
 */
export function radiansToDegrees(radians: number, Cesium: CesiumModule): number {
  return Cesium.Math.toDegrees(radians);
}

/**
 * Create Cartesian3 from lat/lng/height
 */
export function createCartesian3(
  lng: number,
  lat: number,
  height: number = 0,
  Cesium: CesiumModule
) {
  return Cesium.Cartesian3.fromDegrees(lng, lat, height);
}

/**
 * Create array of Cartesian3 positions from [lng, lat] pairs
 */
export function createCartesian3Array(
  coordinates: [number, number][],
  Cesium: CesiumModule
): any[] {
  const flatArray: number[] = [];
  coordinates.forEach(([lng, lat]) => {
    flatArray.push(lng, lat);
  });
  return Cesium.Cartesian3.fromDegreesArray(flatArray);
}

/**
 * Extract lat/lng from Cartesian3
 */
export function cartesian3ToLatLng(
  cartesian: any,
  Cesium: CesiumModule
): { latitude: number; longitude: number; height: number } {
  const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
  return {
    latitude: Cesium.Math.toDegrees(cartographic.latitude),
    longitude: Cesium.Math.toDegrees(cartographic.longitude),
    height: cartographic.height,
  };
}

/**
 * Get current camera position as lat/lng/height
 */
export function getCameraPosition(viewer: any, Cesium: CesiumModule) {
  const cameraPos = viewer.camera.positionCartographic;
  return {
    latitude: Cesium.Math.toDegrees(cameraPos.latitude),
    longitude: Cesium.Math.toDegrees(cameraPos.longitude),
    height: cameraPos.height,
    heading: Cesium.Math.toDegrees(viewer.camera.heading),
    pitch: Cesium.Math.toDegrees(viewer.camera.pitch),
    roll: Cesium.Math.toDegrees(viewer.camera.roll),
  };
}

/**
 * Calculate distance between two lat/lng points (Haversine formula)
 * Returns distance in meters
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

/**
 * Format coordinate for display (Japanese style)
 */
export function formatCoordinate(lat: number, lng: number, decimals: number = 6): string {
  return `北緯 ${lat.toFixed(decimals)}°, 東経 ${lng.toFixed(decimals)}°`;
}

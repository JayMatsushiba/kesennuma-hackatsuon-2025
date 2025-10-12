/**
 * QR Code Generator for Stamp Rally
 * Generates QR codes that link to stamp collection pages
 */

import QRCode from 'qrcode';

export interface StampQROptions {
  locationId: string;
  secret: string;
  baseUrl: string;
}

/**
 * Generate QR code as data URL
 */
export async function generateStampQR(options: StampQROptions): Promise<string> {
  const { locationId, secret, baseUrl } = options;

  // Create scan URL with parameters
  const scanUrl = `${baseUrl}/stamps/scan?l=${locationId}&s=${secret}`;

  try {
    // Generate QR code as data URL
    const qrDataUrl = await QRCode.toDataURL(scanUrl, {
      width: 800,
      margin: 2,
      color: {
        dark: '#1E40AF', // Brand blue color
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H', // High error correction
    });

    return qrDataUrl;
  } catch (error) {
    console.error('QR generation failed:', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Generate QR code as buffer (for saving to file)
 */
export async function generateStampQRBuffer(options: StampQROptions): Promise<Buffer> {
  const { locationId, secret, baseUrl } = options;
  const scanUrl = `${baseUrl}/stamps/scan?l=${locationId}&s=${secret}`;

  try {
    const qrBuffer = await QRCode.toBuffer(scanUrl, {
      width: 800,
      margin: 2,
      color: {
        dark: '#1E40AF',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H',
    });

    return qrBuffer;
  } catch (error) {
    console.error('QR generation failed:', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Generate cryptographically secure random secret
 */
export function generateSecret(): string {
  // Generate 16 random bytes and convert to hex
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Validate QR secret format
 */
export function isValidSecret(secret: string): boolean {
  // Should be 32 characters hex string
  return /^[a-f0-9]{32}$/i.test(secret);
}

/**
 * Parse scan URL parameters
 */
export function parseScanUrl(url: string): { locationId: string | null; secret: string | null } {
  try {
    const urlObj = new URL(url);
    return {
      locationId: urlObj.searchParams.get('l'),
      secret: urlObj.searchParams.get('s'),
    };
  } catch {
    return { locationId: null, secret: null };
  }
}

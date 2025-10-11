/**
 * Image processing utilities for Cesium billboards
 * Applies Japanese design principles: Ma (spacing), Kanso (simplicity), Shibui (subtle sophistication)
 */

/**
 * Process an image URL into a styled canvas with Japanese aesthetic
 * - Rounded corners (subtle, not excessive)
 * - Soft shadow (Shibui - subtle sophistication)
 * - Thin border for definition (Ma - breathing space)
 * - Maintains aspect ratio
 *
 * @param imageUrl - URL of the image to process
 * @param size - Target size in pixels (default: 80)
 * @returns Promise<HTMLCanvasElement> - Processed canvas element
 */
export async function createStyledBillboardImage(
  imageUrl: string,
  size: number = 80
): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Handle CORS

    img.onload = () => {
      // Create canvas with extra space for shadow
      const shadowBlur = 8;
      const shadowOffset = 4;
      const canvasSize = size + shadowBlur * 2 + shadowOffset;
      const canvas = document.createElement('canvas');
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Calculate position to center the image
      const offset = shadowBlur + shadowOffset / 2;

      // Japanese design: Kanso (simplicity) - clean background
      ctx.clearRect(0, 0, canvasSize, canvasSize);

      // Japanese design: Shibui (subtle sophistication) - soft shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
      ctx.shadowBlur = shadowBlur;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      // Create rounded rectangle path
      const radius = 8; // Subtle corner radius (not too round - wabi-sabi)
      const x = offset;
      const y = offset;
      const width = size;
      const height = size;

      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();

      // Clip to rounded rectangle
      ctx.save();
      ctx.clip();

      // Draw image
      ctx.drawImage(img, x, y, width, height);
      ctx.restore();

      // Reset shadow for border
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Japanese design: Ma (breathing space) - subtle white border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.stroke();

      resolve(canvas);
    };

    img.onerror = () => {
      reject(new Error(`Failed to load image: ${imageUrl}`));
    };

    img.src = imageUrl;
  });
}

/**
 * Convert canvas to data URL for use in Cesium billboard
 */
export function canvasToDataUrl(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL('image/png');
}

/**
 * Cache for processed images to avoid re-processing
 */
const imageCache = new Map<string, string>();

/**
 * Get or create a styled billboard image
 * Uses cache to avoid re-processing the same image
 */
export async function getStyledBillboardImage(imageUrl: string, size: number = 80): Promise<string> {
  const cacheKey = `${imageUrl}_${size}`;

  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)!;
  }

  try {
    const canvas = await createStyledBillboardImage(imageUrl, size);
    const dataUrl = canvasToDataUrl(canvas);
    imageCache.set(cacheKey, dataUrl);
    return dataUrl;
  } catch (error) {
    console.error('Failed to process billboard image:', error);
    // Return original URL as fallback
    return imageUrl;
  }
}

/**
 * Clear image cache (useful for memory management)
 */
export function clearImageCache(): void {
  imageCache.clear();
}

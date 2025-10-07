/**
 * Script to copy Cesium static assets to public directory
 * Run this once after npm install or when Cesium is updated
 *
 * Usage: node scripts/copy-cesium-assets.js
 */

const fs = require('fs-extra');
const path = require('path');

const cesiumSource = path.join(__dirname, '..', 'node_modules', 'cesium', 'Build', 'Cesium');
const cesiumDest = path.join(__dirname, '..', 'public', 'cesium');

async function copyCesiumAssets() {
  try {
    console.log('📦 Copying Cesium assets...');
    console.log(`   Source: ${cesiumSource}`);
    console.log(`   Destination: ${cesiumDest}`);

    // Check if source exists
    if (!fs.existsSync(cesiumSource)) {
      throw new Error('Cesium build directory not found. Run npm install first.');
    }

    // Remove existing destination
    if (fs.existsSync(cesiumDest)) {
      console.log('🗑️  Removing old assets...');
      await fs.remove(cesiumDest);
    }

    // Copy files
    console.log('📋 Copying files...');
    await fs.copy(cesiumSource, cesiumDest, {
      filter: (src) => {
        // Skip .map files and documentation
        return !src.endsWith('.map') && !src.includes('Documentation');
      },
    });

    console.log('✅ Cesium assets copied successfully!');
    console.log(`   Location: public/cesium/`);
  } catch (error) {
    console.error('❌ Error copying Cesium assets:', error.message);
    process.exit(1);
  }
}

copyCesiumAssets();

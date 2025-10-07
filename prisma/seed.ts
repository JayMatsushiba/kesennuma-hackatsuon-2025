/**
 * Prisma seed script
 * Seeds database with sample Kesennuma stories
 */

import { PrismaClient } from '@prisma/client';
import { getSeedStories } from '../lib/cesium/seed-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Kesennuma stories...');

  // Clear existing data (optional - comment out to keep existing)
  // await prisma.story.deleteMany({});

  const stories = getSeedStories();

  for (const story of stories) {
    await prisma.story.create({
      data: story,
    });
  }

  console.log(`✅ Created ${stories.length} stories`);
  console.log('📍 Locations seeded:');
  console.log('   - 気仙沼港 (Kesennuma Port)');
  console.log('   - 魚市場 (Fish Market)');
  console.log('   - 大島 (Oshima Island)');
  console.log('   - 震災メモリアル (Memorial Sites)');
  console.log('   - ...and more!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

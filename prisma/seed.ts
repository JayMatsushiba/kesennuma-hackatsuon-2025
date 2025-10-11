/**
 * Prisma seed script
 * Seeds database with sample Kesennuma stories
 */

import { PrismaClient } from '@prisma/client';
import { SEED_STORIES } from '../lib/cesium/seed-data';

const prisma = new PrismaClient();

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

async function main() {
  console.log('🌱 Seeding Kesennuma stories...');

  // Create a test user first
  const user = await prisma.user.upsert({
    where: { email: 'demo@kesennuma.jp' },
    update: {},
    create: {
      email: 'demo@kesennuma.jp',
      name: 'Kesennuma Demo User',
      bio: 'Sample user for seeding Kesennuma stories',
    },
  });

  console.log(`✅ Created user: ${user.name} (${user.email})`);

  // Clear existing stories (optional - comment out to keep existing)
  // await prisma.story.deleteMany({});

  let createdCount = 0;

  for (const seedStory of SEED_STORIES) {
    try {
      // Parse tags if they exist
      let tags: string[] = [];
      try {
        tags = JSON.parse(seedStory.tags || '[]');
      } catch {
        tags = [];
      }

      // Create slug from title
      const slug = slugify(seedStory.title);

      // Create story with new schema
      const story = await prisma.story.create({
        data: {
          title: seedStory.title,
          slug: `${slug}-${createdCount}`, // Add counter to ensure uniqueness
          excerpt: seedStory.description?.substring(0, 200), // Use first 200 chars as excerpt
          latitude: seedStory.latitude,
          longitude: seedStory.longitude,
          authorId: user.id,
          status: 'approved', // All seed stories are pre-approved
          featured: false,
          publishedAt: new Date(),
        },
      });

      // Create content block from description
      if (seedStory.description) {
        await prisma.storyContent.create({
          data: {
            storyId: story.id,
            blockType: 'text',
            order: 0,
            data: JSON.stringify({
              content: seedStory.description,
            }),
          },
        });
      }

      // Create image content block if mediaUrl exists
      if (seedStory.mediaUrl) {
        await prisma.storyContent.create({
          data: {
            storyId: story.id,
            blockType: 'image',
            order: 1,
            data: JSON.stringify({
              url: seedStory.mediaUrl,
              alt: seedStory.title,
            }),
          },
        });
      }

      // Create tags
      for (const tagName of tags) {
        // Find or create tag
        const tag = await prisma.tag.upsert({
          where: { slug: tagName },
          update: {},
          create: {
            name: tagName,
            slug: tagName,
            storyCount: 0,
          },
        });

        // Link tag to story
        await prisma.storyTag.create({
          data: {
            storyId: story.id,
            tagId: tag.id,
          },
        });

        // Update tag count
        await prisma.tag.update({
          where: { id: tag.id },
          data: { storyCount: { increment: 1 } },
        });
      }

      createdCount++;
    } catch (error) {
      console.error(`Failed to create story: ${seedStory.title}`, error);
    }
  }

  console.log(`✅ Created ${createdCount} stories`);
  console.log('📍 Locations seeded:');
  console.log('   - 気仙沼港 (Kesennuma Port)');
  console.log('   - 魚市場 (Fish Market)');
  console.log('   - 大島 (Oshima Island)');
  console.log('   - 震災メモリアル (Memorial Sites)');
  console.log('   - Pier7（創/ウマレル）');
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

import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import HeroCarousel from '../components/landing/HeroCarousel';
import PlatformExplanation from '../components/landing/PlatformExplanation';
import FeaturedStories, { type FeaturedStory } from '../components/landing/FeaturedStories';
import Partners from '../components/landing/Partners';
import ContactFeedback from '../components/landing/ContactFeedback';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Fetch stories for carousel and featured section
async function getStories(): Promise<{
  carouselImages: Array<{ url: string; title: string; alt: string }>;
  featuredStories: FeaturedStory[];
}> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/stories`, {
      cache: 'no-store', // Always get fresh data
    });

    if (!res.ok) {
      throw new Error('Failed to fetch stories');
    }

    const geojson = await res.json();
    const features = geojson.features || [];

    // Extract stories with cover images for carousel
    const storiesWithImages = features
      .filter((f: any) => f.properties?.coverImageUrl)
      .slice(0, 8); // Limit to 8 images for carousel

    const carouselImages = storiesWithImages.map((f: any) => ({
      url: f.properties.coverImageUrl,
      title: f.properties.title || 'Untitled',
      alt: f.properties.description || f.properties.title || 'Story image',
    }));

    // Prepare featured stories (top 3 by view count or most recent)
    const featuredStories: FeaturedStory[] = features
      .slice(0, 6) // Get top 6
      .map((f: any) => ({
        id: String(f.id),
        title: f.properties.title || 'Untitled',
        slug: f.properties.slug || String(f.id),
        description: f.properties.description || '',
        coverImageUrl: f.properties.coverImageUrl || undefined,
        locationName: f.properties.locationName || undefined,
        tags: f.properties.tags || [],
      }));

    return {
      carouselImages,
      featuredStories,
    };
  } catch (error) {
    console.error('Error fetching stories:', error);
    return {
      carouselImages: [],
      featuredStories: [],
    };
  }
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const { carouselImages, featuredStories } = await getStories();
  const t = await getTranslations();

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Clean and minimal */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-xl md:text-3xl font-bold text-slate-900">
                {t('common.title')}
              </h1>
              <p className="text-xs md:text-base text-slate-600 mt-1">
                {t('common.subtitle')}
              </p>
            </div>
            <LanguageSwitcher />
            <Button asChild size="default" className="bg-brand-600 hover:bg-brand-700 text-white hover:text-white transition-colors duration-200 shrink-0">
              <Link href={`/${locale}/submit`}>
                {t('common.submit')}
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section with Carousel */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Intro text with ample whitespace (余白) */}
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              {t('hero.title')}<br className="md:hidden" />
              <span className="text-brand-600">{t('hero.titleHighlight')}</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed">
              {t('hero.subtitle')}<br />
              {t('hero.subtitle2')}
            </p>
          </div>

          {/* Hero Carousel */}
          <HeroCarousel images={carouselImages} autoPlayInterval={6000} />

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Button asChild size="lg" className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white hover:text-white text-lg px-8 transition-colors duration-200">
              <Link href={`/${locale}/test-cesium`}>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {t('hero.exploreButton')}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-brand-600 hover:text-brand-700 border-2 border-brand-600 hover:border-brand-700 hover:bg-slate-50 text-lg px-8 transition-colors duration-200">
              <Link href={`/${locale}/submit`}>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                {t('hero.submitButton')}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Platform Explanation - Trust-building section */}
      <PlatformExplanation />

      {/* Featured Stories Section */}
      {featuredStories.length > 0 && (
        <div className="bg-gradient-to-b from-white to-slate-50">
          <FeaturedStories stories={featuredStories} />
        </div>
      )}

      {/* Quick Features - Visual cards */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {t('features.title')}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Link
              href={`/${locale}/test-cesium`}
              className="group block p-8 bg-gradient-to-br from-blue-50 to-white rounded-2xl hover:shadow-lg transition-shadow duration-200 border border-slate-200"
            >
              <div className="text-5xl mb-4">🗺️</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors">
                {t('features.explore.title')}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {t('features.explore.description')}
              </p>
            </Link>

            <Link
              href={`/${locale}/submit`}
              className="group block p-8 bg-gradient-to-br from-green-50 to-white rounded-2xl hover:shadow-lg transition-shadow duration-200 border border-slate-200"
            >
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors">
                {t('features.submit.title')}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {t('features.submit.description')}
              </p>
            </Link>

            <div className="group p-8 bg-gradient-to-br from-purple-50 to-white rounded-2xl border border-slate-200">
              <div className="text-5xl mb-4">🏷️</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {t('features.themes.title')}
              </h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                {t('features.themes.description')}
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-red-200 text-red-700 bg-white">
                  {t('features.themes.memorial')}
                </Badge>
                <Badge variant="outline" className="border-blue-200 text-blue-700 bg-white">
                  {t('features.themes.fishing')}
                </Badge>
                <Badge variant="outline" className="border-green-200 text-green-700 bg-white">
                  {t('features.themes.daily')}
                </Badge>
                <Badge variant="outline" className="border-orange-200 text-orange-700 bg-white">
                  {t('features.themes.food')}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Building trust with numbers */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-brand-600 to-brand-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl md:text-3xl font-bold mb-10 text-center">
            {t('stats.title')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {featuredStories.length}+
              </div>
              <div className="text-brand-100 font-medium">{t('stats.stories')}</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">3D</div>
              <div className="text-brand-100 font-medium">{t('stats.map')}</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <div className="text-brand-100 font-medium">{t('stats.access')}</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">∞</div>
              <div className="text-brand-100 font-medium">{t('stats.possibilities')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <Partners />

      {/* Contact & Feedback */}
      <ContactFeedback />

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">{t('common.title')}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {t('footer.description')}
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t('footer.links')}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href={`/${locale}/test-cesium`} className="text-slate-400 hover:text-white transition-colors">
                    {t('common.viewMap')}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/submit`} className="text-slate-400 hover:text-white transition-colors">
                    {t('common.submit')}
                  </Link>
                </li>
                <li>
                  <a
                    href="https://github.com/JayMatsushiba/kesennuma-hackatsuon-2025"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t('footer.contact')}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="mailto:contact@kesennuma-digital.jp"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    contact@kesennuma-digital.jp
                  </a>
                </li>
                <li className="text-slate-400">Kesennuma Hackatsuon 2025</li>
                <li className="text-slate-400 mt-4">
                  <span className="text-white font-semibold">Contributors:</span>
                  <br />
                  ss251, pavvann, JayMatsushiba
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
            <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

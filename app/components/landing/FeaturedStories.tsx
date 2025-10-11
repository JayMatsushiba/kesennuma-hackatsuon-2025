'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface FeaturedStory {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImageUrl?: string;
  locationName?: string;
  tags?: Array<{ id: number; name: string; color: string }>;
}

interface FeaturedStoriesProps {
  stories: FeaturedStory[];
}

export default function FeaturedStories({ stories }: FeaturedStoriesProps) {
  if (stories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header with Japanese aesthetic */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            注目のストーリー
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            気仙沼に暮らす人々の想い、震災からの復興、そして日常の喜び。<br />
            この街に刻まれた物語を、実際の場所と共にご覧ください。
          </p>
        </div>

        {/* Featured stories grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {stories.slice(0, 3).map((story, index) => (
            <Link
              key={story.id}
              href={`/test-cesium?story=${story.slug}`}
              className="group block"
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-slate-200 h-full"
            >
                {/* Image */}
                <div className="relative h-48 md:h-56 overflow-hidden bg-muted">
                  {story.coverImageUrl ? (
                    <Image
                      src={story.coverImageUrl}
                      alt={story.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                      <svg
                        className="w-16 h-16 text-muted-foreground/30"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                  {/* Ranking badge */}
                  <Badge className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-brand-600 hover:bg-white/95 font-bold shadow-md border-0">
                    {index === 0 && '🥇'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                    <span className="ml-1">人気</span>
                  </Badge>
                </div>

                <CardHeader>
                  {/* Location tag */}
                  {story.locationName && (
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {story.locationName}
                    </div>
                  )}

                  <CardTitle className="text-xl group-hover:text-brand-600 transition-colors line-clamp-2">
                    {story.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3 leading-relaxed">
                    {story.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Tags */}
                  {story.tags && story.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {story.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="secondary"
                          style={{
                            backgroundColor: `${tag.color}15`,
                            color: tag.color,
                          }}
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Read more link */}
                  <div className="flex items-center text-brand-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                    地図で見る
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* View all link */}
        <div className="text-center mt-10">
          <Link
            href="/test-cesium"
            className="inline-flex items-center text-brand-600 hover:text-brand-700 font-medium text-lg group"
          >
            すべてのストーリーを見る
            <svg
              className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

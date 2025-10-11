import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export default function Partners() {
  const partners = [
    {
      name: '気仙沼市',
      role: '公式パートナー',
      description: '市民の皆様と共に、気仙沼の魅力を世界に発信しています。',
      logo: '/partners/kesennuma-city-emblem.svg',
      logoAlt: '気仙沼市章',
      website: 'https://www.kesennuma.miyagi.jp/',
    },
    {
      name: '気仙沼観光コンベンション協会',
      role: 'コンテンツパートナー',
      description: '観光情報と地域の魅力的なスポットを提供しています。',
      logo: '/partners/kesennuma-tourism-logo.svg',
      logoAlt: '気仙沼観光コンベンション協会ロゴ',
      website: 'https://kesennuma-kanko.jp/',
    },
    {
      name: '地域コミュニティ',
      role: 'ストーリーテラー',
      description: '気仙沼の日常と記憶を共有してくださる地域の皆様。',
      logo: '👥', // Keep emoji for community
      logoAlt: 'コミュニティアイコン',
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            協力団体
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            このプラットフォームは、気仙沼市と地域の皆様との協働により実現しています。
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {partners.map((partner, index) => {
            const isImageLogo = partner.logo.startsWith('/');
            const cardContent = (
              <>
                <CardHeader className="text-center pb-3">
                  <div className="flex items-center justify-center mb-4 h-24">
                    {isImageLogo ? (
                      <div className="relative w-full h-full px-4">
                        <Image
                          src={partner.logo}
                          alt={partner.logoAlt}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    ) : (
                      <div className="text-6xl">{partner.logo}</div>
                    )}
                  </div>
                  <CardTitle className="text-xl">{partner.name}</CardTitle>
                  <Badge variant="secondary" className="text-brand-600 bg-brand-50 w-fit mx-auto mt-2">
                    {partner.role}
                  </Badge>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="leading-relaxed">
                    {partner.description}
                  </CardDescription>
                  {partner.website && (
                    <div className="mt-3 text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center justify-center gap-1">
                      ウェブサイトを見る
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </div>
                  )}
                </CardContent>
              </>
            );

            return partner.website ? (
              <a
                key={index}
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="hover:shadow-xl transition-all duration-200 hover:scale-[1.02] h-full">
                  {cardContent}
                </Card>
              </a>
            ) : (
              <Card
                key={index}
                className="hover:shadow-xl transition-all duration-200 h-full"
              >
                {cardContent}
              </Card>
            );
          })}
        </div>

        {/* Partnership call to action */}
        <Card className="mt-12 text-center">
          <CardHeader>
            <CardTitle className="text-xl">パートナーシップについて</CardTitle>
            <CardDescription className="max-w-2xl mx-auto">
              私たちは、気仙沼の魅力を共に発信していただける団体・企業様を募集しています。
              ご興味のある方は、お気軽にお問い合わせください。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a
              href="mailto:partners@kesennuma-digital.jp"
              className="inline-flex items-center text-brand-600 hover:text-brand-700 font-medium"
            >
              パートナーシップについて問い合わせる
              <svg
                className="w-4 h-4 ml-2"
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
            </a>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

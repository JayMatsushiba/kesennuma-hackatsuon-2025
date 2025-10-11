import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getTranslations } from 'next-intl/server';

export default async function ContactFeedback() {
  const t = await getTranslations('contact');

  const team = [
    {
      name: 'Jay Matsushiba',
      role: t('team.lead'),
      link: 'https://github.com/JayMatsushiba',
      icon: 'github',
    },
    {
      name: t('team.projectTeam'),
      role: t('team.development'),
      link: 'mailto:contact@kesennuma-digital.jp',
      icon: 'email',
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-white border-t border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Contact methods */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* General contact */}
          <a
            href="mailto:contact@kesennuma-digital.jp"
            className="block group"
          >
            <Card className="hover:shadow-lg transition-all h-full"
          >
              <CardContent className="flex items-start gap-4 p-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center group-hover:bg-brand-200 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1 text-lg">{t('generalTitle')}</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    {t('generalDesc')}
                  </p>
                  <p className="text-brand-600 font-medium text-sm">
                    contact@kesennuma-digital.jp
                  </p>
                </div>
              </CardContent>
            </Card>
          </a>

          {/* GitHub issues */}
          <a
            href="https://github.com/JayMatsushiba/kesennuma-hackatsuon-2025/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <Card className="hover:shadow-lg transition-all h-full">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center group-hover:bg-slate-800 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1 text-lg">{t('techTitle')}</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    {t('techDesc')}
                  </p>
                  <p className="text-slate-700 font-medium text-sm flex items-center">
                    GitHub Issues
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </p>
                </div>
              </CardContent>
            </Card>
          </a>
        </div>

        {/* Team info */}
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-center">{t('teamTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap justify-center gap-6">
              {team.map((member, index) => (
                <a
                  key={index}
                  href={member.link}
                  target={member.icon === 'github' ? '_blank' : undefined}
                  rel={member.icon === 'github' ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-3 bg-white rounded-xl px-5 py-3 hover:shadow-md transition-shadow border border-slate-200 group"
                >
                {member.icon === 'github' ? (
                  <svg className="w-5 h-5 text-slate-700" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                    />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                )}
                  <div>
                    <div className="font-bold text-slate-900 text-sm group-hover:text-brand-600 transition-colors">
                      {member.name}
                    </div>
                    <div className="text-xs text-muted-foreground">{member.role}</div>
                  </div>
                </a>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-300 text-center">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('projectInfo')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

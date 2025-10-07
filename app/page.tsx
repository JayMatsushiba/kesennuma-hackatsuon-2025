import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                気仙沼デジタル体験
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                3D地図で巡る、みんなの記憶と体験
              </p>
            </div>
            <Link
              href="/submit"
              className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
            >
              投稿する
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            地図で見る・気仙沼の記憶
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            震災の記憶、復興の歩み、日常の喜び。<br />
            みんなの体験を3Dでめぐります。
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Link
            href="/test-cesium"
            className="block p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-slate-200"
          >
            <div className="text-4xl mb-3">🗺️</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              3D地図を見る
            </h3>
            <p className="text-slate-600">
              気仙沼の街を3Dで探索。みんなの投稿を地図上で確認できます。
            </p>
          </Link>

          <Link
            href="/submit"
            className="block p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-slate-200"
          >
            <div className="text-4xl mb-3">📝</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              投稿する
            </h3>
            <p className="text-slate-600">
              あなたの体験を地図に残しましょう。写真と文章で簡単に投稿できます。
            </p>
          </Link>

          <div className="block p-6 bg-white rounded-2xl shadow-lg border border-slate-200">
            <div className="text-4xl mb-3">🏷️</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              テーマで探す
            </h3>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                震災の記憶
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                漁業
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                日常
              </span>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                食
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            現在の投稿状況
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-brand-600">10</div>
              <div className="text-sm text-slate-600 mt-1">投稿数</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-600">8</div>
              <div className="text-sm text-slate-600 mt-1">スポット</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-600">5</div>
              <div className="text-sm text-slate-600 mt-1">テーマ</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-600">1</div>
              <div className="text-sm text-slate-600 mt-1">コミュニティ</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/test-cesium"
            className="inline-block bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg hover:shadow-xl"
          >
            3D地図を開く →
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-slate-600 text-sm">
            © 2025 Kesennuma Hackatsuon 2025 - Built with ❤️ for Kesennuma
          </p>
        </div>
      </footer>
    </div>
  );
}

/**
 * Seed data for Kesennuma stories
 * Sample stories covering key landmarks and themes
 */

import type { Story } from './types';

export const SEED_STORIES: Omit<Story, 'id' | 'approved' | 'createdAt'>[] = [
  // Port & Fishing
  {
    title: '気仙沼港の朝',
    description: '早朝の気仙沼港。漁師たちが水揚げを始める活気ある風景。マグロやカツオの水揚げで有名な港です。',
    latitude: 38.8626562,
    longitude: 141.606009,
    mediaUrl: null,
    submitter: '田中太郎',
    tags: [],
  },
  {
    title: '魚市場の賑わい',
    description: '気仙沼魚市場の競りの様子。新鮮な魚介類が並び、活気に満ちています。',
    latitude: 38.9047061,
    longitude: 141.5786374,
    mediaUrl: null,
    submitter: '佐藤花子',
    tags: [],
  },

  // Oshima Island
  {
    title: '大島の美しい海岸',
    description: '大島の緑の真珠エリア。透き通った海と美しい海岸線が魅力です。',
    latitude: 38.878779,
    longitude: 141.606243,
    mediaUrl: null,
    submitter: '鈴木一郎',
    tags: [],
  },
  {
    title: '大島大橋',
    description: '2019年に開通した大島大橋。本土と大島を結ぶ重要な橋で、復興のシンボルです。',
    latitude: 38.878779,
    longitude: 141.606243,
    mediaUrl: null,
    submitter: '山田次郎',
    tags: [],
  },

  // Memorial Sites
  {
    title: '東日本大震災の記憶',
    description: '2011年3月11日、この地域を襲った津波の記憶。多くの命が失われましたが、復興の歩みは続いています。',
    latitude: 38.900,
    longitude: 141.570,
    mediaUrl: null,
    submitter: '伊藤美咲',
    tags: []  // Replace with actual tag objects:(['memorial']),
  },
  {
    title: '復興への歩み',
    description: '震災から14年。気仙沼は着実に復興を遂げています。新しい街並みと共に、記憶を語り継いでいます。',
    latitude: 38.907,
    longitude: 141.568,
    mediaUrl: null,
    submitter: '高橋健太',
    tags: []  // Replace with actual tag objects:(['memorial', 'daily-life']),
  },

  // Food & Culture
  {
    title: '気仙沼のフカヒレ',
    description: '気仙沼は日本最大のフカヒレ産地。高級食材として知られるフカヒレは、この地の名産品です。',
    latitude: 38.906,
    longitude: 141.565,
    mediaUrl: null,
    submitter: '渡辺さくら',
    tags: []  // Replace with actual tag objects:(['food', 'fishing']),
  },
  {
    title: 'みなとまつり',
    description: '毎年開催される気仙沼みなとまつり。港町の伝統と文化を感じられるイベントです。',
    latitude: 38.908,
    longitude: 141.566,
    mediaUrl: null,
    submitter: '小林直樹',
    tags: []  // Replace with actual tag objects:(['events', 'culture']),
  },

  // Bay Area
  {
    title: '気仙沼湾の夕暮れ',
    description: '湾に沈む夕日の美しさは格別。漁船が並ぶシルエットが印象的です。',
    latitude: 38.915,
    longitude: 141.570,
    mediaUrl: null,
    submitter: '中村雅子',
    tags: []  // Replace with actual tag objects:(['nature', 'daily-life']),
  },
  {
    title: '漁師町の日常',
    description: '北側湾岸の漁師町。昔ながらの生活が今も息づいています。',
    latitude: 38.918,
    longitude: 141.572,
    mediaUrl: null,
    submitter: '佐々木和夫',
    tags: []  // Replace with actual tag objects:(['fishing', 'daily-life', 'culture']),
  },
  {
    title: 'シャークミュージアム',
    description: '気仙沼海の市にある日本唯一のサメ専門博物館。サメの生態や歴史、気仙沼のサメ漁について学べます。',
    latitude: 38.90009720623811,
    longitude: 141.57946292489987,
    mediaUrl: null,
    submitter: '吉田真美',
    tags: []  // Replace with actual tag objects:(['culture', 'food', 'fishing']),
  },
  {
    title: '気仙沼駅前',
    description: 'JR気仙沼駅。市の玄関口として、多くの観光客を迎えています。',
    latitude: 38.90995,
    longitude: 141.55931,
    mediaUrl: null,
    submitter: '木村健二',
    tags: []  // Replace with actual tag objects:(['daily-life']),
  },
  {
    title: 'Pier7（創/ウマレル）',
    description: '内湾に建つまち・ひと・しごと交流プラザ。復興のシンボルとして、カフェ、レストラン、コミュニティスペースが集まるモダンな施設です。ここから気仙沼湾の観光クルーズも出発します。',
    latitude: 38.90522595237508,
    longitude: 141.575339182962,
    mediaUrl: null,
    submitter: '内湾コミュニティ',
    tags: []  // Replace with actual tag objects:(['memorial', 'culture', 'daily-life']),
  },
];

/**
 * Convert seed data to Story format with defaults
 */
export function getSeedStories(): Omit<Story, 'id'>[] {
  return SEED_STORIES.map((story) => ({
    ...story,
    approved: true, // All seed stories are pre-approved
    createdAt: new Date(),
  }));
}

/**
 * Get stories by tag (by tag ID or name)
 */
export function getSeedStoriesByTag(tagIdOrName: string | number): Omit<Story, 'id'>[] {
  return getSeedStories().filter((story) => {
    const tags = story.tags || [];
    return tags.some((t) => t.id === tagIdOrName || t.name === tagIdOrName);
  });
}

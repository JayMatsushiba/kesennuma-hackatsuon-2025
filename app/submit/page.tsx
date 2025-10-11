'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

type ContentBlock = {
  type: 'text' | 'image';
  order: number;
  data: {
    content?: string;
    imageUrl?: string;
    caption?: string;
  };
};

type LocationResult = {
  id: string;
  name: string;
  name_en: string | null;
  latitude: number;
  longitude: number;
  address: string | null;
  location_type: string | null;
};

type GeocodeResult = {
  lat: number;
  lon: number;
  display_name: string;
  name: string;
};

export default function SubmitPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [locationName, setLocationName] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([
    { type: 'text', order: 0, data: { content: '' } },
  ]);

  // Search state
  const [locationSearchResults, setLocationSearchResults] = useState<LocationResult[]>([]);
  const [geocodeResults, setGeocodeResults] = useState<GeocodeResult[]>([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Available tags from database
  const availableTags = [
    { id: 1, name: '震災の記憶', color: '#DC2626', icon: '🕯️' },
    { id: 2, name: '漁業', color: '#0284C7', icon: '🎣' },
    { id: 3, name: '日常', color: '#16A34A', icon: '🏘️' },
    { id: 4, name: '食', color: '#D97706', icon: '🍜' },
    { id: 5, name: 'イベント', color: '#9333EA', icon: '🎉' },
    { id: 6, name: '自然', color: '#059669', icon: '🌲' },
    { id: 7, name: '文化', color: '#BE185D', icon: '🎭' },
    { id: 8, name: '観光', color: '#7C3AED', icon: '🗺️' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search locations as user types
  const searchLocations = async (query: string) => {
    if (!query || query.trim().length < 2) {
      setLocationSearchResults([]);
      setGeocodeResults([]);
      setShowLocationDropdown(false);
      return;
    }

    setIsSearching(true);

    try {
      // Add Kesennuma context for better geocoding results
      const needsContext = !query.includes('気仙沼') &&
                          !query.includes('Kesennuma') &&
                          !query.includes('宮城');
      const geocodeQuery = needsContext ? `${query} 気仙沼 宮城県` : query;

      // Search existing locations in parallel with direct Nominatim geocoding
      const [existingResponse, geocodeResponse] = await Promise.all([
        fetch(`/api/locations/search?q=${encodeURIComponent(query)}`),
        fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(geocodeQuery)}&format=json&limit=5&countrycodes=jp`,
          {
            headers: {
              'User-Agent': 'Kesennuma-Digital-Experiences/1.0',
            },
          }
        ),
      ]);

      const existingData = await existingResponse.json();
      const nominatimData = await geocodeResponse.json();

      setLocationSearchResults(existingData.locations || []);

      // Transform Nominatim results
      const geocodeResults = (nominatimData || []).map((item: any) => ({
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        display_name: item.display_name,
        name: item.name || item.display_name.split(',')[0],
      }));

      setGeocodeResults(geocodeResults);
      setShowLocationDropdown(true);
    } catch (err) {
      console.error('Search failed:', err);
      // Still show existing results even if geocoding fails
      setShowLocationDropdown(true);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  const handleLocationInputChange = (value: string) => {
    setLocationName(value);
    setSelectedLocationId(null); // Clear selection when typing

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchLocations(value);
    }, 300);
  };

  // Select existing location
  const selectExistingLocation = (location: LocationResult) => {
    setLocationName(location.name);
    setLatitude(location.latitude.toString());
    setLongitude(location.longitude.toString());
    setAddress(location.address || '');
    setSelectedLocationId(location.id);
    setShowLocationDropdown(false);
  };

  // Select geocoded location
  const selectGeocodedLocation = (result: GeocodeResult) => {
    setLocationName(result.name);
    setLatitude(result.lat.toString());
    setLongitude(result.lon.toString());
    setAddress(result.display_name);
    setSelectedLocationId(null); // New location
    setShowLocationDropdown(false);
  };

  // Get user's current location
  const handleGetCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString());
          setLongitude(position.coords.longitude.toString());
        },
        (error) => {
          setError('位置情報の取得に失敗しました: ' + error.message);
        }
      );
    } else {
      setError('このブラウザは位置情報をサポートしていません');
    }
  };

  // Toggle tag selection
  const toggleTag = (tagId: number) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  // Add content block
  const addContentBlock = (type: 'text' | 'image') => {
    setContentBlocks((prev) => [
      ...prev,
      { type, order: prev.length, data: {} },
    ]);
  };

  // Update content block
  const updateContentBlock = (index: number, data: any) => {
    setContentBlocks((prev) =>
      prev.map((block, i) => (i === index ? { ...block, data: { ...block.data, ...data } } : block))
    );
  };

  // Remove content block
  const removeContentBlock = (index: number) => {
    setContentBlocks((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validation
      if (!title.trim()) {
        throw new Error('タイトルを入力してください');
      }
      if (!excerpt.trim()) {
        throw new Error('説明を入力してください');
      }
      if (!latitude || !longitude) {
        throw new Error('位置情報を入力してください');
      }

      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);

      if (isNaN(lat) || isNaN(lng)) {
        throw new Error('緯度と経度は数値で入力してください');
      }

      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        throw new Error('緯度・経度の値が正しくありません');
      }

      // Filter out empty content blocks
      const validContent = contentBlocks
        .filter((block) => {
          if (block.type === 'text') return block.data.content?.trim();
          if (block.type === 'image') return block.data.imageUrl?.trim();
          return false;
        })
        .map((block, index) => ({ ...block, order: index }));

      // Submit to API
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          excerpt: excerpt.trim(),
          location: selectedLocationId
            ? { id: selectedLocationId } // Use existing location
            : {
                // Create new location
                name: locationName.trim() || title.trim(),
                latitude: lat,
                longitude: lng,
                address: address.trim() || null,
                location_type: 'user_submitted',
              },
          tags: selectedTags,
          content: validContent,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.details || '送信に失敗しました');
      }

      setSuccess(true);

      // Redirect to map and force reload to show new story
      setTimeout(() => {
        window.location.href = '/test-cesium';
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '送信に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">送信完了！</h2>
          <p className="text-slate-600 mb-4">地図に表示されました</p>
          <p className="text-sm text-slate-500">3D地図に移動します...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
          >
            ← 地図に戻る
          </button>
          <h1 className="text-3xl font-bold text-slate-900">体験を投稿する</h1>
          <p className="text-slate-600 mt-2">
            気仙沼の思い出や体験を共有しましょう
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Story Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">基本情報</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  タイトル <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="例: 気仙沼港の朝"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  説明 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="体験や思い出を書いてください..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">場所</h2>

            <div className="space-y-4">
              {/* Location Search with Autocomplete */}
              <div className="relative" ref={dropdownRef}>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  場所の名前 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => handleLocationInputChange(e.target.value)}
                  onFocus={() => {
                    if (locationName.length >= 2) {
                      searchLocations(locationName);
                    }
                  }}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="例: 気仙沼港、魚市場、など..."
                  required
                />
                <p className="text-xs text-slate-500 mt-1">
                  💡 入力すると既存の場所や住所から検索できます
                </p>

                {/* Search Dropdown */}
                {showLocationDropdown && (locationSearchResults.length > 0 || geocodeResults.length > 0 || isSearching) && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-xl max-h-96 overflow-y-auto">
                    {isSearching && (
                      <div className="p-4 text-center text-slate-500">
                        検索中...
                      </div>
                    )}

                    {/* Existing Locations */}
                    {locationSearchResults.length > 0 && (
                      <div>
                        <div className="px-4 py-2 bg-blue-50 text-xs font-bold text-blue-900 uppercase sticky top-0">
                          📍 既存の場所 ({locationSearchResults.length})
                        </div>
                        {locationSearchResults.map((loc) => (
                          <button
                            key={loc.id}
                            type="button"
                            onClick={() => selectExistingLocation(loc)}
                            className="w-full px-4 py-3 text-left hover:bg-blue-50 border-b border-slate-100 transition-colors"
                          >
                            <div className="font-medium text-slate-900">{loc.name}</div>
                            {loc.address && (
                              <div className="text-xs text-slate-500 mt-0.5">{loc.address}</div>
                            )}
                            <div className="text-xs text-slate-400 mt-1">
                              {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Geocoded Addresses */}
                    {geocodeResults.length > 0 && (
                      <div>
                        <div className="px-4 py-2 bg-green-50 text-xs font-bold text-green-900 uppercase sticky top-0">
                          🗺️ 新しい場所 ({geocodeResults.length})
                        </div>
                        {geocodeResults.map((result, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => selectGeocodedLocation(result)}
                            className="w-full px-4 py-3 text-left hover:bg-green-50 border-b border-slate-100 transition-colors"
                          >
                            <div className="font-medium text-slate-900">{result.name}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{result.display_name}</div>
                            <div className="text-xs text-slate-400 mt-1">
                              {result.lat.toFixed(4)}, {result.lon.toFixed(4)}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {!isSearching && locationSearchResults.length === 0 && geocodeResults.length === 0 && (
                      <div className="p-4 text-center text-slate-500 text-sm">
                        場所が見つかりませんでした
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Address (optional, auto-filled) */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  住所
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="自動入力されます（編集可）"
                />
              </div>

              {/* Lat/Lng Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    緯度 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                    placeholder="38.908"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    経度 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                    placeholder="141.566"
                    required
                  />
                </div>
              </div>

              {/* Helper Options */}
              <div className="flex gap-4 text-sm">
                <button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  📍 現在地を取得
                </button>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">カテゴリー</h2>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedTags.includes(tag.id)
                      ? 'text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                  style={
                    selectedTags.includes(tag.id)
                      ? { backgroundColor: tag.color }
                      : undefined
                  }
                >
                  {tag.icon} {tag.name}
                </button>
              ))}
            </div>
          </div>

          {/* Content Blocks */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-900">詳細（任意）</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => addContentBlock('text')}
                  className="text-sm px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  + テキスト
                </button>
                <button
                  type="button"
                  onClick={() => addContentBlock('image')}
                  className="text-sm px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  + 画像
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {contentBlocks.map((block, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-slate-600">
                      {block.type === 'text' ? '📝 テキスト' : '🖼️ 画像'} #{index + 1}
                    </span>
                    {contentBlocks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeContentBlock(index)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        削除
                      </button>
                    )}
                  </div>

                  {block.type === 'text' && (
                    <textarea
                      value={block.data.content || ''}
                      onChange={(e) =>
                        updateContentBlock(index, { content: e.target.value })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="テキストを入力..."
                    />
                  )}

                  {block.type === 'image' && (
                    <div className="space-y-2">
                      <input
                        type="url"
                        value={block.data.imageUrl || ''}
                        onChange={(e) =>
                          updateContentBlock(index, { imageUrl: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="画像URL"
                      />
                      <input
                        type="text"
                        value={block.data.caption || ''}
                        onChange={(e) =>
                          updateContentBlock(index, { caption: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="キャプション（任意）"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed font-medium"
            >
              {isSubmitting ? '送信中...' : '投稿する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

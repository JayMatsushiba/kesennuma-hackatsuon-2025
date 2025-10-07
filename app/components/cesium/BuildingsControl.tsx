/**
 * Control panel for 3D buildings (OSM, Google)
 * Toggle visibility, change colors, etc.
 */

'use client';

import { useState } from 'react';

export interface BuildingsControlProps {
  onToggleOSM: (visible: boolean) => void;
  onToggleGoogle?: (visible: boolean) => void;
  onStyleChange?: (color: string, alpha: number) => void;
}

export default function BuildingsControl({
  onToggleOSM,
  onToggleGoogle,
  onStyleChange,
}: BuildingsControlProps) {
  const [osmVisible, setOsmVisible] = useState(true);
  const [googleVisible, setGoogleVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleOSM = () => {
    const newValue = !osmVisible;
    setOsmVisible(newValue);
    onToggleOSM(newValue);
  };

  const handleToggleGoogle = () => {
    if (!onToggleGoogle) return;
    const newValue = !googleVisible;
    setGoogleVisible(newValue);
    onToggleGoogle(newValue);
  };

  const handleStylePreset = (preset: 'default' | 'white' | 'dark' | 'transparent') => {
    if (!onStyleChange) return;

    const styles = {
      default: { color: '#ffffff', alpha: 1.0 },
      white: { color: '#f8fafc', alpha: 0.9 },
      dark: { color: '#475569', alpha: 0.8 },
      transparent: { color: '#ffffff', alpha: 0.5 },
    };

    const style = styles[preset];
    onStyleChange(style.color, style.alpha);
  };

  return (
    <div className="absolute bottom-4 left-4 z-10">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white hover:bg-slate-50 text-slate-800 px-4 py-2 rounded-lg shadow-lg border border-slate-200 flex items-center gap-2 font-medium transition-colors"
        aria-label="3D建物設定"
      >
        <span className="text-lg">🏢</span>
        <span>3D建物</span>
        <span className={`text-sm transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {/* Control panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-0"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 p-4 z-10">
            <h3 className="font-bold text-slate-900 mb-3">3D建物設定</h3>

            {/* OSM Buildings Toggle */}
            <div className="mb-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium text-slate-700">
                  OpenStreetMap建物
                </span>
                <input
                  type="checkbox"
                  checked={osmVisible}
                  onChange={handleToggleOSM}
                  className="w-4 h-4 text-brand-600 rounded focus:ring-2 focus:ring-brand-500"
                />
              </label>
              <p className="text-xs text-slate-500 mt-1">
                世界中の3.5億以上の建物
              </p>
            </div>

            {/* Google Buildings Toggle (optional) */}
            {onToggleGoogle && (
              <div className="mb-3 pb-3 border-b border-slate-200">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-medium text-slate-700">
                    Google 3Dタイル
                  </span>
                  <input
                    type="checkbox"
                    checked={googleVisible}
                    onChange={handleToggleGoogle}
                    className="w-4 h-4 text-brand-600 rounded focus:ring-2 focus:ring-brand-500"
                  />
                </label>
                <p className="text-xs text-slate-500 mt-1">
                  フォトリアルな3D建物
                </p>
              </div>
            )}

            {/* Style presets */}
            {onStyleChange && (
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">スタイル</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleStylePreset('default')}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded text-xs font-medium transition-colors"
                  >
                    デフォルト
                  </button>
                  <button
                    onClick={() => handleStylePreset('white')}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded text-xs font-medium transition-colors"
                  >
                    明るい
                  </button>
                  <button
                    onClick={() => handleStylePreset('dark')}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded text-xs font-medium transition-colors"
                  >
                    暗い
                  </button>
                  <button
                    onClick={() => handleStylePreset('transparent')}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded text-xs font-medium transition-colors"
                  >
                    半透明
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Layer management panel for Cesium viewer
 * Allows users to toggle visibility of different map layers
 */

'use client';

import { useState } from 'react';

export interface Layer {
  id: string;
  label: string;
  labelJa: string;
  icon: string;
  enabled: boolean;
  available: boolean; // Whether the layer is loaded/available
}

export interface LayersPanelProps {
  layers: Layer[];
  onToggleLayer: (layerId: string, enabled: boolean) => void;
}

export default function LayersPanel({ layers, onToggleLayer }: LayersPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (layerId: string, currentEnabled: boolean) => {
    onToggleLayer(layerId, !currentEnabled);
  };

  return (
    <div className="absolute bottom-4 right-4 z-10">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white hover:bg-slate-50 text-slate-800 px-4 py-2 rounded-lg shadow-lg border border-slate-200 flex items-center gap-2 font-medium transition-colors"
        aria-label="レイヤー設定"
      >
        <span className="text-lg">🗂️</span>
        <span>レイヤー</span>
        <span className={`text-sm transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {/* Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-0"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute bottom-full right-0 mb-2 w-72 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-10">
            <div className="px-3 py-2 border-b border-slate-200">
              <p className="text-xs font-semibold text-slate-500 uppercase">表示レイヤー</p>
            </div>

            <div className="max-h-96 overflow-y-auto py-2">
              {layers.map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => layer.available && handleToggle(layer.id, layer.enabled)}
                  disabled={!layer.available}
                  className={`w-full text-left px-4 py-3 transition-colors border-b border-slate-100 last:border-0 ${
                    layer.available
                      ? 'hover:bg-slate-50 cursor-pointer'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{layer.icon}</span>
                      <div>
                        <div className="font-medium text-slate-800">{layer.labelJa}</div>
                        <div className="text-xs text-slate-500">{layer.label}</div>
                      </div>
                    </div>

                    {/* Toggle switch */}
                    {layer.available ? (
                      <div className={`relative inline-block w-11 h-6 transition-colors duration-200 ease-in-out rounded-full ${
                        layer.enabled ? 'bg-brand-600' : 'bg-slate-300'
                      }`}>
                        <span className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-200 ease-in-out ${
                          layer.enabled ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">準備中</span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="px-3 py-2 border-t border-slate-200">
              <p className="text-xs text-slate-500">
                レイヤーの表示/非表示を切り替えます
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

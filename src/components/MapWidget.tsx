import React, { useState } from 'react';
import { MapPin, Layers, Navigation, Info, ExternalLink } from 'lucide-react';
import { formatDZD } from '../utils/formatters';

interface MapWidgetProps {
  wilaya?: string;
  commune?: string;
  priceDZD?: number;
  interactivePins?: { id: string; title: string; priceDZD: number; lat: number; lng: number }[];
}

export const MapWidget: React.FC<MapWidgetProps> = ({
  wilaya = "Alger",
  commune = "Hydra",
  priceDZD = 85000000,
  interactivePins = []
}) => {
  const [mapType, setMapType] = useState<'street' | 'satellite'>('street');
  const [activePin, setActivePin] = useState<string | null>(null);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-900 group">
      
      {/* Map Graphic Layer */}
      <div className={`w-full h-72 relative transition-all duration-300 ${
        mapType === 'satellite' ? 'bg-slate-900' : 'bg-slate-100'
      }`}>
        {/* Map Background SVG Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke={mapType === 'satellite' ? '#ffffff22' : '#00000015'} strokeWidth="1"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Decorative Roads / Sea Water SVG curve for Algiers/Oran Coastline */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M 0 40 Q 150 120, 300 80 T 600 160" fill="none" stroke={mapType === 'satellite' ? '#38bdf844' : '#0284c733'} strokeWidth="24" />
          <path d="M 40 0 Q 180 200, 450 120 T 700 250" fill="none" stroke={mapType === 'satellite' ? '#10b98133' : '#05966922'} strokeWidth="12" />
        </svg>

        {/* Central Pin Pulse */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center animate-bounce duration-1000">
          <div className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xl border border-emerald-500/50 flex items-center gap-1.5 whitespace-nowrap mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-outfit">{formatDZD(priceDZD)}</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg ring-4 ring-emerald-500/30">
            <MapPin className="w-5 h-5 fill-white text-emerald-600" />
          </div>
        </div>

        {/* Extra Nearby Pins */}
        {interactivePins.map((pin, idx) => (
          <div
            key={pin.id || idx}
            onClick={() => setActivePin(pin.id)}
            style={{ left: `${30 + (idx * 20)}%`, top: `${25 + (idx * 25)}%` }}
            className="absolute z-10 cursor-pointer transform hover:scale-110 transition-transform"
          >
            <div className="bg-white/95 text-slate-900 text-[10px] font-bold px-2 py-1 rounded-lg shadow-md border border-slate-200 flex items-center gap-1">
              <span>{formatDZD(pin.priceDZD, true)}</span>
            </div>
          </div>
        ))}

        {/* Map Header Controls Overlay */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-20">
          <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2">
            <Navigation className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs font-bold text-slate-900">{wilaya}, {commune}</span>
          </div>

          <div className="bg-white/90 backdrop-blur-md p-1 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1">
            <button
              type="button"
              onClick={() => setMapType('street')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${
                mapType === 'street' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              Plan
            </button>
            <button
              type="button"
              onClick={() => setMapType('satellite')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${
                mapType === 'satellite' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              Satellite
            </button>
          </div>
        </div>

        {/* Bottom Legend */}
        <div className="absolute bottom-3 left-3 z-20 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-[11px] text-slate-300 border border-slate-700 flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-emerald-400" />
          <span>Localisation administrative exacte certifiée ImmoWin</span>
        </div>

      </div>
    </div>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Property } from '../types';
import { formatDZD } from '../utils/formatters';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Search, Layers, Building2, Maximize2, ExternalLink, ShieldCheck, Video, Image as ImageIcon, Play, Navigation, X } from 'lucide-react';

interface InteractiveMapProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  height?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  properties,
  onSelectProperty,
  height = '620px'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const { language, t } = useLanguage();
  const [selectedPropertyPreview, setSelectedPropertyPreview] = useState<Property | null>(null);
  const [mapTileStyle, setMapTileStyle] = useState<'osm' | 'voyager' | 'dark'>('voyager');
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [selectedMediaTab, setSelectedMediaTab] = useState<'photo' | 'video'>('photo');

  // Fix default marker icon issues in Leaflet
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  // Tile Layer URLs
  const tileLayers = {
    voyager: {
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
    },
    osm: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    dark: {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
    }
  };

  // Filter properties by search query on map
  const filteredMapProperties = properties.filter(prop => {
    if (!mapSearchQuery.trim()) return true;
    const q = mapSearchQuery.toLowerCase();
    return (
      prop.title.toLowerCase().includes(q) ||
      prop.wilaya.toLowerCase().includes(q) ||
      prop.commune.toLowerCase().includes(q) ||
      prop.neighborhood.toLowerCase().includes(q) ||
      prop.type.toLowerCase().includes(q)
    );
  });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Default center on Algiers
    const map = L.map(mapContainerRef.current, {
      center: [36.7538, 3.0588],
      zoom: 11,
      zoomControl: false
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    const tileConfig = tileLayers[mapTileStyle];
    L.tileLayer(tileConfig.url, {
      maxZoom: 19,
      attribution: tileConfig.attribution
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;
    markersLayerRef.current = markersGroup;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersLayerRef.current = null;
    };
  }, []);

  // Update Tile Layer on style change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    const tileConfig = tileLayers[mapTileStyle];
    L.tileLayer(tileConfig.url, {
      maxZoom: 19,
      attribution: tileConfig.attribution
    }).addTo(map);
  }, [mapTileStyle]);

  // Update Markers when properties array changes or map search query changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;

    markersGroup.clearLayers();

    if (filteredMapProperties.length === 0) return;

    const bounds = L.latLngBounds([]);

    filteredMapProperties.forEach((prop) => {
      if (!prop.coordinates || !prop.coordinates.lat || !prop.coordinates.lng) return;

      const latLng: [number, number] = [prop.coordinates.lat, prop.coordinates.lng];
      bounds.extend(latLng);

      const priceTag = formatDZD(prop.priceDZD, true);
      const isForSale = prop.transactionType === 'Achat' || prop.transactionType === 'Vente';
      const hasVideo = prop.videos && prop.videos.length > 0;
      const photosCount = prop.images.length;

      // Custom Leaflet DivIcon with stylized pill badge + media icons
      const customIcon = L.divIcon({
        className: 'custom-map-pin-container',
        html: `
          <div dir="ltr" class="custom-map-pin ${isForSale ? 'bg-slate-900 text-white' : 'bg-emerald-600 text-white'} shadow-xl rounded-xl px-2.5 py-1 text-[11px] font-bold border-2 border-white flex items-center gap-1.5 cursor-pointer transform hover:scale-110 transition-transform whitespace-nowrap [direction:ltr]">
            <span class="w-2 h-2 rounded-full ${isForSale ? 'bg-emerald-400' : 'bg-amber-300'}"></span>
            <span dir="ltr" class="inline-block [direction:ltr]">${priceTag}</span>
            ${hasVideo ? '<span class="bg-amber-400 text-slate-950 px-1 rounded text-[9px] font-black uppercase flex items-center gap-0.5">▶ Vidéo</span>' : ''}
            <span class="text-[9px] opacity-80" dir="ltr">📷 ${photosCount}</span>
          </div>
        `,
        iconSize: [110, 32],
        iconAnchor: [55, 16]
      });

      const marker = L.marker(latLng, { icon: customIcon });

      // Popup Content
      const popupContent = document.createElement('div');
      popupContent.className = 'p-1 text-slate-900 font-sans max-w-[240px]';
      popupContent.setAttribute('dir', 'ltr');
      popupContent.innerHTML = `
        <div class="relative rounded-xl overflow-hidden mb-2 bg-slate-100">
          <img src="${prop.images[0]}" alt="${prop.title}" class="w-full h-28 object-cover rounded-xl" />
          <div class="absolute top-1.5 left-1.5 flex gap-1">
            <span class="bg-slate-900/90 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
              ${prop.wilaya}
            </span>
            ${hasVideo ? '<span class="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md">▶ Vidéo</span>' : ''}
          </div>
          <span class="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded" dir="ltr">
            📷 ${photosCount} photos
          </span>
        </div>
        <h4 class="text-xs font-bold line-clamp-1 mb-1 text-slate-900">${prop.title}</h4>
        <div class="text-xs font-extrabold text-emerald-700 mb-2 font-outfit" dir="ltr">
          <span dir="ltr" class="inline-block [direction:ltr]">${formatDZD(prop.priceDZD)}</span>
        </div>
        <button id="btn-view-${prop.id}" class="w-full bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold py-1.5 px-3 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1">
          <span>${language === 'AR' ? 'عرض الصور والفيديو والتفاصيل' : language === 'EN' ? 'View Photos & Videos' : 'Voir Photos, Vidéo & Fiche'}</span>
        </button>
      `;

      marker.bindPopup(popupContent, {
        closeButton: true,
        className: 'custom-leaflet-popup'
      });

      marker.on('click', () => {
        setSelectedPropertyPreview(prop);
        setSelectedMediaTab('photo');
        setTimeout(() => {
          const btn = document.getElementById(`btn-view-${prop.id}`);
          if (btn) {
            btn.onclick = () => onSelectProperty(prop);
          }
        }, 100);
      });

      markersGroup.addLayer(marker);
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [filteredMapProperties, language, onSelectProperty]);

  return (
    <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900">
      
      {/* Top Floating Map Controls Bar */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pointer-events-none">
        
        {/* Map Search Bar Input */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-slate-200 flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-emerald-600 shrink-0" />
          <input
            type="text"
            value={mapSearchQuery}
            onChange={e => setMapSearchQuery(e.target.value)}
            placeholder={language === 'AR' ? 'ابحث على الخريطة (ولاية، بلدية، فيلا، مسبح...)' : language === 'EN' ? 'Search map (Wilaya, Commune, Villa, Pool...)' : 'Rechercher sur la carte (Wilaya, Commune, Villa, Vue mer...)'}
            className="w-full bg-transparent text-xs text-slate-900 font-medium focus:outline-none placeholder-slate-400"
          />
          {mapSearchQuery && (
            <button
              onClick={() => setMapSearchQuery('')}
              className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full shrink-0">
            {filteredMapProperties.length} biens
          </span>
        </div>

        {/* Map Tiles Switcher */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md p-1 rounded-2xl shadow-lg border border-slate-200 flex items-center gap-1 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setMapTileStyle('voyager')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mapTileStyle === 'voyager' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Voyager
          </button>
          <button
            type="button"
            onClick={() => setMapTileStyle('osm')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mapTileStyle === 'osm' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Plan
          </button>
          <button
            type="button"
            onClick={() => setMapTileStyle('dark')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mapTileStyle === 'dark' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Sombre
          </button>
        </div>

      </div>

      {/* Leaflet Map Div Container */}
      <div
        ref={mapContainerRef}
        style={{ height }}
        className="w-full z-10 font-sans"
      />

      {/* Expanded Floating Media Drawer for active clicked map property */}
      {selectedPropertyPreview && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-[1000] sm:max-w-md bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-3xl shadow-2xl border border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-200 space-y-4">
          
          {/* Drawer Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-900 text-white">
                  {selectedPropertyPreview.type}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {selectedPropertyPreview.status}
                </span>
                {selectedPropertyPreview.videos && selectedPropertyPreview.videos.length > 0 && (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 flex items-center gap-1">
                    <Play className="w-2.5 h-2.5 fill-slate-950" />
                    <span>Vidéo Inclus</span>
                  </span>
                )}
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 line-clamp-1 font-outfit">
                {selectedPropertyPreview.title}
              </h4>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{selectedPropertyPreview.commune}, {selectedPropertyPreview.wilaya} ({selectedPropertyPreview.neighborhood})</span>
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedPropertyPreview(null)}
              className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Media Preview Player / Gallery Toggle */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <button
                type="button"
                onClick={() => setSelectedMediaTab('photo')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedMediaTab === 'photo' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Photos ({selectedPropertyPreview.images.length})</span>
              </button>

              {selectedPropertyPreview.videos && selectedPropertyPreview.videos.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedMediaTab('video')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedMediaTab === 'video' ? 'bg-amber-500 text-slate-950' : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                  }`}
                >
                  <Video className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Vidéo ({selectedPropertyPreview.videos.length})</span>
                </button>
              )}
            </div>

            {/* Media Viewer Box */}
            <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-slate-950 shadow-md">
              {selectedMediaTab === 'photo' ? (
                <img
                  src={selectedPropertyPreview.images[0]}
                  alt={selectedPropertyPreview.title}
                  className="w-full h-full object-cover"
                />
              ) : selectedPropertyPreview.videos && selectedPropertyPreview.videos[0] ? (
                <video
                  src={selectedPropertyPreview.videos[0]}
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                  Pas de vidéo disponible
                </div>
              )}
            </div>
          </div>

          {/* GPS Coordinates Badge & Specs */}
          <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2">
              <Navigation className="w-3.5 h-3.5 text-sky-600" />
              <span className="font-mono text-[11px] text-slate-600">
                GPS: {selectedPropertyPreview.coordinates?.lat.toFixed(4)}, {selectedPropertyPreview.coordinates?.lng.toFixed(4)}
              </span>
            </div>
            <div className="text-sm font-extrabold text-emerald-700 font-outfit">
              {formatDZD(selectedPropertyPreview.priceDZD)}
            </div>
          </div>

          {/* Big Action Button */}
          <button
            type="button"
            onClick={() => onSelectProperty(selectedPropertyPreview)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold py-3 px-4 rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{language === 'AR' ? 'فتح الفيش الكامل (الصور + الفيديو والمعاينة)' : language === 'EN' ? 'Open Full Property Listing' : 'Ouvrir la fiche complète (Photos, Vidéos & Contact)'}</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};

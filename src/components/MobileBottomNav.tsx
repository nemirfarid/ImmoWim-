import React from 'react';
import { usePropertyContext } from '../context/PropertyContext';
import { useLanguage } from '../context/LanguageContext';
import { Home, MapPin, Calculator, Heart, PlusCircle, LayoutDashboard } from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: 'home' | 'estimation' | 'favorites' | 'dashboard';
  setCurrentTab: (tab: 'home' | 'estimation' | 'favorites' | 'dashboard') => void;
  viewMode: 'grid' | 'map';
  setViewMode: (mode: 'grid' | 'map') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  setCurrentTab,
  viewMode,
  setViewMode
}) => {
  const { favoritesCount, setIsAddModalOpen } = usePropertyContext();
  const { language, t } = useLanguage();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-2 py-1.5 flex items-center justify-around pb-safe">
      
      {/* Home Tab */}
      <button
        id="mobile-nav-home"
        onClick={() => {
          setCurrentTab('home');
          setViewMode('grid');
        }}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
          currentTab === 'home' && viewMode === 'grid'
            ? 'text-emerald-700 font-extrabold scale-105'
            : 'text-slate-500 hover:text-slate-900 font-medium'
        }`}
      >
        <Home className={`w-5 h-5 ${currentTab === 'home' && viewMode === 'grid' ? 'text-emerald-600 stroke-[2.5]' : ''}`} />
        <span className="text-[10px] mt-0.5">{t.navHome}</span>
      </button>

      {/* Map Tab */}
      <button
        id="mobile-nav-map"
        onClick={() => {
          setCurrentTab('home');
          setViewMode('map');
        }}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
          currentTab === 'home' && viewMode === 'map'
            ? 'text-emerald-700 font-extrabold scale-105'
            : 'text-slate-500 hover:text-slate-900 font-medium'
        }`}
      >
        <MapPin className={`w-5 h-5 ${currentTab === 'home' && viewMode === 'map' ? 'text-emerald-600 stroke-[2.5]' : ''}`} />
        <span className="text-[10px] mt-0.5">{language === 'AR' ? 'الخريطة' : 'Carte GPS'}</span>
      </button>

      {/* Quick Add (+) Center Hero Button */}
      <button
        id="mobile-nav-add-btn"
        onClick={() => setIsAddModalOpen(true)}
        className="flex flex-col items-center justify-center -mt-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white w-12 h-12 rounded-full shadow-lg shadow-emerald-600/30 border-2 border-white cursor-pointer active:scale-90 transition-transform"
        title="Publier une annonce avec photos, vidéos et GPS"
      >
        <PlusCircle className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* AI Estimation Tab */}
      <button
        id="mobile-nav-estimation"
        onClick={() => setCurrentTab('estimation')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
          currentTab === 'estimation'
            ? 'text-emerald-700 font-extrabold scale-105'
            : 'text-slate-500 hover:text-slate-900 font-medium'
        }`}
      >
        <Calculator className={`w-5 h-5 ${currentTab === 'estimation' ? 'text-emerald-600 stroke-[2.5]' : ''}`} />
        <span className="text-[10px] mt-0.5">{t.navEstimation}</span>
      </button>

      {/* Favorites Tab */}
      <button
        id="mobile-nav-favorites"
        onClick={() => setCurrentTab('favorites')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer relative ${
          currentTab === 'favorites'
            ? 'text-emerald-700 font-extrabold scale-105'
            : 'text-slate-500 hover:text-slate-900 font-medium'
        }`}
      >
        <Heart className={`w-5 h-5 ${favoritesCount > 0 ? 'text-rose-500 fill-rose-500' : ''} ${currentTab === 'favorites' ? 'stroke-[2.5]' : ''}`} />
        <span className="text-[10px] mt-0.5">{t.navFavorites}</span>
        {favoritesCount > 0 && (
          <span className="absolute top-0 right-1 bg-rose-600 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
            {favoritesCount}
          </span>
        )}
      </button>

      {/* Dashboard Tab */}
      <button
        id="mobile-nav-dashboard"
        onClick={() => setCurrentTab('dashboard')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
          currentTab === 'dashboard'
            ? 'text-emerald-700 font-extrabold scale-105'
            : 'text-slate-500 hover:text-slate-900 font-medium'
        }`}
      >
        <LayoutDashboard className={`w-5 h-5 ${currentTab === 'dashboard' ? 'text-emerald-600 stroke-[2.5]' : ''}`} />
        <span className="text-[10px] mt-0.5">{t.navDashboard}</span>
      </button>

    </div>
  );
};

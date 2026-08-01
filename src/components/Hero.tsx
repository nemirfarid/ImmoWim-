import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Search, ShieldCheck, MapPin, TrendingUp, PlusCircle, Bell, Bot } from 'lucide-react';

interface HeroProps {
  onEstimateClick: () => void;
  onExploreClick: () => void;
  onOpenAddProperty: () => void;
  onOpenCriteriaModal: () => void;
  onOpenSmartImporter?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onEstimateClick,
  onExploreClick,
  onOpenAddProperty,
  onOpenCriteriaModal,
  onOpenSmartImporter
}) => {
  const { language, t } = useLanguage();
  const isAr = language === 'AR';
  const isEn = language === 'EN';

  return (
    <div className="relative overflow-hidden bg-slate-950 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6 shadow-2xl border border-slate-800">
      {/* Background Image with Dark Overlay & Blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transform filter brightness-45 contrast-115 transition-transform duration-10000 hover:scale-100"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80')`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

      {/* Hero Content */}
      <div className="relative max-w-5xl mx-auto px-6 py-16 sm:py-20 lg:py-24 text-center ltr:sm:text-left rtl:sm:text-right z-10">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-6 animate-pulse">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{t.heroBadge}</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-outfit leading-tight mb-6">
          {t.heroTagline}
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed mb-8">
          {t.heroSubtitle}
        </p>

        {/* Seller, Buyer & Importer Quick Access Banner Pills */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mb-8">
          {/* Seller Pill */}
          <button
            id="hero-seller-quick-btn"
            onClick={onOpenAddProperty}
            className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-lg shadow-emerald-950/50 border border-emerald-400/40 text-left rtl:text-right transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <PlusCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="block text-xs font-extrabold text-emerald-200 uppercase tracking-wider">
                {isAr ? 'فضاء البائعين والمالكين' : isEn ? 'For Sellers & Landlords' : 'Espace Vendeurs'}
              </span>
              <span className="text-sm font-bold text-white block">
                {isAr ? 'تسجيل ونشر عقاري (مجاناً)' : isEn ? 'Register & Post Property' : 'Inscrire & Publier mon bien'}
              </span>
            </div>
          </button>

          {/* Buyer Pill */}
          <button
            id="hero-buyer-quick-btn"
            onClick={onOpenCriteriaModal}
            className="p-4 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white shadow-lg shadow-sky-950/50 border border-sky-400/40 text-left rtl:text-right transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Bell className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <span className="block text-xs font-extrabold text-sky-200 uppercase tracking-wider">
                {isAr ? 'فضاء المشترين والباحثين' : isEn ? 'For Buyers & Searchers' : 'Espace Acheteurs'}
              </span>
              <span className="text-sm font-bold text-white block">
                {isAr ? 'تسجيل وإضافة معايير الشراء' : isEn ? 'Register & Add Criteria' : 'Inscrire & Ajouter mes critères'}
              </span>
            </div>
          </button>

          {/* Smart Importer Pill */}
          {onOpenSmartImporter && (
            <button
              id="hero-importer-quick-btn"
              onClick={onOpenSmartImporter}
              className="p-4 rounded-2xl bg-gradient-to-r from-purple-700 to-slate-900 hover:from-purple-600 hover:to-slate-800 text-white shadow-lg shadow-purple-950/50 border border-purple-400/40 text-left rtl:text-right transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/30 flex items-center justify-center shrink-0 border border-purple-400/30">
                <Bot className="w-6 h-6 text-purple-300 animate-pulse" />
              </div>
              <div>
                <span className="block text-xs font-extrabold text-purple-200 uppercase tracking-wider">
                  {isAr ? 'استيراد وتحديث تلقائي' : isEn ? 'Auto Importer & Scraper' : 'Importer & Bot Auto'}
                </span>
                <span className="text-sm font-bold text-white block">
                  {isAr ? 'جلب الإعلانات من المنصات' : isEn ? 'Import Ads from Portals' : 'Importer d\'autres plateformes'}
                </span>
              </div>
            </button>
          )}
        </div>

        {/* Secondary Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
          <button
            id="hero-estimate-cta-btn"
            onClick={onEstimateClick}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer flex items-center justify-center gap-2.5"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{t.heroEstimateBtn}</span>
          </button>

          <button
            id="hero-explore-cta-btn"
            onClick={onExploreClick}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer flex items-center justify-center gap-2.5"
          >
            <Search className="w-4 h-4 text-slate-300" />
            <span>{t.heroSearchBtn}</span>
          </button>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-white/10 pt-8 max-w-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-left rtl:text-right">
              <p className="text-sm font-bold text-white">{t.heroFeatureDeed}</p>
              <p className="text-[11px] text-slate-400">{t.heroFeatureDeedSub}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="text-left rtl:text-right">
              <p className="text-sm font-bold text-white">{t.heroFeatureWilayas}</p>
              <p className="text-[11px] text-slate-400">{t.heroFeatureWilayasSub}</p>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-left rtl:text-right">
              <p className="text-sm font-bold text-white">{t.heroFeaturePrice}</p>
              <p className="text-[11px] text-slate-400">{t.heroFeaturePriceSub}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};


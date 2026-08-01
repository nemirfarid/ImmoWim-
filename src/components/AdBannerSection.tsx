import React, { useState, useEffect } from 'react';
import { FreeAdCampaign } from './FreeAdModal';
import { usePropertyContext } from '../context/PropertyContext';
import { Megaphone, Building2, Sparkles, Phone, MessageCircle, ExternalLink, ChevronLeft, ChevronRight, Gift, ShieldCheck } from 'lucide-react';

const DEFAULT_FEATURED_ADS: FreeAdCampaign[] = [
  {
    id: 'ad-default-1',
    advertiserRole: 'Promoteur VEFA',
    companyName: 'Promotion Immobilière Zahra VEFA',
    title: 'Lancement Résidence les Palmiers : 40 Logements F3 & F4 avec Piscine & Box à Hydra',
    wilaya: 'Alger',
    commune: 'Hydra',
    tag: 'Spécial VEFA Lancement 0% Frais',
    bannerImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    description: 'Bénéficiez de remises exclusives pour les 10 premiers acquéreurs. Acte notarié et livret foncier individuels garantis.',
    phone: '+213 550 11 22 33',
    whatsapp: '+213 550 11 22 33',
    email: 'contact@promotion-zahra.dz',
    dateCreated: '2026-07-30',
    durationDays: 30,
    clicksCount: 42
  },
  {
    id: 'ad-default-2',
    advertiserRole: 'Agence Immobilière',
    companyName: 'Agence Immobilière Al Badr Prestige',
    title: 'Sélection Exclusive : Villas de Luxe & Penthouse Vue Mer à Akid Lotfi',
    wilaya: 'Oran',
    commune: 'Akid Lotfi',
    tag: 'Mandat Exclusif Notarié',
    bannerImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    description: 'Agence agréée par l’État. Estimation et accompagnement juridique pour l’achat et la vente de prestige à Oran.',
    phone: '+213 550 44 55 66',
    whatsapp: '+213 550 44 55 66',
    email: 'contact@albadr-immo.dz',
    dateCreated: '2026-07-31',
    durationDays: 30,
    clicksCount: 29
  }
];

interface AdBannerSectionProps {
  onOpenFreeAdModal: () => void;
}

export const AdBannerSection: React.FC<AdBannerSectionProps> = ({ onOpenFreeAdModal }) => {
  const { showToast } = usePropertyContext();
  const [ads, setAds] = useState<FreeAdCampaign[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('immowin_free_ads');
    if (saved) {
      try {
        const parsed: FreeAdCampaign[] = JSON.parse(saved);
        setAds([...parsed, ...DEFAULT_FEATURED_ADS]);
      } catch (e) {
        setAds(DEFAULT_FEATURED_ADS);
      }
    } else {
      setAds(DEFAULT_FEATURED_ADS);
    }
  }, []);

  if (ads.length === 0) return null;

  const activeAd = ads[currentIndex % ads.length];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ads.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
  };

  const handleContactWhatsApp = (whatsappNum: string, adTitle: string) => {
    const cleanNum = whatsappNum.replace(/\s+/g, '').replace('+', '');
    const msg = encodeURIComponent(`Bonjour, je vous contacte depuis la bannière publicitaire ImmoWin concernant : "${adTitle}".`);
    window.open(`https://wa.me/${cleanNum}?text=${msg}`, '_blank');
    showToast("Ouverture de WhatsApp avec l'agence/promoteur...");
  };

  return (
    <div className="w-full my-6 font-sans">
      <div className="relative rounded-3xl overflow-hidden shadow-xl bg-slate-950 border border-slate-800 text-white group">
        
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={activeAd.bannerImage}
            alt={activeAd.title}
            className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/40" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="space-y-3 max-w-2xl">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 flex items-center gap-1 shadow-md">
                <Megaphone className="w-3 h-3 stroke-[2.5]" />
                <span>Publicité Sponsorisée Offerte</span>
              </span>

              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {activeAd.advertiserRole}
              </span>

              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-slate-200 backdrop-blur-xs">
                {activeAd.tag}
              </span>
            </div>

            {/* Title & Advertiser */}
            <div>
              <h3 className="text-lg sm:text-2xl font-black text-white leading-tight font-outfit">
                {activeAd.title}
              </h3>
              <p className="text-xs text-amber-300 font-bold mt-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span>{activeAd.companyName} • {activeAd.commune}, {activeAd.wilaya}</span>
              </p>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
              {activeAd.description}
            </p>
          </div>

          {/* Action & Publisher CTA */}
          <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-3 w-full md:w-auto shrink-0">
            <div className="flex items-center gap-2">
              <span dir="ltr" className="font-mono text-xs font-bold text-emerald-300 bg-slate-900 px-3 py-2 rounded-xl border border-emerald-500/30">
                {activeAd.whatsapp}
              </span>

              <button
                onClick={() => handleContactWhatsApp(activeAd.whatsapp, activeAd.title)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white shrink-0" />
                <span>WhatsApp</span>
              </button>
            </div>

            <button
              onClick={onOpenFreeAdModal}
              className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-[11px] font-bold backdrop-blur-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              title="Publiez gratuitement la bannière de votre agence ou promotion VEFA sur ImmoWin"
            >
              <Gift className="w-3.5 h-3.5 text-amber-300" />
              <span>Publier une Pub Gratuite (0 DZD)</span>
            </button>
          </div>

        </div>

        {/* Navigation Controls if multiple ads */}
        {ads.length > 1 && (
          <div className="relative z-10 bg-slate-900/90 border-t border-slate-800/80 px-6 py-2.5 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-semibold text-slate-300">
                Bannière {currentIndex + 1} sur {ads.length} • Publicité offerte 30 jours pour Agences & Promoteurs
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handlePrev}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

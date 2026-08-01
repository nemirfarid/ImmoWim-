import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { usePropertyContext } from '../context/PropertyContext';
import { ImmoWinLogo } from './ImmoWinLogo';
import { Mail, Phone, MapPin, ShieldCheck, Search, Globe } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: 'home' | 'estimation' | 'favorites' | 'dashboard') => void;
  setViewMode: (mode: 'grid' | 'map') => void;
  onOpenFreeAdModal?: () => void;
  onOpenLegalSitemap?: (tab: 'legal' | 'sitemap') => void;
}

export const Footer: React.FC<FooterProps> = ({
  setCurrentTab,
  setViewMode,
  onOpenFreeAdModal,
  onOpenLegalSitemap
}) => {
  const { language } = useLanguage();
  const { setFilters, showToast } = usePropertyContext();

  const topSeoKeywords = [
    { label: 'Immobilier Alger Hydra', wilaya: 'Alger' },
    { label: 'Vente Villa Oran Akid Lotfi', wilaya: 'Oran', type: 'Villa' },
    { label: 'Appartement F4 Constantine', wilaya: 'Constantine', type: 'Appartement' },
    { label: 'Location Sétif Tandja', wilaya: 'Sétif' },
    { label: 'Promoteur VEFA Annaba', wilaya: 'Annaba' },
    { label: 'Terrain Constructible Blida', wilaya: 'Blida', type: 'Terrain' },
    { label: 'Acte Notarié Livret Foncier', wilaya: '' },
    { label: 'Prix Mètre Carré DZD', action: 'estimation' },
    { label: 'Espace Agence Immobilière Pro', action: 'vefa' }
  ];

  const handleWilayaClick = (e: React.MouseEvent, wilayaName: string) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, wilaya: wilayaName }));
    setCurrentTab('home');
    setViewMode('grid');
    showToast(`Filtre appliqué : Immobilier à ${wilayaName}`);
    const el = document.getElementById('search-listings-grid');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCategoryClick = (e: React.MouseEvent, type: string) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, propertyType: type }));
    setCurrentTab('home');
    setViewMode('grid');
    showToast(`Filtre appliqué : ${type}s`);
    const el = document.getElementById('search-listings-grid');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              className="cursor-pointer group inline-block"
              onClick={() => { setCurrentTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              <ImmoWinLogo size="md" variant="full" lightMode={true} />
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm ltr:text-left rtl:text-right">
              {language === 'AR'
                ? 'المنصة العقارية الأولى في الجزائر للتقييم، البيع، الكراء والتسويق العقاري. معاملات موثقة 100% بالدينار الجزائري (DZD).'
                : language === 'EN'
                ? 'The #1 platform in Algeria for valuation, sale, rental, and real estate marketing. 100% certified transactions in Algerian Dinars (DZD).'
                : 'La plateforme SaaS numéro 1 en Algérie pour l\'estimation, la vente, la location et la prospection immobilière. Transactions certifiées en Dinars Algériens (DZD).'}
            </p>

            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{language === 'AR' ? 'عقارات موثقة (عقد توثيقي ودفتر عقاري)' : 'Biens notariés garantis (Acte & Livret Foncier)'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-sky-400 font-semibold">
                <Globe className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{language === 'AR' ? 'محتوى معتمد ومؤرشف على جوجل' : 'Indexation Googlebot & Search Console Vitesse HD'}</span>
              </div>
            </div>
          </div>

          {/* Wilayas Principales SEO */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider font-outfit">
              {language === 'AR' ? 'الأسواق العقارية الإقليمية' : 'Marchés Régionaux SEO'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><button onClick={(e) => handleWilayaClick(e, 'Alger')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left rtl:text-right w-full">{language === 'AR' ? 'عقارات الجزائر العاصمة (حيدرة، دالي إبراهيم)' : 'Immobilier Alger (Hydra, Dely Ibrahim)'}</button></li>
              <li><button onClick={(e) => handleWilayaClick(e, 'Oran')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left rtl:text-right w-full">{language === 'AR' ? 'عقارات وهران (عقيد لطفي، السنية)' : 'Immobilier Oran (Akid Lotfi, Senia)'}</button></li>
              <li><button onClick={(e) => handleWilayaClick(e, 'Constantine')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left rtl:text-right w-full">{language === 'AR' ? 'عقارات قسنطينة' : 'Immobilier Constantine (Ziadia)'}</button></li>
              <li><button onClick={(e) => handleWilayaClick(e, 'Sétif')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left rtl:text-right w-full">{language === 'AR' ? 'عقارات سطيف (العلمة)' : 'Immobilier Sétif (El Eulma)'}</button></li>
              <li><button onClick={(e) => handleWilayaClick(e, 'Annaba')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left rtl:text-right w-full">{language === 'AR' ? 'عقارات عنابة (سرايدي)' : 'Immobilier Annaba (Seraidi)'}</button></li>
            </ul>
          </div>

          {/* Services & Types de Biens */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider font-outfit">Catégories Référencées</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button 
                  onClick={() => { setCurrentTab('estimation'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Estimation Immobilière IA DZD
                </button>
              </li>
              <li>
                <button 
                  onClick={(e) => handleCategoryClick(e, 'Appartement')} 
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Appartements F3 & F4 de Standing
                </button>
              </li>
              <li>
                <button 
                  onClick={(e) => handleCategoryClick(e, 'Villa')} 
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Villas avec Piscine & Jardin
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { if (onOpenFreeAdModal) onOpenFreeAdModal(); }} 
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left text-amber-300 font-semibold"
                >
                  Projets Neufs Promoteurs VEFA (0 DZD)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentTab('home'); setViewMode('map'); const el = document.getElementById('search-listings-grid'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} 
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Carte Interactive & GPS Exact
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider font-outfit">
              {language === 'AR' ? 'الدعم والاتصال الفني' : 'Support & Contact Direct'}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <a href="tel:+213773474096" className="hover:text-emerald-400 font-bold font-mono text-emerald-400">+213 773 47 40 96</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <a href="mailto:contact@immowin.dz" className="hover:text-emerald-400 font-mono">contact@immowin.dz</a>
              </li>
              <li className="pt-1">
                <a
                  href="https://wa.me/213773474096"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-[11px] hover:bg-emerald-500/20 transition-all"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{language === 'AR' ? 'واتساب مباشر: +213 773 47 40 96' : 'WhatsApp Direct : +213 773 47 40 96'}</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* SEO Keywords Tag Cloud Bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <Search className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mots-clés les plus recherchés sur Google Algérie :</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {topSeoKeywords.map((kw, i) => (
              <button
                key={i}
                onClick={() => {
                  if (kw.action === 'estimation') {
                    setCurrentTab('estimation');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else if (kw.action === 'vefa' && onOpenFreeAdModal) {
                    onOpenFreeAdModal();
                  } else if (kw.wilaya) {
                    setFilters(prev => ({
                      ...prev,
                      wilaya: kw.wilaya,
                      propertyType: kw.type || prev.propertyType
                    }));
                    setCurrentTab('home');
                    setViewMode('grid');
                    const el = document.getElementById('search-listings-grid');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 text-[11px] font-medium border border-slate-800 transition-colors cursor-pointer"
              >
                {kw.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 ImmoWin SaaS Algérie. Optimisé Ordinateur Portable, PC & Smartphone.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => { if (onOpenLegalSitemap) onOpenLegalSitemap('legal'); }}
              className="hover:underline text-slate-400 hover:text-white cursor-pointer"
            >
              Mentions Légales
            </button>
            <span>•</span>
            <button
              onClick={() => { if (onOpenLegalSitemap) onOpenLegalSitemap('sitemap'); }}
              className="hover:underline text-slate-400 hover:text-white cursor-pointer"
            >
              Sitemap XML Google
            </button>
            <span>•</span>
            <span className="text-emerald-500 font-bold">100% Monnaie DZD</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

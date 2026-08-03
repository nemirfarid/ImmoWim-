import React, { useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { PropertyProvider, usePropertyContext } from './context/PropertyContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FilterBar } from './components/FilterBar';
import { PropertyCard } from './components/PropertyCard';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { AddPropertyModal } from './components/AddPropertyModal';
import { CriteriaAlertModal } from './components/CriteriaAlertModal';
import { EstimationWizard } from './components/EstimationWizard';
import { AuthModal } from './components/AuthModal';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { AiCopilotWidget } from './components/AiCopilotWidget';
import { OutreachGeneratorModal } from './components/OutreachGeneratorModal';
import { Footer } from './components/Footer';
import { SEO } from './components/SEO';
import { InteractiveMap } from './components/InteractiveMap';
import { MobileBottomNav } from './components/MobileBottomNav';
import { FreeAdModal } from './components/FreeAdModal';
import { AdBannerSection } from './components/AdBannerSection';
import { SellersBuyersHub } from './components/SellersBuyersHub';
import { LegalSitemapModal } from './components/LegalSitemapModal';
import { PromoterInvitationModal } from './components/PromoterInvitationModal';
import { PotentialBuyersBanner } from './components/PotentialBuyersBanner';
import { DiasporaBanner } from './components/DiasporaBanner';
import { Building2, Heart, Search, Sparkles, Filter, X, LayoutGrid, Map as MapIcon } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { t, language } = useLanguage();
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [isOutreachModalOpen, setIsOutreachModalOpen] = useState(false);
  const [isFreeAdModalOpen, setIsFreeAdModalOpen] = useState(false);
  const [isPromoterModalOpen, setIsPromoterModalOpen] = useState(false);
  const [legalModalState, setLegalModalState] = useState<{ open: boolean; tab: 'legal' | 'sitemap' }>({
    open: false,
    tab: 'legal'
  });
  const {
    filteredProperties,
    selectedProperty,
    setSelectedProperty,
    favorites,
    toastMessage,
    resetFilters,
    filters,
    isCriteriaModalOpen,
    setIsCriteriaModalOpen,
    setIsAddModalOpen,
    isSmartImporterOpen,
    setIsSmartImporterOpen
  } = usePropertyContext();

  const [currentTab, setCurrentTab] = useState<'home' | 'estimation' | 'favorites' | 'dashboard'>('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Compute dynamic SEO metadata depending on current tab and filter state
  const getPageSEO = () => {
    if (currentTab === 'estimation') {
      return {
        title: language === 'AR'
          ? 'تقييم العقارات بالذكاء الاصطناعي في الجزائر | ImmoWin'
          : language === 'EN'
          ? 'AI Real Estate Valuation in Algeria (DZD) | ImmoWin'
          : 'Estimation Immobilière IA en Algérie (DZD) - Calculateur de Valeur | ImmoWin',
        description: language === 'AR'
          ? 'احسب تقييم عقاراتك فوريًا ومجانًا للشقق، الفيلات، الأراضي والمحلات بالدينار الجزائري وفقًا لاتجاهات السوق المحلية.'
          : language === 'EN'
          ? 'Calculate instant free property valuation for apartments, villas, plots, and commercial spaces in Algerian Dinars (DZD) tailored to local market trends.'
          : 'Estimez gratuitement et en temps réel la valeur de votre bien immobilier en Dinar Algérien (DZD) selon la Wilaya, commune et finitions.',
        keywords: 'estimation immobilière Algérie, تقييم عقاري, أسعار الشقق الجزائر, سعر المتر دج, cote immobiliere algerie',
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          'name': 'ImmoWin Estimateur Immobilier IA',
          'applicationCategory': 'RealEstateApplication',
          'operatingSystem': 'Web'
        }
      };
    }

    if (currentTab === 'favorites') {
      return {
        title: language === 'AR'
          ? `عقاراتي المفضلة المحفوظة (${favorites.length}) | ImmoWin`
          : language === 'EN'
          ? `My Saved Favorite Properties (${favorites.length}) | ImmoWin`
          : `Mes Biens Immobiliers Favoris (${favorites.length}) | ImmoWin`,
        description: language === 'AR'
          ? `استعرض وقارن عقاراتك المفضلة المحفوظة (${favorites.length}) بالدينار الجزائري.`
          : language === 'EN'
          ? `View and compare your ${favorites.length} saved property listings in Algerian Dinars (DZD).`
          : `Consultez et comparez vos ${favorites.length} annonces immobilières favorites d'exception en Dinars Algériens (DZD).`,
        noindex: true
      };
    }

    if (currentTab === 'dashboard') {
      return {
        title: language === 'AR'
          ? 'لوحة تحكم المحترفين وإحصائيات السوق | ImmoWin'
          : language === 'EN'
          ? 'Pro Dashboard & Real Estate Market Analytics | ImmoWin'
          : 'Tableau de Bord Pro - CRM & Statistiques du Marché | ImmoWin',
        description: 'فضاء إدارة المحترفين، متابعة محفظة العقارات، إدارة الزبائن وتحليل اتجاهات الأسعار في الجزائر.',
        noindex: true
      };
    }

    // Default Home tab with dynamic filter parameters!
    const filterParts: string[] = [];
    if (filters.propertyType) {
      filterParts.push(filters.propertyType + 's');
    } else {
      filterParts.push(language === 'AR' ? 'العقارات' : language === 'EN' ? 'Properties' : 'Biens Immobiliers');
    }

    if (filters.transactionType === 'Vente') {
      filterParts.push(language === 'AR' ? 'للبيع' : language === 'EN' ? 'for Sale' : 'à Vendre');
    } else if (filters.transactionType === 'Location') {
      filterParts.push(language === 'AR' ? 'للإيجار' : language === 'EN' ? 'for Rent' : 'en Location');
    }

    if (filters.wilaya) {
      filterParts.push(`${language === 'AR' ? 'في' : language === 'EN' ? 'in' : 'à'} ${filters.wilaya}`);
    } else {
      filterParts.push(language === 'AR' ? 'في الجزائر' : language === 'EN' ? 'in Algeria' : 'en Algérie');
    }

    const headingText = filterParts.join(' ');
    const title = `${headingText} (DZD) | ImmoWin Algérie`;
    const description = language === 'AR'
      ? `اكتشف ${filteredProperties.length} إعلانًا موثوقًا لـ ${headingText.toLowerCase()} بالدينار الجزائري مع عقود موثقة ودفتر عقاري.`
      : language === 'EN'
      ? `Discover ${filteredProperties.length} verified ${headingText.toLowerCase()} priced in Algerian Dinars (DZD) with official land registry title deeds.`
      : `Trouvez parmi ${filteredProperties.length} annonces vérifiées de ${headingText.toLowerCase()} en Dinars Algériens (DZD) avec acte et livret foncier.`;
    const keywords = `immobilier ${filters.wilaya || 'Algérie'}, عقارات ${filters.wilaya || 'الجزائر'}, ${filters.propertyType || 'appartement villa'} ${filters.wilaya || 'Alger Oran'}, vente location DZD, acte notarié`;

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'ImmoWin Algérie',
      'url': typeof window !== 'undefined' ? window.location.href : 'https://immowin.dz',
      'description': description
    };

    return { title, description, keywords, structuredData };
  };

  const seoData = getPageSEO();

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      
      {/* Dynamic SEO Head Manager */}
      {!selectedProperty && (
        <SEO
          title={seoData.title}
          description={seoData.description}
          keywords={seoData.keywords}
          noindex={seoData.noindex}
          structuredData={seoData.structuredData}
        />
      )}
      
      {/* Global Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold font-outfit">{toastMessage}</span>
        </div>
      )}

      {/* Global Modals */}
      <AddPropertyModal />
      <FreeAdModal
        isOpen={isFreeAdModalOpen}
        onClose={() => setIsFreeAdModalOpen(false)}
      />
      <PromoterInvitationModal
        isOpen={isPromoterModalOpen}
        onClose={() => setIsPromoterModalOpen(false)}
      />
      {isCriteriaModalOpen && (
        <CriteriaAlertModal onClose={() => setIsCriteriaModalOpen(false)} />
      )}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccessDashboard={() => setCurrentTab('dashboard')}
      />
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}

      {/* Main Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenOutreachModal={() => setIsOutreachModalOpen(true)}
        onOpenFreeAdModal={() => setIsFreeAdModalOpen(true)}
        onOpenPromoterModal={() => setIsPromoterModalOpen(true)}
        onOpenSmartImporter={() => setIsSmartImporterOpen(true)}
      />

      {/* MAIN VIEWPORT SWITCHER */}
      <div className="flex-1">
        
        {/* TAB 1: PUBLIC HOMEPAGE & SEARCH */}
        {currentTab === 'home' && (
          <main className="space-y-12 pb-16">
            
            {/* Hero Section */}
            <Hero
              onEstimateClick={() => setCurrentTab('estimation')}
              onExploreClick={() => {
                const searchEl = document.getElementById('search-listings-grid');
                searchEl?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenAddProperty={() => setIsAddModalOpen(true)}
              onOpenCriteriaModal={() => setIsCriteriaModalOpen(true)}
              onOpenSmartImporter={() => setIsSmartImporterOpen(true)}
            />

            {/* Special Diaspora Algérienne Banner Hub - Top Visibility */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <DiasporaBanner />
            </div>

            {/* Filter Bar Component */}
            <FilterBar />

            {/* Sellers & Buyers Hub on Homepage */}
            <SellersBuyersHub
              onOpenCriteriaModal={() => setIsCriteriaModalOpen(true)}
              onOpenPromoterModal={() => setIsPromoterModalOpen(true)}
              onOpenSmartImporter={() => setIsSmartImporterOpen(true)}
            />

            {/* Listings Section */}
            <section id="search-listings-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
              
              {/* Special Diaspora Algérienne Banner Hub */}
              <DiasporaBanner />

              {/* Promotional Free Ad Banners for Agences & Promoteurs */}
              <AdBannerSection onOpenFreeAdModal={() => setIsFreeAdModalOpen(true)} />

              {/* Listings Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit">
                      {t.listingsTitle}
                    </h2>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {filteredProperties.length} {filteredProperties.length > 1 ? t.listingsCountMany : t.listingsCountOne}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    {t.listingsSubtitle}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* View Mode Toggle Controls */}
                  <div className="bg-slate-200/70 p-1 rounded-2xl flex items-center border border-slate-200 shadow-inner">
                    <button
                      type="button"
                      onClick={() => setViewMode('grid')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        viewMode === 'grid'
                          ? 'bg-white text-slate-900 shadow-md border border-slate-200'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span>{t.viewGrid}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('map')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        viewMode === 'map'
                          ? 'bg-slate-900 text-white shadow-md'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <MapIcon className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{t.viewMap}</span>
                    </button>
                  </div>

                  <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-extrabold text-emerald-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
                      {t.currencyDZD}
                    </span>
                  </div>
                </div>
              </div>

              {/* Listings Display: Map vs Grid */}
              {filteredProperties.length > 0 ? (
                viewMode === 'map' ? (
                  <InteractiveMap
                    properties={filteredProperties}
                    onSelectProperty={setSelectedProperty}
                    height="620px"
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProperties.map(property => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        onSelect={setSelectedProperty}
                      />
                    ))}
                  </div>
                )
              ) : (
                /* Empty state */
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs max-w-lg mx-auto space-y-4">
                  <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{t.noResultsTitle}</h3>
                  <p className="text-xs text-slate-500">{t.noResultsDesc}</p>
                  <button
                    onClick={resetFilters}
                    className="px-6 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-md cursor-pointer hover:bg-slate-800 transition-colors"
                  >
                    {t.filterReset}
                  </button>
                </div>
              )}

            </section>

          </main>
        )}

        {/* TAB 2: INTERACTIVE PROPERTY ESTIMATION MODULE */}
        {currentTab === 'estimation' && (
          <main className="py-6">
            <EstimationWizard />
          </main>
        )}

        {/* TAB 3: FAVORITES VIEW */}
        {currentTab === 'favorites' && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit flex items-center gap-3">
                <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
                <span>Mes Biens Immobiliers Favoris</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Vos annonces d'exception enregistrées en Dinars Algériens (DZD)
              </p>
            </div>

            {favorites.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {favorites.map(property => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onSelect={setSelectedProperty}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Aucun favori pour l'instant</h3>
                <p className="text-xs text-slate-500">
                  Cliquez sur le cœur d'une annonce pour la retrouver facilement ici à tout moment.
                </p>
                <button
                  onClick={() => setCurrentTab('home')}
                  className="px-6 py-2.5 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-md cursor-pointer hover:bg-emerald-700 transition-colors"
                >
                  Explorer les Annonces
                </button>
              </div>
            )}
          </main>
        )}

        {/* TAB 4: AGENT / ADMINISTRATOR DASHBOARD */}
        {currentTab === 'dashboard' && (
          <DashboardLayout onSelectTab={(tab) => setCurrentTab(tab)} />
        )}

      </div>

      {/* Main Footer (shown except in dashboard) */}
      {currentTab !== 'dashboard' && (
        <Footer
          setCurrentTab={setCurrentTab}
          setViewMode={setViewMode}
          onOpenFreeAdModal={() => setIsFreeAdModalOpen(true)}
          onOpenLegalSitemap={(tab) => setLegalModalState({ open: true, tab })}
        />
      )}

      {/* Global Legal & Sitemap Modal */}
      <LegalSitemapModal
        isOpen={legalModalState.open}
        initialTab={legalModalState.tab}
        onClose={() => setLegalModalState(prev => ({ ...prev, open: false }))}
      />

      {/* Global Floating AI Copilot Widget */}
      <AiCopilotWidget />

      {/* Global Outreach & Recruitment Modal */}
      <OutreachGeneratorModal
        isOpen={isOutreachModalOpen}
        onClose={() => setIsOutreachModalOpen(false)}
      />

      {/* Mobile Bottom Dock Bar */}
      <MobileBottomNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

    </div>
  );
};

export function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <PropertyProvider>
          <MainAppContent />
        </PropertyProvider>
      </LanguageProvider>
    </HelmetProvider>
  );
}

export default App;

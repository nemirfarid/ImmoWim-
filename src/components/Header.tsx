import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { usePropertyContext } from '../context/PropertyContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ImmoWinLogo } from './ImmoWinLogo';
import { Heart, PlusCircle, LayoutDashboard, Home, Calculator, UserCheck, LogIn, Menu, X, Zap, MessageCircle, Megaphone, Building2, Bot } from 'lucide-react';

interface HeaderProps {
  currentTab: 'home' | 'estimation' | 'favorites' | 'dashboard';
  setCurrentTab: (tab: 'home' | 'estimation' | 'favorites' | 'dashboard') => void;
  onOpenAuth: () => void;
  onOpenOutreachModal?: () => void;
  onOpenFreeAdModal?: () => void;
  onOpenPromoterModal?: () => void;
  onOpenSmartImporter?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setCurrentTab, onOpenAuth, onOpenOutreachModal, onOpenFreeAdModal, onOpenPromoterModal, onOpenSmartImporter }) => {
  const { language, t } = useLanguage();
  const { favoritesCount, setIsAddModalOpen, userRole, setUserRole, setIsCriteriaModalOpen, unreadNotificationsCount } = usePropertyContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Main Logo & Menu Trigger Button (Clicking logo opens menu) */}
          <div 
            id="main-logo-menu-trigger"
            className="cursor-pointer group flex items-center gap-2 p-1 rounded-2xl hover:bg-slate-100/80 transition-all" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            title="Menu Principal ImmoWin"
          >
            <ImmoWinLogo size="md" variant="full" />
            <span className="text-xs text-slate-400 group-hover:text-emerald-600 transition-colors">
              {mobileMenuOpen ? '▲' : '▼'}
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/60">
            <button
              id="nav-home-btn"
              onClick={() => setCurrentTab('home')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentTab === 'home'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Home className="w-4 h-4 text-emerald-600" />
              <span>{t.navHome}</span>
            </button>

            <button
              id="nav-estimation-btn"
              onClick={() => setCurrentTab('estimation')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentTab === 'estimation'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Calculator className="w-4 h-4 text-emerald-600" />
              <span>{t.navEstimation}</span>
              <span className="px-1.5 py-0.2 text-[9px] font-bold bg-amber-100 text-amber-800 rounded-full">
                IA
              </span>
            </button>

            <button
              id="nav-favorites-btn"
              onClick={() => setCurrentTab('favorites')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer relative ${
                currentTab === 'favorites'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Heart className={`w-4 h-4 ${favoritesCount > 0 ? 'text-rose-500 fill-rose-500' : 'text-slate-500'}`} />
              <span>{t.navFavorites}</span>
              {favoritesCount > 0 && (
                <span className="ml-1 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {favoritesCount}
                </span>
              )}
            </button>

            <button
              id="nav-dashboard-btn"
              onClick={() => setCurrentTab('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentTab === 'dashboard'
                  ? 'bg-slate-900 text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              <span>{t.navDashboard}</span>
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            <LanguageSwitcher />

            {/* Alert Network CTA Button */}
            <button
              id="header-alert-matching-btn"
              onClick={() => setIsCriteriaModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs transition-all cursor-pointer relative active:scale-95"
              title="Alerte Critères / Instant Matching"
            >
              <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
              <span className="hidden sm:inline">
                {t.headerAlerts}
              </span>
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Outreach Recruitment Button */}
            {onOpenOutreachModal && (
              <button
                id="header-outreach-recruitment-btn"
                onClick={onOpenOutreachModal}
                className="hidden xl:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700 shadow-xs transition-all cursor-pointer active:scale-95"
                title="Messages Prospection"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>{t.headerInvite}</span>
              </button>
            )}

            {/* Promoter Invitation Button */}
            {onOpenPromoterModal && (
              <button
                id="header-promoter-invite-btn"
                onClick={onOpenPromoterModal}
                className="hidden xl:flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-black bg-amber-950 hover:bg-slate-900 text-amber-300 border border-amber-500/40 shadow-xs transition-all cursor-pointer active:scale-95"
                title="Espace & Invitation Promoteurs Immobiliers"
              >
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>{language === 'AR' ? 'دعوة المرقين العقاريين' : 'Promoteurs VEFA'}</span>
              </button>
            )}

            {/* Free Ad Campaign Button for Agences & Promoteurs */}
            {onOpenFreeAdModal && (
              <button
                id="header-free-ad-btn"
                onClick={onOpenFreeAdModal}
                className="hidden lg:flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 shadow-md transition-all cursor-pointer active:scale-95"
                title="Publicité Gratuite"
              >
                <Megaphone className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                <span>{t.headerFreeAd}</span>
              </button>
            )}

            {/* Smart Importer & Daily Bot Button */}
            {onOpenSmartImporter && (
              <button
                id="header-smart-importer-btn"
                onClick={onOpenSmartImporter}
                className="hidden md:flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-black bg-emerald-950 hover:bg-slate-900 text-emerald-300 border border-emerald-500/50 shadow-md transition-all cursor-pointer active:scale-95"
                title="Importer des annonces & Bot Automatique"
              >
                <Bot className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>{language === 'AR' ? 'استيراد الأعلانات وتحديثها' : 'Importer & Bot Auto'}</span>
              </button>
            )}

            {/* Add property CTA */}
            <button
              id="header-add-property-btn"
              onClick={() => setIsAddModalOpen(true)}
              className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.navAddProperty}</span>
            </button>

            {/* Login / Pro switch button */}
            {userRole === 'agent' ? (
              <button
                id="header-agent-badge-btn"
                onClick={() => setUserRole('public')}
                className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
                title="Mode Agent Actif"
              >
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>{t.headerAgentPro}</span>
              </button>
            ) : (
              <button
                id="header-login-btn"
                onClick={onOpenAuth}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all cursor-pointer shadow-xs"
              >
                <LogIn className="w-4 h-4 text-slate-300" />
                <span>{t.navLogin}</span>
              </button>
            )}
          </div>
        </div>

        {/* Menu dropdown toggled by main logo click */}
        {mobileMenuOpen && (
          <div className="py-4 border-t border-slate-100 space-y-2 animate-in fade-in slide-in-from-top-2">
            <button
              onClick={() => { setCurrentTab('home'); setMobileMenuOpen(false); }}
              className={`w-full text-left rtl:text-right px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 ${
                currentTab === 'home' ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700'
              }`}
            >
              <Home className="w-5 h-5 text-emerald-600" />
              <span>{t.navHome}</span>
            </button>

            <button
              onClick={() => { setCurrentTab('estimation'); setMobileMenuOpen(false); }}
              className={`w-full text-left rtl:text-right px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 ${
                currentTab === 'estimation' ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700'
              }`}
            >
              <Calculator className="w-5 h-5 text-emerald-600" />
              <span>{t.navEstimation}</span>
            </button>

            <button
              onClick={() => { setCurrentTab('favorites'); setMobileMenuOpen(false); }}
              className={`w-full text-left rtl:text-right px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between ${
                currentTab === 'favorites' ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-rose-500" />
                <span>{t.navFavorites}</span>
              </div>
              {favoritesCount > 0 && (
                <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {favoritesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => { setCurrentTab('dashboard'); setMobileMenuOpen(false); }}
              className={`w-full text-left rtl:text-right px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 ${
                currentTab === 'dashboard' ? 'bg-slate-900 text-white font-bold' : 'text-slate-700'
              }`}
            >
              <LayoutDashboard className="w-5 h-5 text-emerald-400" />
              <span>{t.navDashboard}</span>
            </button>

            <div className="pt-2 flex flex-col gap-2 px-2">
              {onOpenSmartImporter && (
                <button
                  onClick={() => { onOpenSmartImporter(); setMobileMenuOpen(false); }}
                  className="w-full py-3 rounded-xl text-sm font-black bg-emerald-950 text-emerald-300 border border-emerald-500/50 flex items-center justify-center gap-2 shadow-md"
                >
                  <Bot className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span>{language === 'AR' ? 'استيراد الأعلانات وتحديثها' : 'Importer Annonces & Bot Daily'}</span>
                </button>
              )}
              {onOpenFreeAdModal && (
                <button
                  onClick={() => { onOpenFreeAdModal(); setMobileMenuOpen(false); }}
                  className="w-full py-3 rounded-xl text-sm font-black bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center gap-2 shadow-md"
                >
                  <Megaphone className="w-4 h-4 stroke-[2.5]" />
                  <span>{t.headerFreeAd}</span>
                </button>
              )}
              <button
                onClick={() => { setIsAddModalOpen(true); setMobileMenuOpen(false); }}
                className="w-full py-3 rounded-xl text-sm font-bold bg-emerald-600 text-white text-center shadow-sm"
              >
                + {t.navAddProperty}
              </button>
              <button
                onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
                className="w-full py-3 rounded-xl text-sm font-bold bg-slate-900 text-white text-center"
              >
                {t.navLogin}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

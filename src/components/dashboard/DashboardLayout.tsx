import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { usePropertyContext } from '../../context/PropertyContext';
import { OverviewTab } from './OverviewTab';
import { PropertyManagementTab } from './PropertyManagementTab';
import { LeadsCRMTab } from './LeadsCRMTab';
import { AnalyticsTab } from './AnalyticsTab';
import { AiManagementTab } from './AiManagementTab';
import { LayoutDashboard, Building2, Users, LineChart, PlusCircle, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';

interface DashboardLayoutProps {
  onSelectTab?: (tab: 'home' | 'estimation' | 'favorites' | 'dashboard') => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onSelectTab }) => {
  const { t, language } = useLanguage();
  const { setIsAddModalOpen, setUserRole } = usePropertyContext();

  const [activeTab, setActiveTab] = useState<'overview' | 'ai' | 'properties' | 'leads' | 'analytics'>('ai');

  const navItems = [
    { id: 'ai', label: "Co-Pilote IA & Rôles", icon: Sparkles },
    { id: 'overview', label: "Vue d'ensemble", icon: LayoutDashboard },
    { id: 'properties', label: "Gestion des Biens", icon: Building2 },
    { id: 'leads', label: "Leads & Clients CRM", icon: Users },
    { id: 'analytics', label: "Statistiques & Marché", icon: LineChart }
  ] as const;

  const handleReturnPublic = () => {
    setUserRole('public');
    if (onSelectTab) {
      onSelectTab('home');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 pb-16">
      
      {/* Top Banner Bar for Agent Mode */}
      <div className="bg-slate-900 text-white px-4 py-2.5 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-bold">Espace Administrateur Pro ImmoWin Algérie</span>
          <span className="hidden sm:inline text-slate-400 font-normal">| Devise active: DZD</span>
        </div>

        {/* Quick Exit & Navigation Choices from Dashboard */}
        <div className="flex items-center gap-2">
          {onSelectTab && (
            <button
              onClick={() => onSelectTab('home')}
              className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 border border-slate-700"
            >
              <span>🏠 Voir les Annonces</span>
            </button>
          )}

          <button
            onClick={handleReturnPublic}
            className="text-[11px] font-extrabold text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer bg-slate-800/80 px-3 py-1 rounded-xl border border-amber-500/30"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'AR' ? 'الخروج والعودة للموقع' : 'Fermer le Tableau de Bord'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Direct Destination Quick Bar */}
        <div className="mb-6 p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-outfit">
              {language === 'AR' ? 'الانتقال المباشر من لوحة التحكم:' : 'Accès Direct depuis le Tableau de Bord :'}
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              {language === 'AR' ? 'انقر على أي خيار لإغلاق لوحة التحكم والانتقال فوراً للصفحة المطلوب' : 'Cliquez sur un choix pour fermer le tableau de bord et naviguer directement.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {onSelectTab && (
              <>
                <button
                  onClick={() => onSelectTab('home')}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 font-bold text-xs border border-slate-200 transition-colors cursor-pointer"
                >
                  🏠 {language === 'AR' ? 'قائمة العقارات' : 'Annonces Immobilier'}
                </button>
                <button
                  onClick={() => onSelectTab('estimation')}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 font-bold text-xs border border-slate-200 transition-colors cursor-pointer"
                >
                  🧮 {language === 'AR' ? 'حاسبة التقييم' : 'Calculateur IA'}
                </button>
                <button
                  onClick={() => onSelectTab('favorites')}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-800 hover:text-rose-600 font-bold text-xs border border-slate-200 transition-colors cursor-pointer"
                >
                  ❤️ {language === 'AR' ? 'المفضلة' : 'Favoris'}
                </button>
              </>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* PERSISTENT LEFT SIDEBAR */}
          <aside className="lg:col-span-3 bg-white rounded-3xl p-5 border border-slate-100 shadow-xs space-y-6 sticky top-24">
            
            {/* Agent Info Profile */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                AG
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 font-outfit">Agence Hydra Immo</h4>
                <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">Agent Certifié DZD</p>
              </div>
            </div>

            {/* Sidebar Navigation */}
            <nav className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 block">
                Menu Principal
              </span>

              {navItems.map(item => (
                <button
                  key={item.id}
                  id={`dash-side-nav-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                    activeTab === item.id
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Quick Publish CTA */}
            <div className="pt-4 border-t border-slate-100">
              <button
                id="dash-add-property-sidebar-btn"
                onClick={() => setIsAddModalOpen(true)}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publier un Bien (DZD)</span>
              </button>
            </div>

          </aside>

          {/* MAIN VIEWPORT CONTENT */}
          <main className="lg:col-span-9">
            {activeTab === 'ai' && (
              <AiManagementTab />
            )}
            {activeTab === 'overview' && (
              <OverviewTab onNavigateTab={(tab) => setActiveTab(tab as any)} />
            )}
            {activeTab === 'properties' && (
              <PropertyManagementTab />
            )}
            {activeTab === 'leads' && (
              <LeadsCRMTab />
            )}
            {activeTab === 'analytics' && (
              <AnalyticsTab />
            )}
          </main>

        </div>
      </div>

    </div>
  );
};

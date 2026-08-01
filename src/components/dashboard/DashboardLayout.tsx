import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { usePropertyContext } from '../../context/PropertyContext';
import { OverviewTab } from './OverviewTab';
import { PropertyManagementTab } from './PropertyManagementTab';
import { LeadsCRMTab } from './LeadsCRMTab';
import { AnalyticsTab } from './AnalyticsTab';
import { AiManagementTab } from './AiManagementTab';
import { LayoutDashboard, Building2, Users, LineChart, PlusCircle, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { t } = useLanguage();
  const { setIsAddModalOpen, setUserRole } = usePropertyContext();

  const [activeTab, setActiveTab] = useState<'overview' | 'ai' | 'properties' | 'leads' | 'analytics'>('ai');

  const navItems = [
    { id: 'ai', label: "Co-Pilote IA & Rôles", icon: Sparkles },
    { id: 'overview', label: "Vue d'ensemble", icon: LayoutDashboard },
    { id: 'properties', label: "Gestion des Biens", icon: Building2 },
    { id: 'leads', label: "Leads & Clients CRM", icon: Users },
    { id: 'analytics', label: "Statistiques & Marché", icon: LineChart }
  ] as const;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 pb-16">
      
      {/* Top Banner Bar for Agent Mode */}
      <div className="bg-slate-900 text-white px-4 py-2 text-xs flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-bold">Espace Administrateur Pro ImmoWin Algérie</span>
          <span className="hidden sm:inline text-slate-400 font-normal">| Devise active: DZD</span>
        </div>

        <button
          onClick={() => setUserRole('public')}
          className="text-[11px] font-bold text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retourner au site public</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
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

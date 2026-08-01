import React from 'react';
import { usePropertyContext } from '../../context/PropertyContext';
import { formatDZD } from '../../utils/formatters';
import { Building2, Users, TrendingUp, CheckCircle, PlusCircle, ArrowUpRight, Clock, MapPin, Eye } from 'lucide-react';

interface OverviewTabProps {
  onNavigateTab: (tab: 'properties' | 'leads' | 'analytics') => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ onNavigateTab }) => {
  const { properties, leads, setIsAddModalOpen, updateLeadStatus } = usePropertyContext();

  const totalListings = properties.length;
  const activeLeads = leads.length;
  const portfolioValueDZD = properties.reduce((acc, curr) => acc + curr.priceDZD, 0);
  const conversionRate = 18.4; // %

  const recentProperties = properties.slice(0, 4);
  const recentLeads = leads.slice(0, 4);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 text-white shadow-xl">
        <div>
          <h2 className="text-2xl font-extrabold font-outfit">Bonjour, Agent Pro ImmoWin 👋</h2>
          <p className="text-xs text-slate-300 mt-1">Voici le récapitulatif en temps réel du marché immobilier en Algérie.</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Ajouter une Annonce (DZD)</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="p-5 rounded-2xl bg-white border border-slate-100/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Biens Actifs</span>
            <span className="text-2xl font-extrabold text-slate-900 font-outfit mt-1 block">{totalListings}</span>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1">
              <ArrowUpRight className="w-3 h-3" /> +12% ce mois
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-100/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Demandes & Leads</span>
            <span className="text-2xl font-extrabold text-slate-900 font-outfit mt-1 block">{activeLeads}</span>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1">
              <ArrowUpRight className="w-3 h-3" /> +8 nouveaux
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-100/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Portefeuille Total</span>
            <span className="text-xl font-extrabold text-emerald-600 font-outfit mt-1 block">{formatDZD(portfolioValueDZD, true)}</span>
            <span className="text-[10px] text-slate-500 font-semibold mt-1 block">Valeur cumulée</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-100/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Taux de Conversion</span>
            <span className="text-2xl font-extrabold text-slate-900 font-outfit mt-1 block">{conversionRate}%</span>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1">
              <CheckCircle className="w-3 h-3" /> +2.1% vs m-1
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Two Columns: Recent Listings & Recent Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Listings */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-slate-900 font-outfit">Biens Récessent Publiés</h3>
            <button
              onClick={() => onNavigateTab('properties')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
            >
              Voir tout &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {recentProperties.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100/80 transition-colors">
                <div className="flex items-center gap-3">
                  <img src={p.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{p.title}</h4>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600" /> {p.wilaya}, {p.commune}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-extrabold text-xs text-emerald-700 block">{formatDZD(p.priceDZD, true)}</span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 justify-end">
                    <Eye className="w-3 h-3" /> {p.viewsCount} vues
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Leads */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-slate-900 font-outfit">Derniers Leads & Demandes CRM</h3>
            <button
              onClick={() => onNavigateTab('leads')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
            >
              Gérer les leads &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {recentLeads.map(l => (
              <div key={l.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="font-bold text-xs text-slate-900">{l.clientName}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                    l.status === 'nouveau' ? 'bg-blue-100 text-blue-800' :
                    l.status === 'contacte' ? 'bg-amber-100 text-amber-800' :
                    l.status === 'visite' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {l.status}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 line-clamp-1">{l.message || `Demande pour ${l.wilaya}`}</p>
                
                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {l.date}</span>
                  <button
                    onClick={() => updateLeadStatus(l.id, 'contacte')}
                    className="font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    Marquer contacté
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

import React from 'react';
import { MONTHLY_TRANSACTIONS_SERIES, PRICE_EVOLUTION_SERIES, PROPERTY_TYPE_DISTRIBUTION } from '../../data/mockData';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieIcon, DollarSign, Wallet, ArrowUpRight, Zap, Building2, UserCheck, Activity } from 'lucide-react';

const COLORS = ['#059669', '#0F172A', '#F59E0B', '#8B5CF6'];

// Mock daily automated import data for the new chart
const DAILY_AUTO_IMPORT_DATA = [
  { day: 'Lun', Ouedkniss: 42, Facebook: 35, Mubawab: 18, Lkeria: 12 },
  { day: 'Mar', Ouedkniss: 55, Facebook: 48, Mubawab: 22, Lkeria: 15 },
  { day: 'Mer', Ouedkniss: 61, Facebook: 52, Mubawab: 25, Lkeria: 19 },
  { day: 'Jeu', Ouedkniss: 70, Facebook: 64, Mubawab: 30, Lkeria: 22 },
  { day: 'Ven', Ouedkniss: 48, Facebook: 40, Mubawab: 20, Lkeria: 14 },
  { day: 'Sam', Ouedkniss: 82, Facebook: 75, Mubawab: 38, Lkeria: 28 },
  { day: 'Dim', Ouedkniss: 95, Facebook: 88, Mubawab: 45, Lkeria: 32 },
];

export const AnalyticsTab: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Analytics Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-extrabold text-xl text-slate-900 font-outfit">Tableau de Bord Financier & Analyses du Marché (ImmoWin DZD)</h3>
          <p className="text-xs text-slate-500">Chiffres d'affaires, commissions économisées et volume d'agrégation d'annonces nationales 2026</p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span>Données en temps réel (58 Wilayas)</span>
        </div>
      </div>

      {/* Financial KPI Summary Cards (Chiffre d'Affaires & Savings) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Chiffre d'Affaires Cumulé */}
        <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-2 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Chiffre d'Affaires Brut</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white font-outfit">
            48.5 B <span className="text-xs text-emerald-400 font-normal">DZD</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+24.8% ce trimestre</span>
          </div>
        </div>

        {/* KPI 2: Commissions Économisées (0% Intermédiaire) */}
        <div className="p-5 rounded-3xl bg-emerald-950 text-white space-y-2 border border-emerald-800/50 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">Commissions Économisées</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center font-bold">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white font-outfit">
            1.45 B <span className="text-xs text-emerald-300 font-normal">DZD</span>
          </div>
          <div className="text-[11px] text-emerald-200">
            Économisées par les vendeurs & acheteurs inscrits
          </div>
        </div>

        {/* KPI 3: Annonces Importées Automatiquement */}
        <div className="p-5 rounded-3xl bg-amber-950 text-white space-y-2 border border-amber-800/50 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">Imports Auto Quotidien</span>
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white font-outfit">
            1,240 <span className="text-xs text-amber-300 font-normal">annonces/mois</span>
          </div>
          <div className="text-[11px] text-amber-200">
            Scrapées sur Ouedkniss, FB & Mubawab
          </div>
        </div>

        {/* KPI 4: Membres Inscrits Actifs */}
        <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-2 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Membres Vendeurs & Acheteurs</span>
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white font-outfit">
            18,450 <span className="text-xs text-sky-400 font-normal">inscrits</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Contacts vendeurs & acheteurs vérifiés
          </div>
        </div>

      </div>

      {/* 1. Evolution of Avg Price per M2 in DZD (Area Chart) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-900 font-outfit">Évolution du Prix Moyen au m² (en Dinars DZD)</h4>
              <p className="text-[11px] text-slate-500">Comparatif par Wilaya majeure (Alger, Oran, Constantine, Sétif)</p>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={PRICE_EVOLUTION_SERIES} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAlger" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOran" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F172A" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#0F172A" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={val => `${(val / 1000).toFixed(0)}k DZD`} />
              <Tooltip
                formatter={(value: any) => [`${Number(value).toLocaleString()} DZD / m²`, '']}
                contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="Alger" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorAlger)" />
              <Area type="monotone" dataKey="Oran" stroke="#0F172A" strokeWidth={2} fillOpacity={1} fill="url(#colorOran)" />
              <Area type="monotone" dataKey="Constantine" stroke="#F59E0B" strokeWidth={2} fill="none" />
              <Area type="monotone" dataKey="Sétif" stroke="#8B5CF6" strokeWidth={2} fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* NEW SECTION: Daily Automated Scraper Volume Chart */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-900 font-outfit">Volume d'Importation Quotidienne Automatisée par Plateforme</h4>
              <p className="text-[11px] text-slate-500">Nombre d'annonces nationales agrégées automatiquement chaque jour par le bot ImmoWin</p>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DAILY_AUTO_IMPORT_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Ouedkniss" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Facebook" fill="#2563EB" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Mubawab" fill="#059669" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Lkeria" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Columns: Bar Chart & Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Monthly Volume Bar Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-900 font-outfit">Volume de Transactions (Milliards DZD)</h4>
              <p className="text-[11px] text-slate-500">Volume mensuel cumulé du réseau ImmoWin</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_TRANSACTIONS_SERIES}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={val => `${val}B DZD`} />
                <Tooltip
                  formatter={(val: any) => [`${val} Milliards DZD`, 'Volume']}
                  contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="volumeBillionDZD" fill="#059669" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Property Type Distribution Pie */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              <PieIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-900 font-outfit">Répartition par Type de Bien</h4>
              <p className="text-[11px] text-slate-500">Part de marché des annonces en Algérie</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PROPERTY_TYPE_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {PROPERTY_TYPE_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => [`${val}%`, 'Part de marché']} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};

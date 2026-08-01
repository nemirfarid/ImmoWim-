import React from 'react';
import { X, ShieldCheck, FileText, Globe, CheckCircle2, Lock, Scale, Search, Server, Cpu } from 'lucide-react';

interface LegalSitemapModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'legal' | 'sitemap';
}

export const LegalSitemapModal: React.FC<LegalSitemapModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'legal'
}) => {
  const [activeTab, setActiveTab] = React.useState<'legal' | 'sitemap'>(initialTab);

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  if (!isOpen) return null;

  const sitemapUrls = [
    { url: 'https://immowin.dz/', changefreq: 'daily', priority: '1.0', label: 'Accueil & Moteur de recherche Immobilier Algérie' },
    { url: 'https://immowin.dz/estimation-ia', changefreq: 'daily', priority: '0.9', label: 'Estimateur de Prix au Mètre Carré (DZD)' },
    { url: 'https://immowin.dz/wilaya/alger', changefreq: 'hourly', priority: '0.9', label: 'Annonces Immobilier Alger (Hydra, Ben Aknoun)' },
    { url: 'https://immowin.dz/wilaya/oran', changefreq: 'hourly', priority: '0.9', label: 'Annonces Immobilier Oran (Akid Lotfi, Canastel)' },
    { url: 'https://immowin.dz/wilaya/constantine', changefreq: 'daily', priority: '0.8', label: 'Annonces Immobilier Constantine' },
    { url: 'https://immowin.dz/wilaya/setif', changefreq: 'daily', priority: '0.8', label: 'Annonces Immobilier Sétif' },
    { url: 'https://immowin.dz/wilaya/annaba', changefreq: 'daily', priority: '0.8', label: 'Annonces Immobilier Annaba' },
    { url: 'https://immowin.dz/type/appartement', changefreq: 'hourly', priority: '0.9', label: 'Vente Appartement F3 & F4 Notarié' },
    { url: 'https://immowin.dz/type/villa', changefreq: 'daily', priority: '0.8', label: 'Villas de Prestige avec Piscine' },
    { url: 'https://immowin.dz/vefa-promoteurs', changefreq: 'daily', priority: '0.85', label: 'Espace Promotion Immobilière VEFA Neuf' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 sm:p-8 space-y-6"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center font-black shadow-md">
              <Scale className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-slate-900 font-outfit">
                Centre d'Information & Sécurité ImmoWin
              </h3>
              <p className="text-xs text-slate-500">
                Mentions Légales, Conformité Notariée et Indexation Search Console
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/80">
          <button
            onClick={() => setActiveTab('legal')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'legal'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Mentions Légales & Conditions (DZD)</span>
          </button>

          <button
            onClick={() => setActiveTab('sitemap')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'sitemap'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-4 h-4 text-sky-600" />
            <span>Sitemap XML Google Search Index</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'legal' ? (
          <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
              <h4 className="font-extrabold text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Réglementation et Actes Notariés en Algérie</span>
              </h4>
              <p className="text-[11px] text-emerald-800">
                Conformément au Code Civil Algérien et à la législation foncière (Loi 90-25 et Ordonnance 75-74), toutes les annonces de vente présentées sur ImmoWin comportent la certification des pièces administratives (Acte Notarié, Livret Foncier, ou Certificat d'Existence VEFA).
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <h5 className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wider mb-1">1. Éditeur de la Plateforme</h5>
                <p>
                  ImmoWin SaaS Algérie — Support & Contact Direct : +213 773 47 40 96 (Téléphone & WhatsApp). Registre de Commerce et NIF d'activité certifié.
                </p>
              </div>

              <div>
                <h5 className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wider mb-1">2. Tarification & Devises</h5>
                <p>
                  L'ensemble des prix affichés sur la plateforme sont indiqués exclusivement en Dinars Algériens (DZD). Les estimations générées par l'intelligence artificielle constituent une référence basée sur le baromètre transactionnel régional des 58 Wilayas.
                </p>
              </div>

              <div>
                <h5 className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wider mb-1">3. Protection des Données et Confidentialité</h5>
                <p>
                  Les coordonnées déposées par les acquéreurs et vendeurs ne sont transmises qu'aux agences agréées et promoteurs certifiés sur la plateforme. Aucune donnée personnelle n'est revendue à des tiers.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-emerald-400 font-outfit flex items-center gap-2">
                  <Server className="w-4 h-4" />
                  <span>Indexation Google sitemap.xml</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                  HTTP 200 OK
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Structure XML officielle soumise à la Google Search Console et aux robots d'indexation Bing/Baidu pour maximiser le référencement naturel de vos annonces.
              </p>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 max-h-60 overflow-y-auto font-mono text-[11px]">
              {sitemapUrls.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50/50 hover:bg-emerald-50/50 transition-colors flex items-center justify-between gap-4">
                  <div className="truncate">
                    <span className="text-emerald-700 font-bold block truncate">{item.url}</span>
                    <span className="text-[10px] text-slate-500 font-sans block">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-[10px] text-slate-500">
                    <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">Priority {item.priority}</span>
                    <span className="hidden sm:inline text-slate-400">{item.changefreq}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer close */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer hover:bg-slate-800 transition-colors"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};

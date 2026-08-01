import React, { useState } from 'react';
import { usePropertyContext } from '../context/PropertyContext';
import { useLanguage } from '../context/LanguageContext';
import { getWhatsAppLink, getTelLink, getSmsLink } from '../utils/communication';
import { formatDZD } from '../utils/formatters';
import { 
  Users, 
  Phone, 
  MessageCircle, 
  MessageSquare, 
  MapPin, 
  Building2, 
  Tag, 
  Sparkles, 
  PlusCircle,
  Filter,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';

interface PotentialBuyersBannerProps {
  onOpenAddProperty: () => void;
  onOpenCriteriaModal: () => void;
}

export const PotentialBuyersBanner: React.FC<PotentialBuyersBannerProps> = ({
  onOpenAddProperty,
  onOpenCriteriaModal
}) => {
  const { subscriptions, leads, showToast } = usePropertyContext();
  const { language } = useLanguage();
  const isAr = language === 'AR';
  const isEn = language === 'EN';

  const [selectedWilaya, setSelectedWilaya] = useState<string>('Toutes');

  // Filter subscriptions that are buyers ('acheteurs') plus extra mock buyers to populate
  const buyerSubscriptions = subscriptions.filter(s => s.roleCategory === 'acheteurs' || !s.roleCategory);

  // Combine with sample buyer leads for rich display
  const allBuyers = [
    ...buyerSubscriptions.map(s => ({
      id: s.id,
      name: s.contactName || s.userTitle,
      type: s.userTitle || 'Acheteur Qualifié',
      phone: s.phone || '0550123456',
      email: s.email,
      wilaya: s.wilaya || 'Alger',
      commune: s.commune || 'Hydra',
      propertyType: s.propertyType || 'Villa',
      budgetDZD: s.maxBudgetDZD || 85000000,
      transactionType: s.transactionType || 'Achat',
      date: s.dateCreated || 'Récent',
      verified: true
    })),
    // Fallback default sample buyers if list is short
    {
      id: 'buyer-sample-1',
      name: 'Yacine Belkacem',
      type: 'Acheteur Particulier (Cash)',
      phone: '0550112233',
      email: 'y.belkacem@gmail.com',
      wilaya: 'Oran',
      commune: 'Bir El Djir',
      propertyType: 'Appartement F4/F5',
      budgetDZD: 28000000,
      transactionType: 'Achat',
      date: '2026-07-31',
      verified: true
    },
    {
      id: 'buyer-sample-2',
      name: 'SARL Baya Promotion & Invest',
      type: 'Investisseur Promoteur',
      phone: '0770998877',
      email: 'invest@baya.dz',
      wilaya: 'Alger',
      commune: 'Chéraga',
      propertyType: 'Terrain / Promotion',
      budgetDZD: 150000000,
      transactionType: 'Achat',
      date: '2026-07-30',
      verified: true
    },
    {
      id: 'buyer-sample-3',
      name: 'Mme Amrani Safia',
      type: 'Acheteur Crédit CNEP',
      phone: '0661445566',
      email: 's.amrani@outlook.com',
      wilaya: 'Constantine',
      commune: 'Nouvelle Ville Ali Mendjeli',
      propertyType: 'Appartement F3',
      budgetDZD: 14500000,
      transactionType: 'Achat',
      date: '2026-07-29',
      verified: true
    },
    {
      id: 'buyer-sample-4',
      name: 'Karim Ould-Ali',
      type: 'Commerçant / Investisseur',
      phone: '0555112233',
      email: 'k.ouldali@gmail.com',
      wilaya: 'Sétif',
      commune: 'Centre Ville',
      propertyType: 'Local Commercial',
      budgetDZD: 45000000,
      transactionType: 'Achat',
      date: '2026-07-28',
      verified: true
    }
  ];

  const wilayasList = ['Toutes', 'Alger', 'Oran', 'Constantine', 'Sétif', 'Blida', 'Annaba'];

  const filteredBuyers = selectedWilaya === 'Toutes'
    ? allBuyers
    : allBuyers.filter(b => b.wilaya.toLowerCase().includes(selectedWilaya.toLowerCase()));

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-teal-500/30 relative overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full filter blur-3xl pointer-events-none" />

        {/* Top Header & Badge */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold mb-3 animate-pulse">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>
                {isAr ? '🔥 فضاء البائعين والوكلاء: المشترون المحتملون في الانتظار' : isEn ? '🔥 Seller & Agent Hub: Active Buyers Waiting' : '🔥 Espace Vendeurs & Agences : Acheteurs Potentiels Qualifiés'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit tracking-tight flex items-center gap-3">
              <span>{isAr ? 'المشترون المحتملون والطلبات المباشرة' : isEn ? 'Potential Buyers & Active Demands' : 'Acheteurs Potentiels & Demandes Actives'}</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 font-black">
                {allBuyers.length} {isAr ? 'مشتري' : 'Acheteurs'}
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              {isAr 
                ? 'يمكن للبائعين وأصحاب العقارات والوكلاء التواصل مباشرة مع المشترين عبر الهاتف أو الواتساب بشكل منفصل.'
                : isEn 
                ? 'Sellers, property owners, and agents can contact qualified buyers directly via phone or WhatsApp with clean separated controls.'
                : 'Les vendeurs, propriétaires et agences peuvent contacter directement les acheteurs qualifiés ci-dessous. Les numéros et icônes d\'action (WhatsApp / Appel / SMS) sont séparés pour une clarté maximale.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              id="top-buyers-add-prop-btn"
              onClick={onOpenAddProperty}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 transition-all cursor-pointer flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isAr ? 'نشر عقار لهؤلاء المشترين' : 'Publier mon bien pour eux'}</span>
            </button>

            <button
              id="top-buyers-criteria-btn"
              onClick={onOpenCriteriaModal}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>{isAr ? 'تسجيل كمشتري محتمل' : 'S\'inscrire comme Acheteur'}</span>
            </button>
          </div>
        </div>

        {/* Filter by Wilaya Bar */}
        <div className="relative z-10 flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-2">
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isAr ? 'تصفية حسب الولاية:' : 'Filtrer par Wilaya :'}</span>
          </span>

          {wilayasList.map(w => (
            <button
              key={w}
              onClick={() => setSelectedWilaya(w)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedWilaya === w
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20 border border-white/10'
              }`}
            >
              {w}
            </button>
          ))}
        </div>

        {/* Buyers Grid */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredBuyers.map(buyer => {
            const whatsappText = `Bonjour ${buyer.name}, je suis vendeur sur ImmoWin et j'ai vu que vous cherchez un(e) ${buyer.propertyType} à ${buyer.commune || buyer.wilaya} (Budget: ${formatDZD(buyer.budgetDZD)}). Êtes-vous toujours intéressé(e) ?`;

            return (
              <div 
                key={buyer.id}
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all shadow-lg flex flex-col justify-between group"
              >
                <div>
                  {/* Buyer Badge & Name */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider mb-1">
                        {buyer.type}
                      </span>
                      <h3 className="text-sm font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                        {buyer.name}
                      </h3>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" title="En recherche active" />
                  </div>

                  {/* Location & Property Type */}
                  <div className="space-y-1.5 text-xs text-slate-300 mb-4">
                    <div className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{buyer.commune ? `${buyer.commune}, ${buyer.wilaya}` : buyer.wilaya}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Building2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>{buyer.propertyType} ({buyer.transactionType})</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-amber-300 font-extrabold">
                      <Tag className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Budget Max: {formatDZD(buyer.budgetDZD, true)}</span>
                    </div>
                  </div>
                </div>

                {/* SEPARATED PHONE NUMBER AND CONTACT ICONS */}
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  
                  {/* Phone Number Display Badge (Clean & Separate) */}
                  <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-medium uppercase">
                      {isAr ? 'رقم الهاتف:' : 'Tél :'}
                    </span>
                    <span dir="ltr" className="font-mono text-xs font-bold text-emerald-400 tracking-wider">
                      {buyer.phone}
                    </span>
                  </div>

                  {/* Separated Action Buttons (WhatsApp Icon & Phone Icon & SMS) */}
                  <div className="grid grid-cols-3 gap-1.5">
                    
                    {/* Separate WhatsApp Button */}
                    <a
                      id={`top-buyer-wa-${buyer.id}`}
                      href={getWhatsAppLink(buyer.phone, whatsappText)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`WhatsApp : ${buyer.phone}`}
                      className="py-2 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-all flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 fill-white shrink-0" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </a>

                    {/* Separate Phone Call Button */}
                    <a
                      id={`top-buyer-tel-${buyer.id}`}
                      href={getTelLink(buyer.phone)}
                      title={`Appeler : ${buyer.phone}`}
                      className="py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-[11px] transition-all flex items-center justify-center gap-1 border border-slate-700 shadow-sm cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="hidden sm:inline">{isAr ? 'اتصال' : 'Appeler'}</span>
                    </a>

                    {/* Separate SMS Button */}
                    <a
                      id={`top-buyer-sms-${buyer.id}`}
                      href={getSmsLink(buyer.phone, whatsappText)}
                      title={`SMS : ${buyer.phone}`}
                      className="py-2 px-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-[11px] transition-all flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                      <span className="hidden sm:inline">SMS</span>
                    </a>

                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

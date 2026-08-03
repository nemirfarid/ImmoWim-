import React, { useState } from 'react';
import { Plane, ShieldCheck, FileCheck, Landmark, MessageSquare, ArrowRight, DollarSign, Calculator, Globe2, PhoneCall } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { EXCHANGE_RATES, formatPriceWithCurrency } from '../utils/currencyHelpers';

interface DiasporaBannerProps {
  onOpenConsultation?: () => void;
}

export const DiasporaBanner: React.FC<DiasporaBannerProps> = ({ onOpenConsultation }) => {
  const { language } = useLanguage();
  const [testAmountDZD, setTestAmountDZD] = useState<number>(25000000); // 2.5 Milliards Centimes (25 Million DZD)
  const isAr = language === 'AR';
  const isEn = language === 'EN';

  const eurAmount = Math.round(testAmountDZD / EXCHANGE_RATES.EUR).toLocaleString('fr-FR');
  const cadAmount = Math.round(testAmountDZD / EXCHANGE_RATES.CAD).toLocaleString('fr-FR');
  const usdAmount = Math.round(testAmountDZD / EXCHANGE_RATES.USD).toLocaleString('fr-FR');

  return (
    <section id="diaspora-section-banner" className="my-8 bg-gradient-to-br from-emerald-950 via-slate-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-amber-500/30 relative overflow-hidden">
      {/* Decorative background badges & flag accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Header Badge & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black tracking-wide">
              <Globe2 className="w-4 h-4 text-emerald-400" />
              <span>{isAr ? '🇩🇿 الجالية الجزائرية بالخارج والمهجر' : '🇩🇿 Spécial Diaspora Algérienne & Immigrés'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              {isAr 
                ? 'استثمر واشترِ عقارك في الجزائر بأمان تام من مكان إقامتك بالخارج'
                : isEn 
                ? 'Invest & Buy Real Estate in Algeria Securely From Abroad'
                : 'Investissez & Achetez votre Bien en Algérie à Distance (France, Canada, Europe)'}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-3xl font-medium">
              {isAr
                ? 'خدمات مخصصة للجزائريين المقيمين بالخارج: توثيق بكتات بالوكالة القنصلية، تحويل وقيم بالعملات الصعبة (€ / $)، وتفتيش عقاري معتمد لـ 58 ولاية.'
                : 'Solutions sur-mesure pour les résidents à l\'étranger : Procuration Consulaire, vérification notariée 100% sécurisée, conversion devises (€ / CAD $ / USD $) et gestion locative pendant vos absences.'}
            </p>
          </div>

          <a
            href="https://wa.me/213550000000?text=Bonjour,%20je%20suis%20un%20membre%20de%20la%20diaspora%20alg%C3%A9rienne%20et%20souhaite%20un%20accompagnement%20immobilier"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl hover:shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{isAr ? '💬 تواصل عبر واتساب الجالية' : '💬 WhatsApp Dédié Diaspora'}</span>
          </a>
        </div>

        {/* 4 Pillars for Diaspora */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <Landmark className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-white text-sm mb-1">
              {isAr ? 'عقد توثيقي ودفتر عقاري' : 'Acte Notarié & Livret Foncier'}
            </h3>
            <p className="text-slate-400 text-xs">
              {isAr ? 'تدقيق قانوني كامل لملكيات 58 ولاية لضمان أموالك' : 'Vérification juridique rigoureuse avant tout versement d\'acompte.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
              <Plane className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-white text-sm mb-1">
              {isAr ? 'الشراء بالوكالة القنصلية' : 'Achat par Procuration'}
            </h3>
            <p className="text-slate-400 text-xs">
              {isAr ? 'إجراءات الشراء الرسمية دون الحاجة للتنقل للجزائر' : 'Signez chez le notaire via procuration du Consulat d\'Algérie.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-white text-sm mb-1">
              {isAr ? 'تقدير القيمة باليورو والدولار' : 'Équivalence Devises (€ / $)'}
            </h3>
            <p className="text-slate-400 text-xs">
              {isAr ? 'حساب قيم العقارات فوريا بالعملات الأجنبية' : 'Calculez instantanément la contrepartie en Euros, CAD $ et USD $.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-white text-sm mb-1">
              {isAr ? 'إدارة التأجير أثناء غيابك' : 'Gestion Locative à Distance'}
            </h3>
            <p className="text-slate-400 text-xs">
              {isAr ? 'تأجير وصيانة شقتك بالجزائر مع تحويل الأرباح' : 'Mise en location et entretien de votre appartement en Algérie.'}
            </p>
          </div>
        </div>

        {/* Bank Loan Rights Highlight Banner for Foreigners & Diaspora */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-900/90 to-teal-900/90 border-2 border-emerald-400/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center justify-center shrink-0">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 font-black text-[10px] uppercase">
                  {isAr ? 'حقوق القروض البنكية' : 'Droit au Crédit Immobilier'}
                </span>
                <span className="text-[11px] text-emerald-200 font-bold">
                  {isAr ? 'متاح للجميع والجالية بالخارج' : 'Ouvert aux Étrangers & Diaspora'}
                </span>
              </div>
              <h4 className="font-extrabold text-white text-sm sm:text-base">
                {isAr 
                  ? 'حق الحصول على تمويل وقرض بنكي لشراء أو بناء منزل أو شقة في الجزائر'
                  : 'Droit légal d\'obtenir un Prêt Bancaire pour Acheter ou Construire un logement'}
              </h4>
              <p className="text-emerald-100 text-xs mt-0.5 max-w-2xl">
                {isAr
                  ? 'يمكن للجزائريين بالخارج والمستثمرين الحصول على قروض بنكية وتمويلات عقارية (حلال وتشاركية) تصل إلى 80-100% لبناء أو شراء الشقق، الفيلات والأراضي.'
                  : 'Les investisseurs étrangers et membres de la diaspora bénéficient du droit complet aux prêts bancaires et financements participatifs (CPA, BNA, Banque de l\'Habitat) pour acquérir ou faire construire en Algérie.'}
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/213773474096?text=Bonjour,%20je%20souhaite%20des%20informations%20sur%20le%20pr%C3%Aat%20bancaire%20et%20financement%20immobilier%20en%20Alg%C3%A9rie"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-4 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-950 font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <span>{isAr ? 'تقديم طلب قروض' : 'Simuler mon Prêt Bancaire'}</span>
            <ArrowRight className="w-4 h-4 text-emerald-700" />
          </a>
        </div>

        {/* Interactive Currency Quick Converter for Diaspora */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                {isAr ? 'محول أسعار العقارات للجالية' : 'Calculateur Équivalence Devises Diaspora'}
              </span>
              <p className="text-xs text-slate-300 font-medium">
                {isAr ? 'مثال: 2.5 مليار سنتيم (25,000,000 د.ج) تساوي:' : 'Exemple pour un bien de 2,5 Milliards Centimes (25 000 000 DA) :'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-center">
              <span className="text-[10px] text-slate-400 block font-bold">EURO (€)</span>
              <span className="text-emerald-400 font-black text-sm">{eurAmount} €</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-center">
              <span className="text-[10px] text-slate-400 block font-bold">CAD ($)</span>
              <span className="text-amber-400 font-black text-sm">{cadAmount} $ CAD</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-center">
              <span className="text-[10px] text-slate-400 block font-bold">USD ($)</span>
              <span className="text-sky-400 font-black text-sm">{usdAmount} $ USD</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

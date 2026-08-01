import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { usePropertyContext } from '../context/PropertyContext';
import { WILAYAS_DATA } from '../data/wilayasData';
import {
  Building2,
  X,
  Send,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Phone,
  MessageSquare,
  Globe,
  PlusCircle,
  Share2,
  BadgePercent,
  MapPin,
  ShieldCheck
} from 'lucide-react';

interface PromoterInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PromoterInvitationModal: React.FC<PromoterInvitationModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const { setIsAddModalOpen } = usePropertyContext();

  const isAr = language === 'AR';

  const [promoterName, setPromoterName] = useState('');
  const [wilaya, setWilaya] = useState('Alger');
  const [phoneNumber, setPhoneNumber] = useState('0773474096');
  const [copied, setCopied] = useState(false);
  const [msgLang, setMsgLang] = useState<'FR' | 'AR'>('FR');

  if (!isOpen) return null;

  // Clean phone number for wa.me link
  const formattedPhone = phoneNumber.replace(/\s+/g, '').replace(/^0/, '213');

  // French message template
  const messageFR = `🏢 *Invitation Exclusive pour Promoteur Immobilier - ImmoWin Algérie* 🇩🇿

Bonjour ${promoterName ? promoterName : 'Cher Promoteur'},

Nous avons le plaisir de vous inviter à rejoindre *ImmoWin* (https://immowin.dz), la plateforme d'exception dédiée au marché immobilier en Algérie (58 Wilayas).

🌟 *Quelle est la Valeur Ajoutée d'ImmoWin pour vos Projets Neufs (VEFA & Résidences) ?*

1️⃣ *Visibilité VIP sur les 58 Wilayas* : Présentez vos programmes neufs (Appartements, Villas, Locaux) avec photos HD, vidéos et position GPS exacte (${wilaya}).
2️⃣ *0 DZD Commission & Direct Vendeur* : Aucun intermédiaire ! Les acheteurs et investisseurs vous contactent directement par WhatsApp et téléphone.
3️⃣ *Prix Clairs en Dinars Algériens (DZD)* : Valorisation transparente et badges de garanties juridiques (Acte Notarié & Livret Foncier).
4️⃣ *Matching IA Automatique* : Alerte immédiate transmise aux acquéreurs qui recherchent des logements neufs dans votre wilaya (${wilaya}).
5️⃣ *Support & Accompagnement Dédié* : Équipe disponible 7j/7 sur WhatsApp au +213 773 47 40 96.

🚀 *Inscrivez-vous et ajoutez vos projets dès aujourd'hui sur ImmoWin :*
👉 https://immowin.dz

Des questions ? Contactez-nous directement sur WhatsApp : https://wa.me/213773474096`;

  // Arabic message template
  const messageAR = `🏢 *دعوة خاصة للترقية العقارية والمطورين - منصة إيمووين ImmoWin* 🇩🇿

مرحباً ${promoterName ? promoterName : 'المرقي العقاري المحترم'}،

يسرنا دعوتكم للانضمام إلى منصة *إيمووين ImmoWin* (https://immowin.dz)، المنصة العقارية الرائدة المخصصة للسوق الجزائرية عبر 58 ولاية.

🌟 *ما هي القيمة المضافة التي تقدمها منصة إيمووين لمشاريعكم السكنية والتجارية الجديدة؟*

1️⃣ *عرض مميز عبر 58 ولاية*: تقديم مشاريعكم (سكنات ترقوية، فيلات، محلات) مع صور عالية الجودة، فيديوهات وموقع GPS دقيق (${wilaya}).
2️⃣ *0 دج عمولة وتواصل مباشر*: بدون أي وسيط! يرتكز التواصل مباشرة بين المشترين والمستثمرين ومعكم عبر الواتساب والهاتف.
3️⃣ *أسعار واضحة بالدينار الجزائري (DZD)*: توثيق الضمانات القانونية (عقد توثيقي ودفتر عقاري).
4️⃣ *ربط آلي بالذكاء الاصطناعي*: إشعارات فورية ترسل للمشترين الباحثين عن عقارات جديدة في ولايتكم (${wilaya}).
5️⃣ *دعم فني خاص للمرقين*: فريق متوافر 7/7 أيام عبر الواتساب: +213 773 47 40 96.

🚀 *سجلوا الآن وأضيفوا مشاريعكم العقارية مجاناً عبر الرابط:*
👉 https://immowin.dz

لأي استفسار تواصلوا معنا مباشرة عبر واتساب: https://wa.me/213773474096`;

  const activeMessage = msgLang === 'AR' ? messageAR : messageFR;

  const handleOpenWhatsApp = () => {
    const encodedText = encodeURIComponent(activeMessage);
    const targetPhone = formattedPhone ? formattedPhone : '213773474096';
    window.open(`https://wa.me/${targetPhone}?text=${encodedText}`, '_blank');
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(activeMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleRegisterAndAddProperty = () => {
    onClose();
    setIsAddModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 text-white rounded-3xl shadow-2xl border border-amber-500/30 overflow-hidden my-8">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-amber-600 via-emerald-700 to-slate-900 p-6 sm:p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 sm:top-6 sm:right-6 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-extrabold mb-3 shadow-md">
            <Building2 className="w-4 h-4" />
            <span>{isAr ? 'فضاء المرقين العقاريين' : 'Espace Promoteurs Immobiliers'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-outfit text-white">
            {isAr ? 'دعوة وتسجيل المرقين العقاريين via WhatsApp' : 'Invitation & Inscription Promoteurs Immobilier'}
          </h2>
          <p className="text-xs sm:text-sm text-amber-100/90 mt-1">
            {isAr
              ? 'أرسل دعوة مهنية عبر الواتساب للمرقين العقاريين تشرح مزايا منصة إيمووين وكيفية نشر مشاريعهم'
              : 'Envoyez une invitation explicative complète sur WhatsApp présentant la valeur ajoutée ImmoWin'}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Form Fields for Customization */}
          <div className="bg-slate-950/70 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-extrabold uppercase text-amber-400 font-outfit flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                {isAr ? 'تخصيص معلومات المشرع والمرقي' : 'Personnalisation du Message'}
              </span>

              {/* Language Selector */}
              <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-700">
                <button
                  onClick={() => setMsgLang('FR')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    msgLang === 'FR' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Français
                </button>
                <button
                  onClick={() => setMsgLang('AR')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    msgLang === 'AR' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  العربية
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  {isAr ? 'اسم المرقي / اسم الشركة العقارية' : 'Nom du Promoteur / Société'}
                </label>
                <input
                  type="text"
                  placeholder="ex: Promotion Bessa / Bati-Algerie"
                  value={promoterName}
                  onChange={(e) => setPromoterName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  {isAr ? 'الولاية المستهدفة' : 'Wilaya du Projet (58 Wilayas)'}
                </label>
                <select
                  value={wilaya}
                  onChange={(e) => setWilaya(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {WILAYAS_DATA.map((w) => (
                    <option key={w.code} value={w.name}>
                      {w.code} - {w.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                {isAr ? 'رقم الواتساب المستهدف (أو رقم الدعم 0773474096)' : 'Numéro WhatsApp du Promoteur (ex: 0773474096)'}
              </label>
              <div className="flex items-center gap-2">
                <span className="px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-emerald-400 font-mono font-bold">
                  +213
                </span>
                <input
                  type="text"
                  placeholder="0773474096"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  dir="ltr"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-amber-500 [direction:ltr]"
                />
              </div>
            </div>
          </div>

          {/* Value Proposition Highlights */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-outfit">
              {isAr ? 'القيم المضافة الرئيسية لمنصة إيمووين للمرقين:' : 'Valeurs Ajoutées Clés pour les Promoteurs :'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 flex items-start gap-2.5">
                <BadgePercent className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-300 block">0 DZD Frais d'intermédiaire</span>
                  <span className="text-[11px] text-slate-400">Direct vendeur & promoteur vers acheteur qualifié.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/20 flex items-start gap-2.5">
                <Globe className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-300 block">Couverture 58 Wilayas</span>
                  <span className="text-[11px] text-slate-400">Présentation VIP de vos projets neufs (VEFA).</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-sky-950/40 border border-sky-500/20 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-sky-300 block">Matching IA des Acquéreurs</span>
                  <span className="text-[11px] text-slate-400">Notification immédiate aux acheteurs enregistrés.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-teal-950/40 border border-teal-500/20 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-teal-300 block">Badges Certifiés Acte & Livret</span>
                  <span className="text-[11px] text-slate-400">Garantie juridique & rassurance acheteurs.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview of WhatsApp Message */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider font-outfit flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                {isAr ? 'معاينة نص الرسالة المباشرة للواتساب:' : 'Aperçu du Message WhatsApp Prêt à l\'Envoi :'}
              </label>

              <button
                onClick={handleCopyMessage}
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">{isAr ? 'تم النسخ!' : 'Copié !'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isAr ? 'نسخ النص' : 'Copier le texte'}</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-line max-h-48 overflow-y-auto leading-relaxed select-all">
              {activeMessage}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-3">
            
            {/* WhatsApp Send Button */}
            <button
              onClick={handleOpenWhatsApp}
              className="w-full sm:flex-1 py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-950/50 transition-all cursor-pointer flex items-center justify-center gap-2 transform active:scale-98"
            >
              <Send className="w-4 h-4" />
              <span>{isAr ? 'إرسال الرسالة عبر الواتساب (+213773474096)' : 'Envoyer par WhatsApp (+213 773 47 40 96)'}</span>
            </button>

            {/* Direct Register as Promoter Button */}
            <button
              onClick={handleRegisterAndAddProperty}
              className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 transform active:scale-98"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isAr ? 'التسجيل وإضافة مشروع عقاري' : 'S\'inscrire & Publier mon Projet'}</span>
            </button>

          </div>

          <div className="text-center pt-1">
            <span className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>Support Promoteurs WhatsApp Direct : <strong className="text-emerald-400 font-mono">+213 773 47 40 96</strong></span>
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};

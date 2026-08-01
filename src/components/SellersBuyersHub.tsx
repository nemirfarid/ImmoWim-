import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { usePropertyContext } from '../context/PropertyContext';
import { Building2, Search, PlusCircle, Bell, CheckCircle2, ShieldCheck, Zap, Sparkles, ArrowRight, PhoneCall, UserCheck, MessageSquare, Bot, Globe, RefreshCw } from 'lucide-react';

interface SellersBuyersHubProps {
  onOpenCriteriaModal: () => void;
  onOpenPromoterModal: () => void;
  onOpenSmartImporter?: () => void;
}

export const SellersBuyersHub: React.FC<SellersBuyersHubProps> = ({ onOpenCriteriaModal, onOpenPromoterModal, onOpenSmartImporter }) => {
  const { language } = useLanguage();
  const { setIsAddModalOpen } = usePropertyContext();

  const isAr = language === 'AR';
  const isEn = language === 'EN';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3 border border-emerald-200">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>
            {isAr
              ? 'الخدمة التفاعلية المباشرة للبائعين والمشترين والمرقين في الجزائر'
              : isEn
              ? 'Direct Interactive Platform for Sellers, Buyers & Developers in Algeria'
              : 'Plateforme Interactive Directe pour Vendeurs, Acheteurs & Promoteurs'}
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-outfit tracking-tight leading-tight">
          {isAr
            ? 'سجّل الآن كبائع، كمرقي عقاري، أو كمشتري لإضافة طلبك'
            : isEn
            ? 'Register as a Seller, Real Estate Developer, or Buyer'
            : 'Inscrivez-vous en tant que Vendeur, Promoteur ou Acheteur'}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
          {isAr
            ? 'منصة إيمووين تجمع بين المالكين والجمارك والمرقين العقاريين الراغبين في تسويق مشاريعهم، والمشترين الباحثين عن عقارات بالدينار الجزائري.'
            : isEn
            ? 'ImmoWin connects property owners & developers listing real estate with buyers looking for certified properties in Algerian Dinars.'
            : 'ImmoWin connecte directement propriétaires, promoteurs immobiliers et acheteurs certifiés avec des prix transparents en Dinars Algériens (DZD).'}
        </p>
      </div>

      {/* BANNER FOR REAL ESTATE DEVELOPERS (PROMOTEURS IMMOBILIERS) */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-500/30 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-extrabold border border-amber-500/30">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'دعوة خاصة للمرقين العقاريين' : 'Espace & Invitation Promoteurs Immobiliers VEFA'}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold font-outfit text-white leading-tight">
              {isAr
                ? 'هل أنت مرقي عقاري صاحب مشاريع سكنية جديدة؟ سجّل واعرض مشاريعك مجاناً'
                : 'Vous êtes Promoteur Immobilier en Algérie ? Rejoignez ImmoWin et Publiez vos Projets Neufs'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isAr
                ? 'استفد من تغطية شاملة عبر 58 ولاية، تواصل مباشر دون عمولة (0 دج)، ربط بالذكاء الاصطناعي مع المشترين، ودعم مستمر عبر الواتساب على 0773474096.'
                : 'Offrez une visibilité VIP à vos résidences et programmes neufs. Profitez de 0 DZD commission, de la mise en relation WhatsApp directe avec les acquéreurs et du matching IA.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-amber-200/90 pt-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                {isAr ? 'عرض VIP عبر 58 ولاية' : 'Vitrine VIP 58 Wilayas'}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                {isAr ? '0 دج عمولة وسيط' : '0 DZD Frais Intermédiaire'}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                {isAr ? 'إرسال دعوة واتساب جاهزة' : 'Invitation WhatsApp Explicative'}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto shrink-0">
            <button
              id="btn-promoter-invite-whatsapp"
              onClick={onOpenPromoterModal}
              className="px-6 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl transition-all transform active:scale-95 cursor-pointer flex items-center justify-center gap-2.5 border border-amber-300/50"
            >
              <MessageSquare className="w-4 h-4 fill-slate-950 text-slate-950" />
              <span>{isAr ? 'دعوة مرقي عقاري عبر WhatsApp' : 'Invitation WhatsApp Promoteurs (+213773474096)'}</span>
            </button>

            <button
              id="btn-promoter-register-direct"
              onClick={() => setIsAddModalOpen(true)}
              className="px-6 py-3.5 rounded-2xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 border border-emerald-400/30"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isAr ? 'التسجيل كمرقي ونشر مشروع جديد' : 'S\'inscrire & Publier un Projet Neuf'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Triple Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* CARD 1: FOR SELLERS (VENDEURS & PROPRIÉTAIRES) */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 relative overflow-hidden flex flex-col justify-between group transform hover:-translate-y-1 transition-all duration-300">
          
          {/* Subtle Accent Glow Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            {/* Header Badge */}
            <div className="flex items-center justify-between mb-6">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                <span>{isAr ? 'فضاء البائعين والمالكين' : isEn ? 'Sellers & Landlords Hub' : 'Espace Vendeurs & Propriétaires'}</span>
              </span>
              <span className="text-[11px] font-bold text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                {isAr ? 'إعلان مجاني 0 د.ج' : '0 DZD Frais'}
              </span>
            </div>

            {/* Title & Description */}
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit mb-3 leading-snug">
              {isAr ? 'أنت مالك أم بائع؟ سجّل وانشر عقارك الآن' : isEn ? 'Property Owner or Seller? Register & Post Your Property' : 'Vous êtes Propriétaire ou Vendeur ? Publiez votre bien'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              {isAr
                ? 'اعرض شقتك، فيلتك، أرضك أو محلك التجاري أمام آلاف المشترين الجادين يومياً في الجزائر. احصل على تقييم بالذكاء الاصطناعي مجاناً وتواصل عبر الواتساب والهاتف.'
                : isEn
                ? 'List your apartment, villa, land plot or commercial space to thousands of qualified buyers daily across Algeria. Get instant AI valuation & direct contact.'
                : 'Présentez vos appartements, villas, terrains ou locaux commerciaux à des milliers d\'acheteurs certifiés en Algérie. Estimation IA gratuite & contact direct.'}
            </p>

            {/* Seller Features Checklist */}
            <ul className="space-y-3 mb-8 border-t border-white/10 pt-5 text-xs text-slate-200">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{isAr ? 'إشارة عقار موثق (عقد توثيقي ودفتر عقاري)' : isEn ? 'Verified Title Deed (Acte & Livret Foncier)' : 'Badge Notarié (Acte Notarié & Livret Foncier)'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{isAr ? 'إمكانية رفع الصور، الفيديوهات وتحديد موقع GPS' : isEn ? 'Upload photos, HD videos & exact GPS pin' : 'Photos HD, vidéos & positionnement GPS exact'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{isAr ? 'تنبيهات فورية بالرسائل عند اهتمام أي مشتري بعقارك' : isEn ? 'Instant alerts when buyers match your listing' : 'Réception directe des leads par WhatsApp & Téléphone'}</span>
              </li>
            </ul>
          </div>

          {/* Action Button */}
          <button
            id="seller-hub-post-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-950/40 transition-all transform active:scale-98 cursor-pointer flex items-center justify-center gap-3 border border-emerald-400/30 group-hover:bg-emerald-500"
          >
            <PlusCircle className="w-5 h-5" />
            <span>{isAr ? 'تسجيل ونشر عقار جديد (مجاناً)' : isEn ? 'Register & Post Property (Free)' : 'Inscrire & Publier un bien gratuitement'}</span>
            <ArrowRight className="w-4 h-4 ltr:inline rtl:hidden" />
          </button>
        </div>

        {/* CARD 2: FOR BUYERS (ACHETEURS & DEMANDES DE RECHERCHE) */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 relative overflow-hidden flex flex-col justify-between group transform hover:-translate-y-1 transition-all duration-300">
          
          {/* Subtle Accent Glow Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            {/* Header Badge */}
            <div className="flex items-center justify-between mb-6">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center gap-2">
                <Search className="w-4 h-4 text-sky-400" />
                <span>{isAr ? 'فضاء المشترين والباحثين' : isEn ? 'Buyers & Searchers Hub' : 'Espace Acheteurs & Recherche'}</span>
              </span>
              <span className="text-[11px] font-bold text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                {isAr ? 'تنبيهات واتساب مجانية' : 'Alertes WhatsApp'}
              </span>
            </div>

            {/* Title & Description */}
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit mb-3 leading-snug">
              {isAr ? 'تبحث عن شراء أو كراء عقار؟ أضف معاييرك' : isEn ? 'Looking to Buy or Rent? Submit Your Criteria' : 'Vous cherchez à acheter ou louer ? Déposez vos critères'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              {isAr
                ? 'سجّل حسابك وأضف تفاصيل طلبك (الولاية، الميزانية القصوى بالدينار الجزائري، عدد الغرف، نوع العقار). سيصلك إشعار فوري على الواتساب فور إدراج عقار يطابق طلبك!'
                : isEn
                ? 'Register & submit your exact purchase/rental requirements (Wilaya, max budget in DZD, property type). Get instant WhatsApp notifications when matched!'
                : 'Inscrivez-vous et enregistrez vos critères (Wilaya, budget DZD max, type de bien). Recevez des alertes automatiques WhatsApp & SMS dès qu\'un bien correspond !'}
            </p>

            {/* Buyer Features Checklist */}
            <ul className="space-y-3 mb-8 border-t border-white/10 pt-5 text-xs text-slate-200">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{isAr ? 'تنبيهات فورية عبر الواتساب والـ SMS والبريد' : isEn ? 'Instant alerts via WhatsApp, SMS and Email' : 'Alertes directes par WhatsApp, SMS et Email'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{isAr ? 'تحديث الميزانية بالدينار الجزائري (DZD) والولاية المحددة' : isEn ? 'Specify budget in Algerian Dinars (DZD) & Wilaya' : 'Critères personnalisés par Wilaya & Budget DZD'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{isAr ? 'التواصل المباشر مع البائعين دون وسطاء' : isEn ? 'Direct communication with sellers without middlemen' : 'Mise en relation directe avec les propriétaires'}</span>
              </li>
            </ul>
          </div>

          {/* Action Button */}
          <button
            id="buyer-hub-criteria-btn"
            onClick={onOpenCriteriaModal}
            className="w-full py-4 px-6 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-sm shadow-xl shadow-sky-950/40 transition-all transform active:scale-98 cursor-pointer flex items-center justify-center gap-3 border border-sky-400/30 group-hover:bg-sky-500"
          >
            <Bell className="w-5 h-5 text-amber-300" />
            <span>{isAr ? 'تسجيل وإضافة معايير الشراء' : isEn ? 'Register & Add Search Criteria' : 'Inscrire & Ajouter mes critères d\'achat'}</span>
            <ArrowRight className="w-4 h-4 ltr:inline rtl:hidden" />
          </button>
        </div>

        {/* CARD 3: FOR AUTO IMPORTER & BOT (ADMIN, SELLERS & BUYERS) */}
        <div className="bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-purple-500/30 relative overflow-hidden flex flex-col justify-between group transform hover:-translate-y-1 transition-all duration-300 md:col-span-2 lg:col-span-1">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            {/* Header Badge */}
            <div className="flex items-center justify-between mb-6">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-2">
                <Bot className="w-4 h-4 text-purple-300 animate-pulse" />
                <span>{isAr ? 'البوت التلقائي اليومي' : isEn ? 'Daily Scraper Bot' : 'Bot Automatique National'}</span>
              </span>
              <span className="text-[11px] font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
                Ouedkniss & FB
              </span>
            </div>

            {/* Title & Description */}
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit mb-3 leading-snug">
              {isAr ? 'استيراد وتحديث تلقائي للإعلانات الوطنية' : isEn ? 'Import & Auto-Sync National Real Estate Ads' : 'Importation & Bot Auto d\'Annonces Nationales'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              {isAr
                ? 'ميزة للمسؤولين والبائعين والمشترين لجلب وتحديث كافة الإعلانات العقارية الجديدة التي تظهر يومياً على Ouedkniss و Facebook Marketplace و Mubawab تلقائياً.'
                : isEn
                ? 'Exclusively for Admins, Sellers & Buyers to automatically fetch and update new daily listings appearing across Ouedkniss, FB Marketplace & Mubawab.'
                : 'Outil intelligent pour Administrateur, Vendeurs et Acheteurs pour importer et mettre à jour quotidiennement toutes les nouvelles annonces immobilières en Algérie.'}
            </p>

            {/* Importer Features Checklist */}
            <ul className="space-y-3 mb-8 border-t border-white/10 pt-5 text-xs text-slate-200">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>{isAr ? 'استيراد مجدول يومي بنقرة واحدة' : isEn ? 'One-click daily scheduled import' : 'Importation automatique quotidienne en 1 clic'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>{isAr ? 'ربط كروت الاتصال المباشر للمشترين والبائعين' : isEn ? 'Auto contact card creation for direct chat' : 'Cartes de contact direct WhatsApp & Téléphone'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>{isAr ? 'تغطية شاملة لـ 58 ولاية جزائرية' : isEn ? 'Full coverage across 58 Algerian Wilayas' : 'Couverture globale 58 Wilayas d\'Algérie'}</span>
              </li>
            </ul>
          </div>

          {/* Action Button */}
          <button
            id="importer-hub-btn"
            onClick={onOpenSmartImporter}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-purple-950/40 transition-all transform active:scale-98 cursor-pointer flex items-center justify-center gap-3 border border-purple-400/30"
          >
            <Bot className="w-5 h-5 text-purple-200 animate-pulse" />
            <span>{isAr ? 'استيراد الإعلانات الآن (تشغيل البوت)' : isEn ? 'Import Listings Now (Run Bot)' : 'Importer & Lancer le Bot Automatique'}</span>
            <ArrowRight className="w-4 h-4 ltr:inline rtl:hidden" />
          </button>
        </div>

      </div>
    </section>
  );
};

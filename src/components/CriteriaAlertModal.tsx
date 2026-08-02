import React, { useState } from 'react';
import { usePropertyContext } from '../context/PropertyContext';
import { useLanguage } from '../context/LanguageContext';
import { UserRoleCategory, PropertyType, TransactionType } from '../types';
import { WILAYAS_DATA } from '../data/wilayasData';
import { getWhatsAppLink, getTelLink, getSmsLink } from '../utils/communication';
import { X, Bell, Zap, CheckCircle2, Phone, MessageCircle, MessageSquare, Building2, UserCheck, ShieldCheck, Home, Send, Trash2 } from 'lucide-react';

interface CriteriaAlertModalProps {
  onClose: () => void;
}

export const CriteriaAlertModal: React.FC<CriteriaAlertModalProps> = ({ onClose }) => {
  const { language } = useLanguage();
  const {
    subscriptions,
    addSubscription,
    deleteSubscription,
    matchNotifications,
    markNotificationRead,
    setSelectedProperty,
    properties
  } = usePropertyContext();

  const [activeRoleCategory, setActiveRoleCategory] = useState<UserRoleCategory>('acheteurs');
  const [activeViewTab, setActiveViewTab] = useState<'create' | 'matches' | 'my_alerts'>('create');

  // Form State
  const [userTitle, setUserTitle] = useState('');
  const [contactName, setContactName] = useState('');
  const [gender, setGender] = useState<'homme' | 'femme'>('homme');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [searchDescription, setSearchDescription] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [wilaya, setWilaya] = useState('Alger');
  const [commune, setCommune] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType | ''>('Appartement');
  const [transactionType, setTransactionType] = useState<TransactionType | 'Tous'>('Achat');
  const [maxBudgetDZD, setMaxBudgetDZD] = useState<number>(30000000);

  const [receiveWhatsappAlerts, setReceiveWhatsappAlerts] = useState(true);
  const [receiveEmailAlerts, setReceiveEmailAlerts] = useState(true);
  const [receiveSmsAlerts, setReceiveSmsAlerts] = useState(true);

  const selectedWilayaObj = WILAYAS_DATA.find(w => w.name === wilaya) || WILAYAS_DATA[0];

  const handleWilayaChange = (selectedW: string) => {
    setWilaya(selectedW);
    setCommune(''); // reset commune to "Toutes les communes"
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactName || !phone || !email) {
      alert(language === 'AR' ? 'يرجى ملء جميع الحقول المطلوبة.' : 'Veuillez remplir les informations de contact.');
      return;
    }

    const categoryTitles = {
      acheteurs: userTitle || "Acheteur Particulier",
      vendeurs: userTitle || "Propriétaire Vendeur",
      promoteurs: userTitle || "Promoteur Immobilier",
      agences: userTitle || "Agence Immobilière Partner"
    };

    addSubscription({
      roleCategory: activeRoleCategory,
      userTitle: categoryTitles[activeRoleCategory],
      contactName,
      gender,
      email,
      phone,
      wilaya,
      commune: commune || undefined,
      propertyType: propertyType || undefined,
      transactionType,
      maxBudgetDZD: activeRoleCategory === 'acheteurs' ? maxBudgetDZD : undefined,
      receiveWhatsappAlerts,
      receiveEmailAlerts,
      receiveSmsAlerts
    });

    setActiveViewTab('matches');
  };

  const handleNotificationClick = (notif: any) => {
    markNotificationRead(notif.id);
    if (notif.propertyId) {
      const prop = properties.find(p => p.id === notif.propertyId);
      if (prop) {
        setSelectedProperty(prop);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-100 overflow-hidden my-8 flex flex-col max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-extrabold shadow-lg">
              <Zap className="w-6 h-6 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-white font-outfit">
                  {language === 'AR' ? 'شبكة التنبيهات والمطابقة الفورية' : language === 'EN' ? 'Instant Alert & Criteria Match Network' : 'Réseau d\'Alertes & Matching Instantané'}
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-500 text-slate-950 rounded-full">
                  ImmoWin Alert Engine
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {language === 'AR'
                  ? 'إشعارات فورية للمشترين والبائعين والوكلاء العقاريين واللمرقين العقاريين فور تطابق المواصفات'
                  : 'Notifications instantanées WhatsApp/SMS/Email pour acheteurs, vendeurs, promoteurs & agences.'}
              </p>
            </div>
          </div>

          <button
            id="close-criteria-modal-btn"
            onClick={onClose}
            className="px-3.5 py-2 rounded-full bg-rose-500/20 hover:bg-rose-500 text-white transition-all cursor-pointer border border-rose-400/30 flex items-center gap-1.5 font-bold text-xs shadow-md"
            title="Quitter la page (X)"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
            <span>{language === 'AR' ? 'إغلاق الصفحة (X)' : 'Quitter (X)'}</span>
          </button>
        </div>

        {/* View Selector Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2 shrink-0">
          <button
            onClick={() => setActiveViewTab('create')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeViewTab === 'create'
                ? 'border-emerald-600 text-emerald-700 bg-white rounded-t-xl border-t border-x border-slate-200'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bell className="w-4 h-4 text-amber-500" />
            <span>{language === 'AR' ? 'إنشاء تنبيه جديد' : 'Créer une Alerte Critères'}</span>
          </button>

          <button
            onClick={() => setActiveViewTab('matches')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 relative ${
              activeViewTab === 'matches'
                ? 'border-emerald-600 text-emerald-700 bg-white rounded-t-xl border-t border-x border-slate-200'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-4 h-4 text-emerald-600" />
            <span>{language === 'AR' ? 'المطابقات الفورية' : 'Matchs Instantanés'}</span>
            {matchNotifications.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                {matchNotifications.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveViewTab('my_alerts')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeViewTab === 'my_alerts'
                ? 'border-emerald-600 text-emerald-700 bg-white rounded-t-xl border-t border-x border-slate-200'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-sky-600" />
            <span>{language === 'AR' ? 'تنبيهاتي النشطة' : 'Mes Alertes Enregistrées'}</span>
            <span className="text-slate-400 font-normal">({subscriptions.length})</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 1: CREATE CRITERIA ALERT */}
          {activeViewTab === 'create' && (
            <div className="space-y-6">
              
              {/* Role Category Pills */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  1. {language === 'AR' ? 'اختر فئتك' : 'Sélectionnez votre profil d\'utilisateur :'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveRoleCategory('acheteurs')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                      activeRoleCategory === 'acheteurs'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs ring-2 ring-emerald-500/30'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Home className={`w-5 h-5 ${activeRoleCategory === 'acheteurs' ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className="font-extrabold text-xs">
                      {language === 'AR' ? 'مشتري / مستأجر' : 'Acheteur / Locataire'}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {language === 'AR' ? 'بحث عن سكن أو عقار' : 'Cherche un bien'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveRoleCategory('vendeurs')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                      activeRoleCategory === 'vendeurs'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs ring-2 ring-emerald-500/30'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <UserCheck className={`w-5 h-5 ${activeRoleCategory === 'vendeurs' ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className="font-extrabold text-xs">
                      {language === 'AR' ? 'مالك بائع' : 'Propriétaire Vendeur'}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {language === 'AR' ? 'تنبيه عند وجود مشتري' : 'Reçoit les acheteurs'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveRoleCategory('promoteurs')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                      activeRoleCategory === 'promoteurs'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs ring-2 ring-emerald-500/30'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className={`w-5 h-5 ${activeRoleCategory === 'promoteurs' ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className="font-extrabold text-xs">
                      {language === 'AR' ? 'مرقّي عقاري' : 'Promoteur Immobilier'}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {language === 'AR' ? 'تسويق المشاريع الجديدة' : 'Projets & Vefa'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveRoleCategory('agences')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                      activeRoleCategory === 'agences'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs ring-2 ring-emerald-500/30'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <ShieldCheck className={`w-5 h-5 ${activeRoleCategory === 'agences' ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className="font-extrabold text-xs">
                      {language === 'AR' ? 'وكالة عقارية' : 'Agence Immobilière'}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {language === 'AR' ? 'تغطية ولاية كاملة' : 'Mandats & Prospects'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Form Controls */}
              <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      {language === 'AR' ? 'الجنس (رجل / امرأة)' : 'Genre (Homme / Femme)'}
                    </label>
                    <select
                      value={gender}
                      onChange={e => setGender(e.target.value as 'homme' | 'femme')}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="homme">👨 Homme (M.)</option>
                      <option value="femme">👩 Femme (Mme)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      {activeRoleCategory === 'acheteurs' ? 'Nom ou Pseudonyme' : 'Nom de l\'Organisme / Agence / Nom'}
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={e => setContactName(e.target.value)}
                      placeholder="ex: Amine Benali / SARL Immo"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      {language === 'AR' ? 'رقم الهاتف (واتساب)' : 'Téléphone & WhatsApp'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="ex: 0550123456"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Email pour Alertes</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="ex: email@example.com"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      1. {language === 'AR' ? 'الولاية المستهدفة' : 'Wilaya Cible (1er Critère)'}
                    </label>
                    <select
                      value={wilaya}
                      onChange={e => handleWilayaChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                    >
                      {WILAYAS_DATA.map(w => (
                        <option key={w.code} value={w.name}>{w.code} - {w.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      2. {language === 'AR' ? 'البلدية المستهدفة' : 'Commune Cible (2ème Critère)'}
                    </label>
                    <select
                      value={commune}
                      onChange={e => setCommune(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">{language === 'AR' ? 'كل بلديات الولاية' : 'Toutes les communes (Wilaya entière)'}</option>
                      {selectedWilayaObj.communes.map(c => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      3. {language === 'AR' ? 'نوع العقار' : 'Type de Bien'}
                    </label>
                    <select
                      value={propertyType}
                      onChange={e => setPropertyType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Tous Types</option>
                      <option value="Appartement">Appartement (F1-F5)</option>
                      <option value="Villa">Villa & Duplex</option>
                      <option value="Terrain">Terrain Constructible</option>
                      <option value="Local Commercial">Local Commercial</option>
                    </select>
                  </div>
                </div>

                {/* Written Search Description Field */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    {language === 'AR' 
                      ? 'وصف مكتوب مفصّل لما تبحث عنه أو مواصفات طلبك *' 
                      : 'Description détaillée par écrit de ce que vous cherchez *'}
                  </label>
                  <textarea
                    rows={2}
                    value={searchDescription}
                    onChange={e => setSearchDescription(e.target.value)}
                    placeholder={
                      language === 'AR'
                        ? 'مثال: أبحث عن شقة F4 واسعة، مشمسة، مع مصعد وركن للسيارات بالقرب من وسائل النقل والمدرس...'
                        : 'ex: Cherche appartement F4 lumineux avec balcon, ascenseur et place de parking, proche écoles et tramway...'
                    }
                    className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Photo / Agency Logo Upload Input */}
                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">
                    {language === 'AR' 
                      ? 'إضافة صورتك أو شعار الوكالة/الشركة (اختياري)' 
                      : 'Photo de profil ou Logo Agence / Entreprise (Optionnel)'}
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg">{gender === 'femme' ? '👩' : activeRoleCategory === 'promoteurs' || activeRoleCategory === 'agences' ? '🏢' : '👨'}</span>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            if (ev.target?.result) setAvatarUrl(ev.target.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-slate-900 file:text-white hover:file:bg-slate-800 cursor-pointer"
                    />
                  </div>
                </div>

                {activeRoleCategory === 'acheteurs' && (
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      {language === 'AR' ? 'الميزانية التقريبية للمشتري (دج)' : 'Budget Maximum Souhaité (DZD)'}
                    </label>
                    <input
                      type="number"
                      value={maxBudgetDZD}
                      onChange={e => setMaxBudgetDZD(Number(e.target.value))}
                      step={1000000}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                    />
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-900 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        {language === 'AR'
                          ? 'نظام التطابق: 1. الولاية ➔ 2. البلدية ➔ 3. ميزانية المشتري مقارنة بسعر البائع (+/- 25% للتفاوض).'
                          : 'Matching IA : 1. Wilaya ➔ 2. Commune ➔ 3. Budget approximatif du bien vendeur (+/- 25% marge négociation).'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Notification Channels Checkboxes */}
                <div className="pt-2 border-t border-slate-200">
                  <span className="block text-[11px] font-bold text-slate-700 uppercase mb-2">
                    Canaux de Réception des Alertes :
                  </span>
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      <input
                        type="checkbox"
                        checked={receiveWhatsappAlerts}
                        onChange={e => setReceiveWhatsappAlerts(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                      <span>WhatsApp Direct Instantané</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-medium text-sky-800 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200">
                      <input
                        type="checkbox"
                        checked={receiveSmsAlerts}
                        onChange={e => setReceiveSmsAlerts(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <MessageSquare className="w-4 h-4 text-sky-600" />
                      <span>Message Notification In-App</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                      <input
                        type="checkbox"
                        checked={receiveEmailAlerts}
                        onChange={e => setReceiveEmailAlerts(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Email Instantané</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>
                    {language === 'AR' ? 'تفعيل مطابقة التنبيهات الفورية' : 'Activer le Matching & Alerte Instantanée'}
                  </span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: INSTANT MATCHES LIST & DIRECT CONTACT */}
          {activeViewTab === 'matches' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-amber-950">
                    {language === 'AR' ? 'المطابقات الفورية المكتشفة' : 'Correspondances Instantanées Détectées'}
                  </h4>
                  <p className="text-[11px] text-amber-800">
                    Dès qu'un nouveau bien ou acheteur correspond à vos critères, échangez immédiatement par WhatsApp, Appel ou SMS.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-bold text-xs">
                  {matchNotifications.length} Matchs
                </span>
              </div>

              {matchNotifications.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Bell className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs">Aucune notification de match pour l'instant. Créez une alerte pour en recevoir.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {matchNotifications.map(notif => (
                    <div
                      key={notif.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        notif.read ? 'bg-white border-slate-200' : 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                              {notif.roleCategory.toUpperCase()}
                            </span>
                            <span className="text-[10px] text-slate-400">{notif.date}</span>
                          </div>
                          <h4 className="font-extrabold text-slate-900 text-sm">{notif.title}</h4>
                          <p className="text-xs text-slate-600 mt-1">{notif.message}</p>
                        </div>

                        {notif.propertyId && (
                          <button
                            onClick={() => handleNotificationClick(notif)}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0 cursor-pointer"
                          >
                            Voir l'annonce
                          </button>
                        )}
                      </div>

                      {/* Communication Actions for this match */}
                      <div className="mt-3 pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                          <span>Contact : <strong className="text-slate-900">{notif.contactName}</strong></span>
                          <span dir="ltr" className="font-mono text-[11px] font-extrabold bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md border border-slate-200">
                            {notif.contactPhone}
                          </span>
                        </div>

                        <div className="flex flex-col gap-2 pt-1">
                          {/* 1. WhatsApp */}
                          <a
                            href={getWhatsAppLink(notif.contactPhone, `Bonjour ${notif.contactName}, suite à notre match sur ImmoWin concernant ${notif.title}...`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-between cursor-pointer shadow-xs"
                          >
                            <div className="flex items-center gap-2">
                              <MessageCircle className="w-3.5 h-3.5 fill-white shrink-0" />
                              <span>WhatsApp</span>
                            </div>
                            <span dir="ltr" className="font-mono text-[10px] font-bold text-emerald-100 bg-emerald-700/60 px-2 py-0.5 rounded">{notif.contactPhone}</span>
                          </a>

                          {/* 2. Phone Call */}
                          <a
                            href={getTelLink(notif.contactPhone)}
                            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-between cursor-pointer shadow-xs border border-slate-800"
                          >
                            <div className="flex items-center gap-2">
                              <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>Appeler</span>
                            </div>
                            <span dir="ltr" className="font-mono text-[10px] font-bold text-emerald-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{notif.contactPhone}</span>
                          </a>

                          {/* 3. Message Direct */}
                          <a
                            href={getSmsLink(notif.contactPhone, `Bonjour ${notif.contactName}, information pour votre annonce/demande sur ImmoWin.`)}
                            className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-between cursor-pointer shadow-xs"
                          >
                            <div className="flex items-center gap-2">
                              <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                              <span>Message</span>
                            </div>
                            <span dir="ltr" className="font-mono text-[10px] font-bold text-sky-100 bg-sky-700/60 px-2 py-0.5 rounded">{notif.contactPhone}</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SAVED ALERTS */}
          {activeViewTab === 'my_alerts' && (
            <div className="space-y-4">
              {subscriptions.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs">Vous n'avez pas encore enregistré d'alerte critères.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subscriptions.map(sub => (
                    <div key={sub.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative group">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-900 text-white uppercase">
                          {sub.roleCategory}
                        </span>
                        <button
                          onClick={() => deleteSubscription(sub.id)}
                          title="Supprimer cette alerte"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{sub.userTitle} ({sub.contactName})</h4>
                        <p className="text-xs text-slate-600 font-medium mt-0.5">
                          Wilaya : <span className="font-bold text-slate-900">{sub.wilaya}</span>
                          {sub.propertyType && <> • Type : <span className="font-bold text-slate-900">{sub.propertyType}</span></>}
                        </p>
                        {sub.maxBudgetDZD && (
                          <p className="text-xs text-emerald-700 font-bold mt-0.5">
                            Max Budget : {sub.maxBudgetDZD.toLocaleString()} DZD
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-slate-500 border-t border-slate-200 pt-2">
                        <span>Alertes :</span>
                        {sub.receiveWhatsappAlerts && <span className="text-emerald-700 font-bold">WhatsApp ✓</span>}
                        {sub.receiveEmailAlerts && <span className="text-slate-700 font-bold">Email ✓</span>}
                        {sub.receiveSmsAlerts && <span className="text-sky-700 font-bold">SMS ✓</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

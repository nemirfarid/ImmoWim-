import React, { useState } from 'react';
import { Property } from '../types';
import { formatDZD, formatSurface } from '../utils/formatters';
import { getWhatsAppLink, getTelLink, getSmsLink } from '../utils/communication';
import { usePropertyContext } from '../context/PropertyContext';
import { useLanguage } from '../context/LanguageContext';
import { translateStanding, translateLivretFoncier, translateWilayaLabel } from '../utils/languageHelpers';
import { MapWidget } from './MapWidget';
import { SEO } from './SEO';
import { X, Heart, MapPin, Maximize2, Bed, Bath, ShieldCheck, Phone, Mail, Calendar, Send, CheckCircle2, User, UserCheck, Bell, BellRing, TrendingDown, MessageCircle, MessageSquare } from 'lucide-react';


interface PropertyDetailModalProps {
  property: Property;
  onClose: () => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({ property, onClose }) => {
  const { language, t } = useLanguage();
  const { toggleFavorite, addLead, showToast } = usePropertyContext();
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'details' | 'contact' | 'map' | 'alerts' | 'buyers'>('details');

  const potentialBuyers = [
    {
      id: 'b1',
      name: 'Yacine Benali',
      role: language === 'AR' ? 'مشتري جاد - تمويل جاهز' : 'Acheteur Particulier (Budget Validé)',
      phone: '+213773474096',
      email: 'yacine.benali@gmail.com',
      wilaya: property.wilaya,
      commune: property.commune,
      maxBudgetDZD: Math.round(property.priceDZD * 1.05),
      criteria: `${property.type} à ${property.wilaya} (${property.commune})`,
      urgency: language === 'AR' ? 'بحث عاجل - عقد توثيقي مباشر' : 'Achat Urgent - Financement Disponible'
    },
    {
      id: 'b2',
      name: 'Dr. Karim Mehdi',
      role: language === 'AR' ? 'مستثمر عقاري VIP' : 'Investisseur Immobilier VIP',
      phone: '+213550123456',
      email: 'dr.mehdi@invest-dz.com',
      wilaya: property.wilaya,
      commune: 'Toute la Wilaya',
      maxBudgetDZD: Math.round(property.priceDZD * 1.15),
      criteria: `Investissement ${property.type} avec Acte & Livret`,
      urgency: language === 'AR' ? 'دفع كاش بالدينار الجزائري' : 'Paiement Cash DZD - Transaction Rapide'
    },
    {
      id: 'b3',
      name: 'Sonia Khedim & Famille',
      role: language === 'AR' ? 'عائلة مسجلة في قائمة الانتظار' : 'Famille Acheteuse Inscrite',
      phone: '+213661987654',
      email: 'sonia.khedim@yahoo.fr',
      wilaya: property.wilaya,
      commune: property.commune,
      maxBudgetDZD: Math.round(property.priceDZD * 0.98),
      criteria: `Recherche ${property.type} F4 / Villa`,
      urgency: language === 'AR' ? 'مستعدون للمعاينة الفورية' : 'Visite Immédiate Souhaitée'
    }
  ];

  // Lead inquiry form state
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [message, setMessage] = useState(`Bonjour, je suis très intéressé(e) par votre bien "${property.title}" à ${property.commune}. Merci de me recontacter.`);
  const [submitted, setSubmitted] = useState(false);

  // Price Alert state
  const [alertEmail, setAlertEmail] = useState('');
  const [alertTargetPrice, setAlertTargetPrice] = useState<number>(Math.round(property.priceDZD * 0.95));
  const [notifyPriceDrop, setNotifyPriceDrop] = useState(true);
  const [notifySimilar, setNotifySimilar] = useState(true);
  const [alertSubmitted, setAlertSubmitted] = useState(false);

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) {
      showToast("Veuillez renseigner votre nom et numéro de téléphone.");
      return;
    }

    addLead({
      clientName,
      phone: clientPhone,
      email: clientEmail || "client@immowin.dz",
      type: "demande_visite",
      propertyId: property.id,
      propertyTitle: property.title,
      wilaya: property.wilaya,
      message
    });

    setSubmitted(true);
    showToast("Votre demande de visite a été transmise à l'agent !");
  };

  const handlePriceAlertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertEmail) {
      showToast(language === 'AR' ? 'يرجى إدخال البريد الإلكتروني.' : language === 'EN' ? 'Please enter your email address.' : 'Veuillez saisir votre adresse email.');
      return;
    }

    addLead({
      clientName: "Abonné Alerte Prix",
      phone: "0000000000",
      email: alertEmail,
      type: "estimation_demande",
      propertyId: property.id,
      propertyTitle: property.title,
      wilaya: property.wilaya,
      message: `Alerte Prix souscrite: Seuil ${formatDZD(alertTargetPrice)}. Baisse de prix: ${notifyPriceDrop ? 'Oui' : 'Non'}, Biens similaires ${property.commune}: ${notifySimilar ? 'Oui' : 'Non'}`
    });

    setAlertSubmitted(true);
    showToast(
      language === 'AR' 
        ? `تم تفعيل تنبيه السعر بنجاح! ستتلقى الإشعارات على ${alertEmail}`
        : language === 'EN'
        ? `Price Alert activated! Notifications will be sent to ${alertEmail}`
        : `Alerte Prix activée ! Vous recevrez les notifications sur ${alertEmail}`
    );
  };

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    'name': property.title,
    'description': property.description,
    'image': property.images,
    'offers': {
      '@type': 'Offer',
      'price': property.priceDZD,
      'priceCurrency': 'DZD',
      'availability': 'https://schema.org/InStock',
      'validFrom': property.dateAdded
    },
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': property.commune,
      'addressRegion': property.wilaya,
      'addressCountry': 'DZ'
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <SEO
        title={`${property.title} - ${property.wilaya} (${formatDZD(property.priceDZD)})`}
        description={`${property.type} à ${property.transactionType === 'Vente' ? 'vendre' : 'louer'} à ${property.commune}, Wilaya de ${property.wilaya} (${property.neighborhood}). ${property.rooms} pièces, ${property.surfaceM2} m². Prix: ${formatDZD(property.priceDZD)}. Acte notarié et livret foncier disponible.`}
        keywords={`${property.type}, ${property.wilaya}, ${property.commune}, ${property.transactionType === 'Vente' ? 'vente' : 'location'}, immobilier Algérie, ${formatDZD(property.priceDZD)}`}
        ogImage={property.images[0]}
        ogType="product"
        structuredData={schemaData}
      />
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col relative"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Modal Top Bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-slate-900 text-white">
              {property.status}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Réf: {property.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id={`detail-alert-btn-${property.id}`}
              onClick={() => setActiveTab('alerts')}
              title="Alerte Baisse de Prix"
              className={`p-2 py-1.5 rounded-full transition-colors cursor-pointer flex items-center gap-1.5 px-3 text-xs font-bold border ${
                alertSubmitted || activeTab === 'alerts'
                  ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                  : 'bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-700 border-slate-200'
              }`}
            >
              <Bell className={`w-4 h-4 ${alertSubmitted ? 'fill-amber-500 text-amber-600' : 'text-amber-500'}`} />
              <span className="hidden sm:inline">
                {alertSubmitted
                  ? (language === 'AR' ? 'التنبيه مفعّل' : language === 'EN' ? 'Alert Active' : 'Alerte active')
                  : (language === 'AR' ? 'تنبيه السعر' : language === 'EN' ? 'Price Alert' : 'Alerte Prix')}
              </span>
            </button>
            <button
              id={`detail-fav-${property.id}`}
              onClick={() => toggleFavorite(property.id)}
              className="p-2.5 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-500 transition-colors cursor-pointer border border-slate-200"
            >
              <Heart className={`w-5 h-5 ${property.isFavorite ? 'text-rose-500 fill-rose-500' : ''}`} />
            </button>
            <button
              id="detail-modal-close-btn"
              onClick={onClose}
              className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer border border-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-8">
          
          {/* Main Title & Price Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>{property.wilaya}, {property.commune} ({property.neighborhood})</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit">
                {(language === 'AR' && property.titleAr) ? property.titleAr : property.title}
              </h2>

              {/* Registered Seller & Contact Pill */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold border border-emerald-300">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{language === 'AR' ? 'البائع المسجل:' : 'Vendeur Inscrit :'} <strong>{property.sellerName}</strong></span>
                </div>

                <a
                  href={`https://wa.me/${property.sellerPhone.replace(/\s+/g, '').replace(/^0/, '213')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <Phone className="w-3 h-3 text-white" />
                  <span dir="ltr" className="ltr [direction:ltr]">{property.sellerPhone}</span>
                </a>
              </div>
            </div>

            <div className="text-left md:text-right">
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                {language === 'AR' ? 'سعر البيع' : language === 'EN' ? 'Selling Price' : 'Prix de vente'}
              </span>
              <span dir="ltr" className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-outfit inline-block ltr [direction:ltr]">
                {formatDZD(property.priceDZD)}
              </span>
              {property.transactionType === 'Location' && (
                <span className="text-xs font-semibold text-slate-500 block">/ mois</span>
              )}
            </div>
          </div>

          {/* Media Header (Photos & Videos Player Toggle) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedImgIdx(0)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedImgIdx >= 0 && selectedImgIdx < property.images.length
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>📷 Photos ({property.images.length})</span>
                </button>

                {property.videos && property.videos.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedImgIdx(-1)} // -1 indicates video player mode
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedImgIdx === -1
                        ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                        : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <span>🎥 Visite Vidéo Virtual HD ({property.videos.length})</span>
                  </button>
                )}
              </div>

              {property.coordinates && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${property.coordinates.lat},${property.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 px-3 py-1 rounded-xl border border-sky-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-sky-600" />
                  <span>GPS: {property.coordinates.lat.toFixed(4)}, {property.coordinates.lng.toFixed(4)} ↗</span>
                </a>
              )}
            </div>

            {/* Display Media Box */}
            <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-slate-950 shadow-lg">
              {selectedImgIdx === -1 && property.videos && property.videos[0] ? (
                <video
                  src={property.videos[0]}
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={property.images[selectedImgIdx >= 0 ? selectedImgIdx : 0] || property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>

            {/* Gallery Thumbnails & Video Badges */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {property.images.map((img, idx) => (
                <button
                  key={`img-${idx}`}
                  onClick={() => setSelectedImgIdx(idx)}
                  className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 transition-all border-2 cursor-pointer ${
                    selectedImgIdx === idx ? 'border-emerald-600 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}

              {property.videos && property.videos.map((vid, vIdx) => (
                <button
                  key={`vid-${vIdx}`}
                  onClick={() => setSelectedImgIdx(-1)}
                  className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 transition-all border-2 bg-slate-900 flex items-center justify-center text-white cursor-pointer ${
                    selectedImgIdx === -1 ? 'border-amber-400 scale-105 shadow-md' : 'border-slate-700 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] font-black">
                      ▶
                    </div>
                    <span className="text-[9px] font-extrabold text-amber-300">Vidéo HD</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Specs Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-xs border border-slate-200">
                <Maximize2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  {language === 'AR' ? 'المساحة' : 'Surface'}
                </span>
                <p dir="ltr" className="text-sm font-bold text-slate-900 ltr [direction:ltr]">{formatSurface(property.surfaceM2)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-xs border border-slate-200">
                <Bed className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  {language === 'AR' ? 'الغرف' : 'Pièces'}
                </span>
                <p dir="ltr" className="text-sm font-bold text-slate-900 ltr [direction:ltr]">
                  {property.rooms} ({property.bedrooms} {language === 'AR' ? 'غرف نوم' : 'Chambres'})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-xs border border-slate-200">
                <Bath className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  {language === 'AR' ? 'الحمامات' : 'Salles de bain'}
                </span>
                <p dir="ltr" className="text-sm font-bold text-slate-900 ltr [direction:ltr]">{property.bathrooms}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-xs border border-slate-200">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  {language === 'AR' ? 'التوثيق والجودة' : 'Qualité'}
                </span>
                <p className="text-xs font-bold text-slate-900">
                  {translateStanding(property.standing, language)}
                </p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap border-b border-slate-200 gap-1">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-3 px-4 text-sm font-bold transition-all cursor-pointer border-b-2 ${
                activeTab === 'details' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {language === 'AR' ? 'الوصف والعرض' : language === 'EN' ? 'Description & Offer' : 'Description & Offre'}
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`pb-3 px-4 text-sm font-bold transition-all cursor-pointer border-b-2 ${
                activeTab === 'contact' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {language === 'AR' ? 'الاتصال بالوكيل / المعاينة' : language === 'EN' ? 'Contact Agent' : 'Contacter l\'Agent'}
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`pb-3 px-4 text-sm font-bold transition-all cursor-pointer border-b-2 ${
                activeTab === 'map' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {language === 'AR' ? 'الخريطة والموقع' : language === 'EN' ? 'Location Map' : 'Localisation & Carte'}
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`pb-3 px-4 text-sm font-bold transition-all cursor-pointer border-b-2 flex items-center gap-1.5 ${
                activeTab === 'alerts' ? 'border-amber-500 text-amber-700' : 'border-transparent text-amber-600 hover:text-amber-800'
              }`}
            >
              <Bell className="w-4 h-4 text-amber-500" />
              <span>{language === 'AR' ? 'تنبيه السعر' : language === 'EN' ? 'Price Alert' : 'Alerte Prix'}</span>
            </button>
            <button
              onClick={() => setActiveTab('buyers')}
              className={`pb-3 px-4 text-sm font-bold transition-all cursor-pointer border-b-2 flex items-center gap-1.5 ${
                activeTab === 'buyers' ? 'border-sky-600 text-sky-700 font-extrabold' : 'border-transparent text-sky-600 hover:text-sky-800'
              }`}
            >
              <UserCheck className="w-4 h-4 text-sky-600" />
              <span>{language === 'AR' ? 'المشترون المحتملون (3)' : language === 'EN' ? 'Potential Buyers (3)' : 'Acheteurs Potentiels (3)'}</span>
            </button>
          </div>

          {/* Tab Content: Details */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-bold text-slate-900 mb-2">{t.propertyDescription}</h4>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {(language === 'AR' && property.descriptionAr) ? property.descriptionAr : property.description}
                </p>
              </div>

              {/* Administrative Badges */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2 text-emerald-900 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{translateLivretFoncier(language)} {language === 'AR' ? 'متوفر 100%' : 'Disponible'}</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-900 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'AR' ? 'معاملة آمنة بالدينار الجزائري' : 'Transaction Sécurisée DZD'}</span>
                </div>
              </div>

              {/* Price Alert CTA Banner */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
                    <TrendingDown className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-amber-950">
                      {language === 'AR' ? 'هل تريد متابعة سعر هذا العقار؟' : language === 'EN' ? 'Want to track price drops for this property?' : 'Vous souhaitez suivre l\'évolution du prix de ce bien ?'}
                    </h5>
                    <p className="text-[11px] text-amber-800">
                      {language === 'AR' ? 'تلقَّ تنبيهًا بالبريد الإلكتروني فور انخفاض السعر أو نشر عقار مشابه.' : language === 'EN' ? 'Get an email alert as soon as the price drops or a similar deal appears.' : 'Recevez un email dès que le prix baisse ou qu\'un bien similaire est publié.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('alerts')}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-xs transition-colors shrink-0 cursor-pointer flex items-center gap-1.5"
                >
                  <Bell className="w-3.5 h-3.5 fill-slate-950" />
                  <span>{language === 'AR' ? 'تفعيل الإشعار' : language === 'EN' ? 'Set Alert' : 'Créer l\'alerte'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab Content: Contact Form & Seller Card */}
          {activeTab === 'contact' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Seller Contact Card */}
              <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center font-bold text-lg shadow-md">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-white">{property.sellerName}</h4>
                    <p className="text-xs text-emerald-400 font-medium">
                      {language === 'AR' ? 'وكيل عقاري معتمد ImmoWin' : language === 'EN' ? 'Certified ImmoWin Agent' : 'Agent Certifié ImmoWin'}
                    </p>
                  </div>
                </div>

                {/* Direct Action Buttons: WhatsApp, Call, SMS */}
                <div className="space-y-3 pt-2 text-xs">
                  
                  {/* Phone Number Badge Card (Separated) */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Phone className="w-4 h-4 text-emerald-400" />
                      <span className="font-semibold text-xs">
                        {language === 'AR' ? 'رقم الاتصال المباشر:' : 'Numéro de Téléphone :'}
                      </span>
                    </div>
                    <span dir="ltr" className="font-mono text-sm font-extrabold text-emerald-400 tracking-wider">
                      {property.sellerPhone}
                    </span>
                  </div>

                  {/* Separated Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* Separate WhatsApp Button */}
                    <a
                      id={`detail-whatsapp-${property.id}`}
                      href={getWhatsAppLink(property.sellerPhone, `Bonjour, je suis très intéressé(e) par votre annonce "${property.title}" à ${property.commune}, ${property.wilaya}. Pourriez-vous me fournir plus de détails ?`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-md cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 fill-white shrink-0" />
                      <span>{language === 'AR' ? 'محادثة واتساب' : 'Discussion WhatsApp'}</span>
                    </a>

                    {/* Separate Phone Call Button */}
                    <a
                      id={`detail-tel-${property.id}`}
                      href={getTelLink(property.sellerPhone)}
                      className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all border border-slate-700 cursor-pointer"
                    >
                      <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{language === 'AR' ? 'اتصال هاتف' : 'Appel Téléphonique'}</span>
                    </a>
                  </div>

                  <a href={`mailto:${property.sellerEmail}`} className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition-colors text-slate-300">
                    <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate">{property.sellerEmail}</span>
                  </a>
                </div>

                <p className="text-[11px] text-slate-400 italic pt-1">
                  * {language === 'AR' 
                    ? 'يمكن للمشترين والبائعين والوكلاء والمهندسين المعماريين/المطورين التواصل فورًا عبر هذه القنوات.'
                    : language === 'EN'
                    ? 'Buyers, sellers, agents, and developers can connect instantly through these channels.'
                    : 'Acheteurs, vendeurs, agences et promoteurs peuvent échanger instantanément.'}
                </p>
              </div>

              {/* Schedule Visit Form */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>
                    {language === 'AR' ? 'طلب معاينة خاصة للعقار' : language === 'EN' ? 'Request a Private Visit' : 'Demander une visite privée'}
                  </span>
                </h4>

                {submitted ? (
                  <div className="p-4 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-semibold text-center">
                    👍 {language === 'AR' ? `تم إرسال طلبك بنجاح! سيتصل بك الوكيل قريباً على الرقم ${clientPhone}.` : `Votre demande a été reçue ! L'agent vous contactera sous peu au ${clientPhone}.`}
                  </div>
                ) : (
                  <form onSubmit={handleSubmitInquiry} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        {language === 'AR' ? 'الاسم الكامل' : language === 'EN' ? 'Full Name' : 'Votre Nom Complet'}
                      </label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={e => setClientName(e.target.value)}
                        placeholder={language === 'AR' ? 'مثال: أمين بن علي' : 'Ex: Amine Benali'}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        {language === 'AR' ? 'رقم الهاتف' : language === 'EN' ? 'Phone Number' : 'Numéro de Téléphone'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={clientPhone}
                        onChange={e => setClientPhone(e.target.value)}
                        placeholder="Ex: 0550 12 34 56"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        {language === 'AR' ? 'الرسالة' : language === 'EN' ? 'Message' : 'Message'}
                      </label>
                      <textarea
                        rows={3}
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500/50"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>
                        {language === 'AR' ? 'إرسال طلب المعاينة' : language === 'EN' ? 'Send Visit Request' : 'Envoyer ma demande'}
                      </span>
                    </button>
                  </form>
                )}
              </div>

            </div>
          )}

          {/* Tab Content: Map Widget */}
          {activeTab === 'map' && (
            <MapWidget
              wilaya={property.wilaya}
              commune={property.commune}
              priceDZD={property.priceDZD}
            />
          )}

          {/* Tab Content: Price Alert Subscription */}
          {activeTab === 'alerts' && (
            <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold shrink-0 border border-amber-500/30">
                  <BellRing className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-extrabold text-white font-outfit mb-1">
                    {language === 'AR' ? 'تنبيه انخفاض السعر والعروض الجديدة' : language === 'EN' ? 'Price Drop & New Listings Alert' : 'Alerte Baisse de Prix & Nouveautés'}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {language === 'AR' 
                      ? `احصل على إشعارات فورية عبر البريد الإلكتروني عند تخفيض سعر هذا العقار أو نشر عقارات مماثلة في ${property.commune}، ${property.wilaya}.`
                      : language === 'EN'
                      ? `Receive instant email updates when this property drops in price or when similar ${property.type} listings are published in ${property.commune}, ${property.wilaya}.`
                      : `Soyez notifié par email immédiatement en cas de baisse de prix sur cette annonce ou dès qu'un bien similaire (${property.type}) est publié à ${property.commune}, ${property.wilaya}.`}
                  </p>
                </div>
              </div>

              {alertSubmitted ? (
                <div className="p-5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-emerald-400">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>{language === 'AR' ? 'تنبيه السعر مفعّل لهذا العقار!' : language === 'EN' ? 'Price Alert Active for this property!' : 'Alerte Prix Active pour ce bien !'}</span>
                  </div>
                  <p className="text-xs text-emerald-200">
                    {language === 'AR' 
                      ? `سنرسل التنبيهات إلى ${alertEmail} فور حدوث أي تغيير أو انخفاض بالسعر تحت ${formatDZD(alertTargetPrice)}.`
                      : language === 'EN'
                      ? `We will email ${alertEmail} as soon as the price drops below ${formatDZD(alertTargetPrice)} or similar properties match.`
                      : `Nous enverrons un email à ${alertEmail} dès que le prix descendra sous ${formatDZD(alertTargetPrice)} ou que des biens similaires seront disponibles.`}
                  </p>
                  <button
                    type="button"
                    onClick={() => setAlertSubmitted(false)}
                    className="mt-2 text-xs text-amber-400 underline font-semibold cursor-pointer hover:text-amber-300"
                  >
                    {language === 'AR' ? 'تعديل تفضيلات التنبيه' : language === 'EN' ? 'Edit Alert Preferences' : 'Modifier les préférences de l\'alerte'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePriceAlertSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1.5">
                        {language === 'AR' ? 'البريد الإلكتروني للإشعارات' : language === 'EN' ? 'Notification Email' : 'Email pour les alertes'}
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={alertEmail}
                          onChange={e => setAlertEmail(e.target.value)}
                          placeholder="ex: amine@example.com"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-slate-400 focus:ring-2 focus:ring-amber-400/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1.5">
                        {language === 'AR' ? 'السعر المستهدف (د.ج)' : language === 'EN' ? 'Target Price Alert (DZD)' : 'Seuil de prix souhaité (DZD)'}
                      </label>
                      <div className="relative">
                        <TrendingDown className="w-4 h-4 absolute left-3 top-3 text-amber-400" />
                        <input
                          type="number"
                          value={alertTargetPrice}
                          onChange={e => setAlertTargetPrice(Number(e.target.value))}
                          step={500000}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white font-bold font-outfit focus:ring-2 focus:ring-amber-400/50"
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        {language === 'AR' ? 'السعر الحالي:' : language === 'EN' ? 'Current price:' : 'Prix actuel:'} {formatDZD(property.priceDZD)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <label className="flex items-center gap-3 text-xs text-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifyPriceDrop}
                        onChange={e => setNotifyPriceDrop(e.target.checked)}
                        className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-white/10 border-white/20"
                      />
                      <span>
                        {language === 'AR' ? 'تنبيهي فور انخفاض سعر هذا العقار' : language === 'EN' ? 'Notify me when this property drops in price' : 'M\'alerter en cas de baisse de prix sur cette annonce'}
                      </span>
                    </label>

                    <label className="flex items-center gap-3 text-xs text-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifySimilar}
                        onChange={e => setNotifySimilar(e.target.checked)}
                        className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-white/10 border-white/20"
                      />
                      <span>
                        {language === 'AR' 
                          ? `تنبيهي عند توفر عقارات مماثلة (${property.type}) في ${property.commune}`
                          : language === 'EN'
                          ? `Notify me of similar ${property.type} listings in ${property.commune}`
                          : `M'alerter si un bien similaire (${property.type}) est mis en vente à ${property.commune}`}
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Bell className="w-4 h-4 fill-slate-950" />
                    <span>{language === 'AR' ? 'تفعيل تنبيه السعر الآن' : language === 'EN' ? 'Activate Price Alert Now' : 'Activer mon alerte prix maintenant'}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Tab Content: Potential Buyers List */}
          {activeTab === 'buyers' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shrink-0">
                    <UserCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-sky-950 font-outfit">
                      {language === 'AR' ? 'المشترون المحتملون المطابقون لهذا العقار' : 'Acheteurs Potentiels Qualifiés (Matching IA)'}
                    </h4>
                    <p className="text-xs text-sky-800">
                      {language === 'AR'
                        ? `يوجد ${potentialBuyers.length} مشترين مسجلين ميزانيتهم تتوافق مع سعر هذا العقار (${formatDZD(property.priceDZD)}).`
                        : `${potentialBuyers.length} membres acheteurs inscrits recherchent ce type de bien à ${property.wilaya}.`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {potentialBuyers.map(buyer => (
                  <div key={buyer.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 font-extrabold flex items-center justify-center text-sm shadow-xs">
                          {buyer.name.charAt(0)}
                        </div>
                        <div>
                          <h5 className="font-extrabold text-xs text-slate-900">{buyer.name}</h5>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 block mt-0.5">
                            ✓ {buyer.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs border-t border-slate-100 pt-3">
                      <div className="flex justify-between text-slate-600">
                        <span className="font-bold">{language === 'AR' ? 'الميزانية القصوى:' : 'Budget Max:'}</span>
                        <span className="font-extrabold text-emerald-700">{formatDZD(buyer.maxBudgetDZD)}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span className="font-bold">{language === 'AR' ? 'الموقع المطلوب:' : 'Wilaya Cible:'}</span>
                        <span className="font-semibold text-slate-800">{buyer.wilaya} ({buyer.commune})</span>
                      </div>
                      <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg italic">
                        "{buyer.urgency}"
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                      <a
                        href={getWhatsAppLink(buyer.phone, `Bonjour ${buyer.name}, je vous contacte depuis ImmoWin concernant votre recherche de bien à ${property.wilaya}. Nous avons un(e) ${property.title} disponible à ${formatDZD(property.priceDZD)}.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4 fill-white shrink-0" />
                        <span>WhatsApp</span>
                        <span dir="ltr" className="font-mono text-[10px] text-emerald-100">({buyer.phone})</span>
                      </a>

                      <a
                        href={getTelLink(buyer.phone)}
                        className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{language === 'AR' ? 'اتصال' : 'Appeler'}</span>
                        <span dir="ltr" className="font-mono text-[10px] text-emerald-300">({buyer.phone})</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

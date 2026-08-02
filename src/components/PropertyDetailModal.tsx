import React, { useState, useRef } from 'react';
import { Property, PropertyStatus } from '../types';
import { formatDZD, formatSurface } from '../utils/formatters';
import { getWhatsAppLink, getTelLink, getSmsLink } from '../utils/communication';
import { usePropertyContext } from '../context/PropertyContext';
import { useLanguage } from '../context/LanguageContext';
import { translateStanding, translateLivretFoncier, translateWilayaLabel } from '../utils/languageHelpers';
import { MapWidget } from './MapWidget';
import { SEO } from './SEO';
import { X, Heart, MapPin, Maximize2, Bed, Bath, ShieldCheck, Phone, Mail, Calendar, Send, CheckCircle2, User, UserCheck, Bell, BellRing, TrendingDown, MessageCircle, MessageSquare, Edit2, Trash2, Save, Upload, Plus, Play, Camera, Video, FileText } from 'lucide-react';
import { PropertyType, TransactionType } from '../types';


interface PropertyDetailModalProps {
  property: Property;
  onClose: () => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({ property, onClose }) => {
  const { language, t } = useLanguage();
  const { toggleFavorite, addLead, updateProperty, deleteProperty, showToast } = usePropertyContext();
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'details' | 'contact' | 'map' | 'alerts' | 'buyers'>('details');

  const modalContainerRef = useRef<HTMLDivElement>(null);

  // Edit Mode state with full property parameters
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(property.title);
  const [editTitleAr, setEditTitleAr] = useState(property.titleAr || '');
  const [editType, setEditType] = useState<PropertyType>(property.type);
  const [editTransactionType, setEditTransactionType] = useState<TransactionType>(property.transactionType);
  const [editPrice, setEditPrice] = useState(property.priceDZD);
  const [editWilaya, setEditWilaya] = useState(property.wilaya);
  const [editCommune, setEditCommune] = useState(property.commune);
  const [editNeighborhood, setEditNeighborhood] = useState(property.neighborhood || '');
  const [editSurface, setEditSurface] = useState(property.surfaceM2);
  const [editRooms, setEditRooms] = useState(property.rooms);
  const [editBedrooms, setEditBedrooms] = useState(property.bedrooms);
  const [editBathrooms, setEditBathrooms] = useState(property.bathrooms);
  const [editFloor, setEditFloor] = useState(property.floor || 0);
  const [editStanding, setEditStanding] = useState(property.standing);
  const [editHasActAndLivret, setEditHasActAndLivret] = useState(property.hasActAndLivret);
  const [editHasElevator, setEditHasElevator] = useState(property.hasElevator);
  const [editHasGarage, setEditHasGarage] = useState(property.hasGarage);
  const [editHasSeaView, setEditHasSeaView] = useState(property.hasSeaView);
  const [editHasPool, setEditHasPool] = useState(property.hasPool);
  const [editSellerName, setEditSellerName] = useState(property.sellerName);
  const [editSellerPhone, setEditSellerPhone] = useState(property.sellerPhone);
  const [editSellerEmail, setEditSellerEmail] = useState(property.sellerEmail || '');
  const [editDescription, setEditDescription] = useState(property.description);
  const [editDescriptionAr, setEditDescriptionAr] = useState(property.descriptionAr || '');
  const [editStatus, setEditStatus] = useState<PropertyStatus>(property.status);
  
  const [editImages, setEditImages] = useState<string[]>(property.images || []);
  const [editVideos, setEditVideos] = useState<string[]>(property.videos || []);
  const [newImgInput, setNewImgInput] = useState('');
  const [newVidInput, setNewVidInput] = useState('');
  const [isVideoMuted, setIsVideoMuted] = useState(false);

  // Compress image helper
  const compressImageFile = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1200;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddEditPhotoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const fileList: File[] = Array.from(files);
    const compressed = await Promise.all(fileList.map((f: File) => compressImageFile(f)));
    setEditImages(prev => [...prev, ...compressed]);
    showToast(`${files.length} nouvelle(s) photo(s) ajoutée(s) !`);
  };

  const handleAddEditPhotoUrl = () => {
    if (!newImgInput.trim()) return;
    setEditImages(prev => [...prev, newImgInput.trim()]);
    setNewImgInput('');
    showToast("URL de photo ajoutée !");
  };

  const handleRemoveEditPhoto = (idx: number) => {
    setEditImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAddEditVideoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const fileList: File[] = Array.from(files);
    fileList.forEach((file: File) => {
      const objectUrl = URL.createObjectURL(file);
      setEditVideos(prev => [...prev, objectUrl]);
    });
    showToast(`${files.length} vidéo(s) ajoutée(s) !`);
  };

  const handleAddEditVideoUrl = () => {
    if (!newVidInput.trim()) return;
    setEditVideos(prev => [...prev, newVidInput.trim()]);
    setNewVidInput('');
    showToast("URL vidéo ajoutée !");
  };

  const handleAddPresetVideo = (url: string) => {
    if (!editVideos.includes(url)) {
      setEditVideos(prev => [...prev, url]);
      showToast("Vidéo démo HD ajoutée à l'annonce !");
    }
  };

  const handleRemoveEditVideo = (idx: number) => {
    setEditVideos(prev => prev.filter((_, i) => i !== idx));
  };

  const potentialBuyers = [
    {
      id: 'b1',
      name: 'Yacine Benali',
      gender: 'homme' as const,
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
      gender: 'homme' as const,
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
      name: 'Mme Sonia Khedim',
      gender: 'femme' as const,
      role: language === 'AR' ? 'عائلة مسجلة في قائمة الانتظار' : 'Famille Acheteuse Inscrite',
      phone: '+213661987654',
      email: 'sonia.khedim@yahoo.fr',
      wilaya: property.wilaya,
      commune: property.commune,
      maxBudgetDZD: Math.round(property.priceDZD * 0.98),
      criteria: `Recherche ${property.type} F4 / Villa`,
      urgency: language === 'AR' ? 'مستعدون للمعاينة الفورية' : 'Visite Immédiate Souhaitée'
    },
    {
      id: 'b4',
      name: 'Mme Amel Zerrouki',
      gender: 'femme' as const,
      role: language === 'AR' ? 'مشترية مسجلة' : 'Acheteuse Inscrite Certifiée',
      phone: '+213555223344',
      email: 'amel.zerrouki@gmail.com',
      wilaya: property.wilaya,
      commune: property.commune,
      maxBudgetDZD: Math.round(property.priceDZD * 1.02),
      criteria: `Achat Appartement / Villa`,
      urgency: language === 'AR' ? 'تمويل جاهز' : 'Accord de Banque Validé'
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

  const [videoError, setVideoError] = useState(false);

  const handleGoToBuyers = () => {
    setActiveTab('buyers');
    setTimeout(() => {
      const el = document.getElementById('potential-buyers-section');
      if (modalContainerRef.current && el) {
        modalContainerRef.current.scrollTo({
          top: el.offsetTop - 30,
          behavior: 'smooth'
        });
      }
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
  };

  const handleSavePropertyEdit = () => {
    updateProperty(property.id, {
      title: editTitle,
      titleAr: editTitleAr,
      type: editType,
      transactionType: editTransactionType,
      priceDZD: Number(editPrice),
      wilaya: editWilaya,
      commune: editCommune,
      neighborhood: editNeighborhood,
      surfaceM2: Number(editSurface),
      rooms: Number(editRooms),
      bedrooms: Number(editBedrooms),
      bathrooms: Number(editBathrooms),
      floor: Number(editFloor),
      standing: editStanding,
      hasActAndLivret: editHasActAndLivret,
      hasElevator: editHasElevator,
      hasGarage: editHasGarage,
      hasSeaView: editHasSeaView,
      hasPool: editHasPool,
      sellerName: editSellerName,
      sellerPhone: editSellerPhone,
      sellerEmail: editSellerEmail,
      description: editDescription,
      descriptionAr: editDescriptionAr,
      status: editStatus,
      images: editImages.length > 0 ? editImages : property.images,
      videos: editVideos
    });
    setIsEditMode(false);
    showToast("Annonce et médias modifiés avec succès !");
  };

  const handleDeleteProperty = () => {
    if (window.confirm(language === 'AR' ? 'هل أنت تأكد من رغبتك في حذف هذا الإعلان؟' : 'Voulez-vous vraiment supprimer cette annonce immobilière ?')) {
      deleteProperty(property.id);
      onClose();
      showToast(language === 'AR' ? 'تم حذف الإعلان بنجاح' : "L'annonce a été supprimée définitivement.");
    }
  };

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
        ref={modalContainerRef}
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
            {/* Edit Button */}
            <button
              id={`detail-edit-btn-${property.id}`}
              onClick={() => setIsEditMode(!isEditMode)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                isEditMode ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border-slate-200'
              }`}
              title="Modifier l'annonce"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isEditMode ? 'Annuler l\'édition' : 'Modifier'}</span>
            </button>

            {/* Delete Button */}
            <button
              id={`detail-delete-btn-${property.id}`}
              onClick={handleDeleteProperty}
              className="px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-600 border border-slate-200"
              title="Supprimer définitivement l'annonce"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Supprimer</span>
            </button>

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
              className="px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-rose-600 text-white font-extrabold text-xs transition-colors cursor-pointer border border-slate-800 shadow-md flex items-center gap-1.5"
              title="Quitter la page (X)"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
              <span>{language === 'AR' ? 'إغلاق (X)' : 'Quitter (X)'}</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-8">

          {/* Prominent Blinking Alert Banner for Potential Buyers at the VERY TOP before title */}
          <div 
            id="modal-top-buyers-alert-banner"
            onClick={handleGoToBuyers}
            className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white shadow-xl border-2 border-sky-400/80 animate-pulse cursor-pointer hover:border-sky-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
          >
            <div className="flex items-center gap-3.5">
              <div className="relative flex h-11 w-11 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-2xl bg-sky-400 opacity-75"></span>
                <div className="relative rounded-2xl bg-sky-500 text-slate-950 flex items-center justify-center font-black p-2.5 shadow-md">
                  <UserCheck className="w-6 h-6 text-slate-950" />
                </div>
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-black uppercase tracking-wider mb-1 border border-sky-400/30">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
                  {language === 'AR' ? '🔥 تنبيه هامات للمشترين المعتمدين' : '🔥 ALERTE ACHETEURS QUALIFIÉS (1-CLIC)'}
                </div>
                <h4 className="text-base sm:text-lg font-black text-white font-outfit">
                  {language === 'AR' 
                    ? `⚡ ${potentialBuyers.length} مشترين محتملين (رجال ونساء) مسجلين لهذا العقار في ${property.wilaya}!`
                    : `⚡ ${potentialBuyers.length} Acheteurs Potentiels Qualifiés (Hommes & Femmes) recherchent ce bien à ${property.wilaya} !`}
                </h4>
                <p className="text-xs text-sky-200 font-medium mt-0.5">
                  {language === 'AR' 
                    ? 'انقر هنا فوراً لفتح قائمة أرقام الهواتف والواتساب والتواصل معهم.'
                    : 'Cliquez ici en 1 clic pour afficher directement leurs numéros de téléphone et WhatsApp !'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleGoToBuyers(); }}
              className="px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs shadow-lg transition-all shrink-0 flex items-center gap-2 group-hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-slate-950 fill-slate-950" />
              <span>{language === 'AR' ? 'عرض أرقام الهواتف' : 'Voir Numéros & Coordonnées'} &rarr;</span>
            </button>
          </div>
          
          {/* Inline Full Edit Form when isEditMode is active */}
          {isEditMode && (
            <div className="p-5 rounded-2xl bg-emerald-50/90 border-2 border-emerald-400 space-y-5 animate-in fade-in duration-200 shadow-md">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
                <div>
                  <h4 className="font-extrabold text-base text-emerald-950 flex items-center gap-2">
                    <Edit2 className="w-5 h-5 text-emerald-700" />
                    <span>Modification de tous les paramètres du bien (Réf: {property.id})</span>
                  </h4>
                  <p className="text-xs text-emerald-700">Vous pouvez modifier les informations, ajouter/supprimer des photos ou des vidéos.</p>
                </div>
                <button
                  onClick={() => setIsEditMode(false)}
                  className="p-1.5 text-slate-500 hover:text-slate-800 bg-white rounded-full border border-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Grid Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Titre FR */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Titre de l'annonce (Français) :</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Titre AR */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Titre de l'annonce (Arabe) :</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={editTitleAr}
                    onChange={e => setEditTitleAr(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Type de Bien */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Type de Bien :</label>
                  <select
                    value={editType}
                    onChange={e => setEditType(e.target.value as PropertyType)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Appartement">Appartement</option>
                    <option value="Villa">Villa</option>
                    <option value="Duplex">Duplex</option>
                    <option value="Terrain">Terrain</option>
                    <option value="Local Commercial">Local Commercial</option>
                    <option value="Niveau de Villa">Niveau de Villa</option>
                    <option value="Immeuble">Immeuble</option>
                    <option value="Studio">Studio</option>
                  </select>
                </div>

                {/* Type Transaction */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Transaction :</label>
                  <select
                    value={editTransactionType}
                    onChange={e => setEditTransactionType(e.target.value as TransactionType)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Achat">A Vendre (Achat)</option>
                    <option value="Location">A Louer (Location)</option>
                  </select>
                </div>

                {/* Statut */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Statut Annonce :</label>
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value as PropertyStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="A Vendre">A Vendre</option>
                    <option value="A Louer">A Louer</option>
                    <option value="Sous Offre">Sous Offre</option>
                    <option value="Vendu">Vendu</option>
                  </select>
                </div>

                {/* Prix DZD */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Prix (DZD) :</label>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={e => setEditPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-emerald-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Surface m2 */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Surface (m²) :</label>
                  <input
                    type="number"
                    value={editSurface}
                    onChange={e => setEditSurface(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Wilaya */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Wilaya :</label>
                  <input
                    type="text"
                    value={editWilaya}
                    onChange={e => setEditWilaya(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Commune */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Commune :</label>
                  <input
                    type="text"
                    value={editCommune}
                    onChange={e => setEditCommune(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Quartier */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Quartier / Cité :</label>
                  <input
                    type="text"
                    value={editNeighborhood}
                    onChange={e => setEditNeighborhood(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Rooms */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pièces Total :</label>
                  <input
                    type="number"
                    value={editRooms}
                    onChange={e => setEditRooms(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Chambres :</label>
                  <input
                    type="number"
                    value={editBedrooms}
                    onChange={e => setEditBedrooms(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Bathrooms */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Salles de bain :</label>
                  <input
                    type="number"
                    value={editBathrooms}
                    onChange={e => setEditBathrooms(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Étage */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Étage :</label>
                  <input
                    type="number"
                    value={editFloor}
                    onChange={e => setEditFloor(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Standing */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Standing :</label>
                  <input
                    type="text"
                    value={editStanding}
                    onChange={e => setEditStanding(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Nom Vendeur */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nom Vendeur / Agence :</label>
                  <input
                    type="text"
                    value={editSellerName}
                    onChange={e => setEditSellerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Tél Vendeur */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Téléphone Contact :</label>
                  <input
                    type="text"
                    value={editSellerPhone}
                    onChange={e => setEditSellerPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Email Vendeur */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Contact :</label>
                  <input
                    type="email"
                    value={editSellerEmail}
                    onChange={e => setEditSellerEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Checkboxes Commodités */}
                <div className="sm:col-span-3 bg-white p-3 rounded-xl border border-slate-200 flex flex-wrap gap-4 items-center">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editHasActAndLivret}
                      onChange={e => setEditHasActAndLivret(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <span>📜 Acte Notarié & Livret Foncier</span>
                  </label>

                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editHasElevator}
                      onChange={e => setEditHasElevator(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <span>🛗 Ascenseur</span>
                  </label>

                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editHasGarage}
                      onChange={e => setEditHasGarage(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <span>🚗 Garage / Parking</span>
                  </label>

                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editHasSeaView}
                      onChange={e => setEditHasSeaView(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <span>🌊 Vue sur Mer</span>
                  </label>

                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editHasPool}
                      onChange={e => setEditHasPool(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <span>🏊 Piscine</span>
                  </label>
                </div>

                {/* Description FR */}
                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Description (Français) :</label>
                  <textarea
                    rows={2}
                    value={editDescription}
                    onChange={e => setEditDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* MEDIA MANAGER: PHOTOS */}
              <div className="pt-3 border-t border-emerald-200">
                <h5 className="font-extrabold text-xs text-emerald-950 flex items-center gap-2 mb-2">
                  <Camera className="w-4 h-4 text-emerald-700" />
                  <span>Gestion des Photos ({editImages.length})</span>
                </h5>

                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <label className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choisir des photos</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleAddEditPhotoFile}
                      className="hidden"
                    />
                  </label>

                  <div className="flex items-center gap-1 flex-1 min-w-[200px]">
                    <input
                      type="url"
                      placeholder="Ou coller une URL d'image..."
                      value={newImgInput}
                      onChange={e => setNewImgInput(e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs flex-1"
                    />
                    <button
                      type="button"
                      onClick={handleAddEditPhotoUrl}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs cursor-pointer shrink-0"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>

                {/* Photos Grid */}
                {editImages.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 bg-white p-2.5 rounded-xl border border-slate-200 max-h-44 overflow-y-auto">
                    {editImages.map((img, idx) => (
                      <div key={idx} className="relative aspect-4/3 rounded-lg overflow-hidden group border border-slate-200 bg-slate-100">
                        <img src={img} alt={`Photo ${idx+1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveEditPhoto(idx)}
                          className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full opacity-90 hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                          title="Supprimer la photo"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* MEDIA MANAGER: VIDEOS */}
              <div className="pt-3 border-t border-emerald-200">
                <h5 className="font-extrabold text-xs text-emerald-950 flex items-center gap-2 mb-2">
                  <Video className="w-4 h-4 text-emerald-700" />
                  <span>Gestion des Vidéos & Visites Virtuelles HD ({editVideos.length})</span>
                </h5>

                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <label className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Joindre vidéo MP4</span>
                    <input
                      type="file"
                      accept="video/mp4,video/*"
                      multiple
                      onChange={handleAddEditVideoFile}
                      className="hidden"
                    />
                  </label>

                  <div className="flex items-center gap-1 flex-1 min-w-[200px]">
                    <input
                      type="url"
                      placeholder="Ou lien vidéo MP4..."
                      value={newVidInput}
                      onChange={e => setNewVidInput(e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs flex-1"
                    />
                    <button
                      type="button"
                      onClick={handleAddEditVideoUrl}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs cursor-pointer shrink-0"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>

                {/* Preset HD Virtual Tours */}
                <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-300 mb-3">
                  <span className="text-[11px] font-bold text-amber-950 block mb-1.5">
                    🎬 Ajouter une vidéo démo HD de visite virtuelle en 1-clic :
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddPresetVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4')}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 text-amber-900 text-[11px] font-extrabold border border-amber-400 flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <Play className="w-3 h-3 fill-amber-700 text-amber-700" />
                      <span>Appartement Lumineux HD</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddPresetVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4')}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 text-amber-900 text-[11px] font-extrabold border border-amber-400 flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <Play className="w-3 h-3 fill-amber-700 text-amber-700" />
                      <span>Villa & Grand Séjour HD</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddPresetVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4')}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 text-amber-900 text-[11px] font-extrabold border border-amber-400 flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <Play className="w-3 h-3 fill-amber-700 text-amber-700" />
                      <span>Cuisine & Duplex HD</span>
                    </button>
                  </div>
                </div>

                {/* Videos List Chips */}
                {editVideos.length > 0 && (
                  <div className="space-y-1.5 bg-white p-2.5 rounded-xl border border-slate-200">
                    {editVideos.map((vid, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <Play className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span className="font-mono text-[11px] text-slate-700 truncate">{vid}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveEditVideo(idx)}
                          className="p-1 text-rose-600 hover:text-rose-800 font-bold shrink-0 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-emerald-200">
                <button
                  type="button"
                  onClick={() => setIsEditMode(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleSavePropertyEdit}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer tous les changements</span>
                </button>
              </div>
            </div>
          )}

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
            <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-slate-950 shadow-lg border border-slate-800">
              {selectedImgIdx < 0 && property.videos && property.videos.length > 0 ? (
                <div className="relative w-full h-full bg-slate-950 flex flex-col items-center justify-center">
                  {(() => {
                    const videoIdx = Math.abs(selectedImgIdx) - 1;
                    const activeVidUrl = property.videos[videoIdx] || property.videos[0];
                    
                    // Check if YouTube
                    const isYouTube = activeVidUrl.includes('youtube.com') || activeVidUrl.includes('youtu.be');
                    let ytEmbedUrl = '';
                    if (isYouTube) {
                      const match = activeVidUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
                      if (match && match[1]) {
                        ytEmbedUrl = `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1&rel=0`;
                      }
                    }

                    if (isYouTube && ytEmbedUrl) {
                      return (
                        <iframe
                          key={ytEmbedUrl}
                          src={ytEmbedUrl}
                          title="Visite virtuelle vidéo"
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      );
                    }

                    return (
                      <div className="relative w-full h-full flex flex-col items-center justify-center bg-black group">
                        <video
                          key={activeVidUrl}
                          src={activeVidUrl}
                          controls
                          autoPlay
                          playsInline
                          muted={isVideoMuted}
                          preload="auto"
                          poster={property.images[0]}
                          onError={(e) => {
                            // Backup fallback to reliable Google Cloud Storage sample MP4 if user file stream has unsupported format
                            const target = e.currentTarget;
                            if (!target.dataset.triedFallback) {
                              target.dataset.triedFallback = 'true';
                              target.src = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
                              target.load();
                              target.play().catch(() => {});
                            }
                          }}
                          className="w-full h-full object-contain"
                        >
                          <source src={activeVidUrl} type="video/mp4" />
                          <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" type="video/mp4" />
                        </video>

                        {/* Top Control Bar with Sound Toggle and External Link */}
                        <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                          <button
                            type="button"
                            onClick={() => setIsVideoMuted(!isVideoMuted)}
                            className="px-3 py-1.5 rounded-full bg-black/80 hover:bg-black text-white text-xs font-bold border border-white/20 shadow-md backdrop-blur-md flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>{isVideoMuted ? '🔇 Son désactivé (Cliquer pour activer)' : '🔊 Son activé'}</span>
                          </button>
                          
                          <a
                            href={activeVidUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-full bg-black/80 hover:bg-black text-amber-400 text-xs font-bold border border-white/20 shadow-md backdrop-blur-md flex items-center justify-center cursor-pointer"
                            title="Ouvrir la vidéo dans un nouvel onglet"
                          >
                            ↗️
                          </a>
                        </div>
                      </div>
                    );
                  })()}
                </div>
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
                    selectedImgIdx === idx ? 'border-emerald-600 scale-105 shadow-md ring-2 ring-emerald-500/30' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}

              {property.videos && property.videos.map((vid, vIdx) => {
                const targetIdx = -(vIdx + 1);
                const isSelected = selectedImgIdx === targetIdx;
                return (
                  <button
                    key={`vid-${vIdx}`}
                    onClick={() => setSelectedImgIdx(targetIdx)}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 transition-all border-2 bg-slate-900 flex items-center justify-center text-white cursor-pointer ${
                      isSelected ? 'border-amber-400 scale-105 shadow-md ring-2 ring-amber-400/50' : 'border-slate-700 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] font-black shadow-xs">
                        ▶
                      </div>
                      <span className="text-[9px] font-extrabold text-amber-300">Vidéo HD #{vIdx + 1}</span>
                    </div>
                  </button>
                );
              })}
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
              onClick={handleGoToBuyers}
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

              {/* 1-Click Potential Buyers Callout Banner inside Offer */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-sky-950 text-white border border-sky-500/30 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/30">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-bold uppercase tracking-wider mb-1">
                      {language === 'AR' ? 'خاص بالبائعين والوكلاء' : 'Réservé au Vendeur / Agence'}
                    </div>
                    <h5 className="text-sm font-extrabold text-white">
                      {language === 'AR' 
                        ? `🔥 ${potentialBuyers.length} مشترين محتملين مسجلين لهذه المنطقة (${property.wilaya})`
                        : `🔥 ${potentialBuyers.length} Acheteurs Potentiels Qualifiés à ${property.wilaya}`}
                    </h5>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {language === 'AR' 
                        ? 'انقر لعرض أرقام الهواتف والواتساب للتواصل المباشر معهم.'
                        : 'Accédez en 1 clic à leurs numéros de téléphone et WhatsApp pour leur proposer ce bien.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoToBuyers}
                  className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer shrink-0 flex items-center gap-2 active:scale-95"
                >
                  <Phone className="w-4 h-4 fill-slate-950" />
                  <span>{language === 'AR' ? 'عرض Coordonnées (1-Click)' : 'Voir Coordonnées (1 Clic)'}</span>
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
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
                    {property.sellerGender === 'femme' ? '👩' : '👨'}
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-white flex items-center gap-2">
                      <span>{property.sellerGender === 'femme' ? 'Mme' : 'M.'} {property.sellerName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {property.sellerGender === 'femme' ? 'Femme' : 'Homme'}
                      </span>
                    </h4>
                    <p className="text-xs text-emerald-400 font-medium">
                      {language === 'AR' ? 'وكيل / بائع معتمد ImmoWin' : language === 'EN' ? 'Certified ImmoWin Seller/Agent' : 'Vendeur / Agent Certifié ImmoWin'}
                    </p>
                  </div>
                </div>

                {/* Direct Action Buttons: WhatsApp, Call, Message - Stacked Vertically Top to Bottom */}
                <div className="space-y-2.5 pt-2 text-xs">
                  
                  {/* Phone Number Display Card */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Phone className="w-4 h-4 text-emerald-400" />
                      <span className="font-semibold text-xs">
                        {language === 'AR' ? 'رقم الهاتف:' : 'Téléphone :'}
                      </span>
                    </div>
                    <span dir="ltr" className="font-mono text-sm font-extrabold text-emerald-400 tracking-wider">
                      {property.sellerPhone}
                    </span>
                  </div>

                  {/* Vertically Stacked Action Buttons Top to Bottom */}
                  <div className="flex flex-col gap-2.5">
                    {/* 1. WhatsApp Button (Stacked Top) */}
                    <a
                      id={`detail-whatsapp-${property.id}`}
                      href={getWhatsAppLink(property.sellerPhone, `Bonjour, je suis très intéressé(e) par votre annonce "${property.title}" à ${property.commune}, ${property.wilaya}. Pourriez-vous me fournir plus de détails ?`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-md cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 fill-white shrink-0" />
                        <span>{language === 'AR' ? 'محادثة واتساب' : 'Discussion WhatsApp'}</span>
                      </div>
                      <span dir="ltr" className="font-mono text-xs font-bold text-emerald-100 bg-emerald-700/60 px-2.5 py-1 rounded-lg border border-emerald-400/30">
                        {property.sellerPhone}
                      </span>
                    </a>

                    {/* 2. Phone Call Button (Stacked Middle) */}
                    <a
                      id={`detail-tel-${property.id}`}
                      href={getTelLink(property.sellerPhone)}
                      className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all border border-slate-700 cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{language === 'AR' ? 'اتصال هاتف' : 'Appel Téléphonique'}</span>
                      </div>
                      <span dir="ltr" className="font-mono text-xs font-bold text-emerald-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-700">
                        {property.sellerPhone}
                      </span>
                    </a>

                    {/* 3. Direct Message Button (Stacked Bottom) - Removed word SMS */}
                    <a
                      id={`detail-msg-${property.id}`}
                      href={getSmsLink(property.sellerPhone, `Bonjour, je suis intéressé par votre bien à ${property.wilaya}.`)}
                      className="flex items-center justify-between px-4 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold transition-all shadow-md cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-white shrink-0" />
                        <span>{language === 'AR' ? 'رسالة مباشرة' : 'Message Direct'}</span>
                      </div>
                      <span dir="ltr" className="font-mono text-xs font-bold text-sky-100 bg-sky-800/60 px-2.5 py-1 rounded-lg border border-sky-400/30">
                        {property.sellerPhone}
                      </span>
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
            <div id="potential-buyers-section" className="space-y-6 scroll-mt-6">
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {potentialBuyers.map(buyer => (
                  <div key={buyer.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-11 h-11 rounded-2xl bg-slate-900 text-amber-400 font-extrabold flex items-center justify-center text-lg shadow-xs border border-slate-800 shrink-0">
                          {buyer.gender === 'femme' ? '👩' : '👨'}
                        </div>
                        <div>
                          <h5 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                            <span>{buyer.name}</span>
                          </h5>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                              {buyer.gender === 'femme' ? '👩 Femme' : '👨 Homme'}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              ✓ {buyer.role}
                            </span>
                          </div>
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

                    {/* Phone Number Display Box LTR */}
                    <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-950 text-white text-xs border border-slate-800 shadow-xs">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        {language === 'AR' ? 'رقم الهاتف المباشر:' : 'Numéro Téléphone :'}
                      </span>
                      <span dir="ltr" className="font-mono text-xs font-black text-emerald-400 tracking-wider">
                        {buyer.phone}
                      </span>
                    </div>

                    {/* Vertically Stacked Contact Buttons (WhatsApp, Phone Call, Message Direct) */}
                    <div className="flex flex-col gap-2 pt-1">
                      {/* 1. WhatsApp */}
                      <a
                        href={getWhatsAppLink(buyer.phone, `Bonjour ${buyer.name}, je vous contacte depuis ImmoWin concernant votre recherche de bien à ${property.wilaya}. Nous avons un(e) ${property.title} disponible à ${formatDZD(property.priceDZD)}.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-between transition-colors cursor-pointer shadow-xs"
                      >
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4 fill-white shrink-0" />
                          <span>WhatsApp</span>
                        </div>
                        <span dir="ltr" className="font-mono text-[11px] font-bold text-emerald-100 bg-emerald-700/60 px-2 py-0.5 rounded">
                          {buyer.phone}
                        </span>
                      </a>

                      {/* 2. Phone Call */}
                      <a
                        href={getTelLink(buyer.phone)}
                        className="py-2.5 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-between transition-colors cursor-pointer shadow-xs border border-slate-800"
                      >
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{language === 'AR' ? 'اتصال هاتف' : 'Appel Téléphonique'}</span>
                        </div>
                        <span dir="ltr" className="font-mono text-[11px] font-bold text-emerald-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {buyer.phone}
                        </span>
                      </a>

                      {/* 3. Message Direct (Replaced SMS) */}
                      <a
                        href={getSmsLink(buyer.phone, `Bonjour ${buyer.name}, votre recherche de bien à ${property.wilaya} m'intéresse.`)}
                        className="py-2.5 px-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-between transition-colors cursor-pointer shadow-xs"
                      >
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-white shrink-0" />
                          <span>{language === 'AR' ? 'رسالة مباشرة' : 'Message Direct'}</span>
                        </div>
                        <span dir="ltr" className="font-mono text-[11px] font-bold text-sky-100 bg-sky-700/60 px-2 py-0.5 rounded">
                          {buyer.phone}
                        </span>
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

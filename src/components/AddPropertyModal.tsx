import React, { useState, useEffect, useRef } from 'react';
import { usePropertyContext } from '../context/PropertyContext';
import { useLanguage } from '../context/LanguageContext';
import { WILAYAS_DATA } from '../data/wilayasData';
import { PropertyType, TransactionType, StandingQuality } from '../types';
import { X, Plus, Building2, Upload, Image as ImageIcon, Video as VideoIcon, MapPin, Navigation, Trash2, CheckCircle2, Play } from 'lucide-react';
import L from 'leaflet';

export const AddPropertyModal: React.FC = () => {
  const { isAddModalOpen, setIsAddModalOpen, addProperty, showToast } = usePropertyContext();
  const { language } = useLanguage();

  const isAr = language === 'AR';
  const isEn = language === 'EN';

  const [title, setTitle] = useState('');
  const [type, setType] = useState<PropertyType>('Appartement');
  const [transactionType, setTransactionType] = useState<TransactionType>('Achat');
  const [wilaya, setWilaya] = useState('Alger');
  const [commune, setCommune] = useState('Hydra');
  const [neighborhood, setNeighborhood] = useState('');
  const [priceDZD, setPriceDZD] = useState<number>(25000000);
  const [surfaceM2, setSurfaceM2] = useState<number>(120);
  const [rooms, setRooms] = useState<number>(4);
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [standing, setStanding] = useState<StandingQuality>('Haut standing');
  const [hasActAndLivret, setHasActAndLivret] = useState(true);
  const [description, setDescription] = useState('');

  // Photos & Videos state
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');

  const [videos, setVideos] = useState<string[]>([
    'https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-interior-with-a-view-41551-large.mp4'
  ]);
  const [newVideoUrl, setNewVideoUrl] = useState('');

  // GPS Coordinates state
  const [lat, setLat] = useState<number>(36.7538);
  const [lng, setLng] = useState<number>(3.0588);
  const [gpsDetecting, setGpsDetecting] = useState(false);

  // Map Picker ref
  const miniMapContainerRef = useRef<HTMLDivElement>(null);
  const miniMapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Default Wilaya GPS Lookup
  const wilayaGpsPresets: Record<string, { lat: number; lng: number }> = {
    'Alger': { lat: 36.7538, lng: 3.0588 },
    'Oran': { lat: 35.6987, lng: -0.6349 },
    'Constantine': { lat: 36.3650, lng: 6.6140 },
    'Sétif': { lat: 36.1900, lng: 5.4100 },
    'Annaba': { lat: 36.9000, lng: 7.7667 },
    'Blida': { lat: 36.4700, lng: 2.8300 },
    'Tlemcen': { lat: 34.8783, lng: -1.3150 },
    'Béjaïa': { lat: 36.7500, lng: 5.0667 },
  };

  const selectedWilayaObj = WILAYAS_DATA.find(w => w.name === wilaya) || WILAYAS_DATA[0];

  // Update GPS and Communes when Wilaya changes
  const handleWilayaChange = (selectedW: string) => {
    setWilaya(selectedW);
    const wObj = WILAYAS_DATA.find(w => w.name === selectedW);
    if (wObj && wObj.communes.length > 0) {
      setCommune(wObj.communes[0].name);
    }
    if (wilayaGpsPresets[selectedW]) {
      const preset = wilayaGpsPresets[selectedW];
      setLat(preset.lat);
      setLng(preset.lng);
      if (miniMapRef.current) {
        miniMapRef.current.setView([preset.lat, preset.lng], 12);
        if (markerRef.current) {
          markerRef.current.setLatLng([preset.lat, preset.lng]);
        }
      }
    }
  };

  // Detect GPS
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      showToast("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }

    setGpsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = Number(position.coords.latitude.toFixed(6));
        const userLng = Number(position.coords.longitude.toFixed(6));
        setLat(userLat);
        setLng(userLng);
        setGpsDetecting(false);

        if (miniMapRef.current) {
          miniMapRef.current.setView([userLat, userLng], 14);
          if (markerRef.current) {
            markerRef.current.setLatLng([userLat, userLng]);
          }
        }
        showToast("Coordonnées GPS réelles récupérées avec succès !");
      },
      (error) => {
        setGpsDetecting(false);
        showToast("Impossible d'obtenir la position GPS. Entrez les coordonnées manuellement.");
      }
    );
  };

  // Mini Leaflet Map initialization for picking exact GPS pin
  useEffect(() => {
    if (!isAddModalOpen || !miniMapContainerRef.current) return;

    // Destroy existing instance if any
    if (miniMapRef.current) {
      miniMapRef.current.remove();
      miniMapRef.current = null;
    }

    const map = L.map(miniMapContainerRef.current, {
      center: [lat, lng],
      zoom: 12,
      zoomControl: true
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: 'OpenStreetMap'
    }).addTo(map);

    const customPinIcon = L.divIcon({
      className: 'custom-picker-pin',
      html: `
        <div class="bg-emerald-600 text-white rounded-full p-2 shadow-lg border-2 border-white flex items-center justify-center animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });

    const marker = L.marker([lat, lng], { icon: customPinIcon, draggable: true }).addTo(map);

    marker.on('dragend', (e) => {
      const position = e.target.getLatLng();
      setLat(Number(position.lat.toFixed(6)));
      setLng(Number(position.lng.toFixed(6)));
    });

    map.on('click', (e) => {
      const { lat: clickLat, lng: clickLng } = e.latlng;
      const newLat = Number(clickLat.toFixed(6));
      const newLng = Number(clickLng.toFixed(6));
      setLat(newLat);
      setLng(newLng);
      marker.setLatLng([newLat, newLng]);
    });

    miniMapRef.current = map;
    markerRef.current = marker;

    return () => {
      if (miniMapRef.current) {
        miniMapRef.current.remove();
        miniMapRef.current = null;
      }
    };
  }, [isAddModalOpen]);

  // Handle Photo File Upload
  const handlePhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    showToast(`${files.length} photo(s) ajoutée(s) avec succès !`);
  };

  // Add Photo URL manually
  const handleAddPhotoUrl = () => {
    if (!newImageUrl.trim()) return;
    setImages(prev => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
    showToast("Photo ajoutée !");
  };

  const handleRemovePhoto = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  // Handle Video File Upload
  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setVideos(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    showToast(`${files.length} vidéo(s) ajoutée(s) avec succès !`);
  };

  // Add Video URL manually
  const handleAddVideoUrl = () => {
    if (!newVideoUrl.trim()) return;
    setVideos(prev => [...prev, newVideoUrl.trim()]);
    setNewVideoUrl('');
    showToast("Vidéo ajoutée !");
  };

  const handleRemoveVideo = (idx: number) => {
    setVideos(prev => prev.filter((_, i) => i !== idx));
  };

  if (!isAddModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      showToast("Veuillez inclure au moins une photo pour le bien.");
      return;
    }

    addProperty({
      title: title || `${type} F${rooms} à ${commune}, ${wilaya}`,
      type,
      transactionType,
      wilaya,
      commune,
      neighborhood: neighborhood || "Centre",
      priceDZD: Number(priceDZD),
      surfaceM2: Number(surfaceM2),
      rooms: Number(rooms),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      standing,
      hasActAndLivret,
      description: description || `Très beau ${type.toLowerCase()} situé à ${commune}, ${wilaya}. Finitions soignées, proximité des transports et écoles.`,
      images,
      videos: videos.length > 0 ? videos : undefined,
      status: transactionType === 'Achat' ? 'A Vendre' : 'A Louer',
      tag: 'Nouveau',
      sellerName: 'Agence Immobilière Partner',
      sellerPhone: '+213 550 00 11 22',
      sellerEmail: 'contact@partner-immo.dz',
      coordinates: { lat, lng }
    });

    showToast("Votre annonce avec photos, vidéos et géolocalisation GPS est en ligne !");
    setIsAddModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 space-y-6"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 font-outfit">
                {isAr
                  ? 'إضافة ونشر عقار جديد مع الصور والفيديو والموقع GPS'
                  : isEn
                  ? 'Publish a Property with Photos, Videos & GPS'
                  : 'Publier un Bien avec Photos, Vidéos & GPS'}
              </h3>
              <p className="text-xs text-slate-500">
                {isAr
                  ? 'أضف إعلانك على الخريطة التفاعلية لمنصة إيمووين الجزائر'
                  : isEn
                  ? 'Add your listing to the ImmoWin Algeria interactive map'
                  : 'Ajouter votre offre sur la carte interactive ImmoWin Algérie'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(false)}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Main Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1">
              {isAr ? '1. المعلومات العامة' : isEn ? '1. General Information' : '1. Informations Générales'}
            </h4>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {isAr ? 'عنوان الإعلان' : isEn ? 'Listing Title' : 'Titre de l\'annonce'}
              </label>
              <input
                type="text"
                required
                placeholder={isAr ? 'مثال: شقة F4 فاخرة مع مرأب وإطلالة على البحر' : isEn ? 'Ex: Luxury F4 Apartment with Sea View & Garage' : 'Ex: Magnifique F4 Haut Standing avec Vue Mer & Garage'}
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {isAr ? 'نوع العقار' : isEn ? 'Property Type' : 'Type de Bien'}
                </label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as PropertyType)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500/50"
                >
                  <option value="Appartement">{isAr ? 'شقة (Appartement)' : 'Appartement'}</option>
                  <option value="Villa">{isAr ? 'فيلا ودوبلكس (Villa & Duplex)' : 'Villa & Duplex'}</option>
                  <option value="Terrain">{isAr ? 'قطعة أرض (Terrain)' : 'Terrain'}</option>
                  <option value="Local Commercial">{isAr ? 'محل تجاري (Local Commercial)' : 'Local Commercial'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {isAr ? 'نوع المعاملة' : isEn ? 'Transaction Type' : 'Type de Transaction'}
                </label>
                <select
                  value={transactionType}
                  onChange={e => setTransactionType(e.target.value as TransactionType)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500/50"
                >
                  <option value="Achat">{isAr ? 'للبيع (Vente)' : 'A Vendre (Vente)'}</option>
                  <option value="Location">{isAr ? 'للإيجار (Location)' : 'A Louer (Location)'}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {isAr ? 'الولاية' : isEn ? 'Wilaya' : 'Wilaya'}
                </label>
                <select
                  value={wilaya}
                  onChange={e => handleWilayaChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500/50"
                >
                  {WILAYAS_DATA.map(w => (
                    <option key={w.code} value={w.name}>{w.code} - {w.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {isAr ? 'البلدية' : isEn ? 'Commune' : 'Commune'}
                </label>
                <select
                  required
                  value={commune}
                  onChange={e => setCommune(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500/50"
                >
                  {selectedWilayaObj.communes.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                  <option value="Centre">{isAr ? 'المركز / وسط المدينة' : 'Centre / Autre'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {isAr ? 'الحي / الحي السكني' : isEn ? 'Neighborhood' : 'Quartier / Cité'}
                </label>
                <input
                  type="text"
                  placeholder={isAr ? 'مثال: حي عقيد لطفي' : 'Ex: Akid Lotfi'}
                  value={neighborhood}
                  onChange={e => setNeighborhood(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {isAr ? 'السعر بالدينار الجزائري (DZD)' : isEn ? 'Price (in DZD)' : 'Prix (en Dinars DZD)'}
                </label>
                <input
                  type="number"
                  required
                  step={50000}
                  dir="ltr"
                  value={priceDZD}
                  onChange={e => setPriceDZD(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-extrabold text-emerald-700 focus:ring-2 focus:ring-emerald-500/50 ltr [direction:ltr]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {isAr ? 'المساحة (م²)' : isEn ? 'Area (m²)' : 'Surface (m²)'}
                </label>
                <input
                  type="number"
                  required
                  value={surfaceM2}
                  onChange={e => setSurfaceM2(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  {isAr ? 'عدد الغرف' : isEn ? 'Rooms' : 'Nombre Pièces'}
                </label>
                <input
                  type="number"
                  min={1}
                  value={rooms}
                  onChange={e => setRooms(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-center font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  {isAr ? 'غرف النوم' : isEn ? 'Bedrooms' : 'Chambres'}
                </label>
                <input
                  type="number"
                  min={0}
                  value={bedrooms}
                  onChange={e => setBedrooms(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-center font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  {isAr ? 'الحمامات' : isEn ? 'Bathrooms' : 'Salles de bain'}
                </label>
                <input
                  type="number"
                  min={1}
                  value={bathrooms}
                  onChange={e => setBathrooms(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-center font-bold"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasActAndLivret}
                  onChange={e => setHasActAndLivret(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
                <span className="text-xs font-bold text-slate-800">
                  {isAr
                    ? 'متوفر: عقد توثيقي ودفتر عقاري (Acte Notarié & Livret Foncier)'
                    : isEn
                    ? 'Notarized Act & Land Registry Booklet Available'
                    : 'Acte Notarié & Livret Foncier Disponible'}
                </span>
              </label>
            </div>
          </div>

          {/* SECTION 2: PHOTOS & VIDEOS MULTIMEDIA */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <span>
                  {isAr ? '2. معرض الصور والفيديو' : isEn ? '2. Photo & Video Gallery' : '2. Galerie Photos & Vidéos du Bien'}
                </span>
              </span>
              <span className="text-[10px] text-slate-500 font-normal">
                {images.length} {isAr ? 'صور' : 'Photos'}, {videos.length} {isAr ? 'فيديو' : 'Vidéos'}
              </span>
            </h4>

            {/* Photos Uploader & Manager */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                {isAr ? 'صور العقار:' : 'Photos de l\'annonce :'}
              </label>

              {/* Upload from Device or Paste Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-800 text-xs font-bold cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-emerald-600" />
                  <span>{isAr ? 'رفع صور من الجهاز' : isEn ? 'Upload photos' : 'Importer des photos (Fichiers)'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoFileUpload}
                    className="hidden"
                  />
                </label>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={e => setNewImageUrl(e.target.value)}
                    placeholder={isAr ? 'أو ألصق رابط صورة...' : 'Ou coller un lien d\'image URL...'}
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhotoUrl}
                    className="px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer hover:bg-slate-800"
                  >
                    {isAr ? 'إضافة' : 'Ajouter'}
                  </button>
                </div>
              </div>

              {/* Photo Thumbnails */}
              {images.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden group border border-slate-200">
                      <img src={img} alt={`Photo ${idx+1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Supprimer la photo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Video Uploader & Manager */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <VideoIcon className="w-4 h-4 text-amber-500" />
                <span>
                  {isAr ? 'فيديوهات الجولة الافتراضية:' : 'Vidéos de visite virtuelle (MP4 ou Liens) :'}
                </span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50/50 hover:bg-amber-50 text-amber-900 text-xs font-bold cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-amber-600" />
                  <span>{isAr ? 'رفع فيديو MP4' : 'Importer une vidéo MP4'}</span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoFileUpload}
                    className="hidden"
                  />
                </label>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newVideoUrl}
                    onChange={e => setNewVideoUrl(e.target.value)}
                    placeholder="Lien vidéo MP4 ou YouTube..."
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={handleAddVideoUrl}
                    className="px-3 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold cursor-pointer hover:bg-amber-400"
                  >
                    {isAr ? 'إضافة فيديو' : 'Ajouter Vidéo'}
                  </button>
                </div>
              </div>

              {/* Video List Chips */}
              {videos.length > 0 && (
                <div className="space-y-2 pt-2">
                  {videos.map((vid, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 text-xs">
                      <div className="flex items-center gap-2 overflow-hidden pr-2">
                        <Play className="w-4 h-4 text-amber-500 shrink-0 fill-amber-500" />
                        <span className="truncate font-mono text-[11px] text-slate-700">{vid}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveVideo(idx)}
                        className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SECTION 3: EXACT GPS COORDINATES & INTERACTIVE MAP PICKER */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-600" />
                <span>
                  {isAr ? '3. الموقع الجغرافي والإحداثيات GPS' : isEn ? '3. GPS Location & Coordinates' : '3. Positionnement & Coordonnées GPS sur la Carte'}
                </span>
              </span>
              <button
                type="button"
                onClick={handleDetectGPS}
                disabled={gpsDetecting}
                className="px-3 py-1 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-[11px] font-bold border border-sky-200 cursor-pointer flex items-center gap-1.5"
              >
                <Navigation className={`w-3.5 h-3.5 text-sky-600 ${gpsDetecting ? 'animate-spin' : ''}`} />
                <span>
                  {gpsDetecting
                    ? (isAr ? 'جاري تحديد الموقع...' : 'Détection en cours...')
                    : (isAr ? 'موقعي الحالي GPS' : 'Ma Position GPS Actuelle')}
                </span>
              </button>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {isAr ? 'خط العرض (Latitude)' : 'Latitude GPS'}
                </label>
                <input
                  type="number"
                  step="0.000001"
                  required
                  value={lat}
                  onChange={e => {
                    const newLat = Number(e.target.value);
                    setLat(newLat);
                    if (miniMapRef.current && markerRef.current) {
                      miniMapRef.current.setView([newLat, lng], 13);
                      markerRef.current.setLatLng([newLat, lng]);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {isAr ? 'خط الطول (Longitude)' : 'Longitude GPS'}
                </label>
                <input
                  type="number"
                  step="0.000001"
                  required
                  value={lng}
                  onChange={e => {
                    const newLng = Number(e.target.value);
                    setLng(newLng);
                    if (miniMapRef.current && markerRef.current) {
                      miniMapRef.current.setView([lat, newLng], 13);
                      markerRef.current.setLatLng([lat, newLng]);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-800"
                />
              </div>
            </div>

            {/* Interactive Mini-Map Pin Picker */}
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 block">
                {isAr
                  ? 'انقر على الخريطة أو اسحب العلامة الخضراء لتحديد الموقع بدقة:'
                  : 'Cliquez sur la carte ou faites glisser le marqueur vert pour positionner précisément votre bien :'}
              </span>
              <div
                ref={miniMapContainerRef}
                className="w-full h-48 rounded-2xl border border-slate-200 overflow-hidden shadow-inner z-10"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              {isAr ? 'الوصف الكامل للعقار' : isEn ? 'Full Description' : 'Description Complète'}
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={
                isAr
                  ? 'وصف تفصيلي للتشطيبات والخدمات المجاورة...'
                  : 'Description détaillée des finitions, commodités et commodités environnantes...'
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              {isAr ? 'إلغاء' : 'Annuler'}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>
                {isAr ? 'نشر الإعلان بالدينار الجزائري' : isEn ? 'Publish Property in DZD' : 'Publier l\'Annonce en DZD'}
              </span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

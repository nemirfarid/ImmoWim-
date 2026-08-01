import React, { useState } from 'react';
import { usePropertyContext } from '../context/PropertyContext';
import { useLanguage } from '../context/LanguageContext';
import { WILAYAS_DATA } from '../data/wilayasData';
import { X, Megaphone, Sparkles, Building2, Upload, Image as ImageIcon, ShieldCheck, CheckCircle2, Phone, MessageCircle, Tag, Gift, Award, Eye } from 'lucide-react';

export interface FreeAdCampaign {
  id: string;
  advertiserRole: 'Agence Immobilière' | 'Promoteur VEFA';
  companyName: string;
  title: string;
  wilaya: string;
  commune: string;
  tag: string;
  bannerImage: string;
  description: string;
  phone: string;
  whatsapp: string;
  email: string;
  dateCreated: string;
  durationDays: number;
  clicksCount: number;
}

const PRESET_BANNER_IMAGES = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
];

interface FreeAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdCreated?: (ad: FreeAdCampaign) => void;
}

export const FreeAdModal: React.FC<FreeAdModalProps> = ({
  isOpen,
  onClose,
  onAdCreated
}) => {
  const { showToast } = usePropertyContext();
  const { language } = useLanguage();

  const [advertiserRole, setAdvertiserRole] = useState<'Agence Immobilière' | 'Promoteur VEFA'>('Agence Immobilière');
  const [companyName, setCompanyName] = useState('');
  const [title, setTitle] = useState('');
  const [wilaya, setWilaya] = useState('Alger');
  const [commune, setCommune] = useState('Hydra');

  const selectedWilayaObj = WILAYAS_DATA.find(w => w.name === wilaya) || WILAYAS_DATA[0];

  const handleWilayaChange = (selectedW: string) => {
    setWilaya(selectedW);
    const wObj = WILAYAS_DATA.find(w => w.name === selectedW);
    if (wObj && wObj.communes.length > 0) {
      setCommune(wObj.communes[0].name);
    }
  };
  const [tag, setTag] = useState('Offre Lancement VEFA 0% Frais');
  const [bannerImage, setBannerImage] = useState(PRESET_BANNER_IMAGES[0]);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('+213 550 12 34 56');
  const [whatsapp, setWhatsapp] = useState('+213 550 12 34 56');
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  // Handle Banner Upload from File
  const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setBannerImage(event.target.result as string);
        showToast("Bannière publicitaire importée avec succès !");
      }
    };
    reader.readAsDataURL(file as Blob);
  };

  const handleApplyCustomUrl = () => {
    if (!customImageUrl.trim()) return;
    setBannerImage(customImageUrl.trim());
    setCustomImageUrl('');
    showToast("URL de la bannière appliquée !");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyName.trim() || !title.trim()) {
      showToast("Veuillez remplir le nom de l'enseigne et le titre de la publicité.");
      return;
    }

    const newAd: FreeAdCampaign = {
      id: `ad-${Date.now()}`,
      advertiserRole,
      companyName: companyName.trim(),
      title: title.trim(),
      wilaya,
      commune,
      tag,
      bannerImage,
      description: description || `Découvrez les offres exclusives de ${companyName} à ${commune}, ${wilaya}. Biens haut standing certifiés acte notarié.`,
      phone: phone || '+213 550 00 00 00',
      whatsapp: whatsapp || phone || '+213 550 00 00 00',
      email: email || 'contact@immo-partenaire.dz',
      dateCreated: new Date().toISOString().split('T')[0],
      durationDays: 30, // 30 Days 100% Free
      clicksCount: 0
    };

    // Save in LocalStorage
    const existing = localStorage.getItem('immowin_free_ads');
    const parsed: FreeAdCampaign[] = existing ? JSON.parse(existing) : [];
    localStorage.setItem('immowin_free_ads', JSON.stringify([newAd, ...parsed]));

    if (onAdCreated) {
      onAdCreated(newAd);
    }

    showToast("🎉 Votre publicité gratuite a été publiée avec succès ! Diffusée 30 jours offerts.");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 space-y-6"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-emerald-600 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Megaphone className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider mb-1">
                <Gift className="w-3 h-3 text-emerald-600" />
                <span>Offre Spéciale Lancement - 100% Gratuit</span>
              </div>
              <h3 className="font-extrabold text-xl text-slate-900 font-outfit">
                Publier une Publicité Gratuite (Agences & Promoteurs)
              </h3>
              <p className="text-xs text-slate-500">
                Diffusez la bannière de votre agence ou projet VEFA gratuitement pendant 30 jours
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

        {/* 100% Free Guarantee Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-teal-950 text-white p-4 rounded-2xl border border-emerald-500/30 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-extrabold text-xs text-amber-300 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Sponsorisez vos projets sans carte ni paiement !</span>
            </h4>
            <p className="text-[11px] text-slate-300">
              Profitez du programme d'accompagnement gratuit ImmoWin pour booster vos ventes d'appartements neufs et mandats exclusifs.
            </p>
          </div>
          <span className="px-3 py-1 rounded-xl bg-amber-400 text-slate-950 font-black text-xs shrink-0 shadow-md">
            0 DZD (Offert)
          </span>
        </div>

        {/* Ad Creation Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Role Choice */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
              Je publie en tant que :
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAdvertiserRole('Agence Immobilière')}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  advertiserRole === 'Agence Immobilière'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Agence Immobilière</span>
              </button>

              <button
                type="button"
                onClick={() => setAdvertiserRole('Promoteur VEFA')}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  advertiserRole === 'Promoteur VEFA'
                    ? 'bg-teal-900 text-white border-teal-900 shadow-md'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Promoteur VEFA (Neuf)</span>
              </button>
            </div>
          </div>

          {/* Business & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Nom de l'Agence ou du Promoteur *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Agence Immo-Luxe ou Promotion Zahra"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Badge / Tag promotionnel
              </label>
              <input
                type="text"
                placeholder="Ex: 5% Remise Lancement / F3 VEFA Acté"
                value={tag}
                onChange={e => setTag(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-amber-700 focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          </div>

          {/* Main Ad Headline */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Titre / Slogan de la Publicité *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Lancement Résidence Les Palmiers : 40 Logements F3/F4 avec Piscine & Vue Mer à Hydra"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Wilaya Ciblée</label>
              <select
                value={wilaya}
                onChange={e => handleWilayaChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500/50"
              >
                {WILAYAS_DATA.map(w => (
                  <option key={w.code} value={w.name}>{w.code} - {w.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Commune / Secteur</label>
              <select
                required
                value={commune}
                onChange={e => setCommune(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500/50"
              >
                {selectedWilayaObj.communes.map(c => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Banner Selector or Upload */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              <span>Image de la Bannière Publicitaire HD :</span>
            </label>

            {/* Preview presets */}
            <div className="grid grid-cols-4 gap-2">
              {PRESET_BANNER_IMAGES.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setBannerImage(img)}
                  className={`relative aspect-16/9 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    bannerImage === img ? 'border-emerald-600 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Custom file upload / URL input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <label className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-800 text-xs font-bold cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>Importer votre propre Bannière</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerFileUpload}
                  className="hidden"
                />
              </label>

              <div className="flex gap-2">
                <input
                  type="url"
                  value={customImageUrl}
                  onChange={e => setCustomImageUrl(e.target.value)}
                  placeholder="Ou coller URL de bannière..."
                  className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
                />
                <button
                  type="button"
                  onClick={handleApplyCustomUrl}
                  className="px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer"
                >
                  OK
                </button>
              </div>
            </div>

            {/* Live Banner Preview */}
            {bannerImage && (
              <div className="relative aspect-21/9 rounded-xl overflow-hidden shadow-md mt-2">
                <img src={bannerImage} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-4 flex flex-col justify-end">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 self-start mb-1">
                    {tag}
                  </span>
                  <h5 className="text-white text-xs font-extrabold drop-shadow-md">
                    {title || 'Titre de votre publicité'}
                  </h5>
                  <p className="text-[10px] text-slate-200">
                    {companyName || 'Votre Agence'} • {commune}, {wilaya}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Description & Contact Details */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Description / Argumentaire Commercial
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Ex: Résidence fermée et gardée 24h/24, ascenseur Schindler, cuisine équipée italienne, box de stationnement en sous-sol..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Téléphone Direct</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">WhatsApp Pro</label>
                <input
                  type="tel"
                  required
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-emerald-700"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Validation instantanée • 30 jours offerts</span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs shadow-md cursor-pointer flex items-center gap-2"
              >
                <Megaphone className="w-4 h-4" />
                <span>Publier Gratuitement</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};

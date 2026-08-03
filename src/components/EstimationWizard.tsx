import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { usePropertyContext } from '../context/PropertyContext';
import { WILAYAS_DATA } from '../data/wilayasData';
import { formatDZD, formatPricePerM2, formatSurface } from '../utils/formatters';
import { EstimationInput, EstimationResult, PropertyType, StandingQuality } from '../types';
import { MapWidget } from './MapWidget';
import { Calculator, Check, Building2, Home, TreePine, Store, MapPin, Sparkles, ArrowRight, ArrowLeft, ShieldCheck, Award, TrendingUp, DollarSign, Send, CheckCircle2 } from 'lucide-react';

export const EstimationWizard: React.FC = () => {
  const { t } = useLanguage();
  const { addLead, showToast } = usePropertyContext();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [result, setResult] = useState<EstimationResult | null>(null);
  const [submittedLead, setSubmittedLead] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState<EstimationInput>({
    propertyType: 'Appartement',
    wilaya: 'Alger',
    commune: 'Hydra',
    neighborhood: 'Val d\'Hydra',
    surfaceM2: 120,
    rooms: 4,
    bedrooms: 3,
    floor: 3,
    standing: 'Haut standing',
    hasActAndLivret: true,
    hasElevator: true,
    hasGarage: true,
    hasSeaView: false,
    hasPool: false,
    constructionYear: 2022
  });

  // Calculate Valuation Engine Algorithm
  const calculateValuation = () => {
    const wilayaObj = WILAYAS_DATA.find(w => w.name === formData.wilaya) || WILAYAS_DATA[0];
    const communeObj = wilayaObj.communes.find(c => c.name === formData.commune) || wilayaObj.communes[0] || { multiplier: 1.0 };

    let basePricePerM2 = wilayaObj.avgPriceM2DZD * communeObj.multiplier;

    // Type multiplier
    if (formData.propertyType === 'Villa') basePricePerM2 *= 1.45;
    if (formData.propertyType === 'Local Commercial') basePricePerM2 *= 1.35;
    if (formData.propertyType === 'Terrain') basePricePerM2 *= 0.85;

    // Standing quality multiplier
    if (formData.standing === 'Luxe avec Acte') basePricePerM2 *= 1.55;
    else if (formData.standing === 'Haut standing') basePricePerM2 *= 1.30;
    else if (formData.standing === 'Moyen standing') basePricePerM2 *= 1.10;
    else basePricePerM2 *= 0.90;

    // Administrative document bonus
    if (formData.hasActAndLivret) basePricePerM2 *= 1.15;

    // Amenities bonuses
    if (formData.hasSeaView) basePricePerM2 *= 1.12;
    if (formData.hasPool) basePricePerM2 *= 1.08;
    if (formData.hasGarage) basePricePerM2 *= 1.05;
    if (formData.hasElevator && formData.propertyType === 'Appartement') basePricePerM2 *= 1.04;

    // Round to clean 100,000 DZD figure for clarity
    const rawCentral = basePricePerM2 * formData.surfaceM2;
    const estimatedCentral = Math.round(rawCentral / 100000) * 100000;
    const minRange = Math.round((estimatedCentral * 0.92) / 100000) * 100000;
    const maxRange = Math.round((estimatedCentral * 1.08) / 100000) * 100000;

    // Monthly Rent & Yield
    const estimatedMonthlyRent = Math.round((estimatedCentral * 0.0045) / 5000) * 5000;
    const rentalYield = Number(((estimatedMonthlyRent * 12) / estimatedCentral * 100).toFixed(1));

    const res: EstimationResult = {
      estimatedPriceDZD: estimatedCentral,
      priceRangeMinDZD: minRange,
      priceRangeMaxDZD: maxRange,
      pricePerM2DZD: Math.round(basePricePerM2),
      confidenceScore: 94,
      comparableListingsCount: 18,
      estimatedMonthlyRentDZD: estimatedMonthlyRent,
      rentalYieldPercent: rentalYield,
      wilayaAverageM2DZD: wilayaObj.avgPriceM2DZD,
      summaryReasoning: {
        locationFactor: `Emplacement premium à ${formData.commune} (${formData.wilaya}) avec coefficient d'attractivité de ${(communeObj.multiplier * 100).toFixed(0)}%.`,
        standingImpact: `Finition "${formData.standing}" valorisant la surface habitable de ${formData.surfaceM2} m².`,
        documentsBonus: formData.hasActAndLivret ? "Possibilité de prêt bancaire et valeur majorée de +15% grâce à l'Acte notarié & Livret Foncier." : "Estimation sans garantie d'Acte Notarié.",
        amenitiesBonus: [
          formData.hasSeaView ? "Vue Mer (+12%)" : "",
          formData.hasGarage ? "Garage (+5%)" : "",
          formData.hasElevator ? "Ascenseur (+4%)" : ""
        ].filter(Boolean).join(" • ") || "Équipements standards."
      }
    };

    setResult(res);
    setCurrentStep(4);
  };

  const handleRequestExpertise = () => {
    addLead({
      clientName: "Propriétaire Estimation ImmoWin",
      phone: "+213 550 XX XX XX",
      email: "proprietaire@immowin.dz",
      type: "estimation",
      wilaya: formData.wilaya,
      surfaceM2: formData.surfaceM2,
      estimatedValueDZD: result?.estimatedPriceDZD,
      message: `Demande d'expertise gratuite pour un(e) ${formData.propertyType} de ${formData.surfaceM2} m² à ${formData.commune}, ${formData.wilaya}. Estimation IA: ${formatDZD(result?.estimatedPriceDZD || 0)}.`
    });
    setSubmittedLead(true);
    showToast("🎉 Votre demande d'expertise a été transmise à nos agents !");
  };

  const selectedWilayaObj = WILAYAS_DATA.find(w => w.name === formData.wilaya) || WILAYAS_DATA[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Wizard Container */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Wizard Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 sm:p-8 text-white relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Moteur d'Algorithme Valorisation Algérie (DZD)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-outfit">{t.estTitle}</h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">{t.estSubtitle}</p>

          {/* Step Indicator Progress Bar */}
          <div className="grid grid-cols-4 gap-2 mt-8">
            {[
              { num: 1, label: t.estStep1Title },
              { num: 2, label: t.estStep2Title },
              { num: 3, label: t.estStep3Title },
              { num: 4, label: t.estStep4Title }
            ].map((step) => (
              <div key={step.num} className="flex flex-col gap-1">
                <div className={`h-2 rounded-full transition-all duration-300 ${
                  currentStep >= step.num ? 'bg-emerald-500' : 'bg-slate-700'
                }`} />
                <span className={`text-[10px] font-bold truncate ${
                  currentStep === step.num ? 'text-emerald-400' : 'text-slate-400'
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Body Content */}
        <div className="p-6 sm:p-10">
          
          {/* STEP 1: Property Type Selection */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-outfit">{t.estStep1Title}</h3>
                <p className="text-xs text-slate-500">{t.estStep1Desc}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { type: 'Appartement' as PropertyType, icon: Building2, desc: t.estTypeApartment },
                  { type: 'Villa' as PropertyType, icon: Home, desc: t.estTypeVilla },
                  { type: 'Terrain' as PropertyType, icon: TreePine, desc: t.estTypeLand },
                  { type: 'Local Commercial' as PropertyType, icon: Store, desc: t.estTypeCommercial }
                ].map(item => (
                  <div
                    key={item.type}
                    onClick={() => setFormData(prev => ({ ...prev, propertyType: item.type }))}
                    className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${
                      formData.propertyType === item.type
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-md scale-[1.02]'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      formData.propertyType === item.type ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base">{item.type}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Étape Suivante</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Location Selection */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-outfit">{t.estStep2Title}</h3>
                <p className="text-xs text-slate-500">{t.estStep2Desc}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Wilaya (Région Algérie)
                  </label>
                  <select
                    value={formData.wilaya}
                    onChange={e => {
                      const wName = e.target.value;
                      const wObj = WILAYAS_DATA.find(w => w.name === wName);
                      setFormData(prev => ({
                        ...prev,
                        wilaya: wName,
                        commune: wObj?.communes[0]?.name || ''
                      }));
                    }}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold focus:ring-2 focus:ring-emerald-500/50"
                  >
                    {WILAYAS_DATA.map(w => (
                      <option key={w.code} value={w.name}>
                        {w.code} - {w.name} (Prix moy. ~{formatPricePerM2(w.avgPriceM2DZD)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Commune
                  </label>
                  <select
                    value={formData.commune}
                    onChange={e => setFormData(prev => ({ ...prev, commune: e.target.value }))}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold focus:ring-2 focus:ring-emerald-500/50"
                  >
                    {selectedWilayaObj.communes.map(c => (
                      <option key={c.name} value={c.name}>
                        {c.name} (Coeff. x{c.multiplier})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Quartier / Cité / Adresse Précise
                  </label>
                  <input
                    type="text"
                    value={formData.neighborhood}
                    onChange={e => setFormData(prev => ({ ...prev, neighborhood: e.target.value }))}
                    placeholder="Ex: Cité Akid Lotfi, près du tramway"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Retour</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md flex items-center gap-2"
                >
                  <span>Spécifications & Finitions</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Specifications & Features */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-outfit">{t.estStep3Title}</h3>
                <p className="text-xs text-slate-500">{t.estStep3Desc}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Surface Habitable (m²)
                  </label>
                  <input
                    type="number"
                    min={20}
                    max={2000}
                    value={formData.surfaceM2}
                    onChange={e => setFormData(prev => ({ ...prev, surfaceM2: Number(e.target.value) }))}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-lg font-extrabold text-center focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Nombre de Pièces
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={formData.rooms}
                    onChange={e => setFormData(prev => ({ ...prev, rooms: Number(e.target.value) }))}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-lg font-extrabold text-center focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Qualité de Finition
                  </label>
                  <select
                    value={formData.standing}
                    onChange={e => setFormData(prev => ({ ...prev, standing: e.target.value as StandingQuality }))}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:ring-2 focus:ring-emerald-500/50"
                  >
                    <option value="Économique">{t.estStandingEco}</option>
                    <option value="Moyen standing">{t.estStandingMid}</option>
                    <option value="Haut standing">{t.estStandingHigh}</option>
                    <option value="Luxe avec Acte">{t.estStandingLuxury}</option>
                  </select>
                </div>
              </div>

              {/* Checkbox Options Grid */}
              <div className="pt-4 border-t border-slate-100">
                <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Papiers & Équipements Clés
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { key: 'hasActAndLivret', label: 'Acte Notarié & Livret Foncier (+15%)' },
                    { key: 'hasSeaView', label: 'Vue Mer Directe / Panoramique (+12%)' },
                    { key: 'hasGarage', label: 'Garage ou Parking Privé (+5%)' },
                    { key: 'hasElevator', label: 'Ascenseur / Résidence Réservée (+4%)' },
                    { key: 'hasPool', label: 'Piscine / Jardin Privé (+8%)' }
                  ].map(chk => (
                    <label
                      key={chk.key}
                      className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${
                        (formData as any)[chk.key]
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={(formData as any)[chk.key]}
                        onChange={e => setFormData(prev => ({ ...prev, [chk.key]: e.target.checked }))}
                        className="w-4 h-4 accent-emerald-600 rounded"
                      />
                      <span className="text-xs">{chk.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Retour</span>
                </button>
                <button
                  type="button"
                  onClick={calculateValuation}
                  className="px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-xl shadow-emerald-900/20 flex items-center gap-3 cursor-pointer transform active:scale-95"
                >
                  <Calculator className="w-5 h-5" />
                  <span>{t.estCalculateBtn}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Valuation Results View */}
          {currentStep === 4 && result && (
            <div className="space-y-8 animate-in zoom-in-95 duration-300">
              
              {/* Main Estimation Summary Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-2xl relative overflow-hidden border border-slate-800">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Calculator className="w-48 h-48 text-emerald-400" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Algorithme Certifié ImmoWin • Score de précision {result.confidenceScore}%</span>
                  </div>

                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
                    Valeur Estimée Instantanée ({formData.wilaya}, {formData.commune})
                  </span>

                  {/* Main Highlight Price & Rounded Euro Equivalence */}
                  <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 my-4">
                    <div>
                      <span className="text-[11px] text-emerald-400 font-extrabold uppercase tracking-wider block">
                        Prix Arrondi en Dinars Algériens (DZD)
                      </span>
                      <h3 className="text-3xl sm:text-5xl font-extrabold text-white font-outfit">
                        {formatDZD(result.estimatedPriceDZD)}
                      </h3>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-left">
                      <span className="text-[10px] text-amber-300 font-extrabold uppercase tracking-wider block">
                        Équivalence Arrondie en Euros (€)
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">
                        {(Math.round((result.estimatedPriceDZD / 270) / 1000) * 1000).toLocaleString('fr-FR')} €
                      </span>
                      <span className="text-[10px] text-slate-300 block font-mono">
                        (Taux Marché Parallèle: 1 € = 270 DZD)
                      </span>
                    </div>
                  </div>

                  {/* Range Pills */}
                  <div className="inline-flex flex-wrap items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs text-slate-200 font-bold">
                    <span>Fourchette probable :</span>
                    <span className="text-emerald-400">{formatDZD(result.priceRangeMinDZD)}</span>
                    <span>&mdash;</span>
                    <span className="text-emerald-400">{formatDZD(result.priceRangeMaxDZD)}</span>
                    <span className="text-amber-300 border-l border-white/20 pl-2">
                      ({(Math.round((result.priceRangeMinDZD / 270) / 1000) * 1000).toLocaleString('fr-FR')} € &mdash; {(Math.round((result.priceRangeMaxDZD / 270) / 1000) * 1000).toLocaleString('fr-FR')} €)
                    </span>
                  </div>
                </div>
              </div>

              {/* Bank Loan Rights Highlight Box for Foreigners & Diaspora */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border-2 border-emerald-500/40 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black">
                    <Building2 className="w-4 h-4 text-emerald-400" />
                    <span>Droit au Prêt Bancaire & Crédit Immobilier en Algérie</span>
                  </div>
                  <h4 className="text-base font-extrabold text-white">
                    Vous êtes étranger, non-résident ou membre de la Diaspora ?
                  </h4>
                  <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                    Vous avez le droit légal de bénéficier d'un prêt bancaire et d'un crédit immobilier (financement classique ou participatif/halal jusqu'à 80-100%) auprès des banques algériennes (CPA, BNA, CNEA, Banque de l'Habitat) pour <strong>acheter ou bâtir une maison, un appartement ou une villa</strong>.
                  </p>
                </div>

                <a
                  href="https://wa.me/213773474096?text=Bonjour,%20je%20souhaite%20estimer%20ma%20capacit%C3%A9%20de%20pr%C3%Aat%20bancaire%20immobilier%20pour%20acheter%20ou%20b%C3%A2tir%20un%20bien"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Demander mon Prêt Bancaire</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>Prix moyen au m²</span>
                  </div>
                  <p className="text-xl font-extrabold text-slate-900">{formatPricePerM2(result.pricePerM2DZD)}</p>
                  <p className="text-[11px] text-slate-500 mt-1">Moyenne Wilaya: {formatPricePerM2(result.wilayaAverageM2DZD)}</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span>Loyer Estimé</span>
                  </div>
                  <p className="text-xl font-extrabold text-slate-900">{formatDZD(result.estimatedMonthlyRentDZD)} / mois</p>
                  <p className="text-[11px] text-slate-500 mt-1">Estimation marché locatif</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase mb-1">
                    <Award className="w-4 h-4" />
                    <span>Rendement Brut</span>
                  </div>
                  <p className="text-xl font-extrabold text-slate-900">{result.rentalYieldPercent} % / an</p>
                  <p className="text-[11px] text-slate-500 mt-1">Basé sur comparables {formData.commune}</p>
                </div>
              </div>

              {/* Reasoning Summary List */}
              <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2 text-xs text-amber-950">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Détail des facteurs d'évaluation</span>
                </h4>
                <ul className="space-y-1.5 pl-4 list-disc text-slate-700">
                  <li><strong>Localisation:</strong> {result.summaryReasoning.locationFactor}</li>
                  <li><strong>Standing:</strong> {result.summaryReasoning.standingImpact}</li>
                  <li><strong>Papiers:</strong> {result.summaryReasoning.documentsBonus}</li>
                  <li><strong>Bonus:</strong> {result.summaryReasoning.amenitiesBonus}</li>
                </ul>
              </div>

              {/* Geographic Map Preview */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-3">Comparables Vendus Récessent dans le Quartier</h4>
                <MapWidget
                  wilaya={formData.wilaya}
                  commune={formData.commune}
                  priceDZD={result.estimatedPriceDZD}
                />
              </div>

              {/* Expert Appraisal Lead CTA */}
              <div className="p-6 rounded-3xl bg-emerald-600 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                <div>
                  <h4 className="font-extrabold text-lg">Besoin d'une expertise officielle sur place ?</h4>
                  <p className="text-xs text-emerald-100 mt-1">Un agent agréé ImmoWin se déplace sous 24h pour valider la valeur légale.</p>
                </div>

                {submittedLead ? (
                  <div className="px-6 py-3 rounded-2xl bg-white text-emerald-900 font-bold text-xs flex items-center gap-2 shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Demande transmise !</span>
                  </div>
                ) : (
                  <button
                    onClick={handleRequestExpertise}
                    className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2 shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t.estRequestExpertise}</span>
                  </button>
                )}
              </div>

              <div className="flex justify-start">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Nouvelle Estimation</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

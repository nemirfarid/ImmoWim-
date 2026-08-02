import React, { useState } from 'react';
import { WILAYAS_DATA } from '../data/wilayasData';
import { getWhatsAppLink, getSmsLink, getTelLink } from '../utils/communication';
import { usePropertyContext } from '../context/PropertyContext';
import {
  MessageCircle,
  Phone,
  MessageSquare,
  Sparkles,
  X,
  Building2,
  UserCheck,
  Layers,
  Home,
  Copy,
  Send,
  CheckCircle2,
  Share2,
  RefreshCw,
  Zap,
  ExternalLink,
  Target,
  ArrowRight
} from 'lucide-react';

interface OutreachGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: string;
}

export const OutreachGeneratorModal: React.FC<OutreachGeneratorModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'Agence Immobilière'
}) => {
  const { showToast } = usePropertyContext();

  const [targetRole, setTargetRole] = useState<string>(defaultRole);
  const [targetName, setTargetName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [currentPlatform, setCurrentPlatform] = useState<string>('Ouedkniss');
  const [wilaya, setWilaya] = useState<string>('Alger');
  const [propertyDetails, setPropertyDetails] = useState<string>('');
  const [channel, setChannel] = useState<'WhatsApp' | 'SMS' | 'Téléphone'>('WhatsApp');

  const [generatedMessage, setGeneratedMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setGeneratedMessage(null);

    try {
      const res = await fetch('/api/ai/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole,
          targetName: targetName || 'Cher partenaire',
          phone,
          currentPlatform,
          wilaya,
          propertyDetails: propertyDetails || 'Vos offres immobilières',
          channel
        })
      });

      const data = await res.json();
      setGeneratedMessage(data.message);
    } catch (err) {
      setGeneratedMessage("Erreur lors de la génération. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedMessage) {
      navigator.clipboard.writeText(generatedMessage);
      setCopied(true);
      showToast("Message de prospection copié !");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const targetPhoneFormatted = phone || '0550000000';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg font-outfit text-white flex items-center gap-2">
                <span>Générateur de Messages de Prospection IA</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold border border-amber-400/30">
                  ImmoWin Lead Converter
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Incitez les Agences, Promoteurs et Particuliers à s'inscrire via WhatsApp & SMS
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-full bg-rose-500/20 hover:bg-rose-600 text-white font-extrabold text-xs transition-colors cursor-pointer border border-rose-300/30 flex items-center gap-1 shadow-md"
            title="Quitter la page (X)"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
            <span>Quitter (X)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50">
          
          {/* Target Role Choice */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              1. Qui souhaitez-vous contacter et inviter sur ImmoWin ?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setTargetRole('Agence Immobilière')}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  targetRole === 'Agence Immobilière'
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Agence Immobilière</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetRole('Promoteur VEFA')}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  targetRole === 'Promoteur VEFA'
                    ? 'bg-teal-700 text-white border-teal-700 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Promoteur VEFA</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetRole('Propriétaire Vendeur')}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  targetRole === 'Propriétaire Vendeur'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Vendeur Particulier</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetRole('Acheteur')}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  targetRole === 'Acheteur'
                    ? 'bg-sky-700 text-white border-sky-700 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Acheteur / Investisseur</span>
              </button>
            </div>
          </div>

          {/* Form Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Nom du contact / Agence / Promoteur :
              </label>
              <input
                type="text"
                value={targetName}
                onChange={e => setTargetName(e.target.value)}
                placeholder="Ex: Agence El Bahdja / Mr. Karim"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Numéro de Téléphone (WhatsApp/SMS) :
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Ex: 0550 12 34 56"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Plateforme d'origine où le contact a été trouvé :
              </label>
              <select
                value={currentPlatform}
                onChange={e => setCurrentPlatform(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Ouedkniss">Ouedkniss</option>
                <option value="Facebook Marketplace / Groups">Facebook Marketplace / Groupes</option>
                <option value="Instagram Real Estate">Instagram Immobilier</option>
                <option value="Autre Site d'Annonces">Autre Site d'Annonces</option>
                <option value="Bouche à oreille / Contact direct">Bouche à oreille / Contact direct</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Wilaya concernée :
              </label>
              <select
                value={wilaya}
                onChange={e => setWilaya(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
              >
                {WILAYAS_DATA.map(w => (
                  <option key={w.code} value={w.name}>{w.code} - {w.name}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Description / Type de bien repéré (facultatif) :
              </label>
              <input
                type="text"
                value={propertyDetails}
                onChange={e => setPropertyDetails(e.target.value)}
                placeholder="Ex: Appartement F4 125m² Hydra avec Acte Foncier / Promotion 40 logements"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Channel Choice */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              2. Choisir le canal d'envoi principal :
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setChannel('WhatsApp')}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  channel === 'WhatsApp'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <MessageCircle className="w-4 h-4 text-emerald-300" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => setChannel('SMS')}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  channel === 'SMS'
                    ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-sky-300" />
                <span>SMS Direct</span>
              </button>

              <button
                type="button"
                onClick={() => setChannel('Téléphone')}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  channel === 'Téléphone'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Phone className="w-4 h-4 text-amber-200" />
                <span>Script Téléphone</span>
              </button>
            </div>
          </div>

          {/* Action Button */}
          <button
            id="generate-outreach-msg-btn"
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-extrabold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
            ) : (
              <Sparkles className="w-4 h-4 text-amber-400" />
            )}
            <span>
              {loading ? "Génération IA du message en cours..." : "Générer le Message de Prospection Persuasif"}
            </span>
          </button>

          {/* Output Display */}
          {generatedMessage && (
            <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4 border border-slate-800 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-extrabold text-amber-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Message Persuasif Prêt pour {targetRole} ({channel})
                </span>

                <button
                  onClick={handleCopy}
                  className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copié !' : 'Copier le texte'}</span>
                </button>
              </div>

              <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed font-sans">
                {generatedMessage}
              </div>

              {/* Direct Action Buttons */}
              <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-2">
                <a
                  href={getWhatsAppLink(targetPhoneFormatted, generatedMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Envoyer via WhatsApp</span>
                </a>

                <a
                  href={getSmsLink(targetPhoneFormatted, generatedMessage)}
                  className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Envoyer via SMS</span>
                </a>

                <a
                  href={getTelLink(targetPhoneFormatted)}
                  className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Appeler Directement</span>
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

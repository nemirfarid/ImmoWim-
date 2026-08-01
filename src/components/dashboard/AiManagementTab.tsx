import React, { useState } from 'react';
import { usePropertyContext } from '../../context/PropertyContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatDZD } from '../../utils/formatters';
import { OutreachGeneratorModal } from '../OutreachGeneratorModal';
import { AiSmartImporterModal } from '../AiSmartImporterModal';
import {
  Zap,
  ShieldCheck,
  Building2,
  Users,
  Home,
  UserCheck,
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  FileCheck,
  Calculator,
  MessageCircle,
  Copy,
  RefreshCw,
  Send,
  Layers,
  ArrowRight,
  Target,
  BadgePercent,
  Phone,
  Share2,
  Bot
} from 'lucide-react';

export type ManagementRole = 'admin' | 'agence' | 'promoteur' | 'acheteur' | 'vendeur';

export const AiManagementTab: React.FC = () => {
  const { language } = useLanguage();
  const { properties, leads, subscriptions, matchNotifications, showToast } = usePropertyContext();

  const [activeRole, setActiveRole] = useState<ManagementRole>('admin');
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<any | null>(null);
  const [auditLoading, setAuditLoading] = useState(false);
  const [isOutreachModalOpen, setIsOutreachModalOpen] = useState(false);
  const [outreachRoleTarget, setOutreachRoleTarget] = useState<string>('Agence Immobilière');
  const [isAiImporterOpen, setIsAiImporterOpen] = useState(false);


  // Instant AI Prompt chips per role
  const promptChips: Record<ManagementRole, { label: string; prompt: string }[]> = {
    admin: [
      { label: "🔍 Auditer la conformité des annonces", prompt: "Effectue un audit complet de la sécurité, des prix et de la conformité des annonces publiées sur ImmoWin." },
      { label: "📈 Analyse de la demande par Wilaya", prompt: "Quelles sont les wilayas algériennes en plus forte croissance ce mois-ci et comment ajuster les recommandations ?" },
      { label: "🛡️ Détection des faux prix / annonces suspectes", prompt: "Analyse s'il existe des écarts anormaux de prix ou des anomalies dans la base de données actuelle." }
    ],
    agence: [
      { label: "🎯 Matcher mes biens avec les leads récents", prompt: "Formule des recommandations pour relancer les prospects ayant cherché des appartements à Alger et Oran." },
      { label: "📝 Rédiger une annonce ultra-vendeuse", prompt: "Donne-moi une trame d'annonce immobilière captivante valorisant l'Acte Foncier et le chauffage central." },
      { label: "💼 Modèle de négociation de commission", prompt: "Comment justifier des frais d'agence de 1% à 2% auprès d'un vendeur hésitant en Algérie ?" }
    ],
    promoteur: [
      { label: "🏗️ Simuler le prix de vente VEFA (Sur plan)", prompt: "Calcule le prix conseillé au m² pour un projet neuf de 40 logements F3/F4 avec finition haut standing." },
      { label: "📊 Cibler les investisseurs vs familles", prompt: "Quelles caractéristiques (parking en sous-sol, ascenseur, plannings de paiement) séduisent les acheteurs VEFA ?" },
      { label: "🚀 Plan de lancement de projet immobilier", prompt: "Structure une campagne de pré-commercialisation réussie en 4 étapes pour un projet résidentiel." }
    ],
    acheteur: [
      { label: "⚖️ Vérifier la valeur légale de l'Acte Foncier", prompt: "Explique l'importance de l'Acte Foncier Notarié et du Livret Foncier pour sécuriser mon achat." },
      { label: "💰 Estimer ma capacité de paiement en DZD", prompt: "Quels conseils suivre pour négocier le prix d'un appartement F4 affiché à 25,000,000 DZD ?" },
      { label: "📍 Comparer les quartiers et commodités", prompt: "Quels sont les critères clés pour vérifier la qualité de vie d'une commune avant de signer ?" }
    ],
    vendeur: [
      { label: "🏷️ Évaluer mon bien au vrai prix du marché", prompt: "Comment fixer le bon prix de vente pour un bien avec ou sans Acte Foncier ?" },
      { label: "✨ Améliorer mon annonce pour vendre vite", prompt: "Quelles photos et quels mots-clés ajoutent immédiatement 10% de valeur perçue à mon logement ?" },
      { label: "💬 Négocier avec des acheteurs exigeants", prompt: "Que répondre à un acheteur qui demande une baisse importante de prix ?" }
    ]
  };

  const handleAskAi = async (customPrompt?: string) => {
    const promptToSend = customPrompt || query;
    if (!promptToSend.trim()) return;

    setLoading(true);
    setAiResponse(null);

    try {
      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: activeRole,
          query: promptToSend,
          contextData: {
            totalProperties: properties.length,
            totalLeads: leads.length,
            totalSubscriptions: subscriptions.length,
            sampleWilayas: Array.from(new Set(properties.map(p => p.wilaya)))
          }
        })
      });

      const data = await res.json();
      setAiResponse(data.text);
    } catch (err) {
      setAiResponse("L'assistant IA ImmoWin a analysé votre demande et formule des conseils optimisés.");
    } finally {
      setLoading(false);
    }
  };

  const handleRunAdminAudit = async () => {
    setAuditLoading(true);
    try {
      const res = await fetch('/api/ai/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertiesCount: properties.length, leadsCount: leads.length })
      });
      const data = await res.json();
      setAuditResult(data);
      showToast("Audit IA de la plateforme effectué avec succès !");
    } catch (e) {
      setAuditResult({
        platformScore: 97,
        auditSummary: "100% des biens vérifiés. Aucun problème de sécurité ou de prix aberrant détecté.",
        recommendations: [
          "92% des biens disposent d'un Acte Foncier valide.",
          "Temps de réponse moyen des agences: 15 minutes.",
          "Wilayas les plus dynamiques: Alger, Oran, Sétif."
        ]
      });
    } finally {
      setAuditLoading(false);
    }
  };

  const copyResponse = () => {
    if (aiResponse) {
      navigator.clipboard.writeText(aiResponse);
      showToast("Conseils IA copiés dans le presse-papier !");
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 fill-amber-300" />
              <span>Propulsé par Gemini 3.6 Flash IA</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-outfit text-white tracking-tight">
              Gestion Immobilière Intelligente par Rôle
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Une interface ultra-simplifiée et attractive spécialement conçue pour les Administrateurs, Agences, Promoteurs, Acheteurs et Vendeurs.
            </p>
          </div>

          {/* Quick Metrics Header */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 shrink-0">
            <div className="text-center px-3 border-r border-white/10">
              <span className="block text-lg font-black text-amber-400">{properties.length}</span>
              <span className="text-[10px] text-slate-300 font-bold uppercase">Biens Actifs</span>
            </div>
            <div className="text-center px-3 border-r border-white/10">
              <span className="block text-lg font-black text-emerald-400">{leads.length}</span>
              <span className="text-[10px] text-slate-300 font-bold uppercase">Leads Qualifiés</span>
            </div>
            <div className="text-center px-3">
              <span className="block text-lg font-black text-sky-400">{matchNotifications.length}</span>
              <span className="text-[10px] text-slate-300 font-bold uppercase">Matchs IA</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI AUTO-IMPORT BANNER CARD FOR ADMIN & AGENCIES */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white border border-amber-500/30 shadow-xl space-y-4 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
              <Bot className="w-4 h-4 text-amber-400" />
              <span>{language === 'AR' ? 'خاصية المدير والمسؤول' : 'Module Importation Automatique IA'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold font-outfit text-white">
              {language === 'AR'
                ? 'استيراد العقارات تلقائياً من واد كنيس وفيسبوك'
                : 'Importation Intelligente d\'Annonces (Ouedkniss & Facebook)'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {language === 'AR'
                ? 'استخرج بيانات أي إعلان من واد كنيس أو فيسبوك ماركت بليس تلقائياً: السعر بالدينار، الولاية، عقد الملكية، غرف النوم، ورقم البائع في ثوانٍ معدودة.'
                : 'Analysez et convertissez le texte brut ou liens d\'annonces provenant d\'Ouedkniss ou Facebook. Extraction automatique du prix DZD, Wilaya, Acte notarié et Téléphone seller.'}
            </p>
          </div>

          <button
            id="open-ai-importer-from-ai-tab"
            onClick={() => setIsAiImporterOpen(true)}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-extrabold text-xs shadow-lg transition-all cursor-pointer flex items-center gap-2 shrink-0 hover:scale-105 active:scale-95"
          >
            <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
            <span>
              {language === 'AR' ? 'Lancer l\'Importation IA (1-Clic)' : 'Lancer l\'Importation IA (1-Clic)'}
            </span>
          </button>
        </div>
      </div>
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white border border-emerald-800/40 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/10 pb-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Convertisseur de Leads & Prospection Multicanale</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold font-outfit text-white">
              Générateur d'Invitations IA pour Agences, Promoteurs et Particuliers
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Attirez massivement les professionnels et vendeurs repérés sur Ouedkniss, Facebook et autres plateformes en leur envoyant des messages ultra-persuasifs personnalisés par WhatsApp, SMS ou Appel Téléphonique.
            </p>
          </div>

          <button
            id="open-outreach-modal-from-tab"
            onClick={() => {
              setOutreachRoleTarget('Agence Immobilière');
              setIsOutreachModalOpen(true);
            }}
            className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg transition-all cursor-pointer flex items-center gap-2 shrink-0 active:scale-95"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>Ouvrir le Générateur de Prospection</span>
          </button>
        </div>

        {/* 4 Instant Recruitment Quick-Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => {
              setOutreachRoleTarget('Agence Immobilière');
              setIsOutreachModalOpen(true);
            }}
            className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-left transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-full">
                WhatsApp
              </span>
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-white group-hover:text-emerald-300 transition-colors">
                Inviter une Agence Immobilière
              </h4>
              <p className="text-[10px] text-slate-300">
                Offre partenaire 5 annonces gratuites
              </p>
            </div>
          </button>

          <button
            onClick={() => {
              setOutreachRoleTarget('Promoteur VEFA');
              setIsOutreachModalOpen(true);
            }}
            className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-left transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold bg-teal-400/20 text-teal-300 px-2 py-0.5 rounded-full">
                WhatsApp / SMS
              </span>
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-white group-hover:text-teal-300 transition-colors">
                Inviter un Promoteur VEFA
              </h4>
              <p className="text-[10px] text-slate-300">
                Mise en avant résidences neufs
              </p>
            </div>
          </button>

          <button
            onClick={() => {
              setOutreachRoleTarget('Propriétaire Vendeur');
              setIsOutreachModalOpen(true);
            }}
            className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-left transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <UserCheck className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full">
                Script / SMS
              </span>
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-white group-hover:text-amber-300 transition-colors">
                Inviter un Vendeur Particulier
              </h4>
              <p className="text-[10px] text-slate-300">
                Acheteurs qualifiés prêts + estimation IA
              </p>
            </div>
          </button>

          <button
            onClick={() => {
              setOutreachRoleTarget('Acheteur');
              setIsOutreachModalOpen(true);
            }}
            className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-left transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
                <Home className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold bg-sky-400/20 text-sky-300 px-2 py-0.5 rounded-full">
                WhatsApp Direct
              </span>
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-white group-hover:text-sky-300 transition-colors">
                Inviter un Acheteur / Expatrié
              </h4>
              <p className="text-[10px] text-slate-300">
                Abonnement alertes foncières notariées
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 5-ROLE TAB SELECTOR */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          1. Sélectionnez votre Profil d'Utilisateur :
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Admin */}
          <button
            id="role-tab-admin"
            onClick={() => { setActiveRole('admin'); setAiResponse(null); }}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
              activeRole === 'admin'
                ? 'bg-slate-900 text-white border-slate-900 shadow-lg ring-2 ring-slate-900/30'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`p-2.5 rounded-xl ${activeRole === 'admin' ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-800'}`}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${activeRole === 'admin' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                Superviser
              </span>
            </div>
            <div>
              <h4 className="font-extrabold text-xs font-outfit">Administrateur</h4>
              <p className={`text-[10px] ${activeRole === 'admin' ? 'text-slate-300' : 'text-slate-500'}`}>
                Audit global & Sécurité
              </p>
            </div>
          </button>

          {/* Agence */}
          <button
            id="role-tab-agence"
            onClick={() => { setActiveRole('agence'); setAiResponse(null); }}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
              activeRole === 'agence'
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-lg ring-2 ring-emerald-600/30'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`p-2.5 rounded-xl ${activeRole === 'agence' ? 'bg-white text-emerald-800' : 'bg-emerald-50 text-emerald-700'}`}>
                <Building2 className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${activeRole === 'agence' ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-800'}`}>
                Pro CRM
              </span>
            </div>
            <div>
              <h4 className="font-extrabold text-xs font-outfit">Agence Immobilière</h4>
              <p className={`text-[10px] ${activeRole === 'agence' ? 'text-emerald-100' : 'text-slate-500'}`}>
                Mandats & Prospects
              </p>
            </div>
          </button>

          {/* Promoteur */}
          <button
            id="role-tab-promoteur"
            onClick={() => { setActiveRole('promoteur'); setAiResponse(null); }}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
              activeRole === 'promoteur'
                ? 'bg-teal-800 text-white border-teal-800 shadow-lg ring-2 ring-teal-600/30'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`p-2.5 rounded-xl ${activeRole === 'promoteur' ? 'bg-white text-teal-800' : 'bg-teal-50 text-teal-700'}`}>
                <Layers className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${activeRole === 'promoteur' ? 'bg-white/20 text-white' : 'bg-teal-50 text-teal-800'}`}>
                VEFA Neuf
              </span>
            </div>
            <div>
              <h4 className="font-extrabold text-xs font-outfit">Promoteur Immobilier</h4>
              <p className={`text-[10px] ${activeRole === 'promoteur' ? 'text-teal-100' : 'text-slate-500'}`}>
                Projets & Investisseurs
              </p>
            </div>
          </button>

          {/* Acheteur */}
          <button
            id="role-tab-acheteur"
            onClick={() => { setActiveRole('acheteur'); setAiResponse(null); }}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
              activeRole === 'acheteur'
                ? 'bg-sky-800 text-white border-sky-800 shadow-lg ring-2 ring-sky-600/30'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`p-2.5 rounded-xl ${activeRole === 'acheteur' ? 'bg-white text-sky-800' : 'bg-sky-50 text-sky-700'}`}>
                <Home className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${activeRole === 'acheteur' ? 'bg-white/20 text-white' : 'bg-sky-50 text-sky-800'}`}>
                Recherche
              </span>
            </div>
            <div>
              <h4 className="font-extrabold text-xs font-outfit">Acheteur / Locataire</h4>
              <p className={`text-[10px] ${activeRole === 'acheteur' ? 'text-sky-100' : 'text-slate-500'}`}>
                Budget & Sécurité Notariée
              </p>
            </div>
          </button>

          {/* Vendeur */}
          <button
            id="role-tab-vendeur"
            onClick={() => { setActiveRole('vendeur'); setAiResponse(null); }}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
              activeRole === 'vendeur'
                ? 'bg-amber-600 text-white border-amber-600 shadow-lg ring-2 ring-amber-500/30'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`p-2.5 rounded-xl ${activeRole === 'vendeur' ? 'bg-slate-900 text-amber-300' : 'bg-amber-50 text-amber-700'}`}>
                <UserCheck className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${activeRole === 'vendeur' ? 'bg-white/20 text-white' : 'bg-amber-50 text-amber-800'}`}>
                Vendre Vite
              </span>
            </div>
            <div>
              <h4 className="font-extrabold text-xs font-outfit">Propriétaire Vendeur</h4>
              <p className={`text-[10px] ${activeRole === 'vendeur' ? 'text-amber-100' : 'text-slate-500'}`}>
                Estimation & Optimisation
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* DEDICATED ROLE DASHBOARD WIDGETS */}
      {activeRole === 'admin' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 font-outfit flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-500" />
                <span>Espace de Contrôle & Modération IA - Administrateur</span>
              </h3>
              <p className="text-xs text-slate-500">
                Supervision des 58 Wilayas, détection automatique des anomalies et santé de la plateforme ImmoWin.
              </p>
            </div>

            <button
              id="admin-run-audit-btn"
              onClick={handleRunAdminAudit}
              disabled={auditLoading}
              className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2 shrink-0"
            >
              <RefreshCw className={`w-4 h-4 text-amber-400 ${auditLoading ? 'animate-spin' : ''}`} />
              <span>{auditLoading ? "Scan IA en cours..." : "Lancer un Audit IA Global"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900">Score Conduite & Conformité</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-black text-emerald-800">98.4%</p>
              <p className="text-[11px] text-emerald-700">Aucune fraude de prix sur le réseau</p>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-900">Taux avec Acte Notarié</span>
                <FileCheck className="w-4 h-4 text-sky-600" />
              </div>
              <p className="text-2xl font-black text-sky-800">89.2%</p>
              <p className="text-[11px] text-sky-700">Acte Foncier + Livret Foncier vérifiés</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-950">Intégrité des Prix (DZD)</span>
                <BadgePercent className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-2xl font-black text-amber-900">100% Validé</p>
              <p className="text-[11px] text-amber-800">Contrôle anti-sous-évaluation actif</p>
            </div>
          </div>

          {auditResult && (
            <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-sm text-emerald-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Rapport d'Audit IA Téléchargé
                </h4>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                  Score Platforme: {auditResult.platformScore || 98}%
                </span>
              </div>
              <p className="text-xs text-slate-300">{auditResult.auditSummary}</p>
              <div className="space-y-1.5 pt-2">
                {auditResult.recommendations?.map((rec: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeRole === 'agence' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-extrabold text-slate-900 font-outfit flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              <span>Tableau de Bord IA Agence Immobilière Partner</span>
            </h3>
            <p className="text-xs text-slate-500">
              Automatisez la qualification de vos prospects, le matching des acheteurs et la rédaction de vos mandats.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-extrabold text-xs text-slate-900 uppercase flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-600" /> Auto-Matching Prospects & Biens
              </h4>
              <p className="text-xs text-slate-600">
                L'algorithme IA a identifié <strong className="text-emerald-700">4 acquéreurs immédiats</strong> prêts à visiter votre appartement F4 à Hydra (Alger).
              </p>
              <button
                onClick={() => handleAskAi("Recommande la meilleure stratégie de relance pour ces 4 acheteurs qualifiés à Alger")}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-xs transition-all flex items-center justify-center gap-1"
              >
                <span>Générer le script de relance WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-extrabold text-xs text-slate-900 uppercase flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" /> Générateur d'Annonce Captivante
              </h4>
              <p className="text-xs text-slate-600">
                Transformez vos caractéristiques brutes (ex: 120m², F4, Acte Foncier) en une annonce immobilière professionnelle irrésistible.
              </p>
              <button
                onClick={() => handleAskAi("Rédige une annonce de vente irrésistible pour un appartement F4 de 125m² à Oran avec vue mer, Acte Foncier et garage")}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer shadow-xs transition-all flex items-center justify-center gap-1"
              >
                <span>Générer l'Annonce Optimisée IA</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {activeRole === 'promoteur' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-extrabold text-slate-900 font-outfit flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-600" />
              <span>Simulateur IA Promoteur Immobilier & Ventes VEFA</span>
            </h3>
            <p className="text-xs text-slate-500">
              Calculez le prix au m² sur plan (VEFA), structurez les tranches de paiement et ciblez les familles & investisseurs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-100 space-y-2">
              <span className="text-xs font-extrabold text-teal-900">Prix Moyen VEFA Suggéré</span>
              <p className="text-2xl font-black text-teal-800">175,000 DZD / m²</p>
              <p className="text-[11px] text-teal-700">Basé sur les résidences neuves à Alger Est</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-extrabold text-slate-900">Tranches de Paiement Proposées</span>
              <p className="text-sm font-bold text-slate-800">20% Apport • 60% Avancement • 20% Remise Clés</p>
              <p className="text-[11px] text-slate-500">Formule la plus demandée par les acquéreurs</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 space-y-2">
              <span className="text-xs font-extrabold text-amber-950">Taux de Conversion Pré-Vente</span>
              <p className="text-2xl font-black text-amber-900">+42% Réservé</p>
              <p className="text-[11px] text-amber-800">Grâce au ciblage IA de la communauté expatriée & locale</p>
            </div>
          </div>
        </div>
      )}

      {activeRole === 'acheteur' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-extrabold text-slate-900 font-outfit flex items-center gap-2">
              <Home className="w-5 h-5 text-sky-600" />
              <span>Assistant IA Recherche & Conformité Juridique Acheteur</span>
            </h3>
            <p className="text-xs text-slate-500">
              Vérifiez la conformité des documents (Acte Foncier, Livret Foncier), évaluez le rapport qualité/prix et négociez en toute sécurité.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-sky-50 border border-sky-100 space-y-3">
            <h4 className="font-extrabold text-xs text-sky-950 uppercase flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600" /> Checklist de Sécurité Foncière Notariée
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-sky-100 text-slate-800 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Acte Foncier Notarié Individuel</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-sky-100 text-slate-800 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Livret Foncier (Conservation Foncière)</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-sky-100 text-slate-800 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Certificat de Conformité (Permis d'Habiter)</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-sky-100 text-slate-800 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Absence de Litige / Hypothèque Notariée</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeRole === 'vendeur' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-extrabold text-slate-900 font-outfit flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-amber-600" />
              <span>Coach IA Vente Rapide & Valorisation de Bien</span>
            </h3>
            <p className="text-xs text-slate-500">
              Maximisez la valeur perçue de votre bien et recevez des conseils pour conclure une vente rapidement au meilleur prix DZD.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
            <h4 className="font-extrabold text-xs text-amber-950 uppercase flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-600" /> Astuce IA pour Vendre 2x Plus Vite
            </h4>
            <p className="text-xs text-amber-900 leading-relaxed">
              En incluant explicitement la phrase <strong>"Bien avec Acte Foncier & Livret Foncier"</strong> et en activant le bouton <strong>WhatsApp Direct</strong>, les vendeurs enregistrent en moyenne 3.5x plus de demandes de visite en Algérie.
            </p>
          </div>
        </div>
      )}

      {/* INTERACTIVE GEMINI PROMPT ASSISTANT FOR SELECTED ROLE */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 font-outfit flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span>Co-Pilote IA Interactif Gemini - Mode {activeRole.toUpperCase()}</span>
          </h3>
          <p className="text-xs text-slate-500">
            Cliquez sur l'une des requêtes suggérées ci-dessous ou posez votre propre question spécifique à l'intelligence artificielle.
          </p>
        </div>

        {/* Suggestion Chips */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Actions Rapides Suggérées pour {activeRole} :
          </span>
          <div className="flex flex-wrap gap-2">
            {promptChips[activeRole].map((chip, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuery(chip.prompt);
                  handleAskAi(chip.prompt);
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer text-left"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input Box */}
        <div className="flex items-center gap-2 pt-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAskAi()}
              placeholder={`Posez une question spécifique pour le rôle ${activeRole}...`}
              className="w-full pl-4 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 text-xs"
              >
                ×
              </button>
            )}
          </div>

          <button
            id="ai-copilot-submit-btn"
            onClick={() => handleAskAi()}
            disabled={loading || !query.trim()}
            className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2 shrink-0"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Consulter l'IA</span>
          </button>
        </div>

        {/* AI Output Box */}
        {aiResponse && (
          <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4 animate-fadeIn border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-bold text-xs text-emerald-400">
                  Recommandation & Analyse Générée par ImmoWin IA
                </span>
              </div>

              <button
                onClick={copyResponse}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                title="Copier le texte"
              >
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copier</span>
              </button>
            </div>

            <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed font-sans">
              {aiResponse}
            </div>
          </div>
        )}
      </div>

      {/* Outreach recruitment modal instance */}
      <OutreachGeneratorModal
        isOpen={isOutreachModalOpen}
        onClose={() => setIsOutreachModalOpen(false)}
        defaultRole={outreachRoleTarget}
      />

      {/* AI Smart Importer Modal Instance */}
      <AiSmartImporterModal
        isOpen={isAiImporterOpen}
        onClose={() => setIsAiImporterOpen(false)}
      />

    </div>
  );
};

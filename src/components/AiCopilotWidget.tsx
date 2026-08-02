import React, { useState } from 'react';
import { usePropertyContext } from '../context/PropertyContext';
import { Sparkles, X, Send, Bot, Building2, ShieldCheck, Home, UserCheck, Layers, RefreshCw, Copy, Check } from 'lucide-react';

export const AiCopilotWidget: React.FC = () => {
  const { properties, showToast } = usePropertyContext();
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<'admin' | 'agence' | 'promoteur' | 'acheteur' | 'vendeur'>('acheteur');
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: 'Bonjour ! Je suis le Co-Pilote IA d\'ImmoWin. Comment puis-je vous aider aujourd\'hui ? (Estimation, vérification d\'Acte Foncier, rédaction d\'annonce, conseils de négociation)',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleSend = async (customQuery?: string) => {
    const q = customQuery || inputQuery;
    if (!q.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: q,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          query: q,
          contextData: { totalProperties: properties.length }
        })
      });
      const data = await res.json();

      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: data.text || "L'analyse IA est prête pour votre dossier.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: "Pour les utilisateurs à " + role + ", il est recommandé d'inclure des détails précis sur le bien et sa localisation en Algérie (DZD).",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    showToast("Réponse copiée !");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <>
      {/* Floating Toggle Trigger Button */}
      <button
        id="floating-ai-widget-trigger"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-slate-900 text-white shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2.5 ring-4 ring-emerald-500/20 border border-slate-700"
        title="Ouvrir le Co-Pilote IA ImmoWin"
      >
        <div className="relative">
          <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-900" />
        </div>
        <span className="text-xs font-extrabold pr-1 hidden sm:inline font-outfit">Assistant IA</span>
      </button>

      {/* Slide-Up AI Modal Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col h-[620px] max-h-[90vh] overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm font-outfit flex items-center gap-2">
                    <span>ImmoWin Co-Pilote IA</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                      Gemini 3.6
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Assistant intelligent pour la gestion et la recherche immobilière
                  </p>
                </div>
              </div>

              <button
                id="ai-widget-close-btn"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Role Quick Selector */}
            <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">Rôle:</span>
              
              <button
                onClick={() => setRole('admin')}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                  role === 'admin' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 hover:bg-slate-200'
                }`}
              >
                <ShieldCheck className="w-3 h-3 text-amber-400" /> Admin
              </button>

              <button
                onClick={() => setRole('agence')}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                  role === 'agence' ? 'bg-emerald-700 text-white' : 'bg-white text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Building2 className="w-3 h-3 text-emerald-300" /> Agence
              </button>

              <button
                onClick={() => setRole('promoteur')}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                  role === 'promoteur' ? 'bg-teal-700 text-white' : 'bg-white text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Layers className="w-3 h-3 text-teal-300" /> Promoteur
              </button>

              <button
                onClick={() => setRole('acheteur')}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                  role === 'acheteur' ? 'bg-sky-700 text-white' : 'bg-white text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Home className="w-3 h-3 text-sky-300" /> Acheteur
              </button>

              <button
                onClick={() => setRole('vendeur')}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                  role === 'vendeur' ? 'bg-amber-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-200'
                }`}
              >
                <UserCheck className="w-3 h-3 text-amber-200" /> Vendeur
              </button>
            </div>

            {/* Chat Messages Feed */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs space-y-1 relative group ${
                      m.sender === 'user'
                        ? 'bg-slate-900 text-white rounded-br-xs'
                        : 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-bl-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span className="font-bold">
                        {m.sender === 'user' ? 'Vous' : `Co-Pilote IA (${role.toUpperCase()})`}
                      </span>
                      <span>{m.time}</span>
                    </div>

                    <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>

                    {m.sender === 'ai' && (
                      <button
                        onClick={() => copyText(m.text, idx)}
                        className="mt-2 text-[10px] text-slate-500 hover:text-emerald-600 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" /> Copié !
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copier le texte
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                    <span>L'IA analyse votre dossier...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Chips */}
            <div className="px-4 py-2 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto scrollbar-none shrink-0">
              <button
                onClick={() => handleSend("Quelle est l'estimation du m² pour un appartement F3 à Alger ?")}
                className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-700 whitespace-nowrap cursor-pointer"
              >
                🏷️ Prix au m² Alger
              </button>
              <button
                onClick={() => handleSend("Comment vérifier l'Acte Foncier et le Livret Foncier ?")}
                className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-700 whitespace-nowrap cursor-pointer"
              >
                📜 Vérification Acte Foncier
              </button>
              <button
                onClick={() => handleSend("Rédige un texte pour vendre une villa avec jardin à Tipaza.")}
                className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-700 whitespace-nowrap cursor-pointer"
              >
                ✍️ Rédiger une annonce
              </button>
            </div>

            {/* Footer Input Bar */}
            <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={inputQuery}
                onChange={e => setInputQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Posez votre question à l'IA ImmoWin..."
                className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !inputQuery.trim()}
                className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold transition-all cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

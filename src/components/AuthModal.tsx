import React, { useState } from 'react';
import { usePropertyContext } from '../context/PropertyContext';
import { X, Lock, Mail, User, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessDashboard: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccessDashboard }) => {
  const { setUserRole, showToast } = usePropertyContext();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('agent@immowin.dz');
  const [password, setPassword] = useState('••••••••');

  if (!isOpen) return null;

  const handleDemoAgentLogin = () => {
    setUserRole('agent');
    showToast("🔓 Connecté en tant qu'Agent / Administrateur Pro ImmoWin !");
    onClose();
    onSuccessDashboard();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserRole('agent');
    showToast("Connexion réussie !");
    onClose();
    onSuccessDashboard();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 p-6 sm:p-8 space-y-6 relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center mx-auto font-bold shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 font-outfit">
            {isLogin ? "Connexion Espace Pro" : "Créer un compte ImmoWin"}
          </h3>
          <p className="text-xs text-slate-500">
            Accédez à la gestion des biens, au CRM et aux outils d'estimation DZD
          </p>
        </div>

        {/* Demo Quick Login Banner */}
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Accès Instantané Démo Agent</span>
          </div>
          <p className="text-[11px] text-emerald-700">Testez directement le tableau de bord sans inscription.</p>
          <button
            type="button"
            id="demo-agent-login-btn"
            onClick={handleDemoAgentLogin}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
          >
            🚀 Se Connecter comme Agent Pro
          </button>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-3 text-[10px] font-bold text-slate-400 uppercase">ou identifiants</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Adresse E-mail</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mot de passe</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            {isLogin ? "Se connecter" : "S'inscrire"}
          </button>
        </form>

      </div>
    </div>
  );
};

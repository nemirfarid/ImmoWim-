import React, { useState } from 'react';
import { usePropertyContext } from '../context/PropertyContext';
import { useLanguage } from '../context/LanguageContext';
import { X, Lock, Mail, User, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessDashboard: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccessDashboard }) => {
  const { setUserRole, showToast } = usePropertyContext();
  const { language } = useLanguage();
  const [isLogin, setIsLogin] = useState(false); // Default to registration view for sign-up requested
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<'homme' | 'femme'>('homme');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [accountRole, setAccountRole] = useState<'acheteur' | 'vendeur' | 'promoteur' | 'agence'>('acheteur');

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
    const genderLabel = gender === 'femme' ? 'Mme' : 'M.';
    const nameDisplay = fullName ? `${genderLabel} ${fullName}` : email;
    showToast(`Compte créé avec succès ! Bienvenue ${nameDisplay}`);
    onClose();
    onSuccessDashboard();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 p-6 sm:p-8 space-y-6 relative my-8"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-600 transition-colors border border-slate-200 cursor-pointer shadow-xs flex items-center justify-center gap-1 font-bold text-xs z-20"
          title="Quitter la page (X)"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
          <span>{language === 'AR' ? 'إغلاق (X)' : 'Fermer (X)'}</span>
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center mx-auto font-bold shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 font-outfit">
            {isLogin 
              ? (language === 'AR' ? 'تسجيل الدخول' : 'Connexion Espace Pro') 
              : (language === 'AR' ? 'إنشاء حساب جديد (رجال ونساء)' : 'Créer un Compte ImmoWin (Homme / Femme)')}
          </h3>
          <p className="text-xs text-slate-500">
            {isLogin 
              ? 'Accédez à la gestion des biens, au CRM et aux outils d\'estimation DZD'
              : 'Inscrivez-vous en choisissant votre genre (Homme / Femme) et votre rôle immobilier.'}
          </p>

          {/* Tab Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-2xl max-w-xs mx-auto mt-2 border border-slate-200">
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                !isLogin ? 'bg-white text-slate-900 shadow-xs font-extrabold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {language === 'AR' ? 'تسجيل حساب' : 'Inscription'}
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isLogin ? 'bg-white text-slate-900 shadow-xs font-extrabold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {language === 'AR' ? 'دخول' : 'Connexion'}
            </button>
          </div>
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
          <span className="flex-shrink mx-3 text-[10px] font-bold text-slate-400 uppercase">
            {isLogin ? 'ou identifiants' : 'formulaire d\'inscription complet'}
          </span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Gender Selection Required for Registration */}
          {!isLogin && (
            <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-2">
              <label className="block text-xs font-extrabold text-amber-900 uppercase">
                {language === 'AR' ? 'الرجاء تحديد الجنس (رجل / امرأة) *' : 'Sélection du Genre (Homme / Femme) *'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGender('homme')}
                  className={`py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    gender === 'homme'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-base">👨</span>
                  <span>{language === 'AR' ? 'رجل (M.)' : 'Homme (M.)'}</span>
                  {gender === 'homme' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </button>

                <button
                  type="button"
                  onClick={() => setGender('femme')}
                  className={`py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    gender === 'femme'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-base">👩</span>
                  <span>{language === 'AR' ? 'امرأة (Mme)' : 'Femme (Mme)'}</span>
                  {gender === 'femme' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                </button>
              </div>
            </div>
          )}

          {!isLogin && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nom et Prénom</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="ex: Amina Mansouri"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Téléphone Direct</label>
                <input
                  type="tel"
                  required
                  placeholder="0550 00 00 00"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  dir="ltr"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-emerald-500/50 [direction:ltr]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Adresse E-mail</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="votre.email@domaine.com"
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
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Votre Profil sur ImmoWin</label>
              <select
                value={accountRole}
                onChange={e => setAccountRole(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="acheteur">🛒 Acheteur / Acquéreur de bien</option>
                <option value="vendeur">🔑 Vendeur / Propriétaire Particulier</option>
                <option value="promoteur">🏢 Promoteur Immobilier (Projets Neufs VEFA)</option>
                <option value="agence">💼 Agence Immobilière / Agent Professionnel</option>
              </select>
            </div>
          )}

          {!isLogin && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                {language === 'AR' 
                  ? 'صورة الحساب الشخصي أو شعار الشركة / الوكالة العقارية (اختياري)' 
                  : 'Photo de Profil ou Logo Agence / Entreprise (Optionnel)'}
              </label>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-200 border border-slate-300 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl">{gender === 'femme' ? '👩' : accountRole === 'promoteur' || accountRole === 'agence' ? '🏢' : '👨'}</span>
                  )}
                </div>
                <div className="flex-1 space-y-1">
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
                    className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white hover:file:bg-slate-800 cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-400">PNG, JPG ou WEBP. Affiche votre photo ou logo sur vos critères et annonces.</p>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{isLogin ? "Se connecter" : `Finaliser Inscription (${gender === 'femme' ? '👩 Femme' : '👨 Homme'})`}</span>
          </button>
        </form>

      </div>
    </div>
  );
};


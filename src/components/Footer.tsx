import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { usePropertyContext } from '../context/PropertyContext';
import { ImmoWinLogo } from './ImmoWinLogo';
import { Mail, Phone, ShieldCheck, Search, Globe, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: 'home' | 'estimation' | 'favorites' | 'dashboard') => void;
  setViewMode: (mode: 'grid' | 'map') => void;
  onOpenFreeAdModal?: () => void;
  onOpenLegalSitemap?: (tab: 'legal' | 'sitemap') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenLegalSitemap
}) => {
  return (
    <footer className="mt-16 border-t border-teal-600/20">
      {/* EXACT REPLICA OF THE UPLOADED FOOTER DESIGN (Teal Background with 6 White Circles including TikTok + Copyright Line) */}
      <div className="w-full bg-[#00a896] text-white py-8 px-4 flex flex-col items-center justify-center space-y-6 shadow-inner">
        {/* Row of Circular White Buttons with Teal Logos */}
        <div className="flex items-center justify-center flex-wrap gap-3 sm:gap-5">
          {/* Facebook */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white text-[#00a896] flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer"
            title="Facebook"
          >
            <Facebook className="w-5 h-5 sm:w-6 sm:h-6 fill-[#00a896] stroke-none" />
          </a>

          {/* Twitter / X */}
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white text-[#00a896] flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer"
            title="Twitter"
          >
            <Twitter className="w-5 h-5 sm:w-6 sm:h-6 fill-[#00a896] stroke-none" />
          </a>

          {/* LinkedIn */}
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white text-[#00a896] flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer"
            title="LinkedIn"
          >
            <Linkedin className="w-5 h-5 sm:w-6 sm:h-6 fill-[#00a896] stroke-none" />
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white text-[#00a896] flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer"
            title="Instagram"
          >
            <Instagram className="w-5 h-5 sm:w-6 sm:h-6 stroke-[#00a896] stroke-[2.2] fill-none" />
          </a>

          {/* TikTok */}
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white text-[#00a896] flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer"
            title="TikTok"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-[#00a896]" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.33 22a6.33 6.33 0 0 0 6.33-6.33V9.05a8.16 8.16 0 0 0 4.69 1.48V7.08a4.85 4.85 0 0 1-.76-.39z" />
            </svg>
          </a>

          {/* Pinterest */}
          <a
            href="https://pinterest.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white text-[#00a896] flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer"
            title="Pinterest"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-[#00a896]" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
            </svg>
          </a>
        </div>

        {/* Centered Copyright line matching the exact photo */}
        <div className="flex items-center justify-center flex-wrap gap-2 text-white font-bold text-sm sm:text-base tracking-wide text-center">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-xs font-black">c</span>
            <span>2026 ImmoWin - Tous droits réservés</span>
          </div>
          <span className="hidden sm:inline text-white/70 font-normal">|</span>
          <button 
            onClick={() => { if (onOpenLegalSitemap) onOpenLegalSitemap('sitemap'); }}
            className="hover:underline hover:text-amber-200 transition-colors cursor-pointer"
          >
            Blog
          </button>
          <span className="hidden sm:inline text-white/70 font-normal">|</span>
          <button 
            onClick={() => { if (onOpenLegalSitemap) onOpenLegalSitemap('legal'); }}
            className="hover:underline hover:text-amber-200 transition-colors cursor-pointer"
          >
            Confidentialité
          </button>
        </div>
      </div>
    </footer>
  );
};


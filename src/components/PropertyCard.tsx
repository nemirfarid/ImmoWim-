import React, { useState } from 'react';
import { Property } from '../types';
import { formatDZD, formatSurface } from '../utils/formatters';
import { getWhatsAppLink, getTelLink, getSmsLink } from '../utils/communication';
import { usePropertyContext } from '../context/PropertyContext';
import { useLanguage } from '../context/LanguageContext';
import { translateStanding } from '../utils/languageHelpers';
import { getDiasporaPriceSummary } from '../utils/currencyHelpers';
import { Heart, MapPin, Maximize2, Bed, Bath, ChevronLeft, ChevronRight, CheckCircle2, Phone, MessageCircle, MessageSquare, Edit2, Trash2, Globe2 } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onSelect }) => {
  const { toggleFavorite, deleteProperty, showToast } = usePropertyContext();
  const { language, t } = useLanguage();
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Voulez-vous vraiment supprimer cette annonce immobilière ?")) {
      deleteProperty(property.id);
      showToast("Annonce supprimée.");
    }
  };

  const whatsappMsg = language === 'AR'
    ? `مرحباً، أنا مهتم بعقاركم "${property.title}" (${formatDZD(property.priceDZD)}) في ${property.wilaya}. يرجى التواصل معي.`
    : `Bonjour, je suis intéressé(e) par votre bien "${property.title}" (${formatDZD(property.priceDZD)}) à ${property.wilaya}. Merci de me recontacter sur ImmoWin.`;

  const smsMsg = language === 'AR'
    ? `استفسار حول ${property.title} في ${property.wilaya}.`
    : `Bonjour, renseignement pour ${property.title} a ${property.wilaya}.`;

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIdx(prev => (prev === 0 ? property.images.length - 1 : prev - 1));
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIdx(prev => (prev === property.images.length - 1 ? 0 : prev + 1));
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(property.id);
  };

  const statusLabel = property.transactionType === 'Achat' 
    ? t.propertyForSale 
    : t.propertyForRent;

  return (
    <div
      onClick={() => onSelect(property)}
      className="group bg-white rounded-2xl border border-slate-100/90 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer relative transform hover:-translate-y-1"
    >
      {/* Image Carousel Container */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
        <img
          src={property.images[currentImageIdx] || property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Dark subtle overlay for badge legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20" />

        {/* Favorite, Edit & Delete Quick Controls */}
        <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 z-10 flex items-center gap-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(property); }}
            className="p-2 rounded-full bg-white/80 hover:bg-emerald-600 hover:text-white text-slate-700 backdrop-blur-md shadow-md transition-all transform active:scale-90 cursor-pointer"
            title="Modifier l'annonce"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-full bg-white/80 hover:bg-rose-600 hover:text-white text-slate-700 backdrop-blur-md shadow-md transition-all transform active:scale-90 cursor-pointer"
            title="Supprimer l'annonce"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            id={`fav-btn-${property.id}`}
            onClick={handleFavoriteClick}
            className="p-2 rounded-full bg-white/80 hover:bg-white text-slate-700 hover:text-rose-500 backdrop-blur-md shadow-md transition-all transform active:scale-90 cursor-pointer"
            aria-label="Favorite"
            title="Ajouter aux favoris"
          >
            <Heart className={`w-3.5 h-3.5 ${property.isFavorite ? 'text-rose-500 fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* Status Tag Badge */}
        <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 z-10 flex flex-col gap-1.5 items-start rtl:items-end">
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-md shadow-xs ${
              property.transactionType === 'Achat'
                ? 'bg-slate-900/90 text-white'
                : 'bg-emerald-600/90 text-white'
            }`}
          >
            {statusLabel}
          </span>
          {property.tag && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/90 text-slate-950 backdrop-blur-md">
              {property.tag}
            </span>
          )}
          {property.videos && property.videos.length > 0 && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950 backdrop-blur-md flex items-center gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
              <span>{t.propertyHDVideo}</span>
            </span>
          )}
        </div>

        {/* Carousel Navigation Controls */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/70 hover:bg-white text-slate-800 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/70 hover:bg-white text-slate-800 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10">
              {property.images.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === currentImageIdx ? 'bg-white w-4' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Price Tag Overlay at Bottom */}
        <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3 z-10 flex flex-col items-start gap-1" dir="ltr">
          <div className="bg-emerald-600/95 text-white font-extrabold text-sm sm:text-base px-3 py-1 rounded-xl shadow-md backdrop-blur-md flex items-center gap-1 [direction:ltr]">
            <span dir="ltr" className="inline-block [direction:ltr]">{formatDZD(property.priceDZD)}</span>
            {property.transactionType === 'Location' && (
              <span className="text-xs font-normal opacity-90">{t.propertyPriceMonth}</span>
            )}
          </div>
          {/* Diaspora Euro / CAD / USD Equivalency Pill */}
          {(() => {
            const diaspora = getDiasporaPriceSummary(property.priceDZD);
            return (
              <div className="bg-slate-900/90 text-amber-300 border border-amber-500/30 text-[10px] font-black px-2.5 py-0.5 rounded-lg shadow-sm backdrop-blur-md flex items-center gap-1">
                <Globe2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>≈ {diaspora.eur} | {diaspora.cad}</span>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location Badge */}
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold mb-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{property.wilaya}, {property.commune}</span>
            {property.neighborhood && (
              <span className="text-slate-400 font-normal truncate">• {property.neighborhood}</span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-900 text-base line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors mb-3">
            {(language === 'AR' && property.titleAr) ? property.titleAr : property.title}
          </h3>
        </div>

        {/* Property Specs Pill Row */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium py-3 border-t border-b border-slate-100 mb-4">
            <div className="flex items-center gap-1.5" dir="ltr">
              <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
              <span dir="ltr" className="inline-block [direction:ltr]">{formatSurface(property.surfaceM2)}</span>
            </div>

            {property.rooms > 0 && (
              <div className="flex items-center gap-1.5" dir="ltr">
                <Bed className="w-3.5 h-3.5 text-slate-400" />
                <span dir="ltr" className="inline-block [direction:ltr]">{property.rooms} {t.propertyRooms}</span>
              </div>
            )}

            {property.bathrooms > 0 && (
              <div className="flex items-center gap-1.5" dir="ltr">
                <Bath className="w-3.5 h-3.5 text-slate-400" />
                <span dir="ltr" className="inline-block [direction:ltr]">{property.bathrooms} {t.propertyBathrooms}</span>
              </div>
            )}
          </div>

          {/* Footer Card Row & Quick Direct Communication Buttons */}
          <div className="flex items-center justify-between pt-1">
            {property.hasActAndLivret ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>{t.propertyActAndLivret}</span>
              </span>
            ) : (
              <span className="text-[11px] font-medium text-slate-400">
                {translateStanding(property.standing, language)}
              </span>
            )}

            <div className="flex flex-col items-stretch sm:items-end gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
              {/* WhatsApp Button */}
              <a
                id={`card-whatsapp-${property.id}`}
                href={getWhatsAppLink(property.sellerPhone, whatsappMsg)}
                target="_blank"
                rel="noopener noreferrer"
                title={`WhatsApp: ${property.sellerPhone}`}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center justify-between gap-2 cursor-pointer shadow-xs active:scale-95"
              >
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 fill-white shrink-0" />
                  <span className="text-[10px] font-bold">WhatsApp</span>
                </div>
                <span dir="ltr" className="font-mono text-[10px] font-bold bg-emerald-700/60 px-1.5 py-0.5 rounded text-emerald-100">
                  {property.sellerPhone}
                </span>
              </a>

              {/* Phone Call Button */}
              <a
                id={`card-tel-${property.id}`}
                href={getTelLink(property.sellerPhone)}
                title={`Appeler: ${property.sellerPhone}`}
                className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-all flex items-center justify-between gap-2 cursor-pointer shadow-xs border border-slate-800 active:scale-95"
              >
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-[10px] font-bold">{language === 'AR' ? 'اتصال' : 'Appeler'}</span>
                </div>
                <span dir="ltr" className="font-mono text-[10px] font-bold text-emerald-300 bg-slate-950 px-1.5 py-0.5 rounded">
                  {property.sellerPhone}
                </span>
              </a>

              {/* Message Button (Replaced SMS word) */}
              <a
                id={`card-msg-${property.id}`}
                href={getSmsLink(property.sellerPhone, smsMsg)}
                title={language === 'AR' ? 'رسالة جديدة' : 'Nouveau Message'}
                className="px-2.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white transition-all flex items-center justify-between gap-2 cursor-pointer shadow-xs active:scale-95"
              >
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-white shrink-0" />
                  <span className="text-[10px] font-bold">{language === 'AR' ? 'رسالة' : 'Message'}</span>
                </div>
                <span dir="ltr" className="font-mono text-[10px] font-bold bg-sky-700/60 px-1.5 py-0.5 rounded text-sky-100">
                  {property.sellerPhone}
                </span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

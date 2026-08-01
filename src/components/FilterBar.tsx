import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { usePropertyContext } from '../context/PropertyContext';
import { WILAYAS_DATA } from '../data/wilayasData';
import { formatDZD } from '../utils/formatters';
import { MapPin, Building, Tag, SlidersHorizontal, RotateCcw, Navigation, X } from 'lucide-react';
import { TransactionType } from '../types';

export const FilterBar: React.FC = () => {
  const { language, t } = useLanguage();
  const { filters, setFilters, resetFilters } = usePropertyContext();

  const handleWilayaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, wilaya: e.target.value, commune: '' }));
  };

  const selectedWilayaObj = WILAYAS_DATA.find(w => w.name === filters.wilaya);

  const propertyTypeOptions = [
    { value: '', label: t.filterAllTypes },
    { value: 'Appartement', label: language === 'AR' ? 'شقة (F1 - F6)' : language === 'EN' ? 'Apartment' : 'Appartement' },
    { value: 'Villa', label: language === 'AR' ? 'فيلا ودوبلكس' : language === 'EN' ? 'Villa & Duplex' : 'Villa & Duplex' },
    { value: 'Terrain', label: language === 'AR' ? 'قطعة أرض' : language === 'EN' ? 'Land Plot' : 'Terrain' },
    { value: 'Local Commercial', label: language === 'AR' ? 'محل تجاري' : language === 'EN' ? 'Commercial Premises' : 'Local Commercial' }
  ];

  const hasActiveFilters = Boolean(
    filters.wilaya ||
    filters.commune ||
    filters.propertyType ||
    filters.transactionType !== 'Tous' ||
    filters.rooms ||
    filters.maxPriceDZD < 200000000
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-100/90 backdrop-blur-xl">
        
        {/* Top Header & Transaction Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-5 border-b border-slate-100">
          
          {/* Transaction Type Pills */}
          <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200/80 w-full sm:w-auto">
            {(['Tous', 'Achat', 'Location'] as const).map(type => (
              <button
                key={type}
                id={`filter-tx-${type}`}
                onClick={() => setFilters(prev => ({ ...prev, transactionType: type as TransactionType | 'Tous' }))}
                className={`flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filters.transactionType === type
                    ? 'bg-slate-900 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                {type === 'Tous' ? t.filterAllTransactions : type === 'Achat' ? t.filterSale : t.filterRent}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <span className="text-xs font-semibold text-slate-500 hidden md:inline">
              {t.filterAdvancedTitle}
            </span>
            <button
              id="filter-reset-btn"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.filterReset}</span>
            </button>
          </div>
        </div>

        {/* Main Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 pt-5">
          
          {/* 1. Wilaya Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.filterWilaya}</span>
            </label>
            <select
              id="filter-wilaya-select"
              value={filters.wilaya}
              onChange={handleWilayaChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 cursor-pointer"
            >
              <option value="">{t.filterAllWilayas}</option>
              {WILAYAS_DATA.map(w => (
                <option key={w.code} value={w.name}>
                  {w.code} - {w.name}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Commune Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.filterCommune}</span>
            </label>
            <select
              id="filter-commune-select"
              value={filters.commune}
              onChange={e => setFilters(prev => ({ ...prev, commune: e.target.value }))}
              disabled={!filters.wilaya}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 cursor-pointer ${
                !filters.wilaya ? 'opacity-60 cursor-not-allowed bg-slate-100' : ''
              }`}
            >
              <option value="">
                {filters.wilaya ? t.filterAllCommunes : t.filterSelectWilayaFirst}
              </option>
              {selectedWilayaObj?.communes.map(c => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Property Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.filterPropertyType}</span>
            </label>
            <select
              id="filter-property-type-select"
              value={filters.propertyType}
              onChange={e => setFilters(prev => ({ ...prev, propertyType: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 cursor-pointer"
            >
              {propertyTypeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* 4. Price Range Slider DZD */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.filterBudgetMax}</span>
              </label>
              <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {formatDZD(filters.maxPriceDZD, true)}
              </span>
            </div>
            <input
              type="range"
              id="filter-price-slider"
              min={1000000}
              max={200000000}
              step={1000000}
              value={filters.maxPriceDZD}
              onChange={e => setFilters(prev => ({ ...prev, maxPriceDZD: Number(e.target.value) }))}
              className="w-full accent-emerald-600 bg-slate-200 rounded-lg h-2 cursor-pointer mt-1"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
              <span>1 M</span>
              <span>100 M</span>
              <span>200 M DZD</span>
            </div>
          </div>

          {/* 5. Rooms Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.filterRooms}</span>
            </label>
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
              {['', '1', '2', '3', '4', '5+'].map(r => (
                <button
                  key={r}
                  id={`filter-room-${r || 'all'}`}
                  onClick={() => setFilters(prev => ({ ...prev, rooms: r }))}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    filters.rooms === r
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {r === '' ? t.filterAllRooms : r === '5+' ? '5+' : `F${r}`}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Active Filters Badges Section */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">
              {language === 'AR' ? 'الفلاتر النشطة:' : language === 'EN' ? 'Active Filters:' : 'Filtres actifs :'}
            </span>

            {filters.wilaya && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Wilaya: {filters.wilaya}
                <button
                  onClick={() => setFilters(prev => ({ ...prev, wilaya: '', commune: '' }))}
                  className="hover:text-emerald-950 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.commune && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Commune: {filters.commune}
                <button
                  onClick={() => setFilters(prev => ({ ...prev, commune: '' }))}
                  className="hover:text-emerald-950 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.propertyType && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                Type: {filters.propertyType}
                <button
                  onClick={() => setFilters(prev => ({ ...prev, propertyType: '' }))}
                  className="hover:text-blue-950 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.transactionType !== 'Tous' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">
                Transaction: {filters.transactionType}
                <button
                  onClick={() => setFilters(prev => ({ ...prev, transactionType: 'Tous' }))}
                  className="hover:text-purple-950 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.rooms && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                Pièces: {filters.rooms === '5+' ? '5+' : `F${filters.rooms}`}
                <button
                  onClick={() => setFilters(prev => ({ ...prev, rooms: '' }))}
                  className="hover:text-amber-950 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.maxPriceDZD < 200000000 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                Max: {formatDZD(filters.maxPriceDZD, true)}
                <button
                  onClick={() => setFilters(prev => ({ ...prev, maxPriceDZD: 200000000 }))}
                  className="hover:text-slate-950 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={resetFilters}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 hover:underline ml-auto cursor-pointer"
            >
              {language === 'AR' ? 'مسح الكل' : language === 'EN' ? 'Clear all' : 'Tout effacer'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

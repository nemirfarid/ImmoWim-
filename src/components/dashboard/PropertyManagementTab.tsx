import React, { useState } from 'react';
import { usePropertyContext } from '../../context/PropertyContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatDZD, formatSurface } from '../../utils/formatters';
import { Property, PropertyStatus } from '../../types';
import { Search, Plus, Trash2, Edit2, Eye, MapPin, Check, X, Bot, Sparkles, Globe } from 'lucide-react';
import { AiSmartImporterModal } from '../AiSmartImporterModal';

export const PropertyManagementTab: React.FC = () => {
  const { properties, deleteProperty, updateProperty, setIsAddModalOpen, setSelectedProperty } = usePropertyContext();
  const { language } = useLanguage();
  const isAr = language === 'AR';

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isAiImporterOpen, setIsAiImporterOpen] = useState(false);
  
  // Inline Price Editing State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<number>(0);

  const startEditPrice = (p: Property) => {
    setEditingId(p.id);
    setEditingPrice(p.priceDZD);
  };

  const savePrice = (id: string) => {
    updateProperty(id, { priceDZD: Number(editingPrice) });
    setEditingId(null);
  };

  const filteredProps = properties.filter(p => {
    if (statusFilter && p.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.wilaya.toLowerCase().includes(q) ||
        p.commune.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Table Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Rechercher titre, wilaya, commune..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>

        {/* Filters & Add CTA */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
          >
            <option value="">{isAr ? 'جميع الحالات' : 'Tous les statuts'}</option>
            <option value="A Vendre">{isAr ? 'للبيع' : 'A Vendre'}</option>
            <option value="A Louer">{isAr ? 'للإيجار' : 'A Louer'}</option>
            <option value="Sous Offre">{isAr ? 'تحت العرض' : 'Sous Offre'}</option>
            <option value="Vendu">{isAr ? 'تم البيع' : 'Vendu'}</option>
          </select>

          <button
            id="admin-ai-import-btn"
            onClick={() => setIsAiImporterOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0 border border-amber-400/50"
          >
            <Bot className="w-4 h-4 text-slate-950" />
            <span>
              {isAr ? '🤖 استيراد ذكي بالذكاء الاصطناعي (Ouedkniss / Facebook)' : '🤖 Importation IA (Ouedkniss & Facebook)'}
            </span>
          </button>

          <button
            id="table-add-property-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? '+ إضافة عقار جديد' : '+ Ajouter un bien (DZD)'}</span>
          </button>
        </div>

      </div>

      {/* Modern Data Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-6">Bien Immobilier</th>
                <th className="py-4 px-4">Type</th>
                <th className="py-4 px-4">Localisation</th>
                <th className="py-4 px-4">Surface (m²)</th>
                <th className="py-4 px-4">Prix en Dinars (DZD)</th>
                <th className="py-4 px-4">Statut</th>
                <th className="py-4 px-6 text-right">Actions CRUD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredProps.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                  
                  {/* Property Image & Title */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3 max-w-xs">
                      <img src={p.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" referrerPolicy="no-referrer" />
                      <div>
                        <h4 className="font-bold text-slate-900 line-clamp-1">{p.title}</h4>
                        <span className="text-[10px] text-slate-400">Réf: {p.id}</span>
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="py-4 px-4 font-semibold text-slate-700">
                    {p.type}
                  </td>

                  {/* Location */}
                  <td className="py-4 px-4">
                    <span className="font-semibold text-slate-900 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      {p.wilaya}, {p.commune}
                    </span>
                  </td>

                  {/* Surface */}
                  <td className="py-4 px-4 font-bold text-slate-800">
                    {formatSurface(p.surfaceM2)}
                  </td>

                  {/* Editable DZD Price */}
                  <td className="py-4 px-4">
                    {editingId === p.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={editingPrice}
                          onChange={e => setEditingPrice(Number(e.target.value))}
                          className="w-32 px-2 py-1 rounded-lg border border-emerald-500 text-xs font-bold text-emerald-800 bg-emerald-50"
                        />
                        <button onClick={() => savePrice(p.id)} className="p-1 rounded bg-emerald-600 text-white cursor-pointer">
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-1 rounded bg-slate-200 text-slate-600 cursor-pointer">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 group/edit">
                        <span className="font-extrabold text-emerald-700 font-outfit text-sm">
                          {formatDZD(p.priceDZD)}
                        </span>
                        <button
                          onClick={() => startEditPrice(p)}
                          className="p-1 text-slate-400 hover:text-emerald-600 opacity-0 group-hover/edit:opacity-100 transition-opacity cursor-pointer"
                          title="Modifier le prix en DZD"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </td>

                  {/* Status Dropdown / Badge */}
                  <td className="py-4 px-4">
                    <select
                      value={p.status}
                      onChange={e => updateProperty(p.id, { status: e.target.value as PropertyStatus })}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold cursor-pointer border-0 ${
                        p.status === 'A Vendre' ? 'bg-slate-900 text-white' :
                        p.status === 'A Louer' ? 'bg-emerald-600 text-white' :
                        p.status === 'Sous Offre' ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      <option value="A Vendre">A Vendre</option>
                      <option value="A Louer">A Louer</option>
                      <option value="Sous Offre">Sous Offre</option>
                      <option value="Vendu">Vendu</option>
                    </select>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedProperty(p)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => deleteProperty(p.id)}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                        title="Supprimer le bien"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Smart Importer Modal */}
      <AiSmartImporterModal
        isOpen={isAiImporterOpen}
        onClose={() => setIsAiImporterOpen(false)}
      />

    </div>
  );
};

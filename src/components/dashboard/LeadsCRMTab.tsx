import React, { useState } from 'react';
import { usePropertyContext } from '../../context/PropertyContext';
import { LeadStatus } from '../../types';
import { formatDZD } from '../../utils/formatters';
import { getWhatsAppLink, getTelLink, getSmsLink } from '../../utils/communication';
import { Users, Phone, Mail, Clock, MapPin, CheckCircle, Search, Calendar, FileText, MessageCircle, MessageSquare, Zap, Bell, UserCheck } from 'lucide-react';

export const LeadsCRMTab: React.FC = () => {
  const { leads, updateLeadStatus, matchNotifications, setIsCriteriaModalOpen } = usePropertyContext();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [activeSubView, setActiveSubView] = useState<'leads' | 'matches'>('leads');

  const filteredLeads = leads.filter(l => {
    if (statusFilter && l.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        l.clientName.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        l.wilaya.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* View Mode Toggle: Leads vs Criteria Matches */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubView('leads')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubView === 'leads'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Demandes & Leads Visite ({leads.length})</span>
          </button>

          <button
            onClick={() => setActiveSubView('matches')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 relative ${
              activeSubView === 'matches'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>Alertes & Matching Critères ({matchNotifications.length})</span>
          </button>
        </div>

        <button
          onClick={() => setIsCriteriaModalOpen(true)}
          className="px-3.5 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Bell className="w-4 h-4 fill-slate-950" />
          <span>Configurer une Alerte</span>
        </button>
      </div>

      {activeSubView === 'leads' && (
        <>
          {/* Header & Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 font-outfit">CRM Leads & Demandes de Visite</h3>
              <p className="text-xs text-slate-500">Gestion et suivi des prospects acheteurs & vendeurs en Algérie</p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Rechercher nom, tel, wilaya..."
                  className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold cursor-pointer"
              >
                <option value="">Tous les statuts</option>
                <option value="nouveau">Nouveau</option>
                <option value="contacte">Contacté</option>
                <option value="visite">Visite Programmée</option>
                <option value="conclu">Conclu / Vendu</option>
              </select>
            </div>
          </div>

          {/* Leads Grid List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredLeads.map(lead => (
              <div key={lead.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4 hover:shadow-md transition-shadow">
                
                {/* Top row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center font-bold text-sm">
                      {lead.clientName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{lead.clientName}</h4>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-600" /> {lead.wilaya}
                      </span>
                    </div>
                  </div>

                  {/* Status Pill Selector */}
                  <select
                    value={lead.status}
                    onChange={e => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                    className={`px-3 py-1 rounded-full text-xs font-bold border-0 cursor-pointer ${
                      lead.status === 'nouveau' ? 'bg-blue-100 text-blue-900' :
                      lead.status === 'contacte' ? 'bg-amber-100 text-amber-900' :
                      lead.status === 'visite' ? 'bg-purple-100 text-purple-900' : 'bg-emerald-100 text-emerald-900'
                    }`}
                  >
                    <option value="nouveau">Nouveau</option>
                    <option value="contacte">Contacté</option>
                    <option value="visite">Visite Programmée</option>
                    <option value="conclu">Conclu</option>
                  </select>
                </div>

                {/* Message / Details */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1">
                  {lead.propertyTitle && (
                    <p className="font-bold text-slate-900 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Bien ciblé: {lead.propertyTitle}</span>
                    </p>
                  )}
                  {lead.estimatedValueDZD && (
                    <p className="text-emerald-700 font-extrabold">
                      Estimation IA: {formatDZD(lead.estimatedValueDZD)}
                    </p>
                  )}
                  <p className="italic text-slate-600">"{lead.message}"</p>
                </div>

                {/* Direct Action Communication Buttons (WhatsApp, Phone, SMS) */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs gap-2">
                  <div className="flex items-center gap-1.5">
                    <a
                      href={getWhatsAppLink(lead.phone, `Bonjour ${lead.clientName}, suite à votre demande sur ImmoWin concernant ${lead.propertyTitle || 'un bien immobilier'}...`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold flex items-center gap-1 text-[11px] cursor-pointer"
                      title="Envoyer un WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-white" />
                      <span>WhatsApp</span>
                    </a>

                    <a
                      href={getTelLink(lead.phone)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center gap-1 text-[11px] cursor-pointer"
                      title="Appeler directement"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Appeler</span>
                    </a>

                    <a
                      href={getSmsLink(lead.phone, `Bonjour ${lead.clientName}, nous avons bien recu votre demande sur ImmoWin.`)}
                      className="px-2.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold flex items-center gap-1 text-[11px] cursor-pointer"
                      title="Envoyer un SMS"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>SMS</span>
                    </a>
                  </div>

                  <span className="text-[10px] text-slate-400 flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3" /> {lead.date}
                  </span>
                </div>

              </div>
            ))}
          </div>
        </>
      )}

      {/* MATCHES VIEW */}
      {activeSubView === 'matches' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h4 className="font-extrabold text-slate-900 text-base font-outfit">
                Flux de Notifications & Matching de Critères
              </h4>
              <p className="text-xs text-slate-500">
                Matches générés automatiquement dès qu'un bien ou acheteur correspondant est détecté dans le système.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs">
              {matchNotifications.length} Notifications
            </span>
          </div>

          <div className="space-y-3">
            {matchNotifications.map(notif => (
              <div key={notif.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-white">
                      ROLE: {notif.roleCategory.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-slate-400">{notif.date}</span>
                  </div>
                  <h5 className="font-bold text-slate-900 text-xs">{notif.title}</h5>
                  <p className="text-xs text-slate-600 mt-0.5">{notif.message}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={getWhatsAppLink(notif.contactPhone, `Bonjour ${notif.contactName}, suite à notre match automatique ImmoWin...`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-white" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={getTelLink(notif.contactPhone)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Appeler</span>
                  </a>

                  <a
                    href={getSmsLink(notif.contactPhone, `Bonjour ${notif.contactName}, nous avons un match sur ImmoWin.`)}
                    className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>SMS</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};


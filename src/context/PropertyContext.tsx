import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Property, FilterState, Lead, LeadStatus, CriteriaSubscription, MatchNotification } from '../types';
import { INITIAL_PROPERTIES, INITIAL_LEADS, INITIAL_CRITERIA_SUBSCRIPTIONS, INITIAL_MATCH_NOTIFICATIONS } from '../data/mockData';

interface PropertyContextType {
  properties: Property[];
  filteredProperties: Property[];
  favoritesCount: number;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  toggleFavorite: (id: string) => void;
  addProperty: (property: Omit<Property, 'id' | 'dateAdded' | 'viewsCount'>) => void;
  updateProperty: (id: string, updated: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  
  // Detail modal
  selectedProperty: Property | null;
  setSelectedProperty: (property: Property | null) => void;

  // Add modal
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;

  // Criteria Alert Modal
  isCriteriaModalOpen: boolean;
  setIsCriteriaModalOpen: (open: boolean) => void;

  // Criteria Subscriptions
  subscriptions: CriteriaSubscription[];
  addSubscription: (sub: Omit<CriteriaSubscription, 'id' | 'dateCreated'>) => void;
  deleteSubscription: (id: string) => void;

  // Match Notifications
  matchNotifications: MatchNotification[];
  markNotificationRead: (id: string) => void;
  unreadNotificationsCount: number;

  // Leads CRM
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'date' | 'status'>) => void;
  updateLeadStatus: (id: string, status: LeadStatus) => void;

  // Auth / Role
  userRole: 'public' | 'agent';
  setUserRole: (role: 'public' | 'agent') => void;

  // Toast Notification
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const DEFAULT_FILTERS: FilterState = {
  wilaya: '',
  commune: '',
  propertyType: '',
  transactionType: 'Tous',
  minPriceDZD: 0,
  maxPriceDZD: 200000000,
  minSurface: 0,
  rooms: '',
  sortBy: 'recent'
};

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('immowin_properties');
    if (!saved) return INITIAL_PROPERTIES;
    try {
      const parsed: Property[] = JSON.parse(saved);
      // Ensure all loaded properties have videos attached for demo compatibility
      return parsed.map((p, idx) => ({
        ...p,
        videos: (p.videos && p.videos.length > 0)
          ? p.videos
          : [
              idx % 3 === 0 
                ? "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                : idx % 3 === 1
                ? "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                : "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
            ]
      }));
    } catch {
      return INITIAL_PROPERTIES;
    }
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('immowin_leads');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [subscriptions, setSubscriptions] = useState<CriteriaSubscription[]>(() => {
    const saved = localStorage.getItem('immowin_subscriptions');
    return saved ? JSON.parse(saved) : INITIAL_CRITERIA_SUBSCRIPTIONS;
  });

  const [matchNotifications, setMatchNotifications] = useState<MatchNotification[]>(() => {
    const saved = localStorage.getItem('immowin_notifications');
    return saved ? JSON.parse(saved) : INITIAL_MATCH_NOTIFICATIONS;
  });

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCriteriaModalOpen, setIsCriteriaModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<'public' | 'agent'>('public');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('immowin_properties', JSON.stringify(properties));
    } catch (e) {
      console.warn("Storage quota warning for properties", e);
    }
  }, [properties]);

  useEffect(() => {
    try {
      localStorage.setItem('immowin_leads', JSON.stringify(leads));
    } catch (e) {
      console.warn("Storage quota warning for leads", e);
    }
  }, [leads]);

  useEffect(() => {
    try {
      localStorage.setItem('immowin_subscriptions', JSON.stringify(subscriptions));
    } catch (e) {
      console.warn("Storage quota warning for subscriptions", e);
    }
  }, [subscriptions]);

  useEffect(() => {
    try {
      localStorage.setItem('immowin_notifications', JSON.stringify(matchNotifications));
    } catch (e) {
      console.warn("Storage quota warning for notifications", e);
    }
  }, [matchNotifications]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const toggleFavorite = (id: string) => {
    setProperties(prev =>
      prev.map(p => {
        if (p.id === id) {
          const nextFav = !p.isFavorite;
          showToast(nextFav ? "Ajouté à vos favoris 💖" : "Retiré de vos favoris");
          return { ...p, isFavorite: nextFav };
        }
        return p;
      })
    );
  };

  // Helper: Matching Logic (1. Wilaya -> 2. Commune -> 3. Approximate Budget)
  const isPropertyMatchingSubscription = (p: Property, s: CriteriaSubscription): boolean => {
    // 1. WILAYA MATCH (Strict First Requirement)
    if (s.wilaya && s.wilaya !== 'Toutes' && s.wilaya !== 'Toutes les wilayas') {
      if (p.wilaya !== s.wilaya) return false;
    }

    // 2. COMMUNE MATCH (Second Requirement if specified)
    if (s.commune && s.commune !== 'Toutes' && s.commune !== 'Toutes les communes' && s.commune !== 'Centre / Autre') {
      const sComm = s.commune.trim().toLowerCase();
      const pComm = (p.commune || '').trim().toLowerCase();
      const isMatch = pComm.includes(sComm) || sComm.includes(pComm);
      if (!isMatch) return false;
    }

    // 3. PROPERTY TYPE MATCH
    if (s.propertyType && s.propertyType !== 'Tous' && s.propertyType !== '') {
      if (p.type !== s.propertyType) return false;
    }

    // 4. TRANSACTION TYPE MATCH
    if (s.transactionType && s.transactionType !== 'Tous') {
      if (p.transactionType !== s.transactionType) return false;
    }

    // 5. APPROXIMATE BUDGET MATCH (Prix vendeur approximatif au budget acheteur : -30% à +25%)
    if (s.maxBudgetDZD && s.maxBudgetDZD > 0) {
      const minApproxPrice = s.maxBudgetDZD * 0.70;
      const maxApproxPrice = s.maxBudgetDZD * 1.25;
      if (p.priceDZD > maxApproxPrice || p.priceDZD < minApproxPrice) {
        return false;
      }
    }

    return true;
  };

  // Add Subscription and trigger instant retrospective matching
  const addSubscription = (subData: Omit<CriteriaSubscription, 'id' | 'dateCreated'>) => {
    const newSub: CriteriaSubscription = {
      ...subData,
      id: `sub-${Date.now()}`,
      dateCreated: new Date().toISOString().split('T')[0]
    };

    setSubscriptions(prev => [newSub, ...prev]);

    // Check existing properties or leads for instant initial match
    let matchCount = 0;

    if (newSub.roleCategory === 'acheteurs') {
      const matches = properties.filter(p => isPropertyMatchingSubscription(p, newSub));
      matchCount = matches.length;

      if (matches.length > 0) {
        const topMatch = matches[0];
        const notif: MatchNotification = {
          id: `match-${Date.now()}`,
          subscriptionId: newSub.id,
          roleCategory: 'acheteurs',
          title: `🎯 ${matches.length} bien(s) instantanément trouvé(s) !`,
          message: `${topMatch.title} à ${topMatch.wilaya} (${topMatch.commune}) - ${topMatch.priceDZD.toLocaleString()} DZD correspond à vos critères.`,
          propertyId: topMatch.id,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          read: false,
          contactName: topMatch.sellerName,
          contactPhone: topMatch.sellerPhone,
          contactEmail: topMatch.sellerEmail
        };
        setMatchNotifications(prev => [notif, ...prev]);
      }
    } else {
      // For Vendeurs, Promoteurs, Agences
      const matchingLeads = leads.filter(l => {
        if (l.wilaya !== newSub.wilaya) return false;
        if (newSub.commune && newSub.commune !== 'Toutes' && newSub.commune !== 'Toutes les communes') {
          if (l.commune && !l.commune.toLowerCase().includes(newSub.commune.toLowerCase())) return false;
        }
        return true;
      });
      matchCount = matchingLeads.length;

      if (matchingLeads.length > 0) {
        const topLead = matchingLeads[0];
        const notif: MatchNotification = {
          id: `match-${Date.now()}`,
          subscriptionId: newSub.id,
          roleCategory: newSub.roleCategory,
          title: `⚡ ${matchingLeads.length} acheteur(s) qualifié(s) dans votre zone !`,
          message: `Client ${topLead.clientName} cherche un bien à ${topLead.wilaya} ${topLead.commune ? `(${topLead.commune})` : ''}.`,
          leadId: topLead.id,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          read: false,
          contactName: topLead.clientName,
          contactPhone: topLead.phone,
          contactEmail: topLead.email
        };
        setMatchNotifications(prev => [notif, ...prev]);
      }
    }

    showToast(`Alerte Critères enregistrée ! (${matchCount} correspondance(s) trouvée(s))`);
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions(prev => prev.filter(s => s.id !== id));
    showToast("Alerte critères supprimée.");
  };

  const markNotificationRead = (id: string) => {
    setMatchNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const addProperty = (newProp: Omit<Property, 'id' | 'dateAdded' | 'viewsCount'>) => {
    const property: Property = {
      ...newProp,
      id: `prop-${Date.now()}`,
      dateAdded: new Date().toISOString().split('T')[0],
      viewsCount: 1
    };
    setProperties(prev => [property, ...prev]);

    // Automatic Real-time Matching Trigger for Acheteurs
    const matchedSubs = subscriptions.filter(s => isPropertyMatchingSubscription(property, s));

    if (matchedSubs.length > 0) {
      matchedSubs.forEach(sub => {
        const notif: MatchNotification = {
          id: `match-${Date.now()}-${sub.id}`,
          subscriptionId: sub.id,
          roleCategory: 'acheteurs',
          title: `⚡ Nouveau bien correspondant publié !`,
          message: `${property.title} à ${property.wilaya} vient d'être mis en ligne.`,
          propertyId: property.id,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          read: false,
          contactName: property.sellerName,
          contactPhone: property.sellerPhone,
          contactEmail: property.sellerEmail
        };
        setMatchNotifications(prev => [notif, ...prev]);
      });
      showToast(`🎉 Nouveau bien publié ! (${matchedSubs.length} alerte(s) acheteur(s) déclenchée(s))`);
    } else {
      showToast("🎉 Nouveau bien immobilier publié avec succès !");
    }
  };

  const updateProperty = (id: string, updated: Partial<Property>) => {
    setProperties(prev => prev.map(p => (p.id === id ? { ...p, ...updated } : p)));
    showToast("Mise à jour enregistrée !");
  };

  const deleteProperty = (id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id));
    showToast("Bien supprimé de la plateforme.");
  };

  const addLead = (leadData: Omit<Lead, 'id' | 'date' | 'status'>) => {
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      status: 'nouveau',
      date: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setLeads(prev => [newLead, ...prev]);

    // Real-Time Matching Trigger for Vendeurs, Promoteurs, Agences
    const matchedProSubs = subscriptions.filter(s => s.roleCategory !== 'acheteurs' && s.wilaya === newLead.wilaya);

    if (matchedProSubs.length > 0) {
      matchedProSubs.forEach(sub => {
        const notif: MatchNotification = {
          id: `match-${Date.now()}-${sub.id}`,
          subscriptionId: sub.id,
          roleCategory: sub.roleCategory,
          title: `🔔 Nouvel acheteur/prospect intéressé à ${newLead.wilaya} !`,
          message: `${newLead.clientName} vient de soumettre une demande (${newLead.propertyTitle || 'Recherche globale'}).`,
          leadId: newLead.id,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          read: false,
          contactName: newLead.clientName,
          contactPhone: newLead.phone,
          contactEmail: newLead.email
        };
        setMatchNotifications(prev => [notif, ...prev]);
      });
    }
  };

  const updateLeadStatus = (id: string, status: LeadStatus) => {
    setLeads(prev => prev.map(l => (l.id === id ? { ...l, status } : l)));
    showToast(`Statut du lead mis à jour : ${status.toUpperCase()}`);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  // String normalization helper (strips accents, whitespace, case)
  const normalizeStr = (str?: string) =>
    (str || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  // Filter computation
  const filteredProperties = properties.filter(p => {
    // 1. Wilaya filter (Strict match after normalization)
    if (filters.wilaya && filters.wilaya !== '' && filters.wilaya !== 'Toutes' && filters.wilaya !== 'Toutes les wilayas') {
      const fWilaya = normalizeStr(filters.wilaya);
      const pWilaya = normalizeStr(p.wilaya);
      if (pWilaya !== fWilaya) return false;
    }

    // 2. Commune filter (Bidirectional substring match after normalization)
    if (filters.commune && filters.commune !== '' && filters.commune !== 'Toutes' && filters.commune !== 'Toutes les communes') {
      const fCommune = normalizeStr(filters.commune);
      const pCommune = normalizeStr(p.commune);
      if (!pCommune.includes(fCommune) && !fCommune.includes(pCommune)) return false;
    }

    // 3. Property Type filter
    if (filters.propertyType && filters.propertyType !== '') {
      if (normalizeStr(p.type) !== normalizeStr(filters.propertyType)) return false;
    }

    // 4. Transaction Type filter
    if (filters.transactionType && filters.transactionType !== 'Tous') {
      if (normalizeStr(p.transactionType) !== normalizeStr(filters.transactionType)) return false;
    }

    // 5. Budget Max filter
    if (filters.maxPriceDZD > 0 && p.priceDZD > filters.maxPriceDZD) return false;

    // 6. Budget Min filter
    if (filters.minPriceDZD > 0 && p.priceDZD < filters.minPriceDZD) return false;

    // 7. Surface Min filter
    if (filters.minSurface > 0 && p.surfaceM2 < filters.minSurface) return false;

    // 8. Rooms filter
    if (filters.rooms) {
      if (filters.rooms === '5+') {
        if (p.rooms < 5) return false;
      } else {
        if (p.rooms !== parseInt(filters.rooms, 10)) return false;
      }
    }

    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'priceAsc') return a.priceDZD - b.priceDZD;
    if (filters.sortBy === 'priceDesc') return b.priceDZD - a.priceDZD;
    if (filters.sortBy === 'surfaceDesc') return b.surfaceM2 - a.surfaceM2;
    return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
  });

  const favoritesCount = properties.filter(p => p.isFavorite).length;
  const unreadNotificationsCount = matchNotifications.filter(n => !n.read).length;

  return (
    <PropertyContext.Provider
      value={{
        properties,
        filteredProperties,
        favoritesCount,
        filters,
        setFilters,
        resetFilters,
        toggleFavorite,
        addProperty,
        updateProperty,
        deleteProperty,
        selectedProperty,
        setSelectedProperty,
        isAddModalOpen,
        setIsAddModalOpen,
        isCriteriaModalOpen,
        setIsCriteriaModalOpen,
        subscriptions,
        addSubscription,
        deleteSubscription,
        matchNotifications,
        markNotificationRead,
        unreadNotificationsCount,
        leads,
        addLead,
        updateLeadStatus,
        userRole,
        setUserRole,
        toastMessage,
        showToast
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

export const usePropertyContext = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('usePropertyContext must be used within a PropertyProvider');
  }
  return context;
};


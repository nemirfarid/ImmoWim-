import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '../types';

export interface Translations {
  // Navigation
  navHome: string;
  navProperties: string;
  navEstimation: string;
  navFavorites: string;
  navDashboard: string;
  navAddProperty: string;
  navLogin: string;
  navLogout: string;
  
  // Hero
  heroBadge: string;
  heroTagline: string;
  heroSubtitle: string;
  heroSearchBtn: string;
  heroEstimateBtn: string;
  heroFeatureDeed: string;
  heroFeatureDeedSub: string;
  heroFeatureWilayas: string;
  heroFeatureWilayasSub: string;
  heroFeaturePrice: string;
  heroFeaturePriceSub: string;

  // Filter Bar
  filterWilaya: string;
  filterAllWilayas: string;
  filterCommune: string;
  filterAllCommunes: string;
  filterSelectWilayaFirst: string;
  filterPropertyType: string;
  filterAllTypes: string;
  filterTransaction: string;
  filterAllTransactions: string;
  filterSale: string;
  filterRent: string;
  filterBudgetMax: string;
  filterMinSurface: string;
  filterRooms: string;
  filterAllRooms: string;
  filterSearch: string;
  filterReset: string;
  filterAdvancedTitle: string;

  // Property Cards & Details
  propertyRooms: string;
  propertyBedrooms: string;
  propertyBathrooms: string;
  propertySurface: string;
  propertyPriceMonth: string;
  propertyActAndLivret: string;
  propertyVerified: string;
  propertyContactSeller: string;
  propertyRequestVisit: string;
  propertyDescription: string;
  propertyFeatures: string;
  propertySellerInfo: string;
  propertyLocationMap: string;
  propertyHDVideo: string;
  propertyForSale: string;
  propertyForRent: string;
  propertyCall: string;
  propertySms: string;
  propertyWhatsapp: string;
  
  // Listings Section
  listingsTitle: string;
  listingsSubtitle: string;
  listingsCountOne: string;
  listingsCountMany: string;
  noResultsTitle: string;
  noResultsDesc: string;
  viewGrid: string;
  viewMap: string;
  currencyDZD: string;

  // Estimation Module
  estTitle: string;
  estSubtitle: string;
  estStep1Title: string;
  estStep1Desc: string;
  estStep2Title: string;
  estStep2Desc: string;
  estStep3Title: string;
  estStep3Desc: string;
  estStep4Title: string;
  estStep4Desc: string;

  estTypeApartment: string;
  estTypeVilla: string;
  estTypeLand: string;
  estTypeCommercial: string;

  estStandingEco: string;
  estStandingMid: string;
  estStandingHigh: string;
  estStandingLuxury: string;

  estCalculateBtn: string;
  estResultTitle: string;
  estResultValuation: string;
  estResultRange: string;
  estResultPricePerM2: string;
  estResultRentalYield: string;
  estResultRentEst: string;
  estRequestExpertise: string;
  estSuccessMessage: string;

  // Header & Mobile Nav
  headerAlerts: string;
  headerInvite: string;
  headerFreeAd: string;
  headerAgentPro: string;
  navMapGPS: string;

  // Dashboard
  dashTitle: string;
  dashTabOverview: string;
  dashTabProperties: string;
  dashTabLeads: string;
  dashTabAnalytics: string;

  dashKpiListings: string;
  dashKpiLeads: string;
  dashKpiPortfolio: string;
  dashKpiConversions: string;

  dashTableTitle: string;
  dashTableType: string;
  dashTableWilaya: string;
  dashTablePriceDZD: string;
  dashTableStatus: string;
  dashTableActions: string;
  dashAddPropertyBtn: string;

  dashLeadName: string;
  dashLeadType: string;
  dashLeadWilaya: string;
  dashLeadStatus: string;
  dashLeadDate: string;
  dashLeadAction: string;

  dashChartPriceEvolution: string;
  dashChartSalesVolume: string;
  dashChartPropertyDistribution: string;

  // Modals & General
  modalClose: string;
  modalSave: string;
  modalCancel: string;
  modalSuccess: string;
}

const translations: Record<Language, Translations> = {
  FR: {
    navHome: "Accueil",
    navProperties: "Propriétés",
    navEstimation: "Estimation IA",
    navFavorites: "Favoris",
    navDashboard: "Tableau de bord",
    navAddProperty: "Publier un Bien",
    navLogin: "Espace Pro / Connexion",
    navLogout: "Déconnexion",

    heroBadge: "Plateforme N°1 d'Estimation & Transaction Immobilière en DZD",
    heroTagline: "L'Immobilier d'Exception en Algérie",
    heroSubtitle: "Recherchez, vendez et estimez la vraie valeur de vos biens immobiliers en Dinars Algériens (DZD) en toute transparence.",
    heroSearchBtn: "Rechercher un bien",
    heroEstimateBtn: "Estimer mon bien gratuitement",
    heroFeatureDeed: "Acte & Livret Foncier",
    heroFeatureDeedSub: "Biens 100% vérifiés",
    heroFeatureWilayas: "Toutes les Wilayas",
    heroFeatureWilayasSub: "Alger, Oran, Constantine...",
    heroFeaturePrice: "Prix en Dinars (DZD)",
    heroFeaturePriceSub: "Transparence du marché",

    filterWilaya: "Wilaya",
    filterAllWilayas: "Toutes les Wilayas",
    filterCommune: "Commune / Secteur",
    filterAllCommunes: "Toutes les communes",
    filterSelectWilayaFirst: "Sélectionnez d'abord une Wilaya",
    filterPropertyType: "Type de bien",
    filterAllTypes: "Tous les types",
    filterTransaction: "Transaction",
    filterAllTransactions: "Toutes",
    filterSale: "Achat / Vente",
    filterRent: "Location",
    filterBudgetMax: "Budget Max (DZD)",
    filterMinSurface: "Surface Min (m²)",
    filterRooms: "Pièces",
    filterAllRooms: "Toutes",
    filterSearch: "Rechercher",
    filterReset: "Réinitialiser",
    filterAdvancedTitle: "Filtres avancés en Dinars (DZD)",

    propertyRooms: "Pièces",
    propertyBedrooms: "Chambres",
    propertyBathrooms: "Salles de bain",
    propertySurface: "Surface",
    propertyPriceMonth: "/ mois",
    propertyActAndLivret: "Acte & Livret Foncier",
    propertyVerified: "Bien Vérifié",
    propertyContactSeller: "Contacter l'Agent",
    propertyRequestVisit: "Demander une Visite",
    propertyDescription: "Description détaillée",
    propertyFeatures: "Caractéristiques principales",
    propertySellerInfo: "Informations Vendeur / Agence",
    propertyLocationMap: "Localisation & Carte",
    propertyHDVideo: "Vidéo HD",
    propertyForSale: "À Vendre",
    propertyForRent: "À Louer",
    propertyCall: "Appeler",
    propertySms: "SMS",
    propertyWhatsapp: "WhatsApp",

    listingsTitle: "Annonces Immobilières Récentes",
    listingsSubtitle: "Explorez les biens certifiés disponibles à la vente et location à travers l'Algérie",
    listingsCountOne: "Bien",
    listingsCountMany: "Biens",
    noResultsTitle: "Aucun bien ne correspond à vos critères",
    noResultsDesc: "Essayez d'élargir votre recherche ou de modifier la Wilaya et le budget max.",
    viewGrid: "Grille",
    viewMap: "Carte interactive",
    currencyDZD: "Dinar Algérien (DZD) 🇩🇿",

    estTitle: "Estimation Immobilière Intelligente en DZD",
    estSubtitle: "Obtenez une évaluation précise et instantanée basée sur le marché immobilier algérien.",
    estStep1Title: "1. Type de Bien",
    estStep1Desc: "Sélectionnez le type de votre propriété",
    estStep2Title: "2. Localisation",
    estStep2Desc: "Indiquez la Wilaya, Commune et Quartier",
    estStep3Title: "3. Caractéristiques & Finitions",
    estStep3Desc: "Spécifiez la surface, pièces et la qualité de finition",
    estStep4Title: "4. Résultats de l'Estimation",
    estStep4Desc: "Consultez la valeur estimée en Dinars Algériens (DZD)",

    estTypeApartment: "Appartement (F1 à F6+)",
    estTypeVilla: "Villa & Duplex",
    estTypeLand: "Terrain Constructible",
    estTypeCommercial: "Local Commercial & Bureau",

    estStandingEco: "Économique / Standard",
    estStandingMid: "Moyen Standing",
    estStandingHigh: "Haut Standing",
    estStandingLuxury: "Luxe & Prestige avec Acte",

    estCalculateBtn: "Calculer l'estimation en DZD",
    estResultTitle: "Valeur Estimée sur le Marché Algérien",
    estResultValuation: "Fourchette de Prix Réaliste",
    estResultRange: "Moyenne Estimée",
    estResultPricePerM2: "Prix moyen au m²",
    estResultRentalYield: "Rendement locatif estimé",
    estResultRentEst: "Loyer mensuel estimé",
    estRequestExpertise: "Demander une expertise gratuite sur place",
    estSuccessMessage: "Votre demande d'expertise a été envoyée avec succès à nos agents ImmoWin!",

    headerAlerts: "Alertes & Matchs",
    headerInvite: "Inviter (WhatsApp)",
    headerFreeAd: "Pub Gratuite (0 DZD)",
    headerAgentPro: "Agent Pro",
    navMapGPS: "Carte GPS",

    dashTitle: "Tableau de bord Pro ImmoWin",
    dashTabOverview: "Vue d'ensemble",
    dashTabProperties: "Gestion des Biens",
    dashTabLeads: "Leads & Clients",
    dashTabAnalytics: "Statistiques Marché",

    dashKpiListings: "Biens Actifs",
    dashKpiLeads: "Demandes & Leads",
    dashKpiPortfolio: "Valeur Portefeuille DZD",
    dashKpiConversions: "Taux de Conversion",

    dashTableTitle: "Titre du bien",
    dashTableType: "Type",
    dashTableWilaya: "Wilaya & Commune",
    dashTablePriceDZD: "Prix (DZD)",
    dashTableStatus: "Statut",
    dashTableActions: "Actions",
    dashAddPropertyBtn: "+ Ajouter un Nouveau Bien",

    dashLeadName: "Client / Prospect",
    dashLeadType: "Type de Demande",
    dashLeadWilaya: "Localisation",
    dashLeadStatus: "Statut Lead",
    dashLeadDate: "Date",
    dashLeadAction: "Gérer",

    dashChartPriceEvolution: "Évolution du Prix Moyen au m² (DZD)",
    dashChartSalesVolume: "Volume des Transactions Mensuelles (Mds DZD)",
    dashChartPropertyDistribution: "Répartition par Type de Bien",

    modalClose: "Fermer",
    modalSave: "Enregistrer",
    modalCancel: "Annuler",
    modalSuccess: "Opération réussie !"
  },

  EN: {
    navHome: "Home",
    navProperties: "Properties",
    navEstimation: "AI Valuation",
    navFavorites: "Favorites",
    navDashboard: "Dashboard",
    navAddProperty: "List Property",
    navLogin: "Pro Login",
    navLogout: "Log Out",

    heroBadge: "#1 Real Estate Valuation & Transaction Platform in DZD",
    heroTagline: "Premium Real Estate in Algeria",
    heroSubtitle: "Search, sell and evaluate the real market value of properties in Algerian Dinars (DZD) with total transparency.",
    heroSearchBtn: "Find Properties",
    heroEstimateBtn: "Get Free Instant Valuation",
    heroFeatureDeed: "Legal Title Deed",
    heroFeatureDeedSub: "100% Verified Properties",
    heroFeatureWilayas: "All 58 Wilayas",
    heroFeatureWilayasSub: "Algiers, Oran, Constantine...",
    heroFeaturePrice: "Prices in Dinars (DZD)",
    heroFeaturePriceSub: "Market Transparency",

    filterWilaya: "Wilaya (Region)",
    filterAllWilayas: "All Wilayas",
    filterCommune: "Commune / City",
    filterAllCommunes: "All Communes",
    filterSelectWilayaFirst: "Select a Wilaya first",
    filterPropertyType: "Property Type",
    filterAllTypes: "All Types",
    filterTransaction: "Transaction",
    filterAllTransactions: "All",
    filterSale: "Buy / Sale",
    filterRent: "Rent",
    filterBudgetMax: "Max Budget (DZD)",
    filterMinSurface: "Min Area (m²)",
    filterRooms: "Rooms",
    filterAllRooms: "All",
    filterSearch: "Search",
    filterReset: "Reset",
    filterAdvancedTitle: "Advanced filters in Dinars (DZD)",

    propertyRooms: "Rooms",
    propertyBedrooms: "Bedrooms",
    propertyBathrooms: "Bathrooms",
    propertySurface: "Area",
    propertyPriceMonth: "/ month",
    propertyActAndLivret: "Legal Title Deed (Acte & Livret)",
    propertyVerified: "Verified Property",
    propertyContactSeller: "Contact Agent",
    propertyRequestVisit: "Schedule Tour",
    propertyDescription: "Detailed Description",
    propertyFeatures: "Key Features",
    propertySellerInfo: "Seller / Agency Contact",
    propertyLocationMap: "Location & Map",
    propertyHDVideo: "HD Video",
    propertyForSale: "For Sale",
    propertyForRent: "For Rent",
    propertyCall: "Call",
    propertySms: "SMS",
    propertyWhatsapp: "WhatsApp",

    listingsTitle: "Recent Real Estate Listings",
    listingsSubtitle: "Explore certified properties available for sale and rent across Algeria",
    listingsCountOne: "Property",
    listingsCountMany: "Properties",
    noResultsTitle: "No properties match your search criteria",
    noResultsDesc: "Try broadening your search or modifying the Wilaya and max budget.",
    viewGrid: "Grid",
    viewMap: "Interactive Map",
    currencyDZD: "Algerian Dinar (DZD) 🇩🇿",

    estTitle: "Intelligent Real Estate Valuation in DZD",
    estSubtitle: "Get an accurate and instant market appraisal tailored for Algerian real estate dynamics.",
    estStep1Title: "1. Property Type",
    estStep1Desc: "Choose your property category",
    estStep2Title: "2. Location",
    estStep2Desc: "Specify Wilaya, Commune, and District",
    estStep3Title: "3. Specifications & Finishings",
    estStep3Desc: "Specify area, rooms, and finishing quality",
    estStep4Title: "4. Valuation Summary",
    estStep4Desc: "Review estimated market value in Algerian Dinars (DZD)",

    estTypeApartment: "Apartment (F1 to F6+)",
    estTypeVilla: "Villa & Duplex",
    estTypeLand: "Buildable Land Plot",
    estTypeCommercial: "Commercial Premises & Office",

    estStandingEco: "Standard / Economy",
    estStandingMid: "Medium Standing",
    estStandingHigh: "High Standing",
    estStandingLuxury: "Luxury & Prestige with Deed",

    estCalculateBtn: "Compute DZD Valuation",
    estResultTitle: "Estimated Market Value in Algeria",
    estResultValuation: "Realistic Price Range",
    estResultRange: "Estimated Average",
    estResultPricePerM2: "Average price per m²",
    estResultRentalYield: "Estimated rental yield",
    estResultRentEst: "Estimated monthly rent",
    estRequestExpertise: "Request free on-site agent appraisal",
    estSuccessMessage: "Your appraisal request has been submitted to ImmoWin certified agents!",

    headerAlerts: "Match Alerts",
    headerInvite: "Invite (WhatsApp)",
    headerFreeAd: "Free Ad (0 DZD)",
    headerAgentPro: "Pro Agent",
    navMapGPS: "GPS Map",

    dashTitle: "ImmoWin Pro Dashboard",
    dashTabOverview: "Overview",
    dashTabProperties: "Listings Management",
    dashTabLeads: "Leads & CRM",
    dashTabAnalytics: "Market Analytics",

    dashKpiListings: "Active Listings",
    dashKpiLeads: "Inquiries & Leads",
    dashKpiPortfolio: "Portfolio Value DZD",
    dashKpiConversions: "Conversion Rate",

    dashTableTitle: "Property Title",
    dashTableType: "Type",
    dashTableWilaya: "Location",
    dashTablePriceDZD: "Price (DZD)",
    dashTableStatus: "Status",
    dashTableActions: "Actions",
    dashAddPropertyBtn: "+ Add New Property",

    dashLeadName: "Client / Lead Name",
    dashLeadType: "Request Type",
    dashLeadWilaya: "Location",
    dashLeadStatus: "Lead Status",
    dashLeadDate: "Date",
    dashLeadAction: "Manage",

    dashChartPriceEvolution: "Average Price Evolution per m² (DZD)",
    dashChartSalesVolume: "Monthly Transaction Volume (Billion DZD)",
    dashChartPropertyDistribution: "Property Types Breakdown",

    modalClose: "Close",
    modalSave: "Save",
    modalCancel: "Cancel",
    modalSuccess: "Success!"
  },

  AR: {
    navHome: "الرئيسية",
    navProperties: "العقارات",
    navEstimation: "التقييم بالذكاء الاصطناعي",
    navFavorites: "المفضلة",
    navDashboard: "لوحة التحكم",
    navAddProperty: "نشر عقار",
    navLogin: "فضاء المحترفين / الدخول",
    navLogout: "تسجيل الخروج",

    heroBadge: "المنصة رقم 1 للتقييم والمعاملات العقارية بالدينار الجزائري",
    heroTagline: "العقارات الفاخرة في الجزائر",
    heroSubtitle: "ابحث، بع، وقيم القيمة الحقيقية لعقاراتك بالدينار الجزائري (DZD) بكل شفافية واحترافية.",
    heroSearchBtn: "البحث عن عقار",
    heroEstimateBtn: "تقييم عقاري مجاني",
    heroFeatureDeed: "عقد توثيقي ودفتر عقاري",
    heroFeatureDeedSub: "عقارات موثوقة 100%",
    heroFeatureWilayas: "جميع الولايات 58",
    heroFeatureWilayasSub: "الجزائر، وهران، قسنطينة...",
    heroFeaturePrice: "الأسعار بالدينار (DZD)",
    heroFeaturePriceSub: "شفافية التقييم والسوق",

    filterWilaya: "الولاية",
    filterAllWilayas: "جميع الولايات",
    filterCommune: "البلدية / الحي",
    filterAllCommunes: "جميع البلديات",
    filterSelectWilayaFirst: "اختر الولاية أولاً",
    filterPropertyType: "نوع العقار",
    filterAllTypes: "جميع الأنواع",
    filterTransaction: "نوع المعاملة",
    filterAllTransactions: "الكل",
    filterSale: "بيع / شراء",
    filterRent: "كراء / إيجار",
    filterBudgetMax: "الميزانية القصوى (د.ج)",
    filterMinSurface: "المساحة الدنيا (م²)",
    filterRooms: "الغرف",
    filterAllRooms: "الكل",
    filterSearch: "بحث",
    filterReset: "إعادة ضبط",
    filterAdvancedTitle: "تصفية متقدمة بالدينار الجزائري",

    propertyRooms: "الغرف",
    propertyBedrooms: "غرف النوم",
    propertyBathrooms: "حمامات",
    propertySurface: "المساحة",
    propertyPriceMonth: "/ شهر",
    propertyActAndLivret: "عقد موثق ودفتر عقاري",
    propertyVerified: "عقار موثوق",
    propertyContactSeller: "الاتصال بالوكيل",
    propertyRequestVisit: "طلب معاينة / زيارة",
    propertyDescription: "الوصف التفصيلي",
    propertyFeatures: "الخصائص الرئيسية",
    propertySellerInfo: "معلومات البائع / الوكالة",
    propertyLocationMap: "الموقع الخريطة",
    propertyHDVideo: "فيديو عالي الدقة",
    propertyForSale: "للبيع",
    propertyForRent: "للإيجار",
    propertyCall: "اتصال",
    propertySms: "رسالة SMS",
    propertyWhatsapp: "واتساب",

    listingsTitle: "أحدث الإعلانات العقارية",
    listingsSubtitle: "تصفح العقارات الموثقة المتاحة للبيع والإيجار في جميع أنحاء الجزائر",
    listingsCountOne: "عقار",
    listingsCountMany: "عقارات",
    noResultsTitle: "لم يتم العثور على عقارات تطابق معايير البحث",
    noResultsDesc: "جرب توسيع نطاق البحث أو تغيير الولاية والميزانية القصوى.",
    viewGrid: "شبكة",
    viewMap: "خريطة تفاعلية",
    currencyDZD: "الدينار الجزائري (DZD) 🇩🇿",

    estTitle: "التقييم العقاري الذكي بالدينار الجزائري",
    estSubtitle: "احصل على تقييم دقيق وفوري يعتمد على بيانات السوق العقاري في الجزائر.",
    estStep1Title: "1. نوع العقار",
    estStep1Desc: "اختر فئة عقارك",
    estStep2Title: "2. الموقع الجغرافي",
    estStep2Desc: "حدد الولاية، البلدية والحي",
    estStep3Title: "3. المواصفات والتشطيبات",
    estStep3Desc: "حدد المساحة، عدد الغرف وجودة التشطيب",
    estStep4Title: "4. نتائج التقييم",
    estStep4Desc: "اطّلع على القيمة التقديرية بالدينار الجزائري (DZD)",

    estTypeApartment: "شقة (F1 إلى F6+)",
    estTypeVilla: "فيلا و دوبلكس",
    estTypeLand: "قطعة أرض قابلة للبناء",
    estTypeCommercial: "محل تجاري ومكتب",

    estStandingEco: "اقتصادي / عادي",
    estStandingMid: "متوسط التشطيب",
    estStandingHigh: "رفيع المستوى (Haut Standing)",
    estStandingLuxury: "فاخر مع عقد ودفتر عقاري",

    estCalculateBtn: "حساب التقييم بالدينار الجزائري",
    estResultTitle: "القيمة التقديرية في السوق الجزائرية",
    estResultValuation: "النطاق السعري الواقعي",
    estResultRange: "المتوسط المقدر",
    estResultPricePerM2: "متوسط السعر للمتر المربع",
    estResultRentalYield: "عائد الإيجار السنوي المقدر",
    estResultRentEst: "الإيجار الشهري المتوقع",
    estRequestExpertise: "طلب معاينة مجانية من خبير ميداني",
    estSuccessMessage: "تم إرسال طلب المعاينة بنجاح إلى وكلاء إيمووين المعتمدين!",

    headerAlerts: "شبكة التنبيهات",
    headerInvite: "دعوة (واتساب)",
    headerFreeAd: "إعلان مجاني (0 د.ج)",
    headerAgentPro: "وكيل محترف",
    navMapGPS: "خريطة GPS",

    dashTitle: "لوحة تحكم المحترفين ImmoWin",
    dashTabOverview: "نظرة عامة",
    dashTabProperties: "إدارة العقارات",
    dashTabLeads: "الطلبات والزبائن",
    dashTabAnalytics: "إحصائيات السوق",

    dashKpiListings: "العقارات النشطة",
    dashKpiLeads: "الاستفسارات والطلبات",
    dashKpiPortfolio: "قيمة المحفظة (د.ج)",
    dashKpiConversions: "نسبة التحويل",

    dashTableTitle: "عنوان العقار",
    dashTableType: "النوع",
    dashTableWilaya: "الولاية والبلدية",
    dashTablePriceDZD: "السعر (د.ج)",
    dashTableStatus: "الحالة",
    dashTableActions: "الإجراءات",
    dashAddPropertyBtn: "+ إضافة عقار جديد",

    dashLeadName: "العميل / الزبون",
    dashLeadType: "نوع الطلب",
    dashLeadWilaya: "الموقع",
    dashLeadStatus: "حالة الطلب",
    dashLeadDate: "التاريخ",
    dashLeadAction: "إدارة",

    dashChartPriceEvolution: "تطور متوسط السعر للمتر المربع (د.ج)",
    dashChartSalesVolume: "حجم المعاملات الشهرية (مليار د.ج)",
    dashChartPropertyDistribution: "توزيع العقارات حسب النوع",

    modalClose: "إغلاق",
    modalSave: "حفظ",
    modalCancel: "إلغاء",
    modalSuccess: "تمت العملية بنجاح!"
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('immowin_lang');
      if (saved === 'AR' || saved === 'EN' || saved === 'FR') {
        return saved as Language;
      }
    } catch {
      // ignore
    }
    return 'FR';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('immowin_lang', lang);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    document.documentElement.lang = language === 'AR' ? 'ar' : language === 'EN' ? 'en' : 'fr';
    document.documentElement.dir = language === 'AR' ? 'rtl' : 'ltr';
  }, [language]);

  const value = {
    language,
    setLanguage,
    t: translations[language] || translations.FR
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

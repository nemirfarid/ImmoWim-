import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  canonicalUrl?: string;
  noindex?: boolean;
  structuredData?: object | object[];
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  ogImage,
  ogType = 'website',
  canonicalUrl,
  noindex = false,
  structuredData,
}) => {
  const { language } = useLanguage();

  const siteName = 'ImmoWin Algérie';
  const defaultTitle = language === 'AR'
    ? 'إيمووين - بيع، شراء وكراء العقارات في الجزائر (د.ج)'
    : language === 'EN'
    ? 'ImmoWin - Real Estate Buy, Sell & Rent in Algeria (DZD)'
    : 'ImmoWin - Achat, Vente & Location Immobilière en Algérie (DZD)';

  const defaultDescription = language === 'AR'
    ? 'المنصة العقارية الرائدة في الجزائر. اكتشف إعلانات موثوقة للشقق، الفيلات، الأراضي والمحلات التجارية بالدينار الجزائري مع عقود موثقة ودفتر عقاري.'
    : language === 'EN'
    ? 'Premier real estate platform in Algeria. Discover verified apartment, villa, land, and commercial listings in Algerian Dinars (DZD) with official legal title deeds.'
    : 'Plateforme immobilière d’exception en Algérie. Découvrez nos annonces vérifiées d’appartements, villas, duplex et locaux en Dinars Algériens (DZD) avec acte et livret foncier.';

  const defaultKeywords = 'immobilier Algérie, vente appartement Alger, location villa Oran, عقارات الجزائر, شقق للبيع, عقارات وهران قسنطينة, acte et livret foncier';
  
  const defaultImage = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';

  const fullTitle = title ? (title.includes(siteName) ? title : `${title} | ${siteName}`) : defaultTitle;
  const fullDescription = description || defaultDescription;
  const fullKeywords = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;
  const imageToUse = ogImage || defaultImage;
  const currentUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : 'https://immowin.dz');

  const localeMap: Record<string, string> = {
    FR: 'fr_DZ',
    EN: 'en_US',
    AR: 'ar_DZ',
  };

  return (
    <Helmet>
      {/* HTML Language attribute */}
      <html lang={language.toLowerCase()} />

      {/* Standard Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={fullKeywords} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'} />

      {/* Open Graph / Facebook */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={imageToUse} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:locale" content={localeMap[language] || 'fr_DZ'} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={imageToUse} />

      {/* Canonical Link */}
      <link rel="canonical" href={currentUrl} />

      {/* JSON-LD Structured Data for Search Engine Crawlers */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

import { useEffect } from 'react';

/**
 * SEOHead.jsx
 * - Props: title, description, image.
 * - On mount and update: set document.title, update or create meta description,
 *   og:title, og:description, og:image meta tags.
 */
const SEOHead = ({ title, description, image }) => {
  const brand = "Venki's Foods";
  const defaultTitle = `${brand} | Authentic Indian Pickles & Gourmet Condiments`;
  const fullTitle = title ? `${title} | ${brand}` : defaultTitle;
  
  const siteUrl = "https://venkis-foods.vercel.app";
  const defaultDesc = "Handcrafted, traditional Indian pickles and condiments delivered fresh in Mumbai. Experience the authentic taste of Venki's heritage recipes.";
  const finalDesc = description || defaultDesc;
  const finalImage = image || `${siteUrl}/og-image.jpg`;

  useEffect(() => {
    // 1. Set Document Title
    document.title = fullTitle;

    // 2. Helper to set/create meta tags
    const updateMeta = (name, content, property = false) => {
      let el = document.querySelector(property ? `meta[property="${name}"]` : `meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        if (property) el.setAttribute('property', name);
        else el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 3. Update Standard Meta
    updateMeta('description', finalDesc);

    // 4. Update Open Graph Meta
    updateMeta('og:title', fullTitle, true);
    updateMeta('og:description', finalDesc, true);
    updateMeta('og:image', finalImage, true);
    updateMeta('og:url', window.location.href, true);

  }, [fullTitle, finalDesc, finalImage]);

  return null; // This component doesn't render anything UI-wise
};

export default SEOHead;

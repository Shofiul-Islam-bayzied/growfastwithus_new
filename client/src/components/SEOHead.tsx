import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  ogImageAlt?: string;
  twitterCard?: string;
  structuredData?: object;
  noindex?: boolean;
  nofollow?: boolean;
}

const defaultValues = {
  title: "GrowFastWithUs - Business Automation & AI Integration Solutions",
  description: "Automate your business with AI-powered workflows. We design, deploy, and host custom automation solutions for healthcare, real estate, e-commerce, and professional services. Boost efficiency and eliminate repetitive tasks.",
  keywords: "business automation, workflow automation, AI integration, no-code automation, business process optimization, healthcare automation, real estate automation, e-commerce automation, professional services automation, productivity tools, SaaS automation, API integration",
  canonical: "https://growfastwithus.com/",
  ogType: "website",
  ogImage: "https://growfastwithus.com/og-image.jpg",
  ogImageAlt: "GrowFastWithUs - Business Automation Solutions",
  twitterCard: "summary_large_image"
};

export function SEOHead({
  title = defaultValues.title,
  description = defaultValues.description,
  keywords = defaultValues.keywords,
  canonical = defaultValues.canonical,
  ogType = defaultValues.ogType,
  ogImage = defaultValues.ogImage,
  ogImageAlt = defaultValues.ogImageAlt,
  twitterCard = defaultValues.twitterCard,
  structuredData,
  noindex = false,
  nofollow = false
}: SEOHeadProps) {
  
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta tags
    updateMetaTag('name', 'description', description);
    updateMetaTag('name', 'keywords', keywords);
    updateMetaTag('name', 'robots', `${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}, max-snippet:-1, max-image-preview:large, max-video-preview:-1`);
    
    // Update Open Graph tags
    updateMetaTag('property', 'og:title', title);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:type', ogType);
    updateMetaTag('property', 'og:url', canonical);
    updateMetaTag('property', 'og:image', ogImage);
    updateMetaTag('property', 'og:image:alt', ogImageAlt);
    
    // Update Twitter tags
    updateMetaTag('property', 'twitter:title', title);
    updateMetaTag('property', 'twitter:description', description);
    updateMetaTag('property', 'twitter:card', twitterCard);
    updateMetaTag('property', 'twitter:image', ogImage);
    
    // Update canonical link
    updateCanonicalLink(canonical);
    
    // Add structured data if provided
    if (structuredData) {
      addStructuredData(structuredData);
    }
    
    return () => {
      // Cleanup: remove any dynamically added structured data
      const existingScript = document.querySelector('script[data-dynamic-seo]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [title, description, keywords, canonical, ogType, ogImage, ogImageAlt, twitterCard, structuredData, noindex, nofollow]);
  
  return null; // This component doesn't render anything
}

function updateMetaTag(attribute: string, name: string, content: string) {
  let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
}

function updateCanonicalLink(href: string) {
  let element = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  
  element.setAttribute('href', href);
}

function addStructuredData(data: object) {
  // Remove existing dynamic structured data
  const existingScript = document.querySelector('script[data-dynamic-seo]');
  if (existingScript) {
    existingScript.remove();
  }
  
  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-dynamic-seo', 'true');
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

// Pre-configured SEO data for different page types
export const seoTemplates = {
  homepage: {
    title: "GrowFastWithUs - Business Automation & AI Integration Solutions",
    description: "Automate your business with AI-powered workflows. We design, deploy, and host custom automation solutions for healthcare, real estate, e-commerce, and professional services. Boost efficiency and eliminate repetitive tasks.",
    keywords: "business automation, workflow automation, AI integration, no-code automation, business process optimization, healthcare automation, real estate automation, e-commerce automation, professional services automation, productivity tools, SaaS automation, API integration",
    canonical: "https://growfastwithus.com/",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "GrowFastWithUs",
      "url": "https://growfastwithus.com",
      "logo": "https://growfastwithus.com/logo.png",
      "description": "Business automation and AI integration solutions provider",
      "sameAs": [
        "https://youtube.com/@growfastwithus",
        "https://linkedin.com/company/growfastwithus"
      ]
    }
  },
  
  templates: {
    title: "Business Automation Templates - Ready-to-Deploy Solutions | GrowFastWithUs",
    description: "Explore our library of pre-built automation templates for healthcare, real estate, e-commerce, and professional services. Deploy in 1-3 days with full support and training.",
    keywords: "automation templates, business templates, workflow templates, healthcare automation, real estate templates, e-commerce automation, professional services automation, ready-to-deploy solutions",
    canonical: "https://growfastwithus.com/templates",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Business Automation Templates",
      "description": "Pre-built automation solutions for various industries",
      "url": "https://growfastwithus.com/templates"
    }
  },
  
  booking: {
    title: "Book Free Discovery Call - Business Automation Consultation | GrowFastWithUs",
    description: "Schedule a free 30-minute consultation to discuss your business automation needs. Get personalized recommendations and learn how we can help streamline your operations.",
    keywords: "free consultation, discovery call, business automation consultation, automation planning, workflow consultation, business efficiency consultation",
    canonical: "https://growfastwithus.com/booking",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Free Business Automation Consultation",
      "description": "30-minute discovery call to discuss automation opportunities",
      "provider": {
        "@type": "Organization",
        "name": "GrowFastWithUs"
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "description": "Free consultation"
      }
    }
  }
};

// Template-specific SEO generator
export function generateTemplateSEO(templateId: string, templateName: string, industry: string, description: string) {
  return {
    title: `${templateName} - ${industry} Automation Template | GrowFastWithUs`,
    description: `${description} Ready-to-deploy automation solution for ${industry.toLowerCase()} businesses. Includes setup, training, and support.`,
    keywords: `${templateName.toLowerCase()}, ${industry.toLowerCase()} automation, ${industry.toLowerCase()} template, business automation, workflow automation, ${industry.toLowerCase()} efficiency`,
    canonical: `https://growfastwithus.com/template/${templateId}`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": templateName,
      "description": description,
      "category": `${industry} Automation`,
      "brand": {
        "@type": "Organization",
        "name": "GrowFastWithUs"
      },
      "offers": {
        "@type": "Offer",
        "availability": "https://schema.org/InStock",
        "priceCurrency": "USD",
        "seller": {
          "@type": "Organization",
          "name": "GrowFastWithUs"
        }
      }
    }
  };
} 
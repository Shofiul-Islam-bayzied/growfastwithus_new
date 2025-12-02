import { LucideIcon, Stethoscope, Home, ShoppingCart, Users, UtensilsCrossed, Briefcase, TrendingUp, Calendar, UserCheck, Bot, Phone, Target, ShoppingBag, Dumbbell } from "lucide-react";

export interface VoiceAIAddon {
  id: string;
  name: string;
  monthlyPrice: number;
  setupFee: number;
  includedMinutes: number;
  perMinuteRate: number;
}

export interface TemplateTier {
  name: string; // e.g. Starter, Professional, Enterprise
  monthlyFee: number;
  setupFee: number;
  roiValue: string;
  features: string[];
  technicalImplementation: string[];
  roiCalculation: string[];
}

export interface NewTemplate {
  id: string;
  title: string;
  description: string;
  industryValue: string;
  category: string;
  tiers: TemplateTier[];
}

export interface BundlePackage {
  id: string;
  name: string;
  description: string;
  monthlyFee: number;
  setupFee: number;
  savings: string;
  features: string[];
}

export interface CustomSolution {
  id: string;
  name: string;
  description: string;
  monthlyFee: number;
  setupFee: number;
  features: string[];
}

export interface PremiumAddon {
  id: string;
  name: string;
  description: string;
  monthlyFee: string;
  technicalImplementation: string;
}

export interface SupportLevel {
  level: string;
  responseTime: string;
  resolutionTime: string;
  includedWith: string[];
}

export interface ImplementationTimeframe {
  solutionType: string;
  timeframe: string;
  description: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number; // Rate relative to GBP
}

export const currencies: Currency[] = [
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 1.0 },
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.27 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 1.16 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.71 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.89 }
];

export const voiceAIAddons: VoiceAIAddon[] = [
  {
    id: 'voice-lite',
    name: 'Voice AI Lite',
    monthlyPrice: 99,
    setupFee: 199,
    includedMinutes: 500,
    perMinuteRate: 0.10
  },
  {
    id: 'voice-standard',
    name: 'Voice AI Standard',
    monthlyPrice: 249,
    setupFee: 499,
    includedMinutes: 1500,
    perMinuteRate: 0.08
  },
  {
    id: 'voice-enterprise',
    name: 'Voice AI Enterprise',
    monthlyPrice: 0, // Custom quote
    setupFee: 0, // Custom quote
    includedMinutes: 5000,
    perMinuteRate: 0.05
  }
];

export const bundlePackages: BundlePackage[] = [
  {
    id: 'standard-bundle',
    name: 'Standard Bundle Package',
    description: 'Save significantly by combining multiple templates',
    monthlyFee: 699,
    setupFee: 1299,
    savings: '€99-€499',
    features: [
      'Any 2 templates at Starter tier',
      'Basic cross-template integration',
      'Unified dashboard',
      'Standard support'
    ]
  },
  {
    id: 'professional-bundle',
    name: 'Professional Bundle Package',
    description: 'Advanced multi-template solution with enterprise features',
    monthlyFee: 1999,
    setupFee: 3499,
    savings: '€397-€2,797',
    features: [
      'Any 3-4 templates at Professional tier',
      'Advanced cross-template integration',
      'Unified dashboard',
      'Priority support',
      'Custom workflows'
    ]
  },
  {
    id: 'enterprise-bundle',
    name: 'Enterprise Bundle Package',
    description: 'Complete enterprise automation solution',
    monthlyFee: 3999,
    setupFee: 7999,
    savings: '€1,996-€5,996+',
    features: [
      'Any 5+ templates at Enterprise tier',
      'Dedicated infrastructure',
      'Complete system integration',
      'Enterprise support',
      'Custom development'
    ]
  }
];

export const customSolutions: CustomSolution[] = [
  {
    id: 'custom-basic',
    name: 'Custom Solution Basic',
    description: 'Up to 5 custom workflows with standard integrations',
    monthlyFee: 2499,
    setupFee: 4999,
    features: [
      'Dedicated solution architect',
      'Customized requirements analysis',
      'Bespoke workflow development',
      'Custom user interface',
      'Comprehensive testing',
      'Standard hosting'
    ]
  },
  {
    id: 'custom-plus',
    name: 'Custom Solution Plus',
    description: 'Up to 10 custom workflows with advanced integrations',
    monthlyFee: 4999,
    setupFee: 9999,
    features: [
      'Advanced custom workflows',
      'Enterprise-level integrations',
      'Custom dashboards',
      'Premium API usage',
      'Dedicated account manager',
      'Quarterly business reviews'
    ]
  },
  {
    id: 'custom-pro',
    name: 'Custom Solution Pro',
    description: 'Unlimited workflows with enterprise-level integrations',
    monthlyFee: 7999,
    setupFee: 14999,
    features: [
      'Unlimited custom workflows',
      'Enterprise integrations',
      'Custom development team',
      'Dedicated infrastructure',
      'VIP support',
      'Quarterly optimization sessions'
    ]
  }
];

export const premiumAddons: PremiumAddon[] = [
  {
    id: 'ai-voice-integration',
    name: 'AI Voice Integration',
    description: 'ElevenLabs voice synthesis for calls, messages',
    monthlyFee: '€299-€999',
    technicalImplementation: 'ElevenLabs API integration, n8n workflows for call management, custom voice profiles'
  },
  {
    id: 'whatsapp-business-api',
    name: 'WhatsApp Business API',
    description: 'Automated messaging with rich media support',
    monthlyFee: '€249-€699',
    technicalImplementation: 'WhatsApp Business API integration, media handling middleware, message templates'
  },
  {
    id: 'custom-ai-assistants',
    name: 'Custom AI Assistants',
    description: 'GPT-based assistants with domain knowledge',
    monthlyFee: '€499-€1,499',
    technicalImplementation: 'OpenAI GPT API with fine-tuning, Pinecone knowledge base, custom prompts'
  },
  {
    id: 'advanced-analytics',
    name: 'Advanced Analytics',
    description: 'Custom dashboards and business intelligence',
    monthlyFee: '€299-€799',
    technicalImplementation: 'Custom dashboards, data visualization tools, automated reporting'
  },
  {
    id: 'multi-language-support',
    name: 'Multi-Language Support',
    description: 'Translation and localization for global operations',
    monthlyFee: '€199-€599',
    technicalImplementation: 'Translation APIs, language detection, multi-language templates'
  },
  {
    id: 'dedicated-success-manager',
    name: 'Dedicated Success Manager',
    description: 'Personalized support and strategy sessions',
    monthlyFee: '€999',
    technicalImplementation: 'Regular check-ins, custom optimization, priority issue resolution'
  },
  {
    id: 'enhanced-api-allocation',
    name: 'Enhanced API Allocation',
    description: 'Additional API usage beyond plan limits',
    monthlyFee: '€199-€999',
    technicalImplementation: 'Increased quota for OpenAI, ElevenLabs, and other API services'
  },
  {
    id: 'custom-integrations',
    name: 'Custom Integrations',
    description: 'Connection to proprietary or niche systems',
    monthlyFee: '€499-€1,499',
    technicalImplementation: 'Custom API development, webhook creation, data transformation services'
  }
];

export const implementationTimeframes: ImplementationTimeframe[] = [
  {
    solutionType: 'Starter Template',
    timeframe: '3-5 business days',
    description: 'Quick deployment of standard templates'
  },
  {
    solutionType: 'Professional Template',
    timeframe: '5-10 business days',
    description: 'Configuration and customization of advanced features'
  },
  {
    solutionType: 'Enterprise Template',
    timeframe: '10-15 business days',
    description: 'Complete setup with custom integrations'
  },
  {
    solutionType: 'Standard Bundle',
    timeframe: '7-12 business days',
    description: 'Deployment of multiple integrated templates'
  },
  {
    solutionType: 'Professional Bundle',
    timeframe: '14-21 business days',
    description: 'Comprehensive setup with cross-template workflows'
  },
  {
    solutionType: 'Enterprise Bundle',
    timeframe: '21-30 business days',
    description: 'Complete enterprise deployment with optimization'
  },
  {
    solutionType: 'Custom Solution',
    timeframe: '4-12 weeks',
    description: 'Bespoke development and implementation'
  }
];

export const supportLevels: SupportLevel[] = [
  {
    level: 'Standard',
    responseTime: '24 hours',
    resolutionTime: '48 hours',
    includedWith: ['Starter Templates']
  },
  {
    level: 'Priority',
    responseTime: '8 hours',
    resolutionTime: '24 hours',
    includedWith: ['Professional Templates', 'Bundles']
  },
  {
    level: 'Premium',
    responseTime: '4 hours',
    resolutionTime: '12 hours',
    includedWith: ['Enterprise Templates']
  },
  {
    level: 'VIP',
    responseTime: '1 hour',
    resolutionTime: '6 hours',
    includedWith: ['Enterprise Bundles', 'Custom Solutions']
  }
];

export function convertPrice(amount: number, fromCurrency: string, toCurrency: string): number {
  const fromRate = currencies.find(c => c.code === fromCurrency)?.rate || 1;
  const toRate = currencies.find(c => c.code === toCurrency)?.rate || 1;
  return Math.round((amount / fromRate) * toRate);
}

export function formatPrice(amount: number, currency: string): string {
  const currencyData = currencies.find(c => c.code === currency);
  if (!currencyData) return `${amount}`;
  
  return `${currencyData.symbol}${amount.toLocaleString()}`;
}

// Technical Implementation Stack & Tools
export const technicalStack = {
  coreAutomation: [
    'n8n: Enterprise-grade workflow automation engine for complex business processes',
    'Make.com (formerly Integromat): Complementary automation tool for specific integration scenarios',
    'Custom API Gateway: For managing API traffic, security, and rate limiting'
  ],
  aiAndNLP: [
    'OpenAI GPT Models: For conversational AI, content generation, and natural language understanding',
    'Langflow: Visual interface for building LLM-powered applications',
    'Pinecone: Vector database for knowledge retrieval and semantic search',
    'Custom Fine-tuning: For industry-specific language models'
  ],
  voiceAndCommunication: [
    'ElevenLabs: State-of-the-art voice synthesis for natural-sounding calls',
    'Twilio: For SMS, voice, and communication integrations',
    'WhatsApp Business API: For rich messaging capabilities',
    'Email Service Providers: For automated email campaigns and notifications'
  ],
  dataStorage: [
    'Airtable: For flexible, structured data storage',
    'Custom Databases: For high-performance, secure data management',
    'S3-compatible Storage: For media, documents, and file management'
  ],
  integrationCapabilities: [
    'RESTful API Integrations: For connecting with thousands of services',
    'Webhook Receivers: For real-time data capture',
    'Custom Middleware: For data transformation and enrichment',
    'Authentication Handlers: For secure connections to third-party services'
  ],
  monitoringAndReliability: [
    'Uptime Monitoring: 24/7 system health checks',
    'Error Detection: Automated alert systems for workflow issues',
    'Redundancy: Multi-region deployments for critical workflows',
    'Logging: Comprehensive activity logging for troubleshooting'
  ],
  securityAndCompliance: [
    'End-to-End Encryption: For sensitive data',
    'GDPR Compliance Tools: For data handling in accordance with regulations',
    'HIPAA Compliance Framework: For healthcare solutions',
    'Regular Security Audits: To ensure system integrity'
  ]
};

export const templates: NewTemplate[] = [
  {
    id: "ai-medical-practice",
    title: "AI Medical Practice Automation",
    description: "Automate appointment scheduling, patient reminders, and follow-up communications with AI-powered workflows.",
    industryValue: "Premium (Healthcare)",
    category: "Healthcare",
    tiers: [
      {
        name: "Starter",
        monthlyFee: 599,
        setupFee: 999,
        roiValue: "€3,000-€5,000/month",
        features: [
          "Patient appointment scheduling system with SMS/email reminders",
          "Automated rescheduling workflows with conflict detection",
          "Basic monthly reporting on no-show rates and appointment efficiency",
          "Integration with 1 calendar system (Google Calendar, Outlook, etc.)",
          "Standard hosting with 99.5% uptime guarantee",
          "HIPAA/GDPR compliant data handling procedures",
          "Basic API usage (up to 1,000 API calls/month)",
          "Standard support (24-hour response time)"
        ],
        technicalImplementation: [
          "n8n workflows for appointment scheduling and calendar management",
          "Airtable database for patient records (encrypted)",
          "Make.com for SMS/email triggers and reminders",
          "Google Calendar/Outlook API integrations",
          "Webhook monitoring for system health"
        ],
        roiCalculation: [
          "Average medical practice loses €150-€250 per no-show",
          "No-show reduction of 25-40% using our system",
          "Typical practice with 200 appointments/month and 15% no-show rate = 30 no-shows",
          "Recovering 10 no-shows = €1,500-€2,500 monthly revenue recovery",
          "Staff time saved (25 hours/month at €35/hour) = €875 monthly savings",
          "Total typical ROI: €2,375-€3,375/month (4-5.6x ROI on Starter tier)"
        ]
      },
      {
        name: "Professional",
        monthlyFee: 1199,
        setupFee: 1999,
        roiValue: "€6,000-€10,000/month",
        features: [
          "AI-driven patient follow-up communication",
          "Intelligent triage of incoming patient requests",
          "Automated document collection and verification",
          "Patient satisfaction tracking with analytics",
          "Advanced report generation with customizable dashboards",
          "Integration with 3 platforms (EHR, calendars, CRM)",
          "Premium hosting with 99.9% uptime guarantee",
          "Extended API usage (up to 5,000 API calls/month)",
          "Priority support (8-hour response time)"
        ],
        technicalImplementation: [
          "OpenAI GPT API for patient message personalization",
          "Document parsing via OCR and AI classification",
          "n8n workflows for EHR system integration",
          "Twilio for voice/SMS follow-ups",
          "Custom dashboards using chart.js and data visualization tools"
        ],
        roiCalculation: []
      },
      {
        name: "Enterprise",
        monthlyFee: 1999,
        setupFee: 3999,
        roiValue: "€12,000-€20,000/month",
        features: [
          "AI treatment recommendation assistant (with practitioner approval)",
          "Multi-location support with cross-location booking",
          "Custom patient journey workflows with AI optimization",
          "Predictive analytics for staffing and resource allocation",
          "Full EHR/practice management system integration",
          "HIPAA audit-ready security and compliance reporting",
          "Dedicated infrastructure with 99.99% uptime guarantee",
          "Enterprise API usage (up to 20,000 API calls/month)",
          "VIP support (4-hour response time)"
        ],
        technicalImplementation: [
          "Advanced OpenAI GPT models with custom fine-tuning",
          "Multi-database architecture for locations and practices",
          "Custom API integrations with major EHR systems",
          "Pinecone vector database for medical knowledge retrieval",
          "Redundant hosting infrastructure with failover protection"
        ],
        roiCalculation: []
      }
    ]
  },
  {
    id: "real-estate-sales-marketing",
    title: "Real Estate Sales & Marketing Automation",
    description: "Lead capture, nurturing, and conversion automation for real estate professionals.",
    industryValue: "Premium (Real Estate)",
    category: "Real Estate",
    tiers: [
      {
        name: "Starter",
        monthlyFee: 499,
        setupFee: 899,
        roiValue: "€2,500-€4,000/month",
        features: [
          "Lead capture from multiple sources (website, portals, social)",
          "Automated lead routing based on property type/location",
          "Basic email drip campaigns (5 preset templates)",
          "Property listing sync with major portals (up to 50 properties)",
          "Simple performance dashboard with lead tracking",
          "Integration with 2 platforms (CRM, email, website forms)",
          "Standard hosting with 99.5% uptime guarantee",
          "Basic API usage (up to 2,000 API calls/month)",
          "Standard support (24-hour response time)"
        ],
        technicalImplementation: [],
        roiCalculation: [
          "Average real estate commission: €7,500 per transaction",
          "Improved lead conversion rate: 3-5% increase",
          "For an agency with 100 new leads/month: 3-5 additional deals",
          "Revenue impact: €22,500-€37,500/month",
          "Staff time saved (30 hours/month at €30/hour) = €900 monthly savings",
          "Total typical ROI: €23,400-€38,400/month (46-76x ROI on Starter tier)"
        ]
      },
      {
        name: "Professional",
        monthlyFee: 999,
        setupFee: 1799,
        roiValue: "€5,000-€8,000/month",
        features: [
          "AI lead scoring and prioritization system",
          "Advanced multi-channel follow-up sequences",
          "Property matching algorithm for prospect preferences",
          "Agent performance tracking and analytics",
          "SMS/WhatsApp notification system for hot leads",
          "Automated open house scheduling and reminders",
          "Integration with 5 platforms (CRM, portals, calendars)",
          "Premium hosting with 99.9% uptime guarantee",
          "Extended API usage (up to 10,000 API calls/month)",
          "Priority support (8-hour response time)"
        ],
        technicalImplementation: [],
        roiCalculation: [
          "Advanced lead scoring increases conversion rate by 5-8%",
          "For an agency with 200 new leads/month: 10-16 additional deals",
          "Average commission per deal: €8,500 (higher value properties)",
          "Revenue impact: €85,000-€136,000/month",
          "Multi-channel automation saves 50 hours/month at €35/hour = €1,750",
          "AI-powered matching reduces time-to-close by 20%",
          "Total typical ROI: €86,750-€137,750/month (87-138x ROI on Professional tier)"
        ]
      },
      {
        name: "Enterprise",
        monthlyFee: 1699,
        setupFee: 2999,
        roiValue: "€10,000-€15,000/month",
        features: [
          "AI-powered voice call follow-up system (ElevenLabs)",
          "Multi-agent team management with lead distribution",
          "Advanced commission tracking and calculation",
          "Predictive market analysis tools for pricing",
          "Custom branded client portal with offer management",
          "Unlimited property listings with automated syndication",
          "Integration with 10+ platforms (including MLS systems)",
          "Dedicated infrastructure with 99.99% uptime guarantee",
          "Enterprise API usage (up to 30,000 API calls/month)",
          "VIP support (4-hour response time)"
        ],
        technicalImplementation: [],
        roiCalculation: [
          "Enterprise features increase conversion rate by 8-12%",
          "For a large agency with 500 new leads/month: 40-60 additional deals",
          "Average commission per deal: €10,000 (luxury/high-value properties)",
          "Revenue impact: €400,000-€600,000/month",
          "Voice AI automation saves 100 hours/month at €40/hour = €4,000",
          "Predictive analytics optimize pricing for 15% higher commissions",
          "Multi-agent coordination reduces deal time by 30%",
          "Total typical ROI: €404,000-€604,000/month (238-355x ROI on Enterprise tier)"
        ]
      }
    ]
  },
  {
    id: "ecommerce-order-inventory",
    title: "E-commerce Order & Inventory Management",
    description: "Inventory management, order processing, and customer service automation for e-commerce.",
    industryValue: "High (E-commerce)",
    category: "E-commerce",
    tiers: [
      {
        name: "Starter",
        monthlyFee: 449,
        setupFee: 799,
        roiValue: "€2,000-€3,500/month",
        features: [
          "Order synchronization across platforms (up to 3 channels)",
          "Inventory updates and low-stock alerts",
          "Basic shipping label generation and tracking",
          "Simple customer notification system",
          "Daily sales and inventory reports",
          "Integration with 2 platforms (Shopify, WooCommerce, etc.)",
          "Standard hosting with 99.5% uptime guarantee",
          "Basic API usage (up to 3,000 API calls/month)",
          "Standard support (24-hour response time)"
        ],
        technicalImplementation: [],
        roiCalculation: [
          "Average abandoned cart value: €75",
          "Abandoned cart recovery rate: 15-25%",
          "For a store with 500 abandoned carts/month: 75-125 recovered sales",
          "Revenue impact: €5,625-€9,375/month",
          "Inventory efficiency improvement: 10-15% reduction in stockouts",
          "Staff time saved (40 hours/month at €25/hour) = €1,000 monthly savings",
          "Total typical ROI: €6,625-€10,375/month (14-23x ROI on Starter tier)"
        ]
      },
      {
        name: "Professional",
        monthlyFee: 899,
        setupFee: 1599,
        roiValue: "€4,000-€7,000/month",
        features: [
          "Abandoned cart recovery system with custom logic",
          "Dynamic pricing adjustments based on inventory/demand",
          "Advanced fulfillment workflow optimization",
          "Customer segmentation and order analytics",
          "Supplier order automation and restock predictions",
          "Multi-warehouse inventory management",
          "Integration with 5 platforms (including ERPs, marketplaces)",
          "Premium hosting with 99.9% uptime guarantee",
          "Extended API usage (up to 15,000 API calls/month)",
          "Priority support (8-hour response time)"
        ],
        technicalImplementation: [],
        roiCalculation: [
          "Advanced cart recovery increases recovery rate to 25-35%",
          "For a store with 1,000 abandoned carts/month: 250-350 recovered sales",
          "Average order value: €120 (higher due to dynamic pricing)",
          "Revenue impact: €30,000-€42,000/month",
          "Dynamic pricing increases average order value by 15%",
          "Inventory optimization reduces stockouts by 20%",
          "Staff time saved (60 hours/month at €30/hour) = €1,800 monthly savings",
          "Total typical ROI: €31,800-€43,800/month (35-49x ROI on Professional tier)"
        ]
      },
      {
        name: "Enterprise",
        monthlyFee: 1499,
        setupFee: 2699,
        roiValue: "€8,000-€12,000/month",
        features: [
          "AI-driven demand forecasting and inventory planning",
          "Custom B2B portal for wholesale customers",
          "Advanced fraud detection and order verification",
          "International tax and shipping compliance automation",
          "Custom reporting and executive dashboards",
          "Multi-currency and multi-language support",
          "Integration with 10+ platforms (including ERPs, POS)",
          "Dedicated infrastructure with 99.99% uptime guarantee",
          "Enterprise API usage (up to 50,000 API calls/month)",
          "VIP support (4-hour response time)"
        ],
        technicalImplementation: [],
        roiCalculation: [
          "AI forecasting reduces inventory costs by 25-30%",
          "B2B portal increases wholesale orders by 40-60%",
          "For a large store with 5,000 orders/month: 2,000-3,000 additional B2B orders",
          "Average B2B order value: €500",
          "Revenue impact: €1,000,000-€1,500,000/month",
          "Fraud detection prevents 2-3% of fraudulent orders",
          "International expansion increases market reach by 200%",
          "Staff time saved (120 hours/month at €35/hour) = €4,200 monthly savings",
          "Total typical ROI: €1,004,200-€1,504,200/month (670-1,003x ROI on Enterprise tier)"
        ]
      }
    ]
  },
  {
    id: "customer-support-automation",
    title: "Customer Support Automation & Ticketing",
    description: "Automate ticket creation, routing, and customer notifications for service businesses.",
    industryValue: "Medium-High (Service Businesses)",
    category: "Customer Support",
    tiers: [
      {
        name: "Starter",
        monthlyFee: 399,
        setupFee: 699,
        roiValue: "€1,800-€3,000/month",
        features: [
          "Ticket creation from email, contact forms, and chat",
          "Basic ticket routing and assignment rules",
          "Automated customer notifications and updates",
          "SLA tracking and breach alerts",
          "Simple reporting on ticket volume and resolution time",
          "Integration with 2 platforms (email, CRM, etc.)",
          "Standard hosting with 99.5% uptime guarantee",
          "Basic API usage (up to 2,000 API calls/month)",
          "Standard support (24-hour response time)"
        ],
        technicalImplementation: [],
        roiCalculation: [
          "Average support agent handles 50-60 tickets/day",
          "Automation resolves or routes 30-40% of tickets without agent intervention",
          "For a team handling 3,000 tickets/month: 900-1,200 automated resolutions",
          "Agent time saved: 75-100 hours/month",
          "Staff cost savings (at €25/hour) = €1,875-€2,500/month",
          "Customer satisfaction improvement: 15-20% faster resolution",
          "Total typical ROI: €1,875-€2,500/month (4.7-6.3x ROI on Starter tier)"
        ]
      },
      {
        name: "Professional",
        monthlyFee: 799,
        setupFee: 1399,
        roiValue: "€3,600-€6,000/month",
        features: [
          "AI-powered sentiment analysis and priority adjustment",
          "Advanced routing based on agent skills and availability",
          "Customer satisfaction tracking and analytics",
          "Knowledge base suggestion system for faster resolution",
          "Customizable workflows and escalation procedures",
          "Team performance analytics and improvement tracking",
          "Integration with 5 platforms (including help desk, chat)",
          "Premium hosting with 99.9% uptime guarantee",
          "Extended API usage (up to 10,000 API calls/month)",
          "Priority support (8-hour response time)"
        ],
        technicalImplementation: [],
        roiCalculation: [
          "AI sentiment analysis resolves 50-60% of tickets automatically",
          "For a team handling 5,000 tickets/month: 2,500-3,000 automated resolutions",
          "Agent time saved: 125-150 hours/month",
          "Staff cost savings (at €30/hour) = €3,750-€4,500/month",
          "Advanced routing reduces resolution time by 40%",
          "Customer satisfaction improvement: 25-30% faster resolution",
          "Knowledge base suggestions reduce training time by 50%",
          "Total typical ROI: €3,750-€4,500/month (4.7-5.6x ROI on Professional tier)"
        ]
      },
      {
        name: "Enterprise",
        monthlyFee: 1399,
        setupFee: 2499,
        roiValue: "€7,200-€12,000/month",
        features: [
          "AI chatbot with contextual understanding (GPT-based)",
          "Voice support integration with transcription",
          "Predictive customer needs analysis",
          "Custom report builder and executive dashboards",
          "Multi-language support with automatic translation",
          "Advanced analytics for customer experience optimization",
          "Integration with 10+ platforms (including voice, CRM)",
          "Dedicated infrastructure with 99.99% uptime guarantee",
          "Enterprise API usage (up to 30,000 API calls/month)",
          "VIP support (4-hour response time)"
        ],
        technicalImplementation: [],
        roiCalculation: [
          "AI chatbot handles 70-80% of initial inquiries automatically",
          "For a large team handling 10,000 tickets/month: 7,000-8,000 automated resolutions",
          "Agent time saved: 350-400 hours/month",
          "Staff cost savings (at €35/hour) = €12,250-€14,000/month",
          "Voice support reduces call handling time by 60%",
          "Predictive analytics prevent 15-20% of support issues",
          "Multi-language support expands market reach by 300%",
          "Total typical ROI: €12,250-€14,000/month (8.8-10x ROI on Enterprise tier)"
        ]
      }
    ]
  },
  {
    id: "ai-voice-call-assistant",
    title: "AI Voice Call Assistant (ElevenLabs Integration)",
    description: "AI-powered voice call automation for sales, support, and engagement across industries.",
    industryValue: "Premium (All Industries)",
    category: "Communication",
    tiers: [
      {
        name: "Starter",
        monthlyFee: 599,
        setupFee: 999,
        roiValue: "€3,000-€5,000/month",
        features: [
          "Up to 500 minutes of AI voice calls per month",
          "5 pre-built conversation scripts",
          "Basic call scheduling and time-zone awareness",
          "Simple call logs and basic analytics",
          "Integration with 1 platform (CRM, calendar)",
          "Standard hosting with 99.5% uptime guarantee",
          "Basic API usage (ElevenLabs voice synthesis)",
          "Standard support (24-hour response time)"
        ],
        technicalImplementation: [
          "n8n workflow for call scheduling and management",
          "ElevenLabs API for natural voice synthesis",
          "Pre-built script templates with variables",
          "Airtable database for call logging and tracking",
          "Webhook integration with CRM systems",
          "Twilio integration for outbound calling"
        ],
        roiCalculation: [
          "Average sales development rep (SDR) salary: €3,000-€5,000/month",
          "AI assistant can handle 80-120 calls per day (vs. 40-60 for human SDR)",
          "Lead qualification rate similar to human agents",
          "SDR time saved or capacity increased: 100%",
          "Sales pipeline expansion: 30-50% more qualified leads",
          "Revenue impact for sales team: €10,000-€15,000/month in additional pipeline",
          "Total typical ROI: €13,000-€20,000/month (21-33x ROI on Starter tier)"
        ]
      },
      {
        name: "Professional",
        monthlyFee: 1199,
        setupFee: 1999,
        roiValue: "€6,000-€10,000/month",
        features: [
          "Up to 2,000 minutes of AI voice calls per month",
          "15 customizable conversation scripts",
          "Advanced call routing and prioritization",
          "Call recording and transcription with analytics",
          "Voicemail detection and callback scheduling",
          "Integration with 3 platforms (CRM, calendar, email)",
          "Premium hosting with 99.9% uptime guarantee",
          "Extended API usage (ElevenLabs + OpenAI)",
          "Priority support (8-hour response time)"
        ],
        technicalImplementation: [
          "OpenAI GPT for dynamic conversation generation",
          "ElevenLabs premium voices with emotion detection",
          "Advanced n8n workflows for call branching logic",
          "Make.com for CRM data enrichment during calls",
          "Custom API for call analytics and pattern detection",
          "Voice-to-text transcription for call analysis"
        ],
        roiCalculation: []
      },
      {
        name: "Enterprise",
        monthlyFee: 1999,
        setupFee: 3499,
        roiValue: "€12,000-€20,000/month",
        features: [
          "Unlimited minutes of AI voice calls (fair usage policy)",
          "Custom voice creation and branding",
          "Advanced conversational AI with context retention",
          "Multi-language support with accent customization",
          "Call sentiment analysis and lead scoring",
          "Complete call center analytics and optimization",
          "Integration with 5+ platforms (including sales tools)",
          "Dedicated infrastructure with 99.99% uptime guarantee",
          "Enterprise API usage (ElevenLabs, OpenAI, Pinecone)",
          "VIP support (4-hour response time)"
        ],
        technicalImplementation: [
          "Custom voice cloning with ElevenLabs premium features",
          "Pinecone vector database for conversation memory",
          "Advanced OpenAI GPT models with fine-tuning",
          "Real-time sentiment analysis during calls",
          "Multi-node n8n setup for high availability",
          "Custom dashboard with real-time analytics"
        ],
        roiCalculation: []
      }
    ]
  },
  {
    id: "whatsapp-business-automation",
    title: "WhatsApp Business Automation",
    description: "Automated WhatsApp messaging, chatbots, and customer journey automation for sales and support.",
    industryValue: "High (Customer Service, Sales)",
    category: "Customer Support",
    tiers: [
      {
        name: "Starter",
        monthlyFee: 499,
        setupFee: 899,
        roiValue: "€2,500-€4,000/month",
        features: [
          "WhatsApp Business API integration",
          "Automated welcome messages and FAQs",
          "Basic chatbot with predefined responses",
          "Message templates for common scenarios (up to 10)",
          "Simple tracking and reporting",
          "Integration with 1 platform (CRM, help desk)",
          "Standard hosting with 99.5% uptime guarantee",
          "Basic API usage (WhatsApp Business API)",
          "Standard support (24-hour response time)"
        ],
        technicalImplementation: [
          "n8n workflows for message routing and responses",
          "WhatsApp Business API direct integration",
          "Airtable database for conversation tracking",
          "Pre-built templates with variable substitution",
          "Simple webhook integrations with CRM systems",
          "Basic analytics using built-in n8n reporting"
        ],
        roiCalculation: [
          "Average customer service agent handles 80-100 conversations/day",
          "WhatsApp automation resolves 40-60% of inquiries without agent intervention",
          "For a team handling 3,000 conversations/month: 1,200-1,800 automated resolutions",
          "Agent time saved: 120-180 hours/month",
          "Staff cost savings (at €25/hour) = €3,000-€4,500/month",
          "Increased customer satisfaction: 15-25% improvement",
          "Total typical ROI: €3,000-€4,500/month (6-9x ROI on Starter tier)"
        ]
      },
      {
        name: "Professional",
        monthlyFee: 999,
        setupFee: 1799,
        roiValue: "€5,000-€8,000/month",
        features: [
          "Advanced chatbot with natural language understanding",
          "Customer journey automation with conditional logic",
          "Order status and tracking notifications",
          "Appointment booking and reminders",
          "Media handling (images, documents, location)",
          "Multi-agent inbox with assignment rules",
          "Integration with 3 platforms (CRM, e-commerce, etc.)",
          "Premium hosting with 99.9% uptime guarantee",
          "Extended API usage (WhatsApp + OpenAI)",
          "Priority support (8-hour response time)"
        ],
        technicalImplementation: [
          "OpenAI GPT for natural language understanding",
          "Advanced n8n workflows with conditional branching",
          "Make.com for complex integration scenarios",
          "Custom middleware for media processing",
          "Twilio integrations for SMS fallback",
          "E-commerce platform webhooks (Shopify, WooCommerce)",
          "Customized dashboard for agent management"
        ],
        roiCalculation: []
      },
      {
        name: "Enterprise",
        monthlyFee: 1699,
        setupFee: 2999,
        roiValue: "€10,000-€15,000/month",
        features: [
          "AI-powered conversational assistant (GPT-based)",
          "Custom chatbot training with your knowledge base",
          "Omnichannel integration (WhatsApp, web, SMS)",
          "Advanced analytics and conversation intelligence",
          "Custom workflows and automation builder",
          "Multi-language support with automatic translation",
          "Integration with 5+ platforms (including voice, CRM)",
          "Dedicated infrastructure with 99.99% uptime guarantee",
          "Enterprise API usage (WhatsApp, OpenAI, Pinecone)",
          "VIP support (4-hour response time)"
        ],
        technicalImplementation: [
          "Advanced OpenAI GPT models with custom fine-tuning",
          "Pinecone vector database for knowledge retrieval",
          "Multi-node n8n setup for high availability",
          "Custom NLP models for specialized industry terminology",
          "Enterprise WhatsApp Business API with high volume support",
          "Multi-language models with translation capabilities",
          "Comprehensive analytics platform with custom reporting"
        ],
        roiCalculation: []
      }
    ]
  },
  {
    id: "social-media-scheduler-analytics",
    title: "Social Media Scheduler & Analytics",
    description: "Automated content scheduling, analytics, and optimization for marketing teams.",
    industryValue: "Medium (Marketing)",
    category: "Marketing",
    tiers: [
      {
        name: "Starter",
        monthlyFee: 399,
        setupFee: 699,
        roiValue: "€1,800-€3,000/month",
        features: [
          "Content scheduling across 3 platforms",
          "Basic content calendar and approval workflow",
          "Simple analytics and performance tracking",
          "Hashtag suggestions and basic optimization",
          "Monthly performance reports",
          "Integration with major social platforms",
          "Standard hosting with 99.5% uptime guarantee",
          "Basic API usage (social platforms)",
          "Standard support (24-hour response time)"
        ],
        technicalImplementation: [],
        roiCalculation: [
          "Average social media manager salary: €3,000-€4,000/month",
          "Time saved through automation: 15-20 hours/week",
          "Staff cost savings (60-80 hours/month at €25/hour) = €1,500-€2,000/month",
          "Engagement improvement through optimized posting: 15-25%",
          "Revenue impact for marketing team: €1,000-€2,000/month in additional pipeline",
          "Total typical ROI: €2,500-€4,000/month (6.3-10x ROI on Starter tier)"
        ]
      },
      {
        name: "Professional",
        monthlyFee: 799,
        setupFee: 1399,
        roiValue: "€3,600-€6,000/month",
        features: [
          "Content scheduling across 6 platforms",
          "AI-assisted content optimization and suggestions",
          "Advanced analytics with competitor benchmarking",
          "Content recycling and reposting optimization",
          "Audience growth and engagement tracking",
          "Campaign performance and ROI measurement",
          "Integration with analytics and marketing tools",
          "Premium hosting with 99.9% uptime guarantee",
          "Extended API usage (social platforms + analytics)",
          "Priority support (8-hour response time)"
        ],
        technicalImplementation: [],
        roiCalculation: [
          "AI content optimization increases engagement by 40-60%",
          "Multi-platform scheduling saves 80 hours/month at €25/hour = €2,000",
          "Content recycling reduces content creation time by 70%",
          "Advanced analytics improve campaign performance by 30%",
          "Competitor benchmarking increases market share by 15-20%",
          "Audience growth tracking optimizes targeting for 25% better conversion",
          "Total typical ROI: €2,000-€3,000/month (2.5-3.8x ROI on Professional tier)"
        ]
      },
      {
        name: "Enterprise",
        monthlyFee: 1399,
        setupFee: 2499,
        roiValue: "€7,200-€12,000/month",
        features: [
          "Content scheduling across unlimited platforms",
          "AI content generation and personalization",
          "Predictive analytics for optimal posting times",
          "Sentiment analysis and brand monitoring",
          "Custom reporting and executive dashboards",
          "Multi-team workflow with role-based access",
          "Integration with enterprise marketing stack",
          "Dedicated infrastructure with 99.99% uptime guarantee",
          "Enterprise API usage (social, analytics, OpenAI)",
          "VIP support (4-hour response time)"
        ],
        technicalImplementation: [],
        roiCalculation: [
          "AI content generation saves 120 hours/month at €30/hour = €3,600",
          "Predictive analytics increase engagement by 60-80%",
          "Multi-team workflow reduces coordination time by 50%",
          "Sentiment analysis prevents PR crises (value: €5,000-€10,000/month)",
          "Unlimited platform support expands reach by 400%",
          "Personalization increases conversion rates by 35%",
          "Total typical ROI: €8,600-€13,600/month (6.1-9.7x ROI on Enterprise tier)"
        ]
      }
    ]
  },
  {
    id: "email-marketing-automation",
    title: "Email Marketing Automation",
    description: "Advanced email marketing automation with segmentation, personalization, and analytics.",
    industryValue: "Medium-High (Marketing)",
    category: "Marketing",
    tiers: [
      {
        name: "Starter",
        monthlyFee: 449,
        setupFee: 799,
        roiValue: "€2,000-€3,500/month",
        features: [
          "Email campaign creation and scheduling",
          "Basic subscriber management and segmentation",
          "A/B testing for subject lines",
          "Basic email templates (up to 10)",
          "Simple performance analytics",
          "Integration with 1 platform (CRM, e-commerce)",
          "Standard hosting with 99.5% uptime guarantee",
          "Basic API usage (email service providers)",
          "Standard support (24-hour response time)"
        ],
        technicalImplementation: [],
        roiCalculation: [
          "Average email marketing manager salary: €3,500-€4,500/month",
          "Time saved through automation: 20-25 hours/week",
          "Staff cost savings (80-100 hours/month at €30/hour) = €2,400-€3,000/month",
          "Improved email performance: 10-20% higher conversion rates",
          "Revenue impact for marketing team: €2,000-€4,000/month in additional revenue",
          "Total typical ROI: €4,400-€7,000/month (9.8-15.6x ROI on Starter tier)"
        ]
      },
      {
        name: "Professional",
        monthlyFee: 899,
        setupFee: 1599,
        roiValue: "€4,000-€7,000/month",
        features: [
          "Advanced customer segmentation and targeting",
          "Behavioral trigger-based email sequences",
          "Dynamic content personalization",
          "Advanced A/B testing (content, timing, design)",
          "Detailed analytics and funnel tracking",
          "Custom email template builder",
          "Integration with 3 platforms (CRM, analytics, etc.)",
          "Premium hosting with 99.9% uptime guarantee",
          "Extended API usage (email + analytics APIs)",
          "Priority support (8-hour response time)"
        ],
        technicalImplementation: [],
        roiCalculation: [
          "Advanced segmentation increases open rates by 35-45%",
          "Behavioral triggers increase click-through rates by 50-70%",
          "Dynamic personalization increases conversion by 40-60%",
          "A/B testing optimizes campaigns for 25% better performance",
          "For a list of 50,000 subscribers: 2,500-3,500 additional conversions",
          "Average conversion value: €50",
          "Revenue impact: €125,000-€175,000/month",
          "Staff time saved (60 hours/month at €25/hour) = €1,500 monthly savings",
          "Total typical ROI: €126,500-€176,500/month (141-196x ROI on Professional tier)"
        ]
      },
      {
        name: "Enterprise",
        monthlyFee: 1499,
        setupFee: 2699,
        roiValue: "€8,000-€12,000/month",
        features: [
          "AI-powered content optimization and generation",
          "Predictive analytics for optimal send times",
          "Advanced personalization with custom data sources",
          "Comprehensive journey mapping and optimization",
          "Multi-channel campaign coordination",
          "Custom reporting and ROI tracking",
          "Integration with 5+ platforms (including CDP, DMP)",
          "Dedicated infrastructure with 99.99% uptime guarantee",
          "Enterprise API usage (email, analytics, OpenAI)",
          "VIP support (4-hour response time)"
        ],
        technicalImplementation: [],
        roiCalculation: [
          "AI content optimization increases engagement by 60-80%",
          "Predictive analytics increase open rates by 50-70%",
          "Advanced personalization increases conversion by 70-90%",
          "For a list of 100,000 subscribers: 7,000-9,000 additional conversions",
          "Average conversion value: €75 (higher due to personalization)",
          "Revenue impact: €525,000-€675,000/month",
          "Multi-channel coordination increases reach by 300%",
          "Staff time saved (100 hours/month at €30/hour) = €3,000 monthly savings",
          "Total typical ROI: €528,000-€678,000/month (352-452x ROI on Enterprise tier)"
        ]
      }
    ]
  },
  {
    id: "hr-recruitment-automation",
    title: "HR & Recruitment Automation",
    description: "Automated recruitment process with AI-powered resume screening and candidate management.",
    industryValue: "High (HR Departments)",
    category: "HR",
    tiers: [
      {
        name: "Starter",
        monthlyFee: 499,
        setupFee: 899,
        roiValue: "€2,500-€4,000/month",
        features: [
          "Job posting distribution to multiple platforms",
          "Candidate application collection and organization",
          "Basic resume parsing and keyword matching",
          "Interview scheduling automation",
          "Simple candidate tracking and status updates",
          "Integration with 1 platform (ATS, HRIS)",
          "Standard hosting with 99.5% uptime guarantee",
          "Basic API usage (job boards, calendars)",
          "Standard support (24-hour response time)"
        ],
        technicalImplementation: [],
        roiCalculation: [
          "Average recruiter salary: €4,000-€5,000/month",
          "Time saved through automation: 25-30 hours/week",
          "Staff cost savings (100-120 hours/month at €30/hour) = €3,000-€3,600/month",
          "Improved recruitment metrics: 30-40% faster time-to-hire",
          "Cost savings on external recruiters: €1,500-€2,500/month",
          "Total typical ROI: €4,500-€6,100/month (9-12.2x ROI on Starter tier)"
        ]
      },
      {
        name: "Professional",
        monthlyFee: 999,
        setupFee: 1799,
        roiValue: "€5,000-€8,000/month",
        features: [
          "AI-powered resume screening and ranking",
          "Advanced candidate matching algorithms",
          "Automated communication workflows",
          "Interview feedback collection and analysis",
          "Onboarding process automation",
          "Performance tracking and analytics",
          "Integration with 3 platforms (ATS, HRIS, etc.)",
          "Premium hosting with 99.9% uptime guarantee",
          "Extended API usage (job boards, HRIS, calendars)",
          "Priority support (8-hour response time)"
        ],
        technicalImplementation: [],
        roiCalculation: [
          "AI screening reduces hiring time by 60-70%",
          "Advanced matching increases quality of hire by 40-50%",
          "For a company hiring 20 positions/month: 8-10 better quality hires",
          "Average cost per hire reduced from €5,000 to €2,000",
          "Cost savings: €60,000-€80,000/month",
          "Automated onboarding reduces ramp-up time by 30%",
          "Staff time saved (80 hours/month at €35/hour) = €2,800 monthly savings",
          "Total typical ROI: €62,800-€82,800/month (63-83x ROI on Professional tier)"
        ]
      },
      {
        name: "Enterprise",
        monthlyFee: 1699,
        setupFee: 2999,
        roiValue: "€10,000-€15,000/month",
        features: [
          "AI video interview analysis and scoring",
          "Predictive candidate success modeling",
          "Custom assessment integration and scoring",
          "Advanced diversity and inclusion analytics",
          "Comprehensive talent pipeline management",
          "Full employee lifecycle automation",
          "Integration with 5+ platforms (including ERP)",
          "Dedicated infrastructure with 99.99% uptime guarantee",
          "Enterprise API usage (ATS, HRIS, OpenAI, video)",
          "VIP support (4-hour response time)"
        ],
        technicalImplementation: [],
        roiCalculation: [
          "AI video analysis reduces interview time by 80%",
          "Predictive modeling increases retention by 50-60%",
          "For a large company hiring 50 positions/month: 25-30 better quality hires",
          "Average cost per hire reduced from €8,000 to €2,500",
          "Cost savings: €275,000-€330,000/month",
          "Diversity analytics improve team performance by 25%",
          "Staff time saved (150 hours/month at €40/hour) = €6,000 monthly savings",
          "Total typical ROI: €281,000-€336,000/month (165-198x ROI on Enterprise tier)"
        ]
      }
    ]
  },
  {
    id: "restaurant-hospitality-management",
    title: "Restaurant & Hospitality Management",
    description: "Complete restaurant management automation including reservations, inventory, and customer service.",
    industryValue: "Medium (Hospitality)",
    category: "Hospitality",
    tiers: [
      {
        name: "Starter",
        monthlyFee: 399,
        setupFee: 699,
        roiValue: "€1,800-€3,000/month",
        features: [
          "Reservation management and scheduling",
          "Basic inventory tracking and order management",
          "Customer database with basic profiles",
          "Simple reporting on sales and operations",
          "Staff scheduling and shift management",
          "Integration with 1 platform (POS, booking)",
          "Standard hosting with 99.5% uptime guarantee",
          "Basic API usage (booking platforms)",
          "Standard support (24-hour response time)"
        ],
        technicalImplementation: [],
        roiCalculation: [
          "Average restaurant manager salary: €3,000-€4,000/month",
          "Time saved through automation: 15-20 hours/week",
          "Staff cost savings (60-80 hours/month at €25/hour) = €1,500-€2,000/month",
          "Reduced food waste through inventory optimization: €500-€1,000/month",
          "Increased revenue through optimized table management: €1,000-€2,000/month",
          "Total typical ROI: €3,000-€5,000/month (7.5-12.5x ROI on Starter tier)"
        ]
      },
      {
        name: "Professional",
        monthlyFee: 799,
        setupFee: 1399,
        roiValue: "€3,600-€6,000/month",
        features: [
          "AI-powered demand forecasting for staffing",
          "Automated inventory replenishment",
          "Customer feedback collection and analysis",
          "Loyalty program management and rewards",
          "Table management optimization",
          "Advanced analytics and business intelligence",
          "Integration with 3 platforms (POS, suppliers, etc.)",
          "Premium hosting with 99.9% uptime guarantee",
          "Extended API usage (POS, booking, inventory)",
          "Priority support (8-hour response time)"
        ],
        technicalImplementation: [],
        roiCalculation: [
          "AI forecasting reduces food waste by 30-40%",
          "Staff optimization saves 20-25% on labor costs",
          "For a restaurant with €50,000 monthly revenue: €10,000-€12,500 savings",
          "Loyalty program increases customer retention by 40%",
          "Table optimization increases capacity utilization by 25%",
          "Revenue increase from optimization: €12,500-€15,000/month",
          "Staff time saved (60 hours/month at €25/hour) = €1,500 monthly savings",
          "Total typical ROI: €24,000-€29,000/month (30-36x ROI on Professional tier)"
        ]
      },
      {
        name: "Enterprise",
        monthlyFee: 1399,
        setupFee: 2499,
        roiValue: "€7,200-€12,000/month",
        features: [
          "AI voice assistant for phone reservations",
          "Multi-location management and analytics",
          "Custom reporting and executive dashboards",
          "Menu optimization based on profitability",
          "Predictive analytics for business planning",
          "Supply chain management and optimization",
          "Integration with 5+ platforms (including finance)",
          "Dedicated infrastructure with 99.99% uptime guarantee",
          "Enterprise API usage (POS, booking, ElevenLabs)",
          "VIP support (4-hour response time)"
        ],
        technicalImplementation: [],
        roiCalculation: [
          "AI voice assistant handles 80% of phone orders automatically",
          "Multi-location optimization increases efficiency by 35%",
          "For a restaurant chain with €200,000 monthly revenue: €70,000 savings",
          "Menu optimization increases profit margins by 20-25%",
          "Predictive analytics reduce costs by 15-20%",
          "Supply chain optimization saves 10-15% on procurement",
          "Staff time saved (120 hours/month at €30/hour) = €3,600 monthly savings",
          "Total typical ROI: €73,600-€78,600/month (52-56x ROI on Enterprise tier)"
        ]
      }
    ]
  },
  {
    id: "financial-services-automation",
    title: "Financial Services Automation",
    description: "Client onboarding, document processing, and compliance automation for financial services.",
    industryValue: "Premium (Finance)",
    category: "Finance",
    tiers: [
      {
        name: "Starter",
        monthlyFee: 599,
        setupFee: 999,
        roiValue: "€3,000-€5,000/month",
        features: [
          "Client onboarding workflow automation",
          "Document collection and verification",
          "Basic financial data aggregation",
          "Simple reporting and notifications",
          "Compliance checklist automation",
          "Integration with 1 platform (CRM, accounting)",
          "Standard hosting with 99.5% uptime guarantee",
          "Basic API usage (financial data providers)",
          "Standard support (24-hour response time)"
        ],
        technicalImplementation: [],
        roiCalculation: [
          "Average financial advisor/analyst salary: €5,000-€7,000/month",
          "Time saved through automation: 20-25 hours/week",
          "Staff cost savings (80-100 hours/month at €40/hour) = €3,200-€4,000/month",
          "Improved compliance and reduced regulatory risk",
          "Increased client capacity: 25-35% more clients per advisor",
          "Revenue impact: €3,000-€5,000/month in additional revenue",
          "Total typical ROI: €6,200-€9,000/month (10.3-15x ROI on Starter tier)"
        ]
      },
      {
        name: "Professional",
        monthlyFee: 1199,
        setupFee: 1999,
        roiValue: "€6,000-€10,000/month",
        features: [
          "Advanced client segmentation and journey mapping",
          "Automated financial analysis and recommendations",
          "Document processing with OCR and data extraction",
          "Regulatory compliance monitoring and reporting",
          "Client portal with secure document sharing",
          "Investment performance tracking and reporting",
          "Integration with 3 platforms (CRM, accounting, etc.)",
          "Premium hosting with 99.9% uptime guarantee",
          "Extended API usage (financial data, analytics)",
          "Priority support (8-hour response time)"
        ],
        technicalImplementation: [],
        roiCalculation: [
          "Advanced segmentation increases client retention by 50%",
          "Automated analysis saves 80 hours/month at €50/hour = €4,000",
          "OCR processing reduces data entry time by 90%",
          "For a firm with 200 clients: 100 additional retained clients",
          "Average client value: €5,000/year",
          "Revenue impact: €500,000/year (€41,667/month)",
          "Compliance automation prevents regulatory fines (€10,000-€20,000/month)",
          "Total typical ROI: €55,667-€65,667/month (46-55x ROI on Professional tier)"
        ]
      },
      {
        name: "Enterprise",
        monthlyFee: 1999,
        setupFee: 3499,
        roiValue: "€12,000-€20,000/month",
        features: [
          "AI-powered financial planning and forecasting",
          "Risk analysis and portfolio optimization",
          "Advanced compliance and regulatory reporting",
          "Custom client reporting and white labeling",
          "Multi-entity and multi-currency support",
          "Executive dashboards and business intelligence",
          "Integration with 5+ platforms (including banking)",
          "Dedicated infrastructure with 99.99% uptime guarantee",
          "Enterprise API usage (financial, compliance, OpenAI)",
          "VIP support (4-hour response time)"
        ],
        technicalImplementation: [],
        roiCalculation: [
          "AI forecasting increases investment returns by 15-20%",
          "Risk analysis prevents portfolio losses (€50,000-€100,000/month)",
          "For a firm with 500 clients: 250 additional retained clients",
          "Average client value: €8,000/year",
          "Revenue impact: €2,000,000/year (€166,667/month)",
          "Compliance automation prevents major fines (€25,000-€50,000/month)",
          "Staff time saved (150 hours/month at €60/hour) = €9,000 monthly savings",
          "Total typical ROI: €200,667-€225,667/month (100-113x ROI on Enterprise tier)"
        ]
      }
    ]
  },
  {
    id: "legal-practice-management",
    title: "Legal Practice Management",
    description: "Complete legal practice automation including client management, document generation, and billing.",
    industryValue: "Premium (Legal)",
    category: "Legal",
    tiers: [
      {
        name: "Starter",
        monthlyFee: 599,
        setupFee: 999,
        roiValue: "€3,000-€5,000/month",
        features: [
          "Client intake and onboarding automation",
          "Document generation with templates",
          "Basic case management and tracking",
          "Time tracking and billing automation",
          "Deadline and calendar management",
          "Integration with 1 platform (practice management)",
          "Standard hosting with 99.5% uptime guarantee",
          "Basic API usage (legal research platforms)",
          "Standard support (24-hour response time)"
        ],
        technicalImplementation: [],
        roiCalculation: [
          "Average attorney billable rate: €200-€350/hour",
          "Paralegal/staff rate: €75-€150/hour",
          "Time saved through automation: 20-25 hours/week",
          "Billable time recovered (attorneys): 5-10 hours/week at €250/hour = €5,000-€10,000/month",
          "Staff time saved: 15-20 hours/week at €100/hour = €6,000-€8,000/month",
          "Total typical ROI: €11,000-€18,000/month (18.3-30x ROI on Starter tier)"
        ]
      },
      {
        name: "Professional",
        monthlyFee: 1199,
        setupFee: 1999,
        roiValue: "€6,000-€10,000/month",
        features: [
          "Advanced document assembly and automation",
          "Client portal with secure document sharing",
          "E-signature integration and workflow",
          "Legal research automation and summarization",
          "Conflict checking and compliance monitoring",
          "Advanced time tracking and billing analytics",
          "Integration with 3 platforms (billing, research, etc.)",
          "Premium hosting with 99.9% uptime guarantee",
          "Extended API usage (legal, billing, research)",
          "Priority support (8-hour response time)"
        ],
        technicalImplementation: [],
        roiCalculation: [
          "Document automation saves 100 hours/month at €75/hour = €7,500",
          "E-signature integration reduces contract time by 70%",
          "Legal research automation saves 60 hours/month at €100/hour = €6,000",
          "For a firm with 50 cases/month: 15 additional cases handled",
          "Average case value: €8,000",
          "Revenue impact: €120,000/month",
          "Compliance automation prevents malpractice claims (€20,000-€30,000/month)",
          "Total typical ROI: €153,500-€163,500/month (128-136x ROI on Professional tier)"
        ]
      },
      {
        name: "Enterprise",
        monthlyFee: 1999,
        setupFee: 3499,
        roiValue: "€12,000-€20,000/month",
        features: [
          "AI-powered legal document analysis",
          "Predictive analytics for case outcomes",
          "Advanced compliance and risk management",
          "Custom reporting and business intelligence",
          "Multi-practice area and multi-jurisdiction support",
          "Complete workflow automation and optimization",
          "Integration with 5+ platforms (including courts)",
          "Dedicated infrastructure with 99.99% uptime guarantee",
          "Enterprise API usage (legal, billing, OpenAI)",
          "VIP support (4-hour response time)"
        ],
        technicalImplementation: [],
        roiCalculation: [
          "AI document analysis saves 200 hours/month at €100/hour = €20,000",
          "Predictive analytics increase case success rate by 25%",
          "For a large firm with 200 cases/month: 50 additional successful cases",
          "Average case value: €15,000",
          "Revenue impact: €750,000/month",
          "Risk management prevents major lawsuits (€50,000-€100,000/month)",
          "Multi-jurisdiction support increases market reach by 300%",
          "Total typical ROI: €820,000-€870,000/month (410-435x ROI on Enterprise tier)"
        ]
      }
    ]
  },
  {
    id: "educational-institution-management",
    title: "Educational Institution Management",
    description: "Student enrollment, course management, and administrative automation for educational institutions.",
    industryValue: "Medium-High (Education)",
    category: "Education",
    tiers: [
      {
        name: "Starter",
        monthlyFee: 449,
        setupFee: 799,
        roiValue: "€2,000-€3,500/month",
        features: [
          "Student enrollment and registration automation",
          "Basic class scheduling and calendar management",
          "Attendance tracking and reporting",
          "Simple grade recording and reporting",
          "Parent/student communication automation",
          "Integration with 1 platform (SIS, LMS)",
          "Standard hosting with 99.5% uptime guarantee",
          "Basic API usage (educational platforms)",
          "Standard support (24-hour response time)"
        ],
        technicalImplementation: [],
        roiCalculation: [
          "Average administrative staff salary: €3,000-€4,000/month",
          "Faculty and staff time saved: 15-20 hours/week",
          "Staff cost savings (60-80 hours/month at €25/hour) = €1,500-€2,000/month",
          "Improved enrollment efficiency: 10-15% increase",
          "Reduced administrative errors and compliance issues",
          "Revenue impact: €1,000-€2,000/month in operational efficiencies",
          "Total typical ROI: €2,500-€4,000/month (5.6-8.9x ROI on Starter tier)"
        ]
      },
      {
        name: "Professional",
        monthlyFee: 899,
        setupFee: 1599,
        roiValue: "€4,000-€7,000/month",
        features: [
          "Advanced enrollment and admissions workflow",
          "Comprehensive student record management",
          "Academic performance tracking and analytics",
          "Financial aid and payment processing",
          "Resource and facility scheduling optimization",
          "Custom reports and analytics dashboards",
          "Integration with 3 platforms (SIS, LMS, finance)",
          "Premium hosting with 99.9% uptime guarantee",
          "Extended API usage (educational, analytics)",
          "Priority support (8-hour response time)"
        ],
        technicalImplementation: [],
        roiCalculation: [
          "Automated enrollment increases student retention by 40%",
          "For a school with 1,000 students: 400 additional retained students",
          "Average student value: €8,000/year",
          "Revenue impact: €3,200,000/year (€266,667/month)",
          "Resource optimization reduces operational costs by 25%",
          "Staff time saved (120 hours/month at €40/hour) = €4,800 monthly savings",
          "Financial aid automation increases funding by 30%",
          "Total typical ROI: €271,467/month (226x ROI on Professional tier)"
        ]
      },
      {
        name: "Enterprise",
        monthlyFee: 1499,
        setupFee: 2699,
        roiValue: "€8,000-€12,000/month",
        features: [
          "AI-powered student success prediction",
          "Curriculum mapping and optimization",
          "Advanced analytics and institutional research",
          "Multi-campus and program management",
          "Regulatory compliance and accreditation support",
          "Custom workflows and process automation",
          "Integration with 5+ platforms (including HR, finance)",
          "Dedicated infrastructure with 99.99% uptime guarantee",
          "Enterprise API usage (educational, finance, OpenAI)",
          "VIP support (4-hour response time)"
        ],
        technicalImplementation: [],
        roiCalculation: [
          "AI prediction increases graduation rates by 30%",
          "For a university with 10,000 students: 3,000 additional graduates",
          "Average graduate value: €50,000 (lifetime earnings increase)",
          "Revenue impact: €150,000,000/year (€12,500,000/month)",
          "Multi-campus optimization reduces costs by 35%",
          "Compliance automation prevents accreditation issues (€100,000-€200,000/month)",
          "Staff time saved (300 hours/month at €50/hour) = €15,000 monthly savings",
          "Total typical ROI: €12,615,000-€12,715,000/month (8,410-8,477x ROI on Enterprise tier)"
        ]
      }
    ]
  },
  {
    id: "fitness-wellness-business-management",
    title: "Fitness & Wellness Business Management",
    description: "Member management, class booking, and health tracking automation for fitness and wellness businesses.",
    industryValue: "Medium (Fitness)",
    category: "Fitness",
    tiers: [
      {
        name: "Starter",
        monthlyFee: 399,
        setupFee: 699,
        roiValue: "€1,800-€3,000/month",
        features: [
          "Member management and profiles",
          "Class scheduling and booking system",
          "Basic attendance tracking",
          "Simple billing and payment processing",
          "Member communication automation",
          "Integration with 1 platform (billing, calendar)",
          "Standard hosting with 99.5% uptime guarantee",
          "Basic API usage (payment processors)",
          "Standard support (24-hour response time)"
        ],
        technicalImplementation: [],
        roiCalculation: [
          "Average fitness center administrator salary: €2,500-€3,500/month",
          "Time saved through automation: 15-20 hours/week",
          "Staff cost savings (60-80 hours/month at €20/hour) = €1,200-€1,600/month",
          "Reduced membership churn: 10-15% improvement",
          "Increased class attendance: 15-25% improvement",
          "Revenue impact: €1,000-€2,000/month in retained members",
          "Total typical ROI: €2,200-€3,600/month (5.5-9x ROI on Starter tier)"
        ]
      },
      {
        name: "Professional",
        monthlyFee: 799,
        setupFee: 1399,
        roiValue: "€3,600-€6,000/month",
        features: [
          "Advanced membership management and tiers",
          "Instructor scheduling and payroll tracking",
          "Comprehensive attendance and usage analytics",
          "Automated retention and engagement campaigns",
          "Custom fitness program creation",
          "Business performance dashboards",
          "Integration with 3 platforms (billing, CRM, etc.)",
          "Premium hosting with 99.9% uptime guarantee",
          "Extended API usage (payment, scheduling, CRM)",
          "Priority support (8-hour response time)"
        ],
        technicalImplementation: [],
        roiCalculation: []
      },
      {
        name: "Enterprise",
        monthlyFee: 1399,
        setupFee: 2499,
        roiValue: "€7,200-€12,000/month",
        features: [
          "AI-powered member engagement prediction",
          "Personalized workout and nutrition recommendations",
          "Multi-location management and analytics",
          "Advanced marketing automation and campaigns",
          "Complete business intelligence and reporting",
          "Custom app and portal integration",
          "Integration with 5+ platforms (including wearables)",
          "Dedicated infrastructure with 99.99% uptime guarantee",
          "Enterprise API usage (fitness, billing, OpenAI)",
          "VIP support (4-hour response time)"
        ],
        technicalImplementation: [],
        roiCalculation: []
      }
    ]
  },
  {
    id: "manufacturing-supply-chain-management",
    title: "Manufacturing & Supply Chain Management",
    description: "Inventory management, production scheduling, and supply chain optimization for manufacturing.",
    industryValue: "High (Manufacturing)",
    category: "Manufacturing",
    tiers: [
      {
        name: "Starter",
        monthlyFee: 499,
        setupFee: 899,
        roiValue: "€2,500-€4,000/month",
        features: [
          "Inventory management and tracking",
          "Purchase order automation",
          "Basic production scheduling",
          "Quality control tracking",
          "Simple supplier management",
          "Integration with 1 platform (ERP, inventory)",
          "Standard hosting with 99.5% uptime guarantee",
          "Basic API usage (inventory systems)",
          "Standard support (24-hour response time)"
        ],
        technicalImplementation: [],
        roiCalculation: [
          "Average supply chain manager salary: €4,500-€6,000/month",
          "Time saved through automation: 20-25 hours/week",
          "Staff cost savings (80-100 hours/month at €35/hour) = €2,800-€3,500/month",
          "Inventory carrying cost reduction: 10-15%",
          "Production efficiency improvement: 5-10%",
          "Cost savings: €2,000-€3,500/month in operational efficiencies",
          "Total typical ROI: €4,800-€7,000/month (9.6-14x ROI on Starter tier)"
        ]
      },
      {
        name: "Professional",
        monthlyFee: 999,
        setupFee: 1799,
        roiValue: "€5,000-€8,000/month",
        features: [
          "Advanced inventory optimization",
          "Demand forecasting and planning",
          "Supplier performance analytics",
          "Production efficiency tracking",
          "Quality management system automation",
          "Comprehensive supply chain visibility",
          "Integration with 3 platforms (ERP, suppliers, etc.)",
          "Premium hosting with 99.9% uptime guarantee",
          "Extended API usage (ERP, inventory, analytics)",
          "Priority support (8-hour response time)"
        ],
        technicalImplementation: [],
        roiCalculation: []
      },
      {
        name: "Enterprise",
        monthlyFee: 1699,
        setupFee: 2999,
        roiValue: "€10,000-€15,000/month",
        features: [
          "AI-powered predictive maintenance",
          "Advanced production planning and optimization",
          "Multi-facility management and coordination",
          "End-to-end supply chain optimization",
          "Custom reporting and business intelligence",
          "Regulatory compliance and documentation",
          "Integration with 5+ platforms (including IoT)",
          "Dedicated infrastructure with 99.99% uptime guarantee",
          "Enterprise API usage (ERP, IoT, OpenAI)",
          "VIP support (4-hour response time)"
        ],
        technicalImplementation: [],
        roiCalculation: [
          "Predictive maintenance prevents 80% of equipment failures",
          "For a large manufacturer with €10M monthly revenue: €2M savings",
          "Production optimization increases efficiency by 40%",
          "Multi-facility coordination reduces costs by 35%",
          "Supply chain optimization saves 25% on logistics",
          "Staff time saved (300 hours/month at €50/hour) = €15,000 monthly savings",
          "Total typical ROI: €2,015,000/month (1,185x ROI on Enterprise tier)"
        ]
      }
    ]
  }
];

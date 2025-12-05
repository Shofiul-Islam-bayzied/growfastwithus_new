import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/SEOHead";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { BookingButton } from "@/components/BookingWidget";
import {
  Zap,
  Stethoscope,
  Home,
  ShoppingCart,
  MessageSquare,
  Headphones,
  Mail,
  Users,
  Briefcase,
  GraduationCap,
  Dumbbell,
  Factory,
  Scale,
  Building2,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Shield,
  Clock,
  Rocket,
  Star,
  ChevronDown,
  ChevronUp,
  Package,
  Layers,
  Settings,
  Target,
  BarChart3,
  Globe,
  Award
} from "lucide-react";

type PackageTier = {
  name: string;
  monthlyFee: number;
  setupFee: number;
  roi: string;
  features: string[];
  apiLimit: string;
};

type IndustryTemplate = {
  id: string;
  title: string;
  description: string;
  icon: any;
  industry: string;
  tiers: PackageTier[];
  techStack: string[];
};

type BundlePackage = {
  id: string;
  name: string;
  description: string;
  templatesIncluded: string;
  monthlyFee: number;
  setupFee: number;
  apiBuffer: string;
  features: string[];
  exampleCombos: string[];
  roi: string;
};

type CustomSolution = {
  id: string;
  name: string;
  description: string;
  workflowsIncluded: string;
  monthlyFee: number;
  setupFee: number;
  apiBuffer: string;
  features: string[];
  exampleUseCases: string[];
};

export default function Packages() {
  const [activeTab, setActiveTab] = useState<"templates" | "bundles" | "custom">("templates");
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);
  const [showStickyCTA, setShowStickyCTA] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyCTA(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const industryTemplates: IndustryTemplate[] = [
    {
      id: "medical",
      title: "AI Medical Practice Automation",
      description: "Reduce no-shows, streamline patient scheduling, and automate follow-ups with AI-powered healthcare automation.",
      icon: Stethoscope,
      industry: "Healthcare",
      tiers: [
        {
          name: "Starter",
          monthlyFee: 1299,
          setupFee: 999,
          roi: "€3,000–€5,000/month",
          apiLimit: "1,000 calls/month",
          features: [
            "Appointment booking with SMS/email reminders",
            "Automated rescheduling if cancellation detected",
            "Monthly no-show reporting",
            "Integration with 1 calendar (Google/Outlook)"
          ]
        },
        {
          name: "Professional",
          monthlyFee: 2199,
          setupFee: 1499,
          roi: "€6,000–€10,000/month",
          apiLimit: "5,000 calls/month",
          features: [
            "AI patient follow-up with natural conversation",
            "Intelligent triage of requests",
            "Document collection & verification (OCR)",
            "3-platform integration (EHR, CRM, calendar)"
          ]
        },
        {
          name: "Enterprise",
          monthlyFee: 3999,
          setupFee: 2499,
          roi: "€12,000–€20,000/month",
          apiLimit: "20,000 calls/month",
          features: [
            "AI treatment suggestion assistant",
            "Multi-location booking sync",
            "Predictive staffing analytics",
            "Full EHR integration"
          ]
        }
      ],
      techStack: ["n8n", "Twilio/WhatsApp", "Airtable", "Google Vision API", "FHIR API", "GPT-4"]
    },
    {
      id: "real-estate",
      title: "Real Estate Sales & Marketing Automation",
      description: "Automate lead intake, scoring, property matching, and follow-ups to maximize conversions.",
      icon: Home,
      industry: "Real Estate",
      tiers: [
        {
          name: "Starter",
          monthlyFee: 1299,
          setupFee: 999,
          roi: "€3,000–€5,000/month",
          apiLimit: "1,000 calls/month",
          features: [
            "Lead capture from web forms, portals, social",
            "Auto-routing to agents by property type",
            "5 preset drip email templates",
            "Sync up to 50 listings to portals"
          ]
        },
        {
          name: "Professional",
          monthlyFee: 2199,
          setupFee: 1499,
          roi: "€6,000–€10,000/month",
          apiLimit: "5,000 calls/month",
          features: [
            "AI lead scoring",
            "Property preference matching",
            "Agent analytics dashboard",
            "SMS/WhatsApp alerts for hot leads"
          ]
        },
        {
          name: "Enterprise",
          monthlyFee: 3999,
          setupFee: 2499,
          roi: "€12,000–€20,000/month",
          apiLimit: "20,000 calls/month",
          features: [
            "AI voice call follow-ups",
            "Predictive market pricing analysis",
            "Custom client portal for offers",
            "Unlimited listings with syndication"
          ]
        }
      ],
      techStack: ["n8n", "HubSpot/Zoho", "GPT-4", "ElevenLabs", "Chart.js"]
    },
    {
      id: "ecommerce",
      title: "E-commerce Order & Inventory Management",
      description: "Centralize order management, optimize inventory, and increase conversions across all channels.",
      icon: ShoppingCart,
      industry: "E-commerce",
      tiers: [
        {
          name: "Starter",
          monthlyFee: 1299,
          setupFee: 999,
          roi: "€3,000–€5,000/month",
          apiLimit: "1,000 calls/month",
          features: [
            "Order sync across Shopify, WooCommerce, Amazon (3 channels max)",
            "Low-stock alerts",
            "Shipping label auto-generation"
          ]
        },
        {
          name: "Professional",
          monthlyFee: 2199,
          setupFee: 1499,
          roi: "€6,000–€10,000/month",
          apiLimit: "5,000 calls/month",
          features: [
            "Abandoned cart recovery flows",
            "Dynamic price adjustment",
            "Supplier order automation"
          ]
        },
        {
          name: "Enterprise",
          monthlyFee: 3999,
          setupFee: 2499,
          roi: "€12,000–€20,000/month",
          apiLimit: "20,000 calls/month",
          features: [
            "AI demand forecasting",
            "B2B wholesale portal",
            "Multi-currency/tax compliance automation"
          ]
        }
      ],
      techStack: ["n8n", "Shopify/WooCommerce APIs", "Twilio/WhatsApp", "OpenAI", "Odoo/SAP"]
    },
    {
      id: "support",
      title: "Customer Support Automation & Ticketing",
      description: "Automate ticket creation, routing, and resolution to cut response times and improve satisfaction.",
      icon: MessageSquare,
      industry: "Customer Service",
      tiers: [
        {
          name: "Starter",
          monthlyFee: 1299,
          setupFee: 999,
          roi: "€3,000–€5,000/month",
          apiLimit: "1,000 calls/month",
          features: [
            "Create tickets from email, forms, chat",
            "Auto-routing by category",
            "SLA tracking"
          ]
        },
        {
          name: "Professional",
          monthlyFee: 2199,
          setupFee: 1499,
          roi: "€6,000–€10,000/month",
          apiLimit: "5,000 calls/month",
          features: [
            "AI sentiment detection & priority routing",
            "Knowledge base suggestion engine",
            "Agent performance analytics"
          ]
        },
        {
          name: "Enterprise",
          monthlyFee: 3999,
          setupFee: 2499,
          roi: "€12,000–€20,000/month",
          apiLimit: "20,000 calls/month",
          features: [
            "GPT-powered AI chatbot",
            "Voice support with transcription",
            "Predictive customer needs"
          ]
        }
      ],
      techStack: ["n8n", "Zendesk/Freshdesk API", "GPT-4", "AssemblyAI/Deepgram"]
    },
    {
      id: "voice",
      title: "AI Voice Call Assistant",
      description: "Replace or enhance SDR calls with AI-driven conversations that qualify leads 24/7.",
      icon: Headphones,
      industry: "Sales & Marketing",
      tiers: [
        {
          name: "Starter",
          monthlyFee: 1299,
          setupFee: 999,
          roi: "€3,000–€5,000/month",
          apiLimit: "500 minutes/month",
          features: [
            "500 minutes/month outbound calls",
            "5 pre-set scripts",
            "Call scheduling & timezone awareness"
          ]
        },
        {
          name: "Professional",
          monthlyFee: 2199,
          setupFee: 1499,
          roi: "€6,000–€10,000/month",
          apiLimit: "2,000 minutes/month",
          features: [
            "2,000 minutes/month",
            "15 custom scripts",
            "Call routing & voicemail detection"
          ]
        },
        {
          name: "Enterprise",
          monthlyFee: 3999,
          setupFee: 2499,
          roi: "€12,000–€20,000/month",
          apiLimit: "Unlimited (fair use)",
          features: [
            "Unlimited minutes (fair use)",
            "Custom voice cloning",
            "Sentiment & lead scoring during calls"
          ]
        }
      ],
      techStack: ["n8n", "ElevenLabs", "Twilio", "GPT-4"]
    },
    {
      id: "whatsapp",
      title: "WhatsApp Business Automation",
      description: "Provide 24/7 WhatsApp-based customer service, order updates, and lead follow-up.",
      icon: MessageSquare,
      industry: "Communication",
      tiers: [
        {
          name: "Starter",
          monthlyFee: 1299,
          setupFee: 999,
          roi: "€3,000–€5,000/month",
          apiLimit: "1,000 messages/month",
          features: [
            "Automated welcome messages & FAQs",
            "10 template messages"
          ]
        },
        {
          name: "Professional",
          monthlyFee: 2199,
          setupFee: 1499,
          roi: "€6,000–€10,000/month",
          apiLimit: "5,000 messages/month",
          features: [
            "NLU-powered chatbot",
            "Appointment booking",
            "Order tracking"
          ]
        },
        {
          name: "Enterprise",
          monthlyFee: 3999,
          setupFee: 2499,
          roi: "€12,000–€20,000/month",
          apiLimit: "20,000 messages/month",
          features: [
            "GPT-trained assistant with knowledge base",
            "Multi-channel sync (web, SMS)"
          ]
        }
      ],
      techStack: ["WhatsApp Business API", "Meta Cloud API", "GPT-4", "Airtable"]
    },
    {
      id: "social",
      title: "Social Media Scheduler & Analytics",
      description: "Centralize scheduling & analytics for multiple platforms with AI optimization.",
      icon: Globe,
      industry: "Marketing",
      tiers: [
        {
          name: "Starter",
          monthlyFee: 1299,
          setupFee: 999,
          roi: "€3,000–€5,000/month",
          apiLimit: "1,000 posts/month",
          features: [
            "Schedule to 3 platforms",
            "Content calendar"
          ]
        },
        {
          name: "Professional",
          monthlyFee: 2199,
          setupFee: 1499,
          roi: "€6,000–€10,000/month",
          apiLimit: "5,000 posts/month",
          features: [
            "6 platforms",
            "AI optimization of captions",
            "Competitor benchmarking"
          ]
        },
        {
          name: "Enterprise",
          monthlyFee: 3999,
          setupFee: 2499,
          roi: "€12,000–€20,000/month",
          apiLimit: "Unlimited",
          features: [
            "Unlimited platforms",
            "AI content generation",
            "Predictive posting analytics"
          ]
        }
      ],
      techStack: ["Buffer/Hootsuite API", "GPT-4", "Chart.js"]
    },
    {
      id: "email",
      title: "Email Marketing Automation",
      description: "Automate targeted email campaigns & improve conversions with AI-powered personalization.",
      icon: Mail,
      industry: "Marketing",
      tiers: [
        {
          name: "Starter",
          monthlyFee: 1299,
          setupFee: 999,
          roi: "€3,000–€5,000/month",
          apiLimit: "10,000 emails/month",
          features: [
            "Campaign creation & scheduling",
            "Basic segmentation"
          ]
        },
        {
          name: "Professional",
          monthlyFee: 2199,
          setupFee: 1499,
          roi: "€6,000–€10,000/month",
          apiLimit: "50,000 emails/month",
          features: [
            "Behavioral triggers",
            "Dynamic personalization"
          ]
        },
        {
          name: "Enterprise",
          monthlyFee: 3999,
          setupFee: 2499,
          roi: "€12,000–€20,000/month",
          apiLimit: "Unlimited",
          features: [
            "AI content optimization",
            "Predictive send time analytics"
          ]
        }
      ],
      techStack: ["n8n", "Mailchimp/ActiveCampaign API", "GPT-4", "OpenAI"]
    },
    {
      id: "hr",
      title: "HR & Recruitment Automation",
      description: "Streamline hiring pipelines from posting to onboarding with AI-powered screening.",
      icon: Users,
      industry: "Human Resources",
      tiers: [
        {
          name: "Starter",
          monthlyFee: 1299,
          setupFee: 999,
          roi: "€3,000–€5,000/month",
          apiLimit: "1,000 calls/month",
          features: [
            "Multi-platform job posting",
            "Basic resume parsing"
          ]
        },
        {
          name: "Professional",
          monthlyFee: 2199,
          setupFee: 1499,
          roi: "€6,000–€10,000/month",
          apiLimit: "5,000 calls/month",
          features: [
            "AI resume screening",
            "Automated candidate follow-ups"
          ]
        },
        {
          name: "Enterprise",
          monthlyFee: 3999,
          setupFee: 2499,
          roi: "€12,000–€20,000/month",
          apiLimit: "20,000 calls/month",
          features: [
            "AI video interview scoring",
            "Predictive candidate success analytics"
          ]
        }
      ],
      techStack: ["LinkedIn Jobs API", "OCR", "GPT-4"]
    },
    {
      id: "restaurant",
      title: "Restaurant & Hospitality Management",
      description: "Automate reservations, staffing, and inventory for restaurants and hotels.",
      icon: Briefcase,
      industry: "Hospitality",
      tiers: [
        {
          name: "Starter",
          monthlyFee: 1299,
          setupFee: 999,
          roi: "€3,000–€5,000/month",
          apiLimit: "1,000 calls/month",
          features: [
            "Reservation system sync",
            "Basic inventory tracking"
          ]
        },
        {
          name: "Professional",
          monthlyFee: 2199,
          setupFee: 1499,
          roi: "€6,000–€10,000/month",
          apiLimit: "5,000 calls/month",
          features: [
            "AI demand forecasting for staffing",
            "Loyalty program automation"
          ]
        },
        {
          name: "Enterprise",
          monthlyFee: 3999,
          setupFee: 2499,
          roi: "€12,000–€20,000/month",
          apiLimit: "20,000 calls/month",
          features: [
            "AI voice reservations",
            "Menu profitability optimization"
          ]
        }
      ],
      techStack: ["n8n", "OpenTable API", "Airtable", "ElevenLabs"]
    },
    {
      id: "finance",
      title: "Financial Services Automation",
      description: "Automate client onboarding, compliance, and reporting for financial advisors.",
      icon: BarChart3,
      industry: "Finance",
      tiers: [
        {
          name: "Starter",
          monthlyFee: 1299,
          setupFee: 999,
          roi: "€3,000–€5,000/month",
          apiLimit: "1,000 calls/month",
          features: [
            "Client onboarding automation",
            "Basic financial reporting"
          ]
        },
        {
          name: "Professional",
          monthlyFee: 2199,
          setupFee: 1499,
          roi: "€6,000–€10,000/month",
          apiLimit: "5,000 calls/month",
          features: [
            "Automated analysis & recommendations",
            "Compliance monitoring"
          ]
        },
        {
          name: "Enterprise",
          monthlyFee: 3999,
          setupFee: 2499,
          roi: "€12,000–€20,000/month",
          apiLimit: "20,000 calls/month",
          features: [
            "AI financial forecasting",
            "Risk analysis & portfolio optimization"
          ]
        }
      ],
      techStack: ["Plaid API", "GPT-4", "PostgreSQL"]
    },
    {
      id: "legal",
      title: "Legal Practice Management",
      description: "Automate case intake, document generation, and compliance tracking for law firms.",
      icon: Scale,
      industry: "Legal",
      tiers: [
        {
          name: "Starter",
          monthlyFee: 1299,
          setupFee: 999,
          roi: "€3,000–€5,000/month",
          apiLimit: "1,000 calls/month",
          features: [
            "Client intake automation",
            "Document templates"
          ]
        },
        {
          name: "Professional",
          monthlyFee: 2199,
          setupFee: 1499,
          roi: "€6,000–€10,000/month",
          apiLimit: "5,000 calls/month",
          features: [
            "Advanced document assembly",
            "Client portal with e-signature"
          ]
        },
        {
          name: "Enterprise",
          monthlyFee: 3999,
          setupFee: 2499,
          roi: "€12,000–€20,000/month",
          apiLimit: "20,000 calls/month",
          features: [
            "AI legal document analysis",
            "Case outcome prediction"
          ]
        }
      ],
      techStack: ["DocuSign API", "GPT-4", "Court case data APIs"]
    },
    {
      id: "education",
      title: "Educational Institution Management",
      description: "Manage student enrollment, classes, and communication with automated workflows.",
      icon: GraduationCap,
      industry: "Education",
      tiers: [
        {
          name: "Starter",
          monthlyFee: 1299,
          setupFee: 999,
          roi: "€3,000–€5,000/month",
          apiLimit: "1,000 calls/month",
          features: [
            "Enrollment automation",
            "Attendance tracking"
          ]
        },
        {
          name: "Professional",
          monthlyFee: 2199,
          setupFee: 1499,
          roi: "€6,000–€10,000/month",
          apiLimit: "5,000 calls/month",
          features: [
            "Performance tracking",
            "Financial aid automation"
          ]
        },
        {
          name: "Enterprise",
          monthlyFee: 3999,
          setupFee: 2499,
          roi: "€12,000–€20,000/month",
          apiLimit: "20,000 calls/month",
          features: [
            "AI student success prediction",
            "Multi-campus management"
          ]
        }
      ],
      techStack: ["Google Classroom API", "Airtable", "GPT-4"]
    },
    {
      id: "fitness",
      title: "Fitness & Wellness Business Management",
      description: "Automate membership management and engagement campaigns for gyms and studios.",
      icon: Dumbbell,
      industry: "Fitness",
      tiers: [
        {
          name: "Starter",
          monthlyFee: 1299,
          setupFee: 999,
          roi: "€3,000–€5,000/month",
          apiLimit: "1,000 calls/month",
          features: [
            "Member profiles",
            "Class scheduling"
          ]
        },
        {
          name: "Professional",
          monthlyFee: 2199,
          setupFee: 1499,
          roi: "€6,000–€10,000/month",
          apiLimit: "5,000 calls/month",
          features: [
            "Advanced engagement campaigns",
            "Usage analytics"
          ]
        },
        {
          name: "Enterprise",
          monthlyFee: 3999,
          setupFee: 2499,
          roi: "€12,000–€20,000/month",
          apiLimit: "20,000 calls/month",
          features: [
            "AI churn prediction",
            "Personalized workout plans"
          ]
        }
      ],
      techStack: ["Mindbody API", "GPT-4", "Twilio"]
    },
    {
      id: "manufacturing",
      title: "Manufacturing & Supply Chain Management",
      description: "Automate inventory, supplier coordination, and production planning.",
      icon: Factory,
      industry: "Manufacturing",
      tiers: [
        {
          name: "Starter",
          monthlyFee: 1299,
          setupFee: 999,
          roi: "€3,000–€5,000/month",
          apiLimit: "1,000 calls/month",
          features: [
            "Inventory tracking",
            "Purchase order automation"
          ]
        },
        {
          name: "Professional",
          monthlyFee: 2199,
          setupFee: 1499,
          roi: "€6,000–€10,000/month",
          apiLimit: "5,000 calls/month",
          features: [
            "Demand forecasting",
            "Supplier performance tracking"
          ]
        },
        {
          name: "Enterprise",
          monthlyFee: 3999,
          setupFee: 2499,
          roi: "€12,000–€20,000/month",
          apiLimit: "20,000 calls/month",
          features: [
            "AI predictive maintenance",
            "End-to-end supply chain optimization"
          ]
        }
      ],
      techStack: ["ERP API (Odoo, SAP)", "IoT sensor data", "GPT-4"]
    }
  ];

  const bundlePackages: BundlePackage[] = [
    {
      id: "starter",
      name: "Starter Pack",
      description: "Best for early-stage businesses that want a fast start with essential automation.",
      templatesIncluded: "Any 2 Ready-to-Go Templates",
      monthlyFee: 699,
      setupFee: 1199,
      apiBuffer: "€100/month API buffer",
      features: [
        "Choice of any two templates from our Ready-to-Go library",
        "Priority onboarding (5–10 business days)",
        "Weekly health checks + monthly performance report"
      ],
      exampleCombos: [
        "Real Estate Sales Automation + WhatsApp Business Automation",
        "Medical Practice Automation + AI Voice Call Assistant"
      ],
      roi: "15–25 hrs/week saved + 10–15% uplift in lead conversion → €2K–€4K/month in impact"
    },
    {
      id: "growth",
      name: "Growth Pack",
      description: "Best for businesses looking to scale automation across marketing, sales, and operations.",
      templatesIncluded: "Any 3–4 Templates",
      monthlyFee: 1299,
      setupFee: 2199,
      apiBuffer: "€250/month API buffer",
      features: [
        "Choice of any three or four templates",
        "Priority support (8-hour response SLA)",
        "Monthly optimization call with automation specialist"
      ],
      exampleCombos: [
        "E-commerce Order Management + Cart Recovery + Customer Support + Social Media Scheduler",
        "Financial Services Automation + Email Marketing + AI Voice Assistant + WhatsApp Automation"
      ],
      roi: "25–40% productivity gain + €4K–€10K/month revenue or savings impact"
    },
    {
      id: "power",
      name: "Power Pack",
      description: "Best for enterprises or high-growth companies needing full department automation.",
      templatesIncluded: "Any 5–6 Templates",
      monthlyFee: 1899,
      setupFee: 3299,
      apiBuffer: "€500/month API buffer",
      features: [
        "Choice of any five or six templates",
        "24/7 priority support with dedicated account manager",
        "Quarterly strategy & ROI review"
      ],
      exampleCombos: [
        "Full E-commerce Suite: Order Management + Cart Recovery + Customer Support + Social Media Scheduler + Email Marketing + AI Voice Sales Calls",
        "Enterprise Services Suite: CRM + Client Portal + AI Voice Assistant + Billing Automation + Reporting Dashboards + WhatsApp AI"
      ],
      roi: "100–200 hrs/month capacity created → Equivalent to 2–4 full-time employees saved"
    }
  ];

  const customSolutions: CustomSolution[] = [
    {
      id: "basic",
      name: "Custom Basic",
      description: "Best for businesses that need multiple workflows, but not full enterprise-scale automation.",
      workflowsIncluded: "Up to 5 Custom Workflows",
      monthlyFee: 2499,
      setupFee: 4499,
      apiBuffer: "€250/month API buffer",
      features: [
        "Up to five fully custom workflows",
        "Integrations with up to five systems/platforms",
        "Quarterly optimization & upgrade cycle",
        "Business-hours support (Mon–Fri)"
      ],
      exampleUseCases: [
        "Custom CRM with sales forecasting, email sequences, and lead scoring",
        "Industry-specific compliance automation"
      ]
    },
    {
      id: "plus",
      name: "Custom Plus",
      description: "Best for mid-to-large enterprises wanting automation across multiple departments.",
      workflowsIncluded: "Up to 10 Custom Workflows",
      monthlyFee: 4499,
      setupFee: 8499,
      apiBuffer: "€500/month API buffer",
      features: [
        "Up to ten fully custom workflows",
        "Integrations with enterprise systems (ERP, CRM, HRIS, EHR)",
        "Monthly strategy call with automation consultant",
        "Priority support (8-hour SLA)"
      ],
      exampleUseCases: [
        "Full sales + marketing + operations automation suite",
        "Advanced analytics dashboards with multi-source data"
      ]
    },
    {
      id: "pro",
      name: "Custom Pro",
      description: "Best for large-scale enterprises requiring mission-critical automation.",
      workflowsIncluded: "Unlimited Workflows",
      monthlyFee: 7999,
      setupFee: 14999,
      apiBuffer: "€1,000/month API buffer",
      features: [
        "Unlimited workflows with enterprise-grade scalability",
        "Dedicated account manager & 24/7 support",
        "Real-time monitoring & automated incident response",
        "On-premise or private cloud deployment options"
      ],
      exampleUseCases: [
        "Multi-country automation for retail operations",
        "AI-driven decision-making pipelines with voice, chat, and analytics"
      ]
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      <SEOHead
        title="Automation Packages & Pricing - GrowFastWithUs"
        description="Choose from 15+ industry-specific automation templates, bundle packages, or fully custom solutions. Transparent pricing with proven ROI. Deploy in 3-45 days."
        keywords="automation packages, automation pricing, business automation templates, custom automation solutions, automation bundles, automation pricing plans, business automation cost"
        canonical="https://growfastwithus.com/packages"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Product",
          "name": "Business Automation Packages",
          "description": "Industry-specific automation templates and custom solutions",
          "brand": {
            "@type": "Organization",
            "name": "GrowFastWithUs"
          },
          "offers": {
            "@type": "AggregateOffer",
            "availability": "https://schema.org/InStock",
            "priceCurrency": "EUR"
          }
        }}
      />

      <PageHeader />

      {/* Sticky Mobile CTA */}
      <AnimatePresence>
        {showStickyCTA && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 left-4 right-4 z-50 lg:hidden"
          >
            <BookingButton
              className="w-full backdrop-blur-xl bg-primary/20 hover:bg-primary/30 border border-primary/40 text-white shadow-2xl py-6 text-base font-semibold rounded-full transition-all"
              calLink="grow-fast-with-us/30min"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Get Started Now
            </BookingButton>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="pt-20 sm:pt-24 lg:pt-28 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto mb-8 sm:mb-12"
          >
            <Badge className="mb-4 sm:mb-6 bg-primary/20 text-primary border-primary/30 px-4 py-2">
              <Package className="w-4 h-4 mr-2" />
              Complete Automation Solutions
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Choose Your Automation Package
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-6 sm:mb-8">
              From ready-to-deploy templates to fully custom enterprise solutions. Every package includes hosting, monitoring, API management, and ongoing support.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm sm:text-base text-gray-400">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary mr-2" />
                <span>15+ Industry Templates</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary mr-2" />
                <span>3-45 Day Deployment</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary mr-2" />
                <span>Proven ROI Guarantee</span>
              </div>
            </div>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12"
          >
            <Button
              variant={activeTab === "templates" ? "default" : "outline"}
              onClick={() => setActiveTab("templates")}
              className="rounded-full px-6 py-3"
            >
              <Package className="w-4 h-4 mr-2" />
              Templates
            </Button>
            <Button
              variant={activeTab === "bundles" ? "default" : "outline"}
              onClick={() => setActiveTab("bundles")}
              className="rounded-full px-6 py-3"
            >
              <Layers className="w-4 h-4 mr-2" />
              Bundles
            </Button>
            <Button
              variant={activeTab === "custom" ? "default" : "outline"}
              onClick={() => setActiveTab("custom")}
              className="rounded-full px-6 py-3"
            >
              <Settings className="w-4 h-4 mr-2" />
              Custom Solutions
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Templates Tab */}
      <AnimatePresence mode="wait">
        {activeTab === "templates" && (
          <motion.section
            key="templates"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6"
          >
            <div className="container mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                {industryTemplates.map((template, index) => {
                  const isExpanded = expandedTemplate === template.id;
                  return (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.05 }}
                    >
                      <Card className="h-full glass-card border-gray-800 hover:border-primary/50 transition-all duration-300 group">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                                <template.icon className="w-6 h-6 text-primary" />
                              </div>
                              <div className="flex-1">
                                <Badge variant="outline" className="mb-2 text-xs border-gray-700 text-gray-400">
                                  {template.industry}
                                </Badge>
                                <h3 className="text-xl sm:text-2xl font-bold mb-2">{template.title}</h3>
                                <p className="text-sm text-gray-400 mb-4">{template.description}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => setExpandedTemplate(isExpanded ? null : template.id)}
                              className="lg:hidden flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-primary" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-primary" />
                              )}
                            </button>
                          </div>

                          <div className={`${isExpanded ? 'block' : 'hidden'} lg:block space-y-4`}>
                            <div className="space-y-3">
                              {template.tiers.map((tier, tierIndex) => (
                                <div
                                  key={tierIndex}
                                  className="p-4 rounded-lg bg-gray-900/50 border border-gray-800"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-sm">{tier.name}</span>
                                    <Badge className="bg-primary/20 text-primary text-xs">
                                      {tier.roi}
                                    </Badge>
                                  </div>
                                  <div className="flex items-baseline gap-2 mb-3">
                                    <span className="text-2xl font-bold">{formatPrice(tier.monthlyFee)}</span>
                                    <span className="text-sm text-gray-400">/mo</span>
                                  </div>
                                  <div className="text-xs text-gray-500 mb-3">
                                    Setup: {formatPrice(tier.setupFee)} • {tier.apiLimit}
                                  </div>
                                  <ul className="space-y-1.5 mb-3">
                                    {tier.features.slice(0, 2).map((feature, i) => (
                                      <li key={i} className="flex items-start text-xs text-gray-400">
                                        <CheckCircle className="w-3 h-3 text-primary mr-2 mt-0.5 flex-shrink-0" />
                                        <span>{feature}</span>
                                      </li>
                                    ))}
                                  </ul>
                                  <BookingButton
                                    size="sm"
                                    className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30"
                                    calLink="grow-fast-with-us/30min"
                                  >
                                    Get Started
                                  </BookingButton>
                                </div>
                              ))}
                            </div>

                            <div className="pt-4 border-t border-gray-800">
                              <p className="text-xs text-gray-500 mb-2">Tech Stack:</p>
                              <div className="flex flex-wrap gap-1.5">
                                {template.techStack.slice(0, 4).map((tech, i) => (
                                  <Badge key={i} variant="outline" className="text-[10px] border-gray-700 text-gray-500">
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.section>
        )}

        {/* Bundles Tab */}
        {activeTab === "bundles" && (
          <motion.section
            key="bundles"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6"
          >
            <div className="container mx-auto max-w-5xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                {bundlePackages.map((bundle, index) => (
                  <motion.div
                    key={bundle.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className={`h-full glass-card border-2 transition-all duration-300 ${
                      bundle.id === "growth" 
                        ? "border-primary/50 scale-105 lg:scale-110" 
                        : "border-gray-800 hover:border-primary/30"
                    }`}>
                      <CardContent className="p-6">
                        {bundle.id === "growth" && (
                          <Badge className="mb-4 bg-primary text-white w-full justify-center">
                            <Star className="w-3 h-3 mr-1" />
                            Most Popular
                          </Badge>
                        )}
                        <h3 className="text-xl sm:text-2xl font-bold mb-2">{bundle.name}</h3>
                        <p className="text-sm text-gray-400 mb-6">{bundle.description}</p>
                        
                        <div className="mb-6">
                          <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-3xl font-bold">{formatPrice(bundle.monthlyFee)}</span>
                            <span className="text-gray-400">/mo</span>
                          </div>
                          <div className="text-sm text-gray-500 mb-4">
                            Setup: {formatPrice(bundle.setupFee)}
                          </div>
                          <Badge className="bg-primary/20 text-primary text-xs mb-4">
                            {bundle.roi}
                          </Badge>
                        </div>

                        <div className="mb-6">
                          <h4 className="font-semibold text-sm mb-3">Includes:</h4>
                          <ul className="space-y-2 mb-4">
                            {bundle.features.map((feature, i) => (
                              <li key={i} className="flex items-start text-sm text-gray-300">
                                <CheckCircle className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="text-xs text-gray-500 mb-2">
                            <strong>{bundle.templatesIncluded}</strong>
                          </div>
                          <div className="text-xs text-gray-500 mb-4">
                            {bundle.apiBuffer}
                          </div>
                        </div>

                        <div className="mb-6 pt-4 border-t border-gray-800">
                          <h4 className="font-semibold text-sm mb-2">Example Combos:</h4>
                          <ul className="space-y-1.5">
                            {bundle.exampleCombos.map((combo, i) => (
                              <li key={i} className="text-xs text-gray-400 flex items-start">
                                <ArrowRight className="w-3 h-3 text-primary mr-2 mt-0.5 flex-shrink-0" />
                                <span>{combo}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <BookingButton
                          size="lg"
                          className={`w-full ${
                            bundle.id === "growth"
                              ? "bg-primary hover:bg-primary/90 text-white"
                              : "bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30"
                          }`}
                          calLink="grow-fast-with-us/30min"
                        >
                          Get Started
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </BookingButton>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Custom Solutions Tab */}
        {activeTab === "custom" && (
          <motion.section
            key="custom"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6"
          >
            <div className="container mx-auto max-w-5xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                {customSolutions.map((solution, index) => (
                  <motion.div
                    key={solution.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className={`h-full glass-card border-2 transition-all duration-300 ${
                      solution.id === "plus" 
                        ? "border-primary/50 scale-105 lg:scale-110" 
                        : "border-gray-800 hover:border-primary/30"
                    }`}>
                      <CardContent className="p-6">
                        {solution.id === "plus" && (
                          <Badge className="mb-4 bg-primary text-white w-full justify-center">
                            <Award className="w-3 h-3 mr-1" />
                            Recommended
                          </Badge>
                        )}
                        <h3 className="text-xl sm:text-2xl font-bold mb-2">{solution.name}</h3>
                        <p className="text-sm text-gray-400 mb-6">{solution.description}</p>
                        
                        <div className="mb-6">
                          <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-3xl font-bold">{formatPrice(solution.monthlyFee)}</span>
                            <span className="text-gray-400">/mo</span>
                          </div>
                          <div className="text-sm text-gray-500 mb-4">
                            Setup: {formatPrice(solution.setupFee)}
                          </div>
                          <div className="text-xs text-gray-500 mb-4">
                            <strong>{solution.workflowsIncluded}</strong>
                          </div>
                          <div className="text-xs text-gray-500 mb-4">
                            {solution.apiBuffer}
                          </div>
                        </div>

                        <div className="mb-6">
                          <h4 className="font-semibold text-sm mb-3">Features:</h4>
                          <ul className="space-y-2 mb-4">
                            {solution.features.map((feature, i) => (
                              <li key={i} className="flex items-start text-sm text-gray-300">
                                <CheckCircle className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mb-6 pt-4 border-t border-gray-800">
                          <h4 className="font-semibold text-sm mb-2">Example Use Cases:</h4>
                          <ul className="space-y-1.5">
                            {solution.exampleUseCases.map((useCase, i) => (
                              <li key={i} className="text-xs text-gray-400 flex items-start">
                                <ArrowRight className="w-3 h-3 text-primary mr-2 mt-0.5 flex-shrink-0" />
                                <span>{useCase}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <BookingButton
                          size="lg"
                          className={`w-full ${
                            solution.id === "plus"
                              ? "bg-primary hover:bg-primary/90 text-white"
                              : "bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30"
                          }`}
                          calLink="grow-fast-with-us/30min"
                        >
                          Get Started
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </BookingButton>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Why Choose Our Packages */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gradient-to-b from-gray-900/50 to-transparent">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">
              Why Choose Our Packages
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
              Every package includes everything you need for successful automation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                icon: Rocket,
                title: "Fast Deployment",
                description: "Templates deploy in 3-5 days, custom solutions in 15-45 days"
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "GDPR, HIPAA compliant with enterprise-grade encryption"
              },
              {
                icon: TrendingUp,
                title: "Proven ROI",
                description: "Clients see measurable returns within 30-90 days"
              },
              {
                icon: Clock,
                title: "Full Service",
                description: "We handle hosting, monitoring, maintenance, and support"
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full glass-card border-gray-800 hover:border-primary/50 transition-all duration-300 text-center">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-gray-400">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-2xl p-8 sm:p-12 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 border border-primary/30 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5" />
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8">
                Schedule a free consultation and discover which package is right for your business. We'll help you calculate ROI and choose the perfect solution.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <BookingButton
                  size="lg"
                  className="bg-primary hover:bg-primary/90 w-full sm:w-auto py-6 sm:py-3 text-base"
                  calLink="grow-fast-with-us/30min"
                >
                  <Sparkles className="mr-2 w-5 h-5" />
                  Book Free Consultation
                  <ArrowRight className="ml-2 w-5 h-5" />
                </BookingButton>
                <Link href="/templates">
                  <Button size="lg" variant="outline" className="border-primary/30 hover:bg-primary/10 w-full sm:w-auto py-6 sm:py-3 text-base">
                    Browse Templates
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}


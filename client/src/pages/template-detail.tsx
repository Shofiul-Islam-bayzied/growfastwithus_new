import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { templates } from "@/lib/templates";
import Footer from "@/components/Footer";
import {
  ArrowLeft,
  CheckCircle,
  Star,
  Clock,
  Users,
  TrendingUp,
  Zap,
  Shield,
  Rocket,
  Settings,
  BarChart3,
  Phone,
  Mail
} from "lucide-react";

// Template details data with all 15 templates
const templateDetails = {
  "ai-medical-practice": {
    overview: "Modern medical practices need seamless patient management. Our AI Medical Practice Automation system streamlines appointment scheduling, reminders, and follow-ups — freeing your staff from hours of phone calls and manual updates.",
    keyFeatures: [
      "Appointment Scheduling: AI books appointments based on provider availability",
      "Patient Reminders: Sends SMS/email reminders, reducing no-shows",
      "Follow-Up Automation: Post-visit messages for care plans, feedback, or next steps",
      "Insurance Checks: Optional integration to verify patient coverage"
    ],
    benefits: [
      "Fewer missed appointments",
      "Higher patient satisfaction", 
      "Lower admin costs",
      "Ready for HIPAA and data compliance"
    ],
    idealFor: "Clinics, dental practices, physiotherapists, aesthetic medicine",
    setupTime: "1-2 days",
    roi: "Achievable in 30 days",
    saves: "20+ hours/week",
    industry: "Healthcare",
    whatItDoes: [
      "Automatically schedules appointments based on provider availability",
      "Sends SMS and email reminders to reduce no-shows",
      "Handles post-visit follow-up communications",
      "Integrates with existing calendar systems"
    ],
    whatYouNeed: [
      "Access to your current appointment system",
      "Provider availability schedules",
      "Patient contact information",
      "HIPAA compliance requirements"
    ],
    support: "24/7 technical support with dedicated healthcare specialists"
  },
  "real-estate-sales-funnel": {
    overview: "Convert more buyers and tenants with automated lead capture, follow-up, and CRM updates. Our Real Estate Sales Funnel keeps agents organized and proactive.",
    keyFeatures: [
      "Lead Capture: Collects leads from website forms, listing portals",
      "Automated Nurturing: AI sends property info, reminders, and updates",
      "CRM Integration: Updates pipelines automatically",
      "Viewing Scheduler: Clients book viewings directly online"
    ],
    benefits: [
      "Faster response to hot leads",
      "Increased property viewings",
      "Less manual CRM work",
      "Higher closure rates"
    ],
    idealFor: "Realtors, agencies, property developers",
    setupTime: "1-2 days",
    roi: "Achievable in 30 days",
    saves: "20+ hours/week",
    industry: "Real Estate",
    whatItDoes: [
      "Captures leads from multiple sources automatically",
      "Sends personalized property information to prospects",
      "Schedules property viewings and follow-ups",
      "Updates CRM systems with prospect activity"
    ],
    whatYouNeed: [
      "Access to your CRM system",
      "Property listing information",
      "Agent availability schedules",
      "Marketing materials and property photos"
    ],
    support: "24/7 support with real estate industry specialists"
  },
  "ecommerce-smart-ops": {
    overview: "Running an online store is chaos without automation. E-Commerce Smart Ops syncs your inventory, manages orders, and helps your team focus on growth instead of spreadsheets.",
    keyFeatures: [
      "Inventory Management: Tracks stock levels, syncs across platforms",
      "Order Processing: Automatically fulfills orders, updates status",
      "Customer Service Automation: Sends shipment updates, handles FAQs",
      "Supplier Coordination: Notifies suppliers when stock runs low"
    ],
    benefits: [
      "Lower fulfillment errors",
      "Happier customers",
      "More time for marketing",
      "Scalable operations"
    ],
    idealFor: "Shopify stores, online retailers, drop shippers",
    setupTime: "1-2 days",
    roi: "Achievable in 30 days",
    saves: "20+ hours/week",
    industry: "E-commerce",
    whatItDoes: [
      "Synchronizes inventory across all sales channels",
      "Automatically processes and fulfills orders",
      "Sends customer updates and tracking information",
      "Manages supplier relationships and reordering"
    ],
    whatYouNeed: [
      "Access to your e-commerce platforms",
      "Inventory management system",
      "Supplier contact information",
      "Shipping carrier accounts"
    ],
    support: "24/7 support with e-commerce specialists"
  },
  "professional-services-crm": {
    overview: "Client-facing businesses juggle tons of manual tasks. Professional Services CRM Flow automates onboarding, document collection, project tracking, and billing.",
    keyFeatures: [
      "Client Management: Captures new client data seamlessly",
      "Project Tracking: Visualizes milestones and deliverables",
      "Billing Automation: Sends invoices automatically",
      "Document Collection: Secure portals for file uploads"
    ],
    benefits: [
      "Faster client onboarding",
      "Fewer admin errors",
      "Improved cash flow",
      "Higher client satisfaction"
    ],
    idealFor: "Legal firms, financial advisors, consulting agencies",
    setupTime: "1-2 days",
    roi: "Achievable in 30 days",
    saves: "20+ hours/week",
    industry: "Professional Services",
    whatItDoes: [
      "Automates client onboarding and data collection",
      "Tracks project milestones and deliverables",
      "Generates and sends invoices automatically",
      "Manages document collection and storage"
    ],
    whatYouNeed: [
      "Access to your current CRM system",
      "Client contact information",
      "Project management workflows",
      "Billing and payment systems"
    ],
    support: "24/7 support with professional services specialists"
  },
  "restaurant-automation": {
    overview: "Your kitchen should focus on great food — not chaos. Our automation system consolidates orders, manages kitchen workflows, and turns customer feedback into actionable insights.",
    keyFeatures: [
      "Online Ordering Integration: Centralizes delivery platform orders",
      "Kitchen Management: Streamlines ticket handling",
      "Feedback Analysis: Uses AI to analyze customer reviews",
      "Inventory Alerts: Monitors ingredient stock levels"
    ],
    benefits: [
      "Faster order processing",
      "Improved service consistency",
      "Data-driven menu decisions",
      "Reduced staff workload"
    ],
    idealFor: "Restaurants, cloud kitchens, cafes",
    setupTime: "1-2 days",
    roi: "Achievable in 30 days",
    saves: "20+ hours/week",
    industry: "Restaurant",
    whatItDoes: [
      "Consolidates orders from multiple delivery platforms",
      "Streamlines kitchen ticket management",
      "Analyzes customer feedback automatically",
      "Monitors inventory and alerts when low"
    ],
    whatYouNeed: [
      "Access to your delivery platform accounts",
      "Kitchen management system",
      "Inventory tracking system",
      "Customer feedback channels"
    ],
    support: "24/7 support with restaurant industry specialists"
  },
  "home-services-scheduler": {
    overview: "Stop drowning in phone calls. This automation schedules technicians, assigns jobs, and keeps customers informed.",
    keyFeatures: [
      "Appointment Booking: Accepts online service requests",
      "Technician Dispatch: Assigns jobs based on skills and location",
      "Customer Updates: Sends arrival times and job completions",
      "Job Tracking: Keeps detailed records for invoices and reporting"
    ],
    benefits: [
      "More efficient dispatching",
      "Higher first-time fix rates",
      "Happier customers",
      "Streamlined operations"
    ],
    idealFor: "Electricians, plumbers, HVAC, appliance repair",
    setupTime: "1-2 days",
    roi: "Achievable in 30 days",
    saves: "20+ hours/week",
    industry: "Home Services",
    whatItDoes: [
      "Schedules service appointments automatically",
      "Assigns technicians based on skills and location",
      "Sends customer updates and arrival times",
      "Tracks job completion and billing"
    ],
    whatYouNeed: [
      "Technician contact information",
      "Service area definitions",
      "Pricing and billing systems",
      "Customer contact databases"
    ],
    support: "24/7 support with home services specialists"
  },
  "digital-marketing-system": {
    overview: "Marketing should be creative — not repetitive. Our system automates client onboarding, campaign setups, reporting, and ROI tracking.",
    keyFeatures: [
      "Campaign Management: Launch multi-channel ads quickly",
      "Lead Scoring: Ranks prospects based on engagement",
      "Performance Tracking: Sends automated reports",
      "Client Portal: Clients check campaign status 24/7"
    ],
    benefits: [
      "Less time on reporting",
      "Higher client retention",
      "Scalable operations",
      "More upsell opportunities"
    ],
    idealFor: "Digital marketing agencies, freelancers, in-house teams",
    setupTime: "1-2 days",
    roi: "Achievable in 30 days",
    saves: "20+ hours/week",
    industry: "Marketing",
    whatItDoes: [
      "Automates campaign setup and management",
      "Tracks lead scoring and engagement",
      "Generates performance reports automatically",
      "Provides client portal access"
    ],
    whatYouNeed: [
      "Access to advertising platforms",
      "Client contact information",
      "Campaign performance data",
      "Reporting requirements"
    ],
    support: "24/7 support with marketing specialists"
  },
  "fitness-member-system": {
    overview: "Keep your studio full and your members happy. This system automates bookings, tracks progress, and simplifies communication.",
    keyFeatures: [
      "Member Management: Maintains profiles and memberships",
      "Class Booking: Online scheduling for group or private sessions",
      "Health Tracking: Customizes workouts and progress metrics",
      "Billing Automation: Collects payments and renewals"
    ],
    benefits: [
      "Reduces missed classes",
      "Builds loyalty",
      "Simplifies admin tasks",
      "Enables personalized coaching"
    ],
    idealFor: "Gyms, yoga studios, personal trainers",
    setupTime: "1-2 days",
    roi: "Achievable in 30 days",
    saves: "20+ hours/week",
    industry: "Fitness",
    whatItDoes: [
      "Manages member profiles and memberships",
      "Handles class booking and scheduling",
      "Tracks fitness progress and goals",
      "Automates billing and renewals"
    ],
    whatYouNeed: [
      "Member contact information",
      "Class schedules and capacity",
      "Billing and payment systems",
      "Fitness tracking requirements"
    ],
    support: "24/7 support with fitness industry specialists"
  },
  "event-planning-bot": {
    overview: "Event planning is stressful — our bot handles vendors, timelines, and guest communication so you stay organized and proactive.",
    keyFeatures: [
      "Event Coordination: Builds event timelines automatically",
      "Vendor Management: Tracks tasks and reminders",
      "Guest Communication: Sends invites, RSVPs, and updates",
      "Post-Event Follow-Up: Gathers feedback and photos"
    ],
    benefits: [
      "Fewer planning mistakes",
      "Happier vendors and guests",
      "Streamlined communication",
      "Greater professionalism"
    ],
    idealFor: "Corporate event planners, wedding coordinators, festival organizers",
    setupTime: "1-2 days",
    roi: "Achievable in 30 days",
    saves: "20+ hours/week",
    industry: "Events",
    whatItDoes: [
      "Creates event timelines automatically",
      "Manages vendor communications and tasks",
      "Handles guest invitations and RSVPs",
      "Collects post-event feedback and photos"
    ],
    whatYouNeed: [
      "Event details and requirements",
      "Vendor contact information",
      "Guest lists and contact details",
      "Event timeline and milestones"
    ],
    support: "24/7 support with event planning specialists"
  },
  "coaching-client-portal": {
    overview: "Give clients a premium coaching experience with automated onboarding, resource sharing, and progress tracking.",
    keyFeatures: [
      "Client Onboarding: Smooth intake process",
      "Session Scheduling: Syncs with calendars for easy bookings",
      "Progress Tracking: Logs goals and milestones",
      "Resource Sharing: Share documents, videos, and notes securely"
    ],
    benefits: [
      "Less admin work",
      "Higher client satisfaction",
      "Professional appearance",
      "Easy upselling of new services"
    ],
    idealFor: "Business coaches, wellness coaches, consultants",
    setupTime: "1-2 days",
    roi: "Achievable in 30 days",
    saves: "20+ hours/week",
    industry: "Coaching",
    whatItDoes: [
      "Automates client onboarding process",
      "Manages session scheduling and calendars",
      "Tracks client progress and goals",
      "Shares resources and materials securely"
    ],
    whatYouNeed: [
      "Client contact information",
      "Coaching materials and resources",
      "Calendar and scheduling systems",
      "Progress tracking requirements"
    ],
    support: "24/7 support with coaching specialists"
  },
  "whatsapp-support-agent": {
    overview: "Serve customers 24/7 without hiring more agents. Our WhatsApp AI answers FAQs, handles simple queries, and escalates complex issues to your human team.",
    keyFeatures: [
      "24/7 Availability: Never miss a customer message",
      "AI Responses: Smart answers pulled from your knowledge base",
      "Escalation Management: Transfers complex cases to humans",
      "Multilingual Support: Speak your customers' languages"
    ],
    benefits: [
      "Faster responses",
      "Lower support costs",
      "Happier customers",
      "Scalable to thousands of chats"
    ],
    idealFor: "Any business with high support volume",
    setupTime: "1-2 days",
    roi: "Achievable in 30 days",
    saves: "20+ hours/week",
    industry: "Customer Support",
    whatItDoes: [
      "Answers customer questions 24/7",
      "Handles simple support requests automatically",
      "Escalates complex issues to human agents",
      "Provides multilingual support"
    ],
    whatYouNeed: [
      "WhatsApp Business API access",
      "Knowledge base and FAQs",
      "Support team contact information",
      "Common customer questions"
    ],
    support: "24/7 support with customer service specialists"
  },
  "voice-reminder-bot": {
    overview: "Ensure clients never miss an appointment or payment. This bot calls clients with natural-sounding AI voices and logs every interaction.",
    keyFeatures: [
      "Voice Calls: Personalized reminders for clients",
      "Appointment Notifications: Reduce no-shows",
      "Payment Reminders: Gentle nudges to settle invoices",
      "Call Logging: Keep track of conversations and statuses"
    ],
    benefits: [
      "Boosts attendance",
      "Saves staff time",
      "Professional customer experience",
      "Works 24/7"
    ],
    idealFor: "Clinics, service businesses, sales teams",
    setupTime: "1-2 days",
    roi: "Achievable in 30 days",
    saves: "20+ hours/week",
    industry: "Communication",
    whatItDoes: [
      "Makes personalized voice calls to clients",
      "Sends appointment reminders automatically",
      "Follows up on payment reminders",
      "Logs all call interactions and outcomes"
    ],
    whatYouNeed: [
      "Client contact information",
      "Appointment and payment schedules",
      "Voice calling system access",
      "Call script templates"
    ],
    support: "24/7 support with communication specialists"
  },
  "lead-qualifier-crm": {
    overview: "Stop wasting time on bad leads. This workflow automatically filters, scores, and pushes only qualified leads into your CRM.",
    keyFeatures: [
      "Lead Qualification: AI analyzes submitted info",
      "CRM Sync: Instant updates to your sales pipeline",
      "Scoring System: Prioritizes hottest leads",
      "Notifications: Alerts your team about top prospects"
    ],
    benefits: [
      "Higher sales efficiency",
      "Shorter sales cycles",
      "More revenue from fewer leads",
      "Lower manual work"
    ],
    idealFor: "B2B companies, sales teams, agencies",
    setupTime: "1-2 days",
    roi: "Achievable in 30 days",
    saves: "20+ hours/week",
    industry: "Sales",
    whatItDoes: [
      "Analyzes and qualifies incoming leads",
      "Scores leads based on engagement and fit",
      "Syncs qualified leads to CRM automatically",
      "Notifies sales team of hot prospects"
    ],
    whatYouNeed: [
      "Access to your CRM system",
      "Lead qualification criteria",
      "Sales team contact information",
      "Lead scoring parameters"
    ],
    support: "24/7 support with sales specialists"
  },
  "cart-recovery-system": {
    overview: "Turn almost-customers into real buyers. This workflow triggers personalized emails/SMS with discounts to recover lost carts.",
    keyFeatures: [
      "Cart Recovery: Identifies abandoned carts in real-time",
      "Personalized Offers: Creates unique coupon codes",
      "Multi-Channel Messaging: Emails, SMS, or WhatsApp",
      "ROI Tracking: Measures revenue recovered"
    ],
    benefits: [
      "Recovers lost revenue",
      "Increases conversion rates",
      "Fully automated follow-up",
      "ROI in days"
    ],
    idealFor: "Shopify stores, WooCommerce stores, online sellers",
    setupTime: "1-2 days",
    roi: "Achievable in 30 days",
    saves: "20+ hours/week",
    industry: "E-commerce",
    whatItDoes: [
      "Detects abandoned shopping carts automatically",
      "Sends personalized recovery messages",
      "Creates unique discount codes",
      "Tracks recovery success and ROI"
    ],
    whatYouNeed: [
      "Access to your e-commerce platform",
      "Customer contact information",
      "Discount and coupon systems",
      "Email/SMS marketing tools"
    ],
    support: "24/7 support with e-commerce specialists"
  },
  "recruitment-flow": {
    overview: "Streamline hiring with AI. Automatically collect applications, score resumes, and schedule interviews so your HR team can focus on people — not paperwork.",
    keyFeatures: [
      "Resume Screening: AI scans and ranks candidates",
      "Candidate Management: Centralizes communication",
      "Interview Scheduling: Automates calendar invites",
      "Custom Scorecards: Evaluate key candidate criteria"
    ],
    benefits: [
      "Faster hiring decisions",
      "Lower recruitment costs",
      "Better talent matches",
      "Higher candidate experience"
    ],
    idealFor: "HR teams, recruitment agencies, hiring managers",
    setupTime: "1-2 days",
    roi: "Achievable in 30 days",
    saves: "20+ hours/week",
    industry: "HR",
    whatItDoes: [
      "Screens and ranks candidate resumes",
      "Manages candidate communications",
      "Schedules interviews automatically",
      "Evaluates candidates using custom criteria"
    ],
    whatYouNeed: [
      "Job posting requirements",
      "Candidate evaluation criteria",
      "Interview team contact information",
      "Recruitment workflow processes"
    ],
    support: "24/7 support with HR specialists"
  }
};

export default function TemplateDetail() {
  const { id } = useParams();
  const template = templates.find(t => t.id === id);
  const details = templateDetails[id as keyof typeof templateDetails];

  if (!template || !details) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Template Not Found</h1>
          <Link href="/templates">
            <Button>Back to Templates</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 glass-card shadow-lg">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <img 
                  src="/attached_assets/white tect logo_1751155829782.png" 
                  alt="GrowFastWithUs Logo" 
                  className="h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity"
                />
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/templates">
                <Button variant="outline" className="text-white border-white/30 hover:bg-white/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  All Templates
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="text-white border-white/30 hover:bg-white/10">
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Template Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center">
                {template.category === "Healthcare" && <Users className="w-8 h-8 text-primary" />}
                {template.category === "Real Estate" && <TrendingUp className="w-8 h-8 text-primary" />}
                {template.category === "E-commerce" && <Zap className="w-8 h-8 text-primary" />}
                {template.category === "Professional Services" && <Users className="w-8 h-8 text-primary" />}
                {template.category === "Food & Beverage" && <Clock className="w-8 h-8 text-primary" />}
                {!["Healthcare", "Real Estate", "E-commerce", "Professional Services", "Food & Beverage"].includes(template.category) && <Zap className="w-8 h-8 text-primary" />}
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-left">{template.title}</h1>
                <div className="flex items-center space-x-3 mt-2">
                  <Badge variant="outline">{template.category}</Badge>
                </div>
              </div>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {template.description}
            </p>
          </motion.div>

          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          >
            <Card className="bg-primary/10 border-primary/30">
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{details.setupTime}</div>
                <div className="text-gray-400 text-sm">Setup Time</div>
              </CardContent>
            </Card>
            <Card className="bg-primary/10 border-primary/30">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">30 Days</div>
                <div className="text-gray-400 text-sm">Average ROI</div>
              </CardContent>
            </Card>
            <Card className="bg-primary/10 border-primary/30">
              <CardContent className="p-6 text-center">
                <Zap className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">20+ hrs</div>
                <div className="text-gray-400 text-sm">Weekly Savings</div>
              </CardContent>
            </Card>
            <Card className="bg-primary/10 border-primary/30">
              <CardContent className="p-6 text-center">
                <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-gray-400 text-sm">Support</div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* What It Does */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="bg-gray-900/50 border-gray-700">
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <Settings className="w-6 h-6 text-primary" />
                      <h2 className="text-2xl font-bold">What This Automation Does</h2>
                    </div>
                    <div className="space-y-4">
                      {details.whatItDoes.map((item, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <p className="text-gray-300">{item}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* What You Need */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="bg-gray-900/50 border-gray-700">
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <Rocket className="w-6 h-6 text-primary" />
                      <h2 className="text-2xl font-bold">What You Need to Get Started</h2>
                    </div>
                    <div className="space-y-4">
                      {details.whatYouNeed.map((item, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                            <span className="text-primary text-sm font-bold">{index + 1}</span>
                          </div>
                          <p className="text-gray-300">{item}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card className="bg-gray-900/50 border-gray-700">
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <BarChart3 className="w-6 h-6 text-primary" />
                      <h2 className="text-2xl font-bold">How It Benefits Your Business</h2>
                    </div>
                    <div className="space-y-4">
                      {details.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <TrendingUp className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-300">{benefit}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Pricing Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="bg-gradient-to-br from-primary/20 to-primary/10 border-primary/30 sticky top-32">
                  <CardContent className="p-8 text-center">
                    <h3 className="text-2xl font-bold mb-4">Get Started Today</h3>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-primary">£599</span>
                      <span className="text-gray-400">/month</span>
                    </div>
                    <div className="space-y-3 mb-6 text-sm text-gray-300">
                      <div className="flex items-center justify-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span>Setup in {details.setupTime}</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span>30-day money-back guarantee</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span>24/7 support included</span>
                      </div>
                    </div>
                    <Link href="/booking">
                      <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-white mb-4">
                        Start Implementation
                      </Button>
                    </Link>
                    <p className="text-xs text-gray-400">
                      No setup fees • Cancel anytime
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Ideal For */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="bg-gray-900/50 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Users className="w-5 h-5 text-primary" />
                      <h3 className="font-bold">Ideal For</h3>
                    </div>
                    <p className="text-gray-300 text-sm">{details.idealFor}</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* ROI Information */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card className="bg-gray-900/50 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      <h3 className="font-bold">Expected ROI</h3>
                    </div>
                    <p className="text-gray-300 text-sm">{details.roi}</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Support */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Card className="bg-gray-900/50 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Shield className="w-5 h-5 text-primary" />
                      <h3 className="font-bold">Support Included</h3>
                    </div>
                    <p className="text-gray-300 text-sm mb-4">{details.support}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-primary" />
                        <span className="text-gray-300">Priority phone support</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-primary" />
                        <span className="text-gray-300">Email support 24/7</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-center mt-16 p-8 rounded-lg bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30"
          >
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Business?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join thousands of businesses that have automated their operations and seen immediate results. 
              Our team will handle the complete setup and ensure everything works perfectly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/booking">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                  Get Started Now
                </Button>
              </Link>
              <Link href="/templates">
                <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10">
                  View All Templates
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
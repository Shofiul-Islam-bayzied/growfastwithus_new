import { useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import { Link } from "wouter";

import { Button } from "@/components/ui/button";
import { SEOHead, seoTemplates } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { AdvancedContactForm } from "@/components/advanced-contact-form";
import { BookingWidget, BookingButton } from "@/components/BookingWidget";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { CurrencySelector } from "@/components/CurrencySelector";
import { VoiceAIAddonCard } from "@/components/VoiceAIAddonCard";
import { templates, currencies, voiceAIAddons, convertPrice, formatPrice, type Currency, type VoiceAIAddon } from "@/lib/templates";
import { useToast } from "@/hooks/use-toast";
import {
  Phone,
  Mail,
  Clock,
  MapPin,
  Stethoscope,
  Home as HomeIcon,
  ShoppingCart,
  Briefcase,
  Utensils,
  Wrench,
  ChartLine,
  Dumbbell,
  Calendar,
  UserCheck,
  Target,
  ShoppingBag,
  Users,
  Cog,
  Bot,
  BarChart3,
  Puzzle,
  Server,
  Star,
  ArrowRight,
  CheckCircle,
  Zap,
  TrendingUp,
  Award,
  Menu,
  X,
  Shield,
  Lightbulb,
  Rocket,
  ArrowUp,
  ExternalLink,
  Download,
  Play,
  ChevronDown,
  ChevronUp,
  Quote,
  Globe,
  Smartphone,
  Monitor,
  Sparkles
} from "lucide-react";

// Company logos from react-icons
import { 
  SiSlack, 
  SiShopify, 
  SiGmail, 
  SiTrello, 
  SiHubspot,
  SiZapier,
  SiMake,
  SiN8N
} from "react-icons/si";

// FAQ Item Component
function FAQItem({ faq, index }: { faq: { question: string; answer: string }; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="mb-4"
    >
      <Card className="service-card">
        <CardContent className="p-0">
          <button
            className="w-full p-6 text-left flex justify-between items-center"
            onClick={() => setIsOpen(!isOpen)}
          >
            <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
            {isOpen ? (
              <ChevronUp className="w-5 h-5 text-primary" />
            ) : (
              <ChevronDown className="w-5 h-5 text-primary" />
            )}
          </button>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="px-6 pb-6"
            >
              <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}



export default function Home() {

  const { toast } = useToast();
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Templates");
  const [businessSize, setBusinessSize] = useState("Small Business (1-10 employees)");
  const [painPoints, setPainPoints] = useState<string[]>([]);
  const [timeSpent, setTimeSpent] = useState([20]);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]); // Default to GBP
  const [selectedVoiceAddons, setSelectedVoiceAddons] = useState<string[]>([]);
  const [showStickyCTA, setShowStickyCTA] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHeaderScrolled(window.scrollY > 100);
      setScrolled(window.scrollY > 300);
      setShowStickyCTA(window.scrollY > 800);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const heroRef = useRef(null);
  const servicesRef = useRef(null);
  const templatesRef = useRef(null);
  const pricingRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true });
  const servicesInView = useInView(servicesRef, { once: true });
  const templatesInView = useInView(templatesRef, { once: true });
  const pricingInView = useInView(pricingRef, { once: true });

  const categories = ["All Templates", ...Array.from(new Set(templates.map(t => t.category)))];
  const filteredTemplates = selectedCategory === "All Templates" 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const businessSizes = [
    "Small Business (1-10 employees)",
    "Medium Business (11-50 employees)", 
    "Large Business (51-200 employees)",
    "Enterprise (200+ employees)",
  ];

  const painPointOptions = [
    "Manual data entry",
    "Customer support overload",
    "Inventory management",
    "Lead follow-up", 
    "Appointment scheduling",
    "Invoice processing",
    "Report generation",
    "Email marketing",
  ];

  const handleVoiceAddonToggle = (addonId: string) => {
    setSelectedVoiceAddons(prev => 
      prev.includes(addonId) 
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const calculatePricing = () => {
    const baseSetup = businessSize.includes("Small") ? 2499 : 
                     businessSize.includes("Medium") ? 4999 :
                     businessSize.includes("Large") ? 7499 : 9999;
    
    const templateCosts = selectedTemplates.reduce((total, templateId) => {
      const template = templates.find(t => t.id === templateId);
      return total + (template ? template.tiers[0].monthlyFee : 0);
    }, 0);

    const templateSetupCosts = selectedTemplates.reduce((total, templateId) => {
      const template = templates.find(t => t.id === templateId);
      return total + (template ? template.tiers[0].setupFee : 0);
    }, 0);

    // Voice AI addon costs
    const voiceAddonMonthlyCosts = selectedVoiceAddons.reduce((total, addonId) => {
      const addon = voiceAIAddons.find(a => a.id === addonId);
      return total + (addon ? addon.monthlyPrice : 0);
    }, 0);

    const voiceAddonSetupCosts = selectedVoiceAddons.reduce((total, addonId) => {
      const addon = voiceAIAddons.find(a => a.id === addonId);
      return total + (addon ? addon.setupFee : 0);
    }, 0);
    
    const baseMonthlyEUR = painPoints.length * 150 + 299 + templateCosts + voiceAddonMonthlyCosts;
    const totalSetupEUR = baseSetup + templateSetupCosts + voiceAddonSetupCosts;
    
    // Convert to selected currency
    const monthlyFee = convertPrice(baseMonthlyEUR, 'EUR', selectedCurrency.code);
    const setupFee = convertPrice(totalSetupEUR, 'EUR', selectedCurrency.code);
    
    const timeSavings = timeSpent[0] * 4; // 4 weeks per month
    const costSavings = timeSavings * 40 * selectedCurrency.rate; // Adjusted for currency
    
    // Calculate ROI with proper error handling
    const totalInvestment = setupFee + monthlyFee * 12;
    const totalSavings = costSavings * 12;
    
    let roi = 0;
    if (totalInvestment > 0) {
      roi = ((totalSavings - totalInvestment) / totalInvestment) * 100;
    }
    
    // Calculate break-even months
    let breakEven = 0;
    if (costSavings > 0) {
      breakEven = Math.ceil(totalInvestment / costSavings);
    }
    
    return {
      setupFee,
      monthlyFee,
      timeSaved: timeSavings,
      costSavings,
      roi: Math.round(roi),
      breakEven: breakEven,
    };
  };

  const pricing = calculatePricing();

  const handlePainPointChange = (painPoint: string, checked: boolean) => {
    // Store current scroll position to prevent jumping
    const currentScrollY = window.scrollY;
    
    setPainPoints(prev => 
      checked ? [...prev, painPoint] : prev.filter(p => p !== painPoint)
    );
    
    // Restore scroll position after state update
    requestAnimationFrame(() => {
      window.scrollTo(0, currentScrollY);
    });
  };

  const handleTemplateSelect = (templateId: string, checked: boolean) => {
    setSelectedTemplates(prev =>
      checked ? [...prev, templateId] : prev.filter(t => t !== templateId)
    );
  };

  const handleEmailSubscription = async () => {
    setEmailSubscribed(true);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Successfully subscribed!",
        description: "You'll receive weekly automation tips and exclusive content.",
      });
    }, 1000);
  };

  const scrollToSection = (elementId: string) => {
    // Scroll to section functionality
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.warn('Element not found:', elementId);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <SEOHead {...seoTemplates.homepage} />

      {/* Sticky Mobile CTA Button */}
      <AnimatePresence>
        {showStickyCTA && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 left-4 right-4 z-50 lg:hidden"
          >
            <BookingButton 
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-2xl py-5 text-base font-semibold rounded-full"
              calLink="grow-fast-with-us/30min"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Book Free Consultation
            </BookingButton>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button - Desktop */}
      <motion.div
        className="fixed bottom-6 right-6 z-50 hidden lg:block"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <BookingButton 
          className="glass-button shadow-lg animate-pulse-glow px-6 py-3 rounded-full font-semibold"
          calLink="grow-fast-with-us/30min"
        >
          <Phone className="w-4 h-4 mr-2" />
          Book Discovery Call
        </BookingButton>
      </motion.div>



      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${headerScrolled ? 'glass-card shadow-lg' : ''}`}>
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <img 
                  src="/logo.png" 
                  alt="GrowFastWithUs Logo" 
                  className="h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity"
                  loading="eager"
                />
              </Link>
            </div>
            
            <div className="hidden lg:flex items-center space-x-8">
              <a href="#home" className="hover:text-primary transition-colors" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Home</a>
              <Link href="/services" className="hover:text-primary transition-colors">Services</Link>
              <Link href="/templates" className="hover:text-primary transition-colors">Templates</Link>
              <Link href="/packages" className="hover:text-primary transition-colors">Packages</Link>
              <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
              <Link href="/booking" className="hover:text-primary transition-colors">Book Consultation</Link>
              <a href="#contact" className="hover:text-primary transition-colors" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a>
            </div>
            
            {/* Desktop CTA Button */}
            <BookingButton 
              className="hidden lg:block bg-primary hover:bg-primary/90 text-white shadow-lg"
              calLink="grow-fast-with-us/30min"
            >
              Book Discovery Call
            </BookingButton>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-white p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Super Responsive Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ 
                duration: 0.2, 
                ease: "easeOut",
                staggerChildren: 0.1
              }}
              className="lg:hidden fixed left-4 right-4 z-50 rounded-2xl glass-card backdrop-blur-2xl bg-black/90 border border-white/10 shadow-2xl mobile-menu-glass"
              style={{
                top: 'calc(4rem + 1rem)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                isolation: 'isolate'
              }}
            >
              <div className="p-6 space-y-1">
                {[
                  { href: "#home", label: "Home", action: () => scrollToSection('home') },
                  { href: "/services", label: "Services", isLink: true },
                  { href: "/templates", label: "Templates", isLink: true },
                  { href: "/packages", label: "Packages", isLink: true },
                  { href: "/blog", label: "Blog", isLink: true },
                  { href: "/booking", label: "Book Consultation", isLink: true },
                  { href: "#contact", label: "Contact", action: () => scrollToSection('contact') }
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {item.isLink ? (
                      <Link
                        href={item.href}
                        className="flex items-center w-full px-4 py-3 text-white hover:text-primary hover:bg-white/5 rounded-xl transition-all duration-200 text-lg font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        className="flex items-center w-full px-4 py-3 text-white hover:text-primary hover:bg-white/5 rounded-xl transition-all duration-200 text-lg font-medium"
                        onClick={(e) => {
                          e.preventDefault();
                          item.action?.();
                          setMobileMenuOpen(false);
                        }}
                      >
                        {item.label}
                      </a>
                    )}
                  </motion.div>
                ))}
                
                {/* CTA Buttons */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-4 space-y-3 border-t border-white/10"
                >
                  <Button 
                    size="lg" 
                    className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold shadow-lg hover:shadow-primary/25 transition-all duration-200"
                    onClick={() => {
                      scrollToSection('contact');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Get Started
                  </Button>
                  <BookingButton 
                    size="lg"
                    className="w-full bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90 text-white rounded-xl font-semibold shadow-lg hover:shadow-primary/25 transition-all duration-200"
                    calLink="grow-fast-with-us/30min"
                  >
                    Book Discovery Call
                  </BookingButton>
                </motion.div>
              </div>
            </motion.div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" ref={heroRef} className="min-h-screen bg-black relative overflow-hidden">
        <AnimatedBackground className="absolute inset-0" />

        {/* Minimal geometric shapes for visual interest - Hidden on mobile for performance */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
          <motion.div 
            className="absolute top-20 left-10 w-32 h-32 border border-primary/20 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute top-40 right-20 w-24 h-24 bg-primary/10 rounded-lg"
            animate={{ rotate: -180 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute bottom-40 left-20 w-16 h-16 border-2 border-primary/30"
            animate={{ rotate: 45 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute bottom-32 right-32 w-40 h-40 border border-white/10 rounded-full"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute top-60 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gradient-to-r from-primary/20 to-transparent rounded-full"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        
        <div className="container mx-auto px-4 sm:px-6 py-20 sm:py-28 lg:py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Brand Badge */}
            <motion.div
              className="inline-flex items-center space-x-2 sm:space-x-3 glass-card px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-6 sm:mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={heroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <Link href="/">
                <img 
                  src="/logo.png" 
                  alt="GrowFastWithUs Logo" 
                  className="h-8 sm:h-10 w-auto cursor-pointer hover:opacity-80 transition-opacity"
                  loading="eager"
                />
              </Link>
              <Badge className="bg-primary text-white px-2 sm:px-3 py-1 text-xs sm:text-sm">AI-Powered</Badge>
            </motion.div>

            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 px-4"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Automate Your Business
              <span className="block text-primary">Growth & Success</span>
            </motion.h1>
            
            <motion.p
              className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Scale your business with smart automation that eliminates repetitive tasks and drives growth.
            </motion.p>

            {/* Simple Stats - Optimized for Mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-6 sm:mb-8 text-gray-400 text-xs sm:text-sm px-4"
            >
              <span className="whitespace-nowrap">2,500+ Clients</span>
              <span className="whitespace-nowrap">4.9/5 Rating</span>
              <span className="whitespace-nowrap hidden sm:inline">Enterprise Security</span>
            </motion.div>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link href="/booking">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-6 sm:py-3 rounded-lg w-full sm:w-auto text-base sm:text-lg font-semibold touch-manipulation"
                >
                  Get Started
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-white border-white/30 hover:bg-white/10 px-8 py-6 sm:py-3 rounded-lg w-full sm:w-auto text-base sm:text-lg touch-manipulation"
                onClick={() => scrollToSection('templates')}
              >
                View Templates
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={heroInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8 sm:mt-12 text-center px-4"
            >
              <p className="text-gray-500 text-xs sm:text-sm">Trusted by 500+ companies worldwide</p>
            </motion.div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowRight className="w-6 h-6 text-white rotate-90" />
        </motion.div>
      </section>

      {/* Services Overview */}
      <section id="services" ref={servicesRef} className="py-12 sm:py-16 lg:py-20 section-gradient">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            className="text-center mb-8 sm:mb-12 lg:mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={servicesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 glass-card px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-gray-300">Our Services</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 px-4">What We Automate</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Transform your business operations with our comprehensive automation solutions designed for modern enterprises
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: Zap, title: "Workflow Automation", description: "Streamline your business processes with intelligent workflow automation that works 24/7." },
              { icon: Bot, title: "AI Agent Integration", description: "Deploy intelligent AI agents that handle customer support, lead qualification, and more." },
              { icon: Briefcase, title: "Custom SaaS Automation", description: "Build custom automation solutions tailored to your specific business needs." },
              { icon: BarChart3, title: "Business Intelligence", description: "Create powerful dashboards and reports that provide actionable business insights." },
              { icon: Target, title: "Pre-Built Templates", description: "Launch faster with our library of proven automation templates for every industry." },
              { icon: Globe, title: "Hosting & API Management", description: "Reliable hosting and API management to keep your automations running smoothly." },
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
                >
                <Card className="service-card h-full">
                  <CardContent className="p-6 sm:p-8 relative z-10">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 border-2 border-primary/30 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:border-primary group-hover:bg-primary/5 transition-all duration-300">
                      <service.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary group-hover:text-primary" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white">{service.title}</h3>
                    <p className="text-sm sm:text-base text-gray-400 leading-relaxed">{service.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16 px-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 text-white">Your tools, seamlessly connected</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-400">We integrate with the platforms you already use</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {[
              { name: "n8n", icon: SiN8N },
              { name: "Zapier", icon: SiZapier },
              { name: "Make", icon: SiMake },
              { name: "Slack", icon: SiSlack },
              { name: "HubSpot", icon: SiHubspot },
              { name: "Shopify", icon: SiShopify },
              { name: "Gmail", icon: SiGmail },
              { name: "Trello", icon: SiTrello }
            ].map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <Card className="glass-card p-4 sm:p-6 hover:border-primary/30 transition-all duration-300 aspect-square flex items-center justify-center">
                  <CardContent className="p-0 text-center">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:bg-primary/20 transition-colors">
                      <tech.icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-[10px] sm:text-xs font-medium text-gray-300 group-hover:text-white transition-colors">{tech.name}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-500 text-sm">+ 5000 more integrations</p>
          </div>
        </div>
      </section>

      {/* Testimonials & Trust Signals */}
      <section className="py-20 bg-gray-950">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-white">Trusted by Growing Businesses</h2>
            <p className="text-xl text-gray-400">Join 100+ companies that have automated their success</p>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-4">
            {[
              { number: "100+", label: "Businesses Served" },
              { number: "250+", label: "Automations Built" },
              { number: "40hrs", label: "Average Weekly Savings" },
              { number: "350%", label: "Average ROI" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center px-2"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-sm md:text-base text-gray-400 leading-tight min-h-[2.5rem] md:min-h-[3rem] flex items-center justify-center">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center mb-16 -mt-2"
          >
            <BookingButton 
              className="bg-primary hover:bg-primary/90 text-white shadow-2xl px-8 py-4 text-base font-semibold rounded-full flex items-center gap-2 transition-all hover:scale-105"
              calLink="grow-fast-with-us/30min"
            >
              <Sparkles className="w-5 h-5" />
              Book Free Consultation
            </BookingButton>
          </motion.div>
          
          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "GrowFastWithUs transformed our workflow completely. We went from 20 hours of manual work per week to just 2 hours.",
                author: "Sarah Johnson",
                title: "CEO, TechStart Solutions",
                rating: 5
              },
              {
                quote: "The ROI was incredible. We saved £15,000 in the first year alone and our team can focus on strategic work now.",
                author: "Michael Chen",
                title: "Operations Director, ScaleUp Ltd",
                rating: 5
              },
              {
                quote: "Professional, reliable, and results-driven. The automation they built has been running flawlessly for 8 months.",
                author: "Emma Rodriguez",
                title: "Founder, Digital Agency Pro",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Card className="service-card h-full">
                  <CardContent className="p-8 relative z-10">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-primary fill-current" />
                      ))}
                    </div>
                    <Quote className="w-8 h-8 text-primary/30 mb-4" />
                    <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.quote}"</p>
                    <div>
                      <div className="font-semibold text-white">{testimonial.author}</div>
                      <div className="text-sm text-gray-400">{testimonial.title}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {/* Trust Badges */}
          <div className="mt-16 text-center">
            <p className="text-gray-400 mb-8">Trusted & Secure</p>
            <div className="flex flex-wrap justify-center items-center gap-8">
              <div className="flex items-center gap-2 text-gray-400">
                <Shield className="w-5 h-5 text-primary" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Award className="w-5 h-5 text-primary" />
                <span>Certified Partners</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Globe className="w-5 h-5 text-primary" />
                <span>Global Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-white">How It <span className="text-primary">Works</span></h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              From consultation to implementation, we make automation simple and stress-free.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {[
              {
                number: "01",
                title: "Free Discovery Call",
                description: "Tell us your goals and challenges. We'll map the best automation path for your business in just 30 minutes.",
                icon: Phone,
                duration: "30 min"
              },
              {
                number: "02", 
                title: "Custom Automation Setup",
                description: "We build and connect automations tailored to your business, testing everything before you go live.",
                icon: Cog,
                duration: "1-2 weeks"
              },
              {
                number: "03",
                title: "Launch & Ongoing Support", 
                description: "Go live with peace of mind. We provide monitoring, optimization, and continuous support as you scale.",
                icon: TrendingUp,
                duration: "Ongoing"
              }
            ].map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="text-center group"
              >
                <div className="relative mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg group-hover:shadow-primary/50 transition-all duration-300">
                    <span className="text-white font-bold text-lg">{step.number}</span>
                  </div>
                  <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mx-auto group-hover:bg-gray-700 transition-colors">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed mb-4">{step.description}</p>
                <div className="inline-flex items-center px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                  <span className="text-primary text-sm font-medium">{step.duration}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Showcase */}
      <section id="templates" ref={templatesRef} className="py-20 bg-gray-950">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={templatesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-white">Ready-to-Go Templates</h2>
            <p className="text-xl text-gray-400 mb-8">Launch in days, not months</p>
            
            {/* Template Filter */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.slice(0, 6).map((template, index) => {
              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={templatesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group"
                >
                  <Card className="service-card h-full relative overflow-hidden">
                    <CardContent className="p-8 relative z-10">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-primary/50 transition-all duration-300">
                        <Zap className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-white">{template.title}</h3>
                      <p className="text-gray-400 mb-6 leading-relaxed">{template.description}</p>
                      <div className="space-y-2 mb-6">
                        {template.tiers[0].features.slice(0, 3).map((feature) => (
                          <div key={feature} className="flex items-center text-sm text-gray-300">
                            <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-3xl font-bold text-primary">€{template.tiers[0].monthlyFee}/mo</div>
                        <Link href={`/template/${template.id}`}>
                          <Button variant="outline" className="group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all border-gray-600 text-gray-300">
                            Learn More
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link href="/templates">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-4">
                View All Templates
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Advanced Pricing Calculator */}
      <section id="pricing" ref={pricingRef} className="py-12 sm:py-16 lg:py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            className="text-center mb-8 sm:mb-12 lg:mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={pricingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
              <div className="text-left px-4 sm:px-0">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 text-white">Calculate Your Automation Investment</h2>
                <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-2xl">
                  See your potential ROI and cost savings with our interactive calculator
                </p>
              </div>
              <CurrencySelector 
                selectedCurrency={selectedCurrency}
                onCurrencyChange={setSelectedCurrency}
                className="mt-0 sm:mt-2 self-start sm:self-auto px-4 sm:px-0"
              />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 max-w-6xl mx-auto">
            {/* Calculator Input */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={pricingInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="glass-card p-4 sm:p-6 lg:p-8">
                <CardContent className="p-0 space-y-6 sm:space-y-8">
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white">Business Details</h3>
                  
                  {/* Business Size */}
                  <div>
                    <h4 className="font-semibold mb-3 sm:mb-4 text-white text-sm sm:text-base">Business Size</h4>
                    <div className="grid grid-cols-1 gap-2 sm:gap-3">
                      {businessSizes.map((size) => (
                        <Button
                          key={size}
                          type="button"
                          variant={businessSize === size ? "default" : "outline"}
                          className="h-auto p-3 sm:p-4 text-left justify-start text-sm sm:text-base touch-manipulation min-h-[44px]"
                          onClick={() => setBusinessSize(size)}
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Pain Points */}
                  <div>
                    <h4 className="font-semibold mb-3 sm:mb-4 text-white text-sm sm:text-base">Current Pain Points (Select all that apply)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {painPointOptions.map((painPoint) => (
                        <div key={painPoint} className="flex items-center space-x-2 sm:space-x-3 min-h-[44px]">
                          <Checkbox
                            id={painPoint}
                            checked={painPoints.includes(painPoint)}
                            onCheckedChange={(checked) =>
                              handlePainPointChange(painPoint, checked as boolean)
                            }
                            className="h-5 w-5 sm:h-4 sm:w-4"
                          />
                          <label htmlFor={painPoint} className="text-sm cursor-pointer text-gray-300 touch-manipulation">
                            {painPoint}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Time Investment */}
                  <div>
                    <h4 className="font-semibold mb-3 sm:mb-4 text-white text-sm sm:text-base">Hours spent on manual tasks per week: {timeSpent[0]}</h4>
                    <div className="space-y-3 sm:space-y-4">
                      <Slider
                        value={timeSpent}
                        onValueChange={setTimeSpent}
                        max={40}
                        min={1}
                        step={1}
                        className="w-full touch-manipulation"
                      />
                      <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
                        <span>1 hour</span>
                        <span>40+ hours</span>
                      </div>
                    </div>
                  </div>

                  {/* Templates Selection */}
                  <div>
                    <h4 className="font-semibold mb-4 text-white">Select Templates (Optional)</h4>
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {templates.slice(0, 8).map((template) => (
                        <div key={template.id} className="flex items-center justify-between p-3 border border-gray-700 rounded-lg bg-gray-800/50">
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id={template.id}
                              checked={selectedTemplates.includes(template.id)}
                              onCheckedChange={(checked) =>
                                handleTemplateSelect(template.id, checked as boolean)
                              }
                            />
                            <div>
                              <label htmlFor={template.id} className="text-sm font-medium cursor-pointer text-white">
                                {template.title}
                              </label>
                              <p className="text-xs text-gray-400">{template.category}</p>
                            </div>
                          </div>
                          <div className="text-sm font-semibold text-primary">
                            {formatPrice(convertPrice(template.tiers[0].monthlyFee, 'EUR', selectedCurrency.code), selectedCurrency.code)}/mo
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Voice AI Add-ons */}
                  <div>
                    <h4 className="font-semibold mb-4 text-white">Voice AI Add-ons (Optional)</h4>
                    <p className="text-sm text-gray-400 mb-4">
                      Add inbound & outbound AI voice calling capabilities to your automation
                    </p>
                    <div className="grid grid-cols-1 gap-4">
                      {voiceAIAddons.map((addon) => (
                        <VoiceAIAddonCard
                          key={addon.id}
                          addon={addon}
                          currency={selectedCurrency}
                          isSelected={selectedVoiceAddons.includes(addon.id)}
                          onToggle={handleVoiceAddonToggle}
                          className="transition-all hover:shadow-md"
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Results Display */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={pricingInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="glass-card p-4 sm:p-6 lg:p-8 lg:sticky lg:top-24">
                <CardContent className="p-0">
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white">Your Investment Breakdown</h3>
                  
                  <div className="space-y-6">
                    {/* Cost Breakdown */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                        <span className="font-medium text-gray-300">Setup Fee</span>
                        <span className="text-xl font-bold text-white">{formatPrice(pricing.setupFee, selectedCurrency.code)}</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                        <span className="font-medium text-gray-300">Monthly Fee</span>
                        <span className="text-xl font-bold text-white">{formatPrice(pricing.monthlyFee, selectedCurrency.code)}/mo</span>
                      </div>
                    </div>

                    {/* Savings */}
                    <div className="border-t pt-6">
                      <h4 className="font-semibold mb-4 text-primary">Your Savings</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Time Saved Monthly</span>
                          <span className="font-semibold text-white">{pricing.timeSaved} hours</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Cost Savings Monthly</span>
                          <span className="font-semibold text-primary">{formatPrice(pricing.costSavings, selectedCurrency.code)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Annual Savings</span>
                          <span className="font-semibold text-primary">{formatPrice(pricing.costSavings * 12, selectedCurrency.code)}</span>
                        </div>
                      </div>
                    </div>

                    {/* ROI */}
                    <div className="border-t pt-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary mb-2">
                          {pricing.roi > 0 ? '+' : ''}{pricing.roi}%
                        </div>
                        <p className="text-sm text-gray-400 mb-4">12-Month ROI</p>
                        {pricing.roi > 0 && (
                          <p className="text-sm text-green-600">
                            Break-even in {pricing.breakEven} months
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Visual ROI Chart */}
                    <div className="border-t pt-6">
                      <h4 className="font-semibold mb-4 text-white">ROI Timeline</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Investment</span>
                          <span className="text-gray-300">Savings</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-4 relative overflow-hidden">
                          <div 
                            className="bg-red-500 h-full absolute left-0"
                            style={{ width: '40%' }}
                          ></div>
                          <div 
                            className="bg-green-500 h-full absolute"
                            style={{ left: '40%', width: '60%' }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>£{(pricing.setupFee + pricing.monthlyFee * 12).toLocaleString()}</span>
                          <span>£{(pricing.costSavings * 12).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="border-t pt-6">
                      <Button 
                        size="lg" 
                        className="w-full bg-primary hover:bg-primary/90 text-white"
                        onClick={() => scrollToSection('contact')}
                      >
                        Get Custom Quote
                      </Button>
                      <p className="text-xs text-center text-gray-400 mt-2">
                        No obligation • Free consultation
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-white">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-400">Everything you need to know about automation</p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-4">
            <Card className="service-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-3">How long does it take to set up automation?</h3>
                <p className="text-gray-400 leading-relaxed">Most automations are completed within 1-2 weeks. Simple workflows can be ready in 2-3 days, while complex multi-system integrations may take up to 4 weeks.</p>
              </CardContent>
            </Card>
            
            <Card className="service-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-3">What if I don't have technical knowledge?</h3>
                <p className="text-gray-400 leading-relaxed">No technical knowledge required! We handle everything from setup to maintenance. We also provide training so your team can understand and use the automations effectively.</p>
              </CardContent>
            </Card>
            
            <Card className="service-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Can you integrate with our existing tools?</h3>
                <p className="text-gray-400 leading-relaxed">Yes! We work with 5000+ popular business tools including CRMs, email platforms, accounting software, project management tools, and custom APIs.</p>
              </CardContent>
            </Card>
            
            <Card className="service-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-3">What's included in ongoing support?</h3>
                <p className="text-gray-400 leading-relaxed">24/7 monitoring, bug fixes, performance optimization, and updates when your connected tools change. Plus monthly check-ins to identify new automation opportunities.</p>
              </CardContent>
            </Card>
            
            <Card className="service-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-3">How do you ensure data security?</h3>
                <p className="text-gray-400 leading-relaxed">We follow enterprise-grade security practices including encrypted connections, minimal data access, regular security audits, and GDPR compliance for all automations.</p>
              </CardContent>
            </Card>
            
            <Card className="service-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-3">What's your refund policy?</h3>
                <p className="text-gray-400 leading-relaxed">30-day money-back guarantee if you're not satisfied with the initial automation setup. Ongoing monthly fees can be cancelled anytime with 30 days notice.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Lead Magnet Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-white">Free Automation Audit</h2>
              <p className="text-xl text-gray-400 mb-8">
                Get a comprehensive analysis of your business processes and discover 
                automation opportunities worth thousands in savings
              </p>
              
              <Card className="service-card p-8 max-w-2xl mx-auto">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="text-left">
                      <h3 className="text-2xl font-bold mb-4 text-white">What You'll Get:</h3>
                      <ul className="space-y-3">
                        {[
                          "Process efficiency analysis",
                          "Cost savings projections", 
                          "Custom automation roadmap",
                          "ROI timeline estimates",
                          "Priority implementation plan"
                        ].map((item) => (
                          <li key={item} className="flex items-center text-gray-300">
                            <CheckCircle className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="text-center">
                      <div className="mb-6">
                        <Download className="w-16 h-16 text-primary mx-auto mb-4" />
                        <div className="text-3xl font-bold text-primary mb-2">£2,500 Value</div>
                        <div className="text-lg text-white">Completely Free</div>
                      </div>
                      
                      <Button 
                        size="lg" 
                        className="w-full bg-primary hover:bg-primary/90 text-white"
                        onClick={() => scrollToSection('contact')}
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Claim Your Free Audit
                      </Button>
                      
                      <p className="text-xs text-gray-400 mt-4">
                        No spam, unsubscribe anytime. Usually delivered within 24 hours.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-50">
        {/* Back to Top Button */}
        <motion.button
          className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: scrolled ? 1 : 0, scale: scrolled ? 1 : 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ArrowUp className="w-6 h-6 text-white" />
        </motion.button>
      </div>

      {/* Trust Badges Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">Trusted by Leading Companies</h2>
            <p className="text-gray-400">Join thousands of businesses that have automated their success</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
            {/* Trust Badge Items */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center mb-3">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm text-gray-400">SOC 2 Certified</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center mb-3">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm text-gray-400">Industry Leader</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center mb-3">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm text-gray-400">2,500+ Clients</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center mb-3">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm text-gray-400">4.9/5 Rating</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center mb-3">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm text-gray-400">99.9% Uptime</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center mb-3">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm text-gray-400">Global Reach</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-gradient-to-br from-primary/15 via-accent/10 to-secondary/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 glass-card px-4 py-2 rounded-full mb-8">
              <Mail className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-gray-300">Newsletter</span>
            </div>
            
            <h2 className="text-section-title text-white mb-6">Stay Ahead of the Automation Curve</h2>
            <p className="text-large text-gray-300 mb-12 max-w-3xl mx-auto">
              Get weekly automation insights, industry case studies, and exclusive templates delivered to your inbox. 
              Join 2,500+ business leaders who trust our expertise.
            </p>
            
            <Card className="glass-card p-10 max-w-2xl mx-auto border border-primary/20">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    type="email"
                    placeholder="Enter your business email"
                    className="flex-1 px-6 py-4 bg-black/30 border-2 border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-primary focus:outline-none transition-all duration-300 text-lg"
                  />
                  <Button 
                    className="btn-primary text-white px-8 py-4 text-lg rounded-xl"
                    onClick={handleEmailSubscription}
                    disabled={emailSubscribed}
                  >
                    {emailSubscribed ? (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5" />
                        <span>Subscribed!</span>
                      </div>
                    ) : (
                      <>
                        <Mail className="w-5 h-5 mr-2" />
                        Subscribe Now
                      </>
                    )}
                  </Button>
                </div>
                <div className="flex items-center justify-center mt-6 space-x-6 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>No spam guarantee</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Unsubscribe anytime</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Weekly insights</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-950">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-white">Ready to Automate Your Success?</h2>
              <p className="text-xl text-gray-400">
                Get started with a free discovery call to explore how automation can transform your business
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card className="glass-card p-8">
                  <CardContent className="p-0">
                    <h3 className="text-2xl font-bold mb-6 text-white">Start Your Automation Journey</h3>
                    <AdvancedContactForm />
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <Card className="glass-card p-8">
                  <CardContent className="p-0">
                    <h3 className="text-2xl font-bold mb-6 text-white">Why Choose Us?</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-primary mr-3" />
                        <span className="text-gray-300">30-minute consultation with automation expert</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-primary mr-3" />
                        <span className="text-gray-300">Custom automation strategy for your business</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-primary mr-3" />
                        <span className="text-gray-300">ROI projections and timeline estimates</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-primary mr-3" />
                        <span className="text-gray-300">No obligation, completely free</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card p-8">
                  <CardContent className="p-0">
                    <h3 className="text-2xl font-bold mb-6 text-white">Contact Information</h3>
                    <div className="space-y-6">
                      <div className="flex items-center">
                        <Mail className="w-6 h-6 text-primary mr-4" />
                        <div>
                          <p className="font-semibold text-white">Email</p>
                          <p className="text-gray-400">hello@growfastwithus.com</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-6 h-6 text-primary mr-4" />
                        <div>
                          <p className="font-semibold text-white">Phone</p>
                          <p className="text-gray-400">+44 20 7946 0958</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-6 h-6 text-primary mr-4" />
                        <div>
                          <p className="font-semibold text-white">Business Hours</p>
                          <p className="text-gray-400">Mon-Fri: 9AM-6PM GMT</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="w-6 h-6 text-primary mr-4 mt-1" />
                        <div>
                          <p className="font-semibold text-white">Regions Served</p>
                          <div className="text-gray-400 space-y-1">
                            <div>🇬🇧 United Kingdom</div>
                            <div>🇺🇸 United States</div>
                            <div>🇦🇺 Australia</div>
                            <div>🇪🇺 Europe</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-t from-black via-gray-950 to-gray-900 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <img 
                  src="/logo.png" 
                  alt="GrowFastWithUs Logo" 
                  className="h-12 sm:h-14 w-auto"
                  loading="eager"
                />
              </div>
              <p className="text-lg text-gray-300 mb-8 max-w-md leading-relaxed">
                Empowering businesses worldwide with intelligent automation solutions that drive growth, efficiency, and success.
              </p>
              
              {/* Social Media Links */}
              <div className="flex space-x-4">
                <a href="https://linkedin.com/company/growfastwithus" target="_blank" rel="noopener noreferrer" 
                   className="w-12 h-12 bg-gradient-to-r from-blue-700 to-blue-500 rounded-xl flex items-center justify-center hover:from-primary hover:to-accent transition-all duration-300 group shadow-lg"
                   aria-label="LinkedIn">
                  <svg className="w-6 h-6 text-white group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.968v5.699h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.601 2.001 3.601 4.601v5.595z"/></svg>
                </a>
                <a href="https://twitter.com/growfastwithus" target="_blank" rel="noopener noreferrer"
                   className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center hover:from-primary hover:to-accent transition-all duration-300 group shadow-lg"
                   aria-label="Twitter">
                  <svg className="w-6 h-6 text-white group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.92 4.92 0 0 0-8.384 4.482c-4.086-.205-7.713-2.164-10.141-5.144a4.822 4.822 0 0 0-.666 2.475c0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417a9.867 9.867 0 0 1-6.102 2.104c-.396 0-.787-.023-1.175-.069a13.945 13.945 0 0 0 7.548 2.212c9.057 0 14.009-7.513 14.009-14.009 0-.213-.005-.425-.014-.636a10.012 10.012 0 0 0 2.457-2.548z"/></svg>
                </a>
                <a href="https://youtube.com/@growfastwithus" target="_blank" rel="noopener noreferrer"
                   className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-400 rounded-xl flex items-center justify-center hover:from-primary hover:to-accent transition-all duration-300 group shadow-lg"
                   aria-label="YouTube">
                  <svg className="w-6 h-6 text-white group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.112c-1.863-.502-9.386-.502-9.386-.502s-7.523 0-9.386.502a2.994 2.994 0 0 0-2.112 2.112c-.502 1.863-.502 5.754-.502 5.754s0 3.891.502 5.754a2.994 2.994 0 0 0 2.112 2.112c1.863.502 9.386.502 9.386.502s7.523 0 9.386-.502a2.994 2.994 0 0 0 2.112-2.112c.502-1.863.502-5.754.502-5.754s0-3.891-.502-5.754zm-13.498 9.814v-7l6.5 3.5-6.5 3.5z"/></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <Link href="/services" className="hover:text-primary transition-colors cursor-pointer">
                    Workflow Automation
                  </Link>
                </li>
                <li className="flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-primary" />
                  <Link href="/services" className="hover:text-primary transition-colors cursor-pointer">
                    AI Agent Integration
                  </Link>
                </li>
                <li className="flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-primary" />
                  <Link href="/services" className="hover:text-primary transition-colors cursor-pointer">
                    Custom SaaS Solutions
                  </Link>
                </li>
                <li className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <Link href="/services" className="hover:text-primary transition-colors cursor-pointer">
                    Business Intelligence
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center space-x-2">
                  <Stethoscope className="w-4 h-4 text-primary" />
                  <Link href="/templates" className="hover:text-primary transition-colors cursor-pointer">
                    Templates
                  </Link>
                </li>
                <li className="flex items-center space-x-2">
                  <ShoppingCart className="w-4 h-4 text-primary" />
                  <Link href="/blog" className="hover:text-primary transition-colors cursor-pointer">
                    Blog & Insights
                  </Link>
                </li>
                <li className="flex items-center space-x-2">
                  <HomeIcon className="w-4 h-4 text-primary" />
                  <Link href="/services" className="hover:text-primary transition-colors cursor-pointer">
                    Services
                  </Link>
                </li>
                <li className="flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-primary" />
                  <Link href="/booking" className="hover:text-primary transition-colors cursor-pointer">
                    Book Consultation
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Regions</h4>
              <ul className="space-y-2">
                <li className="text-gray-400 flex items-center"><MapPin className="w-4 h-4 mr-2" /> United Kingdom</li>
                <li className="text-gray-400 flex items-center"><MapPin className="w-4 h-4 mr-2" /> United States</li>
                <li className="text-gray-400 flex items-center"><MapPin className="w-4 h-4 mr-2" /> Australia</li>
                <li className="text-gray-400 flex items-center"><MapPin className="w-4 h-4 mr-2" /> Europe</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">© 2025 GrowFastWithUs. All rights reserved.</p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-end">
              <Link href="/blog" className="text-gray-400 hover:text-primary transition-colors">Blog</Link>
              <Link href="/privacy-policy" className="text-gray-400 hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="/terms-of-service" className="text-gray-400 hover:text-primary transition-colors">Terms of Service</Link>
              <Link href="/gdpr" className="text-gray-400 hover:text-primary transition-colors">GDPR</Link>
              <Link href="/booking" className="text-gray-400 hover:text-primary transition-colors">Book Consultation</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
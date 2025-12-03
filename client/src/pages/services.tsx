import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { SEOHead } from "@/components/SEOHead";
import {
  Zap,
  Bot,
  Briefcase,
  BarChart3,
  Target,
  Globe,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Shield,
  TrendingUp,
  Clock,
  Users,
  Code,
  Cloud,
  Database,
  MessageSquare,
  Workflow,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export default function Services() {
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [expandedService, setExpandedService] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyCTA(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const services = [
    {
      icon: Zap,
      title: "Workflow Automation",
      description: "Streamline your business processes with intelligent workflow automation that works 24/7.",
      longDescription: "Transform repetitive tasks into seamless automated workflows. We design, build, and manage custom automation solutions that connect your tools, eliminate manual work, and ensure nothing falls through the cracks.",
      features: [
        "End-to-end process automation",
        "Cross-platform integration",
        "Real-time data synchronization",
        "Automated reporting and analytics",
        "Error handling and notifications"
      ],
      benefits: [
        "Save 15-40 hours per week",
        "Reduce human error by 95%",
        "24/7 automated operations",
        "Scale without adding headcount"
      ]
    },
    {
      icon: Bot,
      title: "AI Agent Integration",
      description: "Deploy intelligent AI agents that handle customer support, lead qualification, and more.",
      longDescription: "Leverage cutting-edge AI technology with GPT-4, natural language processing, and machine learning to create intelligent agents that understand context, learn from interactions, and provide human-like responses.",
      features: [
        "24/7 AI customer support",
        "Intelligent lead scoring and routing",
        "Natural language understanding",
        "Sentiment analysis and prioritization",
        "Multi-language support"
      ],
      benefits: [
        "80% reduction in response time",
        "Handle 10x more inquiries",
        "Improve customer satisfaction by 40%",
        "Qualify leads automatically"
      ]
    },
    {
      icon: Briefcase,
      title: "Custom SaaS Automation",
      description: "Build custom automation solutions tailored to your specific business needs.",
      longDescription: "Every business is unique. We create bespoke automation solutions that fit your exact requirements, integrate with your existing systems, and grow with your business—from simple workflows to complex enterprise automation.",
      features: [
        "Fully customized workflows",
        "Enterprise system integration",
        "Dedicated development team",
        "Scalable architecture",
        "Ongoing optimization"
      ],
      benefits: [
        "100% tailored to your needs",
        "Unlimited workflow complexity",
        "Priority support and maintenance",
        "Strategic automation roadmap"
      ]
    },
    {
      icon: BarChart3,
      title: "Business Intelligence",
      description: "Create powerful dashboards and reports that provide actionable business insights.",
      longDescription: "Turn your data into strategic advantages. We build real-time dashboards, automated reporting systems, and predictive analytics that help you make informed decisions faster.",
      features: [
        "Real-time analytics dashboards",
        "Automated report generation",
        "Predictive analytics and forecasting",
        "Multi-source data aggregation",
        "Custom KPI tracking"
      ],
      benefits: [
        "Make data-driven decisions",
        "Identify trends early",
        "Optimize resource allocation",
        "Improve forecasting accuracy by 60%"
      ]
    },
    {
      icon: Target,
      title: "Pre-Built Templates",
      description: "Launch faster with our library of proven automation templates for every industry.",
      longDescription: "Get started in days, not months. Our ready-to-deploy automation templates are optimized for specific industries and use cases, with proven ROI across healthcare, e-commerce, real estate, and more.",
      features: [
        "15+ industry-specific templates",
        "Tested and proven workflows",
        "Quick 3-5 day deployment",
        "Customizable to your needs",
        "Regular updates and improvements"
      ],
      benefits: [
        "Fast time-to-value (3-5 days)",
        "Lower implementation costs",
        "Proven ROI in similar businesses",
        "Easy to scale and expand"
      ]
    },
    {
      icon: Globe,
      title: "Hosting & API Management",
      description: "Reliable hosting and API management to keep your automations running smoothly.",
      longDescription: "Focus on your business while we handle the infrastructure. We provide enterprise-grade hosting, proactive monitoring, API cost management, and 24/7 uptime monitoring with 99.5%+ SLA.",
      features: [
        "99.5%-99.99% uptime SLA",
        "API usage optimization",
        "Proactive monitoring and alerts",
        "Multi-region redundancy",
        "Automatic scaling"
      ],
      benefits: [
        "Zero infrastructure headaches",
        "Predictable API costs",
        "24/7 monitoring and support",
        "Enterprise-grade reliability"
      ]
    }
  ];

  const howWeWork = [
    {
      step: "01",
      title: "Discovery & ROI Assessment",
      description: "We analyze your workflows, identify automation opportunities, and project measurable ROI before you commit.",
      icon: Users
    },
    {
      step: "02",
      title: "Design & Proposal",
      description: "Receive a detailed proposal with workflow diagrams, pricing, timelines, and expected outcomes.",
      icon: Code
    },
    {
      step: "03",
      title: "Build & Test",
      description: "Our team builds and rigorously tests your automation in a staging environment before launch.",
      icon: Workflow
    },
    {
      step: "04",
      title: "Launch & Training",
      description: "We deploy to production, train your team, and ensure everything works perfectly.",
      icon: Sparkles
    },
    {
      step: "05",
      title: "Ongoing Management",
      description: "We monitor, maintain, and optimize your automations with monthly reports and quarterly reviews.",
      icon: TrendingUp
    }
  ];

  const techStack = [
    { name: "n8n", category: "Automation Engine" },
    { name: "OpenAI GPT-4", category: "AI & NLP" },
    { name: "ElevenLabs", category: "Voice AI" },
    { name: "Twilio", category: "Messaging" },
    { name: "PostgreSQL", category: "Database" },
    { name: "AWS", category: "Cloud Hosting" },
    { name: "Make.com", category: "Integration" },
    { name: "Zapier", category: "Connectivity" }
  ];

  const whyChooseUs = [
    {
      icon: Clock,
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
      icon: Users,
      title: "Full Service",
      description: "We handle hosting, monitoring, maintenance, and support"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      <SEOHead
        title="Our Services - AI-Powered Automation Solutions | GrowFastWithUs"
        description="Discover our comprehensive automation services: Workflow Automation, AI Agent Integration, Custom SaaS Solutions, Business Intelligence, and more. Enterprise-grade solutions with proven ROI."
        keywords="automation services, AI integration, workflow automation, business intelligence, custom saas, API management"
        canonical="/services"
      />

      {/* Page Header */}
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
            <Link href="/booking">
              <Button 
                className="w-full backdrop-blur-xl bg-primary/20 hover:bg-primary/30 border border-primary/40 text-white shadow-2xl py-6 text-base font-semibold rounded-full transition-all"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Get Started Now
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Services Grid */}
      <section className="pt-20 sm:pt-24 lg:pt-28 pb-8 sm:pb-12 px-4 sm:px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">Our Services</h2>
            <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto px-4">
              Comprehensive automation solutions designed to transform your business operations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {services.map((service, index) => {
              const isExpanded = expandedService === index;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800 hover:border-primary/50 transition-all duration-300 group">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex gap-3 sm:gap-4 items-start flex-1">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gray-800/50 border border-gray-700 flex items-center justify-center group-hover:border-primary/50 transition-all duration-300 flex-shrink-0">
                            <service.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary/70 stroke-[1.5]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">{service.title}</h3>
                            <p className="text-sm sm:text-base text-gray-400 mb-3">{service.description}</p>
                          </div>
                        </div>
                        {/* Mobile Expand Toggle */}
                        <button
                          onClick={() => setExpandedService(isExpanded ? null : index)}
                          className="lg:hidden flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors touch-manipulation"
                          aria-label={isExpanded ? "Show less" : "Show more"}
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-primary" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-primary" />
                          )}
                        </button>
                      </div>
                      
                      {/* Always visible on desktop, collapsible on mobile */}
                      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block`}>
                        <p className="text-xs sm:text-sm text-gray-300 mb-4 sm:mb-6">{service.longDescription}</p>
                        
                        <div className="mb-4 sm:mb-6">
                          <h4 className="text-xs sm:text-sm font-semibold text-primary mb-2 sm:mb-3">Key Features:</h4>
                          <ul className="space-y-1.5 sm:space-y-2">
                            {service.features.slice(0, 3).map((feature, i) => (
                              <li key={i} className="flex items-start text-xs sm:text-sm text-gray-400">
                                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-3 sm:pt-4 border-t border-gray-800">
                          <h4 className="text-xs sm:text-sm font-semibold text-accent mb-2">Benefits:</h4>
                          <div className="flex flex-wrap gap-2">
                            {service.benefits.slice(0, 2).map((benefit, i) => (
                              <Badge key={i} variant="outline" className="text-[10px] sm:text-xs border-primary/30 text-gray-300">
                                {benefit}
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
      </section>

      {/* How We Work Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gradient-to-b from-gray-900/50 to-transparent">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12 lg:mb-16 px-4"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">How We Work</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto">
              Our proven 5-phase process ensures fast delivery with measurable results
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
            {howWeWork.map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                <Card className="h-full bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800 hover:border-primary/50 transition-all duration-300">
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="text-4xl sm:text-5xl font-bold text-primary/20 mb-3 sm:mb-4">{phase.step}</div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-800/50 border border-gray-700 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <phase.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary/70 stroke-[1.5]" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-3">{phase.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-400">{phase.description}</p>
                  </CardContent>
                </Card>
                {index < howWeWork.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-primary/30" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12 lg:mb-16 px-4"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">Why Choose GrowFastWithUs</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto">
              We combine speed, expertise, and proven results to deliver automation that transforms your business
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {whyChooseUs.map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800 hover:border-primary/50 transition-all duration-300 text-center">
                  <CardContent className="p-4 sm:p-6">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-800/50 border border-gray-700 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <reason.icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary/70 stroke-[1.5]" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{reason.title}</h3>
                    <p className="text-sm sm:text-base text-gray-400">{reason.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gradient-to-b from-gray-900/50 to-transparent">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12 lg:mb-16 px-4"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">Our Technology Stack</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto">
              Enterprise-grade tools and platforms powering your automation
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {techStack.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800 hover:border-primary/50 transition-all duration-300">
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-800/50 border border-gray-700 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                      <Cloud className="w-5 h-5 sm:w-6 sm:h-6 text-primary/70 stroke-[1.5]" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold mb-1">{tech.name}</h3>
                    <p className="text-[10px] sm:text-xs text-gray-500">{tech.category}</p>
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
            className="relative rounded-xl sm:rounded-2xl p-6 sm:p-10 lg:p-12 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 border border-primary/30 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5" />
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                Ready to Transform Your Business?
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8">
                Schedule a free consultation and discover how automation can generate measurable ROI for your business within weeks.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link href="/booking">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 w-full sm:w-auto py-6 sm:py-3 text-base touch-manipulation">
                    Get Started Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/templates">
                  <Button size="lg" variant="outline" className="border-primary/30 hover:bg-primary/10 w-full sm:w-auto py-6 sm:py-3 text-base touch-manipulation">
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


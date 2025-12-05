import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import {
  Rocket,
  Target,
  Users,
  Award,
  TrendingUp,
  Shield,
  Lightbulb,
  Zap,
  Globe,
  CheckCircle,
  ArrowRight,
  Heart,
  Clock,
  Star,
  Building2,
  Sparkles,
  BarChart3,
  Handshake,
  Code,
  Brain,
  ChevronRight,
  Quote,
  DollarSign,
  Timer,
  Lock,
  Headphones,
  Stethoscope,
  ShoppingCart,
  Home as HomeIcon,
  Briefcase,
  GraduationCap,
  Utensils,
  Dumbbell,
  Scale
} from "lucide-react";

export default function About() {
  const heroRef = useRef(null);
  const storyRef = useRef(null);
  const turningPointRef = useRef(null);
  const whyExistRef = useRef(null);
  const differenceRef = useRef(null);
  const promiseRef = useRef(null);
  const futureRef = useRef(null);
  const teamRef = useRef(null);
  const testimonialsRef = useRef(null);
  const industriesRef = useRef(null);
  const statsRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true });
  const storyInView = useInView(storyRef, { once: true });
  const turningPointInView = useInView(turningPointRef, { once: true });
  const whyExistInView = useInView(whyExistRef, { once: true });
  const differenceInView = useInView(differenceRef, { once: true });
  const promiseInView = useInView(promiseRef, { once: true });
  const futureInView = useInView(futureRef, { once: true });
  const teamInView = useInView(teamRef, { once: true });
  const testimonialsInView = useInView(testimonialsRef, { once: true });
  const industriesInView = useInView(industriesRef, { once: true });
  const statsInView = useInView(statsRef, { once: true });

  const differences = [
    {
      icon: TrendingUp,
      title: "We Don't Just Connect Tools—We Engineer Profitability",
      description: "When you work with us, you're not getting a \"Zapier alternative.\" You're getting business engineers who understand how 38% no-show reduction translates to £6,500 monthly for a medical practice, why abandoned cart recovery isn't about emails—it's about timing, personalization, and multi-channel orchestration.",
      highlight: "Every automation we build has one goal: increase your bottom line."
    },
    {
      icon: Shield,
      title: "We Take the Risk, You Get the Results",
      description: "Most automation providers say \"we'll build what you ask for.\" We say \"we'll build what generates ROI.\" We start with ROI projections before a single line of code is written, deliver working solutions in 3-15 days, and include hosting, monitoring, API costs, and support in our pricing.",
      highlight: "You don't need to understand webhooks or API rate limits. You just need to see revenue grow and costs drop."
    },
    {
      icon: Award,
      title: "Industry Expertise That Saves You 6 Months of Trial and Error",
      description: "We've spent thousands of hours building, testing, and optimizing automations for healthcare practices managing 500+ appointments weekly, e-commerce brands processing 10,000+ orders monthly, and real estate agencies converting 300+ leads per month.",
      highlight: "This isn't generic automation. These are battle-tested workflows that already work in businesses like yours."
    },
    {
      icon: Rocket,
      title: "We Scale With You (Not Against You)",
      description: "Start with a single automation. Add more as you grow. Upgrade to enterprise features when you're ready. Unlike enterprise software that locks you into 3-year contracts, or DIY tools that abandon you when complexity grows—we're designed to evolve with your business.",
      highlight: "From £399/month to fully custom enterprise solutions, we meet you where you are and grow with you."
    }
  ];

  const promises = [
    {
      icon: Timer,
      title: "Speed Without Compromise",
      features: [
        "Ready-to-deploy solutions in 3-5 days for templates",
        "Custom enterprise automation in 15-45 days",
        "Real-time monitoring and instant issue resolution"
      ]
    },
    {
      icon: DollarSign,
      title: "ROI You Can Measure",
      features: [
        "Clear before/after metrics",
        "Monthly performance dashboards",
        "Direct impact tracking (revenue gains, cost savings, time recovered)"
      ]
    },
    {
      icon: Lock,
      title: "Security You Can Trust",
      features: [
        "GDPR and HIPAA compliant infrastructure",
        "Bank-grade encryption (AES-256)",
        "Role-based access controls and audit logging",
        "Annual security assessments and penetration testing"
      ]
    },
    {
      icon: Headphones,
      title: "Support That Actually Supports",
      features: [
        "Business-hours support for all clients",
        "8-hour priority response for Professional+ tiers",
        "24/7 support with dedicated account managers for Enterprise",
        "Quarterly optimization calls to ensure you're maximizing value"
      ]
    }
  ];

  const testimonials = [
    {
      quote: "We were spending 25 hours a week on appointment reminders and follow-ups. GrowFastWithUs reduced that to zero. Our no-shows dropped 40%, and we've added £8,000 in monthly revenue. Best investment we've made in years.",
      author: "Dr. Sarah Mitchell",
      role: "London Wellness Clinic",
      impact: "+£8,000 monthly revenue"
    },
    {
      quote: "I tried Zapier, Make, and even hired a freelancer. Nothing worked long-term. GrowFastWithUs not only built our automation—they monitor it, optimize it, and actually care about our results. We've doubled our order volume without hiring anyone.",
      author: "James Chen",
      role: "E-commerce Director, UrbanStyle Apparel",
      impact: "2x order volume"
    },
    {
      quote: "As a real estate broker managing 15 agents, lead follow-up was chaos. Now every lead is scored, routed, and followed up within 5 minutes—24/7. We've closed 30% more deals this quarter, and my agents actually have time to sell.",
      author: "Maria Santos",
      role: "Principal Broker, Santos Realty Group",
      impact: "+30% closed deals"
    }
  ];

  const industries = [
    { icon: Stethoscope, name: "Healthcare", description: "Medical practices, dental clinics, wellness centers" },
    { icon: ShoppingCart, name: "E-commerce", description: "D2C brands, multi-channel retailers, dropshipping" },
    { icon: HomeIcon, name: "Real Estate", description: "Agencies, brokerages, property management" },
    { icon: Briefcase, name: "Professional Services", description: "Legal, accounting, consulting, agencies" },
    { icon: GraduationCap, name: "Education", description: "Private schools, training institutes, online courses" },
    { icon: Utensils, name: "Hospitality", description: "Restaurants, hotels, event spaces" },
    { icon: Scale, name: "Financial Services", description: "Advisors, brokerages, lending platforms" },
    { icon: Building2, name: "Manufacturing", description: "Production planning, supply chain optimization" },
    { icon: Dumbbell, name: "Fitness & Wellness", description: "Gyms, studios, personal trainers" },
    { icon: Users, name: "Recruitment", description: "Agencies, internal HR teams, staffing firms" }
  ];

  const stats = [
    { number: "150+", label: "Businesses Automated", icon: Users },
    { number: "15+", label: "Industry Solutions", icon: Code },
    { number: "500%+", label: "Average ROI", icon: TrendingUp },
    { number: "99.7%", label: "Average Uptime", icon: Shield },
    { number: "<10%", label: "Annual Churn", icon: Award },
    { number: "€1.2M+", label: "ARR Projected", icon: BarChart3 }
  ];

  const excellenceSections = [
    {
      id: "technical",
      title: "Technical Excellence",
      points: [
        "Modular architecture ensuring every workflow is maintainable and scalable",
        "Version control and backup for instant rollback if needed",
        "Multi-region redundancy guaranteeing uptime even during provider outages",
        "Continuous monitoring with automated incident response",
      ],
    },
    {
      id: "operational",
      title: "Operational Excellence",
      points: [
        "Documented SOPs for every process, ensuring consistency",
        "Quality assurance testing before every deployment",
        "Client success tracking with regular performance reviews",
        "Proactive optimization to maximize ROI over time",
      ],
    },
    {
      id: "integrity",
      title: "Business Integrity",
      points: [
        "No hidden fees—API costs, hosting, and support included",
        "Transparent pricing with clear tier distinctions",
        "Honest capability assessment—we won't sell you what you don't need",
        "Partnership mindset—your success metrics are our success metrics",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <SEOHead
        title="About Us - GrowFastWithUs | Our Story, Mission & Why Choose Us"
        description="Discover how GrowFastWithUs is democratizing enterprise automation for businesses of all sizes. Read our story, meet our team, and see why 150+ businesses trust us."
        keywords="about growfastwithus, automation company story, business automation, why choose growfastwithus"
      />
      
      <PageHeader />

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-24 sm:pt-32 pb-8 sm:pb-12 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4 sm:space-y-6"
          >
            <Badge className="mb-2 sm:mb-4 bg-primary/20 text-primary border-primary/30 text-xs sm:text-sm">
              <Heart className="w-3 h-3 mr-1 sm:mr-2" />
              About Us
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white px-2">
              From Chaos to
              <span className="block text-primary">Clarity</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-2">
              Every successful business has a moment where everything changes. For us, that moment 
              came when we watched talented entrepreneurs drowning in manual processes—spending 
              40+ hours a week on tasks that could be automated in minutes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Problem Section */}
      <section ref={storyRef} className="py-8 sm:py-12 px-4 sm:px-6 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={storyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-8 sm:space-y-12"
          >
            <Card className="border-2 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6 sm:p-8 md:p-12">
                <div className="space-y-4 sm:space-y-6 text-base sm:text-lg leading-relaxed">
                  <p className="text-foreground/90">
                    We saw medical clinics losing thousands in revenue because appointment reminders 
                    were sent manually (and often forgotten). We watched e-commerce founders staying up 
                    until 2 AM syncing inventory across platforms. We witnessed real estate agents 
                    missing hot leads because follow-ups fell through the cracks.
                  </p>
                  
                  <p className="text-foreground/90">
                    The most frustrating part? <strong className="text-primary">The solutions existed.</strong> 
                    AI, automation, APIs—they were all there. But accessing them required either:
                  </p>

                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 my-6 sm:my-8">
                    <Card className="border-2 border-destructive/20 bg-destructive/5">
                      <CardContent className="p-4 sm:p-6">
                        <h4 className="font-semibold mb-2 text-destructive text-sm sm:text-base">Expensive Consultancies</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">Charging $50,000+ and taking 6 months to deliver</p>
                      </CardContent>
                    </Card>
                    <Card className="border-2 border-destructive/20 bg-destructive/5">
                      <CardContent className="p-4 sm:p-6">
                        <h4 className="font-semibold mb-2 text-destructive text-sm sm:text-base">DIY Tools</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">Leaving business owners coding workflows at midnight</p>
                      </CardContent>
                    </Card>
                    <Card className="border-2 border-destructive/20 bg-destructive/5">
                      <CardContent className="p-4 sm:p-6">
                        <h4 className="font-semibold mb-2 text-destructive text-sm sm:text-base">One-off Freelancers</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">Who disappeared after launch, leaving unmaintained systems</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <p className="text-xl sm:text-2xl font-bold text-center text-primary mt-6 sm:mt-8 px-2">
                    We knew there had to be a better way.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* The Turning Point */}
      <section ref={turningPointRef} className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={turningPointInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-6 sm:space-y-8"
          >
            <div className="text-center space-y-2 sm:space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold px-2">The Turning Point</h2>
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-2">
                The moment that changed everything
              </p>
            </div>

            <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-background">
              <CardContent className="p-6 sm:p-8 md:p-12">
                <div className="space-y-4 sm:space-y-6">
                  <p className="text-base sm:text-lg leading-relaxed">
                    In late 2023, our founder was consulting for a multi-location dental practice in London. 
                    They were losing <strong className="text-primary">£12,000 monthly</strong> to no-shows—not 
                    because patients didn't care, but because reminders were inconsistent. Staff were overwhelmed. 
                    The phones never stopped ringing.
                  </p>

                  <p className="text-base sm:text-lg leading-relaxed">
                    We built them an AI-powered patient engagement system in <strong>10 days</strong>.
                  </p>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-6 sm:my-8">
                    <Card className="border-2 border-primary/20 bg-primary/5">
                      <CardContent className="p-4 sm:p-6 text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">42%</div>
                        <p className="text-xs sm:text-sm text-muted-foreground">No-shows dropped</p>
                      </CardContent>
                    </Card>
                    <Card className="border-2 border-primary/20 bg-primary/5">
                      <CardContent className="p-4 sm:p-6 text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">15hrs</div>
                        <p className="text-xs sm:text-sm text-muted-foreground">Staff saved per week</p>
                      </CardContent>
                    </Card>
                    <Card className="border-2 border-primary/20 bg-primary/5">
                      <CardContent className="p-4 sm:p-6 text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">£18K</div>
                        <p className="text-xs sm:text-sm text-muted-foreground">Monthly revenue increase</p>
                      </CardContent>
                    </Card>
                    <Card className="border-2 border-primary/20 bg-primary/5">
                      <CardContent className="p-4 sm:p-6 text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">28%</div>
                        <p className="text-xs sm:text-sm text-muted-foreground">Patient satisfaction jump</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="bg-primary/10 border-l-4 border-primary p-4 sm:p-6 rounded-r-lg">
                    <p className="text-lg sm:text-xl italic text-foreground/90">
                      "Why doesn't every clinic have this?"
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-2">— Practice Owner</p>
                  </div>

                  <p className="text-xl sm:text-2xl font-bold text-center text-primary px-2">
                    That question became our mission.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Why We Exist */}
      <section ref={whyExistRef} className="py-8 sm:py-12 px-4 sm:px-6 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={whyExistInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-6 sm:space-y-8"
          >
            <div className="text-center space-y-2 sm:space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold px-2">Why We Exist</h2>
            </div>

            <Card className="border-2 border-primary/30 bg-card/50">
              <CardContent className="p-6 sm:p-8 md:p-12 text-center">
                <div className="space-y-4 sm:space-y-6">
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary leading-relaxed px-2">
                    We believe every business—regardless of size—deserves enterprise-grade automation that actually works.
                  </p>
                  
                  <p className="text-base sm:text-lg text-foreground/90 max-w-3xl mx-auto px-2">
                    Not automation that requires a computer science degree to understand. Not solutions that 
                    take half a year to implement. Not tools that break when APIs change.
                  </p>

                  <p className="text-base sm:text-lg text-foreground/90 max-w-3xl mx-auto px-2">
                    We exist to <strong>democratize intelligent automation</strong>. To give the 50-employee 
                    e-commerce brand the same competitive advantages that Amazon has. To help the 3-location 
                    clinic operate like a national healthcare network. To enable the regional real estate 
                    agency to follow up like the industry giants.
                  </p>

                  <div className="bg-primary/10 border-2 border-primary/30 p-4 sm:p-6 rounded-lg mt-6 sm:mt-8">
                    <p className="text-lg sm:text-xl font-bold text-primary px-2">
                      We're tired of watching great businesses lose to competitors simply because they 
                      can't afford enterprise automation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Why We're Different */}
      <section ref={differenceRef} className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={differenceInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-8 sm:space-y-12"
          >
            <div className="text-center space-y-2 sm:space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold px-2">Why We're Different</h2>
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-2">
                And why it matters to you
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {differences.map((diff, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={differenceInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="border-2 hover:border-primary/50 transition-all">
                    <CardContent className="p-4 sm:p-6 md:p-8">
                      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                        <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-primary/20 flex items-center justify-center">
                          <diff.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                        </div>
                        <div className="flex-1 space-y-2 sm:space-y-3">
                          <h3 className="text-lg sm:text-xl md:text-2xl font-bold">{diff.title}</h3>
                          <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">{diff.description}</p>
                          <div className="bg-primary/10 border-l-4 border-primary p-3 sm:p-4 rounded-r-lg">
                            <p className="font-semibold text-primary text-sm sm:text-base">{diff.highlight}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Promise */}
      <section ref={promiseRef} className="py-8 sm:py-12 px-4 sm:px-6 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={promiseInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-8 sm:space-y-12"
          >
            <div className="text-center space-y-2 sm:space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold px-2">Our Promise to You</h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
                When you partner with GrowFastWithUs, you're not just buying software. You're gaining:
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {promises.map((promise, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={promiseInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="border-2 hover:border-primary/50 transition-all h-full">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <promise.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                        </div>
                        <h3 className="text-base sm:text-lg md:text-xl font-semibold">{promise.title}</h3>
                      </div>
                      <ul className="space-y-2">
                        {promise.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground text-sm sm:text-base">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Card className="border-2 border-primary/30 bg-primary/5">
              <CardContent className="p-6 sm:p-8 text-center">
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Partnership, Not Vendorship</h3>
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 text-left">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base">We succeed when you succeed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base">Transparent pricing with no hidden fees</span>
                    </li>
                  </ul>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base">Honest conversations about what automation can (and can't) do</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base">Long-term relationship mindset</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Client Testimonials - Carousel */}
      <section ref={testimonialsRef} className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-6 sm:space-y-10"
          >
            <div className="text-center space-y-2 sm:space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold px-2">Why Businesses Choose Us</h2>
              <p className="text-muted-foreground text-base sm:text-lg px-2">In their words</p>
            </div>

            <Carousel className="w-full">
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index}>
                    <Card className="border-2 hover:border-primary/50 transition-all h-full">
                      <CardContent className="p-8 flex flex-col gap-6 items-stretch justify-between">
                        <Quote className="w-10 h-10 text-primary" />
                        <p className="text-foreground/90 italic leading-relaxed text-lg">
                          "{testimonial.quote}"
                        </p>
                        <div className="border-t pt-4">
                          <p className="font-semibold">{testimonial.author}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                          <Badge className="mt-2 bg-primary/20 text-primary">
                            {testimonial.impact}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-8 sm:py-12 px-4 sm:px-6 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-8 sm:space-y-12"
          >
            <div className="text-center space-y-2 sm:space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold px-2">The Numbers Tell the Story</h2>
              <p className="text-muted-foreground text-base sm:text-lg px-2">Where we are today</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={statsInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className="border-2 text-center hover:border-primary/50 transition-all">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col items-center gap-2 sm:gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold text-primary">{stat.number}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Future */}
      <section ref={futureRef} className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={futureInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-8 sm:space-y-12"
          >
            <div className="text-center space-y-2 sm:space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold px-2">The Future We're Building</h2>
            </div>

            <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-background">
              <CardContent className="p-6 sm:p-8 md:p-12">
                <div className="space-y-4 sm:space-y-6">
                  <p className="text-xl sm:text-2xl font-bold text-primary text-center px-2">
                    By 2028, we envision a world where:
                  </p>
                  
                  <ul className="space-y-3 sm:space-y-4 max-w-3xl mx-auto">
                    <li className="flex items-start gap-2 sm:gap-3">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-0.5 sm:mt-1" />
                      <span className="text-sm sm:text-base md:text-lg">Every medical practice has AI assistants reducing no-shows and improving patient care</span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-0.5 sm:mt-1" />
                      <span className="text-sm sm:text-base md:text-lg">Every e-commerce brand operates with Amazon-level efficiency</span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-0.5 sm:mt-1" />
                      <span className="text-sm sm:text-base md:text-lg">Every service business responds to customers in seconds, not hours</span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-0.5 sm:mt-1" />
                      <span className="text-sm sm:text-base md:text-lg">Every entrepreneur spends time on strategy and growth, not manual data entry</span>
                    </li>
                  </ul>

                  <div className="text-center pt-4 sm:pt-6">
                    <p className="text-lg sm:text-xl font-semibold text-primary px-2">
                      We're not just automating workflows—we're automating success.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <Card className="border-2 border-primary/20">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    Our Roadmap
                  </h3>
                  <ul className="space-y-2 sm:space-y-3">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base">Expansion into 20+ industry verticals with specialized templates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base">Self-serve SaaS platform for businesses that want DIY with enterprise-grade infrastructure</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base">AI-powered recommendation engine suggesting optimizations based on your data</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
                    <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    Where We're Going
                  </h3>
                  <ul className="space-y-2 sm:space-y-3">
                    <li className="flex items-start gap-2">
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base"><strong>5,000+ clients globally</strong> by 2028</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base"><strong>€40M+ annual recurring revenue</strong> within 5 years</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base"><strong>Recognition as the automation platform</strong> that redefined what's possible for mid-market and enterprise</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section ref={teamRef} className="py-8 sm:py-12 px-4 sm:px-6 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={teamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-8 sm:space-y-12"
          >
            <div className="text-center space-y-2 sm:space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold px-2">Meet the Team Behind the Automation</h2>
            </div>

            <Card className="border-2 border-primary/20">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Founded by Operators, Built for Businesses</h3>
                <p className="text-base sm:text-lg text-foreground/90 mb-4 sm:mb-6">
                  Our founding team comes from:
                </p>
                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                  <ul className="space-y-2 sm:space-y-3">
                    <li className="flex items-start gap-2">
                      <Award className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base"><strong>10+ years in automation engineering</strong> building systems for Fortune 500 companies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base"><strong>AI implementation expertise</strong> deploying GPT-4, voice AI, and predictive analytics at scale</span>
                    </li>
                  </ul>
                  <ul className="space-y-2 sm:space-y-3">
                    <li className="flex items-start gap-2">
                      <Code className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base"><strong>No-code platform mastery</strong> with 5,000+ workflows deployed across n8n, Make, and custom solutions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base"><strong>Business operations consulting</strong> helping 200+ companies optimize processes</span>
                    </li>
                  </ul>
                </div>
                <p className="text-base sm:text-lg text-primary font-semibold mt-4 sm:mt-6 text-center px-2">
                  We're not just developers. We're business partners who happen to be technical experts.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Our Culture: Obsessed With Your Success</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-0.5 sm:mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1 text-sm sm:text-base">Client-First Everything</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">Every decision starts with "Does this make our clients more successful?"</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-0.5 sm:mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1 text-sm sm:text-base">Relentless Optimization</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">We don't "set and forget"—we continuously improve every workflow</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-0.5 sm:mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1 text-sm sm:text-base">Radical Transparency</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">Clear pricing, honest timelines, real results</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-0.5 sm:mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1 text-sm sm:text-base">Speed + Quality</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">Fast doesn't mean rushed. It means efficient, tested, and battle-hardened</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Handshake className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-0.5 sm:mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1 text-sm sm:text-base">Long-Term Partnership</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">We celebrate your wins like they're ours—because they are</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Our Commitment to Excellence - Accordion */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={teamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Our Commitment to Excellence</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                How we operate at a technical, operational, and ethical level
              </p>
            </div>

            <Card className="border-2 border-primary/20 bg-card/50">
              <CardContent className="p-6 md:p-8">
                <Accordion type="single" collapsible className="w-full">
                  {excellenceSections.map((section) => (
                    <AccordionItem key={section.id} value={section.id}>
                      <AccordionTrigger className="text-base sm:text-lg font-semibold hover:text-primary">
                        {section.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 sm:space-y-3">
                          {section.points.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                              <span className="text-sm sm:text-base text-foreground/90">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section ref={industriesRef} className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={industriesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-8 sm:space-y-12"
          >
            <div className="text-center space-y-2 sm:space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold px-2">Industries We Serve</h2>
              <p className="text-muted-foreground text-base sm:text-lg px-2">
                With deep expertise and battle-tested solutions
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {industries.map((industry, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={industriesInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -5, scale: 1.05 }}
                >
                  <Card className="border-2 hover:border-primary/50 transition-all h-full">
                    <CardContent className="p-4 sm:p-6 text-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                        <industry.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">{industry.name}</h3>
                      <p className="text-xs text-muted-foreground hidden sm:block">{industry.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Card className="border-2 border-primary/30 bg-primary/5">
              <CardContent className="p-6 sm:p-8 text-center">
                <p className="text-base sm:text-lg md:text-xl font-semibold px-2">
                  And many more. <span className="text-primary">If you run a business, we can automate it.</span>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-2 border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
            <CardContent className="p-6 sm:p-8 md:p-12 text-center space-y-4 sm:space-y-6">
              <div className="flex justify-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Rocket className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold px-2">Ready to Transform Your Business?</h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
                Join 150+ businesses that have automated their operations and achieved measurable ROI. 
                We don't just automate processes—we automate profitability.
              </p>
              
              <div className="bg-primary/10 border-l-4 border-primary p-4 sm:p-6 rounded-r-lg text-left">
                <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">What Happens Next:</h3>
                <ol className="space-y-2 sm:space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-primary flex-shrink-0">1.</span>
                    <span className="text-sm sm:text-base"><strong>Book a Free Automation Audit</strong> (30 minutes) — We analyze your workflows and identify opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-primary flex-shrink-0">2.</span>
                    <span className="text-sm sm:text-base"><strong>Get Your Personalized Proposal</strong> — Clear pricing, workflow diagrams, and expected outcomes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-primary flex-shrink-0">3.</span>
                    <span className="text-sm sm:text-base"><strong>Go Live in Days, Not Months</strong> — Fast implementation with full training and ongoing optimization</span>
                  </li>
                </ol>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4">
                <Link href="/booking">
                  <Button size="lg" className="gap-2 w-full sm:w-auto touch-manipulation">
                    Book Free Automation Audit
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/templates">
                  <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto touch-manipulation">
                    Explore Solutions
                    <Sparkles className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground pt-4">
                <strong>Email:</strong> hello@growfastwithus.com
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}

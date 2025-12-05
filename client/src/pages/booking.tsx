import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { SEOHead, seoTemplates } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  Star, 
  MessageCircle,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  Info,
  Sparkles
} from "lucide-react";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Booking() {
  const [showDetails, setShowDetails] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  useEffect(() => {
    // Cal.com inline embed initialization with custom brand theme
    const script = document.createElement('script');
    script.innerHTML = `
      (function (C, A, L) { 
        let p = function (a, ar) { a.q.push(ar); }; 
        let d = C.document; 
        C.Cal = C.Cal || function () { 
          let cal = C.Cal; 
          let ar = arguments; 
          if (!cal.loaded) { 
            cal.ns = {}; 
            cal.q = cal.q || []; 
            d.head.appendChild(d.createElement("script")).src = A; 
            cal.loaded = true; 
          } 
          if (ar[0] === L) { 
            const api = function () { p(api, arguments); }; 
            const namespace = ar[1]; 
            api.q = api.q || []; 
            if(typeof namespace === "string"){
              cal.ns[namespace] = cal.ns[namespace] || api;
              p(cal.ns[namespace], ar);
              p(cal, ["initNamespace", namespace]);
            } else p(cal, ar); 
            return;
          } 
          p(cal, ar); 
        }; 
      })(window, "https://app.cal.com/embed/embed.js", "init");
      
      Cal("init", "30min", {origin:"https://app.cal.com"});
      
      Cal.ns["30min"]("inline", {
        elementOrSelector:"#my-cal-inline",
        config: {"layout":"month_view"},
        calLink: "grow-fast-with-us/30min",
      });
      
      Cal.ns["30min"]("ui", {
        "cssVarsPerTheme":{"dark":{"cal-brand":"#FF5B29"}},
        "hideEventTypeDetails":false,
        "layout":"month_view"
      });
    `;
    document.head.appendChild(script);
    
    // Handle scroll for sticky button
    const handleScroll = () => {
      setIsSticky(window.scrollY > 400);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      // Cleanup script on unmount
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToCalendar = () => {
    const calendarElement = document.getElementById('booking-calendar');
    if (calendarElement) {
      calendarElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <SEOHead {...seoTemplates.booking} />
      
      {/* Page Header */}
      <PageHeader />

      {/* Sticky Quick Action Button (Mobile Only) */}
      <AnimatePresence>
        {isSticky && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 left-4 right-4 z-50 lg:hidden"
          >
            <Button 
              onClick={scrollToCalendar}
              className="w-full backdrop-blur-xl bg-primary/20 hover:bg-primary/30 border border-primary/40 text-white shadow-2xl py-6 text-lg font-semibold transition-all"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Book Your Free Consultation
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Header - Optimized for Mobile */}
          <motion.div 
            className="text-center mb-6 sm:mb-8 lg:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 glass-card px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-4 sm:mb-6">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-gray-300">Book Consultation</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 lg:mb-6 px-2">
              Schedule Your Free
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Automation Consultation</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
              Get expert guidance on automating your business processes. Our 30-minute consultation is completely free with no obligation.
            </p>
          </motion.div>

          {/* Quick Info Banner - Mobile Priority */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 lg:hidden"
          >
            <Card className="glass-card p-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-xs text-gray-400">30 min</p>
                </div>
                <div>
                  <Users className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-xs text-gray-400">1-on-1</p>
                </div>
                <div>
                  <MessageCircle className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-xs text-gray-400">Video</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Booking Calendar - Primary Focus */}
            <motion.div 
              id="booking-calendar"
              className="lg:col-span-2 order-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="glass-card p-3 sm:p-4 lg:p-6">
                <CardHeader className="p-3 sm:p-4 lg:p-6">
                  <CardTitle className="text-xl sm:text-2xl text-white mb-2">Choose Your Preferred Time</CardTitle>
                  <p className="text-sm sm:text-base text-gray-400">
                    Select a time that works best for you. All times are shown in your local timezone.
                  </p>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="rounded-lg overflow-hidden" style={{minHeight: "500px"}}>
                    <div 
                      id="my-cal-inline" 
                      className="cal-embed-responsive"
                      style={{
                        width: "100%", 
                        height: "500px",
                        minHeight: "500px",
                        overflow: "auto",
                        backgroundColor: "#1a1a1a",
                        borderRadius: "8px"
                      }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Consultation Details - Collapsible on Mobile */}
            <motion.div 
              className="space-y-4 sm:space-y-6 order-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Session Info - Always Visible on Desktop */}
              <Card className="glass-card p-4 sm:p-6 hidden lg:block">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-xl text-white">Session Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-0">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-white">Duration</p>
                      <p className="text-gray-400 text-sm">30 minutes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-white">Format</p>
                      <p className="text-gray-400 text-sm">1-on-1 Video Call</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MessageCircle className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-white">Platform</p>
                      <p className="text-gray-400 text-sm">Google Meet / Zoom</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mobile: Collapsible Details Accordion */}
              <Card className="glass-card p-4 lg:hidden">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="discussion" className="border-gray-700">
                    <AccordionTrigger className="text-white hover:text-primary py-3">
                      <div className="flex items-center">
                        <Info className="w-4 h-4 mr-2 text-primary" />
                        <span className="font-semibold">What We'll Discuss</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2.5 pt-2">
                        <div className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300 text-sm">Your current business processes and pain points</span>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300 text-sm">Automation opportunities and potential ROI</span>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300 text-sm">Custom automation strategy for your business</span>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300 text-sm">Implementation timeline and next steps</span>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300 text-sm">Q&A about our services and approach</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>

              {/* Desktop: What We'll Cover */}
              <Card className="glass-card p-6 hidden lg:block">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-xl text-white">What We'll Discuss</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-0">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Your current business processes and pain points</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Automation opportunities and potential ROI</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Custom automation strategy for your business</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Implementation timeline and next steps</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Q&A about our services and approach</span>
                  </div>
                </CardContent>
              </Card>

              {/* Alternative Booking - Compact on Mobile */}
              <Card className="glass-card p-4 sm:p-6">
                <CardHeader className="p-0 mb-3 sm:mb-4">
                  <CardTitle className="text-lg sm:text-xl text-white">Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 p-0">
                  <p className="text-gray-400 text-xs sm:text-sm">
                    Can't find a suitable time or prefer to reach out directly?
                  </p>
                  
                  <Button 
                    onClick={() => window.open('https://cal.com/grow-fast-with-us/30min', '_blank')}
                    className="w-full bg-primary hover:bg-primary/90 text-white text-sm sm:text-base py-5 sm:py-6"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Open in New Tab
                  </Button>
                  
                  <div className="pt-3 border-t border-gray-700">
                    <p className="text-gray-400 text-xs sm:text-sm mb-2">Contact us directly:</p>
                    <div className="space-y-2">
                      <a 
                        href="tel:+442079460958" 
                        className="flex items-center text-primary hover:text-primary/80 transition-colors text-sm touch-manipulation py-1"
                      >
                        <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>+44 20 7946 0958</span>
                      </a>
                      <a 
                        href="mailto:hello@growfastwithus.com" 
                        className="flex items-center text-primary hover:text-primary/80 transition-colors text-sm touch-manipulation py-1 break-all"
                      >
                        <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>hello@growfastwithus.com</span>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Testimonial - Compact */}
              <Card className="glass-card p-4 sm:p-6">
                <CardContent className="text-center p-0">
                  <div className="flex justify-center space-x-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 text-xs sm:text-sm italic mb-3">
                    "The consultation was incredibly valuable. They identified automation opportunities I hadn't even considered!"
                  </p>
                  <p className="text-gray-400 text-xs">
                    - Sarah M., Tech Startup Founder
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { SEOHead, seoTemplates } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { templates } from "@/lib/templates";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import {
  Search,
  Filter,
  CheckCircle,
  Star,
  Clock,
  Users,
  TrendingUp,
  Zap,
  Sparkles
} from "lucide-react";

export default function Templates() {
  const [selectedCategory, setSelectedCategory] = useState("All Templates");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchSticky, setIsSearchSticky] = useState(false);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (searchRef.current) {
        const rect = searchRef.current.getBoundingClientRect();
        setIsSearchSticky(rect.top <= 80);
      }
      setShowStickyCTA(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = ["All Templates", ...Array.from(new Set(templates.map(t => t.category)))];
  
  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === "All Templates" || template.category === selectedCategory;
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <SEOHead {...seoTemplates.templates} />
      
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
                Get Custom Automation
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-20 sm:pt-24 pb-12 sm:pb-16">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12 px-4"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              Ready-to-Go Automation Templates
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto">
              Browse our complete library of proven automation solutions. Each template is designed to solve specific business challenges and deliver immediate results.
            </p>
          </motion.div>

          {/* Stats - Optimized for Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12"
          >
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">15+</div>
              <div className="text-gray-400 text-xs sm:text-sm">Templates Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">2,500+</div>
              <div className="text-gray-400 text-xs sm:text-sm">Implementations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">85%</div>
              <div className="text-gray-400 text-xs sm:text-sm">Time Savings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">30 Days</div>
              <div className="text-gray-400 text-xs sm:text-sm">Average ROI</div>
            </div>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col md:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search templates..."
                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-9 sm:pl-10 pr-4 py-3 sm:py-3.5 text-white focus:outline-none focus:border-primary text-sm sm:text-base min-h-[44px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`${
                    selectedCategory === category ? 
                    "bg-primary text-white" : 
                    "text-gray-300 border-gray-600 hover:bg-gray-800"
                  } min-h-[44px] text-xs sm:text-sm px-3 sm:px-4`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Templates Grid - Single Column on Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="bg-gray-900/50 border-gray-700 hover:border-primary/50 transition-all duration-300 h-full">
                  <CardContent className="p-4 sm:p-6 h-full flex flex-col">
                    {/* Template Header */}
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          {/* Using a dynamic icon based on template category */}
                          {template.category === "Healthcare" && <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />}
                          {template.category === "Real Estate" && <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />}
                          {template.category === "E-commerce" && <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />}
                          {template.category === "Professional Services" && <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />}
                          {template.category === "Food & Beverage" && <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />}
                          {!["Healthcare", "Real Estate", "E-commerce", "Professional Services", "Food & Beverage"].includes(template.category) && <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-white text-base sm:text-lg leading-tight mb-1">{template.title}</h3>
                          <Badge variant="outline" className="text-[10px] sm:text-xs">
                            {template.category}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 text-xs sm:text-sm mb-4 sm:mb-6 flex-grow leading-relaxed">
                      {template.description}
                    </p>

                    {/* Features */}
                    <div className="mb-4 sm:mb-6">
                      <h4 className="text-xs sm:text-sm font-medium text-white mb-2 sm:mb-3">Key Features:</h4>
                      <div className="space-y-1.5 sm:space-y-2">
                        {template.tiers[0].features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                            <span className="text-gray-300 text-xs sm:text-sm">{feature}</span>
                          </div>
                        ))}
                        {template.tiers[0].features.length > 3 && (
                          <div className="text-gray-400 text-[10px] sm:text-xs">
                            +{template.tiers[0].features.length - 3} more features
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6 py-3 sm:py-4 border-t border-gray-700">
                      <div className="text-center">
                        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary mx-auto mb-1" />
                        <div className="text-[10px] sm:text-xs text-gray-400">Setup</div>
                        <div className="text-xs sm:text-sm font-medium text-white">1-2 Days</div>
                      </div>
                      <div className="text-center">
                        <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary mx-auto mb-1" />
                        <div className="text-[10px] sm:text-xs text-gray-400">ROI</div>
                        <div className="text-xs sm:text-sm font-medium text-white">30 Days</div>
                      </div>
                      <div className="text-center">
                        <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary mx-auto mb-1" />
                        <div className="text-[10px] sm:text-xs text-gray-400">Saves</div>
                        <div className="text-xs sm:text-sm font-medium text-white">20+ hrs/week</div>
                      </div>
                    </div>

                    {/* Price and Action */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl sm:text-2xl font-bold text-primary">
                            €{template.tiers[0].monthlyFee}
                          </span>
                          <span className="text-gray-400 text-xs sm:text-sm">/month</span>
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                          {template.tiers.length} tiers available
                        </div>
                      </div>
                      <Link href={`/template/${template.id}`}>
                        <Button 
                          className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto min-h-[44px] text-sm sm:text-base"
                          aria-label={`View ${template.title}`}
                        >
                          Learn More
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* No Results */}
          {filteredTemplates.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-gray-400 mb-4">No templates found matching your criteria</div>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All Templates");
                }}
                className="text-white border-white/30 hover:bg-white/10"
              >
                Clear Filters
              </Button>
            </motion.div>
          )}

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-16 p-8 rounded-lg bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30"
          >
            <h3 className="text-2xl font-bold mb-4">Don't See What You Need?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              We create custom automation solutions tailored to your specific business needs. 
              Let's discuss how we can build the perfect automation for your workflow.
            </p>
            <Link href="/#contact">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                Request Custom Solution
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  templates, 
  bundlePackages, 
  customSolutions, 
  premiumAddons, 
  implementationTimeframes, 
  supportLevels,
  technicalStack 
} from "@/lib/templates";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
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
  Mail,
  Target,
  Monitor,
  Smartphone,
  Tablet,
  Euro,
  Calendar,
  Building,
  Globe,
  Cpu,
  Database,
  Lock,
  Activity,
  Plus,
  Menu,
  X
} from "lucide-react";

export default function TemplateDetail() {
  const { id } = useParams();
  const [selectedTier, setSelectedTier] = useState("Starter");
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const template = templates.find(t => t.id === id);
  
  if (!template) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold mb-4">Template Not Found</h1>
          <Link href="/templates">
            <Button className="w-full sm:w-auto">Back to Templates</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentTier = template.tiers.find(t => t.name === selectedTier) || template.tiers[0];

  return (
    <div className="min-h-screen bg-black text-white">
      <SEOHead
        title={`${template.title} - ${template.category} Automation Template | GrowFastWithUs`}
        description={`${template.description} Ready-to-deploy automation solution for ${template.category.toLowerCase()} businesses. Includes setup, training, and support. Starting from €${template.tiers[0].monthlyFee}/month.`}
        keywords={`${template.title.toLowerCase()}, ${template.category.toLowerCase()} automation, ${template.category.toLowerCase()} template, business automation, workflow automation, ${template.category.toLowerCase()} efficiency, automation solution`}
        canonical={`https://growfastwithus.com/template/${template.id}`}
        ogType="product"
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Product",
              "name": template.title,
              "description": template.description,
              "category": `${template.category} Automation`,
              "brand": {
                "@type": "Organization",
                "name": "GrowFastWithUs",
                "url": "https://growfastwithus.com"
              },
              "offers": {
                "@type": "AggregateOffer",
                "availability": "https://schema.org/InStock",
                "priceCurrency": "EUR",
                "lowPrice": template.tiers[0].monthlyFee.toString(),
                "highPrice": template.tiers[template.tiers.length - 1].monthlyFee.toString(),
                "offerCount": template.tiers.length
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "2500"
              }
            },
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://growfastwithus.com/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Templates",
                  "item": "https://growfastwithus.com/templates"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": template.title,
                  "item": `https://growfastwithus.com/template/${template.id}`
                }
              ]
            }
          ]
        }}
      />
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 glass-card shadow-lg">
        <nav className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <img 
                  src="/logo.png" 
                  alt="GrowFastWithUs Logo" 
                  className="h-6 sm:h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity"
                  loading="eager"
                />
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/templates">
                <Button variant="outline" className="text-white border-white/30 hover:bg-white/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Templates
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pb-4 border-t border-gray-700"
            >
              <Link href="/templates">
                <Button 
                  variant="outline" 
                  className="w-full text-white border-white/30 hover:bg-white/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Templates
                </Button>
              </Link>
            </motion.div>
          )}
        </nav>
      </header>

      <div className="pt-20 sm:pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Template Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 sm:mb-12"
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
              <div className="mb-6 lg:mb-0">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
                  {template.title}
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-4 leading-relaxed">
                  {template.description}
                </p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                  <Badge variant="outline" className="text-xs sm:text-sm">
                    {template.category}
                  </Badge>
                  <Badge className="bg-primary/20 text-primary border-primary/30 text-xs sm:text-sm">
                    {template.industryValue}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Tier Selection */}
            <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
              {template.tiers.map((tier) => (
                <Button
                  key={tier.name}
                  variant={selectedTier === tier.name ? "default" : "outline"}
                  onClick={() => setSelectedTier(tier.name)}
                  className={`text-xs sm:text-sm min-h-[44px] px-3 sm:px-4 ${
                    selectedTier === tier.name ? 
                      "bg-primary text-white" : 
                      "text-gray-300 border-gray-600 hover:bg-gray-800"
                  }`}
                >
                  {tier.name}
                </Button>
              ))}
            </div>

            {/* Current Tier Pricing */}
            <Card className="glass-card p-4 sm:p-6 mb-6 sm:mb-8">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-primary mb-2">
                      €{currentTier.monthlyFee}/month
                    </h3>
                    <p className="text-sm sm:text-base text-gray-400">Setup: €{currentTier.setupFee}</p>
                    <p className="text-xs sm:text-sm text-green-400 mt-2">
                      ROI Value: {currentTier.roiValue}
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <Link href="/booking">
                      <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white min-h-[44px] text-sm sm:text-base">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-6 sm:mb-8 border-b border-gray-700 overflow-x-auto scrollbar-hide">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "features", label: "Features", icon: CheckCircle },
              { id: "technical", label: "Technical", icon: Settings },
              { id: "roi", label: "ROI Analysis", icon: TrendingUp },
              { id: "bundles", label: "Bundles", icon: Building },
              { id: "addons", label: "Add-ons", icon: Plus },
              { id: "support", label: "Support", icon: Shield }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm whitespace-nowrap min-h-[44px] px-3 sm:px-4 ${
                    activeTab === tab.id ? 
                      "bg-primary text-white" : 
                      "text-gray-300 hover:text-white"
                  }`}
                >
                  <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{tab.label}</span>
                </Button>
              );
            })}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <Card className="glass-card">
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="text-xl sm:text-2xl font-bold mb-4">Template Overview</h3>
                    <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-6">
                      {template.description}
                    </p>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                        <span className="text-sm sm:text-base">Setup Time: 3-5 business days</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                        <span className="text-sm sm:text-base">ROI: Achievable in 30 days</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                        <span className="text-sm sm:text-base">Time Saved: 20+ hours/week</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="text-xl sm:text-2xl font-bold mb-4">Key Benefits</h3>
                    <div className="space-y-3">
                      {currentTier.roiCalculation.slice(0, 4).map((benefit, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm sm:text-base text-gray-300">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "features" && (
              <Card className="glass-card">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-bold mb-6">{selectedTier} Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    {currentTier.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 sm:p-4 border border-gray-700 rounded-lg">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm sm:text-base text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "technical" && (
              <div className="space-y-6 sm:space-y-8">
                <Card className="glass-card">
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="text-xl sm:text-2xl font-bold mb-6">Technical Implementation</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      {currentTier.technicalImplementation.map((tech, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 sm:p-4 border border-gray-700 rounded-lg">
                          <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm sm:text-base text-gray-300">{tech}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="text-xl sm:text-2xl font-bold mb-6">Technical Stack</h3>
                    <div className="space-y-6">
                      {Object.entries(technicalStack).map(([category, items]) => (
                        <div key={category}>
                          <h4 className="text-base sm:text-lg font-semibold mb-3 text-primary capitalize">
                            {category.replace(/([A-Z])/g, ' $1').trim()}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {items.map((item, index) => (
                              <div key={index} className="flex items-start space-x-3 p-3 border border-gray-700 rounded-lg">
                                <Cpu className="w-3 h-3 sm:w-4 sm:h-4 text-primary mt-0.5 flex-shrink-0" />
                                <span className="text-xs sm:text-sm text-gray-300">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "roi" && (
              <Card className="glass-card">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-bold mb-6">ROI Analysis</h3>
                  <div className="space-y-3 sm:space-y-4">
                    {currentTier.roiCalculation && currentTier.roiCalculation.length > 0 ? (
                      currentTier.roiCalculation.map((calculation, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 sm:p-4 border border-gray-700 rounded-lg">
                          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm sm:text-base text-gray-300">{calculation}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <TrendingUp className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400 text-sm sm:text-base">
                          ROI analysis is being calculated for this tier. Please contact us for detailed ROI projections.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "bundles" && (
              <div className="space-y-6 sm:space-y-8">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-6">Bundle Packages</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {bundlePackages.map((bundle) => (
                      <Card key={bundle.id} className="glass-card">
                        <CardContent className="p-4 sm:p-6">
                          <h4 className="text-lg sm:text-xl font-bold mb-2">{bundle.name}</h4>
                          <p className="text-sm sm:text-base text-gray-400 mb-4">{bundle.description}</p>
                          <div className="text-xl sm:text-2xl font-bold text-primary mb-2">
                            €{bundle.monthlyFee}/month
                          </div>
                          <p className="text-xs sm:text-sm text-gray-400 mb-4">
                            Setup: €{bundle.setupFee} (Save {bundle.savings})
                          </p>
                          <div className="space-y-2">
                            {bundle.features.map((feature, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                                <span className="text-xs sm:text-sm text-gray-300">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-6">Custom Solutions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {customSolutions.map((solution) => (
                      <Card key={solution.id} className="glass-card">
                        <CardContent className="p-4 sm:p-6">
                          <h4 className="text-lg sm:text-xl font-bold mb-2">{solution.name}</h4>
                          <p className="text-sm sm:text-base text-gray-400 mb-4">{solution.description}</p>
                          <div className="text-xl sm:text-2xl font-bold text-primary mb-2">
                            €{solution.monthlyFee}/month
                          </div>
                          <p className="text-xs sm:text-sm text-gray-400 mb-4">
                            Setup: €{solution.setupFee}
                          </p>
                          <div className="space-y-2">
                            {solution.features.map((feature, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                                <span className="text-xs sm:text-sm text-gray-300">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "addons" && (
              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-6">Premium Add-On Services</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {premiumAddons.map((addon) => (
                    <Card key={addon.id} className="glass-card">
                      <CardContent className="p-4 sm:p-6">
                        <h4 className="text-lg sm:text-xl font-bold mb-2">{addon.name}</h4>
                        <p className="text-sm sm:text-base text-gray-400 mb-4">{addon.description}</p>
                        <div className="text-base sm:text-lg font-bold text-primary mb-4">
                          {addon.monthlyFee}/month
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-start space-x-2">
                            <Settings className="w-3 h-3 sm:w-4 sm:h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-xs sm:text-sm text-gray-300">{addon.technicalImplementation}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "support" && (
              <div className="space-y-6 sm:space-y-8">
                <Card className="glass-card">
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="text-xl sm:text-2xl font-bold mb-6">Support & Service Level Agreements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {supportLevels.map((level) => (
                        <div key={level.level} className="border border-gray-700 rounded-lg p-3 sm:p-4">
                          <h4 className="text-base sm:text-lg font-bold mb-2">{level.level} Support</h4>
                          <div className="space-y-2 text-xs sm:text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Response Time:</span>
                              <span className="text-white">{level.responseTime}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Resolution Time:</span>
                              <span className="text-white">{level.resolutionTime}</span>
                            </div>
                            <div className="mt-3">
                              <span className="text-gray-400">Included with:</span>
                              <div className="mt-1 flex flex-wrap gap-1">
                                {level.includedWith.map((item, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {item}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="text-xl sm:text-2xl font-bold mb-6">Implementation Timeframes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      {implementationTimeframes.map((timeframe) => (
                        <div key={timeframe.solutionType} className="border border-gray-700 rounded-lg p-3 sm:p-4">
                          <h4 className="text-base sm:text-lg font-bold mb-2">{timeframe.solutionType}</h4>
                          <div className="text-primary font-semibold mb-2 text-sm sm:text-base">{timeframe.timeframe}</div>
                          <p className="text-xs sm:text-sm text-gray-300">{timeframe.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, User, Download, Trash2, Edit, Eye, Mail, ArrowUp } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";

export default function GDPR() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <SEOHead
        title="GDPR Compliance - GrowFastWithUs | Your Data Protection Rights"
        description="Understand your GDPR rights and how GrowFastWithUs complies with the General Data Protection Regulation. Learn about data access, rectification, erasure, and portability rights."
        keywords="GDPR, GDPR compliance, data protection rights, right to access, right to erasure, data portability, GDPR rights, data protection regulation, EU data protection"
        canonical="https://growfastwithus.com/gdpr"
        ogType="website"
      />
      {/* Page Header */}
      <PageHeader />

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <Button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg touch-manipulation"
              aria-label="Back to top"
            >
              <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-20 sm:pt-24 pb-12 sm:pb-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/20 rounded-xl flex items-center justify-center">
                <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 px-4">GDPR Compliance</h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-400 px-4">
              Your data protection rights under the General Data Protection Regulation
            </p>
          </motion.div>

          {/* Content */}
          <div className="space-y-6 sm:space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
                    <h2 className="text-xl sm:text-2xl font-bold">Your GDPR Rights</h2>
                  </div>
                  <div className="space-y-3 sm:space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed">
                    <p>
                      Under the General Data Protection Regulation (GDPR), you have specific rights regarding your personal data. 
                      GrowFastWithUs is committed to respecting and facilitating these rights.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="bg-primary/10 p-4 rounded-lg border border-primary/30">
                        <div className="flex items-center space-x-2 mb-2">
                          <Eye className="w-5 h-5 text-primary" />
                          <h3 className="font-semibold">Right to Access</h3>
                        </div>
                        <p className="text-sm">Request a copy of all personal data we hold about you</p>
                      </div>
                      <div className="bg-primary/10 p-4 rounded-lg border border-primary/30">
                        <div className="flex items-center space-x-2 mb-2">
                          <Edit className="w-5 h-5 text-primary" />
                          <h3 className="font-semibold">Right to Rectification</h3>
                        </div>
                        <p className="text-sm">Correct any inaccurate or incomplete personal data</p>
                      </div>
                      <div className="bg-primary/10 p-4 rounded-lg border border-primary/30">
                        <div className="flex items-center space-x-2 mb-2">
                          <Trash2 className="w-5 h-5 text-primary" />
                          <h3 className="font-semibold">Right to Erasure</h3>
                        </div>
                        <p className="text-sm">Request deletion of your personal data ("right to be forgotten")</p>
                      </div>
                      <div className="bg-primary/10 p-4 rounded-lg border border-primary/30">
                        <div className="flex items-center space-x-2 mb-2">
                          <Download className="w-5 h-5 text-primary" />
                          <h3 className="font-semibold">Right to Portability</h3>
                        </div>
                        <p className="text-sm">Receive your data in a structured, machine-readable format</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <Shield className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold">Legal Basis for Processing</h2>
                  </div>
                  <div className="space-y-3 sm:space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed">
                    <p>We process your personal data based on the following legal grounds:</p>
                    <div className="space-y-4">
                      <div className="border-l-4 border-primary pl-4">
                        <h4 className="font-semibold text-white">Legitimate Interest</h4>
                        <p className="text-sm">Website analytics and service improvement to provide better automation solutions</p>
                      </div>
                      <div className="border-l-4 border-primary pl-4">
                        <h4 className="font-semibold text-white">Contract Performance</h4>
                        <p className="text-sm">Processing necessary to fulfill our automation services and support obligations</p>
                      </div>
                      <div className="border-l-4 border-primary pl-4">
                        <h4 className="font-semibold text-white">Consent</h4>
                        <p className="text-sm">Marketing communications and newsletter subscriptions (you can withdraw anytime)</p>
                      </div>
                      <div className="border-l-4 border-primary pl-4">
                        <h4 className="font-semibold text-white">Legal Obligation</h4>
                        <p className="text-sm">Compliance with accounting, tax, and other regulatory requirements</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <Download className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold">Data Retention</h2>
                  </div>
                  <div className="space-y-3 sm:space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed">
                    <p>We retain your personal data only as long as necessary for the purposes it was collected:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li><strong>Active Customers:</strong> Data retained for duration of service relationship</li>
                      <li><strong>Former Customers:</strong> Financial records kept for 7 years for accounting purposes</li>
                      <li><strong>Marketing Contacts:</strong> Retained until you unsubscribe or request deletion</li>
                      <li><strong>Website Analytics:</strong> Anonymized data retained for 26 months</li>
                      <li><strong>Support Communications:</strong> Kept for 3 years for quality and training purposes</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <Mail className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold">Exercise Your Rights</h2>
                  </div>
                  <div className="space-y-3 sm:space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed">
                    <p>
                      To exercise any of your GDPR rights or if you have concerns about how we handle your data:
                    </p>
                    <div className="bg-primary/10 p-6 rounded-lg border border-primary/30">
                      <h4 className="font-semibold text-white mb-3">Contact our Data Protection Officer:</h4>
                      <div className="space-y-2">
                        <p><strong>Email:</strong> dpo@growfastwithus.com</p>
                        <p><strong>Subject Line:</strong> GDPR Request - [Your Request Type]</p>
                        <p><strong>Response Time:</strong> We will respond within 30 days</p>
                        <p><strong>Verification:</strong> We may need to verify your identity before processing requests</p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <h4 className="font-semibold text-white mb-3">Supervisory Authority:</h4>
                      <p className="text-sm">
                        If you're not satisfied with our response, you have the right to lodge a complaint with the 
                        Information Commissioner's Office (ICO) in the UK or your local data protection authority.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <Shield className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold">International Transfers</h2>
                  </div>
                  <div className="space-y-3 sm:space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed">
                    <p>
                      When we transfer your personal data outside the EEA, we ensure appropriate safeguards:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
                      <li>Adequacy decisions for countries with equivalent data protection standards</li>
                      <li>Binding Corporate Rules for transfers within multinational organizations</li>
                      <li>Regular assessments of data protection practices in destination countries</li>
                    </ul>
                    <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/30 mt-6">
                      <p className="text-yellow-400 font-medium">
                        Currently, we primarily use EU-based servers and service providers to minimize international transfers.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-center mt-16 p-8 rounded-lg bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30"
          >
            <h3 className="text-2xl font-bold mb-4">Questions About Your Data Rights?</h3>
            <p className="text-gray-300 mb-6">
              Our Data Protection Officer is available to help you understand and exercise your GDPR rights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/#contact">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                  Contact DPO
                </Button>
              </Link>
              <Link href="/privacy-policy">
                <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10">
                  View Privacy Policy
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
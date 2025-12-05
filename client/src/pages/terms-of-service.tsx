import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Scale, AlertTriangle, CreditCard, Users, Mail, ArrowUp } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";

export default function TermsOfService() {
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
        title="Terms of Service - GrowFastWithUs | Service Agreement"
        description="Read our Terms of Service to understand the terms and conditions for using GrowFastWithUs automation services, payment terms, user responsibilities, and limitations of liability."
        keywords="terms of service, service agreement, terms and conditions, user agreement, service terms, legal terms, terms of use"
        canonical="https://growfastwithus.com/terms-of-service"
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
                <FileText className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 px-4">Terms of Service</h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 px-4">
              Last updated: January 1, 2025
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
                    <Scale className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
                    <h2 className="text-xl sm:text-2xl font-bold">Acceptance of Terms</h2>
                  </div>
                  <div className="space-y-3 sm:space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed">
                    <p>
                      By accessing and using GrowFastWithUs services, you accept and agree to be bound by the terms 
                      and provision of this agreement. These Terms of Service ("Terms") govern your use of our 
                      automation solutions, website, and related services.
                    </p>
                    <p>
                      If you do not agree to abide by the above, please do not use this service. We reserve the right 
                      to change these terms at any time with reasonable notice.
                    </p>
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
                    <Users className="w-6 h-6 text-primary" />
                    <h2 className="text-xl sm:text-2xl font-bold">Service Description</h2>
                  </div>
                  <div className="space-y-3 sm:space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed">
                    <p>
                      GrowFastWithUs provides business automation solutions including:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Custom workflow automation design and implementation</li>
                      <li>AI-powered business process optimization</li>
                      <li>Integration services for existing business systems</li>
                      <li>Training and support for automation solutions</li>
                      <li>Ongoing maintenance and optimization services</li>
                    </ul>
                    <p>
                      All services are provided "as is" and we reserve the right to modify, suspend, or discontinue 
                      any part of our services with reasonable notice.
                    </p>
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
                    <CreditCard className="w-6 h-6 text-primary" />
                    <h2 className="text-xl sm:text-2xl font-bold">Payment Terms</h2>
                  </div>
                  <div className="space-y-3 sm:space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed">
                    <p>
                      Payment terms and conditions:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li><strong>Monthly Subscriptions:</strong> Billed monthly in advance, auto-renewal unless cancelled</li>
                      <li><strong>Setup Fees:</strong> One-time implementation fees as quoted, payable before project start</li>
                      <li><strong>Refunds:</strong> 30-day money-back guarantee for new customers on monthly plans</li>
                      <li><strong>Late Payments:</strong> Services may be suspended for accounts 15+ days overdue</li>
                      <li><strong>Price Changes:</strong> 30 days notice for subscription price changes</li>
                      <li><strong>Cancellation:</strong> Can be done anytime with services continuing until end of billing period</li>
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
                    <AlertTriangle className="w-6 h-6 text-primary" />
                    <h2 className="text-xl sm:text-2xl font-bold">Limitations of Liability</h2>
                  </div>
                  <div className="space-y-3 sm:space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed">
                    <p>
                      To the maximum extent permitted by applicable law:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Our liability is limited to the amount paid for services in the 12 months preceding the claim</li>
                      <li>We are not liable for indirect, incidental, special, or consequential damages</li>
                      <li>We do not guarantee uninterrupted or error-free service operation</li>
                      <li>Business results and ROI estimates are projections, not guarantees</li>
                      <li>You are responsible for backing up your data and systems</li>
                      <li>Force majeure events excuse performance delays or failures</li>
                    </ul>
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
                    <Users className="w-6 h-6 text-primary" />
                    <h2 className="text-xl sm:text-2xl font-bold">User Responsibilities</h2>
                  </div>
                  <div className="space-y-3 sm:space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed">
                    <p>
                      As a user of our services, you agree to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Provide accurate and complete information when requested</li>
                      <li>Maintain the security of your account credentials</li>
                      <li>Use our services only for lawful business purposes</li>
                      <li>Comply with all applicable laws and regulations</li>
                      <li>Not attempt to reverse engineer or copy our automation solutions</li>
                      <li>Report any security vulnerabilities or service issues promptly</li>
                      <li>Respect intellectual property rights of GrowFastWithUs and third parties</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <Mail className="w-6 h-6 text-primary" />
                    <h2 className="text-xl sm:text-2xl font-bold">Contact & Disputes</h2>
                  </div>
                  <div className="space-y-3 sm:space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed">
                    <p>
                      For questions about these Terms of Service or to resolve disputes:
                    </p>
                    <div className="bg-primary/10 p-4 rounded-lg border border-primary/30">
                      <p><strong>Email:</strong> legal@growfastwithus.com</p>
                      <p><strong>Governing Law:</strong> These terms are governed by UK law</p>
                      <p><strong>Dispute Resolution:</strong> Disputes resolved through binding arbitration</p>
                      <p><strong>Jurisdiction:</strong> UK courts have exclusive jurisdiction</p>
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
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-16 p-8 rounded-lg bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30"
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-4">Need Clarification on Our Terms?</h3>
            <p className="text-gray-300 mb-6">
              Our team is available to explain any aspect of our Terms of Service and how they apply to your business.
            </p>
            <Link href="/#contact">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                Contact Us
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
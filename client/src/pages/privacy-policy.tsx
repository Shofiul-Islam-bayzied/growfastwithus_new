import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Eye, Lock, Database, Users, Mail, ArrowUp } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";

export default function PrivacyPolicy() {
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
        title="Privacy Policy - GrowFastWithUs | Data Protection & Privacy"
        description="Learn how GrowFastWithUs protects your personal information. Our comprehensive privacy policy explains data collection, usage, security measures, and your rights under GDPR."
        keywords="privacy policy, data protection, GDPR, personal data, data security, privacy rights, data collection"
        canonical="/privacy-policy"
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
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 px-4">Privacy Policy</h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-400 px-4">
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
                    <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
                    <h2 className="text-xl sm:text-2xl font-bold">Information We Collect</h2>
                  </div>
                  <div className="space-y-3 sm:space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed">
                    <p>
                      At GrowFastWithUs, we collect information to provide better automation services to our users. 
                      The types of information we collect include:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-2 sm:ml-4">
                      <li><strong>Personal Information:</strong> Name, email address, phone number, and business details when you contact us or sign up for our services.</li>
                      <li><strong>Business Information:</strong> Company size, industry, automation needs, and pain points to customize our solutions.</li>
                      <li><strong>Technical Information:</strong> IP address, browser type, device information, and usage patterns to improve our website and services.</li>
                      <li><strong>Communication Data:</strong> Records of your communications with us, including support tickets and consultation notes.</li>
                    </ul>
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
                    <Database className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold">How We Use Your Information</h2>
                  </div>
                  <div className="space-y-3 sm:space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed">
                    <p>We use the information we collect for the following purposes:</p>
                    <ul className="list-disc list-inside space-y-2 ml-2 sm:ml-4">
                      <li>Providing and improving our automation services</li>
                      <li>Customizing solutions to meet your specific business needs</li>
                      <li>Communicating with you about our services and updates</li>
                      <li>Processing payments and managing your account</li>
                      <li>Analyzing usage patterns to enhance user experience</li>
                      <li>Complying with legal obligations and preventing fraud</li>
                    </ul>
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
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                    <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
                    <h2 className="text-xl sm:text-2xl font-bold">Data Protection & Security</h2>
                  </div>
                  <div className="space-y-3 sm:space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed">
                    <p>
                      We implement robust security measures to protect your personal information:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-2 sm:ml-4">
                      <li>Encryption of data in transit and at rest</li>
                      <li>Regular security audits and penetration testing</li>
                      <li>Access controls and authentication protocols</li>
                      <li>Employee training on data protection best practices</li>
                      <li>Compliance with industry-standard security frameworks</li>
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
                    <Users className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold">Your Rights</h2>
                  </div>
                  <div className="space-y-3 sm:space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed">
                    <p>Under GDPR and other privacy laws, you have the following rights:</p>
                    <ul className="list-disc list-inside space-y-2 ml-2 sm:ml-4">
                      <li><strong>Access:</strong> Request a copy of your personal data</li>
                      <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
                      <li><strong>Erasure:</strong> Request deletion of your personal data</li>
                      <li><strong>Portability:</strong> Receive your data in a machine-readable format</li>
                      <li><strong>Restriction:</strong> Limit how we process your data</li>
                      <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
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
                    <Mail className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold">Contact Us</h2>
                  </div>
                  <div className="space-y-3 sm:space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed">
                    <p>
                      If you have any questions about this Privacy Policy or wish to exercise your rights, 
                      please contact us:
                    </p>
                    <div className="bg-primary/10 p-4 rounded-lg border border-primary/30">
                      <p><strong>Email:</strong> privacy@growfastwithus.com</p>
                      <p><strong>Address:</strong> GrowFastWithUs Ltd, Privacy Department</p>
                      <p><strong>Response Time:</strong> We aim to respond within 30 days</p>
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
            <h3 className="text-2xl font-bold mb-4">Questions About Your Privacy?</h3>
            <p className="text-gray-300 mb-6">
              Our team is here to help you understand how we protect your data and respect your privacy rights.
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
import { Link } from "wouter";
import { 
  MapPin, 
  Mail, 
  Phone, 
  Clock,
  Zap,
  Bot,
  Briefcase,
  BarChart3,
  Target,
  Globe,
  Users,
  TrendingUp,
  Shield,
  Settings,
  ShoppingBag
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-t from-black via-gray-950 to-gray-900 text-white py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <img 
                src="/logo.png" 
                alt="GrowFastWithUs Logo" 
                className="h-12 sm:h-14 w-auto"
              />
            </div>
            <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8 max-w-md leading-relaxed">
              Empowering businesses worldwide with intelligent automation solutions that drive growth, efficiency, and success.
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-3 sm:space-x-4">
              <a href="https://linkedin.com/company/growfastwithus" target="_blank" rel="noopener noreferrer" 
                 className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-700 to-blue-500 rounded-xl flex items-center justify-center hover:from-primary hover:to-accent transition-all duration-300 group shadow-lg"
                 aria-label="LinkedIn">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.968v5.699h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.601 2.001 3.601 4.601v5.595z"/></svg>
              </a>
              <a href="https://twitter.com/growfastwithus" target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center hover:from-primary hover:to-accent transition-all duration-300 group shadow-lg"
                 aria-label="Twitter">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.92 4.92 0 0 0-8.384 4.482c-4.086-.205-7.713-2.164-10.141-5.144a4.822 4.822 0 0 0-.666 2.475c0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417a9.867 9.867 0 0 1-6.102 2.104c-.396 0-.787-.023-1.175-.069a13.945 13.945 0 0 0 7.548 2.212c9.057 0 14.009-7.513 14.009-14.009 0-.213-.005-.425-.014-.636a10.012 10.012 0 0 0 2.457-2.548z"/></svg>
              </a>
              <a href="https://youtube.com/@growfastwithus" target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-red-600 to-red-400 rounded-xl flex items-center justify-center hover:from-primary hover:to-accent transition-all duration-300 group shadow-lg"
                 aria-label="YouTube">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.112c-1.863-.502-9.386-.502-9.386-.502s-7.523 0-9.386.502a2.994 2.994 0 0 0-2.112 2.112c-.502 1.863-.502 5.754-.502 5.754s0 3.891.502 5.754a2.994 2.994 0 0 0 2.112 2.112c1.863.502 9.386.502 9.386.502s7.523 0 9.386-.502a2.994 2.994 0 0 0 2.112-2.112c.502-1.863.502-5.754.502-5.754s0-3.891-.502-5.754zm-13.498 9.814v-7l6.5 3.5-6.5 3.5z"/></svg>
              </a>
            </div>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Services</h4>
            <ul className="space-y-2 text-sm sm:text-base text-gray-400">
              <li className="flex items-center space-x-2 hover:text-primary transition-colors cursor-pointer">
                <Zap className="w-4 h-4 text-primary" />
                <Link href="/services" className="hover:text-primary transition-colors">
                  Workflow Automation
                </Link>
              </li>
              <li className="flex items-center space-x-2 hover:text-primary transition-colors cursor-pointer">
                <Bot className="w-4 h-4 text-primary" />
                <Link href="/services" className="hover:text-primary transition-colors">
                  AI Agent Integration
                </Link>
              </li>
              <li className="flex items-center space-x-2 hover:text-primary transition-colors cursor-pointer">
                <Briefcase className="w-4 h-4 text-primary" />
                <Link href="/services" className="hover:text-primary transition-colors">
                  Custom SaaS Solutions
                </Link>
              </li>
              <li className="flex items-center space-x-2 hover:text-primary transition-colors cursor-pointer">
                <BarChart3 className="w-4 h-4 text-primary" />
                <Link href="/services" className="hover:text-primary transition-colors">
                  Business Intelligence
                </Link>
              </li>
              <li className="flex items-center space-x-2 hover:text-primary transition-colors cursor-pointer">
                <Target className="w-4 h-4 text-primary" />
                <Link href="/templates" className="hover:text-primary transition-colors">
                  Pre-Built Templates
                </Link>
              </li>
              <li className="flex items-center space-x-2 hover:text-primary transition-colors cursor-pointer">
                <Globe className="w-4 h-4 text-primary" />
                <Link href="/services" className="hover:text-primary transition-colors">
                  Hosting & API Management
                </Link>
              </li>
              <li className="flex items-center space-x-2 hover:text-primary transition-colors cursor-pointer">
                <ShoppingBag className="w-4 h-4 text-primary" />
                <Link href="/packages" className="hover:text-primary transition-colors">
                  Service Packages
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Templates */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Templates</h4>
            <ul className="space-y-2 text-sm sm:text-base text-gray-400">
              <li className="flex items-center space-x-2 hover:text-primary transition-colors cursor-pointer">
                <Users className="w-4 h-4 text-primary" />
                <Link href="/templates" className="hover:text-primary transition-colors">
                  Healthcare Automation
                </Link>
              </li>
              <li className="flex items-center space-x-2 hover:text-primary transition-colors cursor-pointer">
                <TrendingUp className="w-4 h-4 text-primary" />
                <Link href="/templates" className="hover:text-primary transition-colors">
                  E-commerce Solutions
                </Link>
              </li>
              <li className="flex items-center space-x-2 hover:text-primary transition-colors cursor-pointer">
                <Shield className="w-4 h-4 text-primary" />
                <Link href="/templates" className="hover:text-primary transition-colors">
                  Real Estate Tools
                </Link>
              </li>
              <li className="flex items-center space-x-2 hover:text-primary transition-colors cursor-pointer">
                <Settings className="w-4 h-4 text-primary" />
                <Link href="/templates" className="hover:text-primary transition-colors">
                  Professional Services
                </Link>
              </li>
              <li className="flex items-center space-x-2 hover:text-primary transition-colors cursor-pointer">
                <Clock className="w-4 h-4 text-primary" />
                <Link href="/templates" className="hover:text-primary transition-colors">
                  Food & Beverage
                </Link>
              </li>
              <li className="flex items-center space-x-2 hover:text-primary transition-colors cursor-pointer">
                <BarChart3 className="w-4 h-4 text-primary" />
                <Link href="/templates" className="hover:text-primary transition-colors">
                  Financial Services
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Regions */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Regions</h4>
            <ul className="space-y-2 text-sm sm:text-base">
              <li className="text-gray-400 flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>🇬🇧 United Kingdom</span>
              </li>
              <li className="text-gray-400 flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>🇺🇸 United States</span>
              </li>
              <li className="text-gray-400 flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>🇦🇺 Australia</span>
              </li>
              <li className="text-gray-400 flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>🇪🇺 Europe</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Contact Info */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm sm:text-base">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <p className="font-semibold text-white">Email</p>
                <p className="text-gray-400">hello@growfastwithus.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-primary" />
              <div>
                <p className="font-semibold text-white">Phone</p>
                <p className="text-gray-400">+44 20 7946 0958</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="font-semibold text-white">Business Hours</p>
                <p className="text-gray-400">Mon-Fri: 9AM-6PM GMT</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-gray-400 text-sm sm:text-base">© 2025 GrowFastWithUs. All rights reserved.</p>
          <div className="flex flex-wrap justify-center sm:justify-end space-x-4 sm:space-x-6 text-sm sm:text-base">
            <Link href="/about" className="text-gray-400 hover:text-primary transition-colors">
              About Us
            </Link>
            <Link href="/privacy-policy" className="text-gray-400 hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-gray-400 hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="/gdpr" className="text-gray-400 hover:text-primary transition-colors">
              GDPR
            </Link>
            <Link href="/booking" className="text-gray-400 hover:text-primary transition-colors">
              Book Consultation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 
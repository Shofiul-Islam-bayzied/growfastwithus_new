import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PageHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <img 
              src="/logo.png" 
              alt="GrowFastWithUs Logo" 
              className="h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity"
            />
          </Link>
          
          {/* Back to Home Button */}
          <Link href="/">
            <Button 
              variant="outline" 
              className="border-gray-700 hover:bg-gray-800 hover:border-primary/50 transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}


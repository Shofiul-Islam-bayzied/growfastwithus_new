import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4 sm:px-6">
      <Card className="w-full max-w-lg bg-gray-900/50 border-gray-700">
        <CardContent className="p-6 sm:p-8 lg:p-10">
          <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
            <AlertCircle className="h-10 w-10 sm:h-12 sm:h-12 text-primary flex-shrink-0 mt-1" />
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">404 - Page Not Found</h1>
              <p className="text-sm sm:text-base text-gray-400">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
            <Link href="/">
              <Button 
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white py-6 sm:py-3 text-base touch-manipulation"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </Link>
            <Button 
              variant="outline"
              onClick={() => window.history.back()}
              className="w-full sm:w-auto border-gray-600 text-gray-300 hover:bg-gray-800 py-6 sm:py-3 text-base touch-manipulation"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

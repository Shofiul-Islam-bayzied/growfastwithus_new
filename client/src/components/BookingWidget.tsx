import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users } from "lucide-react";

interface BookingWidgetProps {
  calLink?: string;
  title?: string;
  description?: string;
  className?: string;
}

export function BookingWidget({ 
  calLink = "grow-fast-with-us/30min", 
  title = "Schedule a Consultation",
  description = "Book a free 30-minute consultation to discuss your automation needs",
  className = "" 
}: BookingWidgetProps) {
  
  const openCalModal = () => {
    // Use your actual Cal.com booking link
    window.open(`https://cal.com/${calLink}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Calendar className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <p className="text-gray-600 text-sm">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
            <Clock className="h-5 w-5 text-primary mb-1" />
            <span className="text-sm font-medium">30 Minutes</span>
            <span className="text-xs text-gray-500">Duration</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
            <Users className="h-5 w-5 text-primary mb-1" />
            <span className="text-sm font-medium">1-on-1</span>
            <span className="text-xs text-gray-500">Session</span>
          </div>
        </div>
        
        <Button 
          onClick={openCalModal}
          className="w-full bg-primary hover:bg-primary/90 text-white"
          size="lg"
        >
          Schedule Now
        </Button>
        
        <p className="text-xs text-center text-gray-500">
          Free consultation • No commitment required
        </p>
      </CardContent>
    </Card>
  );
}



// Simple booking button component
export function BookingButton({ 
  calLink = "grow-fast-with-us/30min",
  children = "Book Consultation",
  variant = "default",
  size = "default",
  className = ""
}: {
  calLink?: string;
  children?: React.ReactNode;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
}) {
  
  const handleClick = () => {
    // Use your actual Cal.com booking link
    console.log('BookingButton clicked, opening:', `https://cal.com/${calLink}`);
    window.open(`https://cal.com/${calLink}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <Button 
      onClick={handleClick}
      variant={variant}
      size={size}
      className={className}
    >
      {children}
    </Button>
  );
}
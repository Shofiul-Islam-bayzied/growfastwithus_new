import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface TrackingCode {
  id: number;
  name: string;
  type: string;
  code: string;
  placement: string;
  isActive: boolean;
  description?: string;
}

export function TrackingCodesProvider() {
  const { data: trackingCodes = [] } = useQuery({
    queryKey: ["/api/tracking-codes/active"],
    queryFn: async () => {
      const response = await fetch("/api/tracking-codes/active");
      if (!response.ok) throw new Error("Failed to fetch tracking codes");
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (!trackingCodes.length) return;

    // Clear existing tracking codes
    const existingScripts = document.querySelectorAll('[data-tracking-code]');
    existingScripts.forEach(script => script.remove());

    // Inject new tracking codes
    trackingCodes.forEach((code: TrackingCode) => {
      if (!code.isActive || !code.code) return;

      try {
        // Create script element
        const script = document.createElement('script');
        script.setAttribute('data-tracking-code', code.id.toString());
        script.setAttribute('data-tracking-type', code.type);
        script.setAttribute('data-tracking-placement', code.placement);
        
        // Set script content
        script.textContent = code.code;
        
        // Insert based on placement
        if (code.placement === 'head' || code.placement === 'both') {
          document.head.appendChild(script);
        }
        
        if (code.placement === 'body' || code.placement === 'both') {
          document.body.appendChild(script);
        }

        console.log(`Injected tracking code: ${code.name} (${code.type})`);
      } catch (error) {
        console.error(`Failed to inject tracking code ${code.name}:`, error);
      }
    });

    // Cleanup function
    return () => {
      const scripts = document.querySelectorAll('[data-tracking-code]');
      scripts.forEach(script => script.remove());
    };
  }, [trackingCodes]);

  // This component doesn't render anything
  return null;
} 
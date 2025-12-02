import { useState } from "react";
import { Mic, Phone, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { type VoiceAIAddon, type Currency, convertPrice, formatPrice } from "@/lib/templates";

interface VoiceAIAddonCardProps {
  addon: VoiceAIAddon;
  currency: Currency;
  isSelected: boolean;
  onToggle: (addonId: string) => void;
  className?: string;
}

export function VoiceAIAddonCard({ 
  addon, 
  currency, 
  isSelected, 
  onToggle,
  className = ""
}: VoiceAIAddonCardProps) {
  const monthlyPrice = convertPrice(addon.monthlyPrice, 'GBP', currency.code);
  const setupFee = convertPrice(addon.setupFee, 'GBP', currency.code);
  const perMinuteRate = (addon.perMinuteRate * currency.rate).toFixed(3);

  const isEnterprise = addon.id === 'voice-enterprise';

  return (
    <Card className={`${className} ${isSelected ? 'ring-2 ring-primary' : ''} transition-all hover:shadow-lg`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Phone className="w-5 h-5 text-primary" />
            {addon.name}
            {addon.id === 'voice-standard' && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Popular
              </Badge>
            )}
          </CardTitle>
          <Switch
            checked={isSelected}
            onCheckedChange={() => onToggle(addon.id)}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">
              {isEnterprise ? 'Custom' : formatPrice(monthlyPrice, currency.code)}
            </span>
            {!isEnterprise && <span className="text-gray-500">/month</span>}
          </div>
          
          {!isEnterprise && (
            <div className="text-sm text-gray-600">
              Setup: {formatPrice(setupFee, currency.code)}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm">
              {addon.includedMinutes.toLocaleString()} minutes included
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm">
              {isEnterprise ? 'Custom pricing' : `${currency.symbol}${perMinuteRate} per extra minute`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm">
              Inbound & outbound AI calls
            </span>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm">
              {addon.id === 'voice-lite' ? 'Basic' : 
               addon.id === 'voice-standard' ? 'Advanced' : 'Enterprise'} voice AI features
            </span>
          </div>

          {addon.id === 'voice-standard' && (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm">Priority support</span>
            </div>
          )}

          {isEnterprise && (
            <>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">Dedicated account manager</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">Custom integrations</span>
              </div>
            </>
          )}
        </div>

        {isEnterprise && (
          <div className="pt-2">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.open('/booking', '_blank')}
            >
              Contact Sales
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
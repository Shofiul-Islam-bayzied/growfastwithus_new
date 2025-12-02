import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { insertContactSchema } from "@shared/schema";
import { ChevronLeft, ChevronRight, CheckCircle, Phone, Calendar } from "lucide-react";
import { z } from "zod";

type ContactFormData = z.infer<typeof insertContactSchema>;

const industries = [
  "Healthcare",
  "Real Estate", 
  "E-commerce",
  "Professional Services",
  "Restaurant & Hospitality",
  "Fitness & Wellness",
  "Marketing & Advertising",
  "Technology",
  "Manufacturing",
  "Education",
  "Finance",
  "Other",
];

const businessSizes = [
  "Small Business (1-10 employees)",
  "Medium Business (11-50 employees)",
  "Large Business (51-200 employees)", 
  "Enterprise (200+ employees)",
];

const painPointOptions = [
  "Manual data entry",
  "Customer support overload",
  "Inventory management",
  "Lead follow-up",
  "Appointment scheduling",
  "Invoice processing",
  "Report generation",
  "Email marketing",
];

export function AdvancedContactForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const totalSteps = 4;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      painPoints: [],
      timeSpent: 20,
    },
  });

  const { watch, setValue } = form;
  const painPoints = watch("painPoints") || [];
  const timeSpent = watch("timeSpent") || 20;

  const createContactMutation = useMutation({
    mutationFn: (data: ContactFormData) => apiRequest("/api/contacts", "POST", data),
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Application Submitted Successfully!",
        description: "We'll contact you within 24 hours to schedule your discovery call.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
    },
    onError: (error) => {
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    },
  });

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePainPointChange = (painPoint: string, checked: boolean) => {
    // Prevent unwanted scrolling by capturing current position
    const currentScrollY = window.scrollY;
    
    const updatedPainPoints = checked
      ? [...painPoints, painPoint]
      : painPoints.filter((p) => p !== painPoint);
    setValue("painPoints", updatedPainPoints);
    
    // Maintain scroll position after state update
    setTimeout(() => {
      window.scrollTo(0, currentScrollY);
    }, 0);
  };

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Send to backend email endpoint
      await fetch("/api/send-contact-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      // Send to Brevo
      await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "api-key": "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",
          "content-type": "application/json"
        },
        body: JSON.stringify({
          email: data.email,
          attributes: {
            FIRSTNAME: data.name,
            COMPANY: data.company,
            PHONE: data.phone,
            INDUSTRY: data.industry,
            BUSINESS_SIZE: data.businessSize,
            TIME_SPENT: data.timeSpent,
            MESSAGE: data.message
          },
          updateEnabled: true
        })
      });
      setIsSubmitted(true);
      toast({
        title: "Application Submitted Successfully!",
        description: "We'll contact you within 24 hours to schedule your discovery call.",
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    }
  };

  const progress = (currentStep / totalSteps) * 100;

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-3xl font-bold text-green-600">Thank You!</h3>
        <p className="text-xl text-muted-foreground max-w-md mx-auto">
          Your application has been submitted successfully. We'll contact you within 24 hours to schedule your free discovery call.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/booking" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Call Now
            </Button>
          </a>
          <a href="tel:+8801647267027">
            <Button 
              size="lg" 
              variant="outline" 
              className="hover:bg-orange-100 hover:text-orange-700 transition-colors"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call Us Directly
            </Button>
          </a>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm font-semibold text-primary">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold">Basic Information</h3>
                <p className="text-muted-foreground">Let's start with the basics</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    {...form.register("name")}
                    placeholder="John Doe"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register("email")}
                    placeholder="john@company.com"
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    {...form.register("company")}
                    placeholder="Acme Corp"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    {...form.register("phone")}
                    placeholder="+44 7000 000000"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="industry">Industry</Label>
                <Select onValueChange={(value) => setValue("industry", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold">Business Details</h3>
                <p className="text-muted-foreground">Tell us about your business</p>
              </div>

              <div>
                <Label>Business Size</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {businessSizes.map((size) => (
                    <Button
                      key={size}
                      type="button"
                      variant={watch("businessSize") === size ? "default" : "outline"}
                      className="h-auto p-4 text-left justify-start"
                      onClick={() => setValue("businessSize", size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold">Automation Goals</h3>
                <p className="text-muted-foreground">Help us understand your needs</p>
              </div>

              <div>
                <Label>Hours spent on manual tasks per week: {timeSpent}</Label>
                <div className="mt-4">
                  <Slider
                    value={[timeSpent]}
                    onValueChange={(value) => setValue("timeSpent", value[0])}
                    max={40}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>1 hour</span>
                    <span>40+ hours</span>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="message">
                  What's your biggest time-wasting task? (Optional)
                </Label>
                <Textarea
                  id="message"
                  {...form.register("message")}
                  placeholder="Describe the manual process that takes up most of your time..."
                  rows={4}
                />
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold">Review & Submit</h3>
                <p className="text-muted-foreground">Review your information and submit</p>
              </div>

              <Card className="glass-card">
                <CardContent className="p-6 space-y-4">
                  <h4 className="font-semibold">Your Information Summary:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Name:</span> {watch("name")}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {watch("email")}
                    </div>
                    {watch("company") && (
                      <div>
                        <span className="font-medium">Company:</span> {watch("company")}
                      </div>
                    )}
                    {watch("industry") && (
                      <div>
                        <span className="font-medium">Industry:</span> {watch("industry")}
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="font-medium">Weekly manual hours:</span> {timeSpent}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button type="button" onClick={nextStep}>
              Next Step
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              type="submit" 
              disabled={createContactMutation.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              {createContactMutation.isPending ? "Submitting..." : "Submit Application"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
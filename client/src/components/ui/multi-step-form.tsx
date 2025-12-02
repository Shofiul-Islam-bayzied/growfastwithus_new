import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Checkbox } from "./checkbox";
import { Textarea } from "./textarea";
import { Slider } from "./slider";
import { Progress } from "./progress";
import { ChevronLeft, ChevronRight } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  phone: z.string().optional(),
  industry: z.string().optional(),
  businessSize: z.string().optional(),
  painPoints: z.array(z.string()).optional(),
  timeSpent: z.number().min(1).max(40).optional(),
  message: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface MultiStepFormProps {
  onSubmit: (data: ContactFormData) => void;
}

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

export function MultiStepForm({ onSubmit }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      painPoints: [],
      timeSpent: 20,
    },
  });

  const { watch, setValue } = form;
  const painPoints = watch("painPoints") || [];
  const timeSpent = watch("timeSpent") || 20;

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

  const progress = (currentStep / totalSteps) * 100;

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

              <div>
                <Label>Current Pain Points (Select all that apply)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {painPointOptions.map((painPoint) => (
                    <div key={painPoint} className="flex items-center space-x-2">
                      <Checkbox
                        id={painPoint}
                        checked={painPoints.includes(painPoint)}
                        onCheckedChange={(checked) =>
                          handlePainPointChange(painPoint, checked as boolean)
                        }
                      />
                      <Label htmlFor={painPoint} className="text-sm">
                        {painPoint}
                      </Label>
                    </div>
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
                <h3 className="text-2xl font-bold">Almost Done!</h3>
                <p className="text-muted-foreground">Review and submit your information</p>
              </div>

              <div className="glass-card p-6 rounded-xl space-y-4">
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
                {painPoints.length > 0 && (
                  <div>
                    <span className="font-medium">Pain Points:</span>
                    <ul className="list-disc list-inside text-sm mt-1">
                      {painPoints.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <span className="font-medium">Weekly manual hours:</span> {timeSpent}
                </div>
              </div>
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
            <Button type="submit">
              Submit Application
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

const forgotSchema = z.object({
  email: z.string().email("Valid email required"),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export default function AdminForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSent(true);
        toast({ title: "Check your email", description: "A reset link has been sent if the email exists." });
      } else {
        const err = await res.json();
        toast({ title: "Error", description: err.error || "Could not send reset email.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "An error occurred.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-black/50 backdrop-blur-xl border-white/10 shadow-2xl">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-2xl font-bold text-white">Forgot Password</CardTitle>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="text-center text-white py-8">
                If the email exists, a reset link has been sent.<br />
                <a href="/admin-login" className="text-primary hover:underline mt-4 block">Back to Login</a>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Email</FormLabel>
                      <FormControl><Input {...field} type="email" placeholder="Enter your admin email" className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-primary" disabled={isLoading} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3" disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>
              </Form>
            )}
            <div className="mt-6 text-center">
              <a href="/admin-login" className="text-sm text-primary hover:underline">Back to Login</a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { TrackingCodesProvider } from "@/components/tracking-codes-provider";
import { ScrollToTop } from "@/components/ScrollToTop";
import Home from "@/pages/home";
import Services from "@/pages/services";
import Templates from "@/pages/templates";
import Packages from "@/pages/packages";
import TemplateDetail from "@/pages/template-detail-new";
import Booking from "@/pages/booking";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import GDPR from "@/pages/gdpr";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminLogin from "@/pages/admin-login";
import AdminRegister from "@/pages/admin-register";
import AdminForgotPassword from "@/pages/admin-forgot-password";
import AdminResetPassword from "@/pages/admin-reset-password";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/services" component={Services} />
        <Route path="/templates" component={Templates} />
        <Route path="/packages" component={Packages} />
        <Route path="/template/:id" component={TemplateDetail} />
        <Route path="/booking" component={Booking} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin-login" component={AdminLogin} />
        <Route path="/admin-register" component={AdminRegister} />
        <Route path="/admin-forgot-password" component={AdminForgotPassword} />
        <Route path="/admin-reset-password" component={AdminResetPassword} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/terms-of-service" component={TermsOfService} />
        <Route path="/gdpr" component={GDPR} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="growfast-theme">
        <TooltipProvider>
          <TrackingCodesProvider />
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

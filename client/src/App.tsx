import { lazy, Suspense } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { TrackingCodesProvider } from "@/components/tracking-codes-provider";
import { ScrollToTop } from "@/components/ScrollToTop";

// Home page loads eagerly for fastest initial render
import Home from "@/pages/home";

// Lazy load other pages for code splitting
const Services = lazy(() => import("@/pages/services"));
const Templates = lazy(() => import("@/pages/templates"));
const Packages = lazy(() => import("@/pages/packages"));
const TemplateDetail = lazy(() => import("@/pages/template-detail-new"));
const Booking = lazy(() => import("@/pages/booking"));
const Blog = lazy(() => import("@/pages/blog"));
const BlogPost = lazy(() => import("@/pages/blog-post"));
const About = lazy(() => import("@/pages/about"));
const PrivacyPolicy = lazy(() => import("@/pages/privacy-policy"));
const TermsOfService = lazy(() => import("@/pages/terms-of-service"));
const GDPR = lazy(() => import("@/pages/gdpr"));
const AdminDashboard = lazy(() => import("@/pages/admin/dashboard"));
const AdminLogin = lazy(() => import("@/pages/admin-login"));
const AdminRegister = lazy(() => import("@/pages/admin-register"));
const AdminForgotPassword = lazy(() => import("@/pages/admin-forgot-password"));
const AdminResetPassword = lazy(() => import("@/pages/admin-reset-password"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Minimal loading fallback for instant feel
function PageLoader() {
  return null; // No loader for faster perceived performance
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/services" component={Services} />
          <Route path="/templates" component={Templates} />
          <Route path="/packages" component={Packages} />
          <Route path="/template/:id" component={TemplateDetail} />
          <Route path="/booking" component={Booking} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/about" component={About} />
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
      </Suspense>
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

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LogOut, Settings, Users, MessageSquare, Star, Palette, Upload, Mail, Monitor, BarChart3, Code, Globe } from "lucide-react";
import ContentEditor from "@/components/admin/content-editor";
import ThemeCustomizer from "@/components/admin/theme-customizer";
import AdminProfileManagement from "@/components/admin/admin-profile-management";
import ContactsManager from "@/components/admin/contacts-manager";
import EmailSettings from "@/components/admin/email-settings";
import TrackingCodesManager from "@/components/admin/tracking-codes-manager";
import { WordPressSettings } from "@/components/admin/wordpress-settings";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("content");
  const { isAuthenticated, isLoading, logout } = useAdminAuth();
  const [, setLocation] = useLocation();
  const { data: stats = {} } = useQuery({
    queryKey: ["/api/admin/stats"],
    enabled: true,
  });

  if (isLoading) return null;
  if (!isAuthenticated) {
    setLocation("/admin-login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-400">Manage your GrowFastWithUs website</p>
            </div>
            <Button
              onClick={logout}
              variant="outline"
              className="bg-transparent border-white/20 text-white hover:bg-white/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/50 backdrop-blur-xl border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Contacts</p>
                  <p className="text-2xl font-bold text-white">{(stats as any).totalContacts || 0}</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/50 backdrop-blur-xl border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Templates</p>
                  <p className="text-2xl font-bold text-white">{(stats as any).totalTemplates || 15}</p>
                </div>
                <Upload className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/50 backdrop-blur-xl border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Reviews</p>
                  <p className="text-2xl font-bold text-white">{(stats as any).totalReviews || 0}</p>
                </div>
                <Star className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/50 backdrop-blur-xl border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Performance</p>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Excellent
                  </Badge>
                </div>
                <Monitor className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Card className="bg-black/50 backdrop-blur-xl border-white/10">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-6 bg-white/5">
                <TabsTrigger value="content" className="data-[state=active]:bg-primary">
                  <Upload className="w-4 h-4 mr-2" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="contacts" className="data-[state=active]:bg-primary">
                  <Users className="w-4 h-4 mr-2" />
                  Contacts
                </TabsTrigger>

                <TabsTrigger value="theme" className="data-[state=active]:bg-primary">
                  <Palette className="w-4 h-4 mr-2" />
                  Theme
                </TabsTrigger>
                <TabsTrigger value="tracking" className="data-[state=active]:bg-primary">
                  <Code className="w-4 h-4 mr-2" />
                  Tracking
                </TabsTrigger>
                <TabsTrigger value="wordpress" className="data-[state=active]:bg-primary">
                  <Globe className="w-4 h-4 mr-2" />
                  WordPress
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-primary">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent>
              <TabsContent value="content" className="space-y-4">
                <ContentEditor />
              </TabsContent>

              <TabsContent value="contacts" className="space-y-4">
                <ContactsManager />
              </TabsContent>



              <TabsContent value="theme" className="space-y-4">
                <ThemeCustomizer />
              </TabsContent>

              <TabsContent value="tracking" className="space-y-4">
                <TrackingCodesManager />
              </TabsContent>

              <TabsContent value="wordpress" className="space-y-4">
                <WordPressSettings />
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <EmailSettings />
                <AdminProfileManagement />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
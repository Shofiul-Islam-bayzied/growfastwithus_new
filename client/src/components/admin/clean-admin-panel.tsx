import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Settings,
  Palette,
  Upload,
  BarChart3,
  Mail,
  Shield,
  Database,
  Users,
  RefreshCw,
  Save,
  Eye,
  Trash2,
  Edit,
  Copy,
  Plus,
  Image as ImageIcon,
  Monitor,
  TrendingUp,
  Clock,
  Target
} from "lucide-react";
import {
  ThemeCustomizerSkeleton,
  SiteSettingsSkeleton,
  MediaLibrarySkeleton,
  ReviewManagerSkeleton,
  AnalyticsSkeleton,
  AdminSettingsSkeleton,
  ContactManagerSkeleton
} from "@/components/admin/loading-skeletons";

// Theme Customizer Component
function ThemeCustomizer() {
  const { toast } = useToast();
  const [colors, setColors] = useState({
    primary: "#FF6B35",
    secondary: "#FFFFFF",
    accent: "#1F2937"
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const { data: siteSettings } = useQuery({
    queryKey: ["/api/admin/site-settings"],
  });

  const themeMutation = useMutation({
    mutationFn: (themeData: any) => apiRequest("/api/admin/theme", "POST", themeData),
    onSuccess: () => {
      toast({
        title: "Theme Updated",
        description: "Your website theme has been updated successfully.",
      });
    },
  });

  const logoMutation = useMutation({
    mutationFn: (formData: FormData) => apiRequest("/api/admin/logo/upload", "POST", formData),
    onSuccess: (response: any) => {
      toast({
        title: "Logo Updated",
        description: "Your website logo has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/site-settings"] });
    },
  });

  const handleLogoUpload = () => {
    if (!logoFile) return;
    const formData = new FormData();
    formData.append('logo', logoFile);
    logoMutation.mutate(formData);
  };

  const handleSaveTheme = () => {
    themeMutation.mutate({
      colors,
      updatedAt: new Date()
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Theme Customizer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Logo Upload */}
        <div>
          <Label className="text-base font-semibold">Website Logo</Label>
          <div className="mt-3 p-4 border-2 border-dashed border-gray-300 rounded-lg">
            {siteSettings && (siteSettings as any)?.site_logo ? (
              <div className="flex items-center gap-4">
                <img src={(siteSettings as any).site_logo} alt="Current Logo" className="h-12 w-auto" />
                <div>
                  <p className="text-sm text-gray-600">Current Logo</p>
                  <Button variant="outline" size="sm" onClick={() => document.getElementById('logo-upload')?.click()}>
                    Change Logo
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 mb-2">Upload your website logo</p>
                <Button variant="outline" onClick={() => document.getElementById('logo-upload')?.click()}>
                  Choose Logo
                </Button>
              </div>
            )}
            
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            
            {logoFile && (
              <div className="mt-4 p-3 bg-gray-50 rounded border">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{logoFile.name}</span>
                  <Button size="sm" onClick={handleLogoUpload} disabled={logoMutation.isPending}>
                    {logoMutation.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Upload"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Color Customization */}
        <div>
          <Label className="text-base font-semibold">Brand Colors</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
            <div>
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="primary-color"
                  type="color"
                  value={colors.primary}
                  onChange={(e) => setColors({...colors, primary: e.target.value})}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={colors.primary}
                  onChange={(e) => setColors({...colors, primary: e.target.value})}
                  className="font-mono text-sm"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="secondary-color">Secondary Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="secondary-color"
                  type="color"
                  value={colors.secondary}
                  onChange={(e) => setColors({...colors, secondary: e.target.value})}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={colors.secondary}
                  onChange={(e) => setColors({...colors, secondary: e.target.value})}
                  className="font-mono text-sm"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="accent-color">Accent Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="accent-color"
                  type="color"
                  value={colors.accent}
                  onChange={(e) => setColors({...colors, accent: e.target.value})}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={colors.accent}
                  onChange={(e) => setColors({...colors, accent: e.target.value})}
                  className="font-mono text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <Button onClick={handleSaveTheme} disabled={themeMutation.isPending} className="flex items-center gap-2">
          {themeMutation.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Theme
        </Button>
      </CardContent>
    </Card>
  );
}

// Site Settings Manager
function SiteSettingsManager() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    siteName: "GrowFastWithUs",
    tagline: "Automate Your Business Growth",
    description: "Professional business automation solutions",
    contactEmail: "hello@growfastwithus.com",
    phone: "+1 (555) 123-4567"
  });

  const { data: currentSettings, isLoading } = useQuery({
    queryKey: ["/api/admin/site-settings"],
  });

  const settingsMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/admin/site-settings", "POST", data),
    onSuccess: () => {
      toast({
        title: "Settings Updated",
        description: "Your site settings have been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/site-settings"] });
    },
  });

  const handleSaveSettings = () => {
    settingsMutation.mutate(settings);
  };

  if (isLoading) {
    return <SiteSettingsSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Site Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="site-name">Site Name</Label>
          <Input
            id="site-name"
            value={settings.siteName}
            onChange={(e) => setSettings({...settings, siteName: e.target.value})}
            placeholder="Your company name"
          />
        </div>
        
        <div>
          <Label htmlFor="tagline">Tagline</Label>
          <Input
            id="tagline"
            value={settings.tagline}
            onChange={(e) => setSettings({...settings, tagline: e.target.value})}
            placeholder="Brief description of your business"
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={settings.description}
            onChange={(e) => setSettings({...settings, description: e.target.value})}
            placeholder="Detailed description of your services"
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contact-email">Contact Email</Label>
            <Input
              id="contact-email"
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
              placeholder="contact@yourcompany.com"
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={settings.phone}
              onChange={(e) => setSettings({...settings, phone: e.target.value})}
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        <Button onClick={handleSaveSettings} disabled={settingsMutation.isPending} className="flex items-center gap-2">
          {settingsMutation.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
}

// Media Library
function MediaLibrary() {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadUrl, setUploadUrl] = useState("");

  const { data: mediaFiles, isLoading } = useQuery({
    queryKey: ["/api/admin/media"],
  });

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const file = formData.get('file') as File;
      if (!file) throw new Error('No file selected');
      
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file');
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }
      
      return apiRequest("/api/admin/media/upload", "POST", formData);
    },
    onSuccess: (response: any) => {
      toast({
        title: "Upload Successful",
        description: `${response.file.name} has been uploaded successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/media"] });
      setSelectedFile(null);
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload file.",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('file', selectedFile);
    uploadMutation.mutate(formData);
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "URL Copied",
        description: "Image URL has been copied to clipboard.",
      });
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Media Library
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Section */}
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Upload Media Files</h3>
            <p className="text-gray-600 mb-4">Drag and drop files here, or click to select</p>
            <p className="text-xs text-gray-500 mb-4">Supports: JPG, PNG, GIF, WebP • Max size: 5MB</p>
            
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button variant="outline" className="cursor-pointer">
                Choose File
              </Button>
            </label>
            
            {selectedFile && (
              <div className="mt-4 p-3 bg-gray-50 rounded border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <Button onClick={handleFileUpload} disabled={uploadMutation.isPending} size="sm">
                    {uploadMutation.isPending ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                    Upload
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Media Gallery */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="border rounded-lg p-3">
                <div className="aspect-square bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded mb-1 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.isArray(mediaFiles) && mediaFiles.map((file: any) => (
              <div key={file.id} className="border rounded-lg p-3">
                <div className="aspect-square bg-gray-100 rounded mb-2 flex items-center justify-center">
                  {file.url ? (
                    <img src={file.url} alt={file.name} className="w-full h-full object-cover rounded" />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{file.size}</p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => copyToClipboard(file.url)}
                >
                  Copy URL
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}



// Analytics Dashboard
function Analytics() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["/api/admin/analytics"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="h-8 w-8 mx-auto mb-2 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-8 w-16 mx-auto mb-1 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-24 mx-auto bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Website Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">↑ 23%</div>
              <div className="text-sm text-gray-600">Traffic Growth</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Target className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-600">7.2%</div>
              <div className="text-sm text-gray-600">Conversion Rate</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Clock className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-purple-600">3m 45s</div>
              <div className="text-sm text-gray-600">Avg. Session</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Admin Settings
function AdminSettings() {
  const { toast } = useToast();
  const [emailSettings, setEmailSettings] = useState({
    notifications: true,
    backups: true,
    security: false
  });
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const settingsMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/admin/settings", "POST", data),
    onSuccess: () => {
      toast({
        title: "Settings Updated",
        description: "Admin settings have been saved successfully.",
      });
    },
  });

  // Password change mutation
  const passwordMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/auth/change-password", "POST", data),
    onSuccess: () => {
      toast({
        title: "Password Changed Successfully",
        description: "Your password has been updated. A confirmation email has been sent.",
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordSection(false);
    },
    onError: (error: any) => {
      toast({
        title: "Password Change Failed",
        description: error.response?.data?.error || "Failed to change password",
        variant: "destructive"
      });
    },
  });

  const handleSaveSettings = () => {
    settingsMutation.mutate(emailSettings);
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long",
        variant: "destructive"
      });
      return;
    }

    setIsChangingPassword(true);
    passwordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });
    setIsChangingPassword(false);
  };

  return (
    <div className="space-y-6">
      {/* Admin Profile Management Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Admin Profile Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {/* Password Management Section */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Change Password
                </h3>
                <p className="text-sm text-gray-600">Update your admin password with email verification</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowPasswordSection(!showPasswordSection)}
              >
                {showPasswordSection ? 'Cancel' : 'Change Password'}
              </Button>
            </div>

            {/* Password Change Form */}
            {showPasswordSection && (
              <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    placeholder="Enter current password"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    placeholder="Enter new password (min 8 characters)"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    placeholder="Confirm new password"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handlePasswordChange}
                    disabled={isChangingPassword || !passwordData.currentPassword || !passwordData.newPassword}
                    className="flex items-center gap-2"
                  >
                    {isChangingPassword && <RefreshCw className="h-4 w-4 animate-spin" />}
                    Update Password
                  </Button>
                </div>
                
                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                  <p className="font-medium">Password Requirements:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Minimum 8 characters</li>
                    <li>Email confirmation will be sent after successful change</li>
                    <li>You'll be logged out after password change for security</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Forgot Password Link */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Forgot Password
                </h3>
                <p className="text-sm text-gray-600">Reset password via email verification</p>
              </div>
              <Button variant="outline" asChild>
                <a href="/admin-forgot-password" target="_blank">
                  Reset via Email
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Notifications
                </h3>
                <p className="text-sm text-gray-600">Receive alerts for new contacts and reviews</p>
              </div>
              <Button variant="outline">Configure</Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Backup Settings
                </h3>
                <p className="text-sm text-gray-600">Automatic daily backups enabled</p>
              </div>
              <Button variant="outline">Manage</Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Security Settings
                </h3>
                <p className="text-sm text-gray-600">Two-factor authentication</p>
              </div>
              <Button variant="outline">Setup</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Main Clean Admin Panel Component
export default function CleanAdminPanel() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your website content and settings</p>
        </div>

        <Tabs defaultValue="content" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ThemeCustomizer />
              <SiteSettingsManager />
            </div>
            <MediaLibrary />
          </TabsContent>



          <TabsContent value="analytics">
            <Analytics />
          </TabsContent>

          <TabsContent value="contacts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Contact Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Contact management features coming soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
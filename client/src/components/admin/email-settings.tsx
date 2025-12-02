import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Mail, Settings, Send, TestTube, Check, X, AlertCircle, Server, Save } from "lucide-react";

interface EmailSetting {
  id: number;
  contactEmail: string;
  notificationEmail: string;
  emailProvider: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function EmailSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("smtp");
  const [testEmail, setTestEmail] = useState("");
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const [emailSettings, setEmailSettings] = useState({
    contactEmail: "contact@growfastwithus.com",
    notificationEmail: "admin@growfastwithus.com",
    emailProvider: "smtp",
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUser: "",
    smtpPassword: "",
    isActive: true,
  });

  const [emailTemplates, setEmailTemplates] = useState({
    welcomeSubject: "Welcome to GrowFastWithUs!",
    welcomeTemplate: `Hi {{name}},

Welcome to GrowFastWithUs! We're excited to help you automate your business processes.

Our team will review your requirements and get back to you within 24 hours.

Best regards,
The GrowFastWithUs Team`,
    
    contactSubject: "Thank you for contacting us!",
    contactTemplate: `Hi {{name}},

Thank you for reaching out to us. We've received your message about {{subject}}.

Our team will review your inquiry and respond within 1-2 business days.

Best regards,
The GrowFastWithUs Team`,

    notificationSubject: "New Contact Form Submission",
    notificationTemplate: `New contact form submission:

Name: {{name}}
Email: {{email}}
Company: {{company}}
Business Type: {{businessType}}
Message: {{message}}

Pain Points: {{painPoints}}
Automation Goals: {{automationGoals}}
Monthly Revenue: {{monthlyRevenue}}
Team Size: {{teamSize}}
Urgency: {{urgency}}`,
  });

  // Fetch email settings
  const { data: settings = {} as EmailSetting, isLoading } = useQuery({
    queryKey: ["/api/admin/email-settings"],
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: (data: typeof emailSettings) => 
      apiRequest("/api/admin/email-settings", "PUT", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/email-settings"] });
      toast({ title: "Email settings updated successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to update email settings", variant: "destructive" });
    },
  });

  // Test email connection
  const testConnection = async () => {
    setIsTestingConnection(true);
    try {
      await apiRequest("/api/admin/test-email", "POST", {
        ...emailSettings,
        testEmail: testEmail || emailSettings.contactEmail,
      });
      toast({ title: "Email connection test successful!" });
    } catch (error) {
      toast({ 
        title: "Email connection test failed", 
        description: "Please check your SMTP settings",
        variant: "destructive" 
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  // Update email templates
  const updateTemplatesMutation = useMutation({
    mutationFn: (data: typeof emailTemplates) => 
      apiRequest("/api/admin/email-templates", "PUT", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/email-templates"] });
      toast({ title: "Email templates updated successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to update email templates", variant: "destructive" });
    },
  });

  const handleUpdateSettings = () => {
    updateSettingsMutation.mutate(emailSettings);
  };

  const handleUpdateTemplates = () => {
    updateTemplatesMutation.mutate(emailTemplates);
  };

  const emailProviders = [
    { value: "smtp", label: "Custom SMTP" },
    { value: "gmail", label: "Gmail" },
    { value: "outlook", label: "Outlook" },
    { value: "sendgrid", label: "SendGrid" },
    { value: "mailgun", label: "Mailgun" },
  ];

  const smtpPresets = {
    gmail: { host: "smtp.gmail.com", port: 587 },
    outlook: { host: "smtp-mail.outlook.com", port: 587 },
    yahoo: { host: "smtp.mail.yahoo.com", port: 587 },
    sendgrid: { host: "smtp.sendgrid.net", port: 587 },
    mailgun: { host: "smtp.mailgun.org", port: 587 },
  };

  const handleProviderChange = (provider: string) => {
    setEmailSettings({ 
      ...emailSettings, 
      emailProvider: provider,
      ...(smtpPresets[provider as keyof typeof smtpPresets] || {})
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-white">Loading email settings...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Email Settings</h2>
          <p className="text-gray-400">Configure SMTP settings and email templates</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={testConnection}
            disabled={isTestingConnection}
            variant="outline"
            className="text-white border-white/20 hover:bg-white/10"
          >
            <TestTube className="w-4 h-4 mr-2" />
            {isTestingConnection ? "Testing..." : "Test Connection"}
          </Button>
        </div>
      </div>

      {/* Status Card */}
      <Card className="bg-black/30 border-white/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${(settings as EmailSetting).isActive ? 'bg-green-500' : 'bg-red-500'}`} />
              <div>
                <p className="text-white font-medium">Email Service Status</p>
                <p className="text-sm text-gray-400">
                  {(settings as EmailSetting).isActive ? 'Active and ready to send emails' : 'Inactive - Configure settings below'}
                </p>
              </div>
            </div>
            <Badge variant={(settings as EmailSetting).isActive ? "default" : "destructive"}>
              {(settings as EmailSetting).isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-black/30">
          <TabsTrigger
            value="smtp"
            className="text-white data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            <Server className="w-4 h-4 mr-2" />
            SMTP Settings
          </TabsTrigger>
          <TabsTrigger
            value="templates"
            className="text-white data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            <Mail className="w-4 h-4 mr-2" />
            Email Templates
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="text-white data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            <Settings className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* SMTP Settings Tab */}
        <TabsContent value="smtp" className="space-y-6">
          <Card className="bg-black/30 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">SMTP Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-white">Email Provider</Label>
                  <Select
                    value={emailSettings.emailProvider}
                    onValueChange={handleProviderChange}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {emailProviders.map((provider) => (
                        <SelectItem key={provider.value} value={provider.value}>
                          {provider.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">SMTP Host</Label>
                  <Input
                    value={emailSettings.smtpHost}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
                    placeholder="smtp.gmail.com"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">SMTP Port</Label>
                  <Input
                    type="number"
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: parseInt(e.target.value) })}
                    placeholder="587"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">SMTP Username</Label>
                  <Input
                    value={emailSettings.smtpUser}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpUser: e.target.value })}
                    placeholder="your-email@gmail.com"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">SMTP Password</Label>
                  <Input
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })}
                    placeholder="Your app password"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Test Email Address</Label>
                  <Input
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="test@example.com"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={emailSettings.isActive}
                    onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, isActive: checked })}
                  />
                  <Label className="text-white">Enable Email Service</Label>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={testConnection}
                    disabled={isTestingConnection}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <TestTube className="w-4 h-4 mr-2" />
                    Test
                  </Button>
                  <Button
                    onClick={handleUpdateSettings}
                    disabled={updateSettingsMutation.isPending}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </div>

              {/* SMTP Help */}
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="text-blue-400 font-medium">SMTP Setup Tips</h4>
                    <ul className="text-sm text-gray-300 mt-2 space-y-1">
                      <li>• For Gmail: Use App Passwords instead of your regular password</li>
                      <li>• For Outlook: Enable "Less secure app access" or use App Passwords</li>
                      <li>• For custom SMTP: Contact your hosting provider for settings</li>
                      <li>• Test connection before saving to ensure settings work</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid gap-6">
            {/* Welcome Email Template */}
            <Card className="bg-black/30 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Welcome Email Template</CardTitle>
                <p className="text-gray-400">Sent to new users when they sign up</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white">Subject Line</Label>
                  <Input
                    value={emailTemplates.welcomeSubject}
                    onChange={(e) => setEmailTemplates({ ...emailTemplates, welcomeSubject: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Email Content</Label>
                  <Textarea
                    value={emailTemplates.welcomeTemplate}
                    onChange={(e) => setEmailTemplates({ ...emailTemplates, welcomeTemplate: e.target.value })}
                    className="bg-white/10 border-white/20 text-white min-h-[120px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact Confirmation Template */}
            <Card className="bg-black/30 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Contact Confirmation Template</CardTitle>
                <p className="text-gray-400">Sent to users when they submit the contact form</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white">Subject Line</Label>
                  <Input
                    value={emailTemplates.contactSubject}
                    onChange={(e) => setEmailTemplates({ ...emailTemplates, contactSubject: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Email Content</Label>
                  <Textarea
                    value={emailTemplates.contactTemplate}
                    onChange={(e) => setEmailTemplates({ ...emailTemplates, contactTemplate: e.target.value })}
                    className="bg-white/10 border-white/20 text-white min-h-[120px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Admin Notification Template */}
            <Card className="bg-black/30 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Admin Notification Template</CardTitle>
                <p className="text-gray-400">Sent to admins when new contacts submit forms</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white">Subject Line</Label>
                  <Input
                    value={emailTemplates.notificationSubject}
                    onChange={(e) => setEmailTemplates({ ...emailTemplates, notificationSubject: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Email Content</Label>
                  <Textarea
                    value={emailTemplates.notificationTemplate}
                    onChange={(e) => setEmailTemplates({ ...emailTemplates, notificationTemplate: e.target.value })}
                    className="bg-white/10 border-white/20 text-white min-h-[160px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Template Variables */}
            <Card className="bg-black/30 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Available Variables</CardTitle>
                <p className="text-gray-400">Use these variables in your email templates</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    "{{name}}", "{{email}}", "{{company}}", "{{businessType}}", 
                    "{{message}}", "{{painPoints}}", "{{automationGoals}}", 
                    "{{monthlyRevenue}}", "{{teamSize}}", "{{urgency}}", "{{subject}}"
                  ].map((variable) => (
                    <Badge key={variable} variant="outline" className="text-orange-400 border-orange-400">
                      {variable}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                onClick={handleUpdateTemplates}
                disabled={updateTemplatesMutation.isPending}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Templates
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-black/30 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Email Addresses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-white">Contact Email</Label>
                  <Input
                    value={emailSettings.contactEmail}
                    onChange={(e) => setEmailSettings({ ...emailSettings, contactEmail: e.target.value })}
                    placeholder="contact@growfastwithus.com"
                    className="bg-white/10 border-white/20 text-white"
                  />
                  <p className="text-sm text-gray-400">Public email address displayed on your website</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Notification Email</Label>
                  <Input
                    value={emailSettings.notificationEmail}
                    onChange={(e) => setEmailSettings({ ...emailSettings, notificationEmail: e.target.value })}
                    placeholder="admin@growfastwithus.com"
                    className="bg-white/10 border-white/20 text-white"
                  />
                  <p className="text-sm text-gray-400">Email address to receive admin notifications</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/30 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "newContacts", label: "New contact form submissions", enabled: true },
                { key: "newReviews", label: "New review submissions", enabled: true },
                { key: "systemAlerts", label: "System alerts and errors", enabled: true },
                { key: "weeklyReports", label: "Weekly analytics reports", enabled: false },
                { key: "monthlyReports", label: "Monthly summary reports", enabled: true },
              ].map((notification) => (
                <div key={notification.key} className="flex items-center justify-between p-4 bg-black/20 rounded border border-white/10">
                  <div>
                    <p className="text-white font-medium">{notification.label}</p>
                    <p className="text-sm text-gray-400">
                      {notification.enabled ? "Currently enabled" : "Currently disabled"}
                    </p>
                  </div>
                  <Switch defaultChecked={notification.enabled} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
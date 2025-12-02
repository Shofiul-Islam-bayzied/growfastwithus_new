import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Palette, Monitor, Type, Layout, Eye, RotateCcw, Save } from "lucide-react";

interface ThemeSetting {
  id: number;
  key: string;
  value: string;
  category: string;
  isActive: boolean;
}

export default function ThemeCustomizer() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("colors");
  const [previewMode, setPreviewMode] = useState(false);

  // Theme state
  const [themeSettings, setThemeSettings] = useState({
    // Colors
    primaryColor: "#FF6B35",
    secondaryColor: "#1a1a1a",
    accentColor: "#ffffff",
    backgroundColor: "#000000",
    textColor: "#ffffff",
    borderColor: "#333333",
    
    // Typography
    headingFont: "Inter",
    bodyFont: "Inter",
    fontSize: "16",
    lineHeight: "1.6",
    fontWeight: "400",
    
    // Layout
    containerWidth: "1200",
    borderRadius: "8",
    spacing: "16",
    headerHeight: "80",
    
    // Effects
    glassmorphism: true,
    animations: true,
    shadows: true,
    gradients: true,
  });

  // Fetch current theme settings
  const { data: settings = [], isLoading } = useQuery({
    queryKey: ["/api/admin/site-settings"],
  });

  // Update theme mutation
  const updateThemeMutation = useMutation({
    mutationFn: (data: { key: string; value: string; category: string }) =>
      apiRequest("/api/admin/site-settings", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/site-settings"] });
      toast({ title: "Theme updated successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to update theme", variant: "destructive" });
    },
  });

  // Apply theme changes
  const applyThemeChanges = () => {
    const themeEntries = Object.entries(themeSettings);
    
    themeEntries.forEach(([key, value]) => {
      updateThemeMutation.mutate({
        key: `theme_${key}`,
        value: value.toString(),
        category: "theme",
      });
    });

    // Apply CSS custom properties
    const root = document.documentElement;
    root.style.setProperty('--primary-color', themeSettings.primaryColor);
    root.style.setProperty('--secondary-color', themeSettings.secondaryColor);
    root.style.setProperty('--accent-color', themeSettings.accentColor);
    root.style.setProperty('--background-color', themeSettings.backgroundColor);
    root.style.setProperty('--text-color', themeSettings.textColor);
    root.style.setProperty('--border-color', themeSettings.borderColor);
    root.style.setProperty('--font-size', `${themeSettings.fontSize}px`);
    root.style.setProperty('--line-height', themeSettings.lineHeight);
    root.style.setProperty('--border-radius', `${themeSettings.borderRadius}px`);
    root.style.setProperty('--container-width', `${themeSettings.containerWidth}px`);
  };

  const resetToDefaults = () => {
    setThemeSettings({
      primaryColor: "#FF6B35",
      secondaryColor: "#1a1a1a",
      accentColor: "#ffffff",
      backgroundColor: "#000000",
      textColor: "#ffffff",
      borderColor: "#333333",
      headingFont: "Inter",
      bodyFont: "Inter",
      fontSize: "16",
      lineHeight: "1.6",
      fontWeight: "400",
      containerWidth: "1200",
      borderRadius: "8",
      spacing: "16",
      headerHeight: "80",
      glassmorphism: true,
      animations: true,
      shadows: true,
      gradients: true,
    });
    toast({ title: "Theme reset to defaults" });
  };

  const ColorPicker = ({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) => (
    <div className="space-y-2">
      <Label className="text-white">{label}</Label>
      <div className="flex gap-2 items-center">
        <Input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-16 h-10 p-1 bg-white/10 border-white/20"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="bg-white/10 border-white/20 text-white"
        />
      </div>
    </div>
  );

  const fontOptions = [
    { value: "Inter", label: "Inter" },
    { value: "Roboto", label: "Roboto" },
    { value: "Open Sans", label: "Open Sans" },
    { value: "Montserrat", label: "Montserrat" },
    { value: "Poppins", label: "Poppins" },
    { value: "Lato", label: "Lato" },
    { value: "Source Sans Pro", label: "Source Sans Pro" },
    { value: "Nunito", label: "Nunito" },
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-white">Loading theme settings...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Theme Customizer</h2>
          <p className="text-gray-400">Customize your website's appearance and styling</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setPreviewMode(!previewMode)}
            variant="outline"
            className="text-white border-white/20 hover:bg-white/10"
          >
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? "Exit Preview" : "Preview"}
          </Button>
          <Button
            onClick={resetToDefaults}
            variant="outline"
            className="text-white border-white/20 hover:bg-white/10"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={applyThemeChanges}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Apply Changes
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-black/30">
          <TabsTrigger
            value="colors"
            className="text-white data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            <Palette className="w-4 h-4 mr-2" />
            Colors
          </TabsTrigger>
          <TabsTrigger
            value="typography"
            className="text-white data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            <Type className="w-4 h-4 mr-2" />
            Typography
          </TabsTrigger>
          <TabsTrigger
            value="layout"
            className="text-white data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            <Layout className="w-4 h-4 mr-2" />
            Layout
          </TabsTrigger>
          <TabsTrigger
            value="effects"
            className="text-white data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            <Monitor className="w-4 h-4 mr-2" />
            Effects
          </TabsTrigger>
        </TabsList>

        {/* Colors Tab */}
        <TabsContent value="colors" className="space-y-6">
          <Card className="bg-black/30 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Color Scheme</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ColorPicker
                  label="Primary Color"
                  value={themeSettings.primaryColor}
                  onChange={(value) => setThemeSettings({ ...themeSettings, primaryColor: value })}
                />
                <ColorPicker
                  label="Secondary Color"
                  value={themeSettings.secondaryColor}
                  onChange={(value) => setThemeSettings({ ...themeSettings, secondaryColor: value })}
                />
                <ColorPicker
                  label="Accent Color"
                  value={themeSettings.accentColor}
                  onChange={(value) => setThemeSettings({ ...themeSettings, accentColor: value })}
                />
                <ColorPicker
                  label="Background Color"
                  value={themeSettings.backgroundColor}
                  onChange={(value) => setThemeSettings({ ...themeSettings, backgroundColor: value })}
                />
                <ColorPicker
                  label="Text Color"
                  value={themeSettings.textColor}
                  onChange={(value) => setThemeSettings({ ...themeSettings, textColor: value })}
                />
                <ColorPicker
                  label="Border Color"
                  value={themeSettings.borderColor}
                  onChange={(value) => setThemeSettings({ ...themeSettings, borderColor: value })}
                />
              </div>

              {/* Color Preview */}
              <div className="mt-8">
                <Label className="text-white mb-4 block">Color Preview</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: "Primary", color: themeSettings.primaryColor },
                    { label: "Secondary", color: themeSettings.secondaryColor },
                    { label: "Accent", color: themeSettings.accentColor },
                    { label: "Background", color: themeSettings.backgroundColor },
                    { label: "Text", color: themeSettings.textColor },
                    { label: "Border", color: themeSettings.borderColor },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded border border-white/20"
                        style={{ backgroundColor: item.color }}
                      />
                      <div>
                        <p className="text-white font-medium">{item.label}</p>
                        <p className="text-gray-400 text-sm">{item.color}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Typography Tab */}
        <TabsContent value="typography" className="space-y-6">
          <Card className="bg-black/30 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Typography Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-white">Heading Font</Label>
                  <Select
                    value={themeSettings.headingFont}
                    onValueChange={(value) => setThemeSettings({ ...themeSettings, headingFont: value })}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          {font.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Body Font</Label>
                  <Select
                    value={themeSettings.bodyFont}
                    onValueChange={(value) => setThemeSettings({ ...themeSettings, bodyFont: value })}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          {font.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Font Size: {themeSettings.fontSize}px</Label>
                  <Slider
                    value={[parseInt(themeSettings.fontSize)]}
                    onValueChange={(value) => setThemeSettings({ ...themeSettings, fontSize: value[0].toString() })}
                    min={12}
                    max={24}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Line Height: {themeSettings.lineHeight}</Label>
                  <Slider
                    value={[parseFloat(themeSettings.lineHeight)]}
                    onValueChange={(value) => setThemeSettings({ ...themeSettings, lineHeight: value[0].toString() })}
                    min={1.2}
                    max={2.0}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Typography Preview */}
              <div className="mt-8 p-6 bg-black/20 rounded border border-white/10">
                <Label className="text-white mb-4 block">Typography Preview</Label>
                <div
                  style={{
                    fontFamily: themeSettings.headingFont,
                    fontSize: `${parseInt(themeSettings.fontSize) + 8}px`,
                    lineHeight: themeSettings.lineHeight,
                    color: themeSettings.textColor,
                  }}
                >
                  <h3 className="font-bold mb-2">Sample Heading Text</h3>
                </div>
                <div
                  style={{
                    fontFamily: themeSettings.bodyFont,
                    fontSize: `${themeSettings.fontSize}px`,
                    lineHeight: themeSettings.lineHeight,
                    color: themeSettings.textColor,
                  }}
                >
                  <p>
                    This is sample body text to preview your typography settings. 
                    You can see how your chosen fonts, sizes, and spacing will appear 
                    on your website.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Layout Tab */}
        <TabsContent value="layout" className="space-y-6">
          <Card className="bg-black/30 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Layout Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-white">Container Width: {themeSettings.containerWidth}px</Label>
                  <Slider
                    value={[parseInt(themeSettings.containerWidth)]}
                    onValueChange={(value) => setThemeSettings({ ...themeSettings, containerWidth: value[0].toString() })}
                    min={960}
                    max={1920}
                    step={40}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Border Radius: {themeSettings.borderRadius}px</Label>
                  <Slider
                    value={[parseInt(themeSettings.borderRadius)]}
                    onValueChange={(value) => setThemeSettings({ ...themeSettings, borderRadius: value[0].toString() })}
                    min={0}
                    max={32}
                    step={2}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Spacing: {themeSettings.spacing}px</Label>
                  <Slider
                    value={[parseInt(themeSettings.spacing)]}
                    onValueChange={(value) => setThemeSettings({ ...themeSettings, spacing: value[0].toString() })}
                    min={8}
                    max={48}
                    step={4}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Header Height: {themeSettings.headerHeight}px</Label>
                  <Slider
                    value={[parseInt(themeSettings.headerHeight)]}
                    onValueChange={(value) => setThemeSettings({ ...themeSettings, headerHeight: value[0].toString() })}
                    min={60}
                    max={120}
                    step={10}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Layout Preview */}
              <div className="mt-8 p-6 bg-black/20 rounded border border-white/10">
                <Label className="text-white mb-4 block">Layout Preview</Label>
                <div className="space-y-4">
                  <div
                    className="bg-gray-700 h-12 flex items-center px-4"
                    style={{
                      borderRadius: `${themeSettings.borderRadius}px`,
                      height: `${parseInt(themeSettings.headerHeight) * 0.6}px`,
                    }}
                  >
                    <div className="text-white text-sm">Header</div>
                  </div>
                  <div
                    className="bg-gray-600 h-24 flex items-center justify-center"
                    style={{
                      borderRadius: `${themeSettings.borderRadius}px`,
                      margin: `${parseInt(themeSettings.spacing) * 0.5}px 0`,
                    }}
                  >
                    <div className="text-white text-sm">Content Area</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Effects Tab */}
        <TabsContent value="effects" className="space-y-6">
          <Card className="bg-black/30 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Visual Effects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Glassmorphism</Label>
                    <p className="text-sm text-gray-400">Enable glass-like transparency effects</p>
                  </div>
                  <Switch
                    checked={themeSettings.glassmorphism}
                    onCheckedChange={(checked) => setThemeSettings({ ...themeSettings, glassmorphism: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Animations</Label>
                    <p className="text-sm text-gray-400">Enable smooth transitions and animations</p>
                  </div>
                  <Switch
                    checked={themeSettings.animations}
                    onCheckedChange={(checked) => setThemeSettings({ ...themeSettings, animations: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Shadows</Label>
                    <p className="text-sm text-gray-400">Add depth with shadow effects</p>
                  </div>
                  <Switch
                    checked={themeSettings.shadows}
                    onCheckedChange={(checked) => setThemeSettings({ ...themeSettings, shadows: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Gradients</Label>
                    <p className="text-sm text-gray-400">Use gradient backgrounds and effects</p>
                  </div>
                  <Switch
                    checked={themeSettings.gradients}
                    onCheckedChange={(checked) => setThemeSettings({ ...themeSettings, gradients: checked })}
                  />
                </div>
              </div>

              {/* Effects Preview */}
              <div className="mt-8 p-6 bg-black/20 rounded border border-white/10">
                <Label className="text-white mb-4 block">Effects Preview</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`p-4 rounded border text-white text-sm text-center ${
                      themeSettings.glassmorphism ? "bg-white/10 backdrop-blur-lg" : "bg-gray-600"
                    } ${themeSettings.shadows ? "shadow-lg" : ""}`}
                    style={{
                      borderRadius: `${themeSettings.borderRadius}px`,
                      background: themeSettings.gradients
                        ? `linear-gradient(135deg, ${themeSettings.primaryColor}20, ${themeSettings.secondaryColor}20)`
                        : undefined,
                    }}
                  >
                    Glassmorphism Card
                  </div>
                  <div
                    className={`p-4 rounded border text-white text-sm text-center transition-all duration-300 hover:scale-105 ${
                      themeSettings.shadows ? "shadow-lg hover:shadow-xl" : ""
                    }`}
                    style={{
                      borderRadius: `${themeSettings.borderRadius}px`,
                      backgroundColor: themeSettings.primaryColor,
                      transform: themeSettings.animations ? undefined : "none",
                    }}
                  >
                    Interactive Element
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
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
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, Save, Plus, FileText, Settings, Eye } from "lucide-react";

interface SiteSetting {
  id: number;
  key: string;
  value: string;
  category: string;
  isActive: boolean;
}

export default function ContentEditor() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeCategory, setActiveCategory] = useState("hero");
  const [editingItem, setEditingItem] = useState<SiteSetting | null>(null);
  const [newSetting, setNewSetting] = useState({
    key: "",
    value: "",
    category: "hero",
  });

  // Fetch site settings
  const { data: settings = [], isLoading } = useQuery({
    queryKey: ["/api/admin/site-settings"],
  });

  // Create setting mutation
  const createMutation = useMutation({
    mutationFn: (data: typeof newSetting) => apiRequest("/api/admin/site-settings", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/site-settings"] });
      setNewSetting({ key: "", value: "", category: "hero" });
      toast({ title: "Setting created successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to create setting", variant: "destructive" });
    },
  });

  // Update setting mutation
  const updateMutation = useMutation({
    mutationFn: ({ key, data }: { key: string; data: Partial<SiteSetting> }) =>
      apiRequest(`/api/admin/site-settings/${key}`, "PUT", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/site-settings"] });
      setEditingItem(null);
      toast({ title: "Setting updated successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to update setting", variant: "destructive" });
    },
  });

  const categories = [
    { id: "hero", label: "Hero Section", icon: FileText },
    { id: "services", label: "Services", icon: Settings },
    { id: "about", label: "About", icon: Eye },
    { id: "footer", label: "Footer", icon: FileText },
  ];

  const filteredSettings = Array.isArray(settings) 
    ? settings.filter((setting: SiteSetting) => setting.category === activeCategory)
    : [];

  const handleCreateSetting = () => {
    if (!newSetting.key || !newSetting.value) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    createMutation.mutate(newSetting);
  };

  const handleUpdateSetting = () => {
    if (!editingItem) return;
    updateMutation.mutate({
      key: editingItem.key,
      data: {
        value: editingItem.value,
        isActive: editingItem.isActive,
      },
    });
  };

  const handleToggleActive = (setting: SiteSetting) => {
    updateMutation.mutate({
      key: setting.key,
      data: { isActive: !setting.isActive },
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-white">Loading content...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Content Editor</h2>
          <p className="text-gray-400">Manage your website content and settings</p>
        </div>
        <Button
          onClick={() => window.open("/", "_blank")}
          variant="outline"
          className="text-white border-white/20 hover:bg-white/10"
        >
          <Eye className="w-4 h-4 mr-2" />
          Preview Site
        </Button>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid w-full grid-cols-4 bg-black/30">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="text-white data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              <category.icon className="w-4 h-4 mr-2" />
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-4">
            {/* Add New Setting */}
            <Card className="bg-black/30 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Add New {category.label} Setting
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Setting Key</Label>
                    <Input
                      value={newSetting.key}
                      onChange={(e) => setNewSetting({ ...newSetting, key: e.target.value })}
                      placeholder="e.g., hero_title"
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Category</Label>
                    <Input
                      value={category.id}
                      disabled
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-white">Content</Label>
                  <Textarea
                    value={newSetting.value}
                    onChange={(e) => setNewSetting({ ...newSetting, value: e.target.value })}
                    placeholder="Enter the content..."
                    className="bg-white/10 border-white/20 text-white min-h-[100px]"
                  />
                </div>
                <Button
                  onClick={handleCreateSetting}
                  disabled={createMutation.isPending}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Setting
                </Button>
              </CardContent>
            </Card>

            {/* Existing Settings */}
            <div className="space-y-4">
              {filteredSettings.length === 0 ? (
                <Card className="bg-black/30 border-white/20">
                  <CardContent className="p-6 text-center">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-400">No settings found for {category.label}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Create your first setting using the form above
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredSettings.map((setting: SiteSetting) => (
                  <Card key={setting.id} className="bg-black/30 border-white/20">
                    <CardContent className="p-4">
                      {editingItem?.id === setting.id ? (
                        <div className="space-y-4">
                          <div>
                            <Label className="text-white">Setting Key</Label>
                            <Input
                              value={editingItem.key}
                              disabled
                              className="bg-white/10 border-white/20 text-white"
                            />
                          </div>
                          <div>
                            <Label className="text-white">Content</Label>
                            <Textarea
                              value={editingItem.value}
                              onChange={(e) =>
                                setEditingItem({ ...editingItem, value: e.target.value })
                              }
                              className="bg-white/10 border-white/20 text-white min-h-[100px]"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={editingItem.isActive}
                              onCheckedChange={(checked) =>
                                setEditingItem({ ...editingItem, isActive: checked })
                              }
                            />
                            <Label className="text-white">Active</Label>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={handleUpdateSetting}
                              disabled={updateMutation.isPending}
                              size="sm"
                              className="bg-green-500 hover:bg-green-600"
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Save
                            </Button>
                            <Button
                              onClick={() => setEditingItem(null)}
                              variant="outline"
                              size="sm"
                              className="border-white/20 text-white hover:bg-white/10"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-white">{setting.key}</h3>
                              <Switch
                                checked={setting.isActive}
                                onCheckedChange={() => handleToggleActive(setting)}
                              />
                            </div>
                            <p className="text-gray-300 text-sm mb-2">
                              {setting.value.length > 100
                                ? `${setting.value.substring(0, 100)}...`
                                : setting.value}
                            </p>
                            <span className="text-xs text-gray-500">
                              Category: {setting.category}
                            </span>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              onClick={() => setEditingItem(setting)}
                              variant="outline"
                              size="sm"
                              className="border-white/20 text-white hover:bg-white/10"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
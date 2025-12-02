import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Code, 
  Settings,
  Copy,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface TrackingCode {
  id: number;
  name: string;
  type: string;
  code: string;
  placement: string;
  isActive: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface TrackingCodeForm {
  name: string;
  type: string;
  code: string;
  placement: string;
  isActive: boolean;
  description: string;
}

const trackingCodeTypes = [
  { value: "gtm", label: "Google Tag Manager" },
  { value: "facebook_pixel", label: "Facebook Pixel" },
  { value: "google_analytics", label: "Google Analytics" },
  { value: "google_ads", label: "Google Ads" },
  { value: "linkedin_insight", label: "LinkedIn Insight Tag" },
  { value: "twitter_pixel", label: "Twitter Pixel" },
  { value: "hotjar", label: "Hotjar" },
  { value: "custom", label: "Custom Script" },
];

const placementOptions = [
  { value: "head", label: "Head Section" },
  { value: "body", label: "Body Section" },
  { value: "both", label: "Both Head & Body" },
];

export default function TrackingCodesManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<TrackingCode | null>(null);
  const [formData, setFormData] = useState<TrackingCodeForm>({
    name: "",
    type: "gtm",
    code: "",
    placement: "head",
    isActive: true,
    description: "",
  });
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch tracking codes
  const { data: trackingCodes = [], isLoading } = useQuery({
    queryKey: ["/api/admin/tracking-codes"],
    queryFn: async () => {
      const response = await fetch("/api/admin/tracking-codes");
      if (!response.ok) throw new Error("Failed to fetch tracking codes");
      return response.json();
    },
  });

  // Create tracking code mutation
  const createMutation = useMutation({
    mutationFn: async (data: TrackingCodeForm) => {
      const response = await fetch("/api/admin/tracking-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, createdBy: "admin" }),
      });
      if (!response.ok) throw new Error("Failed to create tracking code");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/tracking-codes"] });
      toast({
        title: "Success",
        description: "Tracking code created successfully",
      });
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create tracking code",
        variant: "destructive",
      });
    },
  });

  // Update tracking code mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<TrackingCodeForm> }) => {
      const response = await fetch(`/api/admin/tracking-codes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update tracking code");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/tracking-codes"] });
      toast({
        title: "Success",
        description: "Tracking code updated successfully",
      });
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update tracking code",
        variant: "destructive",
      });
    },
  });

  // Delete tracking code mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/tracking-codes/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete tracking code");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/tracking-codes"] });
      toast({
        title: "Success",
        description: "Tracking code deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete tracking code",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      type: "gtm",
      code: "",
      placement: "head",
      isActive: true,
      description: "",
    });
    setEditingCode(null);
    setIsDialogOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCode) {
      updateMutation.mutate({ id: editingCode.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (code: TrackingCode) => {
    setEditingCode(code);
    setFormData({
      name: code.name,
      type: code.type,
      code: code.code,
      placement: code.placement,
      isActive: code.isActive,
      description: code.description || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this tracking code?")) {
      deleteMutation.mutate(id);
    }
  };

  const copyToClipboard = async (text: string, id: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      toast({
        title: "Copied",
        description: "Code copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy code",
        variant: "destructive",
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "gtm":
        return "🔧";
      case "facebook_pixel":
        return "📘";
      case "google_analytics":
        return "📊";
      case "google_ads":
        return "💰";
      case "linkedin_insight":
        return "💼";
      case "twitter_pixel":
        return "🐦";
      case "hotjar":
        return "🔥";
      default:
        return "📝";
    }
  };

  const getPlacementBadge = (placement: string) => {
    const color = placement === "head" ? "bg-blue-500/20 text-blue-400" : 
                  placement === "body" ? "bg-green-500/20 text-green-400" : 
                  "bg-purple-500/20 text-purple-400";
    return <Badge className={color}>{placement}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Tracking Codes</h2>
          <p className="text-gray-400">Manage Google Tag Manager, Facebook Pixel, and other tracking codes</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Tracking Code
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCode ? "Edit Tracking Code" : "Add New Tracking Code"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Google Tag Manager"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {trackingCodeTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="placement">Placement</Label>
                <Select value={formData.placement} onValueChange={(value) => setFormData({ ...formData, placement: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {placementOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this tracking code"
                />
              </div>

              <div>
                <Label htmlFor="code">Tracking Code</Label>
                <Textarea
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Paste your tracking code here..."
                  className="font-mono text-sm"
                  rows={8}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingCode ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tracking Codes List */}
      <div className="grid gap-4">
        {trackingCodes.length === 0 ? (
          <Card className="bg-black/50 backdrop-blur-xl border-white/10">
            <CardContent className="p-8 text-center">
              <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Tracking Codes</h3>
              <p className="text-gray-400 mb-4">
                Get started by adding your first tracking code for Google Tag Manager, Facebook Pixel, or other analytics tools.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Tracking Code
              </Button>
            </CardContent>
          </Card>
        ) : (
          trackingCodes.map((code: TrackingCode) => (
            <Card key={code.id} className="bg-black/50 backdrop-blur-xl border-white/10">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{getTypeIcon(code.type)}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{code.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          {getPlacementBadge(code.placement)}
                          {code.isActive ? (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
                              <EyeOff className="w-3 h-3 mr-1" />
                              Inactive
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    {code.description && (
                      <p className="text-gray-400 text-sm mb-3">{code.description}</p>
                    )}
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>Created: {new Date(code.createdAt).toLocaleDateString()}</span>
                      {code.updatedAt !== code.createdAt && (
                        <span>• Updated: {new Date(code.updatedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(code.code, code.id)}
                    >
                      {copiedId === code.id ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(code)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(code.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Help Section */}
      <Card className="bg-black/50 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Tracking Code Setup Guide</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-2">Google Tag Manager</h4>
              <p className="text-sm text-gray-400 mb-2">
                Add your GTM container ID (GTM-XXXXXXX) to track page views, events, and conversions.
              </p>
              <pre className="bg-gray-800 p-3 rounded text-xs font-mono text-gray-300 overflow-x-auto">
{`<!-- Google Tag Manager -->
<script>
(function(w,d,s,l,i){
  w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
  var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
  j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
  f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');
</script>
<!-- End Google Tag Manager -->`}
              </pre>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Facebook Pixel</h4>
              <p className="text-sm text-gray-400 mb-2">
                Add your Facebook Pixel ID to track conversions and build custom audiences.
              </p>
              <pre className="bg-gray-800 p-3 rounded text-xs font-mono text-gray-300 overflow-x-auto">
{`<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'XXXXXXXXXX');
fbq('track', 'PageView');
</script>
<!-- End Facebook Pixel Code -->`}
              </pre>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-4">
            <h4 className="font-semibold text-white mb-2 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 text-yellow-400" />
              Important Notes
            </h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Place Google Tag Manager in the <strong>Head</strong> section for optimal performance</li>
              <li>• Facebook Pixel should be placed in the <strong>Head</strong> section</li>
              <li>• Custom scripts can be placed in <strong>Head</strong>, <strong>Body</strong>, or <strong>Both</strong></li>
              <li>• Only active tracking codes will be loaded on your website</li>
              <li>• Test your tracking codes in a staging environment first</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
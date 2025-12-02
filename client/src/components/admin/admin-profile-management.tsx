import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Users, Shield, Mail, RefreshCw, Eye, EyeOff } from "lucide-react";

export default function AdminProfileManagement() {
  const { toast } = useToast();
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
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
      setIsChangingPassword(false);
    },
    onError: (error: any) => {
      toast({
        title: "Password Change Failed",
        description: error.response?.data?.error || "Failed to change password",
        variant: "destructive"
      });
      setIsChangingPassword(false);
    },
  });

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
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <Card className="bg-black/50 backdrop-blur-xl border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Users className="h-5 w-5" />
          Admin Profile Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {/* Password Management Section */}
          <div className="flex items-center justify-between p-4 border border-white/20 rounded-lg">
            <div>
              <h3 className="font-semibold flex items-center gap-2 text-white">
                <Shield className="h-4 w-4" />
                Change Password
              </h3>
              <p className="text-sm text-gray-400">Update your admin password with email verification</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowPasswordSection(!showPasswordSection)}
              className="bg-transparent border-white/20 text-white hover:bg-white/10"
            >
              {showPasswordSection ? 'Cancel' : 'Change Password'}
            </Button>
          </div>

          {/* Password Change Form */}
          {showPasswordSection && (
            <div className="border border-white/20 rounded-lg p-4 bg-black/30 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-white">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    placeholder="Enter current password"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    {showPasswords.current ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-white">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    placeholder="Enter new password (min 8 characters)"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showPasswords.new ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    placeholder="Confirm new password"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handlePasswordChange}
                  disabled={isChangingPassword || !passwordData.currentPassword || !passwordData.newPassword}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                >
                  {isChangingPassword && <RefreshCw className="h-4 w-4 animate-spin" />}
                  Update Password
                </Button>
              </div>
              
              <div className="text-sm text-gray-400 bg-blue-500/10 border border-blue-500/20 p-3 rounded">
                <p className="font-medium text-blue-400">Password Requirements:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Minimum 8 characters</li>
                  <li>Email confirmation will be sent after successful change</li>
                  <li>You'll be logged out after password change for security</li>
                </ul>
              </div>
            </div>
          )}

          {/* Forgot Password Link */}
          <div className="flex items-center justify-between p-4 border border-white/20 rounded-lg">
            <div>
              <h3 className="font-semibold flex items-center gap-2 text-white">
                <Mail className="h-4 w-4" />
                Forgot Password
              </h3>
              <p className="text-sm text-gray-400">Reset password via email verification</p>
            </div>
            <Button variant="outline" asChild className="bg-transparent border-white/20 text-white hover:bg-white/10">
              <a href="/admin-forgot-password" target="_blank">
                Reset via Email
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 
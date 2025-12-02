import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, AlertCircle, Loader2, Globe, RefreshCw, Eye, EyeOff, Lock, Terminal, FileText, FolderOpen, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface WordPressSettings {
  apiUrl: string | null;
  postsPerPage: number;
  cacheEnabled: boolean;
  connectionStatus: string | null;
  authType: string | null;
  username: string | null;
  hasPassword: boolean;
}

interface ConnectionResult {
  success: boolean;
  message: string;
  stats?: {
    totalPosts: number;
    categories: number;
    tags: number;
  };
}

interface LogEntry {
  timestamp: string;
  type: 'info' | 'success' | 'error' | 'warning';
  message: string;
}

interface WordPressPost {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  categories: number[];
}

interface WordPressCategory {
  id: number;
  name: string;
  count: number;
}

interface WordPressTag {
  id: number;
  name: string;
  count: number;
}

export function WordPressSettings() {
  const [settings, setSettings] = useState<WordPressSettings>({
    apiUrl: null,
    postsPerPage: 9,
    cacheEnabled: false,
    connectionStatus: null,
    authType: 'none',
    username: null,
    hasPassword: false,
  });
  
  const [apiUrl, setApiUrl] = useState("");
  const [postsPerPage, setPostsPerPage] = useState("9");
  const [authType, setAuthType] = useState("none");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [connectionResult, setConnectionResult] = useState<ConnectionResult | null>(null);
  const [stats, setStats] = useState<{ totalPosts: number; categories: number; tags: number } | null>(null);
  
  // Live testing state
  const [isLiveTesting, setIsLiveTesting] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [testPosts, setTestPosts] = useState<WordPressPost[]>([]);
  const [testCategories, setTestCategories] = useState<WordPressCategory[]>([]);
  const [testTags, setTestTags] = useState<WordPressTag[]>([]);
  
  const { toast } = useToast();

  // Helper function to add logs
  const addLog = (type: LogEntry['type'], message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, type, message }]);
  };

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/wordpress-settings", {
        credentials: 'include' // Include session cookie
      });
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
        setApiUrl(data.apiUrl || "");
        setPostsPerPage((data.postsPerPage || 9).toString());
        setAuthType(data.authType || "none");
        setUsername(data.username || "");
        // Don't populate password field for security
        
        // Load stats if connected
        if (data.apiUrl && data.connectionStatus === 'connected') {
          loadStats();
        }
      } else if (response.status === 401) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access WordPress settings",
          variant: "destructive",
        });
      } else {
        console.error("Failed to fetch WordPress settings: HTTP", response.status);
      }
    } catch (error) {
      console.error("Error loading WordPress settings:", error);
      toast({
        title: "Warning",
        description: "Could not connect to server. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch("/api/admin/wordpress-stats", {
        credentials: 'include' // Include session cookie
      });
      if (response.ok) {
        const data = await response.json();
        if (data.connected && data.stats) {
          setStats(data.stats);
        }
      }
    } catch (error) {
      console.error("Error loading WordPress stats:", error);
    }
  };

  const testConnection = async () => {
    if (!apiUrl) {
      toast({
        title: "Validation Error",
        description: "Please enter a WordPress API URL",
        variant: "destructive",
      });
      return;
    }

    if (authType !== 'none' && !username) {
      toast({
        title: "Validation Error",
        description: "Please enter a username for authentication",
        variant: "destructive",
      });
      return;
    }

    setIsTesting(true);
    setConnectionResult(null);

    try {
      const response = await fetch("/api/admin/wordpress-test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include', // Include session cookie
        body: JSON.stringify({ 
          apiUrl,
          username: authType !== 'none' ? username : undefined,
          password: authType !== 'none' ? password : undefined,
        }),
      });

      const result = await response.json();
      setConnectionResult(result);

      if (result.success) {
        setStats(result.stats || null);
        toast({
          title: "Success",
          description: result.message,
        });
      } else {
        toast({
          title: "Connection Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setConnectionResult({
        success: false,
        message: `Failed to test connection: ${errorMessage}`,
      });
      toast({
        title: "Error",
        description: "Failed to test connection",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const saveSettings = async () => {
    if (!apiUrl) {
      toast({
        title: "Validation Error",
        description: "Please enter a WordPress API URL",
        variant: "destructive",
      });
      return;
    }

    if (authType !== 'none' && !username) {
      toast({
        title: "Validation Error",
        description: "Please enter a username for authentication",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/admin/wordpress-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include', // Include session cookie
        body: JSON.stringify({
          apiUrl,
          postsPerPage: parseInt(postsPerPage),
          cacheEnabled: settings.cacheEnabled,
          authType,
          username: authType !== 'none' ? username : '',
          password: password, // Only sent if user entered a new one
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
        toast({
          title: "Success",
          description: "WordPress settings saved successfully",
        });
        
        // Reload stats after saving
        if (data.settings.connectionStatus === 'connected') {
          loadStats();
        }
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save WordPress settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const resetSettings = () => {
    setApiUrl(settings.apiUrl || "");
    setPostsPerPage(settings.postsPerPage.toString());
    setAuthType(settings.authType || "none");
    setUsername(settings.username || "");
    setPassword("");
    setConnectionResult(null);
  };

  const runLiveTest = async () => {
    if (!settings.apiUrl) {
      toast({
        title: "WordPress Not Configured",
        description: "Please configure and save WordPress settings first",
        variant: "destructive",
      });
      return;
    }

    setIsLiveTesting(true);
    setLogs([]);
    setTestPosts([]);
    setTestCategories([]);
    setTestTags([]);

    addLog('info', '🔄 Starting WordPress live test...');
    addLog('info', `📡 Connecting to: ${settings.apiUrl}`);

    try {
      // Test 1: Fetch Posts
      addLog('info', '📝 Fetching latest posts...');
      const postsResponse = await fetch('/api/wordpress/posts?per_page=5&_embed=1');
      
      if (!postsResponse.ok) {
        const errorData = await postsResponse.json().catch(() => ({}));
        addLog('error', `❌ Failed to fetch posts: HTTP ${postsResponse.status}`);
        if (errorData.details) {
          addLog('error', `📄 Response: ${errorData.details}`);
        }
        if (errorData.hint) {
          addLog('warning', `💡 Hint: ${errorData.hint}`);
        }
        if (errorData.url) {
          addLog('info', `🔗 URL tested: ${errorData.url}`);
        }
        throw new Error(errorData.error || `Posts fetch failed: ${postsResponse.status}`);
      }

      const posts = await postsResponse.json();
      
      // Check if the response has an error field (backend returned error as 200)
      if (posts.error) {
        addLog('error', `❌ ${posts.error}`);
        if (posts.details) {
          addLog('error', `📄 Details: ${posts.details}`);
        }
        if (posts.hint) {
          addLog('warning', `💡 ${posts.hint}`);
        }
        throw new Error(posts.error);
      }
      
      setTestPosts(posts);
      addLog('success', `✅ Successfully fetched ${posts.length} posts`);
      
      if (posts.length > 0) {
        addLog('info', `📄 Latest post: "${posts[0].title.rendered}"`);
      } else {
        addLog('warning', '⚠️ No posts found - your WordPress site has no published posts');
      }

      // Test 2: Fetch Categories
      addLog('info', '📂 Fetching categories...');
      const categoriesResponse = await fetch('/api/wordpress/categories');
      
      if (!categoriesResponse.ok) {
        addLog('error', `❌ Failed to fetch categories: HTTP ${categoriesResponse.status}`);
        throw new Error(`Categories fetch failed: ${categoriesResponse.status}`);
      }

      const categories = await categoriesResponse.json();
      setTestCategories(categories);
      addLog('success', `✅ Successfully fetched ${categories.length} categories`);
      
      if (categories.length > 0) {
        const topCategory = categories[0];
        addLog('info', `📁 Top category: "${topCategory.name}" (${topCategory.count} posts)`);
      }

      // Test 3: Fetch Tags
      addLog('info', '🏷️ Fetching tags...');
      const tagsResponse = await fetch('/api/wordpress/tags');
      
      if (!tagsResponse.ok) {
        addLog('error', `❌ Failed to fetch tags: HTTP ${tagsResponse.status}`);
        throw new Error(`Tags fetch failed: ${tagsResponse.status}`);
      }

      const tags = await tagsResponse.json();
      setTestTags(tags);
      addLog('success', `✅ Successfully fetched ${tags.length} tags`);
      
      if (tags.length > 0) {
        const topTag = tags[0];
        addLog('info', `🏷️ Top tag: "${topTag.name}" (${topTag.count} posts)`);
      }

      // Final summary
      addLog('success', '🎉 All tests completed successfully!');
      addLog('info', `📊 Summary: ${posts.length} posts, ${categories.length} categories, ${tags.length} tags`);

      toast({
        title: "Live Test Complete",
        description: "All WordPress data fetched successfully",
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      addLog('error', `❌ Test failed: ${errorMessage}`);
      
      toast({
        title: "Test Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLiveTesting(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
    setTestPosts([]);
    setTestCategories([]);
    setTestTags([]);
  };

  const diagnoseUrl = async () => {
    if (!settings.apiUrl) {
      toast({
        title: "WordPress Not Configured",
        description: "Please configure and save WordPress settings first",
        variant: "destructive",
      });
      return;
    }

    setIsLiveTesting(true);
    setLogs([]);

    addLog('info', '🔍 Running URL diagnostics...');
    addLog('info', `🌐 Testing: ${settings.apiUrl}`);

    try {
      // Test the base URL (without /posts)
      addLog('info', '📡 Checking if URL is reachable...');
      const baseResponse = await fetch('/api/admin/wordpress-test-connection', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ apiUrl: settings.apiUrl }),
      });

      const result = await baseResponse.json();
      
      if (result.success) {
        addLog('success', '✅ Base URL is reachable');
        addLog('info', `📊 ${result.message}`);
      } else {
        addLog('error', '❌ Base URL check failed');
        addLog('error', `📄 ${result.message}`);
      }

      // Now test the posts endpoint
      addLog('info', '📝 Testing posts endpoint specifically...');
      const postsResponse = await fetch('/api/wordpress/posts?per_page=1');
      
      let postsData;
      try {
        postsData = await postsResponse.json();
      } catch (jsonError) {
        addLog('error', '❌ Posts endpoint returned invalid JSON');
        addLog('error', `📄 This means WordPress returned HTML instead of JSON data`);
        addLog('info', '');
        addLog('warning', '💡 This usually happens when:');
        addLog('warning', '   • The URL redirects to the homepage');
        addLog('warning', '   • WordPress permalinks are set to "Plain"');
        addLog('warning', '   • A 404 error page is being shown');
        addLog('warning', '   • Security plugin is blocking the REST API');
        throw jsonError;
      }
      
      if (postsResponse.ok && !postsData.error) {
        addLog('success', '✅ Posts endpoint working correctly');
        if (Array.isArray(postsData) && postsData.length > 0) {
          addLog('success', `📄 Found ${postsData.length} post(s)`);
        } else if (Array.isArray(postsData)) {
          addLog('warning', '⚠️ Posts endpoint works but returned 0 posts');
          addLog('info', '💡 Make sure you have published posts (not drafts) in WordPress');
        }
      } else {
        addLog('error', '❌ Posts endpoint failed');
        addLog('error', `📊 HTTP Status: ${postsResponse.status}`);
        if (postsData.error) {
          addLog('error', `📄 Error: ${postsData.error}`);
        }
        if (postsData.details) {
          addLog('error', `📄 Details: ${postsData.details}`);
        }
        if (postsData.contentType) {
          addLog('info', `📋 Content-Type received: ${postsData.contentType}`);
        }
        if (postsData.hint) {
          addLog('warning', `💡 ${postsData.hint}`);
        }
        if (postsData.url) {
          addLog('info', `🔗 URL tested: ${postsData.url}`);
        }
      }

      // Provide suggestions
      addLog('info', '');
      addLog('info', '🔧 TROUBLESHOOTING STEPS:');
      addLog('info', '');
      addLog('warning', '📋 Step 1: Fix WordPress Permalink Settings');
      addLog('info', '   Go to WordPress Admin → Settings → Permalinks');
      addLog('info', '   Make sure it is NOT set to "Plain"');
      addLog('info', '   Click "Save Changes" (this regenerates .htaccess)');
      addLog('info', '');
      addLog('warning', '📋 Step 2: Test URLs in Browser');
      addLog('info', '   Open these URLs and see which one shows JSON:');
      const domain = settings.apiUrl.replace('/wp-json/wp/v2', '').replace('/index.php', '');
      addLog('info', `   1. ${domain}/wp-json/wp/v2/posts`);
      addLog('info', `   2. ${domain}/index.php/wp-json/wp/v2/posts`);
      addLog('info', `   3. ${domain}/?rest_route=/wp/v2/posts`);
      addLog('info', '   (You should see JSON data, not your website)');
      addLog('info', '');
      addLog('warning', '📋 Step 3: Update URL in Admin Panel');
      addLog('info', '   Use whichever URL showed JSON data');
      addLog('info', '   Example: If option 2 worked, use:');
      addLog('info', `   ${domain}/index.php/wp-json/wp/v2`);
      addLog('info', '');
      addLog('warning', '📋 Step 4: Check Security Plugins');
      addLog('info', '   Some plugins block REST API by default');
      addLog('info', '   Check: Wordfence, iThemes Security, Sucuri');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      addLog('error', `❌ Diagnostic failed: ${errorMessage}`);
    } finally {
      setIsLiveTesting(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            WordPress Blog Settings
          </CardTitle>
          <CardDescription>
            Configure your WordPress REST API connection to display blog posts on your website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Setup Guide Banner */}
          {!settings.apiUrl && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>WordPress Not Configured</strong> - Your blog is currently showing demo content.
                Configure WordPress below to display your real blog posts.
                <a href="/docs/WORDPRESS_SETUP_GUIDE.md" target="_blank" className="underline ml-2">
                  View Setup Guide
                </a>
              </AlertDescription>
            </Alert>
          )}

          {/* API URL Input */}
          <div className="space-y-2">
            <Label htmlFor="wordpress-api-url">WordPress API URL *</Label>
            <Input
              id="wordpress-api-url"
              type="url"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="https://your-wordpress-site.com/wp-json/wp/v2"
              className="font-mono text-sm"
            />
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>WordPress.com:</strong> https://public-api.wordpress.com/wp/v2/sites/yoursite.wordpress.com</p>
              <p><strong>Self-hosted:</strong> https://yourdomain.com/wp-json/wp/v2</p>
            </div>
          </div>

          {/* Authentication Settings */}
          <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4" />
              <Label className="text-base font-semibold">Authentication (Optional)</Label>
            </div>
            <p className="text-xs text-muted-foreground">
              Configure authentication if your WordPress site is password-protected or requires credentials
            </p>

            <div className="space-y-2">
              <Label htmlFor="auth-type">Authentication Type</Label>
              <Select value={authType} onValueChange={setAuthType}>
                <SelectTrigger id="auth-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Public Site)</SelectItem>
                  <SelectItem value="basic">Basic Authentication</SelectItem>
                  <SelectItem value="app_password">Application Password</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {authType !== 'none' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="wordpress-username">Username *</Label>
                  <Input
                    id="wordpress-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="WordPress username"
                    autoComplete="username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wordpress-password">
                    {authType === 'app_password' ? 'Application Password' : 'Password'} *
                  </Label>
                  <div className="relative">
                    <Input
                      id="wordpress-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={settings.hasPassword && !password ? "••••••••" : "Enter password"}
                      autoComplete="current-password"
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {authType === 'app_password' 
                      ? 'Generate an application password from WordPress: Users → Your Profile → Application Passwords'
                      : 'Your WordPress account password'}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Connection Status */}
          {settings.connectionStatus && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
              {settings.connectionStatus === 'connected' ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Connected</span>
                </>
              ) : settings.connectionStatus === 'error' ? (
                <>
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium">Connection Error</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">Not Tested</span>
                </>
              )}
            </div>
          )}

          {/* Connection Result */}
          {connectionResult && (
            <Alert variant={connectionResult.success ? "default" : "destructive"}>
              <AlertDescription className="flex items-start gap-2">
                {connectionResult.success ? (
                  <CheckCircle className="w-4 h-4 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 mt-0.5" />
                )}
                <span>{connectionResult.message}</span>
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={testConnection}
              disabled={isTesting || !apiUrl}
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Test Connection
                </>
              )}
            </Button>
            <Button
              onClick={saveSettings}
              disabled={isSaving || !apiUrl}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Settings"
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={resetSettings}
              disabled={isSaving || isTesting}
            >
              Reset
            </Button>
          </div>

          {/* Posts Per Page */}
          <div className="space-y-2">
            <Label htmlFor="posts-per-page">Posts Per Page</Label>
            <Select value={postsPerPage} onValueChange={setPostsPerPage}>
              <SelectTrigger id="posts-per-page" className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="9">9</SelectItem>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Number of posts to display per page on the blog
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Blog Statistics */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Blog Statistics</CardTitle>
            <CardDescription>
              Current statistics from your WordPress blog
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-muted">
                <div className="text-2xl font-bold text-primary">{stats.totalPosts}</div>
                <div className="text-sm text-muted-foreground">Total Posts</div>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <div className="text-2xl font-bold text-primary">{stats.categories}</div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <div className="text-2xl font-bold text-primary">{stats.tags}</div>
                <div className="text-sm text-muted-foreground">Tags</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Live WordPress Test Panel */}
      {settings.apiUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="w-5 h-5" />
              Live WordPress Test
            </CardTitle>
            <CardDescription>
              Test your WordPress connection and see what data is being fetched in real-time
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={runLiveTest}
                disabled={isLiveTesting || !settings.apiUrl}
              >
                {isLiveTesting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Running Test...
                  </>
                ) : (
                  <>
                    <Terminal className="w-4 h-4 mr-2" />
                    Run Live Test
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={diagnoseUrl}
                disabled={isLiveTesting || !settings.apiUrl}
              >
                {isLiveTesting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Diagnosing...
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Diagnose URL
                  </>
                )}
              </Button>
              {settings.apiUrl && (
                <Button
                  variant="outline"
                  onClick={() => window.open(`${settings.apiUrl}/posts`, '_blank')}
                  disabled={isLiveTesting}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Test in Browser
                </Button>
              )}
              {logs.length > 0 && (
                <Button
                  variant="outline"
                  onClick={clearLogs}
                  disabled={isLiveTesting}
                >
                  Clear Logs
                </Button>
              )}
            </div>

            {/* Logs Console */}
            {logs.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Test Logs:</Label>
                <ScrollArea className="h-64 w-full rounded-md border bg-black p-4">
                  <div className="space-y-1 font-mono text-xs">
                    {logs.map((log, index) => (
                      <div
                        key={index}
                        className={`flex gap-2 ${
                          log.type === 'error' ? 'text-red-400' :
                          log.type === 'success' ? 'text-green-400' :
                          log.type === 'warning' ? 'text-yellow-400' :
                          'text-gray-300'
                        }`}
                      >
                        <span className="text-gray-500">[{log.timestamp}]</span>
                        <span>{log.message}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Fetched Posts */}
            {testPosts.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Fetched Posts ({testPosts.length}):
                </Label>
                <div className="space-y-2">
                  {testPosts.map((post) => (
                    <div key={post.id} className="p-3 rounded-lg border bg-muted/50">
                      <div className="font-medium">{post.title.rendered}</div>
                      <div 
                        className="text-xs text-muted-foreground mt-1 line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                      />
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          ID: {post.id}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {new Date(post.date).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fetched Categories */}
            {testCategories.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <FolderOpen className="w-4 h-4" />
                  Categories ({testCategories.length}):
                </Label>
                <div className="flex flex-wrap gap-2">
                  {testCategories.slice(0, 15).map((category) => (
                    <Badge key={category.id} variant="secondary">
                      {category.name} ({category.count})
                    </Badge>
                  ))}
                  {testCategories.length > 15 && (
                    <Badge variant="outline">
                      +{testCategories.length - 15} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Fetched Tags */}
            {testTags.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Tags ({testTags.length}):
                </Label>
                <div className="flex flex-wrap gap-2">
                  {testTags.slice(0, 20).map((tag) => (
                    <Badge key={tag.id} variant="outline" className="text-xs">
                      {tag.name} ({tag.count})
                    </Badge>
                  ))}
                  {testTags.length > 20 && (
                    <Badge variant="outline" className="text-xs">
                      +{testTags.length - 20} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Empty State */}
            {logs.length === 0 && !isLiveTesting && (
              <div className="space-y-3">
                <Alert>
                  <Terminal className="h-4 w-4" />
                  <AlertDescription>
                    Click "Run Live Test" to see real-time logs of data being fetched from your WordPress site.
                    This will show you exactly what posts, categories, and tags are available.
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-semibold">Common WordPress REST API URL formats:</p>
                      <div className="text-xs space-y-1 font-mono">
                        <div>• Standard: <span className="text-primary">https://yourdomain.com/wp-json/wp/v2</span></div>
                        <div>• Subfolder: <span className="text-primary">https://yourdomain.com/blog/wp-json/wp/v2</span></div>
                        <div>• Index.php: <span className="text-primary">https://yourdomain.com/index.php/wp-json/wp/v2</span></div>
                        <div>• WordPress.com: <span className="text-primary">https://public-api.wordpress.com/wp/v2/sites/yoursite.wordpress.com</span></div>
                      </div>
                      <p className="text-xs mt-2">If you're getting errors, click "Diagnose URL" to see detailed troubleshooting info.</p>
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Setup Guide & Help */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">WordPress Setup Guide</CardTitle>
          <CardDescription>
            Choose your WordPress setup type and follow the instructions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Setup Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg space-y-2">
              <h4 className="font-semibold">WordPress.com (Free)</h4>
              <p className="text-xs text-muted-foreground">Easiest setup, 5 minutes</p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>✓ No hosting needed</li>
                <li>✓ Free plan available</li>
                <li>✓ Automatic updates</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg space-y-2">
              <h4 className="font-semibold">Self-Hosted</h4>
              <p className="text-xs text-muted-foreground">Full control, 15 minutes</p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>✓ Complete customization</li>
                <li>✓ All plugins available</li>
                <li>✓ Own your data</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg space-y-2">
              <h4 className="font-semibold">With Authentication</h4>
              <p className="text-xs text-muted-foreground">Private posts, 10 minutes</p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>✓ Draft preview</li>
                <li>✓ Private posts</li>
                <li>✓ Secure access</li>
              </ul>
            </div>
          </div>

          {/* Detailed Instructions */}
          <div className="space-y-2 text-sm">
            <p className="font-semibold">Quick Start:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2 text-muted-foreground">
              <li>Enter your WordPress API URL above</li>
              <li>Click "Test Connection" to verify it works</li>
              <li>If successful, click "Save Settings"</li>
              <li>Visit your blog at /blog to see posts</li>
            </ol>
          </div>

          {/* Common Issues */}
          <div className="space-y-2 text-sm">
            <p className="font-semibold">Common Issues:</p>
            <ul className="list-disc list-inside space-y-1 ml-2 text-muted-foreground">
              <li><strong>404 Error:</strong> Check your WordPress site is live and REST API is enabled</li>
              <li><strong>CORS Error:</strong> Add your domain to WordPress CORS whitelist</li>
              <li><strong>No Posts Found:</strong> Ensure posts are published (not draft)</li>
            </ul>
          </div>

          {/* Link to Full Guide */}
          <Alert>
            <Globe className="h-4 w-4" />
            <AlertDescription>
              <strong>Need detailed instructions?</strong> Check out our complete{' '}
              <a 
                href="https://github.com/yourusername/growfastwithus/blob/main/docs/WORDPRESS_SETUP_GUIDE.md" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-primary"
              >
                WordPress Setup Guide
              </a>
              {' '}with step-by-step screenshots and troubleshooting tips.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}


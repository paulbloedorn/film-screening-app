import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Shield, Edit3, Eye, AlertCircle, ExternalLink } from "lucide-react";

interface AdminRouteProps {}

export default function AdminRoute({}: AdminRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    // Check if TinaCMS is properly configured
    const checkConfiguration = () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const clientId = import.meta.env.VITE_TINA_CLIENT_ID || process.env.NEXT_PUBLIC_TINA_CLIENT_ID;
        
        if (!clientId || clientId === 'your_client_id_here') {
          setError('TinaCMS client ID not configured. Please set up your TinaCMS Cloud account.');
          setIsConfigured(false);
        } else {
          setIsConfigured(true);
        }
      } catch (err) {
        console.error('Configuration check error:', err);
        setError(err instanceof Error ? err.message : 'Configuration check failed');
        setIsConfigured(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkConfiguration();
  }, []);

  const handleOpenTinaCMS = () => {
    // Open TinaCMS admin interface in a new window
    window.open('/admin/index.html', '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Checking CMS configuration...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !isConfigured) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span>TinaCMS Setup Required</span>
            </CardTitle>
            <CardDescription>
              Your content management system needs to be configured before you can edit content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Setup Instructions:</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                  <li>
                    Create a free TinaCMS Cloud account at{' '}
                    <a 
                      href="https://app.tina.io" 
                      className="text-blue-600 hover:underline inline-flex items-center"
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      app.tina.io <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </li>
                  <li>Create a new project and copy your Client ID and Token</li>
                  <li>Add the following to your <code className="bg-gray-100 px-1 rounded">.env.local</code> file:</li>
                </ol>
                
                <div className="mt-3 p-3 bg-gray-100 rounded-md font-mono text-sm">
                  <div>NEXT_PUBLIC_TINA_CLIENT_ID=your_client_id_here</div>
                  <div>TINA_TOKEN=your_token_here</div>
                  <div>VITE_TINA_CLIENT_ID=your_client_id_here</div>
                </div>
                
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 mt-3" start={4}>
                  <li>Restart your development server</li>
                  <li>Return to this page to access the content management interface</li>
                </ol>
              </div>
              
              <div className="flex space-x-4">
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline"
                >
                  Check Again
                </Button>
                <Button 
                  onClick={() => window.open('https://tina.io/docs/setup-overview/', '_blank')}
                  variant="outline"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Documentation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Configuration is valid - show the CMS interface
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Edit3 className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Content Management System</h1>
              <p className="text-sm text-gray-500">Edit your website content with TinaCMS</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('/', '_blank')}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview Site
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid gap-6">
          {/* Welcome card */}
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Your CMS</CardTitle>
              <CardDescription>
                Use TinaCMS to edit your website content. Changes are saved automatically and will be reflected on your live site.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-blue-900">Ready to edit content?</h3>
                  <p className="text-sm text-blue-700">Click below to open the TinaCMS editing interface</p>
                </div>
                <Button onClick={handleOpenTinaCMS} className="bg-blue-600 hover:bg-blue-700">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Open TinaCMS Editor
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Content sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Edit3 className="h-4 w-4 text-green-600" />
                  </div>
                  <span>Homepage Content</span>
                </CardTitle>
                <CardDescription>
                  Edit hero section, testimonials, audience cards, and more
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li>• Hero section with poster and trailer</li>
                  <li>• Customer testimonials</li>
                  <li>• Audience-specific cards</li>
                  <li>• Impact metrics and call-to-action sections</li>
                </ul>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => window.open('/admin/index.html#/collections/homepage', '_blank')}
                >
                  Edit Homepage
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <AlertCircle className="h-4 w-4 text-purple-600" />
                  </div>
                  <span>FAQ Section</span>
                </CardTitle>
                <CardDescription>
                  Manage frequently asked questions and answers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li>• Add new questions and answers</li>
                  <li>• Edit existing FAQ content</li>
                  <li>• Organize questions by category</li>
                </ul>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => window.open('/admin/index.html#/collections/faq', '_blank')}
                >
                  Edit FAQ
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>How to Use the CMS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg font-bold text-blue-600">1</span>
                  </div>
                  <h3 className="font-medium mb-2">Open the Editor</h3>
                  <p className="text-sm text-gray-600">Click "Open TinaCMS Editor" to access the content editing interface</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg font-bold text-blue-600">2</span>
                  </div>
                  <h3 className="font-medium mb-2">Edit Content</h3>
                  <p className="text-sm text-gray-600">Use the form fields to update text, images, and other content elements</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg font-bold text-blue-600">3</span>
                  </div>
                  <h3 className="font-medium mb-2">Save & Preview</h3>
                  <p className="text-sm text-gray-600">Changes are saved automatically. Use "Preview Site" to see your updates</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>CMS Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Secure cloud-based authentication</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Edit3 className="h-5 w-5 text-blue-500" />
                  <span className="text-sm">Real-time content editing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Eye className="h-5 w-5 text-purple-500" />
                  <span className="text-sm">Live preview of changes</span>
                </div>
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  <span className="text-sm">Content validation and error handling</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
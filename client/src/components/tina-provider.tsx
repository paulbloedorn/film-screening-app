import React, { ReactNode, useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";

interface TinaProviderProps {
  children: ReactNode;
  query?: string;
  variables?: Record<string, any>;
  data?: any;
}

export function TinaProvider({ children, query, variables = {}, data }: TinaProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // For now, just render children without TinaCMS integration
  // This will be enhanced once TinaCMS is properly configured
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading content...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Content Loading Error:</strong> {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}

// Hook to access content with error handling
export function useTinaContent(query: string, variables: Record<string, any> = {}, fallbackData: any = null) {
  const [contentData, setContentData] = useState(fallbackData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // For now, return fallback data
  // This will be enhanced once TinaCMS is properly configured
  useEffect(() => {
    if (fallbackData) {
      setContentData(fallbackData);
      setLoading(false);
    }
  }, [fallbackData]);

  return { data: contentData, loading, error };
}

// Error boundary for TinaCMS content
export class TinaErrorBoundary extends React.Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('TinaCMS Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <Alert className="m-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Content Error:</strong> There was an issue loading this content section.
              {this.state.error && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm">Error details</summary>
                  <pre className="text-xs mt-1 p-2 bg-gray-100 rounded overflow-auto">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
            </AlertDescription>
          </Alert>
        )
      );
    }

    return this.props.children;
  }
}
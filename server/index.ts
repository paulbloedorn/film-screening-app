import { handleApiRequest } from "./routes";
import { 
  errorMiddleware, 
  loggingMiddleware, 
  addSecurityHeaders,
  rateLimitMiddleware 
} from "./middleware";

export interface Env {
  ASSETS: Fetcher;
  DATABASE_URL: string;
  NODE_ENV: string;
  TINA_TOKEN?: string;
  NEXT_PUBLIC_TINA_CLIENT_ID?: string;
  GA_MEASUREMENT_ID?: string;
  DASHBOARD_JWT_SECRET?: string;
}

const mainHandler = errorMiddleware(async (request: Request, env: Env, ctx: ExecutionContext): Promise<Response> => {
  const url = new URL(request.url);
  
  // Apply logging middleware
  await loggingMiddleware(request, env, ctx);
  
  // Handle health check endpoint (no rate limiting needed)
  if (url.pathname === '/health' || url.pathname === '/api/health') {
    return new Response(JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV || 'unknown',
      version: '1.0.0'
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  }

  // Handle API routes with rate limiting
  if (url.pathname.startsWith('/api/')) {
    // Apply rate limiting to API routes
    const rateLimitCheck = rateLimitMiddleware(100, 60000);
    const rateLimitResponse = await rateLimitCheck(request, env, ctx);
    if (rateLimitResponse) {
      return addSecurityHeaders(rateLimitResponse);
    }
    
    const apiResponse = await handleApiRequest(request, env);
    return addSecurityHeaders(apiResponse);
  }
  
  // Handle TinaCMS admin routes - serve admin interface
  if (url.pathname.startsWith('/admin')) {
    try {
      // Try to serve the admin asset first
      const adminResponse = await env.ASSETS.fetch(request);
      
      // If admin asset exists, return it
      if (adminResponse.status !== 404) {
        return addSecurityHeaders(adminResponse);
      }
      
      // For admin SPA routing, serve admin/index.html
      const adminIndexUrl = new URL('/admin/index.html', request.url);
      const adminIndexRequest = new Request(adminIndexUrl.toString(), {
        method: request.method,
        headers: request.headers,
      });
      
      const fallbackResponse = await env.ASSETS.fetch(adminIndexRequest);
      
      if (fallbackResponse.status === 404) {
        return new Response('TinaCMS admin interface not found. Please ensure the admin build is included in deployment.', { 
          status: 404,
          headers: { 'Content-Type': 'text/plain' }
        });
      }
      
      return addSecurityHeaders(fallbackResponse);
    } catch (error) {
      console.error('Error serving admin assets:', error);
      return new Response('Error loading admin interface', { 
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }
  
  // Handle static assets and client-side routing
  try {
    // Try to serve static assets first
    const assetResponse = await env.ASSETS.fetch(request);
    
    // If asset exists and is not a 404, return it with appropriate caching
    if (assetResponse.status !== 404) {
      const response = addSecurityHeaders(assetResponse);
      
      // Add caching headers for static assets
      if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
        response.headers.set('Cache-Control', 'public, max-age=31536000, immutable'); // 1 year
      } else if (url.pathname.match(/\.(html|json)$/)) {
        response.headers.set('Cache-Control', 'public, max-age=300'); // 5 minutes
      }
      
      return response;
    }
    
    // For client-side routing, serve index.html
    const indexUrl = new URL('/index.html', request.url);
    const indexRequest = new Request(indexUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': request.headers.get('Accept') || 'text/html',
        'Accept-Encoding': request.headers.get('Accept-Encoding') || '',
        'User-Agent': request.headers.get('User-Agent') || '',
      },
    });
    
    const indexResponse = await env.ASSETS.fetch(indexRequest);
    
    // If index.html also doesn't exist, return a basic error
    if (indexResponse.status === 404) {
      return new Response('Application not found. Please ensure the build process completed successfully.', { 
        status: 404,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
    const response = addSecurityHeaders(indexResponse);
    // Don't cache the main HTML file for SPA routing
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Error serving assets:', error);
    return new Response('Internal Server Error', { 
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
});

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return mainHandler(request, env, ctx);
  },
};

import type { Env } from "./index";

export type MiddlewareHandler = (
  request: Request,
  env: Env,
  ctx: ExecutionContext
) => Promise<Response | void>;

export type RequestHandler = (
  request: Request,
  env: Env,
  ctx: ExecutionContext
) => Promise<Response>;

/**
 * Compose multiple middleware functions
 */
export function compose(...middlewares: MiddlewareHandler[]): MiddlewareHandler {
  return async (request: Request, env: Env, ctx: ExecutionContext) => {
    for (const middleware of middlewares) {
      const result = await middleware(request, env, ctx);
      if (result instanceof Response) {
        return result;
      }
    }
  };
}

/**
 * CORS middleware for API routes
 */
export const corsMiddleware: MiddlewareHandler = async (request, env, ctx) => {
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }
};

/**
 * Add CORS headers to response
 */
export function addCorsHeaders(response: Response): Response {
  const newResponse = new Response(response.body, response);
  
  newResponse.headers.set('Access-Control-Allow-Origin', '*');
  newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return newResponse;
}

/**
 * Error handling middleware
 */
export const errorMiddleware = (handler: RequestHandler): RequestHandler => {
  return async (request: Request, env: Env, ctx: ExecutionContext) => {
    try {
      return await handler(request, env, ctx);
    } catch (error) {
      console.error('Request error:', error);
      
      // Return appropriate error response
      const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
      const statusCode = error instanceof Error && 'status' in error ? (error as any).status : 500;
      
      return new Response(JSON.stringify({ 
        message: errorMessage,
        timestamp: new Date().toISOString()
      }), {
        status: statusCode,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      });
    }
  };
};

/**
 * Request logging middleware
 */
export const loggingMiddleware: MiddlewareHandler = async (request, env, ctx) => {
  const start = Date.now();
  const url = new URL(request.url);
  
  console.log(`${request.method} ${url.pathname} - Started`);
  
  // Add cleanup logging after request completes
  ctx.waitUntil(
    Promise.resolve().then(() => {
      const duration = Date.now() - start;
      console.log(`${request.method} ${url.pathname} - Completed in ${duration}ms`);
    })
  );
};

/**
 * Rate limiting middleware (Cloudflare Workers compatible)
 * Uses Durable Objects or KV for distributed rate limiting in production
 */
export const rateLimitMiddleware = (
  maxRequests: number = 100,
  windowMs: number = 60000 // 1 minute
) => {
  // In-memory storage for development - in production, use Durable Objects or KV
  const requests = new Map<string, { count: number; resetTime: number }>();
  
  return async (request: Request, env: Env, ctx: ExecutionContext): Promise<Response | void> => {
    const clientIP = request.headers.get('CF-Connecting-IP') || 
                     request.headers.get('X-Forwarded-For') || 
                     request.headers.get('X-Real-IP') ||
                     'unknown';
    
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Clean up old entries periodically
    if (requests.size > 1000) { // Prevent memory leaks
      for (const [ip, data] of requests.entries()) {
        if (data.resetTime < windowStart) {
          requests.delete(ip);
        }
      }
    }
    
    // Check current client
    const clientData = requests.get(clientIP);
    
    if (!clientData) {
      requests.set(clientIP, { count: 1, resetTime: now + windowMs });
      return; // Allow request
    } 
    
    if (clientData.resetTime < now) {
      // Reset window
      requests.set(clientIP, { count: 1, resetTime: now + windowMs });
      return; // Allow request
    } 
    
    // Increment count
    clientData.count++;
    
    if (clientData.count > maxRequests) {
      const retryAfter = Math.ceil((clientData.resetTime - now) / 1000);
      return new Response(JSON.stringify({ 
        message: 'Too many requests',
        retryAfter: retryAfter
      }), {
        status: 429,
        headers: { 
          'Content-Type': 'application/json',
          'Retry-After': retryAfter.toString(),
          'Access-Control-Allow-Origin': '*',
          'X-RateLimit-Limit': maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': Math.ceil(clientData.resetTime / 1000).toString()
        },
      });
    }
    
    // Add rate limit headers to successful requests
    ctx.waitUntil(
      Promise.resolve().then(() => {
        // This could be used to add headers to the final response
        // For now, we'll handle this in the main handler
      })
    );
    
    return; // Allow request
  };
};

/**
 * Security headers middleware
 */
export const securityHeadersMiddleware: MiddlewareHandler = async (request, env, ctx) => {
  // This middleware doesn't return a response, it just adds headers to subsequent responses
  // We'll need to apply these headers in the main handler
};

/**
 * Add security headers to response
 */
export function addSecurityHeaders(response: Response): Response {
  const newResponse = new Response(response.body, response);
  
  newResponse.headers.set('X-Content-Type-Options', 'nosniff');
  newResponse.headers.set('X-Frame-Options', 'DENY');
  newResponse.headers.set('X-XSS-Protection', '1; mode=block');
  newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  newResponse.headers.set('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' data:; " +
    "connect-src 'self' https://api.tina.io https://www.google-analytics.com; " +
    "frame-src 'self';"
  );
  
  return newResponse;
}
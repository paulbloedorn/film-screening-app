import type { Env } from "./index";

export interface SessionData {
  userId?: string;
  role?: string;
  createdAt: number;
  expiresAt: number;
}

export class WorkersSessionManager {
  private readonly SESSION_COOKIE_NAME = 'session_id';
  private readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  constructor(private env: Env) {}

  /**
   * Create a new session and return the session ID
   */
  async createSession(userId: string, role: string = 'client'): Promise<string> {
    const sessionId = crypto.randomUUID();
    const now = Date.now();
    
    const sessionData: SessionData = {
      userId,
      role,
      createdAt: now,
      expiresAt: now + this.SESSION_DURATION,
    };

    // Store session data in KV storage (if available) or use a simple in-memory approach
    // For now, we'll encode the session data in the session ID itself (JWT-like approach)
    const encodedSession = await this.encodeSession(sessionData);
    
    return encodedSession;
  }

  /**
   * Validate and retrieve session data from session ID
   */
  async getSession(sessionId: string): Promise<SessionData | null> {
    try {
      const sessionData = await this.decodeSession(sessionId);
      
      // Check if session is expired
      if (Date.now() > sessionData.expiresAt) {
        return null;
      }
      
      return sessionData;
    } catch (error) {
      console.error('Session validation error:', error);
      return null;
    }
  }

  /**
   * Extract session ID from request cookies
   */
  getSessionIdFromRequest(request: Request): string | null {
    const cookieHeader = request.headers.get('Cookie');
    if (!cookieHeader) return null;

    const cookies = this.parseCookies(cookieHeader);
    return cookies[this.SESSION_COOKIE_NAME] || null;
  }

  /**
   * Create response with session cookie
   */
  setSessionCookie(response: Response, sessionId: string): Response {
    const newResponse = new Response(response.body, response);
    
    const cookieValue = `${this.SESSION_COOKIE_NAME}=${sessionId}; HttpOnly; Secure; SameSite=Strict; Max-Age=${this.SESSION_DURATION / 1000}; Path=/`;
    newResponse.headers.set('Set-Cookie', cookieValue);
    
    return newResponse;
  }

  /**
   * Create response that clears the session cookie
   */
  clearSessionCookie(response: Response): Response {
    const newResponse = new Response(response.body, response);
    
    const cookieValue = `${this.SESSION_COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/`;
    newResponse.headers.set('Set-Cookie', cookieValue);
    
    return newResponse;
  }

  /**
   * Middleware to check authentication
   */
  async requireAuth(request: Request): Promise<SessionData | Response> {
    const sessionId = this.getSessionIdFromRequest(request);
    
    if (!sessionId) {
      return new Response(JSON.stringify({ message: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const sessionData = await this.getSession(sessionId);
    
    if (!sessionData) {
      return new Response(JSON.stringify({ message: 'Invalid or expired session' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return sessionData;
  }

  /**
   * Parse cookies from cookie header
   */
  private parseCookies(cookieHeader: string): Record<string, string> {
    const cookies: Record<string, string> = {};
    
    cookieHeader.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[name] = decodeURIComponent(value);
      }
    });
    
    return cookies;
  }

  /**
   * Encode session data using Web Crypto API (Workers-compatible)
   * Creates a signed token to prevent tampering
   */
  private async encodeSession(sessionData: SessionData): Promise<string> {
    const jsonString = JSON.stringify(sessionData);
    
    // Create a simple signed token using HMAC
    const key = await this.getSigningKey();
    const encoder = new TextEncoder();
    const data = encoder.encode(jsonString);
    
    // Sign the data
    const signature = await crypto.subtle.sign('HMAC', key, data);
    const signatureArray = new Uint8Array(signature);
    
    // Combine data and signature
    const combined = new Uint8Array(data.length + signatureArray.length + 4);
    const view = new DataView(combined.buffer);
    view.setUint32(0, data.length, true); // Store data length
    combined.set(data, 4);
    combined.set(signatureArray, 4 + data.length);
    
    // Base64 encode the result
    return btoa(String.fromCharCode(...combined));
  }

  /**
   * Decode and verify session data
   */
  private async decodeSession(sessionId: string): Promise<SessionData> {
    try {
      // Base64 decode
      const combined = new Uint8Array(
        atob(sessionId).split('').map(c => c.charCodeAt(0))
      );
      
      // Extract data length
      const view = new DataView(combined.buffer);
      const dataLength = view.getUint32(0, true);
      
      if (dataLength > combined.length - 4) {
        throw new Error('Invalid session format');
      }
      
      // Extract data and signature
      const data = combined.slice(4, 4 + dataLength);
      const signature = combined.slice(4 + dataLength);
      
      // Verify signature
      const key = await this.getSigningKey();
      const isValid = await crypto.subtle.verify('HMAC', key, signature, data);
      
      if (!isValid) {
        throw new Error('Invalid session signature');
      }
      
      // Parse session data
      const jsonString = new TextDecoder().decode(data);
      const sessionData = JSON.parse(jsonString) as SessionData;
      
      // Validate session data structure
      if (!sessionData.createdAt || !sessionData.expiresAt) {
        throw new Error('Invalid session data structure');
      }
      
      return sessionData;
    } catch (error) {
      throw new Error('Invalid session format');
    }
  }

  /**
   * Get or create signing key for session tokens
   */
  private async getSigningKey(): Promise<CryptoKey> {
    // In production, this should use a proper secret from environment
    // For now, we'll derive a key from a static string
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode('session-signing-key-' + (this.env.NODE_ENV || 'development')),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    
    return await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: new TextEncoder().encode('session-salt'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign', 'verify']
    );
  }
}

/**
 * Factory function to create session manager
 */
export function createSessionManager(env: Env): WorkersSessionManager {
  return new WorkersSessionManager(env);
}
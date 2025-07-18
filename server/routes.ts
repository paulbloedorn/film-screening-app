import { z } from "zod";
import { createStorage } from "./storage";
import { insertScreeningRequestSchema } from "@shared/schema";
import { addCorsHeaders } from "./middleware";
import type { Env } from "./index";

export async function handleApiRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const { pathname } = url;
  const method = request.method;

  // Create storage instance with database URL from environment
  const storage = createStorage(env.DATABASE_URL);

  // Handle preflight requests
  if (method === 'OPTIONS') {
    return addCorsHeaders(new Response(null, { status: 200 }));
  }

  try {
    // Route: GET /api/screening-requests
    if (pathname === '/api/screening-requests' && method === 'GET') {
      const requests = await storage.getAllScreeningRequests();
      const response = new Response(JSON.stringify(requests), {
        headers: { 'Content-Type': 'application/json' },
      });
      return addCorsHeaders(response);
    }

    // Route: POST /api/screening-requests
    if (pathname === '/api/screening-requests' && method === 'POST') {
      try {
        const body = await request.json();
        const validatedData = insertScreeningRequestSchema.parse(body);
        const newRequest = await storage.createScreeningRequest(validatedData);
        
        const response = new Response(JSON.stringify(newRequest), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        });
        return addCorsHeaders(response);
      } catch (error) {
        if (error instanceof z.ZodError) {
          const response = new Response(JSON.stringify({ 
            message: "Invalid request data", 
            errors: error.errors 
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
          return addCorsHeaders(response);
        }
        throw error;
      }
    }

    // Route: GET /api/screening-requests/:id
    const screeningRequestMatch = pathname.match(/^\/api\/screening-requests\/(\d+)$/);
    if (screeningRequestMatch && method === 'GET') {
      const id = parseInt(screeningRequestMatch[1]);
      if (isNaN(id)) {
        const response = new Response(JSON.stringify({ message: "Invalid ID" }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
        return addCorsHeaders(response);
      }

      const screeningRequest = await storage.getScreeningRequest(id);
      if (!screeningRequest) {
        const response = new Response(JSON.stringify({ message: "Screening request not found" }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
        return addCorsHeaders(response);
      }

      const response = new Response(JSON.stringify(screeningRequest), {
        headers: { 'Content-Type': 'application/json' },
      });
      return addCorsHeaders(response);
    }

    // Route not found
    const response = new Response(JSON.stringify({ message: "API route not found" }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
    return addCorsHeaders(response);

  } catch (error) {
    console.error("API Error:", error);
    const response = new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
    return addCorsHeaders(response);
  }
}

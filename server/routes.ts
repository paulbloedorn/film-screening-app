import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { insertScreeningRequestSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all screening requests
  app.get("/api/screening-requests", async (req, res) => {
    try {
      const requests = await storage.getAllScreeningRequests();
      res.json(requests);
    } catch (error) {
      console.error("Error fetching screening requests:", error);
      res.status(500).json({ message: "Failed to fetch screening requests" });
    }
  });

  // Create new screening request
  app.post("/api/screening-requests", async (req, res) => {
    try {
      const validatedData = insertScreeningRequestSchema.parse(req.body);
      const newRequest = await storage.createScreeningRequest(validatedData);
      res.status(201).json(newRequest);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Invalid request data", 
          errors: error.errors 
        });
      } else {
        console.error("Error creating screening request:", error);
        res.status(500).json({ message: "Failed to create screening request" });
      }
    }
  });

  // Get specific screening request
  app.get("/api/screening-requests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      const request = await storage.getScreeningRequest(id);
      if (!request) {
        return res.status(404).json({ message: "Screening request not found" });
      }

      res.json(request);
    } catch (error) {
      console.error("Error fetching screening request:", error);
      res.status(500).json({ message: "Failed to fetch screening request" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

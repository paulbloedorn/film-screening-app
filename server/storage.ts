import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { screeningRequests, type ScreeningRequest, type InsertScreeningRequest } from "./shared/schema";

export interface IStorage {
  getScreeningRequest(id: number): Promise<ScreeningRequest | undefined>;
  getAllScreeningRequests(): Promise<ScreeningRequest[]>;
  createScreeningRequest(request: InsertScreeningRequest): Promise<ScreeningRequest>;
}

export class NeonStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;

  constructor(databaseUrl: string) {
    const sql = neon(databaseUrl);
    this.db = drizzle(sql);
  }

  async getScreeningRequest(id: number): Promise<ScreeningRequest | undefined> {
    const result = await this.db
      .select()
      .from(screeningRequests)
      .where(eq(screeningRequests.id, id))
      .limit(1);
    
    return result[0];
  }

  async getAllScreeningRequests(): Promise<ScreeningRequest[]> {
    return await this.db
      .select()
      .from(screeningRequests)
      .orderBy(screeningRequests.createdAt);
  }

  async createScreeningRequest(insertRequest: InsertScreeningRequest): Promise<ScreeningRequest> {
    const result = await this.db
      .insert(screeningRequests)
      .values(insertRequest)
      .returning();
    
    return result[0];
  }
}

// Factory function to create storage instance
export function createStorage(databaseUrl: string): IStorage {
  return new NeonStorage(databaseUrl);
}

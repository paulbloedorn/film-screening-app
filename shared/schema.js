import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
export const screeningRequests = pgTable("screening_requests", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    organization: text("organization").notNull(),
    screeningType: text("screening_type").notNull(),
    eventDate: text("event_date"),
    attendeeCount: text("attendee_count"),
    message: text("message"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const insertScreeningRequestSchema = createInsertSchema(screeningRequests).omit({
    id: true,
    createdAt: true,
});

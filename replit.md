# Replit.md - Film Screening Request Application

## Overview

This is a full-stack web application for managing film screening requests for "24 Days Without You" documentary. The application provides different screening options (Conference, Hospital/Clinic, Education, Corporate) with dedicated pages and a form system to collect screening requests.

## System Architecture

The application follows a modern full-stack architecture with:

- **Frontend**: React with TypeScript using Vite as the build tool
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM (currently using in-memory storage as fallback)
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation

## Key Components

### Frontend Architecture
- **Component Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom color scheme (teal/cream theme)
- **Forms**: React Hook Form with Zod schema validation
- **Toast Notifications**: Custom toast system for user feedback
- **Responsive Design**: Mobile-first approach with responsive layouts

### Backend Architecture
- **API Structure**: RESTful endpoints under `/api/` prefix
- **Data Layer**: Abstract storage interface with in-memory implementation
- **Validation**: Zod schemas shared between client and server
- **Error Handling**: Centralized error handling middleware
- **Development Tools**: Hot reload with Vite integration

### Database Schema
- **Screening Requests Table**: Stores all screening request submissions
  - Fields: id, name, email, organization, screeningType, eventDate, attendeeCount, message, createdAt
  - Primary key: Auto-incrementing integer ID
  - Timestamps: Automatic creation timestamp

## Data Flow

1. **User Journey**: Users navigate to specific screening type pages
2. **Form Submission**: Users fill out screening request forms with validation
3. **API Request**: Form data is sent to Express API with JSON payload
4. **Validation**: Server validates data using shared Zod schemas
5. **Storage**: Data is stored (currently in-memory, designed for PostgreSQL)
6. **Response**: Success/error feedback provided via toast notifications
7. **State Updates**: React Query automatically updates cached data

## External Dependencies

### Core Technologies
- **React Ecosystem**: React 18, React Hook Form, React Query
- **Backend**: Express.js, Node.js with ES modules
- **Database**: Drizzle ORM with PostgreSQL dialect (@neondatabase/serverless)
- **Build Tools**: Vite, TypeScript, esbuild
- **UI Components**: Radix UI primitives, Lucide React icons

### Development Tools
- **Replit Integration**: Custom Vite plugins for Replit environment
- **Hot Reload**: Development server with file watching
- **Type Safety**: Comprehensive TypeScript configuration
- **Code Quality**: ESM modules, strict TypeScript settings

## Deployment Strategy

### Development
- **Local Development**: `npm run dev` starts both frontend and backend
- **File Watching**: Automatic reload on TypeScript changes
- **Environment**: NODE_ENV=development with development middleware

### Production Build
- **Frontend Build**: Vite builds React app to `dist/public`
- **Backend Build**: esbuild bundles Express server to `dist/index.js`
- **Static Serving**: Express serves built React app in production
- **Database**: Requires DATABASE_URL environment variable for PostgreSQL

### Database Deployment
- **Schema Management**: Drizzle migrations in `/migrations` directory
- **Database Push**: `npm run db:push` applies schema changes
- **Connection**: Configured for Neon serverless PostgreSQL

## Changelog

```
Changelog:
- July 13, 2025. Added hero section with movie poster:
  - Added new hero section with "We all take childbirth for granted..." tagline
  - Integrated movie poster image on right side
  - Added "Watch Trailer" CTA button with full-screen YouTube embed modal
  - Moved audience cards section below hero
- July 13, 2025. Implemented homepage blueprint design:
  - Added three audience-focused cards (Conference, Hospital, Education)
  - Implemented "Schedule a Consult" CTA throughout
  - Added impact metrics bar (6,500+ clinicians, 97% effectiveness)
  - Added role-specific testimonials with badges
  - Added "How It Works" 3-step process
  - Added comprehensive FAQ section
  - Restructured homepage for conversion optimization
- July 01, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```
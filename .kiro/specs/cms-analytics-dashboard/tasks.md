# Implementation Plan

- [x] 1. Set up Tina.io CMS integration foundation
  - Install and configure TinaCMS dependencies (@tinacms/cli, tinacms, @tinacms/auth)
  - Create tina/config.ts with schema definitions for existing page content
  - Set up content collections for homepage sections (hero, testimonials, FAQ, audience cards)
  - Configure Git-based content management workflow
  - _Requirements: 1.1, 1.3_

- [x] 2. Create content schema and initial content files
  - Define TinaCMS schema for homepage hero section with poster and trailer configuration
  - Create schema for testimonials, FAQ items, and audience cards sections
  - Convert existing hardcoded content to markdown/JSON content files
  - Implement content queries and data fetching in React components
  - _Requirements: 1.1, 1.2_

- [x] 3. Implement CMS authentication and editing interface
  - Set up TinaCMS authentication system for client access
  - Create protected /admin route for CMS interface
  - Implement real-time content editing with live preview
  - Add content validation and error handling for CMS operations
  - _Requirements: 1.1, 1.4, 6.1, 6.2_

- [x] 4. Adapt Express.js application for Cloudflare Workers deployment
  - Refactor Express.js routes to Cloudflare Workers Request/Response API
  - Update server/index.ts to use Workers runtime instead of Express
  - Implement Workers-compatible session management and middleware
  - Configure asset serving using Cloudflare Workers Assets binding
  - _Requirements: 2.1, 2.3_

- [ ] 5. Configure Cloudflare Workers deployment pipeline
  - Update wrangler.toml with production configuration and environment variables
  - Set up DATABASE_URL and other secrets in Cloudflare Workers environment
  - Implement build process for Workers deployment (frontend + backend bundling)
  - Create deployment scripts and test deployment to Cloudflare Workers
  - _Requirements: 2.1, 2.2, 2.4_

- [ ] 6. Implement dual analytics tracking system
  - Install and configure Google Analytics 4 with gtag implementation
  - Create analytics middleware for Cloudflare Workers to capture page views and events
  - Implement event tracking for form submissions, trailer plays, and CTA clicks
  - Set up Cloudflare Analytics integration using Workers Analytics Engine
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 7. Create analytics data storage and collection
  - Extend database schema with analytics_events table using Drizzle ORM
  - Implement server-side analytics data collection and storage in Neon database
  - Create analytics service functions for data aggregation and querying
  - Add privacy-compliant data collection with IP anonymization
  - _Requirements: 3.1, 3.2, 3.4_

- [ ] 8. Build client dashboard authentication system
  - Extend database schema with dashboard_users and user_sessions tables
  - Implement secure password hashing and user registration system
  - Create login/logout functionality with session management
  - Add role-based access control for dashboard features
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 9. Create analytics dashboard UI components
  - Build dashboard layout with navigation and user authentication status
  - Implement traffic overview charts using Recharts (page views, sessions, unique visitors)
  - Create geographic distribution visualization for visitor locations
  - Add referral sources and conversion funnel visualizations
  - _Requirements: 4.1, 4.4_

- [ ] 10. Implement lead management dashboard features
  - Create lead management interface displaying screening requests from database
  - Add filtering, sorting, and search functionality for screening requests
  - Implement lead details view with contact information and submission data
  - Add export functionality for lead data (CSV/Excel format)
  - _Requirements: 4.2, 4.3_

- [ ] 11. Add real-time dashboard updates and notifications
  - Implement WebSocket or Server-Sent Events for real-time data updates
  - Create notification system for new lead submissions
  - Add automatic dashboard data refresh with configurable intervals
  - Implement dashboard caching strategy for improved performance
  - _Requirements: 4.5_

- [ ] 12. Enhance screening request tracking with analytics integration
  - Extend existing screening request form to capture analytics data (referrer, session ID)
  - Update ScreeningRequest model to include conversion tracking fields
  - Implement conversion path tracking to show user journey before form submission
  - Add form analytics to track completion rates and abandonment points
  - _Requirements: 3.3, 4.2, 5.1_

- [ ] 13. Implement comprehensive error handling and monitoring
  - Add error boundaries and fallback UI for CMS content loading failures
  - Implement analytics service fallback when one tracking service fails
  - Create database connection error handling with retry mechanisms
  - Add application monitoring and health check endpoints
  - _Requirements: 1.4, 2.4, 3.4, 5.4_

- [ ] 14. Create testing suite for all new functionality
  - Write unit tests for TinaCMS integration and content loading
  - Create integration tests for Cloudflare Workers API endpoints
  - Implement end-to-end tests for analytics tracking and dashboard functionality
  - Add security tests for authentication and authorization systems
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 6.1_

- [ ] 15. Deploy and configure production environment
  - Deploy application to Cloudflare Workers with production configuration
  - Configure production database connections and environment variables
  - Set up domain routing and SSL certificates through Cloudflare
  - Implement production monitoring and logging systems
  - _Requirements: 2.1, 2.2, 5.2, 5.3_
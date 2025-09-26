# SIKA Permit Management System - AI Agent Instructions

## Architecture Overview

SIKA is a Next.js 15 application for industrial permit-to-work management using MySQL/Prisma with a 3-actor approval workflow:
- **PTWC** (Permit to Work Controller): Creates permits
- **AA** (Area Authority): First-level approval  
- **SC** (Site Controller): Final approval

Permits flow: `DRAFT` → `SUBMITTED` → `PENDING_AA_APPROVAL` → `AA_APPROVED` → `FULLY_APPROVED` → `ACTIVE` (visible on site plot)

## Key Patterns & Conventions

### Authentication System
- Client-side auth using localStorage (not JWT tokens)
- `withAuth` HOC wraps protected components in `/app/components/withAuth.js`  
- Auth state managed via localStorage with `user` object containing `{id, name, email, role}`
- Middleware at root level only adds security headers, doesn't handle auth

### Database & Models
- Prisma schema uses MySQL with snake_case column names (`@map`)
- Models in `/models/` (e.g., `User.js`) use static methods, not instance methods
- Always use `prisma` from `/lib/prisma.js`, never instantiate new clients
- User roles: `ADMIN`, `USER`, `PTWC`, `AA`, `SC` (enum in schema)

### API Route Structure
```
/api/[resource]/route.js           # CRUD operations
/api/[resource]/[id]/route.js      # Single resource
/api/[resource]/[id]/[action]/route.js  # Actions like approve, submit, delete
```

### Permit Status Workflow
Critical status transitions in `PermitPlanning` model:
- Use `status` field with enum values from schema
- Approval tracking uses separate `aaApprovedBy`, `scApprovedBy` fields
- Site plot visualization only shows `ACTIVE` permits

## Development Workflows

### Database Operations
```bash
npm run db:migrate    # Run Prisma migrations
npm run db:seed      # Seed database with test data
npm run db:generate  # Generate Prisma client
npm run db:studio    # Open Prisma Studio
```

### Testing Workflows  
Use the comprehensive test runner system:
```bash
node run-test.js setup           # Create test users (PTWC, AA, SC)
node run-test.js full-workflow   # Test complete approval flow
node run-test.js cleanup         # Remove test data
```

Test users: `ptwc@sika.com`, `aa@sika.com`, `sc@sika.com` (all password: `[role]123`)

### Site Plot Visualization
- Coordinate system uses pixel positions on background image
- Work types have color coding: Cold Work (blue), Hot Work-Spark (yellow), Hot Work-Flame (red)
- Component at `/app/components/SitePlotVisualization.js` handles interactive plot
- Location zones: `PRC`, `UTL`, `BLD`, `GMS`, `CCR`, `OY`, `NBL`, `WS`

## Critical Integration Points

### Approval System
- Approval endpoints at `/api/permit-planning/[id]/approve/route.js`
- Must validate user role matches approval level (AA can't do SC approval)
- Status transitions are strictly enforced in approval logic
- Comments are optional but tracked separately for AA and SC

### Import/Export System  
- Multiple import endpoints: `/api/siteplotplans/import*` (CSV, spreadsheet)
- See `/docs/IMPORT_SPREADSHEET_GUIDE.md` for data format requirements

### Role-Based Access Control
- Dashboard filtering by user role in `/app/dashboard/page.js`
- Menu visibility controlled by role in `/app/components/Sidebar.js`
- API routes validate user permissions before data operations

## File Naming Conventions
- API routes: `route.js` (Next.js App Router convention)
- Components: PascalCase `.js` files (not `.jsx`)
- Pages: `page.js` in directory structure
- Models: PascalCase in `/models/` with static methods

## Common Pitfalls to Avoid
- Don't create new Prisma client instances - always import from `/lib/prisma.js`
- Don't bypass status workflow - use proper transition validation
- Don't assume JWT tokens - auth uses localStorage directly  
- Don't mix roles in approval logic - AA and SC have distinct responsibilities
- Always include user relations in permit queries for approval tracking

## Key Files to Reference
- `/prisma/schema.prisma` - Complete data model and enums
- `/docs/WORKFLOW_3_AKTOR.md` - Business logic documentation  
- `/models/User.js` - User management patterns
- `/middleware.js` - Security headers and route protection
- `/run-test.js` - Testing workflow examples
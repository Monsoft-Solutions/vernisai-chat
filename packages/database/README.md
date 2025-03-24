# VernisAI Database Package

This package contains the database schema and client for the VernisAI platform. It uses Drizzle ORM with Supabase PostgreSQL.

## Setup

1. Make sure the root `.env.local` file exists with the following variables:

   ```
   # Database connection
   DATABASE_URL=postgresql://postgres:password@localhost:5432/vernisai

   # Supabase connection
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   ```

   You can copy from `.env.local.example` at the project root.

2. Install dependencies: `npm install`

## Usage

You can import the database client and schema from this package:

```typescript
import { db, supabase } from "@vernisai/database";
import { users, organizations, organizationMembers } from "@vernisai/database";

// Query examples
const allUsers = await db.select().from(users);
const user = await db.query.users.findFirst({
  where: (users, { eq }) => eq(users.email, "user@example.com"),
});
```

## Database Schema

The database schema includes the following entities:

- **Users**: Basic user information
- **Organizations**: Organization/tenant information
- **Organization Members**: Relationships between users and organizations with role information

## Development Commands

- `npm run build`: Build the package
- `npm run dev`: Run in development mode with watch
- `npm run generate`: Generate Drizzle migrations from schema changes
- `npm run migrate`: Run migrations
- `npm run studio`: Launch Drizzle Studio for visual database management

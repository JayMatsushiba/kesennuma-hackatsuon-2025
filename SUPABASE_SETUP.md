# Supabase Setup Guide

This guide walks you through setting up Supabase for the Kesennuma Digital Experiences platform.

## Table of Contents
1. [Create Supabase Project](#1-create-supabase-project)
2. [Configure Database](#2-configure-database)
3. [Run Migrations](#3-run-migrations)
4. [Set Up Storage](#4-set-up-storage)
5. [Configure Authentication](#5-configure-authentication)
6. [Get Environment Variables](#6-get-environment-variables)
7. [Seed Sample Data](#7-seed-sample-data)

---

## 1. Create Supabase Project

### Step 1.1: Sign Up / Log In
1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" or "Sign in"
3. Sign in with GitHub (recommended) or email

### Step 1.2: Create New Project
1. Click "New Project" in the dashboard
2. Fill in project details:
   - **Name**: `kesennuma-digital-experiences` (or your preferred name)
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users (e.g., Tokyo for Japan)
   - **Pricing Plan**: Start with Free tier
3. Click "Create new project"
4. Wait 2-3 minutes for provisioning

---

## 2. Configure Database

### Step 2.1: Enable PostGIS Extension
PostGIS is required for geospatial queries (finding nearby stories, etc.).

1. In Supabase Dashboard, go to **Database** → **Extensions**
2. Search for "postgis"
3. Enable the `postgis` extension
4. Confirm it's enabled (check mark should appear)

### Step 2.2: Create Database Schema
You have two options:

#### Option A: Using Prisma Migrate (Recommended)
```bash
# From your project root directory
npx prisma migrate dev --name init
```

This will:
- Create all tables defined in `prisma/schema.prisma`
- Generate Prisma Client for type-safe database access
- Track migration history

#### Option B: Manual SQL Execution
1. Go to **SQL Editor** in Supabase Dashboard
2. Click "New query"
3. Copy the contents of `prisma/migrations/001_init.sql` (after running Option A)
4. Click "Run"

---

## 3. Run Migrations

### Step 3.1: Set Environment Variables
Create a `.env` file in your project root:

```bash
cp .env.example .env
```

Update these values in `.env`:
- `DATABASE_URL`: Get from Supabase Dashboard → Settings → Database → Connection string (pooled)
- `DIRECT_URL`: Get from Supabase Dashboard → Settings → Database → Connection string (direct)
- `NEXT_PUBLIC_SUPABASE_URL`: Your project URL (e.g., `https://abcd1234.supabase.co`)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Get from Settings → API → anon public key

### Step 3.2: Run Prisma Migrate
```bash
npx prisma migrate dev
```

### Step 3.3: Generate Prisma Client
```bash
npx prisma generate
```

### Step 3.4: Verify Tables
1. Go to **Table Editor** in Supabase Dashboard
2. You should see 14 tables:
   - `users`
   - `stories`
   - `story_content`
   - `story_media`
   - `tags`
   - `story_tags`
   - `camera_keyframes`
   - `itineraries`
   - `itinerary_stops`
   - `nft_campaigns`
   - `campaign_locations`
   - `visits`
   - `nft_stamps`
   - `_prisma_migrations` (metadata)

---

## 4. Set Up Storage

### Step 4.1: Create Storage Bucket
1. Go to **Storage** in Supabase Dashboard
2. Click "Create a new bucket"
3. **Name**: `public-media`
4. **Public bucket**: ✅ Enable (for public access to images/videos)
5. Click "Create bucket"

### Step 4.2: Configure File Size Limits
1. Click on the `public-media` bucket
2. Go to **Policies** tab
3. Click "New policy"
4. Choose "Custom policy"
5. Add upload policy:

```sql
-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'public-media' AND
  (storage.foldername(name))[1] IN ('images', 'videos', 'models')
);

-- Allow public read access
CREATE POLICY "Public read access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'public-media');

-- Allow users to update their own files
CREATE POLICY "Users can update own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (owner = auth.uid())
WITH CHECK (bucket_id = 'public-media');
```

### Step 4.3: Create Folder Structure
Create these folders in the `public-media` bucket:
- `images/` - For story cover images and photo content
- `videos/` - For video content
- `models/` - For 3D assets (point clouds, meshes)
- `thumbnails/` - For generated thumbnails

---

## 5. Configure Authentication

### Step 5.1: Enable Email Auth
1. Go to **Authentication** → **Providers**
2. **Email** should be enabled by default
3. Configure email templates:
   - Go to **Email Templates**
   - Customize "Magic Link" template with your branding

### Step 5.2: Set Up Email Provider (Optional but Recommended)
By default, Supabase uses their email service (rate limited).

For production, integrate a custom SMTP provider:
1. Go to **Settings** → **Auth**
2. Scroll to "SMTP Settings"
3. Configure your email provider (SendGrid, AWS SES, etc.)

### Step 5.3: Configure Auth Settings
1. Go to **Authentication** → **Settings**
2. Recommended settings:
   - **Site URL**: `http://localhost:3000` (dev) or your production domain
   - **Redirect URLs**: Add your production domain
   - **JWT expiry**: 3600 (1 hour)
   - **Disable email confirmations**: ✅ (for magic links, confirmation is clicking the link)
   - **Enable anonymous sign-ins**: ❌ (we require email)

---

## 6. Get Environment Variables

### Step 6.1: Database URLs
Go to **Settings** → **Database**:

1. **Connection string (pooled)** - Copy to `DATABASE_URL`
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true
   ```

2. **Connection string (direct)** - Copy to `DIRECT_URL`
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### Step 6.2: API Keys
Go to **Settings** → **API**:

1. **Project URL** - Copy to `NEXT_PUBLIC_SUPABASE_URL`
   ```
   https://[PROJECT-REF].supabase.co
   ```

2. **anon public** key - Copy to `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   ```
   eyJhbGc...
   ```

3. **service_role** key (optional, for admin operations)
   - ⚠️ **Never expose this client-side!**
   - Only use in server-side code or scripts

### Step 6.3: Complete .env File
Your `.env` should now look like:

```env
# Database
DATABASE_URL="postgresql://postgres:your-password@db.abcd1234.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres:your-password@db.abcd1234.supabase.co:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://abcd1234.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGc..."

# Storage
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET="public-media"

# ... (rest of your env variables)
```

---

## 7. Seed Sample Data

### Step 7.1: Create Seed File
The seed file creates sample data for development:

```bash
npx prisma db seed
```

This will create:
- 2 sample users
- 5 sample stories with content
- Tags (food, history, nature, events)
- 1 sample itinerary
- Camera keyframes for stories

### Step 7.2: Verify Data
1. Go to **Table Editor** in Supabase Dashboard
2. Click on `stories` table
3. You should see 5 sample stories
4. Check other tables for related data

---

## 8. Enable Row Level Security (RLS)

For production security, enable RLS policies:

### Step 8.1: Enable RLS on All Tables
```sql
-- Run in SQL Editor

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE camera_keyframes ENABLE ROW LEVEL SECURITY;
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE nft_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE nft_stamps ENABLE ROW LEVEL SECURITY;
```

### Step 8.2: Create Basic RLS Policies
```sql
-- Public read access for approved stories
CREATE POLICY "Public can view approved stories"
ON stories FOR SELECT
TO public
USING (status = 'approved');

-- Users can insert their own stories
CREATE POLICY "Users can create stories"
ON stories FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);

-- Users can update their own pending stories
CREATE POLICY "Users can update own pending stories"
ON stories FOR UPDATE
TO authenticated
USING (auth.uid() = author_id AND status = 'pending_review')
WITH CHECK (auth.uid() = author_id);

-- Public read for tags
CREATE POLICY "Public can view tags"
ON tags FOR SELECT
TO public
USING (true);

-- Public read for itineraries
CREATE POLICY "Public can view itineraries"
ON itineraries FOR SELECT
TO public
USING (true);

-- (Add more policies as needed for other tables)
```

---

## 9. Set Up Realtime (Optional)

If you want real-time updates (e.g., live story approval notifications):

1. Go to **Database** → **Replication**
2. Enable replication for tables:
   - `stories` (for live approval updates)
   - `nft_stamps` (for real-time NFT mint notifications)
3. In your Next.js app, use Supabase Realtime:
   ```typescript
   supabase
     .channel('stories')
     .on('postgres_changes', {
       event: 'UPDATE',
       schema: 'public',
       table: 'stories',
       filter: 'status=eq.approved'
     }, (payload) => {
       console.log('Story approved!', payload);
     })
     .subscribe();
   ```

---

## 10. Database Maintenance

### Backups
Supabase automatically backs up your database:
- **Free tier**: Daily backups, 7-day retention
- **Pro tier**: Daily backups, 30-day retention + point-in-time recovery

To manually download a backup:
1. Go to **Database** → **Backups**
2. Click "Download" on any backup

### Performance Monitoring
1. Go to **Reports** in Supabase Dashboard
2. Monitor:
   - Query performance
   - API usage
   - Storage usage
3. Add indexes if queries are slow (check slow query log)

---

## Troubleshooting

### "Could not connect to database"
- Check that `DATABASE_URL` is correct
- Verify your IP is not blocked (Supabase → Settings → Database → Connection pooling)
- Try using `DIRECT_URL` for migrations

### "Relation does not exist"
- Run `npx prisma migrate dev` to create tables
- Check that you're connected to the correct database

### "Storage bucket not found"
- Verify bucket name matches `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET`
- Check that bucket is created in Storage section

### "RLS policy error"
- Temporarily disable RLS for testing: `ALTER TABLE [table_name] DISABLE ROW LEVEL SECURITY;`
- Check that your policies match your auth logic

### Migration conflicts
- Reset database (⚠️ destroys data): `npx prisma migrate reset`
- Or manually fix: Go to SQL Editor and drop conflicting tables

---

## Next Steps

After completing this setup:

1. ✅ Verify connection: `npx prisma studio` (should open database GUI)
2. ✅ Run development server: `npm run dev`
3. ✅ Test story creation flow
4. ✅ Test file uploads to storage
5. ✅ Set up production deployment (Vercel recommended)

---

## Resources

- **Supabase Docs**: https://supabase.com/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **PostGIS Docs**: https://postgis.net/docs/
- **Supabase Discord**: https://discord.supabase.com/

---

**Need help?** Open an issue on GitHub or check the Supabase community forum.

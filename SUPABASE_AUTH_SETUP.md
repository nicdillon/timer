# Supabase Authentication and RLS Setup Guide

This guide will walk you through setting up Supabase authentication and Row Level Security (RLS) for the Timer application.

## 1. Supabase Project Setup

1. Create a new Supabase project at [https://app.supabase.io](https://app.supabase.io)
2. Note your project URL and anon key from the API settings page

## 2. Environment Variables

Add the following environment variables to your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 3. Database Setup

### Create the focus_sessions Table

Run the following SQL in the Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS focus_sessions (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  category TEXT NOT NULL,
  duration INTEGER NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add an index on user_id for better performance
CREATE INDEX IF NOT EXISTS focus_sessions_user_id_idx ON focus_sessions(user_id);
```

### Enable Row Level Security

Run the SQL commands in the `supabase_rls_policies.sql` file to:

1. Enable Row Level Security on the focus_sessions table
2. Create policies for SELECT, INSERT, UPDATE, and DELETE operations
3. Add necessary indexes

## 4. Authentication Setup

### Email/Password Authentication

1. In the Supabase dashboard, go to Authentication > Settings
2. Enable Email auth provider
3. Configure email templates if desired

### Google OAuth Setup

1. Create a Google OAuth application in the [Google Cloud Console](https://console.cloud.google.com/)
2. Configure the OAuth consent screen
3. Create OAuth client ID credentials
4. Add authorized redirect URIs:
   - `https://your-project-url/auth/v1/callback`
5. In the Supabase dashboard, go to Authentication > Providers
6. Enable Google provider and add your Client ID and Secret

## 5. Testing Authentication

1. Run the application locally with `npm run dev`
2. Navigate to `/auth/signup` to create a new account
3. Try logging in with the created account
4. Test Google sign-in

## 6. Migrating Existing Data

If you have existing data from Auth0, you'll need to:

1. Export user data from Auth0
2. Create corresponding users in Supabase
3. Update the `user_id` field in your focus_sessions table to match the new Supabase user IDs

## 7. Troubleshooting

### Common Issues

- **CORS errors**: Ensure your site URL is added to the allowed list in Supabase
- **Redirect issues**: Check that your redirect URLs are correctly configured
- **RLS policy errors**: Verify that your policies are correctly implemented
- **Type mismatch errors**: Ensure proper type casting between UUID and string types

### Type Handling

The `user_id` column in the `focus_sessions` table should be a UUID type to match Supabase's auth.users table. However, if you're migrating from Auth0, your existing data might have string user IDs.

There are two approaches to handle this:

1. **Convert existing data**: Use the provided SQL script to convert string user_id values to UUID type
2. **Type casting in policies**: The RLS policies use `auth.uid()::text = user_id` to handle string comparison

### Debugging

- Check browser console for errors
- Examine network requests to Supabase endpoints
- Test RLS policies directly in the Supabase SQL editor

## 8. Additional Resources

- [Supabase Auth Documentation](https://supabase.io/docs/guides/auth)
- [Supabase RLS Documentation](https://supabase.io/docs/guides/auth/row-level-security)
- [Next.js with Supabase Auth](https://supabase.io/docs/guides/auth/auth-helpers/nextjs)

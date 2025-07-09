# Supabase Setup for Wedding Website

This document outlines the steps to set up a Supabase project for the wedding website's RSVP functionality.

## 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign up or log in
2. Click "New Project" and fill in the details:
   - Name: `sarah-michael-wedding`
   - Database Password: (create a secure password)
   - Region: (choose the region closest to your target audience)
   - Pricing Plan: Free tier (or select a paid plan if needed)
3. Click "Create New Project" and wait for the project to be created

## 2. Database Schema

Once your project is created, you'll need to set up the database schema. You can do this through the Supabase dashboard using the SQL editor.

### Create Tables

Run the following SQL to create the necessary tables:

```sql
-- Create RSVP table
CREATE TABLE rsvps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  attending BOOLEAN NOT NULL,
  guest_count INTEGER,
  meal_preference TEXT,
  dietary_restrictions TEXT,
  song_requests TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Guests table for additional guests
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rsvp_id UUID NOT NULL REFERENCES rsvps(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  meal_preference TEXT,
  dietary_restrictions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a view to get all RSVPs with their guests
CREATE VIEW rsvp_details AS
SELECT 
  r.id,
  r.first_name,
  r.last_name,
  r.email,
  r.phone,
  r.attending,
  r.guest_count,
  r.meal_preference,
  r.dietary_restrictions,
  r.song_requests,
  r.notes,
  r.created_at,
  r.updated_at,
  (
    SELECT json_agg(
      json_build_object(
        'id', g.id,
        'first_name', g.first_name,
        'last_name', g.last_name,
        'meal_preference', g.meal_preference,
        'dietary_restrictions', g.dietary_restrictions
      )
    )
    FROM guests g
    WHERE g.rsvp_id = r.id
  ) AS guests
FROM rsvps r;
```

## 3. Set Up Row Level Security (RLS)

To secure your data, enable Row Level Security and create policies:

```sql
-- Enable RLS on tables
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

-- Create policies for the rsvps table
CREATE POLICY "Allow anonymous insert to rsvps" 
ON rsvps FOR INSERT 
TO anon 
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to select all rsvps" 
ON rsvps FOR SELECT 
TO authenticated 
USING (true);

-- Create policies for the guests table
CREATE POLICY "Allow anonymous insert to guests" 
ON guests FOR INSERT 
TO anon 
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to select all guests" 
ON guests FOR SELECT 
TO authenticated 
USING (true);
```

## 4. Create API Keys and Configure Client

1. In the Supabase dashboard, go to "Settings" > "API"
2. Copy the "URL" and "anon public" key
3. Update the `js/supabase.js` file with these values:

```javascript
// Replace these with your Supabase project URL and anon key
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

## 5. Set Up Email Notifications (Optional)

To send email confirmations when someone RSVPs:

1. Create a database function and trigger:

```sql
-- Function to send email notification
CREATE OR REPLACE FUNCTION send_rsvp_notification()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM http_post(
    'https://api.sendgrid.com/v3/mail/send',
    '{"personalizations":[{"to":[{"email":"your-email@example.com"}]}],"from":{"email":"noreply@yourdomain.com"},"subject":"New Wedding RSVP","content":[{"type":"text/plain","value":"You have a new RSVP from ' || NEW.first_name || ' ' || NEW.last_name || '."}]}',
    '{"Authorization":"Bearer YOUR_SENDGRID_API_KEY","Content-Type":"application/json"}'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on new RSVP
CREATE TRIGGER on_rsvp_created
  AFTER INSERT ON rsvps
  FOR EACH ROW EXECUTE PROCEDURE send_rsvp_notification();
```

2. Replace `your-email@example.com` with your email address
3. Replace `YOUR_SENDGRID_API_KEY` with your SendGrid API key

## 6. Testing the Setup

To test your Supabase setup:

1. Use the Supabase dashboard to manually insert a test RSVP
2. Verify that the data is stored correctly
3. Test the RSVP form on your website to ensure it connects properly

## 7. Backup and Maintenance

- Regularly backup your Supabase database
- Monitor your usage to stay within the free tier limits or upgrade as needed
- Check for any security updates or recommendations from Supabase

## 8. Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
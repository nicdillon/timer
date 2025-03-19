import { NextResponse } from 'next/server';
import { createClient } from '../../lib/supabaseServer';
import { FocusSession } from '../../lib/dataTypes';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Get the current user's session
    const user = await supabase.auth.getUser();
    
    // Return empty array for anonymous users
    if (!user) {
      return NextResponse.json([]);
    }
    
    // With RLS enabled, this will automatically filter to only the user's sessions
    const { data, error } = await supabase
      .from('focus_sessions')
      .select('*')
      .order('start_time', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (err) {
    console.error('Error fetching sessions:', err);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    
    // Get the current user's session
    const user = await supabase.auth.getUser();
    
    console.log('Session in POST route:', user ? 'Session exists' : 'No session');
    
    // Only authenticated users can create sessions
    if (!user) {
      console.log('No authenticated user found');
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    const focusSession: FocusSession = await request.json();
    
    // Ensure the user_id matches the authenticated user's ID
    if (focusSession.user_id !== user.data.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    // Convert start_time to a Date if it's a string
    const startTime = new Date(focusSession.start_time);
    
    // Log the user ID for debugging
    console.log('User ID from session:', user.data.user.id);
    console.log('User ID from focus session:', focusSession.user_id);
    
    const { error } = await supabase.from('focus_sessions').insert({
      user_id: user.data.user.id, // Use the authenticated user's ID as text
      category: focusSession.category,
      duration: typeof focusSession.duration === 'number' 
        ? Math.floor(focusSession.duration) 
        : parseInt(String(focusSession.duration)),
      start_time: startTime.toISOString(),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ message: 'Focus session saved successfully' }, { status: 200 });
  } catch (err: unknown) {
    console.error('Error saving session:', err);
    if (err instanceof Error) {
      return NextResponse.json({ error: err.toString() }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}

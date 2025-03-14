import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { createClient } from '../../lib/supabaseServer';

export interface FocusSession {
  id: number | null;
  user_id: string;     // The authenticated user's ID
  category: string;    // The focus session's category
  duration: number;    // Duration of the session (in seconds or minutes)
  start_time: Date;    // Timestamp when the session started
}

export async function GET() {
  // Retrieve the session on the server.
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const supabase = await createClient();

  // Fetch focus sessions from Supabase for the authenticated user.
  const { data, error } = await supabase
    .from('focus_sessions')
    .select('*')
    .eq('user_id', session.user.sub)
    .order('start_time', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session: FocusSession = await request.json();
    const supabase = await createClient();
    // Convert start_time to a Date if it's a string
    const startTime = new Date(session.start_time);
    const { error } = await supabase.from('focus_sessions').insert({
      user_id: session.user_id,
      category: session.category,
      duration: session.duration.toFixed(0),
      start_time: startTime.toISOString(),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'Focus session saved successfully' }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.toString() }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}
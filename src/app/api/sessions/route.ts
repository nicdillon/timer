import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { supabase } from '../../lib/supabaseClient';

export async function GET() {
  // Retrieve the session on the server.
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

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
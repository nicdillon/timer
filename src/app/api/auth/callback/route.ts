import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabaseServer';

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    
    if (!code) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    
    const supabase = await createClient();
    
    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code);
    
    // Redirect to the timer page after successful authentication
    return NextResponse.redirect(new URL('/timer', request.url));
  } catch (error) {
    console.error('Auth callback error:', error);
    // Redirect to login page on error
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}

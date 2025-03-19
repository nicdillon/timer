import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabaseServer';

export async function POST() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    
    return NextResponse.json({ message: 'Signed out successfully' });
  } catch (error) {
    console.error('Sign out error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

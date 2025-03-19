import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabaseServer';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    return NextResponse.json({ session });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

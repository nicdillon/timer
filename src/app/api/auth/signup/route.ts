import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabaseServer';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${request.nextUrl.origin}/api/auth/callback`,
      },
    });

    if (error) {
      console.error('Signup error:', error);
      
      // For development purposes, we'll return a more user-friendly message
      // In production, you would want to handle different error types differently
      if (error.message.includes('invalid email')) {
        return NextResponse.json(
          { error: 'Please use a valid email address that you can access for verification.' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      user: data.user,
      message: data.user?.identities?.length === 0 
        ? 'Email already registered. Please sign in instead.'
        : 'Check your email for the confirmation link'
    });
  } catch (error) {
    console.error('Sign up error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

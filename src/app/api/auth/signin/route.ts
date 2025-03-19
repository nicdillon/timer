// import { NextRequest, NextResponse } from 'next/server';
// import { createClient } from '../../../lib/supabaseServer';
// import {  } from '@supabase/auth-helpers-nextjs'

// export async function POST(request: NextRequest) {
//   try {
//     const { email, password } = await request.json();
    
//     if (!email || !password) {
//       return NextResponse.json(
//         { error: 'Email and password are required' },
//         { status: 400 }
//       );
//     }

//     const supabase = await createClient();
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//     if (error) {
//       return NextResponse.json(
//         { error: error.message },
//         { status: 400 }
//       );
//     }

//     // Create a response with the user and session data
//     const response = NextResponse.json({ 
//       user: data.user,
//       session: data.session
//     });

//     // Set cookies on the response
//     const cookieOptions = {
//       path: '/',
//       maxAge: 60 * 60 * 24 * 7, // 1 week
//       sameSite: 'lax' as const,
//       secure: process.env.NODE_ENV === 'production',
//     };

//     // Set the access token cookie
//     response.cookies.set(
//       'sb-access-token',
//       data.session?.access_token || '',
//       cookieOptions
//     );

//     // Set the refresh token cookie
//     response.cookies.set(
//       'sb-refresh-token',
//       data.session?.refresh_token || '',
//       cookieOptions
//     );

//     // Log the session for debugging
//     console.log('Session after signin:', data.session);
    
//     return response;
//   } catch (error) {
//     console.error('Sign in error:', error);
//     return NextResponse.json(
//       { error: 'An unexpected error occurred' },
//       { status: 500 }
//     );
//   }
// }

import React from 'react';
import { supabase } from '../lib/supabaseClient';
import { getSession } from '@auth0/nextjs-auth0';

// Define the TypeScript interface for a focus session record
interface FocusSession {
  id?: number;          // Optional ID (if your table has a primary key)
  user_id: string;      // Authenticated user's ID
  category: string;     // Focus session's category
  duration: number;     // Duration of the session (in seconds or minutes)
  start_time: string;   // Timestamp when the session started (stored as an ISO string)
}

export default async function AnalyticsPage() {
  // Retrieve the session (and thus the authenticated user) on the server
  const session = await getSession();

  // If there is no authenticated user, render a preview with test data to entice sign-in
  if (!session?.user) {
    // Sample test data
    const testSessions: FocusSession[] = [
      {
        id: 1,
        user_id: 'test',
        category: 'Work',
        duration: 60,
        start_time: new Date().toISOString(),
      },
      {
        id: 2,
        user_id: 'test',
        category: 'Study',
        duration: 45,
        start_time: new Date().toISOString(),
      },
      {
        id: 3,
        user_id: 'test',
        category: 'Exercise',
        duration: 30,
        start_time: new Date().toISOString(),
      },
    ];

    return (
      <main className="p-5">
        <h1 className="text-3xl font-bold mb-4">Your Focus Sessions Preview</h1>
        <p className="mb-4">
          Sign in to see your personalized focus sessions analytics.
        </p>
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Category</th>
              <th className="border p-2">Duration (mins)</th>
              <th className="border p-2">Start Time</th>
            </tr>
          </thead>
          <tbody>
            {testSessions.map((session) => (
              <tr key={session.id ?? session.start_time}>
                <td className="border p-2">{session.category}</td>
                <td className="border p-2">{session.duration}</td>
                <td className="border p-2">
                  {new Date(session.start_time).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    );
  }

  // Use the authenticated user's ID (via session.user.sub) to fetch their focus sessions
  const { data: sessions, error } = await supabase
    .from('focus_sessions')
    .select('*')
    .eq('user_id', session.user.sub)
    .order('start_time', { ascending: false });

  // If there's an error fetching the data, log it and inform the user
  if (error) {
    console.error('Error fetching sessions:', error);
    return (
      <main className="p-5">
        <h1 className="text-3xl font-bold mb-4">Your Focus Sessions</h1>
        <p className="text-red-500">Error fetching sessions.</p>
      </main>
    );
  }

  return (
    <main className="p-5">
      <h1 className="text-3xl font-bold mb-4">Your Focus Sessions</h1>
      {sessions && sessions.length > 0 ? (
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Category</th>
              <th className="border p-2">Duration</th>
              <th className="border p-2">Start Time</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session: FocusSession) => (
              <tr key={session.id ?? session.start_time}>
                <td className="border p-2">{session.category}</td>
                <td className="border p-2">{session.duration}</td>
                <td className="border p-2">
                  {new Date(session.start_time).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No focus sessions found.</p>
      )}
    </main>
  );
}
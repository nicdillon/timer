'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { supabase } from '../lib/supabaseClient';

// Define the TypeScript interface for a focus session record
interface FocusSession {
  id?: number;          // Optional ID (if your table has a primary key)
  user_id: string;      // Authenticated user's ID
  category: string;     // Focus session's category
  duration: number;     // Duration of the session (in seconds or minutes)
  start_time: string;   // Timestamp when the session started (stored as ISO string)
}

export default function AnalyticsPage() {
  // Local state to store focus sessions data, loading status, and any errors
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get the current authenticated user from Auth0
  const { user } = useUser();

  // useEffect hook to fetch focus sessions data when the component mounts or when the user changes
  useEffect(() => {
    // If the user is not authenticated, no need to fetch sessions; update state accordingly.
    if (!user) {
      setLoading(false);
      setError('User not authenticated.');
      return;
    }

    // Define an async function to fetch session data from Supabase
    const fetchSessions = async () => {
      setLoading(true);
      // Query the 'focus_sessions' table for records matching the current user's ID
      const { data, error } = await supabase
        .from('focus_sessions')
        .select('*')
        .eq('user_id', user.sub)
        .order('start_time', { ascending: false });

      if (error) {
        // Log and update error state if fetching fails
        console.error('Error fetching sessions:', error);
        setError('Error fetching sessions.');
      } else {
        // Update state with the retrieved sessions data
        setSessions(data || []);
      }
      setLoading(false);
    };

    // Call the async function to fetch the sessions
    fetchSessions();
  }, [user]);

  return (
    <main className="p-5">
      <h1 className="text-3xl font-bold mb-4">Your Focus Sessions</h1>

      {/* Display loading state */}
      {loading && <p>Loading sessions...</p>}

      {/* Display error if any */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Display focus sessions data in a table if available */}
      {!loading && !error && sessions.length > 0 && (
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Category</th>
              <th className="border p-2">Duration</th>
              <th className="border p-2">Start Time</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
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
      )}

      {!loading && !error && sessions.length === 0 && (
        <p>No focus sessions found.</p>
      )}
    </main>
  );
}
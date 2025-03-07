import { supabase } from './supabaseClient';

export interface FocusSession {
  user_id: string;     // The authenticated user's ID
  category: string;    // The focus session's category
  duration: number;    // Duration of the session (in seconds or minutes)
  start_time: Date;    // Timestamp when the session started
}

/**
 * Saves a focus session record to the 'focus_sessions' table using Supabase.
 * @param session - The focus session data.
 * @returns The inserted data if successful, or null if an error occurred.
 */
export async function saveFocusSession(session: FocusSession): Promise<void> {
  try {
    const { data, error } = await supabase
      .from('focus_sessions')
      .insert({
        user_id: session.user_id,
        category: session.category,
        duration: session.duration,
        start_time: session.start_time.toISOString(), // Convert Date to ISO string
      });

    if (error) {
      console.error('Error saving focus session:', error);
      return;
    }
    console.log('Focus session saved successfully:', data);
    return;
  } catch (err) {
    console.error('Unexpected error saving focus session:', err);
    return;
  }
}
export interface FocusSession {
  id: number | null;
  user_id: string;     // The authenticated user's ID
  category: string;    // The focus session's category
  duration: number;    // Duration of the session (in seconds or minutes)
  start_time: Date;    // Timestamp when the session started
}
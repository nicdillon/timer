import { FocusSession } from './dataTypes';

// Generate demo data for anonymous users
export const generateDemoSessions = (): FocusSession[] => {
  const now = new Date();
  const demoSessions: FocusSession[] = [];
  
  // Categories for demo data
  const categories = ['Work', 'Study', 'Exercise', 'Reading', 'Meditation'];
  
  // Generate sessions for the last 14 days
  for (let i = 0; i < 20; i++) {
    const daysAgo = Math.floor(Math.random() * 14);
    const hoursAgo = Math.floor(Math.random() * 24);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    date.setHours(date.getHours() - hoursAgo);
    
    const category = categories[Math.floor(Math.random() * categories.length)];
    const duration = Math.floor(Math.random() * 50) + 10; // 10-60 minutes
    
    demoSessions.push({
      id: i + 1,
      user_id: 'demo-user',
      category,
      duration,
      start_time: date,
    });
  }
  
  // Sort by date (newest first)
  return demoSessions.sort((a, b) => 
    b.start_time.getTime() - a.start_time.getTime()
  );
};

// Export a static set of demo sessions
export const DEMO_SESSIONS = generateDemoSessions();

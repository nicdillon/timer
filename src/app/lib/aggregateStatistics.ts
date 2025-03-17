import { FocusSession } from './dataTypes';

export function aggregateTimeByCategory(sessions: FocusSession[]) {
  const aggregated = sessions.reduce((acc, session) => {
    acc[session.category] = (acc[session.category] || 0) + session.duration;
    return acc;
  }, {} as Record<string, number>);
  return Object.entries(aggregated).map(([label, value], index) => ({
    id: index,
    label,
    value,
  }));
}

export function aggregateSessionsByCategory(sessions: FocusSession[]) {
    const aggregated = sessions.reduce((acc, session) => {
        acc[session.category] = (acc[session.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      return Object.entries(aggregated).map(([label, value], index) => ({
        id: index,
        label,
        value,
      }));
}

export function aggregateByDay(sessions: FocusSession[]) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const aggregated = sessions.reduce((acc, session) => {
    const day = days[new Date(session.start_time).getDay()];
    acc[day] = (acc[day] || 0) + session.duration;
    return acc;
  }, {} as Record<string, number>);
  return Object.entries(aggregated).map(([label, value], index) => ({
    id: index,
    label,
    value,
  }));
}

export function aggregateByDuration(sessions: FocusSession[]) {
  const aggregated = sessions.reduce((acc, session) => {
    let bin = '';
    if (session.duration < 30) bin = 'Short (<30)';
    else if (session.duration < 60) bin = 'Medium (30-60)';
    else bin = 'Long (>60)';
    acc[bin] = (acc[bin] || 0) + session.duration;
    return acc;
  }, {} as Record<string, number>);
  return Object.entries(aggregated).map(([label, value], index) => ({
    id: index,
    label,
    value,
  }));
}

export function aggregateLast7Days(sessions: FocusSession[]) {
    // day to day of week map
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
    const last7Days = Array.from({ length: 7 }, (_, i) => {
       // return total focus duration for each day
        const day = new Date();
        day.setDate(day.getDate() - i);
        const dayKey = days[day.getDay()];
        const totalDuration = sessions
          .filter((session) => new Date(session.start_time).getDay() === day.getDay())
          .reduce((sum, session) => sum + session.duration, 0);
        return {
            date: dayKey,
            value: totalDuration,
        };
    })

    return last7Days.reverse();
}
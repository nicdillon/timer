'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  CircularProgress,
} from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';

// Define the TypeScript interface for a focus session record.
interface FocusSession {
  id?: number;
  user_id: string;
  category: string;
  duration: number;
  start_time: string;
}

export default function AnalyticsPage() {
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Pagination state.
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // New state for responsive chart width
  const [chartWidth, setChartWidth] = useState(400);

  useEffect(() => {
    async function fetchSessions() {
      try {
        setIsLoading(true);
        const res = await fetch('/api/sessions');
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Failed to fetch sessions');
        }
        const data = await res.json();
        setSessions(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSessions();
  }, []);

  useEffect(() => {
    const updateChartWidth = () => {
      // Use 90% of the window width (minus 40px for padding) on small screens
      const newWidth = window.innerWidth < 600 ? window.innerWidth - 40 : 400;
      setChartWidth(newWidth);
    };

    updateChartWidth();
    window.addEventListener('resize', updateChartWidth);
    return () => window.removeEventListener('resize', updateChartWidth);
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-gradient-to-r from-purple-400 via-pink-400 to-red-400">
        <h1 className="text-3xl font-bold mb-4 text-white">Your Focus Sessions</h1>
        <CircularProgress color="inherit" />
        <p className="text-lg text-white mt-4">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="p-5 flex flex-col items-center justify-center h-screen w-screen">
        <h1 className="text-3xl font-bold mb-4">Your Focus Sessions</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );

  // Aggregate data for the charts

  // Focus time by category
  const aggregatedByCategory = sessions.reduce((acc, session) => {
    acc[session.category] = (acc[session.category] || 0) + session.duration;
    return acc;
  }, {} as Record<string, number>);
  const dataByCategory = Object.entries(aggregatedByCategory).map(([label, value], index) => ({
    id: index,
    label,
    value,
  }));

  // Focus time by day of week
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const aggregatedByDay = sessions.reduce((acc, session) => {
    const day = days[new Date(session.start_time).getDay()];
    acc[day] = (acc[day] || 0) + session.duration;
    return acc;
  }, {} as Record<string, number>);
  const dataByDay = Object.entries(aggregatedByDay).map(([label, value], index) => ({
    id: index,
    label,
    value,
  }));

  // Focus time by duration bins:
  // Bins defined as: "Short (<30)", "Medium (30-60)", "Long (>60)"
  const aggregatedByDuration = sessions.reduce((acc, session) => {
    let bin = '';
    if (session.duration < 30) bin = 'Short (<30)';
    else if (session.duration < 60) bin = 'Medium (30-60)';
    else bin = 'Long (>60)';
    acc[bin] = (acc[bin] || 0) + session.duration;
    return acc;
  }, {} as Record<string, number>);
  const dataByDuration = Object.entries(aggregatedByDuration).map(([label, value], index) => ({
    id: index,
    label,
    value,
  }));

  return (
    <div className="p-4 pt-20 flex flex-col items-center justify-center min-h-screen w-auto max-w-screen">
      <h1 className="text-3xl font-bold mb-4">Your Focus Sessions</h1>

      {/* Charts section */}
      <div className="flex flex-wrap justify-center gap-5 mb-5">
        <Paper className="p-3">
          <h2 className="text-xl text-center mb-2">Focus Time by Category</h2>
          <PieChart
            series={[
              {
                data: dataByCategory,
                innerRadius: 30,
                outerRadius: 100,
                paddingAngle: 5,
                cornerRadius: 5,
                arcLabel: (item) => `${item.label}: ${item.value}`,
                arcLabelMinAngle: 30,
              },
            ]}
            width={chartWidth}
            height={200}
          />
        </Paper>
        <Paper className="p-3">
          <h2 className="text-xl text-center mb-2">Focus Time by Day of Week</h2>
          <PieChart
            series={[
              {
                data: dataByDay,
                innerRadius: 30,
                outerRadius: 100,
                paddingAngle: 5,
                cornerRadius: 5,
                arcLabel: (item) => `${item.label}: ${item.value}`,
                arcLabelMinAngle: 30,
              },
            ]}
            width={chartWidth}
            height={200}
          />
        </Paper>
        <Paper className="p-3">
          <h2 className="text-xl text-center mb-2">Focus Time by Duration</h2>
          <PieChart
            series={[
              {
                data: dataByDuration,
                innerRadius: 30,
                outerRadius: 100,
                paddingAngle: 5,
                cornerRadius: 5,
                arcLabel: (item) => `${item.label}: ${item.value}`,
                arcLabelMinAngle: 30,
              },
            ]}
            width={chartWidth}
            height={200}
          />
        </Paper>
      </div>

      {/* The table displaying individual focus sessions */}
      {sessions && sessions.length > 0 ? (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer className="bg-white bg-opacity-30 backdrop-blur-md shadow-lg w-full">
            <Table stickyHeader aria-label="focus sessions table">
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Start Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sessions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((session: FocusSession) => (
                  <TableRow hover key={session.id ?? session.start_time}>
                    <TableCell>{session.category}</TableCell>
                    <TableCell>{session.duration}</TableCell>
                    <TableCell>{new Date(session.start_time).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={sessions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      ) : (
        <p>No focus sessions found.</p>
      )}
    </div>
  );
}
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
import { PieChart, pieArcLabelClasses, pieArcClasses } from '@mui/x-charts/PieChart';
import { BarChart, barLabelClasses } from '@mui/x-charts/BarChart';
import { FocusSession } from '../lib/dataTypes';
import { aggregateByCategory, aggregateByDay, aggregateByDuration, aggregateLast7Days } from '../lib/aggregateStatistics';

export default function AnalyticsPage() {
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTableExpanded, setIsTableExpanded] = useState<boolean>(false);
  const dataByCategory = aggregateByCategory(sessions);
  const dataByDay = aggregateByDay(sessions);
  const dataByDuration = aggregateByDuration(sessions);
  const dataLast7Days = aggregateLast7Days(sessions);

  // Pagination state.
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Responsive chart width.
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
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchSessions();
  }, []);

  useEffect(() => {
    const updateChartWidth = () => {
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

  function handleExpandTable(): void {
    setIsTableExpanded(prev => !prev);
  }

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen">
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

  return (
    <div className="p-4 pt-20 flex flex-col items-center justify-center min-h-screen w-auto max-w-screen">
      <h1 className="text-3xl font-bold mb-4">Your Focus Sessions</h1>
      {/* Charts section */}
      {sessions && sessions.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-5 mb-5">
          <Paper className="p-3 bg-none">
            <h2 className="text-xl text-center mb-2">Total Focus Time by Category</h2>
            <PieChart
              series={[
                {
                  data: dataByCategory,
                  innerRadius: 30,
                  outerRadius: 100,
                  paddingAngle: 2,
                  cornerRadius: 5,
                },
              ]}
              slotProps={{
                legend: {
                  direction: 'column',
                  position: { vertical: 'middle', horizontal: 'right' },
                  padding: 0,
                  itemGap: 2,
                },
              }}
              colors={['#0D1B2A', '#1B263B', '#415A77', '#1E3A8A', '#1E40AF']}
              width={chartWidth}
              height={200}
              sx={{
                [`& .${pieArcLabelClasses.root}`]: { color: 'black', fill: 'white' },
                [`& .${pieArcClasses.root}`]: { stroke: 'none' },
              }}
            />
          </Paper>
          <Paper className="p-3">
            <h2 className="text-xl text-center mb-2">Total Focus Time by Day of Week</h2>
            <PieChart
              series={[
                {
                  data: dataByDay,
                  innerRadius: 30,
                  outerRadius: 100,
                  paddingAngle: 2,
                  cornerRadius: 5,
                },
              ]}
              slotProps={{
                legend: { direction: 'column', position: { vertical: 'middle', horizontal: 'right' }, padding: 0 },
              }}
              colors={['#0D1B2A', '#1B263B', '#415A77', '#1E3A8A', '#1E40AF']}
              width={chartWidth}
              height={200}
              sx={{
                [`& .${pieArcLabelClasses.root}`]: { color: 'white', fill: 'white' },
                [`& .${pieArcClasses.root}`]: { stroke: 'none' },
              }}
            />
          </Paper>
          <Paper className="p-3">
            <h2 className="text-xl text-center mb-2">Focus Sessions by Duration</h2>
            <PieChart
              series={[
                {
                  data: dataByDuration,
                  innerRadius: 30,
                  outerRadius: 100,
                  paddingAngle: 5,
                  cornerRadius: 5,
                },
              ]}
              slotProps={{
                legend: { direction: 'column', position: { vertical: 'middle', horizontal: 'right' }, padding: 0 },
              }}
              colors={['#0D1B2A', '#1B263B', '#415A77', '#1E3A8A', '#1E40AF']}
              width={chartWidth}
              height={200}
              sx={{
                [`& .${pieArcLabelClasses.root}`]: { color: 'white', fill: 'white' },
                [`& .${pieArcClasses.root}`]: { stroke: 'none' },
              }}
            />
          </Paper>
          {/* New MUI Sparkline Chart for Last 7 Days */}
          <Paper className="p-3">
            <h2 className="text-xl text-center mb-2">Focus Time Over Last 7 Days</h2>
            <BarChart
              dataset={dataLast7Days}
              series={[
                {
                  data: dataLast7Days.map((item) => item.value),
                },
              ]}
              xAxis={[{ scaleType: 'band', dataKey: 'date'}]}
              width={chartWidth}
              colors={['#0D1B2A', '#1B263B', '#415A77', '#1E3A8A', '#1E40AF']}
              height={200}
              sx={{[`& .${barLabelClasses.root}`]: { color: 'black', fill: 'black' },}}
            />
          </Paper>
        </div>
      ) : (
        <p className="text-lg text-gray-700">No focus sessions found.</p>
      )}
      {/* The table displaying individual focus sessions */}
      {sessions && sessions.length > 0 && !isTableExpanded && (
        <div>
          <button onClick={handleExpandTable} className="bg-cyan-500 text-white px-4 py-2 rounded">
            Show All Focus Sessions
          </button>
        </div>
      )}
      {sessions && sessions.length > 0 && isTableExpanded && (
        <div className="flex flex-col width-full gap-2 justify-center items-center">
          <button onClick={handleExpandTable} className="border-2 border-cyan-700 bg-gray-700 bg-opacity-30 text-white px-4 py-2 rounded w-auto shadow-lg">
            Hide All Focus Sessions
          </button>
          <Paper className="shadow-lg" sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer className="bg-white bg-opacity-30 backdrop-blur-md w-full">
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
                    <TableRow hover key={session.id}>
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
        </div>
      )}
    </div>
  );
}
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { DEMO_SESSIONS } from "../lib/demoData";
import LoginCTA from "../components/LoginCTA";
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
} from "@mui/material";
import {
  PieChart,
  pieArcLabelClasses,
  pieArcClasses,
} from "@mui/x-charts/PieChart";
import { BarChart, barLabelClasses } from "@mui/x-charts/BarChart";
import { FocusSession } from "../lib/dataTypes";
import {
  aggregateTimeByCategory,
  aggregateByDay,
  aggregateByDuration,
  aggregateLast7Days,
  aggregateSessionsByCategory,
} from "../lib/aggregateStatistics";

export default function AnalyticsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTableExpanded, setIsTableExpanded] = useState<boolean>(false);
  
  // Use demo data for anonymous users
  const displaySessions = user ? sessions : DEMO_SESSIONS;
  
  const dataByCategory = aggregateTimeByCategory(displaySessions);
  const sessionsByCategory = aggregateSessionsByCategory(displaySessions);
  const dataByDay = aggregateByDay(displaySessions);
  const dataByDuration = aggregateByDuration(displaySessions);
  const dataLast7Days = aggregateLast7Days(displaySessions);
  const totalFocusTime = calculateTotalFocusTime(displaySessions);

  // Pagination state.
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Responsive chart width.
  const [chartWidth, setChartWidth] = useState(400);
  useEffect(() => {
    async function fetchSessions() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/sessions");
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to fetch sessions");
        }
        const data = await res.json();
        setSessions(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
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
    window.addEventListener("resize", updateChartWidth);
    return () => window.removeEventListener("resize", updateChartWidth);
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function handleExpandTable(): void {
    setIsTableExpanded((prev) => !prev);
  }

  function calculateTotalFocusTime(sessions: FocusSession[]): {
    hours: number;
    minutes: number;
  } {
    let totalFocusTime = 0;
    sessions.forEach((item: FocusSession) => {
      totalFocusTime += item.duration;
    });

    return { hours: (totalFocusTime / 60) | 0, minutes: totalFocusTime % 60 };
  }

  if (isLoading || authLoading)
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-[var(--background)] md:rounded">
        <h1 className="text-3xl font-bold mb-4 text-white">
          Your Focus Sessions
        </h1>
        <CircularProgress color="inherit" />
        <p className="text-lg text-white mt-4">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="p-5 flex flex-col items-center justify-center h-full w-full bg-[var(--background)] rounded">
        <h1 className="text-3xl font-bold mb-4">Your Focus Sessions</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="p-4 flex flex-col items-center justify-start h-full w-full bg-[var(--background)] rounded">
      <div className="flex flex-row justify-between items-stretch w-full mb-6">
        <h1 className="text-6xl font-bold mb-4 w-full items-start px-4">
          Analytics
        </h1>
        <div className="flex flex-col justify-right items-end w-full">
          <h1 className="text-6xl font-bold w-full items-start text-right px-4 pr-0">
            {sessions.length}
          </h1>
          <h3 className="text-right justify-center text-gray-400 w-auto px-2">
            Total Sessions
          </h3>
        </div>
        <div className="flex flex-col justify-right items-end w-full">
          <h1 className="text-6xl font-bold w-full items-start text-right px-4 pr-0">
            {totalFocusTime.hours + "h " + totalFocusTime.minutes + "m"}
          </h1>
          <h3 className="text-left justify-center text-gray-400 w-auto px-2">
            Total Time
          </h3>
        </div>
      </div>

      {/* Show login CTA for anonymous users */}
      {!user && (
        <div className="mb-6 w-full">
          <LoginCTA message="Sign up or log in to track and save your own focus sessions. The data below is demo data." />
        </div>
      )}
      
      {/* Charts section */}
      {displaySessions && displaySessions.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-2 mb-5">
          <Paper className="p-3 bg-none flex flex-wrap flex-col gap-4">
            <h2 className="text-2xl text-left mb-2">Focus Time</h2>
            <Paper
              elevation={5}
              className="flex flex-col items-center justify-center pt-4 pb-4"
            >
              <h3 className="text-gray-600 text-lg text-center mb-2">
                Focus Time last 7 Days
              </h3>
              <BarChart
                dataset={dataLast7Days}
                series={[
                  {
                    data: dataLast7Days.map((item) => item.value),
                  },
                ]}
                xAxis={[{ scaleType: "band", dataKey: "date" }]}
                width={chartWidth}
                colors={["#0D1B2A", "#1B263B", "#415A77", "#1E3A8A", "#1E40AF"]}
                height={200}
                sx={{
                  [`& .${barLabelClasses.root}`]: {
                    color: "black",
                    fill: "black",
                  },
                }}
              />
            </Paper>
            <Paper
              elevation={5}
              className="flex flex-col items-center justify-center pt-4 pb-4"
            >
              <h3 className="text-gray-600 text-lg text-center mb-2">
                Time by Category
              </h3>
              <PieChart
                series={[
                  {
                    data: dataByCategory,
                    innerRadius: 30,
                    outerRadius: 100,
                    paddingAngle: 2,
                    cornerRadius: 2,
                  },
                ]}
                slotProps={{
                  legend: {
                    direction: "column",
                    position: { vertical: "middle", horizontal: "right" },
                    padding: 0,
                    itemGap: 2,
                  },
                }}
                colors={["#0D1B2A", "#1B263B", "#415A77", "#1E3A8A", "#1E40AF"]}
                width={chartWidth}
                height={200}
                sx={{
                  [`& .${pieArcLabelClasses.root}`]: {
                    color: "black",
                    fill: "white",
                  },
                  [`& .${pieArcClasses.root}`]: { stroke: "none" },
                }}
              />
            </Paper>
            <Paper
              elevation={5}
              className="flex flex-col items-center justify-center pt-4 pb-4"
            >
              <h3 className="text-gray-600 text-lg text-center mb-2">
                Time by Day of the Week
              </h3>
              <PieChart
                series={[
                  {
                    data: dataByDay,
                    innerRadius: 30,
                    outerRadius: 100,
                    paddingAngle: 2,
                    cornerRadius: 2,
                  },
                ]}
                slotProps={{
                  legend: {
                    direction: "column",
                    position: { vertical: "middle", horizontal: "right" },
                    padding: 0,
                  },
                }}
                colors={["#0D1B2A", "#1B263B", "#415A77", "#1E3A8A", "#1E40AF"]}
                width={chartWidth}
                height={200}
                sx={{
                  [`& .${pieArcLabelClasses.root}`]: {
                    color: "white",
                    fill: "white",
                  },
                  [`& .${pieArcClasses.root}`]: { stroke: "none" },
                }}
              />
            </Paper>
          </Paper>

          {/* <Paper className="p-3">
            
          </Paper> */}
          <Paper className="p-3 bg-none flex flex-wrap flex-col gap-4">
            <h2 className="text-2xl text-left mb-2">Sessions</h2>
            <Paper
              elevation={5}
              className="flex flex-col items-center justify-center pt-4 pb-4"
            >
              <h3 className="text-gray-600 text-lg text-center mb-2">
                Durations
              </h3>
              <PieChart
                series={[
                  {
                    data: dataByDuration,
                    innerRadius: 30,
                    outerRadius: 100,
                    paddingAngle: 2,
                    cornerRadius: 2,
                  },
                ]}
                slotProps={{
                  legend: {
                    direction: "column",
                    position: { vertical: "middle", horizontal: "right" },
                    padding: 0,
                  },
                }}
                colors={["#0D1B2A", "#1B263B", "#415A77", "#1E3A8A", "#1E40AF"]}
                width={chartWidth}
                height={200}
                sx={{
                  [`& .${pieArcLabelClasses.root}`]: {
                    color: "white",
                    fill: "white",
                  },
                  [`& .${pieArcClasses.root}`]: { stroke: "none" },
                }}
              />
            </Paper>
            <Paper
              elevation={5}
              className="flex flex-col items-center justify-center pt-4 pb-4"
            >
              <h3 className="text-gray-600 text-lg text-center mb-2">
                Categories
              </h3>
              <PieChart
                series={[
                  {
                    data: sessionsByCategory,
                    innerRadius: 30,
                    outerRadius: 100,
                    paddingAngle: 2,
                    cornerRadius: 2,
                  },
                ]}
                slotProps={{
                  legend: {
                    direction: "column",
                    position: { vertical: "middle", horizontal: "right" },
                    padding: 0,
                  },
                }}
                colors={["#0D1B2A", "#1B263B", "#415A77", "#1E3A8A", "#1E40AF"]}
                width={chartWidth}
                height={200}
                sx={{
                  [`& .${pieArcLabelClasses.root}`]: {
                    color: "black",
                    fill: "black",
                  },
                  [`& .${pieArcClasses.root}`]: { stroke: "none" },
                }}
              />
            </Paper>
          </Paper>
        </div>
      ) : (
        <p className="text-lg text-gray-700 h-full text-center justify-center">No focus sessions found.</p>
      )}
      {/* The table displaying individual focus sessions */}
      {sessions && sessions.length > 0 && !isTableExpanded && (
        <div>
          <button
            onClick={handleExpandTable}
            className="bg-[var(--accent)] text-white px-4 py-2 rounded"
          >
            Show All Focus Sessions
          </button>
        </div>
      )}
      {sessions && sessions.length > 0 && isTableExpanded && (
        <div className="flex flex-col width-full gap-2 justify-center items-center">
          <button
            onClick={handleExpandTable}
            className="border-2 border-[var(--accent)] bg-gray-700 bg-opacity-30 text-white px-4 py-2 rounded w-auto shadow-lg"
          >
            Hide All Focus Sessions
          </button>
          <Paper
            className="shadow-lg"
            sx={{ width: "100%", overflow: "hidden" }}
          >
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
                  {sessions
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((session: FocusSession) => (
                      <TableRow hover key={session.id}>
                        <TableCell>{session.category}</TableCell>
                        <TableCell>{session.duration}</TableCell>
                        <TableCell>
                          {new Date(session.start_time).toLocaleString()}
                        </TableCell>
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

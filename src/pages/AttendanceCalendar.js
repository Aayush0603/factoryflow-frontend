import React, { useEffect, useState, useMemo } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import API from "../api";   // ✅ secured API
import {
  Card,
  Typography,
  Box,
  Modal,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

function AttendanceCalendar({ dark }) {
  const [data, setData] = useState([]);
  const [records, setRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetchAttendanceHistory();
  }, []);

  const fetchAttendanceHistory = async () => {
    try {
      const res = await API.get("/api/attendance/history");

      setRecords(res.data);

      const grouped = {};
      res.data.forEach(r => {
        grouped[r.date] = (grouped[r.date] || 0) + 1;
      });

      const formatted = Object.keys(grouped).map(date => ({
        date,
        count: grouped[date]
      }));

      setData(formatted);

    } catch (error) {
      console.error("Attendance history error:", error);
    }
  };

  const dayRecords = useMemo(
    () => records.filter(r => r.date === selectedDate),
    [records, selectedDate]
  );

  return (
    <>
      <Typography
        sx={{
          fontSize: { xs: "1.3rem", md: "1.5rem" },
          fontWeight: "bold",
          mb: 2
        }}
      >
        Attendance Overview
      </Typography>

      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
          p: 2,
          overflowX: "auto",
          background: dark ? "#1e293b" : "white"
        }}
      >
        <Box sx={{ minWidth: isMobile ? 900 : "auto" }}>
          <CalendarHeatmap
            startDate={new Date(`${currentYear}-01-01`)}
            endDate={new Date(`${currentYear}-12-31`)}
            values={data}
            onClick={(value) => value && setSelectedDate(value.date)}
            classForValue={(value) => {
              if (!value) return "color-empty";
              if (value.count >= 10) return "color-scale-4";
              if (value.count >= 5) return "color-scale-3";
              if (value.count >= 2) return "color-scale-2";
              return "color-scale-1";
            }}
          />
        </Box>
      </Card>

      <Modal
        open={Boolean(selectedDate)}
        onClose={() => setSelectedDate(null)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isMobile ? "95%" : 600,
            maxHeight: "85vh",
            overflowY: "auto",
            bgcolor: dark ? "#1e293b" : "white",
            borderRadius: 3,
            boxShadow: 24,
            p: 2.5
          }}
        >
          <Typography variant="subtitle1" mb={2}>
            Attendance on {selectedDate}
          </Typography>

          {dayRecords.length === 0 && (
            <Typography color="text.secondary">
              No records found for this date.
            </Typography>
          )}

          {!isMobile && dayRecords.length > 0 && (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><b>Name</b></TableCell>
                  <TableCell><b>Check In</b></TableCell>
                  <TableCell><b>Check Out</b></TableCell>
                  <TableCell><b>Hours</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dayRecords.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell>{r.name}</TableCell>
                    <TableCell>{r.checkIn}</TableCell>
                    <TableCell>{r.checkOut || "-"}</TableCell>
                    <TableCell>{r.workHours}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {isMobile && dayRecords.length > 0 &&
            dayRecords.map((r, i) => (
              <Card
                key={i}
                sx={{
                  p: 2,
                  mb: 1.5,
                  borderRadius: 2,
                  background: dark ? "#0f172a" : "#f8fafc"
                }}
              >
                <Typography fontWeight="bold">
                  {r.name}
                </Typography>
                <Typography variant="body2">
                  Check In: {r.checkIn}
                </Typography>
                <Typography variant="body2">
                  Check Out: {r.checkOut || "-"}
                </Typography>
                <Typography variant="body2" mt={1}>
                  Hours: {r.workHours}
                </Typography>
              </Card>
            ))}
        </Box>
      </Modal>
    </>
  );
}

export default AttendanceCalendar;
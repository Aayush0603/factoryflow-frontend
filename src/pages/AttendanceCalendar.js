import React, { useEffect, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import axios from "axios";
import {
  Card,
  Typography,
  Box,
  Modal,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@mui/material";

const API = process.env.REACT_APP_API_URL;

function AttendanceCalendar() {
  const [data, setData] = useState([]);
  const [records, setRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  /* ================= FETCH ATTENDANCE HISTORY ================= */
  useEffect(() => {
    axios
      .get(`${API}/api/attendance/history`)
      .then(res => {
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
      })
      .catch(console.error);
  }, []);

  const dayRecords = records.filter(r => r.date === selectedDate);

  return (
    <Box p={4}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Attendance Overview
      </Typography>

      <Card sx={{ borderRadius: 3, boxShadow: 3, p: 3 }}>
        <CalendarHeatmap
          startDate={new Date("2026-01-01")}
          endDate={new Date("2026-12-31")}
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
      </Card>

      {/* ================= MODAL ================= */}
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
            width: 600,
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            p: 4
          }}
        >
          <Typography variant="h6" mb={2}>
            Attendance on {selectedDate}
          </Typography>

          <Table>
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
        </Box>
      </Modal>
    </Box>
  );
}

export default AttendanceCalendar;
import React, { useEffect, useState, useMemo } from "react";
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
  TableBody,
  Grid,
  useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const API = process.env.REACT_APP_API_URL;

function AttendanceCalendar() {
  const [data, setData] = useState([]);
  const [records, setRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const currentYear = new Date().getFullYear();

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

  const dayRecords = useMemo(
    () => records.filter(r => r.date === selectedDate),
    [records, selectedDate]
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography
        sx={{
          fontSize: { xs: "1.4rem", md: "1.8rem" },
          fontWeight: "bold",
          mb: 3
        }}
      >
        Attendance Overview
      </Typography>

      {/* ===== Heatmap Card ===== */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 3,
          p: 2,
          overflowX: "auto"
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

      {/* ===== Modal ===== */}
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
            width: isMobile ? "95%" : 650,
            maxHeight: "85vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            p: 3
          }}
        >
          <Typography variant="h6" mb={2}>
            Attendance on {selectedDate}
          </Typography>

          {dayRecords.length === 0 && (
            <Typography color="text.secondary">
              No records found for this date.
            </Typography>
          )}

          {/* ===== Desktop Table ===== */}
          {!isMobile && dayRecords.length > 0 && (
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
          )}

          {/* ===== Mobile Cards ===== */}
          {isMobile && dayRecords.length > 0 && (
            <Grid container spacing={2}>
              {dayRecords.map((r, i) => (
                <Grid item xs={12} key={i}>
                  <Card sx={{ p: 2, borderRadius: 2 }}>
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
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Modal>
    </Box>
  );
}

export default AttendanceCalendar;
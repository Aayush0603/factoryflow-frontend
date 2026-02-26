import React, { useEffect, useState } from "react";
import API from "../api";   // ✅ secured API
import {
  Card,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
  useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

function AttendanceHistory({ dark }) {
  const [data, setData] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await API.get("/api/attendance/history");
      setData(res.data);
    } catch (error) {
      console.error("Attendance history error:", error);
    }
  };

  return (
    <>
      <Typography
        sx={{
          fontSize: { xs: "1.3rem", md: "1.6rem" },
          fontWeight: "bold",
          mb: 2
        }}
      >
        Attendance History
      </Typography>

      {!isMobile && (
        <Card
          sx={{
            borderRadius: 3,
            p: 2,
            background: dark ? "#1e293b" : "white",
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)"
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><b>Name</b></TableCell>
                <TableCell><b>Date</b></TableCell>
                <TableCell><b>Check-In</b></TableCell>
                <TableCell><b>Check-Out</b></TableCell>
                <TableCell><b>Hours</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data.map((r, i) => (
                <TableRow key={i}>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>{r.date}</TableCell>
                  <TableCell>{r.checkIn}</TableCell>
                  <TableCell>{r.checkOut || "-"}</TableCell>
                  <TableCell>{r.workHours}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {isMobile && (
        <Grid container spacing={2}>
          {data.map((r, i) => (
            <Grid item xs={12} key={i}>
              <Card
                sx={{
                  borderRadius: 3,
                  p: 2,
                  background: dark ? "#1e293b" : "white",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.08)"
                }}
              >
                <Typography fontWeight="bold" mb={1}>
                  {r.name}
                </Typography>

                <Typography variant="body2">
                  Date: {r.date}
                </Typography>

                <Typography variant="body2">
                  Check-In: {r.checkIn}
                </Typography>

                <Typography variant="body2">
                  Check-Out: {r.checkOut || "-"}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ mt: 1, fontWeight: 500 }}
                >
                  Hours: {r.workHours}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}

export default AttendanceHistory;
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Grid,
  useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const API = process.env.REACT_APP_API_URL;

function AttendanceHistory() {
  const [data, setData] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    axios
      .get(`${API}/api/attendance/history`)
      .then(res => setData(res.data))
      .catch(console.error);
  }, []);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography
        sx={{
          fontSize: { xs: "1.4rem", md: "1.8rem" },
          fontWeight: "bold",
          mb: 3
        }}
      >
        Attendance History
      </Typography>

      {/* ================= DESKTOP TABLE ================= */}
      {!isMobile && (
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Check-In</TableCell>
                  <TableCell>Check-Out</TableCell>
                  <TableCell>Hours</TableCell>
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
          </CardContent>
        </Card>
      )}

      {/* ================= MOBILE CARD VIEW ================= */}
      {isMobile && (
        <Grid container spacing={2}>
          {data.map((r, i) => (
            <Grid item xs={12} key={i}>
              <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                  <Typography fontWeight="bold" mb={1}>
                    {r.name}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Date: {r.date}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Check-In: {r.checkIn}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Check-Out: {r.checkOut || "-"}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ mt: 1, fontWeight: 500 }}
                  >
                    Hours Worked: {r.workHours}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default AttendanceHistory;
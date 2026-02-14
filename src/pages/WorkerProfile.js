import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { useParams } from "react-router-dom";

const API = process.env.REACT_APP_API_URL;

function WorkerProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    axios
      .get(`${API}/api/workers/profile/${id}`)
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, [id]);

  if (!data) {
    return (
      <Typography sx={{ p: 3 }}>
        Loading profile...
      </Typography>
    );
  }

  const { worker, totalDaysWorked, totalHoursWorked, attendance } = data;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1100, mx: "auto" }}>

      {/* ===== Profile Card ===== */}
      <Card sx={{ mb: 4, boxShadow: 4, borderRadius: 3 }}>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "center" : "center",
            gap: 3,
            textAlign: isMobile ? "center" : "left"
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: "#3b82f6",
              fontSize: 32
            }}
          >
            {worker.name.charAt(0)}
          </Avatar>

          <Box>
            <Typography variant="h5" fontWeight="bold">
              {worker.name}
            </Typography>
            <Typography color="text.secondary">
              Role: {worker.role}
            </Typography>
            <Typography color="text.secondary">
              Salary Type: {worker.salaryType}
            </Typography>
            <Typography color="text.secondary">
              Salary: ₹ {worker.salaryAmount}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* ===== Stats Cards ===== */}
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Total Days Worked
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {totalDaysWorked}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Total Hours Worked
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {totalHoursWorked}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ===== Attendance History ===== */}
      <Card sx={{ boxShadow: 4, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Attendance History
          </Typography>

          {/* Desktop Table */}
          {!isMobile && (
            <Paper sx={{ overflowX: "auto" }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: "#f1f5f9" }}>
                    <TableCell><b>Date</b></TableCell>
                    <TableCell><b>Check-In</b></TableCell>
                    <TableCell><b>Check-Out</b></TableCell>
                    <TableCell><b>Hours</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendance.map((a, i) => (
                    <TableRow key={i}>
                      <TableCell>{a.date}</TableCell>
                      <TableCell>{a.checkIn}</TableCell>
                      <TableCell>{a.checkOut || "-"}</TableCell>
                      <TableCell>{a.workHours}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}

          {/* Mobile Card View */}
          {isMobile && (
            <Grid container spacing={2}>
              {attendance.map((a, i) => (
                <Grid item xs={12} key={i}>
                  <Card sx={{ p: 2, borderRadius: 2 }}>
                    <Typography fontWeight="bold">
                      {a.date}
                    </Typography>
                    <Typography variant="body2">
                      Check-In: {a.checkIn}
                    </Typography>
                    <Typography variant="body2">
                      Check-Out: {a.checkOut || "-"}
                    </Typography>
                    <Typography variant="body2" mt={1}>
                      Hours: {a.workHours}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

        </CardContent>
      </Card>

    </Box>
  );
}

export default WorkerProfile;
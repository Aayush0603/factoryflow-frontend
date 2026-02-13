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
  Paper
} from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";

function WorkerProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/worker-profile/${id}`)
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, [id]);

  if (!data) return <Typography sx={{ p: 3 }}>Loading profile...</Typography>;

  const { worker, totalDaysWorked, totalHoursWorked, attendance } = data;

  return (
    <Box p={4} maxWidth="1100px" margin="auto">

      {/* Profile Card */}
      <Card sx={{ mb: 4, boxShadow: 4, borderRadius: 3 }}>
        <CardContent sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: "#3b82f6", fontSize: 32 }}>
            {worker.name.charAt(0)}
          </Avatar>

          <Box>
            <Typography variant="h5" fontWeight="bold">{worker.name}</Typography>
            <Typography color="text.secondary">Role: {worker.role}</Typography>
            <Typography color="text.secondary">Salary Type: {worker.salaryType}</Typography>
            <Typography color="text.secondary">Salary: ₹ {worker.salaryAmount}</Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
       <Grid size={{ xs: 12, md: 4 }}>
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

        <Grid size={{ xs: 12, md: 4 }}>
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

      {/* Attendance Table */}
      <Card sx={{ boxShadow: 4, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Attendance History
          </Typography>

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

        </CardContent>
      </Card>

    </Box>
  );
}

export default WorkerProfile;

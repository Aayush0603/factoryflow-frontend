import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Avatar,
  Box,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { useParams } from "react-router-dom";

const API = process.env.REACT_APP_API_URL;

function WorkerProfile({ dark }) {
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
    return <Typography>Loading profile...</Typography>;
  }

  const { worker, totalDaysWorked, totalHoursWorked, attendance } = data;

  return (
    <>
      {/* ===== Profile Card ===== */}
      <Card
        sx={{
          mb: 2,
          p: 2,
          borderRadius: 3,
          background: dark ? "#1e293b" : "white",
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)"
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
            gap: 2,
            textAlign: isMobile ? "center" : "left"
          }}
        >
          <Avatar
            sx={{
              width: 70,
              height: 70,
              bgcolor: "#3b82f6",
              fontSize: 28
            }}
          >
            {worker.name.charAt(0)}
          </Avatar>

          <Box>
            <Typography
              sx={{
                fontSize: { xs: "1.2rem", md: "1.4rem" },
                fontWeight: "bold"
              }}
            >
              {worker.name}
            </Typography>

            <Typography variant="body2">
              Role: {worker.role}
            </Typography>

            <Typography variant="body2">
              Salary Type: {worker.salaryType}
            </Typography>

            <Typography variant="body2">
              Salary: ₹ {worker.salaryAmount}
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* ===== Stats ===== */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 2,
              borderRadius: 3,
              background: dark ? "#1e293b" : "white",
              boxShadow: "0 6px 16px rgba(0,0,0,0.08)"
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Total Days Worked
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: "1.6rem", md: "1.8rem" },
                fontWeight: "bold",
                mt: 1
              }}
            >
              {totalDaysWorked}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 2,
              borderRadius: 3,
              background: dark ? "#1e293b" : "white",
              boxShadow: "0 6px 16px rgba(0,0,0,0.08)"
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Total Hours Worked
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: "1.6rem", md: "1.8rem" },
                fontWeight: "bold",
                mt: 1
              }}
            >
              {totalHoursWorked}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* ===== Attendance ===== */}
      <Card
        sx={{
          p: 2,
          borderRadius: 3,
          background: dark ? "#1e293b" : "white",
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)"
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "1rem", md: "1.2rem" },
            fontWeight: 600,
            mb: 2
          }}
        >
          Attendance History
        </Typography>

        {/* Desktop Table */}
        {!isMobile && (
          <Table size="small">
            <TableHead>
              <TableRow>
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
        )}

        {/* Mobile Cards */}
        {isMobile &&
          attendance.map((a, i) => (
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
                {a.date}
              </Typography>

              <Typography variant="body2">
                Check-In: {a.checkIn}
              </Typography>

              <Typography variant="body2">
                Check-Out: {a.checkOut || "-"}
              </Typography>

              <Typography
                variant="body2"
                sx={{ mt: 1, fontWeight: 500 }}
              >
                Hours: {a.workHours}
              </Typography>
            </Card>
          ))}
      </Card>
    </>
  );
}

export default WorkerProfile;
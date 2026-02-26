import React, { useState } from "react";
import {
  Card,
  Typography,
  Button,
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Grid,
  useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import API from "../api";

function Salary({ dark }) {
  const [month, setMonth] = useState("2026-01");
  const [data, setData] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const fetchSalary = async () => {
    try {
      const res = await API.get(`/api/salary/${month}`);
      setData(res.data);
    } catch (error) {
      console.error("Salary fetch error:", error);
      alert(error.response?.data?.message || "Failed to fetch salary data");
    }
  };

  const downloadReport = async () => {
    try {
      const res = await API.get(`/api/salary-report/${month}`, {
        responseType: "blob"
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `salary-report-${month}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download report");
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        p: 3,
        background: dark ? "#1e293b" : "white"
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: "1.4rem", md: "1.8rem" },
          fontWeight: "bold",
          mb: 2
        }}
      >
        Monthly Salary Report
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 2,
          mb: 2
        }}
      >
        <TextField
          type="month"
          label="Select Month"
          InputLabelProps={{ shrink: true }}
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          fullWidth={isMobile}
          size="small"
        />

        <Button
          variant="contained"
          onClick={fetchSalary}
          fullWidth={isMobile}
        >
          Get Salary
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={downloadReport}
          fullWidth={isMobile}
        >
          Download PDF
        </Button>
      </Box>

      {!isMobile && (
        <Paper sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow
                sx={{
                  background: dark ? "#0f172a" : "#f8fafc"
                }}
              >
                <TableCell><b>Name</b></TableCell>
                <TableCell><b>Role</b></TableCell>
                <TableCell><b>Days</b></TableCell>
                <TableCell><b>Normal Hours</b></TableCell>
                <TableCell><b>OT Hours</b></TableCell>
                <TableCell><b>Base Salary</b></TableCell>
                <TableCell><b>OT Pay</b></TableCell>
                <TableCell><b>Total Salary</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((w, i) => (
                <TableRow key={i}>
                  <TableCell>{w.name}</TableCell>
                  <TableCell>{w.role}</TableCell>
                  <TableCell>{w.daysWorked}</TableCell>
                  <TableCell>{w.normalHours}</TableCell>
                  <TableCell>{w.overtimeHours}</TableCell>
                  <TableCell>₹ {w.baseSalary}</TableCell>
                  <TableCell>₹ {w.overtimePay}</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#16a34a" }}>
                    ₹ {w.finalSalary}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {isMobile && (
        <Grid container spacing={2}>
          {data.map((w, i) => (
            <Grid item xs={12} key={i}>
              <Card
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: dark ? "#0f172a" : "#f8fafc"
                }}
              >
                <Typography fontWeight="bold" mb={1}>
                  {w.name} ({w.role})
                </Typography>

                <Typography variant="body2">
                  Days: {w.daysWorked}
                </Typography>

                <Typography variant="body2">
                  Normal Hours: {w.normalHours}
                </Typography>

                <Typography variant="body2">
                  OT Hours: {w.overtimeHours}
                </Typography>

                <Typography variant="body2">
                  Base: ₹ {w.baseSalary}
                </Typography>

                <Typography variant="body2">
                  OT Pay: ₹ {w.overtimePay}
                </Typography>

                <Typography
                  sx={{
                    mt: 1,
                    fontWeight: "bold",
                    color: "#16a34a"
                  }}
                >
                  Total: ₹ {w.finalSalary}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Card>
  );
}

export default Salary;
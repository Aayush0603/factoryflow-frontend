import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

function Salary() {
  const [month, setMonth] = useState("2026-01");
  const [data, setData] = useState([]);

  const fetchSalary = async () => {
    try {
      const res = await axios.get(`${API}/api/salary/${month}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch salary data");
    }
  };

  const downloadReport = () => {
    window.open(`${API}/api/salary-report/${month}`);
  };

  return (
    <Box display="flex" justifyContent="center" mt={5}>
      <Card sx={{ width: "100%", maxWidth: 1100, boxShadow: 4, borderRadius: 3 }}>
        <CardContent>

          <Typography variant="h5" fontWeight="bold" mb={3}>
            Monthly Salary Report
          </Typography>

          {/* Controls */}
          <Box display="flex" gap={2} alignItems="center" mb={3}>
            <TextField
              type="month"
              label="Select Month"
              InputLabelProps={{ shrink: true }}
              value={month}
              onChange={e => setMonth(e.target.value)}
            />

            <Button variant="contained" onClick={fetchSalary}>
              Get Salary
            </Button>

            <Button variant="outlined" color="secondary" onClick={downloadReport}>
              Download PDF
            </Button>
          </Box>

          {/* Table */}
          <Paper sx={{ overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: "#f1f5f9" }}>
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

        </CardContent>
      </Card>
    </Box>
  );
}

export default Salary;
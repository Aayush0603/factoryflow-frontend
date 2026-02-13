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
  Box
} from "@mui/material";

const API = process.env.REACT_APP_API_URL;

function AttendanceHistory() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`${API}/api/attendance/history`)
      .then(res => setData(res.data))
      .catch(console.error);
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Attendance History
      </Typography>

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
    </Box>
  );
}

export default AttendanceHistory;
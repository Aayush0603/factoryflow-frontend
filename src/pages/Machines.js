import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Select,
  MenuItem,
} from "@mui/material";
import API from "../api";

const Machines = () => {
  const [machines, setMachines] = useState([]);
  const [form, setForm] = useState({
    name: "",
    type: "",
    capacityPerHour: "",
  });

  const fetchMachines = async () => {
    try {
      const res = await API.get("/api/machines");
      setMachines(res.data);
    } catch (error) {
      console.error("Fetch machines error:", error);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  const handleSubmit = async () => {
    try {
      await API.post("/api/machines", {
        ...form,
        capacityPerHour: Number(form.capacityPerHour),
      });

      setForm({ name: "", type: "", capacityPerHour: "" });
      fetchMachines();

    } catch (error) {
      console.error("Add machine error:", error);
      alert(error.response?.data?.message || "Failed to add machine");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/api/machines/${id}`, { status });
      fetchMachines();
    } catch (error) {
      console.error("Update status error:", error);
      alert("Failed to update machine status");
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Machines
      </Typography>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <TextField
          label="Type"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        />
        <TextField
          label="Capacity / Hour"
          type="number"
          value={form.capacityPerHour}
          onChange={(e) =>
            setForm({ ...form, capacityPerHour: e.target.value })
          }
        />
        <Button variant="contained" onClick={handleSubmit}>
          Add
        </Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {machines.map((m) => (
              <TableRow key={m._id}>
                <TableCell>{m.name}</TableCell>
                <TableCell>{m.type}</TableCell>
                <TableCell>{m.capacityPerHour}</TableCell>
                <TableCell>
                  <Select
                    value={m.status}
                    onChange={(e) =>
                      updateStatus(m._id, e.target.value)
                    }
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Maintenance">Maintenance</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default Machines;
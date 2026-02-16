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
    const res = await API.get("/machines");
    setMachines(res.data);
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  const handleSubmit = async () => {
    await API.post("/machines", form);
    setForm({ name: "", type: "", capacityPerHour: "" });
    fetchMachines();
  };

  const updateStatus = async (id, status) => {
    await API.patch(`/machines/${id}`, { status });
    fetchMachines();
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
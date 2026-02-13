import React, { useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  MenuItem,
  Box
} from "@mui/material";

const API = process.env.REACT_APP_API_URL;

function AddWorker() {
  const [worker, setWorker] = useState({
    name: "",
    role: "",
    salaryType: "daily",
    salaryAmount: ""
  });

  const handleSubmit = async () => {
    try {
      await axios.post(`${API}/api/workers`, worker);
      alert("Worker Added Successfully 🎉");
      setWorker({
        name: "",
        role: "",
        salaryType: "daily",
        salaryAmount: ""
      });
    } catch (error) {
      console.error(error);
      alert("Error adding worker");
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt={5}>
      <Card sx={{ width: 400, boxShadow: 4, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Add New Worker
          </Typography>

          <TextField
            fullWidth
            label="Worker Name"
            margin="normal"
            value={worker.name}
            onChange={e => setWorker({ ...worker, name: e.target.value })}
          />

          <TextField
            fullWidth
            label="Role"
            margin="normal"
            value={worker.role}
            onChange={e => setWorker({ ...worker, role: e.target.value })}
          />

          <TextField
            select
            fullWidth
            label="Salary Type"
            margin="normal"
            value={worker.salaryType}
            onChange={e => setWorker({ ...worker, salaryType: e.target.value })}
          >
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
          </TextField>

          <TextField
            fullWidth
            type="number"
            label="Salary Amount"
            margin="normal"
            value={worker.salaryAmount}
            onChange={e =>
              setWorker({ ...worker, salaryAmount: e.target.value })
            }
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2, py: 1.2 }}
            onClick={handleSubmit}
          >
            Add Worker
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default AddWorker;
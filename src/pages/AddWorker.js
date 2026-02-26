import React, { useState } from "react";
import API from "../api";   // ✅ Use secured API
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  MenuItem,
  Box
} from "@mui/material";

function AddWorker() {
  const [worker, setWorker] = useState({
    name: "",
    role: "",
    salaryType: "daily",
    salaryAmount: ""
  });

  const handleSubmit = async () => {
    try {
      await API.post("/api/workers", {
        ...worker,
        salaryAmount: Number(worker.salaryAmount)
      });

      alert("Worker Added Successfully 🎉");

      setWorker({
        name: "",
        role: "",
        salaryType: "daily",
        salaryAmount: ""
      });

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error adding worker");
    }
  };

  return (
    <Box sx={{ maxWidth: 520 }}>
      <Typography
        sx={{
          fontSize: { xs: "1.4rem", md: "1.8rem" },
          fontWeight: "bold",
          mb: 3
        }}
      >
        Add New Worker
      </Typography>

      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)"
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <TextField
            fullWidth
            size="small"
            label="Worker Name"
            margin="normal"
            value={worker.name}
            onChange={e =>
              setWorker({ ...worker, name: e.target.value })
            }
          />

          <TextField
            fullWidth
            size="small"
            label="Role"
            margin="normal"
            value={worker.role}
            onChange={e =>
              setWorker({ ...worker, role: e.target.value })
            }
          />

          <TextField
            select
            fullWidth
            size="small"
            label="Salary Type"
            margin="normal"
            value={worker.salaryType}
            onChange={e =>
              setWorker({ ...worker, salaryType: e.target.value })
            }
          >
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
          </TextField>

          <TextField
            fullWidth
            size="small"
            type="number"
            label="Salary Amount"
            margin="normal"
            value={worker.salaryAmount}
            onChange={e =>
              setWorker({
                ...worker,
                salaryAmount: e.target.value
              })
            }
          />

          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 2.5,
              py: 1,
              fontWeight: 600,
              textTransform: "none"
            }}
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
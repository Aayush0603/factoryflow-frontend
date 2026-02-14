import React, { useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  MenuItem,
  Box,
  useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const API = process.env.REACT_APP_API_URL;

function AddWorker() {
  const [worker, setWorker] = useState({
    name: "",
    role: "",
    salaryType: "daily",
    salaryAmount: ""
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: isMobile ? "flex-start" : "center",
        px: 2,
        py: 3
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 480,
          borderRadius: 3,
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)"
        }}
      >
        <CardContent>
          <Typography
            sx={{
              fontSize: { xs: "1.4rem", md: "1.6rem" },
              fontWeight: "bold",
              mb: 3
            }}
          >
            Add New Worker
          </Typography>

          <TextField
            fullWidth
            label="Worker Name"
            margin="normal"
            value={worker.name}
            onChange={e =>
              setWorker({ ...worker, name: e.target.value })
            }
          />

          <TextField
            fullWidth
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
              mt: 3,
              py: 1.3,
              fontWeight: 600
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
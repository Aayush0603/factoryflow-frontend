import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid
} from "@mui/material";
import API from "../api";

const RawMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [form, setForm] = useState({
    name: "",
    currentStock: "",
    minimumStock: "",
    costPerUnit: ""
  });

  const fetchMaterials = () => {
    API.get("/raw-materials")
      .then(res => setMaterials(res.data));
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await API.post("/raw-materials", {
      ...form,
      currentStock: Number(form.currentStock),
      minimumStock: Number(form.minimumStock),
      costPerUnit: Number(form.costPerUnit)
    });

    setForm({
      name: "",
      currentStock: "",
      minimumStock: "",
      costPerUnit: ""
    });

    fetchMaterials();
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3}>
        Raw Material Inventory
      </Typography>

      {/* Add Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" mb={2}>
          Add Raw Material
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                label="Name"
                name="name"
                fullWidth
                value={form.name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                label="Current Stock (kg)"
                name="currentStock"
                type="number"
                fullWidth
                value={form.currentStock}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <TextField
                label="Minimum Stock"
                name="minimumStock"
                type="number"
                fullWidth
                value={form.minimumStock}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <TextField
                label="Cost Per Unit"
                name="costPerUnit"
                type="number"
                fullWidth
                value={form.costPerUnit}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ height: "56px" }}
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Inventory List */}
      {materials.map(mat => (
        <Paper key={mat._id} sx={{ p: 2, mb: 2 }}>
          <Typography><b>{mat.name}</b></Typography>
          <Typography>
            Stock: {mat.currentStock} {mat.unit}
          </Typography>
          <Typography>
            Status:{" "}
            {mat.currentStock <= mat.minimumStock ? (
              <span style={{ color: "red" }}>Low Stock</span>
            ) : (
              <span style={{ color: "green" }}>Healthy</span>
            )}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
};

export default RawMaterials;
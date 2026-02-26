import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  Paper
} from "@mui/material";
import API from "../api";

const ProductionTargets = () => {
  const [products, setProducts] = useState([]);
  const [targets, setTargets] = useState([]);
  const [form, setForm] = useState({
    productId: "",
    targetQuantity: "",
    targetDate: "",
    type: "Daily"
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [productRes, targetRes] = await Promise.all([
        API.get("/api/products"),
        API.get("/api/targets/achievement")
      ]);

      setProducts(productRes.data);
      setTargets(targetRes.data);

    } catch (error) {
      console.error("Production targets load error:", error);
    }
  };

  const fetchTargets = async () => {
    try {
      const res = await API.get("/api/targets/achievement");
      setTargets(res.data);
    } catch (error) {
      console.error("Fetch targets error:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      await API.post("/api/targets", {
        ...form,
        targetQuantity: Number(form.targetQuantity)
      });

      setForm({
        productId: "",
        targetQuantity: "",
        targetDate: "",
        type: "Daily"
      });

      fetchTargets();

    } catch (error) {
      console.error("Add target error:", error);
      alert(error.response?.data?.message || "Failed to add target");
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3}>
        Production Targets
      </Typography>

      <Box display="flex" gap={2} mb={3}>
        <Select
          value={form.productId}
          onChange={(e) =>
            setForm({ ...form, productId: e.target.value })
          }
          displayEmpty
        >
          <MenuItem value="">Select Product</MenuItem>
          {products.map(p => (
            <MenuItem key={p._id} value={p._id}>
              {p.name}
            </MenuItem>
          ))}
        </Select>

        <TextField
          label="Target Quantity"
          type="number"
          value={form.targetQuantity}
          onChange={(e) =>
            setForm({ ...form, targetQuantity: e.target.value })
          }
        />

        <TextField
          type="date"
          value={form.targetDate}
          onChange={(e) =>
            setForm({ ...form, targetDate: e.target.value })
          }
        />

        <Select
          value={form.type}
          onChange={(e) =>
            setForm({ ...form, type: e.target.value })
          }
        >
          <MenuItem value="Daily">Daily</MenuItem>
          <MenuItem value="Monthly">Monthly</MenuItem>
        </Select>

        <Button variant="contained" onClick={handleSubmit}>
          Add
        </Button>
      </Box>

      {targets.map((t, i) => (
        <Paper key={i} sx={{ p: 2, mb: 2 }}>
          <Typography><b>{t.productName}</b></Typography>
          <Typography>Target: {t.targetQuantity}</Typography>
          <Typography>Actual: {t.actual}</Typography>
          <Typography>
            Achievement:{" "}
            <span
              style={{
                color: t.achievement < 80 ? "red" : "green"
              }}
            >
              {t.achievement} %
            </span>
          </Typography>
        </Paper>
      ))}
    </Box>
  );
};

export default ProductionTargets;
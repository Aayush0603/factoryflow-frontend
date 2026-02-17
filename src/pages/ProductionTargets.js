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
    API.get("/products").then(res => setProducts(res.data));
    fetchTargets();
  }, []);

  const fetchTargets = () => {
    API.get("/targets/achievement").then(res =>
      setTargets(res.data)
    );
  };

  const handleSubmit = async () => {
    await API.post("/targets", form);
    fetchTargets();
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
          onChange={(e) =>
            setForm({ ...form, targetQuantity: e.target.value })
          }
        />

        <TextField
          type="date"
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
            <span style={{
              color: t.achievement < 80 ? "red" : "green"
            }}>
              {t.achievement} %
            </span>
          </Typography>
        </Paper>
      ))}
    </Box>
  );
};

export default ProductionTargets;
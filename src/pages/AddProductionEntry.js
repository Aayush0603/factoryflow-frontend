import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
} from "@mui/material";
import API from "../api";

const AddProductionEntry = () => {
  const [products, setProducts] = useState([]);
  const [machines, setMachines] = useState([]);

  const [form, setForm] = useState({
    productId: "",
    machineId: "",
    quantityProduced: "",
    rawMaterialUsedKg: "",
    workingHours: "",
    shift: "Morning",
  });

  useEffect(() => {
    API.get("/products").then((res) => setProducts(res.data));
    API.get("/machines").then((res) => setMachines(res.data));
  }, []);

  const handleSubmit = async () => {
    await API.post("/production", form);
    alert("Production Added Successfully");
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Add Production Entry
      </Typography>

      <Box display="flex" flexDirection="column" gap={2} width={300}>
        <Select
          value={form.productId}
          onChange={(e) =>
            setForm({ ...form, productId: e.target.value })
          }
        >
          {products.map((p) => (
            <MenuItem key={p._id} value={p._id}>
              {p.name}
            </MenuItem>
          ))}
        </Select>

        <Select
          value={form.machineId}
          onChange={(e) =>
            setForm({ ...form, machineId: e.target.value })
          }
        >
          {machines.map((m) => (
            <MenuItem key={m._id} value={m._id}>
              {m.name}
            </MenuItem>
          ))}
        </Select>

        <TextField
          label="Quantity Produced"
          type="number"
          onChange={(e) =>
            setForm({ ...form, quantityProduced: e.target.value })
          }
        />

        <TextField
          label="Raw Material Used (kg)"
          type="number"
          onChange={(e) =>
            setForm({ ...form, rawMaterialUsedKg: e.target.value })
          }
        />

        <TextField
          label="Working Hours"
          type="number"
          onChange={(e) =>
            setForm({ ...form, workingHours: e.target.value })
          }
        />

        <Select
          value={form.shift}
          onChange={(e) =>
            setForm({ ...form, shift: e.target.value })
          }
        >
          <MenuItem value="Morning">Morning</MenuItem>
          <MenuItem value="Evening">Evening</MenuItem>
        </Select>

        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default AddProductionEntry;
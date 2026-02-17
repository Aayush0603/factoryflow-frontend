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
  const [rawMaterials, setRawMaterials] = useState([]);

  const [form, setForm] = useState({
    productId: "",
    machineId: "",
    rawMaterialId: "", // ✅ REQUIRED
    quantityProduced: "",
    rawMaterialUsedKg: "",
    workingHours: "",
    shift: "Morning",
  });

  useEffect(() => {
    API.get("/products").then((res) => setProducts(res.data));
    API.get("/machines").then((res) => setMachines(res.data));
    API.get("/raw-materials").then((res) =>
      setRawMaterials(res.data)
    );
  }, []);

  const handleSubmit = async () => {
    try {
      await API.post("/production", {
        ...form,
        quantityProduced: Number(form.quantityProduced),
        rawMaterialUsedKg: Number(form.rawMaterialUsedKg),
        workingHours: Number(form.workingHours),
      });

      alert("Production Added Successfully");

      // Reset form
      setForm({
        productId: "",
        machineId: "",
        rawMaterialId: "",
        quantityProduced: "",
        rawMaterialUsedKg: "",
        workingHours: "",
        shift: "Morning",
      });

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error adding production");
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Add Production Entry
      </Typography>

      <Box display="flex" flexDirection="column" gap={2} width={300}>

        {/* Product */}
        <Select
          value={form.productId}
          displayEmpty
          onChange={(e) =>
            setForm({ ...form, productId: e.target.value })
          }
        >
          <MenuItem value="">Select Product</MenuItem>
          {products.map((p) => (
            <MenuItem key={p._id} value={p._id}>
              {p.name}
            </MenuItem>
          ))}
        </Select>

        {/* Machine */}
        <Select
          value={form.machineId}
          displayEmpty
          onChange={(e) =>
            setForm({ ...form, machineId: e.target.value })
          }
        >
          <MenuItem value="">Select Machine</MenuItem>
          {machines.map((m) => (
            <MenuItem key={m._id} value={m._id}>
              {m.name}
            </MenuItem>
          ))}
        </Select>

        {/* Raw Material */}
        <Select
          value={form.rawMaterialId}
          displayEmpty
          onChange={(e) =>
            setForm({ ...form, rawMaterialId: e.target.value })
          }
        >
          <MenuItem value="">Select Raw Material</MenuItem>
          {rawMaterials.map((rm) => (
            <MenuItem key={rm._id} value={rm._id}>
              {rm.name}
            </MenuItem>
          ))}
        </Select>

        <TextField
          label="Quantity Produced"
          type="number"
          value={form.quantityProduced}
          onChange={(e) =>
            setForm({ ...form, quantityProduced: e.target.value })
          }
        />

        <TextField
          label="Raw Material Used (kg)"
          type="number"
          value={form.rawMaterialUsedKg}
          onChange={(e) =>
            setForm({ ...form, rawMaterialUsedKg: e.target.value })
          }
        />

        <TextField
          label="Working Hours"
          type="number"
          value={form.workingHours}
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
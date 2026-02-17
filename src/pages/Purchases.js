import React, { useEffect, useState } from "react";
import { Box, Typography, Select, MenuItem, TextField, Button } from "@mui/material";
import API from "../api";

const Purchases = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);

  const [form, setForm] = useState({
    supplierId: "",
    rawMaterialId: "",
    quantity: "",
    pricePerUnit: "",
    paymentStatus: "Pending"
  });

  useEffect(() => {
    API.get("/suppliers").then(res => setSuppliers(res.data));
    API.get("/raw-materials").then(res => setRawMaterials(res.data));
  }, []);

  const handleSubmit = async () => {
    await API.post("/purchases", {
      ...form,
      quantity: Number(form.quantity),
      pricePerUnit: Number(form.pricePerUnit)
    });

    alert("Purchase Added Successfully");
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>Add Purchase</Typography>

      <Box display="flex" flexDirection="column" gap={2} width={300}>
        <Select
          value={form.supplierId}
          onChange={(e) => setForm({ ...form, supplierId: e.target.value })}
        >
          <MenuItem value="">Select Supplier</MenuItem>
          {suppliers.map(s => (
            <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>
          ))}
        </Select>

        <Select
          value={form.rawMaterialId}
          onChange={(e) => setForm({ ...form, rawMaterialId: e.target.value })}
        >
          <MenuItem value="">Select Raw Material</MenuItem>
          {rawMaterials.map(r => (
            <MenuItem key={r._id} value={r._id}>{r.name}</MenuItem>
          ))}
        </Select>

        <TextField
          label="Quantity"
          type="number"
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
        />

        <TextField
          label="Price Per Unit"
          type="number"
          onChange={(e) => setForm({ ...form, pricePerUnit: e.target.value })}
        />

        <Select
          value={form.paymentStatus}
          onChange={(e) => setForm({ ...form, paymentStatus: e.target.value })}
        >
          <MenuItem value="Paid">Paid</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
        </Select>

        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default Purchases;
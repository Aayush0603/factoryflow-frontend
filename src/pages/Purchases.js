import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button
} from "@mui/material";
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
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [supplierRes, rawMaterialRes] = await Promise.all([
        API.get("/api/suppliers"),
        API.get("/api/raw-materials")
      ]);

      setSuppliers(supplierRes.data);
      setRawMaterials(rawMaterialRes.data);

    } catch (error) {
      console.error("Initial purchase load error:", error);
    }
  };

  const handleSubmit = async () => {
    if (!form.supplierId || !form.rawMaterialId || !form.quantity || !form.pricePerUnit) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await API.post("/api/purchases", {
        ...form,
        quantity: Number(form.quantity),
        pricePerUnit: Number(form.pricePerUnit)
      });

      alert("Purchase Added Successfully");

      setForm({
        supplierId: "",
        rawMaterialId: "",
        quantity: "",
        pricePerUnit: "",
        paymentStatus: "Pending"
      });

    } catch (error) {
      console.error("Purchase error:", error);
      alert(error.response?.data?.message || "Error adding purchase");
    }
  };

  const totalAmount =
    form.quantity && form.pricePerUnit
      ? (Number(form.quantity) * Number(form.pricePerUnit)).toFixed(2)
      : 0;

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Add Purchase
      </Typography>

      <Box display="flex" flexDirection="column" gap={2} width={350}>
        
        <Select
          value={form.supplierId}
          onChange={(e) =>
            setForm({ ...form, supplierId: e.target.value })
          }
          displayEmpty
        >
          <MenuItem value="">Select Supplier</MenuItem>
          {suppliers.map((s) => (
            <MenuItem key={s._id} value={s._id}>
              {s.companyName} - {s.supplierName}
            </MenuItem>
          ))}
        </Select>

        <Select
          value={form.rawMaterialId}
          onChange={(e) =>
            setForm({ ...form, rawMaterialId: e.target.value })
          }
          displayEmpty
        >
          <MenuItem value="">Select Raw Material</MenuItem>
          {rawMaterials.map((r) => (
            <MenuItem key={r._id} value={r._id}>
              {r.name}
            </MenuItem>
          ))}
        </Select>

        <TextField
          label="Quantity"
          type="number"
          value={form.quantity}
          onChange={(e) =>
            setForm({ ...form, quantity: e.target.value })
          }
        />

        <TextField
          label="Price Per Unit"
          type="number"
          value={form.pricePerUnit}
          onChange={(e) =>
            setForm({ ...form, pricePerUnit: e.target.value })
          }
        />

        <TextField
          label="Total Amount"
          value={totalAmount}
          InputProps={{ readOnly: true }}
        />

        <Select
          value={form.paymentStatus}
          onChange={(e) =>
            setForm({ ...form, paymentStatus: e.target.value })
          }
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
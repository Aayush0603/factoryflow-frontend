import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper
} from "@mui/material";
import API from "../api";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({
    companyName: "",
    supplierName: "",
    mobile: "",
    email: "",
    address: ""
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await API.get("/api/suppliers");
      setSuppliers(res.data);
    } catch (error) {
      console.error("Fetch suppliers error:", error);
    }
  };

  const handleSubmit = async () => {
    if (!form.companyName || !form.supplierName) {
      alert("Company name and supplier name are required");
      return;
    }

    try {
      await API.post("/api/suppliers", form);

      setForm({
        companyName: "",
        supplierName: "",
        mobile: "",
        email: "",
        address: ""
      });

      fetchSuppliers();

    } catch (error) {
      console.error("Add supplier error:", error);
      alert(error.response?.data?.message || "Failed to add supplier");
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3}>
        Supplier Management
      </Typography>

      <Box display="flex" flexDirection="column" gap={2} width={350}>
        <TextField
          label="Company Name"
          value={form.companyName}
          onChange={(e) =>
            setForm({ ...form, companyName: e.target.value })
          }
        />

        <TextField
          label="Supplier Name"
          value={form.supplierName}
          onChange={(e) =>
            setForm({ ...form, supplierName: e.target.value })
          }
        />

        <TextField
          label="Mobile Number"
          value={form.mobile}
          onChange={(e) =>
            setForm({ ...form, mobile: e.target.value })
          }
        />

        <TextField
          label="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <TextField
          label="Address"
          multiline
          rows={3}
          value={form.address}
          onChange={(e) =>
            setForm({ ...form, address: e.target.value })
          }
        />

        <Button variant="contained" onClick={handleSubmit}>
          Add Supplier
        </Button>
      </Box>

      <Box mt={4}>
        {suppliers.map((s) => (
          <Paper key={s._id} sx={{ p: 2, mb: 2 }}>
            <Typography><b>{s.companyName}</b></Typography>
            <Typography>Supplier: {s.supplierName}</Typography>
            <Typography>Mobile: {s.mobile}</Typography>
            <Typography>Email: {s.email}</Typography>
            <Typography>Address: {s.address}</Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default Suppliers;
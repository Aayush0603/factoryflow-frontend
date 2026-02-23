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

  const fetchSuppliers = () => {
    API.get("/suppliers").then(res =>
      setSuppliers(res.data)
    );
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleSubmit = async () => {
    await API.post("/suppliers", form);

    setForm({
      companyName: "",
      supplierName: "",
      mobile: "",
      email: "",
      address: ""
    });

    fetchSuppliers();
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
        {suppliers.map(s => (
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
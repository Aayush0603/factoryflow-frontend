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
    name: "",
    contactPerson: "",
    phone: "",
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
      name: "",
      contactPerson: "",
      phone: "",
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

      <Box display="flex" flexDirection="column" gap={2} width={300}>
        <TextField label="Supplier Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <TextField label="Contact Person"
          value={form.contactPerson}
          onChange={(e) =>
            setForm({ ...form, contactPerson: e.target.value })
          }
        />

        <TextField label="Phone"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        <TextField label="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <TextField label="Address"
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
            <Typography><b>{s.name}</b></Typography>
            <Typography>{s.contactPerson}</Typography>
            <Typography>{s.phone}</Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default Suppliers;
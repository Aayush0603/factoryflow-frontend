import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import API from "../api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    standardOutputPerHour: "",
  });

  const fetchProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async () => {
    await API.post("/products", form);
    setForm({ name: "", category: "", standardOutputPerHour: "" });
    fetchProducts();
  };

  const handleDelete = async (id) => {
    await API.delete(`/products/${id}`);
    fetchProducts();
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Products
      </Typography>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <TextField
          label="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <TextField
          label="Output / Hour"
          type="number"
          value={form.standardOutputPerHour}
          onChange={(e) =>
            setForm({ ...form, standardOutputPerHour: e.target.value })
          }
        />
        <Button variant="contained" onClick={handleSubmit}>
          Add
        </Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Output / Hour</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p._id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell>{p.standardOutputPerHour}</TableCell>
                <TableCell>
                  <Button
                    color="error"
                    onClick={() => handleDelete(p._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default Products;
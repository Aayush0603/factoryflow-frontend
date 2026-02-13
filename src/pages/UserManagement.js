import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@mui/material";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "supervisor"
  });

  const fetchUsers = () => {
    axios.get("http://localhost:5000/api/auth/users")
      .then(res => setUsers(res.data));
  };

  useEffect(fetchUsers, []);

  const createUser = async () => {
    await axios.post("http://localhost:5000/api/auth/create-supervisor", form);
    setForm({ username: "", password: "", role: "supervisor" });
    fetchUsers();
  };

  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:5000/api/auth/users/${id}`);
    fetchUsers();
  };

  return (
    <Box p={4}>
      <Typography variant="h4" mb={3} fontWeight="bold">
        User Management
      </Typography>

      {/* Create User Card */}
      <Card sx={{ mb: 4, p: 3, borderRadius: 3 }}>
        <Typography variant="h6" mb={2}>
          Create Supervisor
        </Typography>

        <TextField
          label="Username"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
          sx={{ mr: 2 }}
        />

        <TextField
          label="Password"
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          sx={{ mr: 2 }}
        />

        <Button variant="contained" onClick={createUser}>
          Create
        </Button>
      </Card>

      {/* Users Table */}
      <Card sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" mb={2}>
          All Users
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map(user => (
              <TableRow key={user._id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  {user.role !== "admin" && (
                    <Button
                      color="error"
                      onClick={() => deleteUser(user._id)}
                    >
                      Delete
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

      </Card>
    </Box>
  );
}

export default UserManagement;
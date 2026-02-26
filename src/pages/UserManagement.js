import React, { useEffect, useState } from "react";
import API from "../api";   // ✅ Use secured API
import {
  Box,
  Typography,
  Card,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

function UserManagement({ dark }) {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "supervisor"
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // ✅ Fetch users (Protected route)
  const fetchUsers = async () => {
    try {
      const res = await API.get("/api/auth/users");
      setUsers(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Create user (using unified signup route)
  const createUser = async () => {
    try {
      await API.post("/api/auth/signup", form);

      setForm({
        name: "",
        email: "",
        password: "",
        role: "supervisor"
      });

      fetchUsers();
    } catch (err) {
      alert("Failed to create user");
    }
  };

  // ✅ Delete user
  const deleteUser = async (id) => {
    try {
      await API.delete(`/api/auth/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  return (
    <>
      <Typography
        sx={{
          fontSize: { xs: "1.4rem", md: "1.6rem" },
          fontWeight: "bold",
          mb: 2
        }}
      >
        User Management
      </Typography>

      {/* ===== Create User ===== */}
      <Card
        sx={{
          mb: 2,
          p: 2,
          borderRadius: 3,
          background: dark ? "#1e293b" : "white",
          boxShadow: "0 6px 16px rgba(0,0,0,0.08)"
        }}
      >
        <Typography variant="subtitle1" mb={2}>
          Create User
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 2
          }}
        >
          <TextField
            fullWidth
            size="small"
            label="Name"
            value={form.name}
            onChange={e =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <TextField
            fullWidth
            size="small"
            label="Email"
            value={form.email}
            onChange={e =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <TextField
            fullWidth
            size="small"
            label="Password"
            type="password"
            value={form.password}
            onChange={e =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <Button
            variant="contained"
            onClick={createUser}
            sx={{ minWidth: isMobile ? "100%" : 130 }}
          >
            Create
          </Button>
        </Box>
      </Card>

      {/* ===== Users List ===== */}
      <Card
        sx={{
          p: 2,
          borderRadius: 3,
          background: dark ? "#1e293b" : "white",
          boxShadow: "0 6px 16px rgba(0,0,0,0.08)"
        }}
      >
        <Typography variant="subtitle1" mb={2}>
          All Users
        </Typography>

        {!isMobile && (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><b>Name</b></TableCell>
                <TableCell><b>Email</b></TableCell>
                <TableCell><b>Role</b></TableCell>
                <TableCell><b>Action</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {users.map(user => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {user.role !== "admin" && (
                      <Button
                        size="small"
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
        )}

        {isMobile &&
          users.map(user => (
            <Card
              key={user._id}
              sx={{
                p: 2,
                mb: 1.5,
                borderRadius: 2,
                background: dark ? "#0f172a" : "#f8fafc"
              }}
            >
              <Typography fontWeight="bold">
                {user.name}
              </Typography>

              <Typography variant="body2">
                {user.email}
              </Typography>

              <Typography variant="body2" mb={1}>
                Role: {user.role}
              </Typography>

              {user.role !== "admin" && (
                <Button
                  size="small"
                  color="error"
                  onClick={() => deleteUser(user._id)}
                >
                  Delete
                </Button>
              )}
            </Card>
          ))}
      </Card>
    </>
  );
}

export default UserManagement;
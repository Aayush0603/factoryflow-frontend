import React, { useEffect, useState } from "react";
import axios from "axios";
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

const API = process.env.REACT_APP_API_URL;

function UserManagement({ dark }) {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "supervisor"
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const fetchUsers = () => {
    axios
      .get(`${API}/api/auth/users`)
      .then(res => setUsers(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const createUser = async () => {
    try {
      await axios.post(
        `${API}/api/auth/create-supervisor`,
        form
      );
      setForm({ username: "", password: "", role: "supervisor" });
      fetchUsers();
    } catch (err) {
      alert("Failed to create user");
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API}/api/auth/users/${id}`);
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
          Create Supervisor
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
            label="Username"
            value={form.username}
            onChange={e =>
              setForm({ ...form, username: e.target.value })
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

        {/* Desktop Table */}
        {!isMobile && (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><b>Username</b></TableCell>
                <TableCell><b>Role</b></TableCell>
                <TableCell><b>Action</b></TableCell>
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

        {/* Mobile Cards */}
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
                {user.username}
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
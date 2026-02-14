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
  Grid,
  useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const API = process.env.REACT_APP_API_URL;

function UserManagement() {
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
      console.error(err);
      alert("Failed to create user");
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API}/api/auth/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography
        sx={{
          fontSize: { xs: "1.5rem", md: "2rem" },
          fontWeight: "bold",
          mb: 3
        }}
      >
        User Management
      </Typography>

      {/* ===== Create User Card ===== */}
      <Card sx={{ mb: 4, p: 3, borderRadius: 3 }}>
        <Typography variant="h6" mb={2}>
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
            label="Username"
            value={form.username}
            onChange={e =>
              setForm({ ...form, username: e.target.value })
            }
          />

          <TextField
            fullWidth
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
            sx={{ minWidth: isMobile ? "100%" : "150px" }}
          >
            Create
          </Button>
        </Box>
      </Card>

      {/* ===== Users List ===== */}
      <Card sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" mb={2}>
          All Users
        </Typography>

        {/* Desktop Table */}
        {!isMobile && (
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
        )}

        {/* Mobile Card View */}
        {isMobile && (
          <Grid container spacing={2}>
            {users.map(user => (
              <Grid item xs={12} key={user._id}>
                <Card sx={{ p: 2, borderRadius: 2 }}>
                  <Typography fontWeight="bold">
                    {user.username}
                  </Typography>

                  <Typography variant="body2" mb={1}>
                    Role: {user.role}
                  </Typography>

                  {user.role !== "admin" && (
                    <Button
                      color="error"
                      size="small"
                      onClick={() => deleteUser(user._id)}
                    >
                      Delete
                    </Button>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Card>
    </Box>
  );
}

export default UserManagement;
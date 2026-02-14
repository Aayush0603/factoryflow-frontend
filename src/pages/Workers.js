import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Select,
  MenuItem,
  useMediaQuery
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const DataGrid = React.lazy(() =>
  import("@mui/x-data-grid").then(mod => ({ default: mod.DataGrid }))
);

const API = process.env.REACT_APP_API_URL;

function Workers() {
  const [workers, setWorkers] = useState([]);
  const [editingWorker, setEditingWorker] = useState(null);
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const fetchWorkers = () => {
    axios
      .get(`${API}/api/workers`)
      .then(res => {
        const formatted = res.data.map(w => ({ ...w, id: w._id }));
        setWorkers(formatted);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const deleteWorker = async (id) => {
    try {
      await axios.delete(`${API}/api/workers/${id}`);
      fetchWorkers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete worker");
    }
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 },
    { field: "salaryType", headerName: "Type", flex: 1 },
    { field: "salaryAmount", headerName: "Salary", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 260,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate(`/worker/${params.row._id}`)}
          >
            Profile
          </Button>

          <Button
            variant="outlined"
            size="small"
            onClick={() => setEditingWorker(params.row)}
          >
            Edit
          </Button>

          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => deleteWorker(params.row._id)}
          >
            Delete
          </Button>
        </Box>
      )
    }
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Typography
        sx={{
          fontSize: { xs: "1.4rem", md: "1.8rem" },
          fontWeight: "bold",
          mb: 3
        }}
      >
        Workers Management
      </Typography>

      {/* ================= DESKTOP TABLE ================= */}
      {!isMobile && (
        <Box sx={{ height: 500, width: "100%" }}>
          <React.Suspense fallback={<div>Loading table...</div>}>
            <DataGrid
              rows={workers}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
            />
          </React.Suspense>
        </Box>
      )}

      {/* ================= MOBILE CARDS ================= */}
      {isMobile && (
        <Grid container spacing={2}>
          {workers.map(worker => (
            <Grid item xs={12} key={worker._id}>
              <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                  <Typography fontWeight="bold">
                    {worker.name}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Role: {worker.role}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Type: {worker.salaryType}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Salary: ₹{worker.salaryAmount}
                  </Typography>

                  <Box display="flex" gap={1} flexWrap="wrap">
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => navigate(`/worker/${worker._id}`)}
                    >
                      Profile
                    </Button>

                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => setEditingWorker(worker)}
                    >
                      Edit
                    </Button>

                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => deleteWorker(worker._id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* ================= EDIT FORM ================= */}
      {editingWorker && (
        <Card sx={{ mt: 4, p: 3, borderRadius: 3 }}>
          <Typography variant="h6" mb={2}>
            Edit Worker
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                value={editingWorker.name}
                onChange={e =>
                  setEditingWorker({ ...editingWorker, name: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Role"
                value={editingWorker.role}
                onChange={e =>
                  setEditingWorker({ ...editingWorker, role: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Salary"
                value={editingWorker.salaryAmount}
                onChange={e =>
                  setEditingWorker({
                    ...editingWorker,
                    salaryAmount: e.target.value
                  })
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Select
                fullWidth
                value={editingWorker.salaryType}
                onChange={e =>
                  setEditingWorker({
                    ...editingWorker,
                    salaryType: e.target.value
                  })
                }
              >
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
              </Select>
            </Grid>
          </Grid>

          <Box mt={3}>
            <Button
              variant="contained"
              onClick={async () => {
                try {
                  await axios.put(
                    `${API}/api/workers/${editingWorker._id}`,
                    editingWorker
                  );
                  setEditingWorker(null);
                  fetchWorkers();
                } catch (err) {
                  console.error(err);
                  alert("Failed to update worker");
                }
              }}
            >
              Save Changes
            </Button>
          </Box>
        </Card>
      )}
    </Box>
  );
}

export default Workers;
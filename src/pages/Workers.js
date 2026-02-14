import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Box,
  Typography,
  Card,
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

function Workers({ dark }) {
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
      width: 250,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <Button
            size="small"
            variant="contained"
            onClick={() => navigate(`/worker/${params.row._id}`)}
          >
            Profile
          </Button>

          <Button
            size="small"
            variant="outlined"
            onClick={() => setEditingWorker(params.row)}
          >
            Edit
          </Button>

          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => deleteWorker(params.row._id)}
          >
            Delete
          </Button>
        </Box>
      )
    }
  ];

  return (
    <>
      {/* ===== Title ===== */}
      <Typography
        sx={{
          fontSize: { xs: "1.4rem", md: "1.8rem" },
          fontWeight: "bold",
          mb: 2
        }}
      >
        Workers Management
      </Typography>

      {/* ===== Desktop Table ===== */}
      {!isMobile && (
        <Box sx={{ height: 420, width: "100%" }}>
          <React.Suspense fallback={<div>Loading table...</div>}>
            <DataGrid
              rows={workers}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              sx={{
                background: dark ? "#1e293b" : "white",
                borderRadius: 2
              }}
            />
          </React.Suspense>
        </Box>
      )}

      {/* ===== Mobile Cards ===== */}
      {isMobile && (
        <Grid container spacing={2}>
          {workers.map(worker => (
            <Grid item xs={12} key={worker._id}>
              <Card
                sx={{
                  borderRadius: 3,
                  p: 2,
                  background: dark ? "#1e293b" : "white",
                  boxShadow: 2
                }}
              >
                <Typography fontWeight="bold">
                  {worker.name}
                </Typography>

                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  Role: {worker.role}
                </Typography>

                <Typography variant="body2">
                  Type: {worker.salaryType}
                </Typography>

                <Typography variant="body2" mb={1}>
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
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* ===== Edit Form ===== */}
      {editingWorker && (
        <Card
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 3,
            background: dark ? "#1e293b" : "white",
            boxShadow: 2
          }}
        >
          <Typography sx={{ fontWeight: "bold", mb: 2 }}>
            Edit Worker
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
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
                size="small"
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
                size="small"
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
                size="small"
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

          <Box mt={2}>
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
    </>
  );
}

export default Workers;
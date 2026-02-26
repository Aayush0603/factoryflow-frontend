import React, { useEffect, useState } from "react";
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
import API from "../api";

const DataGrid = React.lazy(() =>
  import("@mui/x-data-grid").then(mod => ({ default: mod.DataGrid }))
);

function Workers({ dark }) {
  const [workers, setWorkers] = useState([]);
  const [editingWorker, setEditingWorker] = useState(null);
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      const res = await API.get("/api/workers");
      const formatted = res.data.map(w => ({ ...w, id: w._id }));
      setWorkers(formatted);
    } catch (error) {
      console.error("Fetch workers error:", error);
    }
  };

  const deleteWorker = async (id) => {
    try {
      await API.delete(`/api/workers/${id}`);
      fetchWorkers();
    } catch (error) {
      console.error("Delete worker error:", error);
      alert("Failed to delete worker");
    }
  };

  const updateWorker = async () => {
    try {
      await API.put(`/api/workers/${editingWorker._id}`, {
        ...editingWorker,
        salaryAmount: Number(editingWorker.salaryAmount)
      });

      setEditingWorker(null);
      fetchWorkers();
    } catch (error) {
      console.error("Update worker error:", error);
      alert("Failed to update worker");
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
            onClick={() => navigate(`/worker/${params.row.id}`)}
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
      <Typography
        sx={{
          fontSize: { xs: "1.4rem", md: "1.8rem" },
          fontWeight: "bold",
          mb: 2
        }}
      >
        Workers Management
      </Typography>

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
            <Button variant="contained" onClick={updateWorker}>
              Save Changes
            </Button>
          </Box>
        </Card>
      )}
    </>
  );
}

export default Workers;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const DataGrid = React.lazy(() =>
  import("@mui/x-data-grid").then(mod => ({ default: mod.DataGrid }))
);

function Workers() {
  const [workers, setWorkers] = useState([]);
  const [editingWorker, setEditingWorker] = useState(null);
  const navigate = useNavigate();

  // 🔥 Base API URL (Professional way)
  const API_URL = "http://localhost:5000/api/workers";

  const fetchWorkers = () => {
    axios.get(API_URL)
      .then(res => {
        const formatted = res.data.map(w => ({ ...w, id: w._id }));
        setWorkers(formatted);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const deleteWorker = async (id) => {
    await axios.delete(`${API_URL}/${id}`);   // ✅ FIXED
    fetchWorkers();
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
        <div style={{ display: "flex", gap: "6px" }}>
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
        </div>
      )
    }
  ];

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Workers Management
      </Typography>

      <div style={{ height: 450, width: "100%" }}>
        <React.Suspense fallback={<div>Loading table...</div>}>
          <DataGrid
            rows={workers}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        </React.Suspense>
      </div>

      {/* Edit Form */}
      {editingWorker && (
        <Box mt={4}>
          <Typography variant="h6">Edit Worker</Typography>

          <input
            value={editingWorker.name}
            onChange={e =>
              setEditingWorker({ ...editingWorker, name: e.target.value })
            }
          />

          <input
            value={editingWorker.role}
            onChange={e =>
              setEditingWorker({ ...editingWorker, role: e.target.value })
            }
          />

          <input
            type="number"
            value={editingWorker.salaryAmount}
            onChange={e =>
              setEditingWorker({
                ...editingWorker,
                salaryAmount: e.target.value
              })
            }
          />

          <select
            value={editingWorker.salaryType}
            onChange={e =>
              setEditingWorker({
                ...editingWorker,
                salaryType: e.target.value
              })
            }
          >
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
          </select>

          <Button
            variant="contained"
            sx={{ ml: 2 }}
            onClick={async () => {
              await axios.put(
                `${API_URL}/${editingWorker._id}`,   // ✅ FIXED
                editingWorker
              );
              setEditingWorker(null);
              fetchWorkers();
            }}
          >
            Save
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default Workers;
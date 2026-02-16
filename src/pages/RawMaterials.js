import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import API from "../api";

const RawMaterials = () => {
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    API.get("/raw-materials")
      .then(res => setMaterials(res.data));
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3}>
        Raw Material Inventory
      </Typography>

      {materials.map(mat => (
        <Paper key={mat._id} sx={{ p: 2, mb: 2 }}>
          <Typography><b>{mat.name}</b></Typography>
          <Typography>Stock: {mat.currentStock} {mat.unit}</Typography>
          <Typography>
            Status: {mat.currentStock <= mat.minimumStock ? 
              <span style={{color:"red"}}>Low Stock</span> : 
              <span style={{color:"green"}}>Healthy</span>}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
};

export default RawMaterials;
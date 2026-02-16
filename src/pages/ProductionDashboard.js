import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import { Bar, Line } from "react-chartjs-2";
import API from "../api";

const ProductionDashboard = () => {
  const [summary, setSummary] = useState({});
  const [machineData, setMachineData] = useState([]);
  const [materialStats, setMaterialStats] = useState({});
  const [productEfficiency, setProductEfficiency] = useState([]);
  const [machineEfficiencyRatio, setMachineEfficiencyRatio] = useState([]);
  const [wasteData, setWasteData] = useState([]);
  const [anomalies, setAnomalies] = useState({});
  const [spcData, setSpcData] = useState([]);
  const [prediction, setPrediction] = useState(0);

  useEffect(() => {
    API.get("/production/summary/today").then(res =>
      setSummary(res.data)
    );

    API.get("/production/analytics/machine-efficiency").then(res =>
      setMachineData(res.data)
    );

    API.get("/production/analytics/material-efficiency").then(res =>
      setMaterialStats(res.data)
    );

    API.get("/production/analytics/product-efficiency").then(res =>
      setProductEfficiency(res.data)
    );

    API.get("/production/analytics/machine-efficiency-ratio").then(res =>
      setMachineEfficiencyRatio(res.data)
    );

    API.get("/production/analytics/waste-percentage").then(res =>
      setWasteData(res.data)
    );

    API.get("/production/analytics/anomalies").then(res =>
      setAnomalies(res.data)
    );

    API.get("/production/analytics/spc-efficiency").then(res =>
      setSpcData(res.data)
    );

    API.get("/production/analytics/predict-efficiency").then(res =>
      setPrediction(res.data.prediction)
    );
  }, []);

  const avgWaste =
    wasteData.length > 0
      ? (
          wasteData.reduce((sum, w) => sum + w.wastePercentage, 0) /
          wasteData.length
        ).toFixed(2)
      : 0;

  const machineChart = {
    labels: machineData.map(m => m.machineName),
    datasets: [
      {
        label: "Machine Efficiency (%)",
        data: machineData.map(m => m.avgEfficiency)
      }
    ]
  };

  const machineRatioChart = {
    labels: machineEfficiencyRatio.map(m => m.machineName),
    datasets: [
      {
        label: "Machine Efficiency (units/kg)",
        data: machineEfficiencyRatio.map(m => m.efficiency)
      }
    ]
  };

  const productChart = {
    labels: productEfficiency.map(p => p.productName),
    datasets: [
      {
        label: "Product Efficiency (units/kg)",
        data: productEfficiency.map(p => p.efficiency)
      }
    ]
  };

  const spcChart = {
    labels: spcData.map(d =>
      new Date(d.date).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Efficiency",
        data: spcData.map(d => d.efficiency),
        borderWidth: 2
      },
      {
        label: "Mean",
        data: spcData.map(d => d.mean),
        borderDash: [5, 5]
      },
      {
        label: "UCL",
        data: spcData.map(d => d.UCL),
        borderDash: [3, 3]
      },
      {
        label: "LCL",
        data: spcData.map(d => d.LCL),
        borderDash: [3, 3]
      }
    ]
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3}>
        Production Intelligence Dashboard
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography>Total Production Today</Typography>
            <Typography variant="h6">
              {summary.totalProduction || 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography>Material Used (kg)</Typography>
            <Typography variant="h6">
              {summary.totalRawMaterial || 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography>Average Efficiency (%)</Typography>
            <Typography variant="h6">
              {summary.avgEfficiency || 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography>Predicted Next Efficiency</Typography>
            <Typography variant="h6">
              {prediction || 0} %
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Waste + Anomaly */}
      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography>Average Waste %</Typography>
            <Typography variant="h6">
              {avgWaste} %
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography>Anomalies Detected</Typography>
            <Typography variant="h6">
              {anomalies.anomalyCount || 0}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts */}
      <Box mt={5}>
        <Typography variant="h6" mb={2}>
          SPC Control Chart (Efficiency Stability)
        </Typography>
        <Line data={spcChart} />
      </Box>

      <Box mt={5}>
        <Typography variant="h6" mb={2}>
          Machine Efficiency (%)
        </Typography>
        <Bar data={machineChart} />
      </Box>

      <Box mt={5}>
        <Typography variant="h6" mb={2}>
          Machine Efficiency (units/kg)
        </Typography>
        <Bar data={machineRatioChart} />
      </Box>

      <Box mt={5}>
        <Typography variant="h6" mb={2}>
          Product Efficiency (units/kg)
        </Typography>
        <Bar data={productChart} />
      </Box>
    </Box>
  );
};

export default ProductionDashboard;
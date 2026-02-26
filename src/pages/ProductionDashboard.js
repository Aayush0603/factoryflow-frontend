import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import { Bar, Line } from "react-chartjs-2";
import API from "../api";

const ProductionDashboard = () => {
  const [summary, setSummary] = useState({});
  const [machineData, setMachineData] = useState([]);
  const [productEfficiency, setProductEfficiency] = useState([]);
  const [machineEfficiencyRatio, setMachineEfficiencyRatio] = useState([]);
  const [wasteData, setWasteData] = useState([]);
  const [anomalies, setAnomalies] = useState({});
  const [spcData, setSpcData] = useState([]);
  const [prediction, setPrediction] = useState(0);

  useEffect(() => {
    fetchProductionData();
  }, []);

  const fetchProductionData = async () => {
    try {
      const [
        summaryRes,
        machineRes,
        productRes,
        machineRatioRes,
        wasteRes,
        anomalyRes,
        spcRes,
        predictionRes
      ] = await Promise.all([
        API.get("/api/production/summary/today"),
        API.get("/api/production/analytics/machine-efficiency"),
        API.get("/api/production/analytics/product-efficiency"),
        API.get("/api/production/analytics/machine-efficiency-ratio"),
        API.get("/api/production/analytics/waste-percentage"),
        API.get("/api/production/analytics/anomalies"),
        API.get("/api/production/analytics/spc-efficiency"),
        API.get("/api/production/analytics/predict-efficiency")
      ]);

      setSummary(summaryRes.data);
      setMachineData(machineRes.data);
      setProductEfficiency(productRes.data);
      setMachineEfficiencyRatio(machineRatioRes.data);
      setWasteData(wasteRes.data);
      setAnomalies(anomalyRes.data);
      setSpcData(spcRes.data);
      setPrediction(predictionRes.data.prediction);

    } catch (error) {
      console.error("Production dashboard error:", error);
    }
  };

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

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
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
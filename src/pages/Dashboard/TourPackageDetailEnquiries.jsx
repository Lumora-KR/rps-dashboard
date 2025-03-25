// client/src/pages/Dashboard/TourPackageDetailEnquiries.jsx
import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Grid,
  Paper,
  CircularProgress,
  Divider,
  Chip,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import EnquiryList from "../../components/EnquiryList/EnquiryList";
import { api } from "../../utils/api";
import "./Dashboard.css";

// Tour Package Detail enquiry details component
const TourPackageDetailEnquiryDetails = ({ row }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle1" gutterBottom>
          Customer Information
        </Typography>
        <Box className="details-section">
          <Typography variant="body2">
            <strong>Name:</strong> {row.name}
          </Typography>
          <Typography variant="body2">
            <strong>Email:</strong> {row.email}
          </Typography>
          <Typography variant="body2">
            <strong>Phone:</strong> {row.phone}
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12} md={6}>
        <Typography variant="subtitle1" gutterBottom>
          Package Details
        </Typography>
        <Box className="details-section">
          <Typography variant="body2">
            <strong>Package Name:</strong> {row.packageName}
          </Typography>
          <Typography variant="body2">
            <strong>Travel Date:</strong>{" "}
            {row.travelDate
              ? new Date(row.travelDate).toLocaleDateString()
              : "Not specified"}
          </Typography>
          <Typography variant="body2">
            <strong>Adults:</strong> {row.adults || "1"}
          </Typography>
          <Typography variant="body2">
            <strong>Children:</strong> {row.children || "0"}
          </Typography>
        </Box>
      </Grid>

      {row.message && (
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Message
          </Typography>
          <Box className="details-section">
            <Typography variant="body2">{row.message}</Typography>
          </Box>
        </Grid>
      )}

      <Grid item xs={12}>
        <Typography variant="body2" color="textSecondary">
          <strong>Submitted:</strong> {new Date(row.createdAt).toLocaleString()}
        </Typography>
      </Grid>
    </Grid>
  );
};

const TourPackageDetailEnquiries = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enquiries, setEnquiries] = useState([]);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchTourPackageDetailEnquiries = async () => {
      try {
        setLoading(true);

        // Fetch tour package detail enquiries and chart data
        const [enquiriesRes, chartDataRes] = await Promise.all([
          api.getTourPackageDetails(),
          api.getTourPackageChartData(),
        ]);

        setEnquiries(enquiriesRes.data);
        setChartData(chartDataRes.data);
      } catch (err) {
        console.error("Error fetching tour package detail enquiries:", err);
        setError(
          "Failed to load tour package detail enquiries. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTourPackageDetailEnquiries();
  }, []);

  // Table columns configuration
  const columns = [
    {
      id: "name",
      label: "Customer Name",
      align: "left",
    },
    {
      id: "packageName",
      label: "Package Name",
      align: "left",
    },
    {
      id: "travelDate",
      label: "Travel Date",
      align: "left",
      format: (value) =>
        value ? new Date(value).toLocaleDateString() : "Not specified",
    },
    {
      id: "adults",
      label: "Adults",
      align: "center",
      format: (value) => value || "1",
    },
    {
      id: "children",
      label: "Children",
      align: "center",
      format: (value) => value || "0",
    },
    {
      id: "createdAt",
      label: "Submitted On",
      align: "right",
      format: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  if (loading) {
    return (
      <Box className="loading-container">
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading tour package detail enquiries...
        </Typography>
      </Box>
    );
  }

  return (
    <div className="tour-package-detail-enquiries-page">
      <Typography variant="h4" component="h1" className="page-title">
        Tour Package Detail Enquiries
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className="chart-container" elevation={2}>
            <Box className="chart-header">
              <Typography variant="h6">
                Daily Tour Package Detail Enquiries (Last 30 Days)
              </Typography>
              <Chip
                label={`Total: ${enquiries.length}`}
                color="primary"
                size="small"
              />
            </Box>
            <Divider />
            <Box className="chart-content">
              {chartData ? (
                <Bar
                  data={{
                    ...chartData,
                    datasets: [
                      {
                        ...chartData.datasets[0],
                        backgroundColor: "rgba(255, 152, 0, 0.5)",
                        borderColor: "rgba(255, 152, 0, 1)",
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          precision: 0,
                        },
                      },
                    },
                  }}
                  height={300}
                />
              ) : (
                <Box className="no-chart-data">
                  <Typography variant="body1">
                    No chart data available
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <EnquiryList
            data={enquiries}
            columns={columns}
            detailsComponent={TourPackageDetailEnquiryDetails}
            loading={loading}
            error={error}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default TourPackageDetailEnquiries;

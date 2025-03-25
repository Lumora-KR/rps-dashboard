// client/src/pages/Dashboard/CarRentalDetailEnquiries.jsx
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

// Car Rental Detail enquiry details component
const CarRentalDetailEnquiryDetails = ({ row }) => {
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
          Rental Details
        </Typography>
        <Box className="details-section">
          <Typography variant="body2">
            <strong>Car Model:</strong> {row.carModel}
          </Typography>
          <Typography variant="body2">
            <strong>From Location:</strong> {row.fromLocation}
          </Typography>
          <Typography variant="body2">
            <strong>To Location:</strong> {row.toLocation}
          </Typography>
          <Typography variant="body2">
            <strong>Pickup Date:</strong>{" "}
            {new Date(row.pickupDate).toLocaleDateString()}
          </Typography>
          {row.returnDate && (
            <Typography variant="body2">
              <strong>Return Date:</strong>{" "}
              {new Date(row.returnDate).toLocaleDateString()}
            </Typography>
          )}
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

const CarRentalDetailEnquiries = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enquiries, setEnquiries] = useState([]);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchCarRentalDetailEnquiries = async () => {
      try {
        setLoading(true);

        // Fetch car rental detail enquiries and chart data
        const [enquiriesRes, chartDataRes] = await Promise.all([
          api.getCarRentalDetails(),
          api.getCarRentalChartData(),
        ]);

        setEnquiries(enquiriesRes.data);
        setChartData(chartDataRes.data);
      } catch (err) {
        console.error("Error fetching car rental detail enquiries:", err);
        setError(
          "Failed to load car rental detail enquiries. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCarRentalDetailEnquiries();
  }, []);

  // Table columns configuration
  const columns = [
    {
      id: "name",
      label: "Customer Name",
      align: "left",
    },
    {
      id: "carModel",
      label: "Car Model",
      align: "left",
    },
    {
      id: "fromLocation",
      label: "From",
      align: "left",
    },
    {
      id: "toLocation",
      label: "To",
      align: "left",
    },
    {
      id: "pickupDate",
      label: "Pickup Date",
      align: "left",
      format: (value) => (value ? new Date(value).toLocaleDateString() : "N/A"),
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
          Loading car rental detail enquiries...
        </Typography>
      </Box>
    );
  }

  return (
    <div className="car-rental-detail-enquiries-page">
      <Typography variant="h4" component="h1" className="page-title">
        Car Rental Detail Enquiries
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className="chart-container" elevation={2}>
            <Box className="chart-header">
              <Typography variant="h6">
                Daily Car Rental Detail Enquiries (Last 30 Days)
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
                        backgroundColor: "rgba(156, 39, 176, 0.5)",
                        borderColor: "rgba(156, 39, 176, 1)",
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
            detailsComponent={CarRentalDetailEnquiryDetails}
            loading={loading}
            error={error}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default CarRentalDetailEnquiries;

// client/src/pages/Dashboard/HotelEnquiries.jsx
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

// Hotel enquiry details component
const HotelEnquiryDetails = ({ row }) => {
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
          Booking Details
        </Typography>
        <Box className="details-section">
          <Typography variant="body2">
            <strong>Destination:</strong> {row.destination}
          </Typography>
          <Typography variant="body2">
            <strong>Check-in Date:</strong>{" "}
            {new Date(row.checkIn).toLocaleDateString()}
          </Typography>
          <Typography variant="body2">
            <strong>Check-out Date:</strong>{" "}
            {new Date(row.checkOut).toLocaleDateString()}
          </Typography>
          <Typography variant="body2">
            <strong>Rooms:</strong> {row.rooms || "1"}
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="body2" color="textSecondary">
          <strong>Submitted:</strong> {new Date(row.createdAt).toLocaleString()}
        </Typography>
      </Grid>
    </Grid>
  );
};

const HotelEnquiries = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enquiries, setEnquiries] = useState([]);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchHotelEnquiries = async () => {
      try {
        setLoading(true);

        // Fetch hotel enquiries and chart data
        const [enquiriesRes, chartDataRes] = await Promise.all([
          api.getHomeEnquiriesByType("hotels"),
          api.getHomeEnquiriesChartData("hotels"),
        ]);

        setEnquiries(enquiriesRes.data);
        setChartData(chartDataRes.data);
      } catch (err) {
        console.error("Error fetching hotel enquiries:", err);
        setError("Failed to load hotel enquiries. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotelEnquiries();
  }, []);

  // Table columns configuration
  const columns = [
    {
      id: "name",
      label: "Customer Name",
      align: "left",
    },
    {
      id: "destination",
      label: "Destination",
      align: "left",
    },
    {
      id: "checkIn",
      label: "Check-in Date",
      align: "left",
      format: (value) => (value ? new Date(value).toLocaleDateString() : "N/A"),
    },
    {
      id: "checkOut",
      label: "Check-out Date",
      align: "left",
      format: (value) => (value ? new Date(value).toLocaleDateString() : "N/A"),
    },
    {
      id: "rooms",
      label: "Rooms",
      align: "left",
      format: (value) => value || "1",
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
          Loading hotel enquiries...
        </Typography>
      </Box>
    );
  }

  return (
    <div className="hotel-enquiries-page">
      <Typography variant="h4" component="h1" className="page-title">
        Hotel Enquiries
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className="chart-container" elevation={2}>
            <Box className="chart-header">
              <Typography variant="h6">
                Daily Hotel Enquiries (Last 30 Days)
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
                        backgroundColor: "rgba(76, 175, 80, 0.5)",
                        borderColor: "rgba(76, 175, 80, 1)",
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
            detailsComponent={HotelEnquiryDetails}
            loading={loading}
            error={error}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default HotelEnquiries;

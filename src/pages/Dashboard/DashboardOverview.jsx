// client/src/pages/Dashboard/DashboardOverview.jsx
import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  DirectionsCar as CarIcon,
  Map as MapIcon,
  Apartment as HotelIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { api } from "../../utils/api";
import "./Dashboard.css";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardOverview = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    cars: 0,
    tourPackages: 0,
    hotels: 0,
    tourPackageDetails: 0,
    carRentalDetails: 0,
    contactForms: 0,
  });
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch all enquiries
        const [
          carsRes,
          // tourPackagesRes,
          hotelsRes,
          tourPackageDetailsRes,
          carRentalDetailsRes,
          contactFormsRes,
          chartDataRes,
        ] = await Promise.all([
          api.getHomeEnquiriesByType("cars"),
          api.getHomeEnquiriesByType("tourPackages"),
          api.getHomeEnquiriesByType("hotels"),
          api.getTourPackageDetails(),
          api.getCarRentalDetails(),
          api.getContactForms(),
          api.getHomeEnquiriesChartData(),
        ]);

        // Update stats
        setStats({
          cars: carsRes.data.length,
          tourPackages: tourPackagesRes.data.length,
          hotels: hotelsRes.data.length,
          tourPackageDetails: tourPackageDetailsRes.data.length,
          carRentalDetails: carRentalDetailsRes.data.length,
          contactForms: contactFormsRes.data.length,
        });

        // Set chart data
        setChartData(chartDataRes.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: "Car Enquiries",
      value: stats.cars,
      icon: <CarIcon fontSize="large" className="stat-icon car-icon" />,
      color: "#3f51b5",
    },
    {
      title: "Tour Package Enquiries",
      value: stats.tourPackages,
      icon: <MapIcon fontSize="large" className="stat-icon tour-icon" />,
      color: "#f44336",
    },
    {
      title: "Hotel Enquiries",
      value: stats.hotels,
      icon: <HotelIcon fontSize="large" className="stat-icon hotel-icon" />,
      color: "#4caf50",
    },
    {
      title: "Tour Package Detail Enquiries",
      value: stats.tourPackageDetails,
      icon: <MapIcon fontSize="large" className="stat-icon tour-detail-icon" />,
      color: "#ff9800",
    },
    {
      title: "Car Rental Detail Enquiries",
      value: stats.carRentalDetails,
      icon: <CarIcon fontSize="large" className="stat-icon car-detail-icon" />,
      color: "#9c27b0",
    },
    {
      title: "Contact Form Submissions",
      value: stats.contactForms,
      icon: <EmailIcon fontSize="large" className="stat-icon contact-icon" />,
      color: "#00bcd4",
    },
  ];

  if (loading) {
    return (
      <Box className="loading-container">
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading dashboard data...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="error-container">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <div className="dashboard-overview">
      <Typography variant="h4" component="h1" className="page-title">
        Dashboard Overview
      </Typography>

      <Grid container spacing={3} className="stats-container">
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card className="stat-card">
              <CardContent>
                <Box className="stat-content">
                  <Box
                    className="stat-icon-container"
                    sx={{ backgroundColor: `${stat.color}20` }}
                  >
                    {React.cloneElement(stat.icon, {
                      style: { color: stat.color },
                    })}
                  </Box>
                  <Box className="stat-text">
                    <Typography variant="h3" className="stat-value">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" className="stat-title">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper className="chart-container" elevation={2}>
        <CardHeader
          title="Enquiries Overview (Last 30 Days)"
          subheader="Daily enquiry submissions across all forms"
        />
        <Divider />
        <CardContent>
          {chartData ? (
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
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
              <Typography variant="body1">No chart data available</Typography>
            </Box>
          )}
        </CardContent>
      </Paper>
    </div>
  );
};

export default DashboardOverview;

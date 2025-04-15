"use client";

import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { apiService } from "../../services/api";
import { ThemeContext } from "../../contexts/ThemeContext";
import "./DashboardOverview.css";

// Import MUI icons
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import RefreshIcon from "@mui/icons-material/Refresh";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import BackpackIcon from "@mui/icons-material/Backpack";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const DashboardOverview = () => {
  // Provide default values in case ThemeContext is undefined
  const themeContext = useContext(ThemeContext) || {
    darkMode: false,
    toggleDarkMode: () => {},
  };
  const { darkMode, toggleDarkMode } = themeContext;

  const [stats, setStats] = useState({
    tourPackageDetails: 0,
    carRentalDetails: 0,
    hotelEnquiries: 0,
    contactForms: 0,
  });

  const [chartData, setChartData] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [quickStats, setQuickStats] = useState({
    today: 0,
    week: 0,
    month: 0,
    conversionRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const COLORS = [
    "#4361ee", // Primary blue
    "#ff9800", // Orange
    "#2ec4b6", // Teal
    "#e63946", // Red
    "#ff9f1c", // Amber
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // console.log("Fetching dashboard data...");

      // Fetch all data in parallel
      const [statsData, chartData, activityData, quickStatsData] =
        await Promise.all([
          apiService.getDashboardStats(),
          apiService.getChartData(),
          apiService.getRecentActivity(),
          apiService.getQuickStats(),
        ]);

      // console.log("Stats data:", statsData);
      // console.log("Chart data:", chartData);
      // console.log("Activity data:", activityData);
      // console.log("Quick stats data:", quickStatsData);

      // Check if data is valid before setting state
      if (statsData) {
        setStats(statsData);
      } else {
        // console.error("Invalid stats data received");
      }

      if (chartData) {
        setChartData(chartData);
      } else {
        // console.error("Invalid chart data received");
      }

      if (Array.isArray(activityData)) {
        setRecentActivity(activityData);
      } else {
        // console.error("Invalid activity data received");
      }

      if (quickStatsData) {
        setQuickStats(quickStatsData);
      } else {
        // console.error("Invalid quick stats data received");
      }

      setLoading(false);
    } catch (error) {
      // console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data. Please try again later.");
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  // Prepare data for the overview chart
  const prepareOverviewData = () => {
    if (
      !chartData ||
      !chartData.tourPackageDetails ||
      !chartData.carRentalDetails ||
      !chartData.hotelEnquiries ||
      !chartData.contactForms
    ) {
      // console.error("Chart data is missing or incomplete:", chartData);

      // Return a default structure to prevent rendering errors
      return {
        labels: ["No data available"],
        datasets: [
          {
            label: "Tour Package Enquiries",
            data: [0],
            borderColor: "#ff9800",
            backgroundColor: "rgba(255, 152, 0, 0.1)",
            tension: 0.4,
            fill: true,
            pointBackgroundColor: "#ff9800",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: "Car Rental Enquiries",
            data: [0],
            borderColor: "#2ec4b6",
            backgroundColor: "rgba(46, 196, 182, 0.1)",
            tension: 0.4,
            fill: true,
            pointBackgroundColor: "#2ec4b6",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: "Hotel Enquiries",
            data: [0],
            borderColor: "#4361ee",
            backgroundColor: "rgba(67, 97, 238, 0.1)",
            tension: 0.4,
            fill: true,
            pointBackgroundColor: "#4361ee",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: "Contact Form Submissions",
            data: [0],
            borderColor: "#e63946",
            backgroundColor: "rgba(230, 57, 70, 0.1)",
            tension: 0.4,
            fill: true,
            pointBackgroundColor: "#e63946",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      };
    }

    return {
      labels: chartData.tourPackageDetails.labels,
      datasets: [
        {
          label: "Tour Package Enquiries",
          data: chartData.tourPackageDetails.datasets[0].data,
          borderColor: "#ff9800",
          backgroundColor: "rgba(255, 152, 0, 0.1)",
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#ff9800",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: "Car Rental Enquiries",
          data: chartData.carRentalDetails.datasets[0].data,
          borderColor: "#2ec4b6",
          backgroundColor: "rgba(46, 196, 182, 0.1)",
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#2ec4b6",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: "Hotel Enquiries",
          data: chartData.hotelEnquiries.datasets[0].data,
          borderColor: "#4361ee",
          backgroundColor: "rgba(67, 97, 238, 0.1)",
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#4361ee",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: "Contact Form Submissions",
          data: chartData.contactForms.datasets[0].data,
          borderColor: "#e63946",
          backgroundColor: "rgba(230, 57, 70, 0.1)",
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#e63946",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  };

  // Prepare data for the distribution pie chart
  const prepareDistributionData = () => {
    if (!stats) return [];

    return [
      { name: "Tour Packages", value: stats.tourPackageDetails || 0 },
      { name: "Car Rentals", value: stats.carRentalDetails || 0 },
      { name: "Hotel Bookings", value: stats.hotelEnquiries || 0 },
      { name: "Contact Forms", value: stats.contactForms || 0 },
    ];
  };

  // Format relative time for activity feed
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  // Get icon for activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case "tourPackage":
        return <BackpackIcon className="activity-icon-svg" />;
      case "carRental":
        return <DirectionsCarIcon className="activity-icon-svg" />;
      case "hotel":
        return <HomeIcon className="activity-icon-svg" />;
      case "contact":
        return <EmailIcon className="activity-icon-svg" />;
      case "user":
        return <PersonIcon className="activity-icon-svg" />;
      default:
        return <AccessTimeIcon className="activity-icon-svg" />;
    }
  };

  // Get color for activity type
  const getActivityColor = (type) => {
    switch (type) {
      case "tourPackage":
        return "activity-icon-warning";
      case "carRental":
        return "activity-icon-success";
      case "hotel":
        return "activity-icon-primary";
      case "contact":
        return "activity-icon-danger";
      case "user":
        return "activity-icon-info";
      default:
        return "activity-icon-secondary";
    }
  };

  if (loading) {
    return (
      <div className={`loading-container ${darkMode ? "dark" : "light"}`}>
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <ErrorOutlineIcon className="error-icon" />
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className={`dashboard-container ${darkMode ? "dark" : "light"}`}>
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Dashboard Overview</h1>
          <p className="dashboard-subtitle">Welcome to RPS Tours Dashboard</p>
        </div>
        <div className="header-actions">
          <button
            className="theme-toggle-btn"
            onClick={toggleDarkMode}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            <span className="btn-text">
              {darkMode ? "Light Mode" : "Dark Mode"}
            </span>
          </button>
          <button
            className="refresh-btn"
            onClick={handleRefresh}
            disabled={refreshing}
            aria-label="Refresh dashboard data"
          >
            <RefreshIcon className={refreshing ? "spin" : ""} />
            <span className="btn-text">Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon-primary">
            <CalendarMonthIcon />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats?.tourPackageDetails || 0}</h3>
            <p className="stat-label">Tour Package Enquiries</p>
            <div className="stat-link">
              <Link to="/tour-package-detail-enquiries">View Details</Link>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-success">
            <DirectionsCarIcon />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats?.carRentalDetails || 0}</h3>
            <p className="stat-label">Car Rental Enquiries</p>
            <div className="stat-link">
              <Link to="/car-rental-detail-enquiries">View Details</Link>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-warning">
            <HomeIcon />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats?.hotelEnquiries || 0}</h3>
            <p className="stat-label">Hotel Enquiries</p>
            <div className="stat-link">
              <Link to="/dashboard/hotel-enquiries">View Details</Link>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-danger">
            <EmailIcon />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats?.contactForms || 0}</h3>
            <p className="stat-label">Contact Form Submissions</p>
            <div className="stat-link">
              <Link to="/contact-form-submissions">View Details</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-container">
        <div className="chart-card line-chart-card">
          <div className="chart-header">
            <h2 className="chart-title">Enquiries Overview</h2>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={(prepareOverviewData()?.labels || []).map(
                  (label, index) => {
                    const datasets = prepareOverviewData()?.datasets || [];
                    return {
                      name: label,
                      tourPackages: datasets[0]?.data[index] || 0,
                      carRentals: datasets[1]?.data[index] || 0,
                      hotels: datasets[2]?.data[index] || 0,
                      contacts: datasets[3]?.data[index] || 0,
                    };
                  }
                )}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={darkMode ? "#444" : "#eee"}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: darkMode ? "#f8f9fa" : "#333" }}
                />
                <YAxis tick={{ fill: darkMode ? "#f8f9fa" : "#333" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? "#333" : "#fff",
                    color: darkMode ? "#f8f9fa" : "#333",
                    border: `1px solid ${darkMode ? "#555" : "#ddd"}`,
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="tourPackages"
                  name="Tour Packages"
                  stroke="#ff9800"
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="carRentals"
                  name="Car Rentals"
                  stroke="#2ec4b6"
                />
                <Line
                  type="monotone"
                  dataKey="hotels"
                  name="Hotels"
                  stroke="#4361ee"
                />
                <Line
                  type="monotone"
                  dataKey="contacts"
                  name="Contacts"
                  stroke="#e63946"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card pie-chart-card">
          <div className="chart-header">
            <h2 className="chart-title">Enquiry Distribution</h2>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={prepareDistributionData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {prepareDistributionData().map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} enquiries`, "Count"]}
                  contentStyle={{
                    backgroundColor: darkMode ? "#333" : "#fff",
                    color: darkMode ? "#f8f9fa" : "#333",
                    border: `1px solid ${darkMode ? "#555" : "#ddd"}`,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="info-container">
        <div className="info-card activity-card">
          <div className="info-header">
            <h2 className="info-title">Recent Activity</h2>
          </div>
          <div className="info-body">
            <div className="activity-timeline">
              {recentActivity && recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div className="activity-item" key={index}>
                    <div
                      className={`activity-icon ${getActivityColor(
                        activity.type
                      )}`}
                    >
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="activity-content">
                      <p className="activity-text">{activity.message}</p>
                      <p className="activity-time">
                        {formatRelativeTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data-message">No recent activity</p>
              )}
            </div>
          </div>
        </div>

        <div className="info-card stats-card">
          <div className="info-header">
            <h2 className="info-title">Quick Stats</h2>
          </div>
          <div className="info-body">
            <div className="quick-stats">
              <div className="quick-stat-item">
                <div className="quick-stat-info">
                  <h4 className="quick-stat-title">Today's Enquiries</h4>
                  <h3 className="quick-stat-value">{quickStats?.today || 0}</h3>
                </div>
                <div className="quick-stat-chart">
                  <div className="progress-bar">
                    <div
                      className="progress-fill progress-primary"
                      style={{
                        width: `${Math.min(
                          100,
                          (quickStats?.today / 20) * 100
                        )}%`,
                      }}
                      aria-valuenow={quickStats?.today}
                      aria-valuemin="0"
                      aria-valuemax="20"
                    ></div>
                  </div>
                </div>
              </div>
              <div className="quick-stat-item">
                <div className="quick-stat-info">
                  <h4 className="quick-stat-title">This Week</h4>
                  <h3 className="quick-stat-value">{quickStats?.week || 0}</h3>
                </div>
                <div className="quick-stat-chart">
                  <div className="progress-bar">
                    <div
                      className="progress-fill progress-success"
                      style={{
                        width: `${Math.min(
                          100,
                          (quickStats?.week / 100) * 100
                        )}%`,
                      }}
                      aria-valuenow={quickStats?.week}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              </div>
              <div className="quick-stat-item">
                <div className="quick-stat-info">
                  <h4 className="quick-stat-title">This Month</h4>
                  <h3 className="quick-stat-value">{quickStats?.month || 0}</h3>
                </div>
                <div className="quick-stat-chart">
                  <div className="progress-bar">
                    <div
                      className="progress-fill progress-warning"
                      style={{
                        width: `${Math.min(
                          100,
                          (quickStats?.month / 300) * 100
                        )}%`,
                      }}
                      aria-valuenow={quickStats?.month}
                      aria-valuemin="0"
                      aria-valuemax="300"
                    ></div>
                  </div>
                </div>
              </div>
              <div className="quick-stat-item">
                <div className="quick-stat-info">
                  <h4 className="quick-stat-title">Conversion Rate</h4>
                  <h3 className="quick-stat-value">
                    {quickStats?.conversionRate || 0}%
                  </h3>
                </div>
                <div className="quick-stat-chart">
                  <div className="progress-bar">
                    <div
                      className="progress-fill progress-info"
                      style={{ width: `${quickStats?.conversionRate || 0}%` }}
                      aria-valuenow={quickStats?.conversionRate}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;

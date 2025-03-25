// client/src/pages/Dashboard/ContactFormSubmissions.jsx
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

// Contact Form submission details component
const ContactFormDetails = ({ row }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle1" gutterBottom>
          Contact Information
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
          {row.subject && (
            <Typography variant="body2">
              <strong>Subject:</strong> {row.subject}
            </Typography>
          )}
        </Box>
      </Grid>

      <Grid item xs={12} md={6}>
        <Typography variant="subtitle1" gutterBottom>
          Message
        </Typography>
        <Box className="details-section message-box">
          <Typography variant="body2">{row.message}</Typography>
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

const ContactFormSubmissions = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchContactFormSubmissions = async () => {
      try {
        setLoading(true);

        // Fetch contact form submissions and chart data
        const [submissionsRes, chartDataRes] = await Promise.all([
          api.getContactForms(),
          api.getContactChartData(),
        ]);

        setSubmissions(submissionsRes.data);
        setChartData(chartDataRes.data);
      } catch (err) {
        console.error("Error fetching contact form submissions:", err);
        setError(
          "Failed to load contact form submissions. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchContactFormSubmissions();
  }, []);

  // Table columns configuration
  const columns = [
    {
      id: "name",
      label: "Name",
      align: "left",
    },
    {
      id: "email",
      label: "Email",
      align: "left",
    },
    {
      id: "phone",
      label: "Phone",
      align: "left",
    },
    {
      id: "subject",
      label: "Subject",
      align: "left",
      format: (value) => value || "Not specified",
    },
    {
      id: "message",
      label: "Message",
      align: "left",
      format: (value) =>
        value.length > 50 ? `${value.substring(0, 50)}...` : value,
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
          Loading contact form submissions...
        </Typography>
      </Box>
    );
  }

  return (
    <div className="contact-form-submissions-page">
      <Typography variant="h4" component="h1" className="page-title">
        Contact Form Submissions
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className="chart-container" elevation={2}>
            <Box className="chart-header">
              <Typography variant="h6">
                Daily Contact Form Submissions (Last 30 Days)
              </Typography>
              <Chip
                label={`Total: ${submissions.length}`}
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
                        backgroundColor: "rgba(0, 188, 212, 0.5)",
                        borderColor: "rgba(0, 188, 212, 1)",
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
            data={submissions}
            columns={columns}
            detailsComponent={ContactFormDetails}
            loading={loading}
            error={error}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default ContactFormSubmissions;

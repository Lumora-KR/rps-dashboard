"use client";

import { useState, useEffect } from "react";
import { apiService } from "../../services/api";
import EnquiryList from "../../components/EnquiryList/EnquiryList";
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
import "./CarRentalDetailEnquiries.css";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CarRentalDetailEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch enquiries
        const enquiriesData = await apiService.getCarRentalDetailEnquiries();
        setEnquiries(enquiriesData);

        // Fetch chart data
        const chartData = await apiService.getChartData();
        setChartData(chartData.carRentalDetails);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching car rental detail enquiries:", error);
        setError(
          "Failed to load car rental detail enquiries. Please try again later."
        );
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#333",
        bodyColor: "#666",
        borderColor: "#e9ecef",
        borderWidth: 1,
        padding: 10,
        boxPadding: 5,
        cornerRadius: 8,
        titleFont: {
          weight: "bold",
        },
      },
      title: {
        display: true,
        text: "Car Rental Enquiries - Last 30 Days",
        color: "#333",
        font: {
          size: 16,
          weight: "bold",
        },
        padding: {
          bottom: 20,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          precision: 0,
        },
      },
    },
    barThickness: 20,
    maxBarThickness: 30,
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading car rental enquiries...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="car-rental-detail-enquiries">
      <div className="page-header">
        <h1 className="page-title">Car Rental Enquiries</h1>
        <p className="page-subtitle">
          Manage and view all car rental enquiries
        </p>
      </div>

      <div className="row mb-4">
        <div className="col-12">
          <div className="chart-card">
            <div className="chart-container">
              {chartData && (
                <Bar
                  data={{
                    labels: chartData.labels,
                    datasets: [
                      {
                        label: "Car Rental Enquiries",
                        data: chartData.datasets[0].data,
                        backgroundColor: "rgba(46, 196, 182, 0.7)",
                        borderColor: "rgba(46, 196, 182, 1)",
                        borderWidth: 1,
                        borderRadius: 4,
                      },
                    ],
                  }}
                  options={chartOptions}
                  height={300}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <EnquiryList
            data={enquiries}
            title="All Car Rental Enquiries"
            type="carRentalDetail"
          />
        </div>
      </div>
    </div>
  );
};

export default CarRentalDetailEnquiries;

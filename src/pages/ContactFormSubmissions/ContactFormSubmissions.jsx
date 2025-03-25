"use client";

import { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Row,
  Col,
  Card,
  Table,
  Button,
  Pagination,
  Modal,
  Spinner,
  Alert,
} from "react-bootstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ThemeContext } from "../../contexts/ThemeContext";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import "./ContactFormSubmissions.css";

const ContactFormSubmissions = () => {
  // Provide default values in case ThemeContext is undefined
  const themeContext = useContext(ThemeContext) || {
    darkMode: false,
    toggleDarkMode: () => {},
  };
  const { darkMode, toggleDarkMode } = themeContext;

  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    variant: "",
    message: "",
  });
  const [refreshing, setRefreshing] = useState(false);

  // New state for time period filter and date range
  const [timePeriod, setTimePeriod] = useState("all");
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);

  const CHART_COLORS = [
    "#4361ee", // Primary blue
    "#ff9800", // Orange
    "#2ec4b6", // Teal
    "#e63946", // Red
    "#ff9f1c", // Amber
  ];

  // Format date for input fields
  const formatDateForInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    // Set initial "to" date to today
    setDateRange((prev) => ({
      ...prev,
      to: formatDateForInput(new Date()),
    }));
  }, []);

  useEffect(() => {
    fetchSubmissions();
    fetchChartData();
  }, [currentPage, searchTerm, filterPeriod]);

  useEffect(() => {
    if (submissions.length > 0) {
      filterSubmissions();
    }
  }, [submissions, timePeriod, dateRange, searchTerm]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      let url = `http://localhost:5000/api/contact?page=${currentPage}&limit=${itemsPerPage}`;

      if (searchTerm) {
        url += `&search=${searchTerm}`;
      }

      // Add time period filter
      if (filterPeriod !== "all") {
        url += `&period=${filterPeriod}`;
      }

      // Add date range filter if both dates are selected
      if (dateRange.from && dateRange.to) {
        url += `&fromDate=${dateRange.from}&toDate=${dateRange.to}`;
      }

      const response = await axios.get(url);

      if (response.data.success) {
        setSubmissions(response.data.data);
        setFilteredSubmissions(response.data.data);
        setTotalPages(response.data.pagination?.totalPages || 1);
      } else {
        setError("Failed to fetch contact form submissions");
      }
    } catch (error) {
      console.error("Error fetching contact form submissions:", error);
      setError("Error fetching contact form submissions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/contact/chart"
      );

      if (response.data.success) {
        setChartData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
      // Set default chart data
      setChartData({
        labels: [],
        datasets: [
          {
            label: "Contact Form Submissions",
            data: [],
            backgroundColor: "rgba(230, 57, 70, 0.5)",
            borderColor: "rgba(230, 57, 70, 1)",
            borderWidth: 1,
          },
        ],
      });
    }
  };

  const filterSubmissions = () => {
    let filtered = [...submissions];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (submission) =>
          submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          submission.phone.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply time period filter
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

    if (timePeriod === "today") {
      filtered = filtered.filter((submission) => {
        const submissionDate = new Date(submission.createdAt);
        return submissionDate >= today;
      });
    } else if (timePeriod === "month") {
      filtered = filtered.filter((submission) => {
        const submissionDate = new Date(submission.createdAt);
        return submissionDate >= firstDayOfMonth;
      });
    } else if (timePeriod === "year") {
      filtered = filtered.filter((submission) => {
        const submissionDate = new Date(submission.createdAt);
        return submissionDate >= firstDayOfYear;
      });
    } else if (timePeriod === "custom" && dateRange.from && dateRange.to) {
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999); // Include the entire "to" day

      filtered = filtered.filter((submission) => {
        const submissionDate = new Date(submission.createdAt);
        return submissionDate >= fromDate && submissionDate <= toDate;
      });
    }

    setFilteredSubmissions(filtered);

    // Update pagination
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    if (currentPage > Math.ceil(filtered.length / itemsPerPage)) {
      setCurrentPage(1);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSubmissions();
    await fetchChartData();
    setRefreshing(false);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDeleteClick = (submission) => {
    setCurrentSubmission(submission);
    setShowDeleteModal(true);
  };

  const handleDeleteSubmission = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/contact/${currentSubmission.id}`
      );

      if (response.data.success) {
        setShowDeleteModal(false);
        setAlertInfo({
          show: true,
          variant: "success",
          message: "Submission deleted successfully!",
        });

        // Remove the submission from the list
        setSubmissions(
          submissions.filter((sub) => sub.id !== currentSubmission.id)
        );

        // Refresh chart data
        fetchChartData();
      }
    } catch (error) {
      console.error("Error deleting submission:", error);
      setAlertInfo({
        show: true,
        variant: "danger",
        message: "Failed to delete submission. Please try again.",
      });
    }
  };

  const handleExportCSV = () => {
    // Create CSV content
    const headers = ["Name", "Email", "Phone", "Subject", "Message", "Date"];
    const csvRows = [headers];

    filteredSubmissions.forEach((submission) => {
      const row = [
        submission.name,
        submission.email,
        submission.phone,
        submission.subject || "N/A",
        submission.message,
        new Date(submission.createdAt).toLocaleDateString(),
      ];
      csvRows.push(row);
    });

    // Convert to CSV string
    const csvContent = csvRows.map((row) => row.join(",")).join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `contact-form-submissions-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleTimePeriodChange = (period) => {
    setTimePeriod(period);
    if (period === "custom") {
      setShowDateRangePicker(true);
    } else {
      setShowDateRangePicker(false);
    }
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getTimePeriodLabel = () => {
    switch (timePeriod) {
      case "today":
        return "Today";
      case "month":
        return "This Month";
      case "year":
        return "This Year";
      case "custom":
        return "Custom Range";
      default:
        return "All Time";
    }
  };

  const renderPagination = () => {
    const pages = [];

    // Previous button
    pages.push(
      <Pagination.Prev
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />
    );

    // First page
    if (currentPage > 2) {
      pages.push(
        <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
          1
        </Pagination.Item>
      );

      if (currentPage > 3) {
        pages.push(<Pagination.Ellipsis key="ellipsis1" />);
      }
    }

    // Current page and adjacent pages
    for (
      let i = Math.max(1, currentPage - 1);
      i <= Math.min(totalPages, currentPage + 1);
      i++
    ) {
      pages.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    // Last page
    if (currentPage < totalPages - 1) {
      if (currentPage < totalPages - 2) {
        pages.push(<Pagination.Ellipsis key="ellipsis2" />);
      }

      pages.push(
        <Pagination.Item
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    // Next button
    pages.push(
      <Pagination.Next
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || totalPages === 0}
      />
    );

    return <Pagination className="pagination-custom">{pages}</Pagination>;
  };

  // Get paginated data
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredSubmissions.slice(startIndex, endIndex);
  };

  const handleDateRangeFilter = () => {
    if (dateRange.from && dateRange.to) {
      setCurrentPage(1);
      fetchSubmissions();
    } else {
      setAlertInfo({
        show: true,
        variant: "warning",
        message: "Please select both start and end dates",
      });
    }
  };

  return (
    <div
      className={`dashboard-container ${
        darkMode ? "dark-theme" : "light-theme"
      }`}
    >
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Contact Form Submissions</h1>
          <p className="page-subtitle">
            Manage and view all contact form submissions
          </p>
        </div>
        <div className="header-actions">
          <Button
            variant={darkMode ? "light" : "dark"}
            className="theme-toggle-btn"
            onClick={toggleDarkMode}
          >
            {darkMode ? (
              <LightModeIcon fontSize="small" />
            ) : (
              <DarkModeIcon fontSize="small" />
            )}
            <span className="d-none d-md-inline ms-2">
              {darkMode ? "Light" : "Dark"}
            </span>
          </Button>
        </div>
      </div>

      {alertInfo.show && (
        <Alert
          variant={alertInfo.variant}
          onClose={() => setAlertInfo({ ...alertInfo, show: false })}
          dismissible
          className="custom-alert"
        >
          {alertInfo.message}
        </Alert>
      )}

      <Row className="mb-4">
        <Col lg={12}>
          <Card className="chart-card">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 monthly-enquiries">Monthly Submissions</h5>
              <Button
                variant="outline-secondary"
                size="sm"
                className="refresh-btn"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshIcon
                  fontSize="small"
                  className={refreshing ? "spin" : ""}
                />
              </Button>
            </Card.Header>
            <Card.Body>
              {chartData ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={chartData.datasets[0].data.map((value, index) => ({
                      name: chartData.labels[index]
                        .split("-")
                        .slice(1)
                        .join("/"),
                      value,
                    }))}
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
                    <Bar
                      dataKey="value"
                      name="Submissions"
                      fill="#e63946"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-5">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="table-card">
        <div className="modern-card-header">
          <h2 className="modern-header-title">Contact Form Submissions</h2>

          <div className="modern-filters-container">
            <div className="modern-search-wrapper">
              <SearchIcon className="modern-search-icon" />
              <input
                type="text"
                className="modern-search-input"
                placeholder="Search by name, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="modern-filter-wrapper">
              <select
                className="modern-select"
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
              <KeyboardArrowDownIcon className="modern-select-icon" />
            </div>

            <div className="modern-date-group">
              <div className="modern-date-label">From</div>
              <div className="modern-date-input-wrapper">
                <input
                  type="date"
                  className="modern-date-input"
                  value={dateRange.from}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, from: e.target.value })
                  }
                />
                <CalendarTodayIcon className="modern-calendar-icon" />
              </div>
            </div>

            <div className="modern-date-group">
              <div className="modern-date-label">To</div>
              <div className="modern-date-input-wrapper">
                <input
                  type="date"
                  className="modern-date-input"
                  value={dateRange.to}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, to: e.target.value })
                  }
                />
                <CalendarTodayIcon className="modern-calendar-icon" />
              </div>
            </div>

            <button
              className="modern-apply-btn"
              onClick={handleDateRangeFilter}
            >
              Apply
            </button>

            <button className="modern-export-btn" onClick={handleExportCSV}>
              <FileDownloadIcon className="modern-export-icon" />
              <span className="modern-export-text">Export</span>
            </button>
          </div>
        </div>

        <Card.Body>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <div className="table-responsive">
              <Table hover className="enquiry-table">
                <thead className={darkMode ? "thead-dark" : "thead-light"}>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getPaginatedData().length > 0 ? (
                    getPaginatedData().map((submission) => (
                      <tr key={submission.id}>
                        <td>{submission.name}</td>
                        <td>{submission.email}</td>
                        <td>{submission.phone}</td>
                        <td>{submission.subject || "N/A"}</td>
                        <td>
                          <div className="message-truncate">
                            {submission.message}
                          </div>
                        </td>
                        <td>{formatDateForDisplay(submission.createdAt)}</td>
                        <td>
                          <div className="action-buttons">
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="action-btn"
                              onClick={() => handleDeleteClick(submission)}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No submissions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center mt-4 flex-column flex-md-row">
            <div className="pagination-info mb-3 mb-md-0">
              {filteredSubmissions.length > 0 && (
                <p className="text-muted">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredSubmissions.length
                  )}{" "}
                  of {filteredSubmissions.length} entries
                </p>
              )}
            </div>
            {renderPagination()}
          </div>
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
        className={darkMode ? "dark-theme" : ""}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete this submission from{" "}
            <strong>{currentSubmission?.name}</strong>?
          </p>
          <p className="text-danger">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteSubmission}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ContactFormSubmissions;

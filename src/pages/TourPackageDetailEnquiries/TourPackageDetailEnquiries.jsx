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
  Form,
  Modal,
  Spinner,
  Alert,
  Badge,
  FormControl,
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ThemeContext } from "../../contexts/ThemeContext";
import { Edit, Trash2, RefreshCw, Moon, Sun } from "react-feather";
import "./TourPackageDetailEnquiries.css";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const TourPackageDetailEnquiries = () => {
  // Format date for input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };
  // Provide default values in case ThemeContext is undefined
  const themeContext = useContext(ThemeContext) || {
    darkMode: false,
    toggleDarkMode: () => {},
  };
  const { darkMode, toggleDarkMode } = themeContext;

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentEnquiry, setCurrentEnquiry] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    packageId: "",
    packageName: "",
    travelDate: "",
    adults: 1,
    children: 0,
    message: "",
    status: "pending",
  });
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    variant: "",
    message: "",
  });
  const [refreshing, setRefreshing] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState("all");

  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });

  const STATUS_COLORS = {
    pending: "#FFC107",
    confirmed: "#28A745",
    cancelled: "#DC3545",
    completed: "#6C757D",
  };

  const CHART_COLORS = [
    "#4361ee", // Primary blue
    "#ff9800", // Orange
    "#2ec4b6", // Teal
    "#e63946", // Red
    "#ff9f1c", // Amber
  ];

  useEffect(() => {
    fetchEnquiries();
    fetchChartData();
  }, [currentPage, filterStatus, searchTerm, filterPeriod]);

  useEffect(() => {
    // Set initial "to" date to today
    setDateRange((prev) => ({
      ...prev,
      to: formatDateForInput(new Date()),
    }));
  }, []);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      let url = `http://localhost:5000/api/tour-package-detail?page=${currentPage}&limit=${itemsPerPage}`;

      if (filterStatus !== "all") {
        url += `&status=${filterStatus}`;
      }

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
        setEnquiries(response.data.data);
        setTotalPages(response.data.pagination?.totalPages || 1);
      } else {
        setError("Failed to fetch enquiries");
      }
    } catch (error) {
      console.error("Error fetching tour package detail enquiries:", error);
      setError(
        "Error fetching tour package detail enquiries. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/tour-package-detail/stats/chart"
      );

      if (response.data.success) {
        setChartData(response.data.data);

        // Process status data for pie chart if available
        if (response.data.data.statusData) {
          const statusData = {
            labels: response.data.data.statusData.map(
              (item) =>
                item.status.charAt(0).toUpperCase() + item.status.slice(1)
            ),
            datasets: [
              {
                data: response.data.data.statusData.map((item) => item.count),
                backgroundColor: response.data.data.statusData.map(
                  (item) => STATUS_COLORS[item.status] || CHART_COLORS[0]
                ),
                borderColor: response.data.data.statusData.map(
                  (item) => STATUS_COLORS[item.status] || CHART_COLORS[0]
                ),
                borderWidth: 1,
              },
            ],
          };
          setStatusData(statusData);
        }
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
      // Set default chart data
      setChartData({
        labels: [],
        datasets: [
          {
            label: "Tour Package Detail Enquiries",
            data: [],
            backgroundColor: "rgba(255, 152, 0, 0.5)",
            borderColor: "rgba(255, 152, 0, 1)",
            borderWidth: 1,
          },
        ],
      });

      // Set default status data
      setStatusData({
        labels: ["Pending", "Confirmed", "Cancelled"],
        datasets: [
          {
            data: [0, 0, 0],
            backgroundColor: [
              STATUS_COLORS.pending,
              STATUS_COLORS.confirmed,
              STATUS_COLORS.cancelled,
            ],
            borderColor: [
              STATUS_COLORS.pending,
              STATUS_COLORS.confirmed,
              STATUS_COLORS.cancelled,
            ],
            borderWidth: 1,
          },
        ],
      });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchEnquiries();
    await fetchChartData();
    setRefreshing(false);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEditClick = (enquiry) => {
    setCurrentEnquiry(enquiry);
    setFormData({
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone,
      packageId: enquiry.packageId,
      packageName: enquiry.packageName,
      travelDate: formatDateForInput(enquiry.travelDate),
      adults: enquiry.adults || 1,
      children: enquiry.children || 0,
      message: enquiry.message,
      status: enquiry.status || "pending",
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (enquiry) => {
    setCurrentEnquiry(enquiry);
    setShowDeleteModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdateEnquiry = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/tour-package-detail/${currentEnquiry.id}`,
        formData
      );

      if (response.data.success) {
        setShowEditModal(false);
        setAlertInfo({
          show: true,
          variant: "success",
          message: "Enquiry updated successfully!",
        });

        // Update the enquiry in the list
        setEnquiries(
          enquiries.map((enq) =>
            enq.id === currentEnquiry.id ? response.data.data : enq
          )
        );

        // Refresh chart data
        fetchChartData();
      }
    } catch (error) {
      console.error("Error updating enquiry:", error);
      setAlertInfo({
        show: true,
        variant: "danger",
        message: "Failed to update enquiry. Please try again.",
      });
    }
  };

  const handleDeleteEnquiry = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/tour-package-detail/${currentEnquiry.id}`
      );

      if (response.data.success) {
        setShowDeleteModal(false);
        setAlertInfo({
          show: true,
          variant: "success",
          message: "Enquiry deleted successfully!",
        });

        // Remove the enquiry from the list
        setEnquiries(enquiries.filter((enq) => enq.id !== currentEnquiry.id));

        // Refresh chart data
        fetchChartData();
      }
    } catch (error) {
      console.error("Error deleting enquiry:", error);
      setAlertInfo({
        show: true,
        variant: "danger",
        message: "Failed to delete enquiry. Please try again.",
      });
    }
  };

  const handleExportCSV = () => {
    // Create CSV content
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Package",
      "Travel Date",
      "Adults",
      "Children",
      "Status",
    ];
    const csvRows = [headers];

    enquiries.forEach((enquiry) => {
      const row = [
        enquiry.name,
        enquiry.email,
        enquiry.phone,
        enquiry.packageName || enquiry.packageId,
        formatDateForDisplay(enquiry.travelDate),
        enquiry.adults,
        enquiry.children,
        enquiry.status,
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
      `tour-package-enquiries-${new Date().toISOString().split("T")[0]}.csv`
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

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "confirmed":
        return "status-confirmed";
      case "cancelled":
        return "status-cancelled";
      case "completed":
        return "status-completed";
      default:
        return "status-pending";
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

  const handleDateRangeFilter = () => {
    if (dateRange.from && dateRange.to) {
      setCurrentPage(1);
      fetchEnquiries();
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
          <h1 className="page-title">Tour Package Detail Enquiries</h1>
          <p className="page-subtitle">
            Manage and view all tour package detail enquiries
          </p>
        </div>
        <div className="header-actions">
          <Button
            variant={darkMode ? "light" : "dark"}
            className="theme-toggle-btn"
            onClick={toggleDarkMode}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
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
        <Col lg={8}>
          <Card className="chart-card">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 monthly-enquiries">Monthly Enquiries</h5>
              <Button
                variant="outline-secondary"
                size="sm"
                className="refresh-btn"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw size={14} className={refreshing ? "spin" : ""} />
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
                      name="Enquiries"
                      fill="#ff9800"
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
        <Col lg={4}>
          <Card className="chart-card">
            <Card.Header>
              <h5 className="mb-0">Enquiry Status</h5>
            </Card.Header>
            <Card.Body>
              {statusData ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData.labels.map((label, index) => ({
                        name: label,
                        value: statusData.datasets[0].data[index],
                      }))}
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
                      {statusData.labels.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={statusData.datasets[0].backgroundColor[index]}
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
        {/* <Card.Header className="card-header-container">
          <h5 className="card-header-title">Tour Package Detail Enquiries</h5>
          <div className="card-header-filters">
            <div className="search-container">
              <i className="bi bi-search search-icon"></i>
              <FormControl
                className="search-input"
                placeholder="Search by name, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Form.Select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </Form.Select>

            <div className="date-range-container">
              <div className="date-input-group">
                <span className="date-label">From</span>
                <Form.Control
                  type="date"
                  className="date-input"
                  value={dateRange.from}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, from: e.target.value })
                  }
                />
                <i className="bi bi-calendar date-icon"></i>
              </div>
              <div className="date-input-group">
                <span className="date-label">To</span>
                <Form.Control
                  type="date"
                  className="date-input"
                  value={dateRange.to}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, to: e.target.value })
                  }
                />
                <i className="bi bi-calendar date-icon"></i>
              </div>
            </div>

            <Button
              variant="secondary"
              onClick={handleDateRangeFilter}
              className="apply-btn"
            >
              Apply
            </Button>

            <Button
              variant="outline-primary"
              className="export-btn"
              onClick={handleExportCSV}
            >
              <i className="bi bi-download export-icon"></i>
              Export
            </Button>
          </div>
        </Card.Header> */}
        <div className="modern-card-header">
          <h2 className="modern-header-title">Tour Package Detail Enquiries</h2>

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
                    <th>Package</th>
                    <th>Travel Date</th>
                    <th>Adults</th>
                    <th>Children</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.length > 0 ? (
                    enquiries.map((enquiry) => (
                      <tr key={enquiry.id}>
                        <td>{enquiry.name}</td>
                        <td>{enquiry.email}</td>
                        <td>{enquiry.phone}</td>
                        <td>{enquiry.packageName || enquiry.packageId}</td>
                        <td>{formatDateForDisplay(enquiry.travelDate)}</td>
                        <td>{enquiry.adults}</td>
                        <td>{enquiry.children}</td>
                        <td>
                          <Badge
                            className={`status-badge ${getStatusBadgeClass(
                              enquiry.status
                            )}`}
                          >
                            {enquiry.status
                              ? enquiry.status.charAt(0).toUpperCase() +
                                enquiry.status.slice(1)
                              : "Pending"}
                          </Badge>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="action-btn"
                              onClick={() => handleEditClick(enquiry)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="action-btn"
                              onClick={() => handleDeleteClick(enquiry)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center">
                        No enquiries found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center mt-4 flex-column flex-md-row">
            <div className="pagination-info mb-3 mb-md-0">
              {enquiries.length > 0 && (
                <p className="text-muted">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, enquiries.length)} of{" "}
                  {enquiries.length} entries
                </p>
              )}
            </div>
            {renderPagination()}
          </div>
        </Card.Body>
      </Card>

      {/* Edit Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
        className={darkMode ? "dark-theme" : ""}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Tour Package Detail Enquiry</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Package Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="packageName"
                    value={formData.packageName}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Travel Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="travelDate"
                    value={formData.travelDate}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Adults</Form.Label>
                  <Form.Control
                    type="number"
                    name="adults"
                    value={formData.adults}
                    onChange={handleInputChange}
                    min="1"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Children</Form.Label>
                  <Form.Control
                    type="number"
                    name="children"
                    value={formData.children}
                    onChange={handleInputChange}
                    min="0"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="message"
                value={formData.message}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateEnquiry}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>

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
            Are you sure you want to delete this enquiry from{" "}
            <strong>{currentEnquiry?.name}</strong>?
          </p>
          <p className="text-danger">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteEnquiry}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TourPackageDetailEnquiries;

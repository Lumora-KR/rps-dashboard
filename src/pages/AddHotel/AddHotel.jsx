"use client";

import { useState, useEffect, useContext } from "react";
import {
  Container,
  Grid,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  Divider,
  CircularProgress,
  Rating,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  FileDownload as FileDownloadIcon,
  CalendarToday as CalendarTodayIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import axios from "axios";
import "./AddHotel.css";
import { ThemeContext } from "../../contexts/ThemeContext";

const AddHotel = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext) || {
    darkMode: false,
    toggleDarkMode: () => {},
  };

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    price: "",
    rating: 0,
    type: "",
    description: "",
    amenities: [],
    providerName: "",
    providerEmail: "",
    providerPhone: "",
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [hotelToDelete, setHotelToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const hotelTypes = [
    { value: "luxury", label: "Luxury" },
    { value: "business", label: "Business" },
    { value: "budget", label: "Budget" },
    { value: "resort", label: "Resort" },
    { value: "boutique", label: "Boutique" },
  ];

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/hotels-list");
      if (response.data.success) {
        setHotels(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching hotels:", error);
      toast.error("Failed to fetch hotels");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRatingChange = (event, newValue) => {
    setFormData((prevData) => ({
      ...prevData,
      rating: newValue,
    }));
  };

  const handleAmenitiesChange = (e) => {
    const { value } = e.target;
    const amenities = value
      .split("\n")
      .filter((amenity) => amenity.trim() !== "");
    setFormData((prevData) => ({
      ...prevData,
      amenities,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate file types
    const validFiles = files.filter(
      (file) =>
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg"
    );

    if (validFiles.length !== files.length) {
      toast.error("Only JPEG, JPG, and PNG images are allowed");
      return;
    }

    // Validate file sizes (max 5MB each)
    const validSizeFiles = validFiles.filter(
      (file) => file.size <= 5 * 1024 * 1024
    );

    if (validSizeFiles.length !== validFiles.length) {
      toast.error("Images must be less than 5MB each");
      return;
    }

    setSelectedImages([...selectedImages, ...validSizeFiles]);

    // Create preview URLs
    const newPreviewImages = validSizeFiles.map((file) =>
      URL.createObjectURL(file)
    );
    setPreviewImages([...previewImages, ...newPreviewImages]);
  };

  const removeImage = (index) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(previewImages[index]);

    const newSelectedImages = [...selectedImages];
    newSelectedImages.splice(index, 1);
    setSelectedImages(newSelectedImages);

    const newPreviewImages = [...previewImages];
    newPreviewImages.splice(index, 1);
    setPreviewImages(newPreviewImages);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      price: "",
      rating: 0,
      type: "",
      description: "",
      amenities: [],
      providerName: "",
      providerEmail: "",
      providerPhone: "",
    });
    setSelectedImages([]);
    previewImages.forEach((url) => URL.revokeObjectURL(url));
    setPreviewImages([]);
    setIsEditing(false);
    setCurrentId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedImages.length === 0 && !isEditing) {
      toast.error("Please upload at least one image of the hotel");
      return;
    }

    setLoading(true);

    try {
      // Create form data for multipart/form-data submission
      const formDataToSend = new FormData();

      // Append text fields
      formDataToSend.append("name", formData.name);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("rating", formData.rating);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("amenities", JSON.stringify(formData.amenities));
      formDataToSend.append("providerName", formData.providerName);
      formDataToSend.append("providerEmail", formData.providerEmail);
      formDataToSend.append("providerPhone", formData.providerPhone);

      // Append image files
      selectedImages.forEach((image) => {
        formDataToSend.append("images", image);
      });

      let response;
      if (isEditing) {
        // If editing, include existing images
        const hotelToEdit = hotels.find((hotel) => hotel.id === currentId);
        if (hotelToEdit && hotelToEdit.images) {
          formDataToSend.append(
            "existingImages",
            JSON.stringify(hotelToEdit.images)
          );
        }

        response = await axios.put(
          `http://localhost:5000/api/hotels-list/${currentId}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await axios.post(
          "http://localhost:5000/api/hotels-list",
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      if (response.data.success) {
        toast.success(
          isEditing
            ? "Hotel updated successfully!"
            : "Your hotel has been added successfully!"
        );

        // Reset form and fetch updated list
        resetForm();
        fetchHotels();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          `Failed to ${
            isEditing ? "update" : "add"
          } hotel. Please try again later.`
      );

      console.error(`Error ${isEditing ? "updating" : "adding"} hotel:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (hotel) => {
    setIsEditing(true);
    setCurrentId(hotel.id);

    // Set form data from hotel
    setFormData({
      name: hotel.name,
      location: hotel.location,
      price: hotel.price,
      rating: hotel.rating || 0,
      type: hotel.type,
      description: hotel.description,
      amenities: hotel.amenities || [],
      providerName: hotel.providerName,
      providerEmail: hotel.providerEmail,
      providerPhone: hotel.providerPhone,
    });

    // Clear selected images but keep existing ones for reference
    setSelectedImages([]);
    previewImages.forEach((url) => URL.revokeObjectURL(url));
    setPreviewImages([]);

    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (hotel) => {
    setHotelToDelete(hotel);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!hotelToDelete) return;

    try {
      setLoading(true);
      const response = await axios.delete(
        `http://localhost:5000/api/hotels-list/${hotelToDelete.id}`
      );

      if (response.data.success) {
        toast.success("Hotel deleted successfully");
        fetchHotels();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete hotel");
      console.error("Error deleting hotel:", error);
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setHotelToDelete(null);
    }
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setFilterPeriod(e.target.value);
    setCurrentPage(1);
  };

  const handleDateRangeFilter = () => {
    // Apply date range filter
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    // Export filtered data to CSV
    const filteredData = getFilteredHotels();
    if (filteredData.length === 0) {
      toast.info("No data to export");
      return;
    }

    // Create CSV content
    const headers = [
      "Name",
      "Location",
      "Price",
      "Type",
      "Rating",
      "Provider",
      "Email",
      "Phone",
      "Date Added",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredData.map((hotel) =>
        [
          `"${hotel.name}"`,
          `"${hotel.location}"`,
          `"₹${hotel.price}"`,
          `"${hotel.type}"`,
          `"${hotel.rating}"`,
          `"${hotel.providerName}"`,
          `"${hotel.providerEmail}"`,
          `"${hotel.providerPhone}"`,
          `"${formatDateForDisplay(hotel.createdAt)}"`,
        ].join(",")
      ),
    ].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `hotels-export-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getFilteredHotels = () => {
    return hotels.filter((hotel) => {
      // Search term filter
      const searchMatch =
        hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.providerEmail.toLowerCase().includes(searchTerm.toLowerCase());

      if (!searchMatch) return false;

      // Date filter
      const hotelDate = new Date(hotel.createdAt);
      const today = new Date();
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );
      const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

      // Reset hours to compare dates only
      today.setHours(0, 0, 0, 0);

      switch (filterPeriod) {
        case "today":
          return hotelDate >= today;
        case "month":
          return hotelDate >= firstDayOfMonth;
        case "year":
          return hotelDate >= firstDayOfYear;
        case "custom":
          const fromDate = dateRange.from ? new Date(dateRange.from) : null;
          const toDate = dateRange.to ? new Date(dateRange.to) : null;

          if (fromDate && toDate) {
            // Include the entire day for toDate
            toDate.setHours(23, 59, 59, 999);
            return hotelDate >= fromDate && hotelDate <= toDate;
          } else if (fromDate) {
            return hotelDate >= fromDate;
          } else if (toDate) {
            toDate.setHours(23, 59, 59, 999);
            return hotelDate <= toDate;
          }
          return true;
        default:
          return true;
      }
    });
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredHotels = getFilteredHotels();
  const currentItems = filteredHotels.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredHotels.length / itemsPerPage); i++) {
      pageNumbers.push(i);
    }

    if (pageNumbers.length <= 1) return null;

    return (
      <div className="pagination-container">
        <button
          className={`pagination-button ${currentPage === 1 ? "disabled" : ""}`}
          onClick={() => currentPage > 1 && paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {pageNumbers.map((number) => (
          <button
            key={number}
            className={`pagination-number ${
              currentPage === number ? "active" : ""
            }`}
            onClick={() => paginate(number)}
          >
            {number}
          </button>
        ))}

        <button
          className={`pagination-button ${
            currentPage === pageNumbers.length ? "disabled" : ""
          }`}
          onClick={() =>
            currentPage < pageNumbers.length && paginate(currentPage + 1)
          }
          disabled={currentPage === pageNumbers.length}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div
      className={`add-hotel-page ${darkMode ? "dark-theme" : "light-theme"}`}
    >
      {/* Theme Toggle */}
      <div className="theme-toggle-container">
        <button className="theme-toggle-button" onClick={toggleDarkMode}>
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </div>

      {/* Hero Banner */}
      <div className="page-hero-banner">
        <div className="page-hero-overlay"></div>
        <Container>
          <div className="page-hero-content">
            <div className="breadcrumb">
              <span>Home</span>
              <span className="separator">/</span>
              <span>Hotels</span>
              <span className="separator">/</span>
              <span className="active">Add Hotel</span>
            </div>
            <h1 className="page-hero-title">Add Your Hotel</h1>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container className="add-hotel-container">
        <Paper elevation={0} className="add-hotel-form-card">
          <Typography variant="h5" className="form-title">
            {isEditing ? "Edit Hotel" : "Hotel Details"}
          </Typography>
          <Typography variant="body1" paragraph>
            {isEditing
              ? "Update the details below to modify your hotel listing."
              : "Please fill in the details below to add your hotel to our platform."}
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" className="section-title">
                  Basic Information
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Hotel Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  required
                  className="custom-input"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  fullWidth
                  required
                  placeholder="e.g., Rameshwaram, Madurai, etc."
                  className="custom-input"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Price per Night"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  fullWidth
                  required
                  className="custom-input"
                  InputProps={{
                    startAdornment: (
                      <span
                        style={{ marginRight: "8px" }}
                        className="dollar-symbol"
                      >
                        ₹
                      </span>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Hotel Type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  fullWidth
                  required
                  className="custom-input"
                >
                  {hotelTypes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" gutterBottom>
                  Hotel Rating
                </Typography>
                <Rating
                  name="rating"
                  value={formData.rating}
                  onChange={handleRatingChange}
                  precision={0.5}
                  size="large"
                  className="custom-rating"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={4}
                  required
                  className="custom-input"
                />
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" className="section-title">
                  Hotel Images
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="edit-image-note"
                  gutterBottom
                >
                  Upload images of your hotel (PNG, JPG, JPEG only, max 5MB
                  each)
                </Typography>

                <input
                  accept="image/png, image/jpeg, image/jpg"
                  style={{ display: "none" }}
                  id="hotel-images-upload"
                  type="file"
                  multiple
                  onChange={handleImageChange}
                />
                <label htmlFor="hotel-images-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    className="upload-button"
                  >
                    Upload Images
                  </Button>
                </label>

                {previewImages.length > 0 && (
                  <div className="image-preview-container">
                    {previewImages.map((url, index) => (
                      <div key={index} className="image-preview-item">
                        <img
                          src={url || "/placeholder.svg"}
                          alt={`Preview ${index + 1}`}
                        />
                        <IconButton
                          className="remove-image-btn"
                          onClick={() => removeImage(index)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    ))}
                  </div>
                )}

                {isEditing && (
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    className="edit-image-note"
                  >
                    Note: If you don't upload new images, the existing images
                    will be kept.
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" className="section-title">
                  Hotel Amenities
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="edit-image-note"
                >
                  Enter each amenity on a new line
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Amenities"
                  value={formData.amenities.join("\n")}
                  onChange={handleAmenitiesChange}
                  fullWidth
                  multiline
                  rows={5}
                  placeholder="Free WiFi&#10;Swimming Pool&#10;Restaurant&#10;Air Conditioning&#10;Parking"
                  className="custom-input"
                />
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" className="section-title">
                  Provider Information
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Provider Name"
                  name="providerName"
                  value={formData.providerName}
                  onChange={handleChange}
                  fullWidth
                  required
                  className="custom-input"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Provider Email"
                  name="providerEmail"
                  type="email"
                  value={formData.providerEmail}
                  onChange={handleChange}
                  fullWidth
                  required
                  className="custom-input"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Provider Phone"
                  name="providerPhone"
                  value={formData.providerPhone}
                  onChange={handleChange}
                  fullWidth
                  required
                  className="custom-input"
                />
              </Grid>

              <Grid item xs={12} className="form-actions">
                {isEditing && (
                  <Button
                    type="button"
                    variant="outlined"
                    color="secondary"
                    size="large"
                    className="cancel-button"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  className="submit-button"
                  disabled={loading}
                  startIcon={
                    loading && <CircularProgress size={20} color="inherit" />
                  }
                >
                  {loading
                    ? "Submitting..."
                    : isEditing
                    ? "Update Hotel"
                    : "Add Hotel"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        {/* Hotels Table */}
        <Paper elevation={0} className="hotels-table-card">
          <div className="modern-card-header">
            <h2 className="modern-header-title">Hotel Listings</h2>

            <div className="modern-filters-container">
              <div className="modern-search-wrapper">
                <SearchIcon className="modern-search-icon" />
                <input
                  type="text"
                  className="modern-search-input"
                  placeholder="Search by name, location..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>

              <div className="modern-filter-wrapper">
                <select
                  className="modern-select"
                  value={filterPeriod}
                  onChange={handleFilterChange}
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                  <option value="custom">Custom Range</option>
                </select>
                <KeyboardArrowDownIcon className="modern-select-icon" />
              </div>

              {filterPeriod === "custom" && (
                <>
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
                </>
              )}

              <button className="modern-export-btn" onClick={handleExportCSV}>
                <FileDownloadIcon className="modern-export-icon" />
                <span className="modern-export-text">Export</span>
              </button>
            </div>
          </div>

          <div className="table-responsive">
            {loading ? (
              <div className="loading-container">
                <CircularProgress />
                <p>Loading hotels...</p>
              </div>
            ) : currentItems.length > 0 ? (
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Hotel Name</th>
                    <th>Location</th>
                    <th>Price</th>
                    <th>Type</th>
                    <th>Rating</th>
                    <th>Provider</th>
                    <th>Date Added</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((hotel) => (
                    <tr key={hotel.id}>
                      <td>{hotel.name}</td>
                      <td>{hotel.location}</td>
                      <td>₹{hotel.price}</td>
                      <td>{hotel.type}</td>
                      <td>
                        <Rating
                          value={hotel.rating || 0}
                          readOnly
                          size="small"
                          precision={0.5}
                        />
                      </td>
                      <td>
                        <div>{hotel.providerName}</div>
                        <div className="provider-contact">
                          {hotel.providerEmail}
                        </div>
                      </td>
                      <td>{formatDateForDisplay(hotel.createdAt)}</td>
                      <td>
                        <div className="table-actions">
                          <IconButton
                            className="edit-button"
                            onClick={() => handleEdit(hotel)}
                            aria-label="Edit"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            className="delete-button"
                            onClick={() => handleDelete(hotel)}
                            aria-label="Delete"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-data-message">
                <p>No hotels found</p>
              </div>
            )}
          </div>

          {renderPagination()}
        </Paper>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        className={`delete-dialog ${darkMode ? "dark-theme" : "light-theme"}`}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the hotel "{hotelToDelete?.name}"?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddHotel;

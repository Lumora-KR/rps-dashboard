"use client";

import { useState, useEffect, useContext } from "react";
import {
  Container,
  Grid,
  Typography,
  TextField,
  MenuItem,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Divider,
  CircularProgress,
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
import "./AddCarRental.css";
import { ThemeContext } from "../../contexts/ThemeContext";

const AddCarRental = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext) || {
    darkMode: false,
    toggleDarkMode: () => {},
  };

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    carType: "",
    price: "",
    priceUnit: "per day",
    seating: "",
    ac: true,
    transmission: "",
    fuel: "",
    description: "",
    features: [],
    specifications: {
      engine: "",
      mileage: "",
      transmission: "",
      fuelType: "",
      seatingCapacity: "",
      bootSpace: "",
      length: "",
      width: "",
      height: "",
    },
    providerName: "",
    providerEmail: "",
    providerPhone: "",
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [carRentals, setCarRentals] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const carTypes = [
    { value: "sedan", label: "Sedan" },
    { value: "suv", label: "SUV" },
    { value: "hatchback", label: "Hatchback" },
    { value: "tempo", label: "Tempo Traveller" },
    { value: "luxury", label: "Luxury Car" },
  ];

  const transmissionTypes = [
    { value: "Manual", label: "Manual" },
    { value: "Automatic", label: "Automatic" },
    { value: "Semi-Automatic", label: "Semi-Automatic" },
  ];

  const fuelTypes = [
    { value: "Petrol", label: "Petrol" },
    { value: "Diesel", label: "Diesel" },
    { value: "Electric", label: "Electric" },
    { value: "Hybrid", label: "Hybrid" },
    { value: "CNG", label: "CNG" },
  ];

  useEffect(() => {
    fetchCarRentals();
  }, []);

  const fetchCarRentals = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/car-rentals");
      if (response.data.success) {
        setCarRentals(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching car rentals:", error);
      toast.error("Failed to fetch car rentals");
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

  const handleSpecificationChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      specifications: {
        ...prevData.specifications,
        [name]: value,
      },
    }));
  };

  const handleFeatureChange = (e) => {
    const { value } = e.target;
    const features = value
      .split("\n")
      .filter((feature) => feature.trim() !== "");
    setFormData((prevData) => ({
      ...prevData,
      features,
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
      title: "",
      carType: "",
      price: "",
      priceUnit: "per day",
      seating: "",
      ac: true,
      transmission: "",
      fuel: "",
      description: "",
      features: [],
      specifications: {
        engine: "",
        mileage: "",
        transmission: "",
        fuelType: "",
        seatingCapacity: "",
        bootSpace: "",
        length: "",
        width: "",
        height: "",
      },
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
      toast.error("Please upload at least one image of the car");
      return;
    }

    setLoading(true);

    try {
      // Create form data for multipart/form-data submission
      const formDataToSend = new FormData();

      // Append text fields
      formDataToSend.append("title", formData.title);
      formDataToSend.append("carType", formData.carType);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("priceUnit", formData.priceUnit);
      formDataToSend.append("seating", formData.seating);
      formDataToSend.append("ac", formData.ac);
      formDataToSend.append("transmission", formData.transmission);
      formDataToSend.append("fuel", formData.fuel);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("features", JSON.stringify(formData.features));
      formDataToSend.append(
        "specifications",
        JSON.stringify(formData.specifications)
      );
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
        const carToEdit = carRentals.find((car) => car.id === currentId);
        if (carToEdit && carToEdit.images) {
          formDataToSend.append(
            "existingImages",
            JSON.stringify(carToEdit.images)
          );
        }

        response = await axios.put(
          `/api/car-rentals/${currentId}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await axios.post(
          "/api/car-rentals",
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
            ? "Car rental updated successfully!"
            : "Your car rental has been added successfully!"
        );

        // Reset form and fetch updated list
        resetForm();
        fetchCarRentals();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          `Failed to ${
            isEditing ? "update" : "add"
          } car rental. Please try again later.`
      );

      console.error(
        `Error ${isEditing ? "updating" : "adding"} car rental:`,
        error
      );
      sole.error(
        `Error ${isEditing ? "updating" : "adding"} car rental:`,
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (car) => {
    setIsEditing(true);
    setCurrentId(car.id);

    // Set form data from car
    setFormData({
      title: car.title,
      carType: car.carType,
      price: car.price,
      priceUnit: car.priceUnit || "per day",
      seating: car.seating,
      ac: car.ac,
      transmission: car.transmission,
      fuel: car.fuel,
      description: car.description,
      features: car.features || [],
      specifications: car.specifications || {
        engine: "",
        mileage: "",
        transmission: "",
        fuelType: "",
        seatingCapacity: "",
        bootSpace: "",
        length: "",
        width: "",
        height: "",
      },
      providerName: car.providerName,
      providerEmail: car.providerEmail,
      providerPhone: car.providerPhone,
    });

    // Clear selected images but keep existing ones for reference
    setSelectedImages([]);
    previewImages.forEach((url) => URL.revokeObjectURL(url));
    setPreviewImages([]);

    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (car) => {
    setCarToDelete(car);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!carToDelete) return;

    try {
      setLoading(true);
      const response = await axios.delete(
        `/api/car-rentals/${carToDelete.id}`
      );

      if (response.data.success) {
        toast.success("Car rental deleted successfully");
        fetchCarRentals();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to delete car rental"
      );
      console.error("Error deleting car rental:", error);
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setCarToDelete(null);
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
    const filteredData = getFilteredCarRentals();
    if (filteredData.length === 0) {
      toast.info("No data to export");
      return;
    }

    // Create CSV content
    const headers = [
      "Title",
      "Type",
      "Price",
      "Provider",
      "Email",
      "Phone",
      "Date Added",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredData.map((car) =>
        [
          `"${car.title}"`,
          `"${car.carType}"`,
          `"₹${car.price} ${car.priceUnit}"`,
          `"${car.providerName}"`,
          `"${car.providerEmail}"`,
          `"${car.providerPhone}"`,
          `"${formatDateForDisplay(car.createdAt)}"`,
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
      `car-rentals-export-${new Date().toISOString().slice(0, 10)}.csv`
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

  const getFilteredCarRentals = () => {
    return carRentals.filter((car) => {
      // Search term filter
      const searchMatch =
        car.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.providerEmail.toLowerCase().includes(searchTerm.toLowerCase());

      if (!searchMatch) return false;

      // Date filter
      const carDate = new Date(car.createdAt);
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
          return carDate >= today;
        case "month":
          return carDate >= firstDayOfMonth;
        case "year":
          return carDate >= firstDayOfYear;
        case "custom":
          const fromDate = dateRange.from ? new Date(dateRange.from) : null;
          const toDate = dateRange.to ? new Date(dateRange.to) : null;

          if (fromDate && toDate) {
            // Include the entire day for toDate
            toDate.setHours(23, 59, 59, 999);
            return carDate >= fromDate && carDate <= toDate;
          } else if (fromDate) {
            return carDate >= fromDate;
          } else if (toDate) {
            toDate.setHours(23, 59, 59, 999);
            return carDate <= toDate;
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
  const filteredCarRentals = getFilteredCarRentals();
  const currentItems = filteredCarRentals.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPagination = () => {
    const pageNumbers = [];
    for (
      let i = 1;
      i <= Math.ceil(filteredCarRentals.length / itemsPerPage);
      i++
    ) {
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
      className={`add-car-rental-page ${
        darkMode ? "dark-theme" : "light-theme"
      }`}
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
              <span>Car Rental</span>
              <span className="separator">/</span>
              <span className="active">Add Car Rental</span>
            </div>
            <h1 className="page-hero-title">Add Your Car Rental</h1>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container className="add-car-rental-container">
        <Paper elevation={0} className="add-car-rental-form-card">
          <Typography variant="h5" className="form-title">
            {isEditing ? "Edit Car Rental" : "Car Rental Details"}
          </Typography>
          <Typography variant="body1" paragraph>
            {isEditing
              ? "Update the details below to modify your car rental listing."
              : "Please fill in the details below to add your car rental to our platform."}
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
                  label="Car Model/Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  fullWidth
                  required
                  className="custom-input"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Car Type"
                  name="carType"
                  value={formData.carType}
                  onChange={handleChange}
                  fullWidth
                  required
                  className="custom-input"
                >
                  {carTypes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Price"
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
                  label="Price Unit"
                  name="priceUnit"
                  value={formData.priceUnit}
                  onChange={handleChange}
                  fullWidth
                  required
                  className="custom-input"
                >
                  <MenuItem value="per day">Per Day</MenuItem>
                  <MenuItem value="per week">Per Week</MenuItem>
                  <MenuItem value="per month">Per Month</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Seating Capacity"
                  name="seating"
                  value={formData.seating}
                  onChange={handleChange}
                  fullWidth
                  required
                  placeholder="e.g., 4 Seater"
                  className="custom-input"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  select
                  label="Transmission"
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  fullWidth
                  required
                  className="custom-input"
                >
                  {transmissionTypes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  select
                  label="Fuel Type"
                  name="fuel"
                  value={formData.fuel}
                  onChange={handleChange}
                  fullWidth
                  required
                  className="custom-input"
                >
                  {fuelTypes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.ac}
                      onChange={(e) =>
                        setFormData({ ...formData, ac: e.target.checked })
                      }
                      name="ac"
                      color="primary"
                      className="custom-checkbox"
                    />
                  }
                  label="Air Conditioning"
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
                  Car Images
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="edit-image-note"
                  gutterBottom
                >
                  Upload images of your car (PNG, JPG, JPEG only, max 5MB each)
                </Typography>

                <input
                  accept="image/png, image/jpeg, image/jpg"
                  style={{ display: "none" }}
                  id="car-images-upload"
                  type="file"
                  multiple
                  onChange={handleImageChange}
                />
                <label htmlFor="car-images-upload">
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
                  Car Features
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="edit-image-note"
                >
                  Enter each feature on a new line
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Features"
                  value={formData.features.join("\n")}
                  onChange={handleFeatureChange}
                  fullWidth
                  multiline
                  rows={5}
                  placeholder="Power Steering&#10;Power Windows&#10;Air Conditioning&#10;Heater&#10;Stereo"
                  className="custom-input"
                />
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" className="section-title">
                  Car Specifications
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Engine"
                  name="engine"
                  value={formData.specifications.engine}
                  onChange={handleSpecificationChange}
                  fullWidth
                  placeholder="e.g., 1.5L Petrol"
                  className="custom-input"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Mileage"
                  name="mileage"
                  value={formData.specifications.mileage}
                  onChange={handleSpecificationChange}
                  fullWidth
                  placeholder="e.g., 15-18 km/l"
                  className="custom-input"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Seating Capacity"
                  name="seatingCapacity"
                  value={formData.specifications.seatingCapacity}
                  onChange={handleSpecificationChange}
                  fullWidth
                  placeholder="e.g., 5 Persons"
                  className="custom-input"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Boot Space"
                  name="bootSpace"
                  value={formData.specifications.bootSpace}
                  onChange={handleSpecificationChange}
                  fullWidth
                  placeholder="e.g., 300 liters"
                  className="custom-input"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Length"
                  name="length"
                  value={formData.specifications.length}
                  onChange={handleSpecificationChange}
                  fullWidth
                  placeholder="e.g., 4500 mm"
                  className="custom-input"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Width"
                  name="width"
                  value={formData.specifications.width}
                  onChange={handleSpecificationChange}
                  fullWidth
                  placeholder="e.g., 1800 mm"
                  className="custom-input"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Height"
                  name="height"
                  value={formData.specifications.height}
                  onChange={handleSpecificationChange}
                  fullWidth
                  placeholder="e.g., 1500 mm"
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
                    ? "Update Car Rental"
                    : "Add Car Rental"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        {/* Car Rentals Table */}
        <Paper elevation={0} className="car-rentals-table-card">
          <div className="modern-card-header">
            <h2 className="modern-header-title">Car Rental Listings</h2>

            <div className="modern-filters-container">
              <div className="modern-search-wrapper">
                <SearchIcon className="modern-search-icon" />
                <input
                  type="text"
                  className="modern-search-input"
                  placeholder="Search by title, provider..."
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
                <p>Loading car rentals...</p>
              </div>
            ) : currentItems.length > 0 ? (
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Car Model</th>
                    <th>Type</th>
                    <th>Price</th>
                    <th>Provider</th>
                    <th>Contact</th>
                    <th>Date Added</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((car) => (
                    <tr key={car.id}>
                      <td>{car.title}</td>
                      <td>{car.carType}</td>
                      <td>
                        ₹{car.price} {car.priceUnit}
                      </td>
                      <td>{car.providerName}</td>
                      <td>
                        <div>{car.providerEmail}</div>
                        <div>{car.providerPhone}</div>
                      </td>
                      <td>{formatDateForDisplay(car.createdAt)}</td>
                      <td>
                        <div className="table-actions">
                          <IconButton
                            className="edit-button"
                            onClick={() => handleEdit(car)}
                            aria-label="Edit"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            className="delete-button"
                            onClick={() => handleDelete(car)}
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
                <p>No car rentals found</p>
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
            Are you sure you want to delete the car rental "{carToDelete?.title}
            "? This action cannot be undone.
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

export default AddCarRental;

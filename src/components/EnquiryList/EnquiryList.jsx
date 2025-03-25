"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, Search } from "react-feather";
import "./EnquiryList.css";

const EnquiryList = ({ data, title, type }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Toggle expanded row
  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Filter data based on search term
  const filteredData = data.filter((item) => {
    const searchString = searchTerm.toLowerCase();
    return (
      (item.name && item.name.toLowerCase().includes(searchString)) ||
      (item.email && item.email.toLowerCase().includes(searchString)) ||
      (item.phone && item.phone.toLowerCase().includes(searchString))
    );
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Format date
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy HH:mm");
    } catch (error) {
      return "Invalid date";
    }
  };

  // Render table headers based on enquiry type
  const renderTableHeaders = () => {
    const commonHeaders = (
      <>
        <th scope="col">Name</th>
        <th scope="col">Email</th>
        <th scope="col">Phone</th>
        <th scope="col">Date</th>
        <th scope="col">Actions</th>
      </>
    );

    switch (type) {
      case "tourPackage":
        return <>{commonHeaders}</>;
      case "tourPackageDetail":
        return <>{commonHeaders}</>;
      case "carRentalDetail":
        return <>{commonHeaders}</>;
      case "contactForm":
        return <>{commonHeaders}</>;
      default:
        return commonHeaders;
    }
  };

  // Render expanded row content based on enquiry type
  const renderExpandedContent = (item) => {
    switch (type) {
      case "tourPackage":
        return (
          <div className="expanded-content">
            <div className="row">
              <div className="col-md-6">
                <h5>Customer Information</h5>
                <p>
                  <strong>Name:</strong> {item.name}
                </p>
                <p>
                  <strong>Email:</strong> {item.email}
                </p>
                <p>
                  <strong>Phone:</strong> {item.phone}
                </p>
              </div>
              <div className="col-md-6">
                <h5>Tour Package Details</h5>
                <p>
                  <strong>Package Type:</strong> {item.packageType || "N/A"}
                </p>
                <p>
                  <strong>Travel Date:</strong>{" "}
                  {item.travelDate ? formatDate(item.travelDate) : "N/A"}
                </p>
                <p>
                  <strong>Duration:</strong> {item.duration || "N/A"}
                </p>
                <p>
                  <strong>Travelers:</strong> {item.travelers || "N/A"}
                </p>
              </div>
            </div>
          </div>
        );
      case "tourPackageDetail":
        return (
          <div className="expanded-content">
            <div className="row">
              <div className="col-md-6">
                <h5>Customer Information</h5>
                <p>
                  <strong>Name:</strong> {item.name}
                </p>
                <p>
                  <strong>Email:</strong> {item.email}
                </p>
                <p>
                  <strong>Phone:</strong> {item.phone}
                </p>
              </div>
              <div className="col-md-6">
                <h5>Booking Details</h5>
                <p>
                  <strong>Package ID:</strong> {item.packageId || "N/A"}
                </p>
                <p>
                  <strong>Package Name:</strong> {item.packageName || "N/A"}
                </p>
                <p>
                  <strong>Travel Date:</strong>{" "}
                  {item.selectedDate ? formatDate(item.selectedDate) : "N/A"}
                </p>
                <p>
                  <strong>Adults:</strong> {item.adults || "1"}
                </p>
                <p>
                  <strong>Children:</strong> {item.children || "0"}
                </p>
                <p>
                  <strong>Special Requirements:</strong>{" "}
                  {item.message || "None"}
                </p>
              </div>
            </div>
          </div>
        );
      case "carRentalDetail":
        return (
          <div className="expanded-content">
            <div className="row">
              <div className="col-md-6">
                <h5>Customer Information</h5>
                <p>
                  <strong>Name:</strong> {item.name}
                </p>
                <p>
                  <strong>Email:</strong> {item.email}
                </p>
                <p>
                  <strong>Phone:</strong> {item.phone}
                </p>
              </div>
              <div className="col-md-6">
                <h5>Rental Details</h5>
                <p>
                  <strong>Car ID:</strong> {item.carId || "N/A"}
                </p>
                <p>
                  <strong>Car Name:</strong> {item.carName || "N/A"}
                </p>
                <p>
                  <strong>Pickup Date:</strong>{" "}
                  {item.pickupDate ? formatDate(item.pickupDate) : "N/A"}
                </p>
                <p>
                  <strong>Return Date:</strong>{" "}
                  {item.returnDate ? formatDate(item.returnDate) : "N/A"}
                </p>
                <p>
                  <strong>Pickup Location:</strong>{" "}
                  {item.pickupLocation || "N/A"}
                </p>
                <p>
                  <strong>Return Location:</strong>{" "}
                  {item.returnLocation || "N/A"}
                </p>
                <p>
                  <strong>Special Requirements:</strong>{" "}
                  {item.message || "None"}
                </p>
              </div>
            </div>
          </div>
        );
      case "contactForm":
        return (
          <div className="expanded-content">
            <div className="row">
              <div className="col-md-6">
                <h5>Contact Information</h5>
                <p>
                  <strong>Name:</strong> {item.name}
                </p>
                <p>
                  <strong>Email:</strong> {item.email}
                </p>
                <p>
                  <strong>Phone:</strong> {item.phone}
                </p>
                <p>
                  <strong>Subject:</strong> {item.subject || "N/A"}
                </p>
              </div>
              <div className="col-md-6">
                <h5>Message</h5>
                <p>{item.message || "No message provided"}</p>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="expanded-content">
            <p>No additional details available</p>
          </div>
        );
    }
  };

  return (
    <div className="enquiry-list-container">
      <div className="enquiry-list-header">
        <h3 className="enquiry-list-title">{title}</h3>
        <div className="enquiry-list-search">
          <div className="search-input-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="form-control search-input"
              placeholder="Search by name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredData.length === 0 ? (
        <div className="no-data-message">
          <p>No enquiries found</p>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table enquiry-table">
              <thead>
                <tr>{renderTableHeaders()}</tr>
              </thead>
              <tbody>
                {currentItems.map((item) => (
                  <React.Fragment key={item.id}>
                    <tr
                      className={expandedId === item.id ? "expanded-row" : ""}
                    >
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.phone}</td>
                      <td>{formatDate(item.createdAt)}</td>
                      <td>
                        <button
                          className="expand-button"
                          onClick={() => toggleExpand(item.id)}
                        >
                          {expandedId === item.id ? (
                            <ChevronUp size={18} />
                          ) : (
                            <ChevronDown size={18} />
                          )}
                        </button>
                      </td>
                    </tr>
                    {expandedId === item.id && (
                      <tr className="details-row">
                        <td colSpan="5">{renderExpandedContent(item)}</td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination-container">
              <ul className="pagination">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>

                {[...Array(totalPages).keys()].map((number) => (
                  <li
                    key={number + 1}
                    className={`page-item ${
                      currentPage === number + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(number + 1)}
                    >
                      {number + 1}
                    </button>
                  </li>
                ))}

                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EnquiryList;
